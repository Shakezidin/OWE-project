/**************************************************************************
 * File       	   : apiGetDBLogs.go
 * DESCRIPTION     : This file contains functions to get DB logs
 * DATE            : 07-May-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"reflect"
)

/******************************************************************************
 * FUNCTION:		HandleGetProjectManagementRequest
 * DESCRIPTION:     handler for get ProjectManagement data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetDbLogsRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		dataReq          models.DbLogReq
		data             []map[string]interface{}
		whereEleList     []interface{}
		// queryWithFiler   string
		// filter           string
		// rgnSalesMgrCheck bool
		// SaleRepList      []interface{}
		// role             string
	)

	log.EnterFn(0, "HandleGetProjectManagementRequest")
	defer func() { log.ExitFn(0, "HandleGetProjectManagementRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get PerfomanceDbLogs data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get PerfomanceDbLogs data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get PerfomanceDbLogs data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get PerfomanceDbLogs data Request body", http.StatusBadRequest, nil)
		return
	}

	start, end, err := ConvertDate(dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get time: %v", err)
		FormAndSendHttpResp(resp, "Request Failed", http.StatusBadRequest, nil)
		return
	}

	query := `
		SELECT usename, datname, query_start, query
		FROM pg_stat_activity WHERE query_start >= $1 AND query_start <= $2
	`
	whereEleList = append(whereEleList, start, end)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get PerfomanceDbLogs data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get PerfomanceDbLogs data from DB", http.StatusBadRequest, nil)
		return
	}
	
	loglist := models.DbLogListResp{}
	log.FuncErrorTrace(0, "Failed to get PerfomanceDbLogs data from DB err: %v", data)
	for _, item := range data {
		var dbLog models.DbLogResp
		dbRowToStruct(item, &dbLog)
		loglist.DbLogList = append(loglist.DbLogList, dbLog)
	}

	recordLen := len(data)
	log.FuncInfoTrace(0, "Number of DbLogs List fetched : %v list %+v", len(loglist.DbLogList), recordLen)
	FormAndSendHttpResp(resp, "PerfomanceDbLogs", http.StatusOK, loglist, int64(recordLen))
}

/******************************************************************************
 * FUNCTION:		mapRowToStruct
 * DESCRIPTION:     handler for to map db to struct
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
 func dbRowToStruct(item map[string]interface{}, v interface{}) {
	val := reflect.ValueOf(v).Elem()
	columnToField := models.DbColumnToFields
	for dbColumn, structField := range columnToField {
		if dbValue, ok := item[dbColumn]; ok {
			field := val.FieldByName(structField)
			fieldValue := field.Interface()
			switch fieldValue.(type) {
			case string:
				if dbValueTime, ok := dbValue.(time.Time); ok {
					dbValueTimeString := dbValueTime.Format("2006-01-02 15:04:05")
					field.SetString(dbValueTimeString)
				} else if dbValueStr, ok := dbValue.([]byte); ok {
					dbValueStr := string(dbValueStr)
					field.SetString(dbValueStr)
			}else if dbValueStr, ok := dbValue.(string); ok {
					field.SetString(dbValueStr)
				}
			}
		}
	}
}

/******************************************************************************
 * FUNCTION:		ConvertDate
 * DESCRIPTION:     handler for to map db to struct
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func ConvertDate(dataReq models.DbLogReq) (string, string, error) {
	startDateString := dataReq.StartDate
	startDate, err := time.Parse("2006-01-02", startDateString)
	if err != nil {
		fmt.Println("Error parsing start date:", err)
		return "", "", err
	}
	startTime := time.Date(startDate.Year(), startDate.Month(), startDate.Day(), 0, 0, 0, 0, startDate.Location())

	endDateString := dataReq.EndDate
	endDate, err := time.Parse("2006-01-02", endDateString)
	if err != nil {
		fmt.Println("Error parsing end date:", err)
		return "", "", err
	}
	endTime := time.Date(endDate.Year(), endDate.Month(), endDate.Day(), 23, 59, 59, 0, endDate.Location())

	postgresStartTime := startTime.Format("2006-01-02 15:04:05")
	postgresEndTime := endTime.Format("2006-01-02 15:04:05")
	return postgresStartTime, postgresEndTime, nil
}
