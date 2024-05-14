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
	"strings"
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
		err            error
		dataReq        models.DbLogReq
		data           []map[string]interface{}
		whereEleList   []interface{}
		userEmailId    string
		roleQuery      string
		query          string
		role           string
		name           string
		adminCheck     bool
		queryWithFiler string
		filter         string
		username       string
		tableName      string
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

	query = `
		SELECT usename, datname, query_start, query
		FROM pg_stat_activity
	`

	roleQuery = `
		SELECT ur.role_name AS role_name, ud.name as name
		FROM user_details ud
		JOIN user_roles ur ON ud.role_id = ur.role_id
		WHERE ur.role_name IN ('Admin', 'DB User') AND ud.email_id = $1;
	`

	userEmailId = req.Context().Value("emailid").(string)
	whereEleList = append(whereEleList, userEmailId)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, roleQuery, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get user from DB err: %v", err)
		FormAndSendHttpResp(resp, "No user exists", http.StatusBadRequest, nil)
		return
	}

	if len(data) > 0 {
		name = data[0]["name"].(string)
		role = data[0]["role_name"].(string)

		// this creates username for the db users
		username = strings.Join(strings.Fields(name)[0:2], "_")
		dataReq.Username = username
	} else {
		log.FuncErrorTrace(0, "Failed to get user from DB err: %v", err)
		FormAndSendHttpResp(resp, "No user exists", http.StatusBadRequest, nil)
		return
	}

	if role == "Admin" {
		adminCheck = true
	}

	start, end, err := ConvertDate(dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get time: %v", err)
		FormAndSendHttpResp(resp, "Request Failed", http.StatusBadRequest, nil)
		return
	}

	dataReq.StartDate = start
	dataReq.EndDate = end
	tableName = db.TableName_Pg_Stat_Activity
	loglist := models.DbLogListResp{}

	filter, whereEleList = PrepareDbLogFilters(tableName, dataReq, adminCheck)
	if filter != "" {
		queryWithFiler = query + filter
	} else {
		queryWithFiler = query
	}

	// this bring in log for OweHubDB
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Owehubdb data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Owehubdb data from DB", http.StatusBadRequest, nil)
		return
	}

	for _, item := range data {
		var dbLog models.DbLogResp
		dbRowToStruct(item, &dbLog)
		loglist.DbLogList = append(loglist.DbLogList, dbLog)
	}

	// this bring in log for OweDB
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get OweDb data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get OweDb data from DB", http.StatusBadRequest, nil)
		return
	}
	for _, item := range data {
		var dbLog models.DbLogResp
		dbRowToStruct(item, &dbLog)
		loglist.DbLogList = append(loglist.DbLogList, dbLog)
	}

	recordLen := len(data)
	log.FuncInfoTrace(0, "Number of DbLogs List fetched : %v list %+v", len(loglist.DbLogList), recordLen)
	FormAndSendHttpResp(resp, "PerfomanceDbLogs result", http.StatusOK, loglist, int64(recordLen))
}

/******************************************************************************
 * FUNCTION:		dbRowToStruct
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
				} else if dbValueStr, ok := dbValue.(string); ok {
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

/******************************************************************************
 * FUNCTION:		PrepareDbLogFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareDbLogFilters(tableName string, dataFilter models.DbLogReq, adminCheck bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareProjectAdminDlrFilters")
	defer func() { log.ExitFn(0, "PrepareProjectAdminDlrFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := true
	filtersBuilder.WriteString(" WHERE")

	filtersBuilder.WriteString(fmt.Sprintf("  query_start >= $%d AND query_start <= $%d", len(whereEleList)+1, len(whereEleList)+2))
	whereEleList = append(whereEleList, dataFilter.StartDate, dataFilter.EndDate)

	if !adminCheck {
		if !whereAdded {
			filtersBuilder.WriteString(" WHERE ")
		} else {
			filtersBuilder.WriteString(" AND ")
		}
		filtersBuilder.WriteString(fmt.Sprintf("usename = $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataFilter.Username)
	}
	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
