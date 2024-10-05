/**************************************************************************
* File			: apiUpdateProfile.go
* DESCRIPTION	: This file contains functions for update Profile handler
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
 * FUNCTION:		HandleUpdateProfileRequest
 * DESCRIPTION:     handler for update Profile request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateProfileRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		updateProfileReq models.UpdateProfileReq
		queryParameters  []interface{}
		result           []interface{}
	)

	log.EnterFn(0, "HandleupdateProfileRequest")
	defer func() { log.ExitFn(0, "HandleupdateProfileRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update Profile request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update Profile request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateProfileReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update Profile request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update Profile request", http.StatusBadRequest, nil)
		return
	}

	emailId := req.Context().Value("emailid").(string)

	// if (len(updateProfileReq.StreetAddress) <= 0) ||
	// 	(len(updateProfileReq.State) <= 0) ||
	// 	(len(updateProfileReq.City) <= 0) ||
	// 	(len(updateProfileReq.Zipcode) <= 0) ||
	// 	(len(updateProfileReq.Country) <= 0) {
	// 	err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
	// 	log.FuncErrorTrace(0, "%v", err)
	// 	appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
	// 	return
	// }

	queryParameters = append(queryParameters, updateProfileReq.StreetAddress)
	queryParameters = append(queryParameters, updateProfileReq.State)
	queryParameters = append(queryParameters, updateProfileReq.City)
	queryParameters = append(queryParameters, updateProfileReq.Zipcode)
	queryParameters = append(queryParameters, updateProfileReq.Country)
	queryParameters = append(queryParameters, emailId)
	queryParameters = append(queryParameters, updateProfileReq.PreferredName)
	queryParameters = append(queryParameters, updateProfileReq.DealerCode)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateProfileFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update Profile in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update Profile", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Profile updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Profile Updated Successfully", http.StatusOK, nil)
}
