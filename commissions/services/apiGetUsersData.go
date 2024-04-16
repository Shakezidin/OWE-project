/**************************************************************************
 * File       	   : apiGetUsersData.go
 * DESCRIPTION     : This file contains functions for get users data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"
	"strings"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetUsersDataRequest
 * DESCRIPTION:     handler for get users data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetUsersDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetUsersDataRequest")
	defer func() { log.ExitFn(0, "HandleGetUsersDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get users data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get users data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get users data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get users data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_users_details
	query = `
	SELECT ud.name as name, ud.user_code, ud.mobile_number, ud.email_id, ud.password_change_required, ud.created_at,
    ud.updated_at, COALESCE(ud1.name, 'NA') AS reporting_manager, ur.role_name, ud.user_status, ud.user_designation, ud.description
	FROM user_details ud
	LEFT JOIN user_details ud1 ON ud.reporting_manager = ud1.user_id
	JOIN user_roles ur ON ur.role_id = ud.role_id`

	filter, whereEleList = PrepareUsersDetailFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
		return
	}

	usersDetailsList := models.GetUsersDataList{}

	for _, item := range data {
		// Name
		Name, nameOk := item["name"].(string)
		if !nameOk || Name == "" {
			log.FuncErrorTrace(0, "Failed to get Name for Item: %+v\n", item)
			Name = ""
		}

		// EmailID
		EmailID, emailOk := item["email_id"].(string)
		if !emailOk || EmailID == "" {
			log.FuncErrorTrace(0, "Failed to get EmailID for Item: %+v\n", item)
			EmailID = ""
		}

		// MobileNumber
		MobileNumber, mobileOk := item["mobile_number"].(string)
		if !mobileOk || MobileNumber == "" {
			log.FuncErrorTrace(0, "Failed to get MobileNumber for Item: %+v\n", item)
			MobileNumber = ""
		}

		// Designation
		Designation, designationOk := item["user_designation"].(string)
		if !designationOk || Designation == "" {
			log.FuncErrorTrace(0, "Failed to get Designation for Item: %+v\n", item)
			Designation = ""
		}

		// RoleName
		RoleName, roleOk := item["role_name"].(string)
		if !roleOk || RoleName == "" {
			log.FuncErrorTrace(0, "Failed to get RoleName for Item: %+v\n", item)
			RoleName = ""
		}

		// UserCode
		UserCode, codeOk := item["user_code"].(string)
		if !codeOk || UserCode == "" {
			log.FuncErrorTrace(0, "Failed to get UserCode for Item: %+v\n", item)
			UserCode = ""
		}

		// PasswordChangeReq
		PasswordChangeReq, passOk := item["password_change_required"].(bool)
		if !passOk {
			log.FuncErrorTrace(0, "Failed to get PasswordChangeReq for Item: %+v\n", item)
		}

		// ReportingManager
		ReportingManager, managerOk := item["reporting_manager"].(string)
		if !managerOk || ReportingManager == "" {
			log.FuncErrorTrace(0, "Failed to get ReportingManager for Item: %+v\n", item)
			ReportingManager = ""
		}

		// UserStatus
		UserStatus, statusOk := item["user_status"].(string)
		if !statusOk || UserStatus == "" {
			log.FuncErrorTrace(0, "Failed to get UserStatus for Item: %+v\n", item)
			UserStatus = ""
		}

		// Description
		Description, descOk := item["description"].(string)
		if !descOk || Description == "" {
			Description = ""
		}

		usersData := models.GetUsersData{
			Name:              Name,
			EmailID:           EmailID,
			MobileNumber:      MobileNumber,
			Designation:       Designation,
			RoleName:          RoleName,
			UserCode:          UserCode,
			PasswordChangeReq: PasswordChangeReq,
			ReportingManager:  ReportingManager,
			UserStatus:        UserStatus,
			Description:       Description,
		}

		usersDetailsList.UsersDataList = append(usersDetailsList.UsersDataList, usersData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of users List fetched : %v list %+v", len(usersDetailsList.UsersDataList), usersDetailsList)
	FormAndSendHttpResp(resp, "Users Data", http.StatusOK, usersDetailsList)
}

/******************************************************************************
 * FUNCTION:		PrepareUsersDetailFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareUsersDetailFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareUsersDetailFilters")
	defer func() { log.ExitFn(0, "PrepareUsersDetailFilters", nil) }()

	var filtersBuilder strings.Builder

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")

		for i, filter := range dataFilter.Filters {
			// Check if the column is a foreign key
			column := filter.Column

			// Determine the operator and value based on the filter operation
			operator := GetFilterDBMappedOperator(filter.Operation)
			value := filter.Data

			// For "stw" and "edw" operations, modify the value with '%'
			if filter.Operation == "stw" || filter.Operation == "edw" || filter.Operation == "cont" {
				value = GetFilterModifiedValue(filter.Operation, filter.Data.(string))
			}

			// Build the filter condition using correct db column name
			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}
			switch column {
			case "name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ud.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "reporting_manager":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ud1.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "role_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ur.role_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			}
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
