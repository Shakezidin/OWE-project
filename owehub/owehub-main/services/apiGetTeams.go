package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"

	"net/http"

	"github.com/lib/pq"
)

func HandleGetTeamsDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err   error
		query string
		data  []map[string]interface{}
		// dealerName string
		role string
	)

	log.EnterFn(0, "HandleGetTeamsDataRequest")
	defer func() { log.ExitFn(0, "HandleGetTeamsDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get users data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	var dataReq models.GetTeamsRequest
	if err := json.NewDecoder(req.Body).Decode(&dataReq); err != nil {
		log.FuncErrorTrace(0, "Failed to decode HTTP Request body from get users data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to decode HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	role = req.Context().Value("rolename").(string)
	email := req.Context().Value("emailid").(string)

	switch role {
	case "Dealer Owner":
		query = `
			SELECT t.team_id, t.team_name, COUNT(tm.user_id) AS member_count
			FROM teams t
			JOIN team_members tm ON tm.team_id = t.team_id
			WHERE t.dealer_id = (SELECT dealer_id FROM user_details WHERE email_id = $1)
			GROUP BY t.team_id
			ORDER BY t.team_id;
		`
	case "Regional Manager", "Sales Manager":
		query = `
			SELECT t.team_id, t.team_name, COUNT(tm.user_id) AS member_count
			FROM teams t
			JOIN team_members tm ON tm.team_id = t.team_id
			WHERE tm.user_id IN (
				SELECT user_id
				FROM user_details
				WHERE email_id = $1
			)
			GROUP BY t.team_id
			ORDER BY t.team_id;
		`
	case "Sales Representative":
		query = `
			SELECT t.team_id, t.team_name, COUNT(tm.user_id) AS member_count
			FROM teams t
			JOIN team_members tm ON tm.team_id = t.team_id
			WHERE tm.user_id = (SELECT user_id FROM user_details WHERE email_id = $1)
			GROUP BY t.team_id
			ORDER BY t.team_id;
		`
	default:
		if len(dataReq.DealerNames) > 0 {
			query = `
				SELECT t.team_id, t.team_name, COUNT(tm.user_id) AS member_count
				FROM teams t
				JOIN team_members tm ON tm.team_id = t.team_id
				WHERE t.dealer_id IN (
					SELECT id FROM v_dealer WHERE dealer_code = ANY($1)
				)
				GROUP BY t.team_id
				ORDER BY t.team_id;
			`
		} else {
			query = `
				SELECT t.team_id, t.team_name, COUNT(tm.user_id) AS member_count
				FROM teams t
				JOIN team_members tm ON tm.team_id = t.team_id
				GROUP BY t.team_id
				ORDER BY t.team_id;
			`
		}
	}

	// Execute query
	if len(dataReq.DealerNames) > 0 {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{pq.Array(dataReq.DealerNames)})
	} else if role == "Admin" {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	} else {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{email})
	}

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
		return
	}

	// Prepare response
	usersNameList := []models.GetTeam{}
	for _, item := range data {
		teamID, teamIDOk := item["team_id"].(int64)
		teamName, teamNameOk := item["team_name"].(string)
		memberCount, memberCountOk := item["member_count"].(int64)
		if !teamIDOk || !teamNameOk || !memberCountOk {
			log.FuncErrorTrace(0, "Failed to parse data for Item: %+v\n", item)
			continue
		}

		usersData := models.GetTeam{
			TeamId:       teamID,
			TeamName:     teamName,
			TeamStrength: memberCount,
		}
		usersNameList = append(usersNameList, usersData)
	}

	log.FuncInfoTrace(0, "Number of users List fetched : %v list %+v", len(usersNameList), usersNameList)
	FormAndSendHttpResp(resp, "Users Data", http.StatusOK, usersNameList)
}
