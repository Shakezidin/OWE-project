/**************************************************************************
 * File       	   : apiGetDBLogs.go
 * DESCRIPTION     : This file contains functions to get DB logs
 * DATE            : 07-May-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
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
		tableName      string
		countQuery     string
		totalDatas     int64
		allUserList    bool
	)

	log.EnterFn(0, "HandleGetProjectManagementRequest")
	defer func() { log.ExitFn(0, "HandleGetProjectManagementRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get PerfomanceDbLogs data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get PerfomanceDbLogs data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get PerfomanceDbLogs data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get PerfomanceDbLogs data Request body", http.StatusBadRequest, nil)
		return
	}

	query = `
		SELECT usename, datname, query_start, query
		FROM pg_stat_activity`

	countQuery = `
		SELECT count(datname)
		FROM pg_stat_activity
	`

	userQuery := `
		SELECT db_username FROM user_details where role_id = 10
	`

	roleQuery = `
		SELECT db_username
		FROM user_details WHERE email_id = LOWER($1);
	`

	userEmailId = req.Context().Value("emailid").(string)
	role = req.Context().Value("rolename").(string)
	whereEleList = append(whereEleList, userEmailId)

	// this control flow checks if admin or db user.
	if role == "Admin" && dataReq.Username == "" {
		allUserList = true
		adminCheck = true
	} else if role == "Admin" && dataReq.Username != "" {
		adminCheck = false
	} else {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, roleQuery, whereEleList)
		if err != nil || len(data) <= 0 {
			log.FuncErrorTrace(0, "Failed to get user from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "No user exists", http.StatusBadRequest, nil)
			return
		}
		name = data[0]["db_username"].(string)
		dataReq.Username = name
	}

	start, end, err := ConvertDate(dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get time: %v", err)
		appserver.FormAndSendHttpResp(resp, "Request Failed", http.StatusBadRequest, nil)
		return
	}

	dataReq.StartDate = start
	dataReq.EndDate = end
	tableName = db.TableName_Pg_Stat_Activity
	loglist := models.DbLogListResp{}

	filter, whereEleList = PrepareDbLogFilters(tableName, dataReq, adminCheck, false)
	if filter != "" {
		queryWithFiler = query + filter
	} else {
		queryWithFiler = query
	}

	// this bring in log for OweHubDB
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Owehubdb data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get Owehubdb data from DB", http.StatusBadRequest, nil)
		return
	}

	for _, item := range data {
		var dbLog models.DbLogResp
		dbRowToStruct(item, &dbLog)
		loglist.DbLogList = append(loglist.DbLogList, dbLog)
	}

	filter, whereEleList = PrepareDbLogFilters(tableName, dataReq, adminCheck, true)
	qry := countQuery + filter
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, qry, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get DbLogs count from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get DbLogs count from DB", http.StatusBadRequest, nil)
		return
	}

	if len(data) > 0 {
		totalDatas = int64(data[0]["count"].(int64))
	}

	usersList := []string{}
	if allUserList {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, userQuery, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get user from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "No user exists", http.StatusBadRequest, nil)
			return
		}
		for _, item := range data {
			usersList = append(usersList, item["db_username"].(string))
		}
		loglist.UserList = usersList
	}

	log.FuncInfoTrace(0, "Number of DbLogs List fetched : %v list %+v", len(loglist.DbLogList), totalDatas)
	appserver.FormAndSendHttpResp(resp, "DbLogs result", http.StatusOK, loglist, totalDatas)
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
func PrepareDbLogFilters(tableName string, dataFilter models.DbLogReq, adminCheck, countCheck bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareProjectAdminDlrFilters")
	defer func() { log.ExitFn(0, "PrepareProjectAdminDlrFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := true
	filtersBuilder.WriteString(" WHERE LENGTH(query) > 5 AND")

	filtersBuilder.WriteString(fmt.Sprintf("  query_start >= $%d AND query_start <= $%d", len(whereEleList)+1, len(whereEleList)+2))
	whereEleList = append(whereEleList, dataFilter.StartDate, dataFilter.EndDate)

	if !adminCheck {
		if !whereAdded {
			filtersBuilder.WriteString(" WHERE LENGTH(query) > 5 AND ")
		} else {
			filtersBuilder.WriteString(" AND ")
		}
		filtersBuilder.WriteString(fmt.Sprintf(" usename = LOWER($%d)", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataFilter.Username)
	}

	if !countCheck && (dataFilter.PageNumber > 0 && dataFilter.PageSize > 0) {
		offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
		filtersBuilder.WriteString(fmt.Sprintf(" OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
	}
	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
