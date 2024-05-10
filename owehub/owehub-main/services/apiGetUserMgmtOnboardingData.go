/**************************************************************************
 * File       	   : apiGetUserMgmtOnboardingData.go
 * DESCRIPTION     : This file contains functions for get user management onboarding handler
 * DATE            : 22-Jan-2024
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
)

/******************************************************************************
 * FUNCTION:		HandleGetUserMgmtOnboardingDataRequest
 * DESCRIPTION:     handler for get UserMgmt Onboarding data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetUserMgmtOnboardingDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	log.EnterFn(0, "HandleGetUserMgmtOnboardingDataRequest")
	defer func() { log.ExitFn(0, "HandleGetUserMgmtOnboardingDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get UserMgmt Onboarding data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get UserMgmt Onboarding data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get UserMgmt Onboarding data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get UserMgmt Onboarding data Request body", http.StatusBadRequest, nil)
		return
	}

	query = ` 
	SELECT ur.role_name, COUNT(u.user_id) AS user_count
	FROM user_details u
	INNER JOIN user_roles ur ON u.role_id = ur.role_id
	GROUP BY ur.role_name;`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get UserMgmt Onboarding data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get UserMgmt Onboarding data from DB", http.StatusBadRequest, nil)
		return
	}

	log.FuncErrorTrace(0, "Data Tables %+v", data)

	usrMgOnbList := models.GetUsMgmtOnbList{}

	for _, item := range data {
		// RoleName
		RoleName, nameOk := item["role_name"].(string)
		if !nameOk || RoleName == "" {
			log.FuncErrorTrace(0, "Failed to get UserMgmt Onboarding role name for Item: %+v\n", item)
			RoleName = ""
		}

		UserCount, ok := item["user_count"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get User Count for Item: %+v\n", item)
			continue
		}

		// Create a new GetDealerTierData object
		usrOnboardingData := models.GetUsMgmtOnbData{
			RoleName:  RoleName,
			UserCount: UserCount,
		}

		// Append the new dealerTierData to the usrMgOnbList
		usrMgOnbList.UsrMgmtOnbList = append(usrMgOnbList.UsrMgmtOnbList, usrOnboardingData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of UserMgmt Onboarding List fetched : %v list %+v", len(usrMgOnbList.UsrMgmtOnbList), usrMgOnbList)
	FormAndSendHttpResp(resp, "UserMgmt Onboarding Data", http.StatusOK, usrMgOnbList)
}
