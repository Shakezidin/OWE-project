/**************************************************************************
 * File       	   : apiGetAppointmentSettersUnder.go
 * DESCRIPTION     : This file contains functions for get sales reps handler
 * DATE            : 26-november-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"fmt"

	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetAppointmentSettersUnderRequest
 * DESCRIPTION:     handler for get sales reps request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetAppointmentSettersUnderRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		query        string
		whereEleList []interface{}
		data         []map[string]interface{}
	)

	log.EnterFn(0, "HandleGetAppointmentSettersUnderRequest")
	defer func() { log.ExitFn(0, "HandleGetAppointmentSettersUnderRequest", err) }()

	authenticatedEmailId := req.Context().Value("emailid").(string)

	query = fmt.Sprintf("SELECT * FROM %s($1)", db.GetSalesRepsUnderFunction)
	whereEleList = []interface{}{authenticatedEmailId}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get sales reps under %v err: %v", authenticatedEmailId, err)
		appserver.FormAndSendHttpResp(resp, "Internal Server Error", http.StatusInternalServerError, nil)
		return
	}

	apiResp := []models.GetSaleRepsResponseItem{}

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

		apiResp = append(apiResp, models.GetSaleRepsResponseItem{
			ID:   userId,
			Name: name,
			Role: roleName,
		})
	}

	log.FuncDebugTrace(0, "Number of sales reps under %v list %+v", authenticatedEmailId, data)

	appserver.FormAndSendHttpResp(resp, "Sale Reps", http.StatusOK, apiResp)
}
