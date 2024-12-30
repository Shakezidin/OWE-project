/**************************************************************************
* File                  : apiAhjFifteenProjectList.go
* DESCRIPTION           : This file contains functions to get leads information and get leads count status
							information

* DATE                  : 28-December-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

/******************************************************************************
* FUNCTION:		    HandleAhjFifteenProjectListRequest
* DESCRIPTION:      handler for Ahj Fifteen data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleAhjFifteenProjectListRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.AhjFifteenProjectListRequest
		apiResponse  []models.AhjFifteenProjectListResponse
		whereEleList []interface{}
		recordCount  int64
		slaOperator  string // it can be > or <
	)

	log.EnterFn(0, "HandleAhjFifteenProjectListRequest")

	defer func() { log.ExitFn(0, "HandleAhjFifteenProjectListRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in ahj fifteen project list data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from ahj fifteen project request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal ahj fifteen project list data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal afj fifteen project list data Request body", http.StatusInternalServerError, nil)
		return
	}

	// for offices
	escapedOffices := []string{}
	for _, item := range dataReq.Office {
		keys := getDBOfficeNames(item)
		for _, item = range keys {
			escapedOffices = append(escapedOffices, "'"+strings.ReplaceAll(item, "'", "''")+"'")
		}
	}

	officeFilter := fmt.Sprintf("pv.office in (%s)", strings.Join(escapedOffices, ","))

	// for ahj
	escapedAhj := []string{}
	for _, item := range dataReq.Ahj {
		escapedAhj = append(escapedAhj, "'"+strings.ReplaceAll(item, "'", "''")+"'")
	}

	ahjFilter := fmt.Sprintf("pv.ahj in (%s)", strings.Join(escapedAhj, ","))

	// for states
	escapedStates := []string{}
	for _, item := range dataReq.State {
		escapedStates = append(escapedStates, "'"+strings.ReplaceAll(item, "'", "''")+"'")
	}

	stateFilter := fmt.Sprintf("cu.state in (%s)", strings.Join(escapedStates, ","))

	if dataReq.Condition == "within" {
		slaOperator = "<"
	}
	if dataReq.Condition == "outside" {
		slaOperator = ">"
	}

	query := fmt.Sprintf(`
SELECT 
    cu.project_id,   
    cu.customer_name, 
    cu.address
FROM 
    customers_customers_schema AS cu
JOIN 
    pv_install_install_subcontracting_schema AS pv
    ON cu.unique_id = pv.customer_unique_id
JOIN 
    ahj_db_database_hub_schema AS ah
    ON pv.ahj = ah.title
WHERE 
    DATE_PART('year', pv.pv_completion_date) = $1
    AND (%s)  -- Offices filter
    AND (%s)  -- ahj filterS
    AND (%s)  -- states filter
    AND ah.ahj_timeline IS NOT NULL
    AND ah.ahj_timeline != ''
	AND (DATE_PART('quarter', pv.pv_completion_date) = %d)  -- Quarter filter condition (added dynamically)
    AND DATE_PART('day', pv.pv_completion_date - cu.sale_date) %s (CAST(ah.ahj_timeline AS INT) + 15)  -- SLA condition
	AND (pv.project_status IN ('ACTIVE', ''))
ORDER BY 
    cu.project_id;    
`, officeFilter, ahjFilter, stateFilter, dataReq.Quarter, slaOperator)

	// Adding where conditions dynamically
	whereEleList = append(whereEleList, dataReq.Year)

	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get project_list from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch project_list", http.StatusInternalServerError, nil)
		return
	}

	for _, item := range data {

		project_id, ok := item["project_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get leads id from leads info Item: %+v\n", item)
			continue
		}

		customer_name, ok := item["customer_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get first_name from leads info Item: %+v\n", item)
		}

		address, ok := item["address"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get first_name from leads info Item: %+v\n", item)
		}

		apiResponse = append(apiResponse, models.AhjFifteenProjectListResponse{
			ProjectId:    project_id,
			CustomerName: customer_name,
			Address:      address,
		})

	}

	appserver.FormAndSendHttpResp(resp, "Data", http.StatusOK, apiResponse, recordCount)

}
