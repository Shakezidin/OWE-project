/**************************************************************************
* File			: apiUpdateVDealer.go
* DESCRIPTION	: This file contains functions for Update v_Dealer handler
* DATE			: 22-May-2024
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
 * FUNCTION:		HandleUpdateVDealerDataRequest
 * DESCRIPTION:     handler for Update v_dealer request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateVDealerDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		UpdateVDealerReq models.UpdateVDealer
		queryParameters  []interface{}
		result           []interface{}
	)

	log.EnterFn(0, "HandleUpdateVDealerDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateVDealerDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Update v dealer request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update v dealer request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateVDealerReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update v dealer request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Update v dealer request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateVDealerReq.DealerCode) <= 0) || (len(UpdateVDealerReq.DealerName) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, UpdateVDealerReq.RecordId)
	queryParameters = append(queryParameters, UpdateVDealerReq.DealerCode)
	queryParameters = append(queryParameters, UpdateVDealerReq.DealerName)
	queryParameters = append(queryParameters, UpdateVDealerReq.Description)
	queryParameters = append(queryParameters, UpdateVDealerReq.DealerLogo)
	queryParameters = append(queryParameters, UpdateVDealerReq.BgColour)
	queryParameters = append(queryParameters, UpdateVDealerReq.PreferredName)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateVDealerFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add v dealer in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update V dealer", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New Partner Updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Partner Updated Successfully", http.StatusOK, nil)
}
