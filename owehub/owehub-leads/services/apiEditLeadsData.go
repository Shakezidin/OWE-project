/**************************************************************************
* File			: apiEditLeadsData.go
* DESCRIPTION	: This file contains functions for EditLeadsData handler
* DATE			: 27-Sept-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

/******************************************************************************
 * FUNCTION:		HandleEditLeadsRequest
 * DESCRIPTION:     handler for EditLeadsData request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleEditLeadsRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		whereEleList []interface{}
		updateFields []string
		dataReq      models.EditLeadsDataReq
		query        string
	)

	log.EnterFn(0, "HandleEditLeadsRequest")
	defer func() { log.ExitFn(0, "HandleEditLeadsRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal request: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal request", http.StatusBadRequest, nil)
		return
	}

	// Validate LeadID check
	if dataReq.LeadId <= 0 {
		err = fmt.Errorf("invalid lead ID %d", dataReq.LeadId)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid lead ID, update failed", http.StatusBadRequest, nil)
		return
	}

	if len(dataReq.PhoneNumber) > 0 {
		whereEleList = append(whereEleList, dataReq.PhoneNumber)
		updateFields = append(updateFields, fmt.Sprintf("phone_number = $%d", len(whereEleList)))
	}
	if len(dataReq.EmailId) > 0 {
		whereEleList = append(whereEleList, dataReq.EmailId)
		updateFields = append(updateFields, fmt.Sprintf("email_id = $%d", len(whereEleList)))
	}
	if len(dataReq.StreetAddress) > 0 {
		whereEleList = append(whereEleList, dataReq.StreetAddress)
		updateFields = append(updateFields, fmt.Sprintf("street_address = $%d", len(whereEleList)))
	}

	if len(updateFields) == 0 {
		err = fmt.Errorf("no fields provided to update")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "No fields provided to update", http.StatusBadRequest, nil)
		return
	}


// Check if new email_id already exists
emailCheckQuery := "SELECT 1 FROM leads_info WHERE email_id = $1"
var emailExists []map[string]interface{}
emailParams := []interface{}{dataReq.EmailId}
emailExists, err = db.ReteriveFromDB(db.OweHubDbIndex, emailCheckQuery, emailParams)

if err != nil {
    log.FuncErrorTrace(0, "Error querying email in database: %v", err)
    FormAndSendHttpResp(resp, "Database error", http.StatusInternalServerError, nil)
    return
}

if len(emailExists) > 0 {
    log.FuncErrorTrace(0, "Email already exists in the system")
    FormAndSendHttpResp(resp, "Email already exists", http.StatusConflict, nil)
    return
}

// Check if new phone_number already exists
phoneCheckQuery := "SELECT 1 FROM leads_info WHERE phone_number = $1"
var phoneExists []map[string]interface{}
phoneParams := []interface{}{dataReq.PhoneNumber}
phoneExists, err = db.ReteriveFromDB(db.OweHubDbIndex, phoneCheckQuery, phoneParams)

if err != nil {
    log.FuncErrorTrace(0, "Error querying phone number in database: %v", err)
    FormAndSendHttpResp(resp, "Database error", http.StatusInternalServerError, nil)
    return
}

if len(phoneExists) > 0 {
    log.FuncErrorTrace(0, "Phone number already exists in the system")
    FormAndSendHttpResp(resp, "Phone number already exists", http.StatusConflict, nil)
    return
}

	whereEleList = append(whereEleList, dataReq.LeadId)
	query = fmt.Sprintf("UPDATE leads_info SET %s WHERE leads_id = $%d", strings.Join(updateFields, ", "), len(whereEleList))

	err, res := db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to update lead info: %v", err)
		FormAndSendHttpResp(resp, "Failed to update lead info", http.StatusInternalServerError, nil)
		return
	}
	
	if res == 0 {
		log.FuncErrorTrace(0, "No rows updated for lead details: %v", err)
		FormAndSendHttpResp(resp, "No rows were updated", http.StatusInternalServerError, nil)
		return
	}

	FormAndSendHttpResp(resp, "Lead info updated successfully", http.StatusOK, nil)
}
