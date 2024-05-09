/**************************************************************************
* File			: apiCreateArSchedule.go
* DESCRIPTION	: This file contains functions for create ArSchedule handler
* DATE			: 24-Apr-2024
**************************************************************************/

package services

import (
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
 * FUNCTION:		HandleCreateArScheduleRequest
 * DESCRIPTION:     handler for create ArSchedule request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateArScheduleRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		createArScheduleReq models.CreateArSchedule
		queryParameters     []interface{}
		result              []interface{}
	)

	log.EnterFn(0, "HandleCreateArScheduleRequest")
	defer func() { log.ExitFn(0, "HandleCreateArScheduleRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create ar schedule request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create ar schedule request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createArScheduleReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create ar schedule request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create ar schedule request", http.StatusBadRequest, nil)
		return
	}

	if (len(createArScheduleReq.PermitPay) <= 0) ||
		(len(createArScheduleReq.PartnerName) <= 0) || (len(createArScheduleReq.InstallerName) <= 0) ||
		(len(createArScheduleReq.StateName) <= 0) || (len(createArScheduleReq.SaleTypeName) <= 0) ||
		(len(createArScheduleReq.RedLine) <= 0) || (len(createArScheduleReq.CalcDate) <= 0) ||
		(len(createArScheduleReq.InstallPay) <= 0) || (len(createArScheduleReq.PtoPay) <= 0) ||
		(len(createArScheduleReq.StartDate) <= 0) || (len(createArScheduleReq.PermitMax) <= 0) ||
		(len(createArScheduleReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	Startdate, err := time.Parse("2006-01-02", createArScheduleReq.StartDate)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	Enddate, err := time.Parse("2006-01-02", createArScheduleReq.EndDate)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createArScheduleReq.PartnerName)
	queryParameters = append(queryParameters, createArScheduleReq.InstallerName)
	queryParameters = append(queryParameters, createArScheduleReq.SaleTypeName)
	queryParameters = append(queryParameters, createArScheduleReq.StateName)
	queryParameters = append(queryParameters, createArScheduleReq.RedLine)
	queryParameters = append(queryParameters, createArScheduleReq.CalcDate)
	queryParameters = append(queryParameters, createArScheduleReq.PermitPay)
	queryParameters = append(queryParameters, createArScheduleReq.PermitMax)
	queryParameters = append(queryParameters, createArScheduleReq.InstallPay)
	queryParameters = append(queryParameters, createArScheduleReq.PtoPay)
	queryParameters = append(queryParameters, Startdate)
	queryParameters = append(queryParameters, Enddate)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateArScheduleFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Ar Schedule in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create Ar Schedule", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New ar schedule created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Ar Schedule Created Successfully", http.StatusOK, nil)
}
