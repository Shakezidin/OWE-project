/**************************************************************************
* File			: apiCreateSaleType.go
* DESCRIPTION	: This file contains functions for create sale type handler
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
 * FUNCTION:		HandleCreateSaleTypeRequest
 * DESCRIPTION:     handler for create sale type request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateSaleTypeRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		createSaleTypeReq models.CreateSaleType
		queryParameters   []interface{}
		result            []interface{}
	)

	log.EnterFn(0, "HandleCreateSaleTypeRequest")
	defer func() { log.ExitFn(0, "HandleCreateSaleTypeRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create sale type request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create sale type request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createSaleTypeReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create sale type request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create sale type request", http.StatusBadRequest, nil)
		return
	}

	if (len(createSaleTypeReq.TypeName) <= 0) || (len(createSaleTypeReq.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, createSaleTypeReq.TypeName)
	queryParameters = append(queryParameters, createSaleTypeReq.Description)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateSaleTypeFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add sale type in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Sale Type", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Sale type created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Sale Type Created Successfully", http.StatusOK, nil)
}
