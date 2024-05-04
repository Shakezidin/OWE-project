/**************************************************************************
 * File       	   : apiGetPerfomanceSales.go
 * DESCRIPTION     : This file contains functions for get PerfomanceSales handler
 * DATE            : 03-May-2024
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
* FUNCTION:		HandleGetPerfomanceSalesRequest
* DESCRIPTION:     handler for get PerfomanceSales request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetPerfomanceSalesRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		dataReq models.GetPerfomanceReq
		// dataReqTime    models.GetPerfomanceSales
		data           []map[string]interface{}
		whereEleList   []interface{}
		query          string
		queryWithFiler string
		filter         string
	)

	log.EnterFn(0, "HandleGetRateAdjustmentsRequest")
	defer func() { log.ExitFn(0, "HandleGetRateAdjustmentsRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get perfomance sales request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get perfomance sales request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get perfomance sales request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get perfomance sales Request body", http.StatusBadRequest, nil)
		return
	}
	query = `
	SELECT SUM(system_size) AS sales_kw, COUNT(system_size) AS sales  FROM sales_metrics_schema`

	filter, whereEleList = PreparePerfomanceFilters(queryWithFiler, dataReq)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get perfomance sales from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get perfomance sales from DB", http.StatusBadRequest, nil)
		return
	}

	Sales, ok := data[0]["sales"].(int64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get total sales count data: %+v\n", data[0])
		Sales = 0.0
	}

	SalesKw, ok := data[0]["sales_kw"].(float64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get total sales kw count data: %+v\n", data[0])
		SalesKw = 0.0
	}

	perfomanceData := models.PerfomanceSales{}
	perfomanceData.Sales = Sales
	perfomanceData.SalesKw = SalesKw

	log.FuncInfoTrace(0, "total perfomance sales list %+v", Sales)
	FormAndSendHttpResp(resp, "perfomance sales", http.StatusOK, perfomanceData)
}

/******************************************************************************
* FUNCTION:		PreparePerfomanceFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func PreparePerfomanceFilters(tableName string, dataFilter models.GetPerfomanceReq) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PreparePerfomanceFilters")
	defer func() { log.ExitFn(0, "PreparePerfomanceFilters", nil) }()
	var startDate, endDate string
	startDate = dataFilter.StartDate
	endDate = dataFilter.EndDate

	var filtersBuilder strings.Builder
	// if startDate.IsZero() || endDate.IsZero() {
	// default start date
	// default end date
	// }
	filtersBuilder.WriteString(" WHERE ")
	filtersBuilder.WriteString(fmt.Sprintf("contract_date BETWEEN $%d AND $%d", len(whereEleList)+1, len(whereEleList)+2))
	whereEleList = append(whereEleList, startDate, endDate)

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s", tableName)
	return filters, whereEleList
}