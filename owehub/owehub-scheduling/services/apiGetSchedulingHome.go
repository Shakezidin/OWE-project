/**************************************************************************
 * File            : apiGetSchedulingHome.go
 * DESCRIPTION     : This file contains functions for get ScheduleData handler
 * DATE            : 16-Aug-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	"OWEApp/shared/googlemaps"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:         HandleGetSchedulingHome
 * DESCRIPTION:      handler for get ScheduleData request
 * INPUT:            resp, req
 * RETURNS:          void
 ******************************************************************************/
func HandleGetSchedulingHome(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		dataReq             models.GetSchedulingHomeRequest
		apiResp             models.GetSchedulingHomeList
		scheduleDataQuery   string
		scheduleDataRecords []map[string]interface{}
		travelQueueItems    map[string]bool
		recordCount         int64
	)

	log.EnterFn(0, "HandleGetSchedulingHome")
	defer func() { log.ExitFn(0, "HandleGetSchedulingHome", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get ScheduleData data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get ScheduleData data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get ScheduleData data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get LeaderBoard data Request body", http.StatusBadRequest, nil)
		return
	}

	scheduleDataQuery = fmt.Sprintf(`
		SELECT 
			home_owner, 
			customer_email,
			customer_phone_number,
			system_size,
			address,
			contract_date
		 FROM CONSOLIDATED_DATA_VIEW
		 WHERE
		 	contract_date IS NOT NULL 
		 	AND site_survey_scheduled_date IS NULL
		 ORDER BY 
			contract_date %s`,
		dataReq.Order,
	)

	scheduleDataRecords, err = db.ReteriveFromDB(db.RowDataDBIndex, scheduleDataQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get schedule data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get schedule data from DB", http.StatusBadRequest, nil)
		return
	}

	priorityTime := time.Now().Add(-36 * time.Hour) // contracts before this time are "priority"

	travelQueueItems, err = getTravelQueue(scheduleDataRecords)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get travel queue data err: %v", err)
		travelQueueItems = map[string]bool{}
	}

	for _, record := range scheduleDataRecords {
		// Home Owner Name
		homeOwner, ok := record["home_owner"].(string)
		if !ok || homeOwner == "" {
			log.FuncErrorTrace(0, "Failed to get home owner name for Record: %v", record)
			continue
		}

		// Email
		customerEmail, ok := record["customer_email"].(string)
		if !ok || customerEmail == "" {
			log.FuncErrorTrace(0, "Failed to get customer email for Record: %v", record)
			continue
		}

		// Phone Number
		customerPhoneNumber, ok := record["customer_phone_number"].(string)
		if !ok || customerPhoneNumber == "" {
			log.FuncErrorTrace(0, "Failed to get customer phone number for Home Owner: %v, Item: %+v", homeOwner, record)
			customerPhoneNumber = ""
		}

		// System Size
		systemSize, ok := record["system_size"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get system size for Home Owner: %v, Item: %+v", homeOwner, record)
			systemSize = 0.0
		}

		// Address
		address, ok := record["address"].(string)
		if !ok || address == "" {
			log.FuncErrorTrace(0, "Failed to get address for Home Owner: %v, Item: %+v", homeOwner, record)
			address = ""
		}

		// Contract Date
		contractDate, ok := record["contract_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get contract date for Home Owner: %v, Item: %+v", homeOwner, record)
			contractDate = time.Time{}
		}

		itemQueue := "regular" // item belongs to regular queue by default

		item := models.GetSchedulingHome{
			HomeOwner:           homeOwner,
			RoofType:            "XYZ",
			CustomerEmail:       customerEmail,
			CustomerPhoneNumber: customerPhoneNumber,
			SystemSize:          systemSize,
			Address:             address,
		}

		// Job is in travel queue if travelQueueItems contains this address
		if _, ok := travelQueueItems[address]; ok {
			itemQueue = "travel"
		}

		// Job is in priority if:
		// 1. More than 36 hours have been passed since contract
		// TODO: More conditions for priority job
		if contractDate.Before(priorityTime) {
			itemQueue = "priority"
		}

		// push the item if desired queue is selected
		if dataReq.Queue == itemQueue {
			apiResp.SchedulingHomeList = append(apiResp.SchedulingHomeList, item)
		}
	}

	apiResp.SchedulingHomeList = StaticPaginate(apiResp.SchedulingHomeList, dataReq.PageNumber, dataReq.PageSize)

	recordCount = int64(len(apiResp.SchedulingHomeList))
	log.FuncInfoTrace(0, "Number of ScheduleData fetched : %v list %+v", recordCount, apiResp.SchedulingHomeList)
	FormAndSendHttpResp(resp, "ScheduleData", http.StatusOK, apiResp, recordCount)
}

/******************************************************************************
 * FUNCTION:         getTravelQueue
 * DESCRIPTION:      Get maping of addresses to whether they're more than
 *					 100 miles away from any of warehouses
 *
 * INPUT:            homeownerRecords
 * RETURNS:          travelQueue, error
 ******************************************************************************/
