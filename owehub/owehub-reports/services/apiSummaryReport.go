/**************************************************************************
 * File       	   : apiSummaryReport.go
 * DESCRIPTION     : This file contains functions to get summary report
 * DATE            : 22-Dec-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strings"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetProductionSummaryReportRequest
 * DESCRIPTION:     handler for get Dealer pay commissions data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetProductionSummaryReportRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		dataReq           models.ProductionSummaryReportRequest
		RecordCount       int
		summaryReportResp models.ProductionSummaryReportResponse
		/*whereEleList      []interface{}
		query             string
		filter            string
		amountPrepaid     float64
		pipelineRemaining float64
		currentDue        float64*/
	)

	log.EnterFn(0, "HandleGetProductionSummaryReportRequest")
	defer func() { log.ExitFn(0, "HandleGetProductionSummaryReportRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get dealer pay commissions data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get dealer pay commissions data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get dealer pay commissions data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get dealer pay commissions data Request body", http.StatusBadRequest, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Dealer pay commissions data", http.StatusOK, summaryReportResp, int64(RecordCount))
}

func Paginate[T any](data []T, pageNumber int64, pageSize int64) []T {
	start := (pageNumber - 1) * pageSize
	if start >= int64(len(data)) {
		return []T{}
	}

	end := start + pageSize
	if end > int64(len(data)) {
		end = int64(len(data))
	}

	return data[start:end]
}

func PrepareProductionSummaryReportFilters(tableName string, dataFilter models.ProductionSummaryReportRequest) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareProductionSummaryReportFilters")
	defer func() { log.ExitFn(0, "PrepareProductionSummaryReportFilters", nil) }()

	var filtersBuilder strings.Builder

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
