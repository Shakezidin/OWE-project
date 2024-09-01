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
	"sync"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:         HandleGetSchedulingHomeRequest
 * DESCRIPTION:      handler for get ScheduleData request
 * INPUT:            resp, req
 * RETURNS:          void
 ******************************************************************************/
func HandleGetSchedulingHomeRequest(resp http.ResponseWriter, req *http.Request) {
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
		FormAndSendHttpResp(resp, "Failed to unmarshal request body", http.StatusBadRequest, nil)
		return
	}

	if dataReq.Queue == "priority" {
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
				AND home_owner IS NOT NULL
				AND customer_email IS NOT NULL
				AND address IS NOT NULL
				AND address != ''
				AND contract_date < NOW() - INTERVAL '36 HOURS'
			ORDER BY 
				contract_date %s
			LIMIT %d
			OFFSET %d
			`,
			dataReq.Order,
			dataReq.PageNumber,
			(dataReq.PageNumber-1)*dataReq.PageSize,
		)
	}

	if dataReq.Queue == "travel" || dataReq.Queue == "regular" {
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
			AND home_owner IS NOT NULL
			AND customer_email IS NOT NULL
			AND address IS NOT NULL
			AND address != ''
			AND contract_date >= NOW() - INTERVAL '36 HOURS'
		ORDER BY 
			contract_date %s
		`,
			dataReq.Order,
		)
	}

	scheduleDataRecords, err = db.ReteriveFromDB(db.RowDataDBIndex, scheduleDataQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get schedule data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get schedule data from DB", http.StatusBadRequest, nil)
		return
	}

	// compute travel queue only when necessary
	if dataReq.Queue == "travel" || dataReq.Queue == "regular" {
		travelQueueItems, err = getTravelQueue(scheduleDataRecords)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get travel queue data err: %v", err)
			travelQueueItems = map[string]bool{}
		}
	}

	apiResp.SchedulingHomeList = []models.GetSchedulingHome{}

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

		item := models.GetSchedulingHome{
			HomeOwner:           homeOwner,
			RoofType:            "XYZ",
			CustomerEmail:       customerEmail,
			CustomerPhoneNumber: customerPhoneNumber,
			SystemSize:          systemSize,
			Address:             address,
		}

		if dataReq.Queue == "priority" {
			apiResp.SchedulingHomeList = append(apiResp.SchedulingHomeList, item)
			continue
		}

		_, isTravel := travelQueueItems[address]

		if dataReq.Queue == "travel" && isTravel {
			apiResp.SchedulingHomeList = append(apiResp.SchedulingHomeList, item)
		}

		if dataReq.Queue == "regular" && !isTravel {
			apiResp.SchedulingHomeList = append(apiResp.SchedulingHomeList, item)
		}
	}

	// priority queue already paginated, so static pagination not required
	if dataReq.Queue == "regular" || dataReq.Queue == "travel" {
		apiResp.SchedulingHomeList = StaticPaginate(apiResp.SchedulingHomeList, dataReq.PageNumber, dataReq.PageSize)
	}

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
		mutex                     sync.Mutex
		warehouseAddressesRecords []map[string]interface{}
	)

	log.EnterFn(0, "getTravelQueue")
	defer func() { log.ExitFn(0, "getTravelQueue", err) }()

	warehouseAddressesRecords, err = db.ReteriveFromDB(
		db.OweHubDbIndex,
		"SELECT address FROM scheduling_locations WHERE type = 'warehouse'",
		nil,
	)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get warehouse addresses from DB err: %v", err)
		return nil, err
	}

	destinations := []googlemaps.RouteMatrixReqItem{} // warehouse addresses

	for _, record := range warehouseAddressesRecords {
		address, ok := record["address"].(string)
		if !ok || address == "" {
			log.FuncErrorTrace(0, "Failed to get address for record: %+v", record)
			continue
		}

		destinations = append(destinations, googlemaps.RouteMatrixReqItem{
			Waypoint: googlemaps.RouteMatrixReqWaypoint{Address: &address},
		})
	}

	originChunks := Chunkify(homeownerRecords, 25)
	destChunks := Chunkify(destinations, 25)
	originWg := sync.WaitGroup{}

	travelQueue = make(map[string]bool)

	for originIndex := range originChunks {
		originWg.Add(1)
		destWg := sync.WaitGroup{}

		go func(originChunk []map[string]interface{}) {
			defer originWg.Done()

			origins := []googlemaps.RouteMatrixReqItem{}

			for _, record := range originChunk {
				address, ok := record["address"].(string)
				if !ok || address == "" {
					log.FuncErrorTrace(0, "Failed to get address for record: %+v", record)
					continue
				}

				origins = append(origins, googlemaps.RouteMatrixReqItem{
					Waypoint: googlemaps.RouteMatrixReqWaypoint{Address: &address},
				})
			}

			for destIndex := range destChunks {
				destWg.Add(1)
				go func(destinations []googlemaps.RouteMatrixReqItem) {
					defer destWg.Done()

					resp, err := googlemaps.CallRouteMatrixApi(&googlemaps.RouteMatrixReq{
						Origins:      origins,
						Destinations: destinations,
						TravelMode:   "DRIVE",
					})
					if err != nil {
						log.FuncErrorTrace(0, "Failed to hit googlemaps api err: %v", err)
						return
					}

					for _, item := range *resp {
						homeownerAddr := *origins[item.OriginIndex].Waypoint.Address
						mutex.Lock()
						if item.DistanceMeters >= 160934 { // 100 miles
							travelQueue[homeownerAddr] = true
						}
						mutex.Unlock()
					}

				}(destChunks[destIndex])
			}
			destWg.Wait()
		}(originChunks[originIndex])
	}

	originWg.Wait()
	return travelQueue, nil
}
