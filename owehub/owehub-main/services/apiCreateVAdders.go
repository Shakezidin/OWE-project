/**************************************************************************
* File			: apiCreateVAdders.go
* DESCRIPTION	: This file contains functions for create v_adders
						setter handler
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
 * FUNCTION:		HandleCreateVAddersRequest
 * DESCRIPTION:     handler for create v_adders request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateVAddersRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		createVAddersReq models.CreateVAdders
		queryParameters  []interface{}
		result           []interface{}
	)

	log.EnterFn(0, "HandleCreateVAddersRequest")
	defer func() { log.ExitFn(0, "HandleCreateVAddersRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create v adders request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create v adders request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createVAddersReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create v adders request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create v adders request", http.StatusBadRequest, nil)
		return
	}

	if (len(createVAddersReq.AdderName) <= 0) || (len(createVAddersReq.AdderType) <= 0) ||
		(len(createVAddersReq.PriceType) <= 0) || (len(createVAddersReq.PriceAmount) <= 0) ||
		(len(createVAddersReq.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createVAddersReq.Active <= 0 {
		err = fmt.Errorf("Invalid Active Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Active Not Allowed", http.StatusBadRequest, nil)
		return
	}
	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createVAddersReq.AdderName)
	queryParameters = append(queryParameters, createVAddersReq.AdderType)
	queryParameters = append(queryParameters, createVAddersReq.PriceType)
	queryParameters = append(queryParameters, createVAddersReq.PriceAmount)
	queryParameters = append(queryParameters, createVAddersReq.Active)
	queryParameters = append(queryParameters, createVAddersReq.Description)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateVAddersFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add v adders in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create V adders", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New v adders created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "V Adders Created Successfully", http.StatusOK, nil)
}
