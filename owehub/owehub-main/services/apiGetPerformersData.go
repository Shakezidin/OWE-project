/**************************************************************************
 * File       	   : apiGetPerformerData.go
 * DESCRIPTION     : This file contains functions for get Adder data handler
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
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandlePerformerDataRequest
 * DESCRIPTION:     handler for get Adder data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandlePerformerDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.GetPerformarDataReq
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	log.EnterFn(0, "HandlePerformerDataRequest")
	defer func() { log.ExitFn(0, "HandlePerformerDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Adder data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Adder data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal perfomer data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get Adder data Request body", http.StatusBadRequest, nil)
		return
	}

	role := req.Context().Value("rolename").(string)
	if role == "" {
		FormAndSendHttpResp(resp, "error while getting role", http.StatusBadRequest, nil)
		return
	}
	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	performerData := models.GetPerformarData{}

	// tableName := db.ViewName_ConsolidatedDataView
	if role == "Dealer Owner" {
		query = `SELECT vd.dealer_name as dealer_name, ud.name as owner_name, vd.dealer_logo as dealer_logo, vd.id as dealer_id FROM user_details ud 
				LEFT JOIN v_dealer vd ON ud.dealer_id = vd.id
				WHERE ud.email_id = $1`
	} else {
		query = `SELECT ud.name as owner_name, vd.dealer_name as dealer_name, vd.dealer_logo as dealer_logo, vd.id as dealer_id FROM user_details ud
				  LEFT JOIN v_dealer vd ON ud.dealer_id = vd.id  
				  WHERE ud.email_id = $1`
	}

	whereEleList = append(whereEleList, dataReq.Email)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adder data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Adder data from DB", http.StatusBadRequest, nil)
		return
	}
	whereEleList = nil

	performerData.DealerId, _ = data[0]["dealer_id"].(int64)
	performerData.OwnerName, _ = data[0]["owner_name"].(string)
	performerData.DealerName, _ = data[0]["dealer_name"].(string)
	performerData.DealerLogo, _ = data[0]["dealer_logo"].(string)

	query = `SELECT
    (SELECT COUNT(DISTINCT ud.team_id)
     FROM user_details ud
     LEFT JOIN user_details ud2 ON ud.dealer_owner = ud2.user_id
     WHERE ud2.name = $1) AS team_count,

    (SELECT COUNT(ud.team_id)
     FROM user_details ud
     LEFT JOIN v_dealer vd ON ud.dealer_id = vd.id
     WHERE vd.dealer_name = $2) AS total_team_strength`

	whereEleList = append(whereEleList, performerData.OwnerName, performerData.DealerName)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adder data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Adder data from DB", http.StatusBadRequest, nil)
		return
	}

	performerData.TeamStrength, _ = data[0]["team_count"].(float64)
	performerData.TotalTeams, _ = data[0]["total_team_strength"].(float64)

	// Send the response
	log.FuncInfoTrace(0, "data fetched for performer data: %v", performerData)
	FormAndSendHttpResp(resp, "performer Data", http.StatusOK, performerData)
}
