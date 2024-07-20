/**************************************************************************
 * File       	   : apiGetProfileData.go
 * DESCRIPTION     : This file contains functions for get Profile data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetProfileDataRequest
 * DESCRIPTION:     handler for get Profile data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleGetProfileDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	log.EnterFn(0, "HandleGetProfileDataRequest")
	defer func() { log.ExitFn(0, "HandleGetProfileDataRequest", err) }()

	query = `
			 SELECT ud.user_id AS record_id, ud.name AS name, 
			 ud.user_code, 
			 ud.mobile_number, 
			 ud.email_id, 
			 ud.password_change_required, 
			 ud.created_at,
			 ud.updated_at, 
			 COALESCE(ud1.name, 'NA') AS reporting_manager, 
			 COALESCE(ud2.name, 'NA') AS dealer_owner, 
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
			 LEFT JOIN v_dealer vd ON ud.dealer_id = vd.id WHERE ud.email_id = $1`

	emailId := req.Context().Value("emailid").(string)

	whereEleList = append(whereEleList, emailId)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Profile data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Profile Data from DB", http.StatusBadRequest, nil)
		return
	}
	// Record_Id
	Record_Id, recordideOk := data[0]["record_id"].(int64)
	if !recordideOk || Record_Id == 0 {
		log.FuncErrorTrace(0, "Failed to get recordId for email: %+v\n", data)
		Record_Id = 0
	}

	// Name
	Name, nameOk := data[0]["name"].(string)
	if !nameOk || Name == "" {
		log.FuncErrorTrace(0, "Failed to get Name for email: %+v\n", emailId)
		Name = ""
	}

	// EmailID
	EmailID, emailOk := data[0]["email_id"].(string)
	if !emailOk || EmailID == "" {
		log.FuncErrorTrace(0, "Failed to get EmailID for email: %+v\n", emailId)
		EmailID = ""
	}

	// MobileNumber
	MobileNumber, mobileOk := data[0]["mobile_number"].(string)
	if !mobileOk || MobileNumber == "" {
		log.FuncErrorTrace(0, "Failed to get MobileNumber for email: %+v\n", emailId)
		MobileNumber = ""
	}

	// Designation
	Designation, designationOk := data[0]["user_designation"].(string)
	if !designationOk || Designation == "" {
		log.FuncErrorTrace(0, "Failed to get Designation for email: %+v\n", emailId)
		Designation = ""
	}

	// RoleName
	RoleName, roleOk := data[0]["role_name"].(string)
	if !roleOk || RoleName == "" {
		log.FuncErrorTrace(0, "Failed to get RoleName for email: %+v\n", emailId)
		RoleName = ""
	}

	// UserCode
	UserCode, codeOk := data[0]["user_code"].(string)
	if !codeOk || UserCode == "" {
		log.FuncErrorTrace(0, "Failed to get UserCode for email: %+v\n", emailId)
		UserCode = ""
	}

	// PasswordChangeReq
	PasswordChangeReq, passOk := data[0]["password_change_required"].(bool)
	if !passOk {
		log.FuncErrorTrace(0, "Failed to get PasswordChangeReq for email: %+v\n", emailId)
	}

	// ReportingManager
	ReportingManager, managerOk := data[0]["reporting_manager"].(string)
	if !managerOk || ReportingManager == "" {
		log.FuncErrorTrace(0, "Failed to get ReportingManager for email: %+v\n", emailId)
		ReportingManager = ""
	}

	// DealerOwner
	DealerOwner, dealerownerOk := data[0]["dealer_owner"].(string)
	if !dealerownerOk || DealerOwner == "" {
		log.FuncErrorTrace(0, "Failed to get DealerOwner for email: %+v\n", emailId)
		DealerOwner = ""
	}

	// Profiletatus
	Profiletatus, statusOk := data[0]["user_status"].(string)
	if !statusOk || Profiletatus == "" {
		log.FuncErrorTrace(0, "Failed to get Profiletatus for email: %+v\n", emailId)
		Profiletatus = ""
	}

	// Description
	Description, descOk := data[0]["description"].(string)
	if !descOk || Description == "" {
		Description = ""
	}

	// Region
	Region, regionOk := data[0]["region"].(string)
	if !regionOk || Region == "" {
		Region = ""
	}

	// StreetAddress
	StreetAddress, strtaddrsOk := data[0]["street_address"].(string)
	if !strtaddrsOk || StreetAddress == "" {
		StreetAddress = ""
	}

	// StateName
	StateName, stateOk := data[0]["state_name"].(string)
	if !stateOk || StateName == "" {
		StateName = ""
	}

	// City
	City, cityOk := data[0]["city"].(string)
	if !cityOk || City == "" {
		City = ""
	}

	// Zipcode
	Zipcode, zipcodeOk := data[0]["zipcode"].(string)
	if !zipcodeOk || Zipcode == "" {
		Zipcode = ""
	}

	// Country
	Country, countryOk := data[0]["country"].(string)
	if !countryOk || Country == "" {
		Country = ""
	}

	// Dealer
	Dealer, dealerOk := data[0]["dealer"].(string)
	if !dealerOk || Dealer == "" {
		Dealer = ""
	}

	// Dealer
	DealerLogo, dealerlogoOk := data[0]["dealer_logo"].(string)
	if !dealerlogoOk || DealerLogo == "" {
		DealerLogo = ""
	}

	// Dealer
	bgColour, bgColourOk := data[0]["bg_colour"].(string)
	if !bgColourOk || bgColour == "" {
		bgColour = ""
	}

	// tablesPermissions
	tablesPermissionsJSON, Ok := data[0]["tables_permissions"].([]byte)
	if !Ok || tablesPermissionsJSON == nil {
		tablesPermissionsJSON = nil
	}
	// Unmarshal the JSONB data into the TablesPermissions field
	var tablePermissions []models.GetTablePermission
	err = json.Unmarshal(tablesPermissionsJSON, &tablePermissions)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshall table permission data err: %v", err)
	}

	userData := models.GetUsersData{
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
		UserStatus:        Profiletatus,
		Description:       Description,
		Region:            Region,
		StreetAddress:     StreetAddress,
		State:             StateName,
		City:              City,
		Zipcode:           Zipcode,
		Country:           Country,
		TablePermission:   tablePermissions,
		Dealer:            Dealer,
		DealerLogo:        DealerLogo,
		BgColour:          bgColour,
	}

	// Send the response
	log.FuncInfoTrace(0, "User profile data fetched for email: %v data %+v", emailId, userData)
	FormAndSendHttpResp(resp, "User Data", http.StatusOK, userData)
}
