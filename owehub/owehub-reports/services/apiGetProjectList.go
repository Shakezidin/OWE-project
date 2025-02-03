/**************************************************************************
* File                  : apiGetProjectList.go
* DESCRIPTION           : This file contains functions to get all the project list

* DATE                  : 24-january-2025
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
	"strconv"
	// "strings"
)

/******************************************************************************
* FUNCTION:		    HandleGetProjectListRequest
* DESCRIPTION:      handler for get project list data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleGetProjectListRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.GetProjectListRequest
		apiResponse  []models.GetProjectListResponse
		data         []map[string]interface{}
		query        string
		whereEleList []interface{}
		whereClause  string
		recordCount  int64
	)

	log.EnterFn(0, "HandleGetProjectListRequest")

	defer func() { log.ExitFn(0, "HandleGetProjectListRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get project list request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get project list request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get tab project list request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get tab project list Request body", http.StatusInternalServerError, nil)
		return
	}

	whereClause = "WHERE (c.unique_id IS NOT NULL AND c.unique_id != '' AND project_status != 'DUPLICATE')"

	// Search by unique id or customer name
	if dataReq.Search != "" {

		uidSearch := dataReq.Search
		nameSearch := dataReq.Search

		// Check if uidSearch is a number; If it's numeric, prepend "OUR"
		if _, err := strconv.Atoi(uidSearch); err == nil {
			uidSearch = "OUR" + uidSearch
		}

		uidSearch = uidSearch + "%"
		nameSearch = nameSearch + "%"

		whereEleList = append(whereEleList, uidSearch, nameSearch)

		whereClause = fmt.Sprintf(
			"%s AND (TRIM(c.unique_id) ILIKE $%d OR TRIM(c.customer_name) ILIKE $%d)",
			whereClause,
			len(whereEleList)-1,
			len(whereEleList),
		)
	}

	// query to fetch data
	query = fmt.Sprintf(`
			SELECT
				c.customer_name,
				c.unique_id,
				c.address
			FROM customers_customers_schema as c
			%s
			ORDER BY c.unique_id;
		`, whereClause)

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch data", http.StatusBadRequest, nil)
		return
	}

	for _, item := range data {

		pName, ok := item["customer_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get project name: %+v\n", item)
			continue
		}

		pId, ok := item["unique_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get project id: %+v\n", item)
			continue
		}

		pAddress, ok := item["address"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get project address: %+v\n", item)
			continue
		}

		apiResponse = append(apiResponse, models.GetProjectListResponse{
			ProjectName:    pName,
			ProjectId:      pId,
			ProjectAddress: pAddress,
		})
	}
	appserver.FormAndSendHttpResp(resp, "Project Data", http.StatusOK, apiResponse, recordCount)
}
