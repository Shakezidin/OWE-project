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
	"time"

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
	SELECT ud.name, ud.user_code, ud.mobile_number, ud.email_id, ud.password_change_required, ud.created_at,
    ud.updated_at, ud1.name AS reporting_manager, ur.role_name, ud.user_status, ud.user_designation, ud.description
	FROM user_details ud
	JOIN user_details ud1 ON ud1.reporting_manager = ud.user_id
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
		Name, ok := item["name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Name. Item: %+v\n", item)
			continue
		}

		// EmailID
		EmailID, ok := item["email_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get EmailID. Item: %+v\n", item)
			continue
		}

		// MobileNumber
		MobileNumber, ok := item["mobile_number"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get MobileNumber. Item: %+v\n", item)
			continue
		}

		// Designation
		Designation, ok := item["user_designation"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Designation. Item: %+v\n", item)
			continue
		}

		// RoleName
		RoleName, ok := item["role_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get RoleName. Item: %+v\n", item)
			continue
		}

		// UserCode
		UserCode, ok := item["user_code"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get UserCode. Item: %+v\n", item)
			continue
		}

		// PasswordChangeReq
		PasswordChangeReq, ok := item["password_change_required"].(bool)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get PasswordChangeReq. Item: %+v\n", item)
			continue
		}

		// ReportingManager
		ReportingManager, ok := item["reporting_manager"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get ReportingManager. Item: %+v\n", item)
			continue
		}

		// UserStatus
		UserStatus, ok := item["user_status"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get UserStatus. Item: %+v\n", item)
			continue
		}

		// Description
		Description, ok := item["description"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Description. Item: %+v\n", item)
			continue
		}

		var CreatedDate, UpdatedDate string
		if createdDateVal, ok := item["created_at"].(time.Time); ok {
			CreatedDate = createdDateVal.Format("2006-01-02 15:04:05")
		}
		if updatedDateVal, ok := item["updated_at"].(time.Time); ok {
			UpdatedDate = updatedDateVal.Format("2006-01-02 15:04:05")
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
			CreatedDate:       CreatedDate,
			UpdatedDate:       UpdatedDate,
		}

		usersDetailsList.UsersDataList = append(usersDetailsList.UsersDataList, usersData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of users List fetched : %v userlist %+v", len(usersDetailsList.UsersDataList), usersDetailsList)
	FormAndSendHttpResp(resp, "Users Data", http.StatusOK, usersDetailsList)
}


/******************************************************************************
 * FUNCTION:		PrepareUsersDetailFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareUsersDetailFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareCommissionFilters")
	defer func() { log.ExitFn(0, "PrepareCommissionFilters", nil) }()
	var filtersBuilder strings.Builder

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")
		for i, filter := range dataFilter.Filters {
			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}

			// Check if the column is a foreign key
			column := filter.Column
			switch column {
			case "ReportingManager":
				filtersBuilder.WriteString(fmt.Sprintf("ud1.name %s $%d", filter.Operation, len(whereEleList)+1))
			case "RoleName":
				filtersBuilder.WriteString(fmt.Sprintf("ur.role_name %s $%d", filter.Operation, len(whereEleList)+1))
			default:
				// For other columns, call PrepareFilters function
				if len(filtersBuilder.String()) > len(" WHERE ") {
					filtersBuilder.WriteString(" AND ")
				}
				subFilters, subWhereEleList := PrepareFilters(tableName, models.DataRequestBody{Filters: []models.Filter{filter}})
				filtersBuilder.WriteString(subFilters)
				whereEleList = append(whereEleList, subWhereEleList...)
				continue
			}

			whereEleList = append(whereEleList, filter.Data)
		}
	}
	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
