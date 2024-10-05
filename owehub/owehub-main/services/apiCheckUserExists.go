/**************************************************************************
* File			: apiCheckUserExists.go
* DESCRIPTION	: This file contains functions for create AdderCredit handler
* DATE			: 10-May-2024
**************************************************************************/

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
)

/******************************************************************************
 * FUNCTION:		HandleCheckUserExists
 * DESCRIPTION:     handler to check user exists
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCheckUserExists(resp http.ResponseWriter, req *http.Request) {
	var (
		err                  error
		createAdderCreditReq models.CheckUserExists
		whereEleList         []interface{}
		query                string
	)

	log.EnterFn(0, "HandleCheckUserExists")
	defer func() { log.ExitFn(0, "HandleCheckUserExists", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create adder credit request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create adder credit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createAdderCreditReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal request body err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal request request", http.StatusBadRequest, nil)
		return
	}

	if len(createAdderCreditReq.Email) <= 0 {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	query = `
	  SELECT email_id FROM user_details WHERE email_id = LOWER($1)`
	whereEleList = append(whereEleList, createAdderCreditReq.Email)

	response := models.CheckUserExistsResp{}
	response.Email = createAdderCreditReq.Email
	response.Exists = false

	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get data from DB", http.StatusNotFound, nil)
		return
	}

	if len(data) == 0 {
		appserver.FormAndSendHttpResp(resp, "user does not exist in the system", http.StatusOK, response)
		return
	}
	response.Exists = true
	log.DBTransDebugTrace(0, "email id: %+v", data[0]["email_id"])
	appserver.FormAndSendHttpResp(resp, "user exists", http.StatusOK, response)
}
