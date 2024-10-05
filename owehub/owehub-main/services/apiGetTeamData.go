// /**************************************************************************
//  * File       	   : apiGetTeamData.go
//  * DESCRIPTION     : This file contains functions for get teams data handler
//  * DATE            : 22-Jan-2024
//  **************************************************************************/

package services

// import (
// 	"OWEApp/shared/db"
// 	log "OWEApp/shared/logger"
// 	models "OWEApp/shared/models"

// 	"encoding/json"
// 	"fmt"
// 	"io/ioutil"
// 	"net/http"
// )

// /******************************************************************************
//  * FUNCTION:		HandleGetTeamDataRequest
//  * DESCRIPTION:     handler for  get teams datarequest
//  * INPUT:			resp, req
//  * RETURNS:    		void
//  ******************************************************************************/
// func HandleGetTeamDataRequest(resp http.ResponseWriter, req *http.Request) {
// 	var (
// 		err          error
// 		dataReq      models.DataRequestBody
// 		data         []map[string]interface{}
// 		whereEleList []interface{}
// 		query        string
// 		filter       string
// 	)

// 	log.EnterFn(0, "HandleGetTeamDataRequest")
// 	defer func() { log.ExitFn(0, "HandleGetTeamDataRequest", err) }()

// 	if req.Body == nil {
// 		err = fmt.Errorf("HTTP Request body is null in get teams data request")
// 		log.FuncErrorTrace(0, "%v", err)
// 		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
// 		return
// 	}

// 	reqBody, err := ioutil.ReadAll(req.Body)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get teams data request err: %v", err)
// 		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
// 		return
// 	}

// 	err = json.Unmarshal(reqBody, &dataReq)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "Failed to unmarshal get teams data request body err: %v", err)
// 		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get teams data Request body ", http.StatusBadRequest, nil)
// 		return
// 	}

// 	tableName := db.TableName_teams
// 	query = fmt.Sprintf("SELECT * FROM %s", tableName)
// 	filter, whereEleList = PrepareFilters(tableName, dataReq)
// 	if filter != "" {
// 		query += filter
// 	}

// 	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "Failed to get teams data from DB err: %v", err)
// 		appserver.FormAndSendHttpResp(resp, "Failed to get teams data from DB", http.StatusBadRequest, nil)
// 		return
// 	}

// 	teamsList := models.TeamsList{}
// 	for _, item := range data {
// 		teamName, ok := item["team_name"].(string)
// 		if !ok {
// 			continue
// 		}
// 		teamsList.TeamsList = append(teamsList.TeamsList, models.TeamData{TeamName: teamName})
// 	}

// 	// Send the response
// 	log.FuncInfoTrace(0, "Number of teams list fetched : %v list %+v", len(teamsList.TeamsList), teamsList)
// 	appserver.FormAndSendHttpResp(resp, "Teams data", http.StatusOK, teamsList)
// }
