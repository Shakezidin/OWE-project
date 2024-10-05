/**************************************************************************
* File                  : apiLeadStatusWin.go
* DESCRIPTION           : This file contains function to update lead status Won

* DATE                  : 27-September-2024
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
)

/******************************************************************************
* FUNCTION:		    HandleWonRequest
* DESCRIPTION:      handler for lead won request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleWonRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.StatusWinRequest
		whereEleList []interface{}
		query        string
		data         []map[string]interface{}
		dataLength   int
	)

	log.EnterFn(0, "HandleWonRequest")
	defer func() { log.ExitFn(0, "HandleWonRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Won Request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from user err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal the status won request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal status won request body", http.StatusBadRequest, nil)
		return
	}

	// Get the creator User Id via email_id from the data base
	userEmail, ok := req.Context().Value("emailid").(string)
	if !ok {
		log.FuncErrorTrace(0, "failed to retrieve user email from context %v", err)
		FormAndSendHttpResp(resp, "User email not found", http.StatusInternalServerError, nil)
		return
	}

	query = fmt.Sprintf("SELECT user_id FROM user_details WHERE email_id = '%s'", userEmail)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get user_id from database: %v", err)
		FormAndSendHttpResp(resp, "Failed to get user_id from database", http.StatusInternalServerError, nil)
		return
	}

	// find length of data.
	dataLength = len(data)
	if dataLength == 0 {
		log.FuncErrorTrace(0, "Data is blank")
		FormAndSendHttpResp(resp, "Data is blank", http.StatusInternalServerError, nil, 0)
		return
	}

	creatorUserId, ok := data[0]["user_id"].(int64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get the user_id from leads info table: %+v\n", data[0])
		FormAndSendHttpResp(resp, "Failed to get the user_id from leads info table", http.StatusInternalServerError, nil, 0)
		return
	}

	// Get the appointment date of the lead id from the data base
	query = fmt.Sprintf("SELECT appointment_date FROM leads_info WHERE leads_id = '%d' and appointment_date < CURRENT_TIMESTAMP", dataReq.LeadsId)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get appointmentDate from database: %v", err)
		FormAndSendHttpResp(resp, "Failed to get appointmentDate from database", http.StatusInternalServerError, nil)
		return
	}

	// find length of data.
	dataLength = len(data)
	if dataLength == 0 {
		log.FuncErrorTrace(0, "appointment date could be in future or could be null")
		FormAndSendHttpResp(resp, "appointment date could be in future or could be null", http.StatusInternalServerError, nil, 0)
		return
	}

	query = "UPDATE leads_info SET status_id = 5,updated_at = CURRENT_TIMESTAMP, lead_won_date = CURRENT_TIMESTAMP, last_updated_by = $1 WHERE leads_id = $2;"

	whereEleList = append(whereEleList, creatorUserId)
	whereEleList = append(whereEleList, dataReq.LeadsId)

	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to update the won status details in db : %v", err)
		FormAndSendHttpResp(resp, "Failed to update the won status details in db", http.StatusInternalServerError, nil)
		return
	}

	FormAndSendHttpResp(resp, "Won status updated successfully", http.StatusOK, nil, 0)
}
