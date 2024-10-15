package services

import (
	"OWEApp/shared/appserver"
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
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	var dataReq models.GetTeamsRequest
	if err := json.NewDecoder(req.Body).Decode(&dataReq); err != nil {
		log.FuncErrorTrace(0, "Failed to decode HTTP Request body from get users data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to decode HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	role = req.Context().Value("rolename").(string)
	email := req.Context().Value("emailid").(string)

	switch role {
	case "Dealer Owner", "SubDealer Owner":
		query = `
			SELECT t.team_id, t.team_name, COUNT(tm.user_id) AS member_count
			FROM teams t
			JOIN team_members tm ON tm.team_id = t.team_id
			WHERE t.partner_id = (SELECT partner_id FROM user_details WHERE email_id = $1)
			GROUP BY t.team_id
			ORDER BY t.team_id;
		`
	case "Sale Representative", "Regional Manager", "Sales Manager":
		query = `
			WITH member_counts AS (
				SELECT
						tm.team_id,
						COUNT(DISTINCT tm.user_id) AS member_count
				FROM
						team_members tm
				GROUP BY
						tm.team_id
			)
			SELECT
					t.team_id,
					t.team_name,
					mc.member_count,
					(SELECT tm_inner.role_in_team
					FROM team_members tm_inner
					JOIN user_details ud_inner ON tm_inner.user_id = ud_inner.user_id
					WHERE ud_inner.email_id = $1 AND tm_inner.team_id = t.team_id
					LIMIT 1) AS role_in_team
			FROM
					user_details ud
			JOIN
					team_members tm ON ud.user_id = tm.user_id
			JOIN
					teams t ON tm.team_id = t.team_id
			JOIN
					member_counts mc ON t.team_id = mc.team_id
			WHERE
					ud.email_id = $1
			GROUP BY
					t.team_id, t.team_name, mc.member_count;
		`
	default:
		if len(dataReq.DealerNames) > 0 {
			query = `
				SELECT t.team_id, t.team_name, COUNT(tm.user_id) AS member_count
				FROM teams t
				JOIN team_members tm ON tm.team_id = t.team_id
				WHERE t.partner_id IN (
					SELECT partner_id FROM sales_partner_dbhub_schema WHERE sales_partner_name = ANY($1)
				)
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
		appserver.FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
		return
	}

	// Prepare response
	usersNameList := []models.GetTeam{}
	for _, item := range data {
		teamID, teamIDOk := item["team_id"].(int64)
		teamName, teamNameOk := item["team_name"].(string)
		memberCount, memberCountOk := item["member_count"].(int64)
		roleInTeam, _ := item["role_in_team"].(string)
		if !teamIDOk || !teamNameOk || !memberCountOk {
			log.FuncErrorTrace(0, "Failed to parse data for Item: %+v\n", item)
			continue
		}

		if role == "Admin" || role == "Dealer Owner" || role == "SubDealer Owner" {
			roleInTeam = "manager"
		}

		usersData := models.GetTeam{
			TeamId:       teamID,
			TeamName:     teamName,
			TeamStrength: memberCount,
			RoleInTeam:   roleInTeam,
		}
		usersNameList = append(usersNameList, usersData)
	}

	log.FuncInfoTrace(0, "Number of users List fetched : %v list %+v", len(usersNameList), usersNameList)
	appserver.FormAndSendHttpResp(resp, "Users Data", http.StatusOK, usersNameList)
}
