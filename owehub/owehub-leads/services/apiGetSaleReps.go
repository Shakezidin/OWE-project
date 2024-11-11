/**************************************************************************
 * File       	   : apiGetSaleReps.go
 * DESCRIPTION     : This file contains functions for get sales reps handler
 * DATE            : 24-Jun-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"

	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetSalesRepsRequest
 * DESCRIPTION:     handler for get sales reps request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetSalesRepsRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err  error
		data []interface{}
	)

	log.EnterFn(0, "HandleGetSalesRepsRequest")
	defer func() { log.ExitFn(0, "HandleGetSalesRepsRequest", err) }()

	authenticatedEmailId := req.Context().Value("emailid").(string)

	data, err = db.CallDBFunction(db.OweHubDbIndex, db.GetSalesRepsUnderFunction, []interface{}{authenticatedEmailId})

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get sales reps under %v err: %v", authenticatedEmailId, err)
		appserver.FormAndSendHttpResp(resp, "Internal Server Error", http.StatusInternalServerError, nil)
		return
	}

	apiResp := []models.GetSaleRepsResponseItem{}

	for _, item := range data {
		record, ok := item.(map[string]interface{})
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert record under %v, item: %v", authenticatedEmailId, item)
			continue
		}

		userId, ok := record["user_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert user id under %v, item: %v", authenticatedEmailId, record)
		}
		name, ok := record["name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert name under %v, item: %v", authenticatedEmailId, record)
		}
		roleName, ok := record["role_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert role name under %v, item: %v", authenticatedEmailId, record)
		}

		apiResp = append(apiResp, models.GetSaleRepsResponseItem{
			ID:   userId,
			Name: name,
			Role: roleName,
		})
	}

	log.FuncDebugTrace(0, "Number of sales reps under %v list %+v", authenticatedEmailId, data)

	appserver.FormAndSendHttpResp(resp, "Sale Reps", http.StatusOK, apiResp)
}
