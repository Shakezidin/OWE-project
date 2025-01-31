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
	"strings"
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
		apiResponse  models.GetProjectListResponse
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

	// Code for search
	if dataReq.Search != "" {
		// Normalize the search input
		searchInput := strings.ToUpper(dataReq.Search)

		// Check if the search input is purely numeric
		if _, err := strconv.Atoi(dataReq.Search); err == nil {
			// If it's numeric, append "OUR" to the number
			modifiedSearch := fmt.Sprintf("OUR%s", dataReq.Search)
			// If it's numeric, modify the whereClause to search for project_id/unique_id equal to that number
			whereEleList = append(whereEleList, fmt.Sprintf("%%%s%%", modifiedSearch))
			whereClause = fmt.Sprintf(
				"%s AND c.unique_id::text ILIKE $%d)",
				whereClause[0:len(whereClause)-1],
				len(whereEleList),
			)
		}

		// If the search starts with "OUR", handle project_id/unique_id search
		if strings.HasPrefix(searchInput, "OUR") {
			searchIdStr := strings.TrimPrefix(searchInput, "OUR")
			// Allow empty suffix or numeric suffix after "OUR"
			if _, atoiErr := strconv.Atoi(searchIdStr); atoiErr == nil || searchIdStr == "" {
				whereEleList = append(whereEleList, fmt.Sprintf("OUR%s%%", searchIdStr))
				whereClause = fmt.Sprintf(
					"%s AND c.unique_id::text ILIKE $%d)",
					whereClause[0:len(whereClause)-1],
					len(whereEleList),
				)
			}
		}
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

		apiResponse.ProjectData = append(apiResponse.ProjectData, models.GetProjectData{
			ProjectName:    pName,
			ProjectId:      pId,
			ProjectAddress: pAddress,
		})
	}
	appserver.FormAndSendHttpResp(resp, "Project Data", http.StatusOK, apiResponse, recordCount)
}
