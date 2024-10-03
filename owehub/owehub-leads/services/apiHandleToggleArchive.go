/**************************************************************************
* File                  : apiHandleToggleArchive
* DESCRIPTION           : This file contains functions to toggle archive

* DATE                  : 28-September-2024
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
	"strings"
	//"time"
)

/******************************************************************************
* FUNCTION:		    HandleToggleArchive
* DESCRIPTION:      handler for toggle archive request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleToggleArchive(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		dataReq models.ToggleArchiveRequest
		data    []map[string]interface{}
		query   string
	)

	log.EnterFn(0, "HandleToggleArchive")

	defer func() { log.ExitFn(0, "HandleToggleArchive", err) }()

	//Validate that the request body is not nil
	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in toggle archive request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	//read the body of the request
	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body : %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	//Unmarshal the request body into the ToggleArchiveLeadsReq struct
	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal request: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal Request body", http.StatusBadRequest, nil)
		return
	}

	// Create the placeholders for the IN clause: $1, $2, $3, ...
	length := len(dataReq.LeadID)
	if length == 0 {
		err = fmt.Errorf("no lead IDs provided")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "No lead IDs provided", http.StatusBadRequest, nil)
		return
	}

	placeholders := []string{}
	queryParameters := []interface{}{dataReq.IsArchived}
	inputLeadIds := ""

	for i, id := range dataReq.LeadID {
		queryParameters = append(queryParameters, id)
		placeholders = append(placeholders, fmt.Sprintf("$%d", len(queryParameters)))

		if i != 0 {
			inputLeadIds += ", "
		}

		inputLeadIds += fmt.Sprintf("(%d)", id)
	}

	// CHECK if the leads exist in the database
	query = fmt.Sprintf(`
		WITH leads_id_check(id) AS (VALUES %s)
		SELECT leads_id_check.id FROM leads_info RIGHT JOIN leads_id_check ON leads_id = id
		WHERE leads_id IS NULL
	`, inputLeadIds)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)

	if len(data) > 0 {
		ids := []int64{}
		for _, item := range data {
			ids = append(ids, item["id"].(int64))
		}
		err = fmt.Errorf("Couldnt find the following leads in the database: %v", ids)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Couldnt find one or more leads in the database", http.StatusBadRequest, nil)
		return
	}

	// Create the WHERE clause with placeholders
	query = fmt.Sprintf("UPDATE leads_info SET is_archived = $1 WHERE leads_id IN (%s)", strings.Join(placeholders, ", "))

	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, queryParameters)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to archive the lead id's")
		FormAndSendHttpResp(resp, "Failed to archive the lead id's", http.StatusInternalServerError, nil)
		return
	}

	log.DBTransDebugTrace(0, "Leads archived successfully")
	FormAndSendHttpResp(resp, "Lead archived status toggled successfully", http.StatusOK, nil)
}
