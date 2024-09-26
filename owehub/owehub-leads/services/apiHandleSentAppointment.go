/**************************************************************************
* File                  : apiHandleSentAppointment.go
* DESCRIPTION           : This file contains functions to update Appointment information

* DATE                  : 20-September-2024
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
		data         []map[string]interface{}
	)

	log.EnterFn(0, "HandleSentAppointmentRequest")

	defer func() { log.ExitFn(0, "HandleSentAppointmentRequest", err) }()

	log.FuncErrorTrace(0, "1")
	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get leads data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	log.FuncErrorTrace(0, "2")

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from user err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	log.FuncErrorTrace(0, "3")

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal the sent appointment details err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal sent appointment data Request body", http.StatusBadRequest, nil)
		return
	}

	log.FuncErrorTrace(0, "4")

	query = fmt.Sprintf("SELECT email_id FROM leads_info WHERE leads_id = %d", dataReq.LeadsId)
	//whereEleList = append(whereEleList, dataReq.LeadsId)

	log.FuncErrorTrace(0, "5")

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)

	log.FuncErrorTrace(0, "6")

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get email from database: %v", err)
		FormAndSendHttpResp(resp, "Failed to get email from database", http.StatusInternalServerError, nil)
		return
	}

	log.FuncErrorTrace(0, "7")

	ClientEmail, ok := data[0]["email_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get the email_id from leads info table: %+v\n", data[0])
		FormAndSendHttpResp(resp, "Failed to get the email_id from leads info table", http.StatusInternalServerError, nil, 0)
		return
	}

	log.FuncErrorTrace(0, "8")

	// find length of email.
	emailLength := len(ClientEmail)
	if emailLength == 0 {
		log.FuncErrorTrace(0, "Email is blank")
		FormAndSendHttpResp(resp, "Email is blank", http.StatusInternalServerError, nil, 0)
		return
	}

	log.FuncErrorTrace(0, "9")

	// Concatenate date and time
	dateTime := dataReq.AppointmentDate + " " + dataReq.AppointmentTime

	log.FuncErrorTrace(0, "10")

	// Email Function Call
	emailResult := sentAppointmentEmail(ClientEmail, dateTime)

	log.FuncErrorTrace(0, "11")

	if !emailResult {
		log.FuncErrorTrace(0, "Failed to send the email to the client %v", err)
		FormAndSendHttpResp(resp, "Failed to send the email to the client", http.StatusInternalServerError, nil, 0)
		return
	}

	log.FuncErrorTrace(0, "12")

	query = "UPDATE leads_info SET appointment_date = TO_TIMESTAMP($1, 'DD-MM-YYYY HH24:MI:SS'),status_id = 1,updated_at = CURRENT_TIMESTAMP WHERE leads_id = $2;"

	log.FuncErrorTrace(0, "13")

	whereEleList = append(whereEleList, dateTime)
	whereEleList = append(whereEleList, dataReq.LeadsId)

	log.FuncErrorTrace(0, "14")

	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to update the appointment details in db : %v", err)
		FormAndSendHttpResp(resp, "Failed to update the appointment details in db", http.StatusInternalServerError, nil)
		return
	}

	log.FuncErrorTrace(0, "15")

	FormAndSendHttpResp(resp, "Appointment updated successfully", http.StatusOK, nil, 0)

}
