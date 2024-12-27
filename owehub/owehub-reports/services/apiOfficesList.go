/**************************************************************************
* File                  : apiOfficeList.go
* DESCRIPTION           : This file contains functions to return the slice of offices.

* DATE                  : 26-December-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"net/http"
)

/******************************************************************************
* FUNCTION:		    HandleGetOfficesListRequest
* DESCRIPTION:      handler for get office data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleGetOfficesListRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		apiResponse models.GetOfficesListResponse
	)

	log.EnterFn(0, "HandleGetOfficesListRequest")

	defer func() { log.ExitFn(0, "HandleGetOfficesListRequest", err) }()

	// code for office data
	query := "select distinct office as distinct_office from pv_install_install_subcontracting_schema;"

	Offices, err := db.ReteriveFromDB(db.RowDataDBIndex, query, nil)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch data", http.StatusBadRequest, nil)
		return
	}

	for _, item := range Offices {
		office, ok := item["distinct_office"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get office name from pv install table: %+v\n", item)
			continue
		}
		apiResponse.Offices = append(apiResponse.Offices, office)
	}

	// code for state data

	query = "select distinct state as distinct_state from pv_install_install_subcontracting_schema;"

	States, err := db.ReteriveFromDB(db.RowDataDBIndex, query, nil)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch data", http.StatusBadRequest, nil)
		return
	}

	for _, item := range States {
		state, ok := item["distinct_state"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get state name from pv install table: %+v\n", item)
			continue
		}
		apiResponse.States = append(apiResponse.States, state)
	}

	// code for Ahj

	query = "select distinct ahj as distinct_ahj from pv_install_install_subcontracting_schema;"

	Ahj, err := db.ReteriveFromDB(db.RowDataDBIndex, query, nil)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch data", http.StatusBadRequest, nil)
		return
	}

	for _, item := range Ahj {
		ahj, ok := item["distinct_ahj"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get ahj name from pv install table: %+v\n", item)
			continue
		}
		apiResponse.Ahj = append(apiResponse.Ahj, ahj)
	}

	appserver.FormAndSendHttpResp(resp, "Office Data", http.StatusOK, apiResponse)
	// appserver.FormAndSendHttpResp(resp, "Office Data", http.StatusOK, apiResponse.Offices, recordCount)
	// appserver.FormAndSendHttpResp(resp, "State Data", http.StatusOK, apiResponse.States, recordCount1)
	// appserver.FormAndSendHttpResp(resp, "Ahj Data", http.StatusOK, apiResponse.Ahj, recordCount2)
}
