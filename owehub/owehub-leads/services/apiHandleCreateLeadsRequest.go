/**************************************************************************
* File			: apiHandleCreateLeadsRequest.go
* DESCRIPTION	: This file contains functions for creating new leads
* DATE			: 11-sept-2024
**************************************************************************/

package services

import (
	leadsService "OWEApp/owehub-leads/common"
	"OWEApp/shared/appserver"
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
 * FUNCTION:		HandleCreateLeadsRequest
 * DESCRIPTION:     handler for new leads request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleCreateLeadsRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		CreateLeadsReq  models.CreateLeadsReq
		queryParameters []interface{}
	)

	log.EnterFn(0, "HandleCreateLeadsRequest")
	defer func() { log.ExitFn(0, "HandleCreateLeadsRequest", err) }()

	// Validate that the request body is not nil
	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create leads request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	// Read the body of the request
	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create leads data req err:  %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	// Unmarshal the request body into the CreateLeadsReq struct
	err = json.Unmarshal(reqBody, &CreateLeadsReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create leads request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal leads user request", http.StatusBadRequest, nil)
		return
	}

	if len(CreateLeadsReq.FirstName) <= 0 || len(CreateLeadsReq.LastName) <= 0 ||
		len(CreateLeadsReq.EmailId) <= 0 || len(CreateLeadsReq.PhoneNumber) <= 0 ||
		len(CreateLeadsReq.LeadSource) <= 0 || CreateLeadsReq.SalerepID <= 0 || CreateLeadsReq.SetterID <= 0 {
		log.FuncErrorTrace(0, "invalid data provided")
		appserver.FormAndSendHttpResp(resp, "Empty fields are not allowed in Api", http.StatusBadRequest, nil)
		return
	}

	// get the user email from the context
	userEmail, ok := req.Context().Value("emailid").(string)
	if !ok {
		log.FuncErrorTrace(0, "failed to retrieve user email from context %v", err)
		appserver.FormAndSendHttpResp(resp, "User email not found", http.StatusInternalServerError, nil)
		return
	}

	frontendBaseURL, _ := strings.CutSuffix(CreateLeadsReq.BaseURL, "/")

	queryParameters = append(queryParameters,
		userEmail,
		CreateLeadsReq.FirstName,
		CreateLeadsReq.LastName,
		CreateLeadsReq.EmailId,
		CreateLeadsReq.PhoneNumber,
		CreateLeadsReq.StreetAddress,
		CreateLeadsReq.Notes,
		CreateLeadsReq.SalerepID,
		frontendBaseURL,
		CreateLeadsReq.LeadSource,
		CreateLeadsReq.SetterID,
	)

	// Insert the lead details into the database using function CallDBFunction
	_, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateLeadFunction, queryParameters)
	if err != nil {
		if strings.Contains(err.Error(), "EMAIL_OR_PHONE_NO._EXISTS") {
			appserver.FormAndSendHttpResp(resp, "Email id or phone number already exists", http.StatusBadRequest, nil)
			return
		}

		log.FuncErrorTrace(0, "Failed to Add Leads in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Lead ", http.StatusInternalServerError, nil)
		return
	}

	// Sending success response
	appserver.FormAndSendHttpResp(resp, "Lead Created Successfully", http.StatusOK, nil)
	smsbody := leadsService.SmsHomeOwner.WithData(leadsService.SmsDataHomeOwner{
		LeadFirstName: CreateLeadsReq.FirstName,
		LeadLastName:  CreateLeadsReq.LastName,
		Message:       "Thank You for showing interest in Our World Energy",
	})
	err = sendSms(CreateLeadsReq.PhoneNumber, smsbody)
	if err != nil {
		log.FuncErrorTrace(0, "Error while sending sms: %v", err)
	}
}
