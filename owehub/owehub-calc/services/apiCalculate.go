package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		Calculate
 * DESCRIPTION:
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func Calculate(resp http.ResponseWriter, req *http.Request) {
	var (
		err error
	)

	log.EnterFn(0, "Calculate")

	defer func() { log.ExitFn(0, "Calculate", err) }()
	_, err = db.ReteriveFromDB(db.OweHubDbIndex, "query", []interface{}{})

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ---- data from db err: %v", err)
		appserver.FormAndSendHttpResp(resp, "", http.StatusInternalServerError, nil)
	}

}
