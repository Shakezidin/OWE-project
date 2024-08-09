/**************************************************************************
 * File       	   : apiGetUsersData.go
 * DESCRIPTION     : This file contains functions for get users data handler
 * DATE            : 22-Jan-2024
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
 * FUNCTION:		HandleGetUsersDataRequest
 * DESCRIPTION:     handler for get users data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
type tablePermission struct {
	TableName     string `json:"table_name"`
	PrivilegeType string `json:"privilege_type"`
}

func HandleGetUsersDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		dataReq         models.DataRequestBody
		data            []map[string]interface{}
		whereEleList    []interface{}
		query           string
		queryWithFiler  string
		queryForAlldata string
		filter          string
		RecordCount     int64
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
			SELECT ud.user_id AS record_id, ud.name AS name, 
			ud.user_code, 
			ud.mobile_number, 
			ud.email_id, 
			ud.password_change_required, 
			ud.created_at,
			ud.updated_at, 
			COALESCE(ud1.name, 'NA') AS reporting_manager, 
			COALESCE(vd.dealer_name, 'NA') AS dealer_owner, 
			ud.user_status, 
			ud.user_designation, 
			ud.description, 
			ud.region,
			ud.street_address, 
			ud.city, 
			ud.country,
			st.name AS state_name,
			ur.role_name,
			zc.zipcode,
			vd.dealer_name as dealer,
			vd.dealer_logo,
			vd.bg_colour,
			ud.tables_permissions
			FROM user_details ud
			LEFT JOIN user_details ud1 ON ud.reporting_manager = ud1.user_id
			LEFT JOIN user_details ud2 ON ud.dealer_owner = ud2.user_id
			LEFT JOIN states st ON ud.state = st.state_id
			LEFT JOIN user_roles ur ON ud.role_id = ur.role_id
			LEFT JOIN zipcodes zc ON ud.zipcode = zc.id
			LEFT JOIN v_dealer vd ON ud.dealer_id = vd.id`

	filter, whereEleList = PrepareUsersDetailFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
		return
	}

	usersDetailsList := models.GetUsersDataList{}

	for _, item := range data {
		// Record_Id
		Record_Id, recordideOk := item["record_id"].(int64)
		if !recordideOk || Record_Id == 0 {
			log.FuncErrorTrace(0, "Failed to get recordId for Item: %+v\n", item)
			Record_Id = 0
		}

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

		// DealerOwner
		DealerOwner, dealerownerOk := item["dealer_owner"].(string)
		if !dealerownerOk || DealerOwner == "" {
			log.FuncErrorTrace(0, "Failed to get DealerOwner for Item: %+v\n", item)
			DealerOwner = ""
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

		// Region
		Region, regionOk := item["region"].(string)
		if !regionOk || Region == "" {
			Region = ""
		}

		// StreetAddress
		StreetAddress, strtaddrsOk := item["street_address"].(string)
		if !strtaddrsOk || StreetAddress == "" {
			StreetAddress = ""
		}

		// StateName
		StateName, stateOk := item["state_name"].(string)
		if !stateOk || StateName == "" {
			StateName = ""
		}

		// City
		City, cityOk := item["city"].(string)
		if !cityOk || City == "" {
			City = ""
		}

		// Zipcode
		Zipcode, zipcodeOk := item["zipcode"].(string)
		if !zipcodeOk || Zipcode == "" {
			Zipcode = ""
		}

		// Country
		Country, countryOk := item["country"].(string)
		if !countryOk || Country == "" {
			Country = ""
		}

		// Dealer
		Dealer, dealerOk := item["dealer"].(string)
		if !dealerOk || Dealer == "" {
			Dealer = ""
		}

		// Dealer
		DealerLogo, dealerlogoOk := item["dealer_logo"].(string)
		if !dealerlogoOk || DealerLogo == "" {
			DealerLogo = ""
		}

		// Dealer
		BgColour, bgcolouroOk := item["bg_colour"].(string)
		if !bgcolouroOk || BgColour == "" {
			BgColour = ""
		}

		// tablesPermissions
		tablesPermissionsJSON, Ok := item["tables_permissions"].([]byte)
		if !Ok || tablesPermissionsJSON == nil {
			tablesPermissionsJSON = nil
		}
		// Unmarshal the JSONB data into the TablesPermissions field
		var tablePermissions []models.GetTablePermission
		err = json.Unmarshal(tablesPermissionsJSON, &tablePermissions)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to unmarshall table permission data err: %v", err)
		}

		usersData := models.GetUsersData{
			RecordId:          Record_Id,
			Name:              Name,
			EmailId:           EmailID,
			MobileNumber:      MobileNumber,
			Designation:       Designation,
			RoleName:          RoleName,
			UserCode:          UserCode,
			PasswordChangeReq: PasswordChangeReq,
			ReportingManager:  ReportingManager,
			DealerOwner:       DealerOwner,
			UserStatus:        UserStatus,
			Description:       Description,
			Region:            Region,
			StreetAddress:     StreetAddress,
			State:             StateName,
			City:              City,
			Zipcode:           Zipcode,
			Country:           Country,
			Dealer:            Dealer,
			DealerLogo:        DealerLogo,
			BgColour:          BgColour,
			TablePermission:   tablePermissions,
		}

		usersDetailsList.UsersDataList = append(usersDetailsList.UsersDataList, usersData)
	}

	filter, whereEleList = PrepareUsersDetailFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get user data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get user data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))

	// Send the response
	log.FuncInfoTrace(0, "Number of users List fetched : %v list %+v", len(usersDetailsList.UsersDataList), usersDetailsList)
	FormAndSendHttpResp(resp, "Users Data", http.StatusOK, usersDetailsList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareUsersDetailFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareUsersDetailFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
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
			case "dealer_owner":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ud2.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "steet_address":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ud.street_address) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "city":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ud.city) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "zipcode":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(zc.zipcode) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "country":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ud.country) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dealer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(vd.dealer_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ud.%s) %s LOWER(ud.$%d)", column, operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			}
		}
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ud.user_id, ud.name, ud.user_code, ud.mobile_number, ud.email_id, ud.password_change_required, ud.created_at, ud.updated_at, ud1.name, ud2.name, ud.user_status, ud.user_designation, ud.description, ud.street_address, ud.city, ud.country, st.name, ur.role_name, zc.zipcode, vd.dealer_logo, vd.bg_colour, vd.dealer_name")
	} else {
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
