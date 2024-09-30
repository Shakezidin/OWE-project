/**************************************************************************
* File			: apiCreateLeaderOverride.go
* DESCRIPTION	: This file contains functions for create Leader override handler
* DATE			: 24-Apr-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleCreateLeaderOverrideRequest
 * DESCRIPTION:     handler for create LeaderOverride request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateLeaderOverrideRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                     error
		createLeaderOverrideReq models.CreateLeaderOverride
		queryParameters         []interface{}
		result                  []interface{}
	)

	log.EnterFn(0, "HandleCreateLeaderOverrideRequest")
	defer func() { log.ExitFn(0, "HandleCreateLeaderOverrideRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create leader override request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create leader override request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createLeaderOverrideReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create leader override request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create Leader Override request", http.StatusBadRequest, nil)
		return
	}

	if (len(createLeaderOverrideReq.TeamName) <= 0) ||
		(len(createLeaderOverrideReq.LeaderName) <= 0) || (len(createLeaderOverrideReq.Type) <= 0) ||
		(len(createLeaderOverrideReq.Term) <= 0) || (len(createLeaderOverrideReq.Qual) <= 0) ||
		(len(createLeaderOverrideReq.StartDate) <= 0) || (len(createLeaderOverrideReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createLeaderOverrideReq.SalesQ <= float64(0) {
		err = fmt.Errorf("Invalid sales Q Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Sales Q Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createLeaderOverrideReq.PayRate <= float64(0) {
		err = fmt.Errorf("Invalid PayRate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid PayRate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createLeaderOverrideReq.TeamKwQ <= float64(0) {
		err = fmt.Errorf("Invalid team Kw Q  Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Team Kw Q Not Allowed", http.StatusBadRequest, nil)
		return
	}

	StartDate, err := time.Parse("2006-01-02", createLeaderOverrideReq.StartDate)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	EndDate, err := time.Parse("2006-01-02", createLeaderOverrideReq.EndDate)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	queryParameters = append(queryParameters, createLeaderOverrideReq.TeamName)
	queryParameters = append(queryParameters, createLeaderOverrideReq.Type)
	queryParameters = append(queryParameters, createLeaderOverrideReq.LeaderName)
	queryParameters = append(queryParameters, createLeaderOverrideReq.Term)
	queryParameters = append(queryParameters, createLeaderOverrideReq.Qual)
	queryParameters = append(queryParameters, createLeaderOverrideReq.SalesQ)
	queryParameters = append(queryParameters, createLeaderOverrideReq.TeamKwQ)
	queryParameters = append(queryParameters, createLeaderOverrideReq.PayRate)
	queryParameters = append(queryParameters, StartDate)
	queryParameters = append(queryParameters, EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateLeaderOverrideFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add leader override in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Leader Override", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New leader override created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Leader Override Created Successfully", http.StatusOK, nil)
}
