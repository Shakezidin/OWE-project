/**************************************************************************
* File                  : apiGetDropDown.go
* DESCRIPTION           : This file contains functions to get all the drop downs in Dat tool

* DATE                  : 5-january-2025
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	// "strings"
)

/******************************************************************************
* FUNCTION:		    HandleGetDropDownListRequest
* DESCRIPTION:      handler for get drop down list data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleGetDropDownListRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.GetProjectListRequest
		apiResponse []models.GetProjectListResponse
		// data             []map[string]interface{}
		// query            string
		// whereEleList     []interface{}
		// whereClause      string
		// recordCount      int64
		// paginationClause string
		// sortValue        string
	)

	log.EnterFn(0, "HandleGetDropDownListRequest")

	defer func() { log.ExitFn(0, "HandleGetDropDownListRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get drop down list request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get drop down list request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get drop down list request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get drop down project list Request body", http.StatusInternalServerError, nil)
		return
	}

	apiResponse = append(apiResponse, models.GetProjectListResponse{})
	appserver.FormAndSendHttpResp(resp, "Project Data", http.StatusOK, apiResponse, 0)
}
