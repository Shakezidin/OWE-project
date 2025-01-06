/*****************************************************************************
 * File       	   : apiGetReportById.go
 * DESCRIPTION     : This file contains functions to get superset report by id
 * DATE            : 6-Jan-2025
 ****************************************************************************/

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
    //"strings"
)

/******************************************************************************
 * FUNCTION:				HandleGetReportById
 * DESCRIPTION:     handler for get superset report request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/

func HandleGetReportById(resp http.ResponseWriter, req *http.Request) {
    var (
        err     error
        query   string
        data    []map[string]interface{}
        apiResp models.GetReportByIdResponse
        dataReq models.GetReportByIdReq
    )

    log.EnterFn(0, "HandleGetReportById")
    defer func() { log.ExitFn(0, "HandleGetReportById", err) }()

    if req.Body == nil {
        err = fmt.Errorf("HTTP Request body is null")
        log.FuncErrorTrace(0, "%v", err)
        appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
        return
    }

    reqBody, err := ioutil.ReadAll(req.Body)
    if err != nil {
        log.FuncErrorTrace(0, "Failed to read HTTP Request Body err: %v", err)
        appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
        return
    }

    err = json.Unmarshal(reqBody, &dataReq)
    if err != nil {
        log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request Body err: %v", err)
        appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request Body", http.StatusBadRequest, nil)
        return
    }

    query = fmt.Sprintf(`
        SELECT
            category,
            title,
            subtitle,
            dashboard_id
        FROM
            %s
        WHERE
            id = %d
    `, db.TableName_SupersetReports, dataReq.ReportId)



    data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
    if err != nil {
        log.FuncErrorTrace(0, "Failed to get superset report from DB err: %v", err)
        appserver.FormAndSendHttpResp(resp, "Failed to get superset report", http.StatusInternalServerError, nil)
        return
    }

    if len(data) == 0 {
        log.FuncErrorTrace(0, "No report found for the given ID")
        appserver.FormAndSendHttpResp(resp, "No report found", http.StatusNotFound, nil)
        return
    }

    report := data[0]
    apiResp = models.GetReportByIdResponse{
        Category:    report["category"].(string),
        Title:       report["title"].(string),
        Subtitle:    report["subtitle"].(string),
        DashboardId: report["dashboard_id"].(string),
    }

    appserver.FormAndSendHttpResp(resp, "Report data retrieved successfully", http.StatusOK, apiResp)
}
