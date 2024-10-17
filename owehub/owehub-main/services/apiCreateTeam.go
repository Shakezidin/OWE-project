/******************************************************************************
 * File           : apiCreateTeam.go
 * DESCRIPTION    : This file contains functions for create team handler
 * DATE           : 22-Jan-2024
 ******************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strings"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/lib/pq"
)

/******************************************************************************
* FUNCTION:        HandleCreateTeamRequest
* DESCRIPTION:     handler for create team request
* INPUT:           resp, req
* RETURNS:         void
******************************************************************************/
func HandleCreateTeamRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		TeamData        models.TeamData
		queryParameters []interface{}
		query           string
		data            []map[string]interface{}
		dealerId        int
	)

	log.EnterFn(0, "HandleCreateTeamRequest")
	defer func() { log.ExitFn(0, "HandleCreateTeamRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create team request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create team request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &TeamData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create team request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create team request", http.StatusBadRequest, nil)
		return
	}

	if len(TeamData.TeamName) <= 0 {
		err = fmt.Errorf("empty input fields in api is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	saleRepSet := make(map[string]struct{})
	for _, saleRepId := range TeamData.SaleRepIds {
		saleRepSet[saleRepId] = struct{}{}
	}

	for _, managerId := range TeamData.ManagerIds {
		if _, exists := saleRepSet[managerId]; exists {
			err = fmt.Errorf("user id %s cannot be both a sale representative and a manager", managerId)
			log.FuncErrorTrace(0, "%v", err)
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusBadRequest, nil)
			return
		}
	}

	role := req.Context().Value("rolename").(string)
	if role == "Sale Representative" {
		log.FuncErrorTrace(0, "sale rep accessing")
		appserver.FormAndSendHttpResp(resp, "unauthorized user", http.StatusBadRequest, nil)
		return
	}

	if role == "Admin" && len(TeamData.DealerName) <= 0 {
		log.FuncErrorTrace(0, "for admins, dealer should be selected for team creation")
		appserver.FormAndSendHttpResp(resp, "dealer not selected for team creation", http.StatusBadRequest, nil)
		return
	}

	if TeamData.DealerName == "" {
		// Get dealer_id based on email of logged-in user
		TeamData.Email = req.Context().Value("emailid").(string)
		if TeamData.Email == "" {
			appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
			return
		}
		userEmail := TeamData.Email
		query = `
						 SELECT partner_id 
						 FROM user_details 
						 WHERE email_id = $1
				 `
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{userEmail})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get dealers ID from DB with err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get dealers ID", http.StatusBadRequest, nil)
			return
		}

		if len(data) == 0 {
			err = fmt.Errorf("no dealer found for the given email")
			log.FuncErrorTrace(0, "%v", err)
			appserver.FormAndSendHttpResp(resp, "No dealer found for the given email", http.StatusBadRequest, nil)
			return
		}

		dealerId = int(data[0]["partner_id"].(int64))

	} else {
		// Get dealer_id based on dealer_name
		dealerName := TeamData.DealerName
		query = `
						 SELECT partner_id 
						 FROM sales_partner_dbhub_schema 
						 WHERE LOWER(sales_partner_name) = LOWER($1)
				 `
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{dealerName})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get dealer ID from DB with err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get dealer ID", http.StatusBadRequest, nil)
			return
		}

		if len(data) == 0 {
			err = fmt.Errorf("no dealer found with the given name")
			log.FuncErrorTrace(0, "%v", err)
			appserver.FormAndSendHttpResp(resp, "No dealer found with the given name", http.StatusBadRequest, nil)
			return
		}

		dealerId = int(data[0]["partner_id"].(int64))
	}

	queryParameters = append(queryParameters, TeamData.TeamName)
	queryParameters = append(queryParameters, dealerId)
	queryParameters = append(queryParameters, TeamData.Description)
	queryParameters = append(queryParameters, pq.Array(TeamData.SaleRepIds))
	queryParameters = append(queryParameters, pq.Array(TeamData.ManagerIds))

	// var v_team_id int
	_, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateTeamFunction, queryParameters)
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value") {
			log.FuncErrorTrace(0, "Team with the same name already exists err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Team with the same name already exists", http.StatusInternalServerError, nil)
			return
		}
		log.FuncErrorTrace(0, "Failed to Add Team in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Team", http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Team Created Successfully", http.StatusOK, nil)
}
