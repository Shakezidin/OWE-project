/**************************************************************************
 * File       	   : apiGetPerformerData.go
 * DESCRIPTION     : This file contains functions for get Team Data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandlePerformerDataRequest
 * DESCRIPTION:     handler for get Team Data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandlePerformerDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.GetLeaderTopDataReq
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	log.EnterFn(0, "HandlePerformerDataRequest")
	defer func() { log.ExitFn(0, "HandlePerformerDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Team Data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Team Data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal perfomer data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get Team Data Request body", http.StatusBadRequest, nil)
		return
	}

	role := req.Context().Value("rolename").(string)
	if role == "" {
		appserver.FormAndSendHttpResp(resp, "error while getting role", http.StatusBadRequest, nil)
		return
	}
	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	performerData := models.GetPerformarData{}

	if role == string(types.RoleAdmin) || role == string(types.RoleFinAdmin) {

	} else if role == string(types.RoleDealerOwner) || role == string(types.RoleSubDealerOwner) {
		query = `SELECT sp.sales_partner_name as dealer_name, ud.name as owner_name, pd.partner_logo as dealer_logo, pd.bg_colour as bg_color, sp.partner_id as dealer_id FROM user_details ud 
				LEFT JOIN sales_partner_dbhub_schema sp ON ud.partner_id = sp.partner_id
				LEFT JOIN partner_details pd ON ud.partner_id = pd.partner_id
				WHERE ud.email_id = $1`
	} else {
		query = `SELECT sp.sales_partner_name as dealer_name, pd.partner_logo as dealer_logo, pd.bg_colour as bg_color, sp.partner_id as dealer_id FROM user_details ud
					LEFT JOIN sales_partner_dbhub_schema sp ON ud.partner_id = sp.partner_id
					LEFT JOIN partner_details pd ON ud.partner_id = pd.partner_id
				  WHERE ud.email_id = $1`
	}

	whereEleList = append(whereEleList, dataReq.Email)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dealer data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get dealer data from DB", http.StatusBadRequest, nil)
		return
	}

	if len(data) <= 0 {
		log.FuncErrorTrace(0, "Failed to get dealer data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get dealer data from DB", http.StatusBadRequest, nil)
		return
	}
	whereEleList = nil

	performerData.DealerId, _ = data[0]["dealer_id"].(string)
	performerData.DealerName, _ = data[0]["dealer_name"].(string)
	performerData.DealerLogo, _ = data[0]["dealer_logo"].(string)
	performerData.BgColor, _ = data[0]["bg_color"].(string)

	queryForDealerOwner := fmt.Sprintf(`
	select * from user_details ud
	LEFT join sales_partner_dbhub_schema sp on ud.partner_id = sp.partner_id
	where (role_id = 2 or role_id = 3) and ud.partner_id = '%s'
	`, performerData.DealerId)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForDealerOwner, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Team Data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get Team Data 2 from DB", http.StatusBadRequest, nil)
		return
	}

	if len(data) > 0 {
		performerData.OwnerName, _ = data[0]["name"].(string)
	}

	query = `SELECT
    (SELECT COUNT(DISTINCT t.team_id)
     FROM teams t
     WHERE t.partner_id = $1) AS total_teams,

    (SELECT COUNT(tm.team_member_id)
     FROM team_members tm
     LEFT JOIN teams t ON tm.team_id = t.team_id
     WHERE t.partner_id = $2) AS total_team_strength`

	whereEleList = append(whereEleList, performerData.DealerId, performerData.DealerId)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Team Data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get Team Data 3 from DB", http.StatusBadRequest, nil)
		return
	}

	if len(data) > 0 {
		performerData.TeamStrength, _ = data[0]["total_team_strength"].(int64)
		performerData.TotalTeams, _ = data[0]["total_teams"].(int64)
	}

	// Send the response
	log.FuncInfoTrace(0, "data fetched for performer data: %v", performerData)
	appserver.FormAndSendHttpResp(resp, "performer Data", http.StatusOK, performerData)
}
