/**************************************************************************
 * File       	   : apiGetPerfomanceProjectStatus.go
 * DESCRIPTION     : This file contains functions for get InstallCost data handler
 * DATE            : 07-May-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strings"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
* FUNCTION:		HandleGetPerfomanceProjectStatusRequest
* DESCRIPTION:     handler for get InstallCost data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetPerfomanceProjectStatusRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err            error
		dataReq        models.PerfomanceStatusReq
		data           []map[string]interface{}
		whereEleList   []interface{}
		query          string
		queryWithFiler string
		filter         string
	)

	log.EnterFn(0, "HandleGetPerfomanceProjectStatusRequest")
	defer func() { log.ExitFn(0, "HandleGetPerfomanceProjectStatusRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get PerfomanceProjectStatus data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get PerfomanceProjectStatus data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get PerfomanceProjectStatus data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get PerfomanceProjectStatus data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_sales_metrics_schema
	query = `
	 SELECT sms.item_id AS record_id, sms.unique_id AS unique_id, sms.contract_date, sms.permit_approved_date, sms.pv_install_completed_date, sms.pto_date, fom.site_survey_completed_date, fom.install_ready_date
	 FROM sales_metrics_schema sms
	 JOIN field_ops_metrics_schema fom ON fom.unique_id = sms.unique_id
	 `

	filter, whereEleList = PrepareStatusFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	} else {
		queryWithFiler = query
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get PerfomanceProjectStatus data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get PerfomanceProjectStatus data from DB", http.StatusBadRequest, nil)
		return
	}

	perfomanceList := models.PerfomanceListResponse{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// if no unique id is present we skip that project
		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get UniqueId for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		ContractDate, ok := item["contract_date"].(string)
		if !ok || ContractDate == "" {
			log.FuncErrorTrace(0, "Failed to get ContractDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			ContractDate = ""
		}

		PermitApprovedDate, ok := item["permit_approved_date"].(string)
		if !ok || PermitApprovedDate == "" {
			log.FuncErrorTrace(0, "Failed to get PermitApprovedDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PermitApprovedDate = ""
		}

		PvInstallCompletedDate, ok := item["pv_install_completed_date"].(string)
		if !ok || PvInstallCompletedDate == "" {
			log.FuncErrorTrace(0, "Failed to get PvInstallCompletedDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PvInstallCompletedDate = ""
		}

		PtoDate, ok := item["pto_date"].(string)
		if !ok || PtoDate == "" {
			log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PtoDate = ""
		}

		SiteSurveyCompleteDate, ok := item["site_survey_completed_date"].(string)
		if !ok || SiteSurveyCompleteDate == "" {
			log.FuncErrorTrace(0, "Failed to get SiteSurverCompleteDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			SiteSurveyCompleteDate = ""
		}

		InstallReadyDate, ok := item["install_ready_date"].(string)
		if !ok || InstallReadyDate == "" {
			log.FuncErrorTrace(0, "Failed to get InstallReadyDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			InstallReadyDate = ""
		}

		perfomanceResponse := models.PerfomanceResponse{
			RecordId:               RecordId,
			UniqueId:               UniqueId,
			ContractDate:           ContractDate,
			PermitApprovedDate:     PermitApprovedDate,
			PvInstallCompletedDate: PvInstallCompletedDate,
			PtoDate:                PtoDate,
			SiteSurveyCompleteDate: SiteSurveyCompleteDate,
			InstallReadyDate:       InstallReadyDate,
		}
		perfomanceList.PerfomanceList = append(perfomanceList.PerfomanceList, perfomanceResponse)
	}
	// Send the response
	log.FuncInfoTrace(0, "Number of PerfomanceProjectStatus List fetched : %v list %+v", len(perfomanceList.PerfomanceList), perfomanceList)
	FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, perfomanceList)
}

/******************************************************************************
* FUNCTION:		PrepareInstallCostFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PrepareStatusFilters(tableName string, dataFilter models.PerfomanceStatusReq, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareStatusFilters")
	defer func() { log.ExitFn(0, "PrepareStatusFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE sms.unique_id IN (")
		whereAdded = true

		for i, filter := range dataFilter.Filters {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.Filters)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
	}

	if whereAdded {
		filtersBuilder.WriteString(")")
	}
	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
