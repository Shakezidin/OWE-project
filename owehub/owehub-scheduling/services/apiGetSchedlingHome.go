/**************************************************************************
* File			: apiApAdvArchive.go
* DESCRIPTION	: This file contains functions for  appt setters archive handler
* DATE			: 01-Apr-2024
**************************************************************************/

package services

import (
	// db "OWEApp/shared/db"

	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

/******************************************************************************
 * FUNCTION:		HandleApAdvArchiveRequest
 * DESCRIPTION:     handler for  ApAdv Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleSchedulingHome(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.DataRequestBody
		data        []map[string]interface{}
		SaleRepList []interface{}
		// whereEleList    []interface{}
		// query string
		// queryWithFiler  string
		// queryForAlldata string
		// filter      string
		dealerName       interface{}
		rgnSalesMgrCheck bool
		RecordCount      int64
	)

	log.EnterFn(0, "HandleGetSchedulingHomeDataRequest")
	defer func() { log.ExitFn(0, "HandleGetSchedulingHomeDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get schedule data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get schedule data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get schedule data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get schedule data Request body", http.StatusBadRequest, nil)
		return
	}

	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()
	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	if len(data) > 0 {
		role := data[0]["role_name"]
		name := data[0]["name"]
		dealerName = data[0]["dealer_name"]
		rgnSalesMgrCheck = false
		dataReq.DealerName = dealerName

		switch role {
		case "Admin", "Finance Admin":
			// filter, whereEleList = PrepareAdminDlrFilters(tableName, dataReq, true, false, false)
		case "Dealer Owner":
			// filter, whereEleList = PrepareAdminDlrFilters(tableName, dataReq, false, false, false)
		case "Sale Representative":
			SaleRepList = append(SaleRepList, name)
			// filter, whereEleList = PrepareSaleRepFilters(tableName, dataReq, SaleRepList)
		// this is for the roles regional manager and sales manager
		default:
			rgnSalesMgrCheck = true
		}
	} else {
		log.FuncErrorTrace(0, "Failed to get PerfomanceProjectStatus data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get PerfomanceProjectStatus data", http.StatusBadRequest, nil)
		return
	}

	if rgnSalesMgrCheck {
		// data, err = db.ReteriveFromDB(db.OweHubDbIndex, allSaleRepQuery, whereEleList)

		// This is thrown if no sale rep are available and for other user roles
		if len(data) == 0 {
			emptyPerfomanceList := models.PerfomanceListResponse{
				PerfomanceList: []models.PerfomanceResponse{},
			}
			log.FuncErrorTrace(0, "No projects or sale representatives: %v", err)
			FormAndSendHttpResp(resp, "No projects or sale representatives", http.StatusOK, emptyPerfomanceList, int64(len(data)))
			return
		}

		// this loops through sales rep under regional or sales manager
		for _, item := range data {
			SaleRepName, Ok := item["name"]
			if !Ok || SaleRepName == "" {
				log.FuncErrorTrace(0, "Failed to get name. Item: %+v\n", item)
				continue
			}
			SaleRepList = append(SaleRepList, SaleRepName)
		}

		dealerName = data[0]["dealer_name"]
		dataReq.DealerName = dealerName
		// filter, whereEleList = PrepareSaleRepFilters(tableName, dataReq, SaleRepList)
	}

	// tableName := db.ViewName_ConsolidatedDataView
	// query = `SELECT
	//  roof_type, home_owner, customer_email, customer_phone_number, system_size, address
	//  FROM ` + db.ViewName_ConsolidatedDataView

	// filter, whereEleList = PrepareScheduleFilter(tableName, dataReq, false)
	// if filter != "" {
	// 	queryWithFiler = query + filter
	// }

	// data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get schedule data from DB err: %v", err)
	// 	FormAndSendHttpResp(resp, "Failed to get schedule data from DB", http.StatusBadRequest, nil)
	// 	return
	// }

	SchedulingHomeList := models.GetSchedulingHomeList{}

	for _, item := range data {
		RecordId, ok := item["roof_type"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		RoofType, ok := item["home_owner"].(string)
		if !ok || RoofType == "" {
			log.FuncErrorTrace(0, "Failed to get RoofType for Record ID %v. Item: %+v\n", RecordId, item)
			RoofType = ""
		}
		HomeOwner, ok := item["home_owner"].(string)
		if !ok || HomeOwner == "" {
			log.FuncErrorTrace(0, "Failed to get HomeOwner for Record ID %v. Item: %+v\n", RecordId, item)
			HomeOwner = ""
		}
		CustomerEmail, ok := item["customer_email"].(string)
		if !ok || CustomerEmail == "" {
			log.FuncErrorTrace(0, "Failed to get CustomerEmail for Record ID %v. Item: %+v\n", RecordId, item)
			CustomerEmail = ""
		}
		CustomerPhoneNumber, ok := item["customer_phone_number"].(string)
		if !ok || CustomerPhoneNumber == "" {
			log.FuncErrorTrace(0, "Failed to get CustomerPhoneNumber name for Record ID %v. Item: %+v\n", RecordId, item)
			CustomerPhoneNumber = ""
		}
		SystemSize, ok := item["system_size"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get SystemSize for Record ID %v. Item: %+v\n", RecordId, item)
			SystemSize = 0
		}
		Address, ok := item["address"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Date for Record ID %v. Item: %+v\n", RecordId, item)
			Address = ""
		}

		SchedulingHome := models.GetSchedulingHome{
			RoofType:            RoofType,
			HomeOwner:           HomeOwner,
			CustomerEmail:       CustomerEmail,
			CustomerPhoneNumber: CustomerPhoneNumber,
			SystemSize:          SystemSize,
			Address:             Address,
		}

		SchedulingHomeList.SchedulingHomeList = append(SchedulingHomeList.SchedulingHomeList, SchedulingHome)
	}

	// filter, whereEleList = PrepareScheduleFilter(tableName, dataReq, true)
	// if filter != "" {
	// 	queryForAlldata = query + filter
	// }

	// data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get schedule data from DB err: %v", err)
	// 	FormAndSendHttpResp(resp, "Failed to get schedule data from DB", http.StatusBadRequest, nil)
	// 	return
	// }
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of schedule List fetched : %v list %+v", len(SchedulingHomeList.SchedulingHomeList), SchedulingHomeList)
	FormAndSendHttpResp(resp, "schedule data", http.StatusOK, SchedulingHomeList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareScheduleFilter
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareScheduleFilter(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareScheduleFilter")
	defer func() { log.ExitFn(0, "PrepareScheduleFilter", nil) }()

	var filtersBuilder strings.Builder
	// whereAdded := false

	if forDataCount {
		filtersBuilder.WriteString(" GROUP BY ap.id, ap.unique_id, ap.payee, ap.amount, ap.date, ap.short_code, ap.description, vd.dealer_code")
	} else {
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY ap.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
