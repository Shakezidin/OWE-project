/*****************************************************************************
* File                  : isOweDbReady.go
* DESCRIPTION           : This file contains code which will show status of
*                         owe database
*
* DATE                  : 21-Jan-2024
******************************************************************************/

package services

import (
    "net/http"
    "OWEApp/shared/appserver"
    log "OWEApp/shared/logger"
    "io/ioutil"
)


func HandleForwardIsOweDbReadyRequest(resp http.ResponseWriter, req *http.Request) {
    log.EnterFn(0, "HandleForwardIsOweDbReadyRequest")
    defer func() { log.ExitFn(0, "HandleForwardIsOweDbReadyRequest", nil) }()


    owe_db_url := "http://66.42.100.177:80/api/IsOweDbReady"
    owe_db_resp, err := http.Post(owe_db_url, "application/json", nil)
    if err != nil {
        log.FuncErrorTrace(0, "Failed to call existing API: %v", err)
        appserver.FormAndSendHttpResp(resp, "Failed to call existing API", http.StatusInternalServerError, nil)
        return
    }
    defer owe_db_resp.Body.Close()

    // Read the response body
    body, err := ioutil.ReadAll(owe_db_resp.Body)
    if err != nil {
        log.FuncErrorTrace(0, "Failed to read response from existing API: %v", err)
        appserver.FormAndSendHttpResp(resp, "Failed to read response from existing API", http.StatusInternalServerError, nil)
        return
    }

    // Forward the response to the frontend
    resp.Header().Set("Content-Type", "application/json")
    resp.WriteHeader(owe_db_resp.StatusCode)
    resp.Write(body)
}
