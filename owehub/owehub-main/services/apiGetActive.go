/**************************************************************************
 * File       	   : apiGetActive.go
 * DESCRIPTION     : This file contains functions for create user handler
 * DATE            : 20-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"

	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetActiveAndStartTime
 * DESCRIPTION:     handler for get active and startTime of the db
 * INPUT:			 resp, req
 * RETURNS:    	void
 ******************************************************************************/
func HandleGetActiveAndStartTime(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		query        string
		whereEleList []interface{}
		data         []map[string]interface{}
	)

	log.EnterFn(0, "HandleGetActiveAndStartTime")
	defer func() { log.ExitFn(0, "HandleGetActiveAndStartTime", err) }()

	query = `SELECT pg_postmaster_start_time() AS start_time`
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get start time  in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create User", http.StatusInternalServerError, nil)
		return
	}

	// Send the response
	log.FuncInfoTrace(0, "SELECT pg_postmaster_start_time() AS start_time: %v list %+v", data, data)
	appserver.FormAndSendHttpResp(resp, "Data base tables", http.StatusOK, data)

}
