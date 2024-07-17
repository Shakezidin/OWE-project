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
	"strings"

	"encoding/json"
	"fmt"
	"net/http"
)

/******************************************************************************
* FUNCTION:		HandleGetTeamsDataRequest
* DESCRIPTION:     handler for get users by role request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetTeamDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err   error
		query string
		data  []map[string]interface{}
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

	queryForHeader := `
    SELECT
        u.name AS user_name,
        u.mobile_number,
        rm.name AS reporting_manager_name
    FROM
        user_details u
    LEFT JOIN
        user_details rm ON u.reporting_manager = rm.user_id
    WHERE
        u.user_id = $1
    ORDER BY
        u.user_id;
	 `
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForHeader, []interface{}{dataReq.ManagerId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
		return
	}

	regionalManager := data[0]["reporting_manager_name"].(string)
	salesManager := data[0]["user_name"].(string)
	query = `
		SELECT
			name,
			email_id,
			mobile_number AS phone_number,
			user_id
			FROM
					user_details
			WHERE
					team_id = $1 
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
	for _, item := range data {
		name, nameOk := item["name"].(string)
		if !nameOk || name == "" {
			log.FuncErrorTrace(0, "Failed to get Name for Item: %+v\n", item)
			name = ""
		}
		Email, ok := item["email_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get TeamId for Item: %+v\n", item)
			continue
		}
		Phone, ok := item["phone_number"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get TeamId for Item: %+v\n", item)
			continue
		}
		Id, ok := item["user_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Id for Item: %+v\n", item)
			continue
		}

		usersData := models.GetRepResponse{
			Id:          Id,
			SaleRepName: name,
			EmailId:     Email,
			PhoneNumber: Phone,
		}
		usersNameList = append(usersNameList, usersData)
	}

	TeamResp := models.GetTeamResponse{
		TeamName:            dataReq.TeamName,
		ManagerName:         salesManager,
		RegionalManagerName: regionalManager,
		SaleRep:             usersNameList,
		TeamID:              dataReq.TeamId,
	}

	log.FuncInfoTrace(0, "Number of users List fetched : %v list %+v", len(TeamResp.SaleRep), usersNameList)
	FormAndSendHttpResp(resp, "Users Data", http.StatusOK, TeamResp)
}

/******************************************************************************
 * FUNCTION:		PrepareStateFilters
 * DESCRIPTION:     handler for create select query
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareTeamsFilters(tableName string, dataFilter models.GetTeamRequest, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareFilters")
	defer func() { log.ExitFn(0, "PrepareFilters", nil) }()

	var filtersBuilder strings.Builder

	if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
		offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
		filtersBuilder.WriteString(fmt.Sprintf(" OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
	}

	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filtersBuilder.String())
	return filters, whereEleList
}
