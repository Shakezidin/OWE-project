/**************************************************************************
 * File       	   : apiGetAnyTableData.go
 * DESCRIPTION     : This file contains functions for get any table data handler
 * DATE            : 13-May-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
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
 * FUNCTION:		HandleGetAnyTableDataRequest
 * DESCRIPTION:     handler for get any table data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetAnyTableDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		dataReq           models.DataRequestBody
		data              []map[string]interface{}
		whereEleList      []interface{}
		query             string
		queryWithFiler    string
		filter            string
		RecordCount       int64
		SelectedTableName string
		tableName         string
	)

	type Response struct {
		Message     string      `json:"message"`
		RecordCount int64       `json:"record_count"`
		Data        interface{} `json:"data"`
	}

	log.EnterFn(0, "HandleGetAnyTableDataRequest")
	defer func() { log.ExitFn(0, "HandleGetAnyTableDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get any table data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get any table data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get any table data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get any table data Request body", http.StatusBadRequest, nil)
		return
	}

	if len(dataReq.Filters) > 0 {
		tableName = dataReq.Filters[0].Data.(string)
	}

	// switch tableName {
	// case "adder_data_cfg_schema":
	// 	SelectedTableName = "adder_data_cfg_schema"
	// case "field_ops_metrics_schema":
	// 	SelectedTableName = "field_ops_metrics_schema"
	// case "finance_metrics_schema":
	// 	SelectedTableName = "finance_metrics_schema"
	// case "internal_ops_metrics_schema":
	// 	SelectedTableName = "internal_ops_metrics_schema"
	// case "next_steps_schema":
	// 	SelectedTableName = "next_steps_schema"
	// case "sales_metrics_schema":
	// 	SelectedTableName = "sales_metrics_schema"
	// case "ntp_schema":
	// 	SelectedTableName = "ntp_schema"
	// case "customers_prospects_schema":
	// 	SelectedTableName = "customers_prospects_schema"
	// }

	SelectedTableName = tableName

	query = fmt.Sprintf("select * from %s", SelectedTableName)
	filter, _ = PrepareGetAnyTableDataFilters(SelectedTableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get any table data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get any table data from DB", http.StatusBadRequest, nil)
		return
	}

	countquery := fmt.Sprintf("SELECT COUNT(*) AS record_count FROM %s", SelectedTableName)
	countData, err := db.ReteriveFromDB(db.RowDataDBIndex, countquery, whereEleList)
	if err != nil || len(countData) <= 0 {
		log.FuncErrorTrace(0, "Failed to get count of table data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get count of table data from DB", http.StatusBadRequest, nil)
		return
	}

	countValue, ok := countData[0]["record_count"].(int64)
	if !ok {
		// Handle the case where the type assertion fails
		log.FuncErrorTrace(0, "Failed to assert record count to int64")
		appserver.FormAndSendHttpResp(resp, "Failed to get count of table data from DB", http.StatusBadRequest, nil)
		return
	}

	RecordCount = countValue
	response := Response{
		Message:     fmt.Sprintf("%s Table Data", SelectedTableName),
		RecordCount: RecordCount,
		Data:        data,
	}
	log.FuncInfoTrace(0, "Number of %v List fetched : %v", SelectedTableName, (data))

	// Respond with the retrieved data as JSON
	resp.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(resp).Encode(response); err != nil {
		http.Error(resp, fmt.Sprintf("Failed to encode data as JSON: %v", err), http.StatusInternalServerError)
		return
	}

}

/******************************************************************************
 * FUNCTION:		PrepareAnyTableDataFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareGetAnyTableDataFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareGetAnyTableDataFilters")
	defer func() { log.ExitFn(0, "PrepareGetAnyTableDataFilters", nil) }()

	var filtersBuilder strings.Builder
	if forDataCount == false {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

/******************************************************************************
 * FUNCTION:		PrepareAnyTableDataFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func paginateData(data []map[string]interface{}, dataReq models.DataRequestBody) []map[string]interface{} {
	startIndex := (dataReq.PageNumber - 1) * dataReq.PageSize
	endIndex := startIndex + dataReq.PageSize

	if startIndex > len(data) {
		return []map[string]interface{}{}
	}
	if endIndex > len(data) {
		endIndex = len(data)
	}

	return data[startIndex:endIndex]
}
