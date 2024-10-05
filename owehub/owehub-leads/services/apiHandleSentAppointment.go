/**************************************************************************
* File                  : apiHandleSentAppointment.go
* DESCRIPTION           : This file contains functions to update Appointment information

* DATE                  : 20-September-2024
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
	"time"
	//"time"
)

/******************************************************************************
* FUNCTION:		    HandleSentAppointmentRequest
* DESCRIPTION:      handler for sent appointment request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleSentAppointmentRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.GetSentAppointmentRequest
		whereEleList []interface{}
		query        string
		aptDate      time.Time
		data         []map[string]interface{}
		dataLength   int
	)

	log.EnterFn(0, "HandleSentAppointmentRequest")
	defer func() { log.ExitFn(0, "HandleSentAppointmentRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get leads data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from user err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal the sent appointment details err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal sent appointment data Request body", http.StatusBadRequest, nil)
		return
	}

	// validate appointment date and time
	aptDate, err = time.Parse("02-01-2006 03:04 PM", dataReq.AppointmentDate+" "+dataReq.AppointmentTime)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse appointment date and time err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Appointment date and time format is incorrect", http.StatusBadRequest, nil)
		return
	}

	// Get the Client Email Id
	authenticatedEmail := req.Context().Value("emailid").(string)
	query = "SELECT email_id FROM get_leads_info_hierarchy($1) WHERE leads_id = $2"
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{authenticatedEmail, dataReq.LeadsId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get email from database: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get email from database", http.StatusInternalServerError, nil)
		return
	}
	// find length of data.
	if len(data) == 0 {
		log.FuncErrorTrace(0, "Lead with leads_id %d not found", dataReq.LeadsId)
		appserver.FormAndSendHttpResp(resp, "Lead not found", http.StatusBadRequest, nil, 0)
		return
	}
	ClientEmail, ok := data[0]["email_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get the email_id from leads info table: %+v\n", data[0])
		appserver.FormAndSendHttpResp(resp, "Failed to get the email_id from leads info table", http.StatusInternalServerError, nil, 0)
		return
	}

	// Email Function Call
	err = sentAppointmentEmail(ClientEmail, &aptDate)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to send the email to the client %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to send the email to the client", http.StatusInternalServerError, nil, 0)
		return
	}

	//******************************************************************************************//
	// Get the User Id via email_id from the data base
	userEmail, ok := req.Context().Value("emailid").(string)
	if !ok {
		log.FuncErrorTrace(0, "failed to retrieve user email from context %v", err)
		appserver.FormAndSendHttpResp(resp, "User email not found", http.StatusInternalServerError, nil)
		return
	}

	query = fmt.Sprintf("SELECT user_id FROM user_details WHERE email_id = '%s'", userEmail)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get user_id from database: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get user_id from database", http.StatusInternalServerError, nil)
		return
	}

	// find length of data.
	dataLength = len(data)
	if dataLength == 0 {
		log.FuncErrorTrace(0, "Data is blank")
		appserver.FormAndSendHttpResp(resp, "Data is blank", http.StatusInternalServerError, nil, 0)
		return
	}

	creatorUserId, ok := data[0]["user_id"].(int64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get the user_id from leads info table: %+v\n", data[0])
		appserver.FormAndSendHttpResp(resp, "Failed to get the user_id from leads info table", http.StatusInternalServerError, nil, 0)
		return
	}
	//**********************************************************************************************//
	query = "UPDATE leads_info SET appointment_date = $1,status_id = 1,updated_at = CURRENT_TIMESTAMP, last_updated_by = $2 WHERE leads_id = $3;"

	whereEleList = append(whereEleList, aptDate)
	whereEleList = append(whereEleList, creatorUserId)
	whereEleList = append(whereEleList, dataReq.LeadsId)

	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to update the appointment details in db : %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update the appointment details in db", http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Appointment updated successfully", http.StatusOK, nil, 0)

}
