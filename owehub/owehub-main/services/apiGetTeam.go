/**************************************************************************
 * File           : apiGetTeams.go
 * DESCRIPTION    : This file contains functions for get users data handler
 * DATE           : 23-Apr-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

/******************************************************************************
 * FUNCTION:      HandleGetTeamDataRequest
 * DESCRIPTION:   handler for get users by role request
 * INPUT:         resp, req
 * RETURNS:       void
 ******************************************************************************/
func HandleGetTeamDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		query            string
		data             []map[string]interface{}
		dealerCode       string
		loggedMemberRole string
		teamName         string
	)

	log.EnterFn(0, "HandleGetTeamDataRequest")
	defer func() { log.ExitFn(0, "HandleGetTeamDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get users data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	var dataReq models.GetTeamRequest
	if err := json.NewDecoder(req.Body).Decode(&dataReq); err != nil {
		log.FuncErrorTrace(0, "Failed to decode HTTP Request body from get users data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to decode HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	role := req.Context().Value("rolename").(string)
	email := req.Context().Value("emailid").(string)
	if email == "" {
		FormAndSendHttpResp(resp, "No user exist in DB", http.StatusBadRequest, nil)
		return
	}

	if role != "Admin" {
		queryForMember := `
		select role_in_team from team_members ts
		JOIN user_details ud on ud.user_id = ts.user_id
		where ud.email_id = $1
		and ts.team_id = $2 
	`
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForMember, []interface{}{email, dataReq.TeamId})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
			FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
			return
		}

		if len(data) == 0 && role == "Dealer Owner" {
			loggedMemberRole = "manager"
		} else {
			loggedMemberRole = data[0]["role_in_team"].(string)
		}
	} else {
		loggedMemberRole = "manager"
	}

	query = `
		 SELECT
			 ud.user_code,
			 t.team_name,
			 tm.role_in_team,
			 ud.name,
			 ud.email_id,
			 tm.team_member_id,
			 ud.mobile_number AS phone_number,
			 COUNT(CASE WHEN tm.role_in_team = 'member' THEN 1 END) OVER (PARTITION BY tm.team_id) AS member_count,
			 COUNT(CASE WHEN tm.role_in_team = 'manager' THEN 1 END) OVER (PARTITION BY tm.team_id) AS manager_count,
			 vd.dealer_code
		 FROM
				 team_members tm
		 JOIN
				 user_details ud ON tm.user_id = ud.user_id
		 JOIN
				 teams t ON tm.team_id = t.team_id
		 JOIN
				 v_dealer vd ON t.dealer_id = vd.id
		 WHERE
				 tm.team_id = $1
	 `
	filer, _ := PrepareTeamsFilters("", dataReq, true)
	query = query + filer
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{dataReq.TeamId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
		return
	}

	usersNameList := []models.GetRepResponse{}
	memberCount := 0
	managerCount := 0
	for _, item := range data {
		userCode, ok1 := item["user_code"].(string)
		role, ok2 := item["role_in_team"].(string)
		name, ok3 := item["name"].(string)
		email, ok4 := item["email_id"].(string)
		phone, ok5 := item["phone_number"].(string)
		teamMemberId, ok6 := item["team_member_id"].(int64)
		dealerCode, _ = item["dealer_code"].(string)
		teamName, _ = item["team_name"].(string)

		if !ok1 || !ok2 || !ok3 || !ok4 || !ok5 || !ok6 {
			log.FuncErrorTrace(0, "Failed to get details for Item: %+v\n", item)
			continue
		}

		if role == "member" {
			memberCount++
		} else if role == "manager" {
			managerCount++
		}

		usersData := models.GetRepResponse{
			UserCode:     userCode,
			Role:         role,
			Name:         name,
			EmailId:      email,
			PhoneNumber:  phone,
			TeamMemberId: teamMemberId,
		}
		usersNameList = append(usersNameList, usersData)
	}

	TeamResp := models.GetTeamResponse{
		TeamName:           teamName,
		SaleRep:            usersNameList,
		TeamID:             dataReq.TeamId,
		MemberCount:        memberCount,
		ManagerCount:       managerCount,
		DealerCode:         dealerCode,
		LoggedInMemberRole: loggedMemberRole,
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{dataReq.TeamId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
		return
	}
	recordCount := len(data)

	log.FuncInfoTrace(0, "Number of users List fetched : %v list %+v", recordCount, usersNameList)
	FormAndSendHttpResp(resp, "Users Data", http.StatusOK, TeamResp, int64(recordCount))
}

/******************************************************************************
 * FUNCTION:      PrepareTeamsFilters
 * DESCRIPTION:   handler for create select query
 * INPUT:         resp, req
 * RETURNS:       void
 ******************************************************************************/
func PrepareTeamsFilters(tableName string, dataFilter models.GetTeamRequest, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareTeamsFilters")
	defer func() { log.ExitFn(0, "PrepareTeamsFilters", nil) }()

	var filtersBuilder strings.Builder

	if forDataCount {

	} else if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
		offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
		filtersBuilder.WriteString(fmt.Sprintf(" OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
	}

	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filtersBuilder.String())
	return filters, whereEleList
}
