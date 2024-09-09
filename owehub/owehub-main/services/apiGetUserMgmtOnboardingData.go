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
	"strings"

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
		dataReq        models.GetUserMngmnt
		err            error
		data           []map[string]interface{}
		whereEleList   []interface{}
		query          string
		activeRepQuery string
		salesRep       []string
	)

	log.EnterFn(0, "HandleGetUserMgmtOnboardingDataRequest")
	defer func() { log.ExitFn(0, "HandleGetUserMgmtOnboardingDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get user management data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get user management data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get user management data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get user management data Request body", http.StatusBadRequest, nil)
		return
	}

	query = ` 
			WITH user_data AS (
    SELECT 
        ur.role_name, 
        COUNT(u.user_id) AS user_count,
        CASE
            WHEN ur.role_name = 'Sale Representative' THEN string_agg(u.name, ', ')
            ELSE NULL
        END AS sales_representatives
    FROM 
        user_details u
    INNER JOIN 
        user_roles ur ON u.role_id = ur.role_id
    GROUP BY 
        ur.role_name
),
dealer_data AS (
    SELECT 
        'Partner' AS role_name,
        COUNT(*) AS user_count,
        NULL AS sales_representatives
    FROM 
        v_dealer
    WHERE 
        is_deleted = FALSE
)
SELECT * FROM user_data
UNION ALL
SELECT * FROM dealer_data;`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get UserMgmt Onboarding data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get UserMgmt Onboarding data from DB", http.StatusBadRequest, nil)
		return
	}

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

		// SalesRepresentatives
		SalesRepresentatives, repOk := item["sales_representatives"].(string)
		if repOk && SalesRepresentatives != "" {
			salesRep = strings.Split(SalesRepresentatives, ", ")
		}

		// Create a new GetDealerTierData object
		usrOnboardingData := models.GetUsMgmtOnbData{
			RoleName:  RoleName,
			UserCount: UserCount,
		}

		// Append the new dealerTierData to the usrMgOnbList
		usrMgOnbList.UsrMgmtOnbList = append(usrMgOnbList.UsrMgmtOnbList, usrOnboardingData)
	}

	activeRepQuery = `
		SELECT DISTINCT
		primary_sales_rep AS active_sales_representative
	FROM
		consolidated_data_view
	WHERE
		contract_date BETWEEN current_date - interval '90 day' AND current_date;
	`

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, activeRepQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get active sales representatives from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get active sales representatives from DB", http.StatusBadRequest, nil)
		return
	}

	activeSalesReps := make(map[string]bool)
	for _, item := range data {
		repName, nameOk := item["active_sales_representative"].(string)
		if nameOk && repName != "" {
			activeSalesReps[repName] = true
		}
	}

	// Determine active and inactive sales representatives
	activeCount := int64(0)
	inactiveSalesReps := []string{}

	for _, rep := range salesRep {
		if activeSalesReps[rep] {
			activeCount++
		} else {
			inactiveSalesReps = append(inactiveSalesReps, rep)
		}
	}

	if dataReq.Usertype == "Active" {
		usrMgOnbList.Users = ExtractKeys(activeSalesReps)
	}

	if dataReq.Usertype == "InActive" {
		usrMgOnbList.Users = inactiveSalesReps
	}

	usrMgOnbList.ActiveSaleRep = activeCount
	usrMgOnbList.InactiveSaleRep = int64(len(inactiveSalesReps))

	// Send the response
	log.FuncInfoTrace(0, "Number of UserMgmt Onboarding List fetched : %v list %+v", len(usrMgOnbList.UsrMgmtOnbList), usrMgOnbList)
	FormAndSendHttpResp(resp, "UserMgmt Onboarding Data", http.StatusOK, usrMgOnbList)
}

// ExtractKeys returns keys from a map[string]bool where the values are true
func ExtractKeys(m map[string]bool) []string {
	keys := make([]string, 0, len(m))
	for k, v := range m {
		if v {
			keys = append(keys, k)
		}
	}
	return keys
}
