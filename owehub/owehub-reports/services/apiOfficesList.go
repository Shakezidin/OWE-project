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
	"OWEApp/shared/types"
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

	for officeName := range types.CommGlbCfg.ReportsOfficeMapping.ReportToDbMap {
		apiResponse.Offices = append(apiResponse.Offices, officeName)
	}
	// code for state data

	query := "select distinct state as distinct_state from pv_install_install_subcontracting_schema;"

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
}
