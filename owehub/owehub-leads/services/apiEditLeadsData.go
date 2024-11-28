/**************************************************************************
* File			: apiEditLeadsData.go
* DESCRIPTION	: This file contains functions for EditLeadsData handler
* DATE			: 27-Sept-2024
**************************************************************************/

// Handle email ID and phone number duplication errors while updating leads
// email id and phone duplication error andling while updating the leads

package services

import (
	"OWEApp/shared/appserver"
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
		data         []map[string]interface{}
	)

	log.EnterFn(0, "HandleEditLeadsRequest")
	defer func() { log.ExitFn(0, "HandleEditLeadsRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal request: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal request", http.StatusBadRequest, nil)
		return
	}

	// Validate LeadID check
	if dataReq.LeadId <= 0 {
		err = fmt.Errorf("invalid lead ID %d", dataReq.LeadId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid lead ID, update failed", http.StatusBadRequest, nil)
		return
	} 

	if len(dataReq.FirstName) > 0 {
		whereEleList = append(whereEleList, dataReq.FirstName)
		updateFields = append(updateFields, fmt.Sprintf("first_name = $%d", len(whereEleList)))
	}

	if len(dataReq.LastName) > 0 {
		whereEleList = append(whereEleList, dataReq.LastName)
		updateFields = append(updateFields, fmt.Sprintf("last_name = $%d", len(whereEleList)))
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

	if len(dataReq.Notes) > 0 {
		whereEleList = append(whereEleList, dataReq.Notes)
		updateFields = append(updateFields, fmt.Sprintf("notes = $%d", len(whereEleList)))
	}

	if dataReq.SalerepID > 0 {
		whereEleList = append(whereEleList, dataReq.SalerepID)
		updateFields = append(updateFields, fmt.Sprintf("salerep_id = $%d", len(whereEleList)))
	}

	if len(dataReq.LeadSource) > 0 {
		whereEleList = append(whereEleList, dataReq.LeadSource)
		updateFields = append(updateFields, fmt.Sprintf("lead_source = $%d", len(whereEleList)))
	}

	if len(updateFields) == 0 {
		err = fmt.Errorf("no fields provided to update")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "No fields provided to update", http.StatusBadRequest, nil)
		return
	}

	whereEleList = append(whereEleList, dataReq.LeadId)
	query = fmt.Sprintf("UPDATE leads_info SET %s WHERE leads_id = $%d", strings.Join(updateFields, ", "), len(whereEleList))

	err, res := db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to update lead info: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update lead info", http.StatusInternalServerError, nil)
		return
	}

	if res == 0 {
		log.FuncErrorTrace(0, "No rows updated for lead details: %v", err)
		appserver.FormAndSendHttpResp(resp, "No rows were updated", http.StatusInternalServerError, nil)
		return
	}

	countQuery := "SELECT COUNT(*) as count FROM leads_info"
	countData, err := db.ReteriveFromDB(db.OweHubDbIndex, countQuery, nil)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to count records in database: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to count records in database", http.StatusInternalServerError, nil)
		return
	}


	if len(countData) == 0 {
		log.FuncErrorTrace(0, "No data returned from count query")
		appserver.FormAndSendHttpResp(resp, "No data returned from count query", http.StatusInternalServerError, nil)
		return
	}

	recordCount, ok := countData[0]["count"].(int)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert count to int")
		appserver.FormAndSendHttpResp(resp, "Failed to assert count to int", http.StatusInternalServerError, nil)
		return
	}
	appserver.FormAndSendHttpResp(resp, fmt.Sprintf("Lead info updated successfully. Total records: %v", recordCount), http.StatusOK, nil)
}
