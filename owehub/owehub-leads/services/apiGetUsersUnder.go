/**************************
 * File       	   : apiGetUsersUnder.go
 * DESCRIPTION     : This file contains functions for get sales reps handler
 * DATE            : 24-Jun-2024
 **************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"fmt"

	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/lib/pq"
)

/**************************
 * FUNCTION:		HandleGetUsersUnderRequest
 * DESCRIPTION:     handler for get sales reps request
 * INPUT:			resp, req
 * RETURNS:    		void
 **************************/
func HandleGetUsersUnderRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		query        string
		whereEleList []interface{}
		data         []map[string]interface{}
		dataReq      models.GetSalesRepRequest
	)

	log.EnterFn(0, "HandleGetUsersUnderRequest")
	defer func() { log.ExitFn(0, "HandleGetUsersUnderRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get leads data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get leads data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get leads data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get leads data Request body", http.StatusInternalServerError, nil)
		return
	}

	authenticatedEmailId := req.Context().Value("emailid").(string)

	query = fmt.Sprintf("SELECT * FROM %s($1,$2)", db.GetUsersUnderFunction)
	whereEleList = []interface{}{authenticatedEmailId, pq.Array(dataReq.Roles)}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get users under %v err: %v", authenticatedEmailId, err)
		appserver.FormAndSendHttpResp(resp, "Internal Server Error", http.StatusInternalServerError, nil)
		return
	}

	apiResp := models.GetSaleRepsResponse{}

	for _, item := range data {

		userId, ok := item["user_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert user id under %v, item: %v", authenticatedEmailId, item)
		}
		name, ok := item["name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert name under %v, item: %v", authenticatedEmailId, item)
		}
		roleName, ok := item["role_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert role name under %v, item: %v", authenticatedEmailId, item)
		}

		_, roleExistInMap := apiResp[roleName]
		if roleExistInMap {
			apiResp[roleName] = append(apiResp[roleName], models.GetSaleRepsResponseItem{
				ID:   userId,
				Name: name,
			})
			continue
		}
		apiResp[roleName] = []models.GetSaleRepsResponseItem{{
			ID:   userId,
			Name: name,
		}}
	}

	log.FuncDebugTrace(0, "Number of sales reps under %v list %+v", authenticatedEmailId, data)

	appserver.FormAndSendHttpResp(resp, "Users ", http.StatusOK, apiResp)
}
