/**************************************************************************
 * File       	   : apiGetProductionTargetsByYear.go
 * DESCRIPTION     : This file contains functions to get production targets
 * DATE            : 22-Dec-2024
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
	"strings"
)

/******************************************************************************
 * FUNCTION:		HandleGetProductionTargetsByYearRequest
 * DESCRIPTION:     Handler for get production targets by year request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetProductionTargetsByYearRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err      error
		query    string
		dataReq  models.ProductionTargetsByYearReq
		apiResp  []models.ProductionTargetsByYearRespItem
		data     []map[string]interface{}
		roleName string
	)

	log.EnterFn(0, "HandleGetProductionTargetsByYearRequest")
	defer func() { log.ExitFn(0, "HandleGetProductionTargetsByYearRequest", err) }()

	// Check if request body is null
	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	// Read request body
	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request Body err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	// Unmarshal the request body into the dataReq struct
	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request Body err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request Body", http.StatusBadRequest, nil)
		return
	}

	// Get authenticated user's email from the request context
	authenticatedUserEmail := req.Context().Value("emailid").(string)
	// Get role name from the request context
	roleName = req.Context().Value("rolename").(string)

	// Determine account manager condition based on role and request data
	amCondition := "AND user_id = 1"
	if roleName == "Admin" && strings.ToLower(dataReq.AccountManager) != "all" {
		// query for user id for Account Manager
		query =
			` select user_id
		 from user_details join
    	 user_roles on  user_roles.role_id = user_details.role_id
		 where user_roles.role_name = 'Account Manager' and user_details.name = $1
	 `

		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{dataReq.AccountManager})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get data from DB", http.StatusBadRequest, nil)
			return
		}

		if len(data) == 0 {
			log.FuncErrorTrace(0, "User ID is blank for %s", authenticatedUserEmail)
			appserver.FormAndSendHttpResp(resp, "user id is blank", http.StatusBadRequest, nil)
			return
		}

		userID, ok := data[0]["user_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'userID' Item: %+v\n", data)
		}

		amCondition = fmt.Sprintf("AND user_id = %d", userID)
	}
	if roleName != "Admin" {
		amCondition = ""
	}

	// Query to retrieve production targets
	query = fmt.Sprintf(`
		 WITH months(n) AS (SELECT generate_series(1, 12))
		 SELECT
			 TRIM(TO_CHAR(TO_DATE(months.n::TEXT, 'MM'), 'Month')) AS month,
			 COALESCE(p.projects_sold, 0) AS projects_sold,
			 COALESCE(p.mw_sold, 0) AS mw_sold,
			 COALESCE(p.install_ct, 0) AS install_ct,
			 COALESCE(p.mw_installed, 0) AS mw_installed,
			 COALESCE(p.batteries_ct, 0) AS batteries_ct
		 FROM months
		 LEFT JOIN get_production_targets_hierarchy($1) p
		 ON months.n = p.month AND p.target_percentage = $2 AND p.year = $3 AND p.state = $4 %s
		 ORDER BY months.n
	 `, amCondition)

	// Retrieve production target data
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{authenticatedUserEmail, dataReq.TargetPercentage, dataReq.Year, dataReq.State})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get data from DB", http.StatusBadRequest, nil)
		return
	}

	// Populate the response items
	for _, item := range data {
		month, ok := item["month"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'month' Item: %+v\n", item)
			continue
		}

		projectsSold, ok := item["projects_sold"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'projects_sold' Item: %+v\n", item)
		}

		mwSold, ok := item["mw_sold"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'mw_sold' Item: %+v\n", item)
		}

		installCt, ok := item["install_ct"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'install_ct' Item: %+v\n", item)
		}

		mwInstalled, ok := item["mw_installed"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'mw_installed' Item: %+v\n", item)
		}

		batteriesCt, ok := item["batteries_ct"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'batteries_ct' Item: %+v\n", item)
		}

		// Append the response item
		apiResp = append(apiResp, models.ProductionTargetsByYearRespItem{
			Month:        month,
			ProjectsSold: projectsSold,
			MwSold:       mwSold,
			InstallCt:    installCt,
			MwInstalled:  mwInstalled,
			BatteriesCt:  batteriesCt,
		})
	}

	// Send response with production targets data
	appserver.FormAndSendHttpResp(resp, "Production targets by year", http.StatusOK, apiResp)
}
