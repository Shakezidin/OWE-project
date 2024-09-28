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
		//
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

	// // Validate that at least one field is provided
	// if len(dataReq.PhoneNumber) == 0 && len(dataReq.EmailId) == 0 && len(dataReq.StreetAddress) == 0 {
	// 	err = fmt.Errorf("no fields provided to update")
	// 	log.FuncErrorTrace(0, "%v", err)
	// 	FormAndSendHttpResp(resp, "No fields provided to update", http.StatusBadRequest, nil)
	// 	return
	// }

	// construct update query based on provided fields
	//["phone_number = ?", "email_id = ?", "street_address = ?"]
	//["123456789", "petwal@abc.com", "adddress"]

	if len(dataReq.PhoneNumber) > 0 {
		whereEleList = append(whereEleList, dataReq.PhoneNumber)
		updateFields = append(updateFields, fmt.Sprintf("phone_number = $%d",len(whereEleList)))
	}
	if len(dataReq.EmailId) > 0 {
		whereEleList = append(whereEleList, dataReq.EmailId)
		updateFields = append(updateFields, fmt.Sprintf("email_id = $%d",len(whereEleList)))
	}
	if len(dataReq.StreetAddress) > 0 {
		whereEleList = append(whereEleList, dataReq.StreetAddress)
		updateFields = append(updateFields, fmt.Sprintf("street_address = $%d",len(whereEleList)))
	}

	// checking for 0 fields
	if len(updateFields) == 0 {
		err = fmt.Errorf("no fields provided to update")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "No fields provided to update", http.StatusBadRequest, nil)
		return
	}

	// Add LeadID for the WHERE clause
	whereEleList = append(whereEleList, dataReq.LeadId)

	// SQL query constuct

	query = fmt.Sprintf("UPDATE leads_info SET %s WHERE leads_id = $%d", strings.Join(updateFields, ", "),len(whereEleList))
	//UPDATE leads_info SET **phone_number = ?, email_id = ?**** WHERE leads_id = ?

	err, res := db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)

	if res == 0 {
		//0 =  no rows were updated
		log.FuncErrorTrace(0, "No rows updated for lead details: %v", err)
		FormAndSendHttpResp(resp, "No rows were updated", http.StatusInternalServerError, nil)
		return
	}

	FormAndSendHttpResp(resp, "Lead info updated successfully", http.StatusOK, nil)
}
