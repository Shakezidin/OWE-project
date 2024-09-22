/**************************************************************************
* File			: 	apiCreateApRep.go
* DESCRIPTION	: This file contains functions to create ApRep handler
* DATE			: 	21-May-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"errors"
	"io"
	"time"

	"encoding/json"
	"fmt"
	"net/http"
)

/******************************************************************************
 * FUNCTION:				HandleCreateApRepRequest
 * DESCRIPTION:     handler to create ApRep request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleCreateArRepRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		createArRepReq  models.CreateApRepReq
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleCreateApRepRequest")
	defer func() { log.ExitFn(0, "HandleCreateApRepRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create ap-rep request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create ap-rep request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createArRepReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create ap-rep request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(createArRepReq.UniqueId) <= 0) || (len(createArRepReq.Rep) <= 0) ||
		(len(createArRepReq.Dba) <= 0) || (len(createArRepReq.Type) <= 0) ||
		(len(createArRepReq.Date) <= 0) || (len(createArRepReq.Method) <= 0) ||
		(len(createArRepReq.Cbiz) <= 0) || (len(createArRepReq.Notes) <= 0) ||
		(len(createArRepReq.Transaction) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createArRepReq.Amount <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// converting string to date format
	date, err := time.Parse("2006-01-02", createArRepReq.Date)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, createArRepReq.UniqueId)
	queryParameters = append(queryParameters, createArRepReq.Rep)
	queryParameters = append(queryParameters, createArRepReq.Dba)
	queryParameters = append(queryParameters, createArRepReq.Type)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, createArRepReq.Amount)
	queryParameters = append(queryParameters, createArRepReq.Method)
	queryParameters = append(queryParameters, createArRepReq.Cbiz)
	queryParameters = append(queryParameters, createArRepReq.Transaction)
	queryParameters = append(queryParameters, createArRepReq.Notes)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateApRepFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add ap-rep in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Ap-Rep", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New ap-rep created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "ap-Rep Created Successfully", http.StatusOK, nil)
}