func getTravelQueue(homeownerRecords []map[string]interface{}) (travelQueue map[string]bool, err error) {
	var (
		existingAddresses         string
		whereEleList              []interface{}
		newAddressesQuery         string
		newAddressesRecords       []map[string]interface{}
		warehouseAddressesRecords []map[string]interface{}
		routeMatrixResp           *googlemaps.RouteMatrixResp
		groupingRecords           []map[string]interface{}
	)

	log.EnterFn(0, "getTravelQueue")
	defer func() { log.ExitFn(0, "getTravelQueue", err) }()

	if len(homeownerRecords) == 0 {
		return map[string]bool{}, nil
	}

	for i, record := range homeownerRecords {
		address, ok := record["address"].(string)
		if !ok || address == "" {
			log.FuncErrorTrace(0, "Failed to get address for record: %+v", record)
			continue
		}

		if i != 0 {
			existingAddresses += ", "
		}

		whereEleList = append(whereEleList, address)
		existingAddresses = fmt.Sprintf("%s($%d, 'homeowner')", existingAddresses, len(whereEleList))
	}

	newAddressesQuery = fmt.Sprintf(`
		SELECT e.* 
		FROM (VALUES %s) e(address, type) 
		WHERE NOT EXISTS (
			SELECT 1 FROM scheduling_locations sl WHERE sl.type = 'homeowner' AND sl.address = e.address
		)`,
		existingAddresses,
	)

	newAddressesRecords, err = db.ReteriveFromDB(db.OweHubDbIndex, newAddressesQuery, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get new addresses from DB err: %v", err)
		return nil, err
	}

	// if any new addresses found, hit googlemaps api & update the db
	if len(newAddressesRecords) > 0 {
		warehouseAddressesRecords, err = db.ReteriveFromDB(
			db.OweHubDbIndex,
			"SELECT address FROM scheduling_locations WHERE type = 'warehouse'",
			nil,
		)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get warehouse addresses from DB err: %v", err)
			return nil, err
		}

		origins := []googlemaps.RouteMatrixReqItem{}      // homeowner addresses
		destinations := []googlemaps.RouteMatrixReqItem{} // warehouse addresses

		for _, record := range newAddressesRecords {
			address, ok := record["address"].(string)
			if !ok || address == "" {
				log.FuncErrorTrace(0, "Failed to get address for new address record: %+v", record)
				continue
			}

			origins = append(origins, googlemaps.RouteMatrixReqItem{
				Waypoint: googlemaps.RouteMatrixReqWaypoint{
					Address: &address,
				},
			})
		}
		for _, record := range warehouseAddressesRecords {
			address, ok := record["address"].(string)
			if !ok || address == "" {
				log.FuncErrorTrace(0, "Failed to get address for warehouse record: %+v", record)
				continue
			}

			destinations = append(destinations, googlemaps.RouteMatrixReqItem{
				Waypoint: googlemaps.RouteMatrixReqWaypoint{
					Address: &address,
				},
			})
		}

		routeMatrixResp, err = googlemaps.CallRouteMatrixApi(&googlemaps.RouteMatrixReq{
			Origins:           origins,
			Destinations:      destinations,
			TravelMode:        "DRIVE",
			RoutingPreference: "TRAFFIC_AWARE",
		})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to hit googlemaps api err: %v", err)
			return nil, err
		}

		// insert new location
		err = db.AddMultipleRecordInDB(db.OweHubDbIndex, "scheduling_locations", newAddressesRecords)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to insert new addresses into DB err: %v", err)
			return nil, err
		}

		// insert routes
		routeItems := make([]map[string]interface{}, 0)
		for _, item := range *routeMatrixResp {
			homeownerAddress := *origins[item.OriginIndex].Waypoint.Address
			warehouseAddress := *destinations[item.DestinationIndex].Waypoint.Address

			routeItems = append(routeItems, map[string]interface{}{
				"homeowner_location_address": homeownerAddress,
				"warehouse_location_address": warehouseAddress,
				"distance_meters":            item.DistanceMeters,
				"duration":                   item.Duration,
			})
		}
		err = db.AddMultipleRecordInDB(db.OweHubDbIndex, "scheduling_locations", routeItems)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get new scheduling location records into DB err: %v", err)
			return nil, err
		}
	}

	groupingQuery := `
		SELECT homeowner_location_address, min(distance_meters) 
		FROM scheduling_routes 
		GROUP BY homeowner_location_address`

	groupingRecords, err = db.ReteriveFromDB(db.OweHubDbIndex, groupingQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to execute get address grouping from DB err: %v", err)
		return nil, err
	}

	travelQueue = map[string]bool{}

	for _, record := range groupingRecords {
		address, ok := record["homeowner_location_address"].(string)
		if !ok || address == "" {
			log.FuncErrorTrace(0, "Failed to get homeowner_location_address for group record: %+v", record)
			continue
		}

		minDistMeters, ok := record["min"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get min for group record: %+v", record)
			continue
		}

		minDistMiles := minDistMeters / 1609

		if minDistMiles > 100 {
			travelQueue[address] = true
		}
	}

	return travelQueue, nil
}
