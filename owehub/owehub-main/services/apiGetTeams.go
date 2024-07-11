/**************************************************************************
 * File       	   : apiGetTeams.go
 * DESCRIPTION     : This file contains functions for get users data handler
 * DATE            : 23-Apr-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetTeamsDataRequest
 * DESCRIPTION:     handler for get users by role request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetTeamsDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err   error
		query string
		data  []map[string]interface{}
	)

	log.EnterFn(0, "HandleGetTeamsDataRequest")
	defer func() { log.ExitFn(0, "HandleGetTeamsDataRequest", err) }()

	// if req.Body == nil {
	// 	err = fmt.Errorf("HTTP Request body is null in get users data request")
	// 	log.FuncErrorTrace(0, "%v", err)
	// 	FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
	// 	return
	// }

	// var dataReq models.GetTeams
	// if err := json.NewDecoder(req.Body).Decode(&dataReq); err != nil {
	// 	log.FuncErrorTrace(0, "Failed to decode HTTP Request body from get users data request err: %v", err)
	// 	FormAndSendHttpResp(resp, "Failed to decode HTTP Request body", http.StatusBadRequest, nil)
	// 	return
	// }

	queryForTeamStrength := `SELECT team_id, COUNT(*) AS member_count, name
		FROM user_details
		GROUP BY team_id, name
		ORDER BY team_id;
	`
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForTeamStrength, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
		return
	}
	teamCountMap := getTeamCountMap(data)

	query = `
		SELECT tm.team_id, tm.team_name, ud.user_id, ud.name
		FROM teams tm
		LEFT JOIN user_details ud ON ud.team_id = tm.team_id;
	`
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
		return
	}

	usersNameList := []models.GetTeam{}

	for _, item := range data {
		name, nameOk := item["team_name"].(string)
		if !nameOk || name == "" {
			log.FuncErrorTrace(0, "Failed to get Name for Item: %+v\n", item)
			name = ""
		}
		teamID, ok := item["team_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get TeamId for Item: %+v\n", item)
			// continue
		}
		ManagerName, ok := item["name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get TeamId for Item: %+v\n", item)
			// continue
		}
		ManagerId, ok := item["user_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get TeamId for Item: %+v\n", item)
			// continue
		}
		teamStrength, strengthOk := teamCountMap[teamID]
		if !strengthOk {
			log.FuncErrorTrace(0, "Failed to get TeamStrength for Team ID: %d\n", teamID)
			// continue
		}
		usersData := models.GetTeam{
			TeamName:     name,
			TeamId:       teamID,
			TeamStrength: teamStrength,
			Name:         ManagerName,
			ManagerId:    ManagerId,
		}
		usersNameList = append(usersNameList, usersData)
	}

	log.FuncInfoTrace(0, "Number of users List fetched : %v list %+v", len(usersNameList), usersNameList)
	FormAndSendHttpResp(resp, "Users Data", http.StatusOK, usersNameList)
}

func getTeamCountMap(data []map[string]interface{}) map[int64]int64 {
	teamCount := make(map[int64]int64)
	for _, item := range data {
		teamID, ok1 := item["team_id"].(int64)
		count, ok2 := item["member_count"].(int64)

		if !ok1 || !ok2 {
			continue
		}
		teamCount[teamID] = count
	}
	return teamCount
}
