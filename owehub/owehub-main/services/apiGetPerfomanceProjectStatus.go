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
	"time"

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
		err                error
		dataReq            models.PerfomanceStatusReq
		data               []map[string]interface{}
		whereEleList       []interface{}
		query              string
		queryWithFiler     string
		filter             string
		ContractD          string
		PermitD            string
		PvInstallCompleteD string
		PtoD               string
		SiteD              string
		InstallD           string
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
	select unique_id, contract_date, permit_approved_date, 
	pv_install_completed_date, pto_date, site_survey_completed_date, 
	install_ready_date from consolidated_data_view
	 `

	filter, whereEleList = PrepareStatusFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	} else {
		queryWithFiler = query
	}

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get PerfomanceProjectStatus data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get PerfomanceProjectStatus data from DB", http.StatusBadRequest, nil)
		return
	}

	perfomanceList := models.PerfomanceListResponse{}

	for _, item := range data {
		// if no unique id is present we skip that project
		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get UniqueId. Item: %+v\n", item)
			continue
		}

		ContractDate, ok := item["contract_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get ContractDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			ContractD = ""
		} else {
			ContractD = ContractDate.Format("2006-01-02")
		}

		PermitApprovedDate, ok := item["permit_approved_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get PermitApprovedDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PermitD = ""
		} else {
			PermitD = PermitApprovedDate.Format("2006-01-02")
		}

		PvInstallCompletedDate, ok := item["pv_install_completed_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get PvInstallCompletedDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PvInstallCompleteD = ""
		} else {
			PvInstallCompleteD = PvInstallCompletedDate.Format("2006-01-02")
		}

		PtoDate, ok := item["pto_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PtoD = ""
		} else {
			PtoD = PtoDate.Format("2006-01-02")
		}

		SiteSurveyCompleteDate, ok := item["site_survey_completed_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get SiteSurverCompleteDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			SiteD = ""
		} else {
			SiteD = SiteSurveyCompleteDate.Format("2006-01-02")
		}

		InstallReadyDate, ok := item["install_ready_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get InstallReadyDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			InstallD = ""
		} else {
			InstallD = InstallReadyDate.Format("2006-01-02")
		}

		perfomanceResponse := models.PerfomanceResponse{
			UniqueId:               UniqueId,
			ContractDate:           ContractD,
			PermitApprovedDate:     PermitD,
			PvInstallCompletedDate: PvInstallCompleteD,
			PtoDate:                PtoD,
			SiteSurveyCompleteDate: SiteD,
			InstallReadyDate:       InstallD,
		}
		perfomanceList.PerfomanceList = append(perfomanceList.PerfomanceList, perfomanceResponse)
	}
	// Send the response
	recordLen := len(data)
	log.FuncInfoTrace(0, "Number of PerfomanceProjectStatus List fetched : %v list %+v", len(perfomanceList.PerfomanceList), perfomanceList)
	FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, perfomanceList, int64(recordLen))
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
	if len(dataFilter.UniqueIds) > 0 {
		filtersBuilder.WriteString(" WHERE sms.unique_id IN (")
		whereAdded = true

		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
	}

	if whereAdded {
		filtersBuilder.WriteString(") ")
	}

	filtersBuilder.WriteString(fmt.Sprintf("LIMIT $%d", len(whereEleList)+1))
	whereEleList = append(whereEleList, dataFilter.ProjectLimit)
	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
