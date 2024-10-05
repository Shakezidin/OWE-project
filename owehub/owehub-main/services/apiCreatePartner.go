/**************************************************************************
* File			: apiCreatePartner.go
* DESCRIPTION	: This file contains functions for create partner type
						handler
* DATE			: 23-Jan-2024
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
 * FUNCTION:		HandleCreatePartnerRequest
 * DESCRIPTION:     handler for create partner request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreatePartnerRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		createPartnerReq models.CreatePartner
		queryParameters  []interface{}
		result           []interface{}
	)

	log.EnterFn(0, "HandleCreatePartnerRequest")
	defer func() { log.ExitFn(0, "HandleCreatePartnerRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create partner request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create partner request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createPartnerReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create partner request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create partner request", http.StatusBadRequest, nil)
		return
	}

	if (len(createPartnerReq.PartnerName) <= 0) || (len(createPartnerReq.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, createPartnerReq.PartnerName)
	queryParameters = append(queryParameters, createPartnerReq.Description)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreatePartnerFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add partner in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create partner", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New partner created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Partner Created Successfully", http.StatusOK, nil)
}
