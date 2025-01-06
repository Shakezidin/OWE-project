/**************************************************************************
* File			: apiEditReport.go
* DESCRIPTION	: This file contains functions for EditReport handler
* DATE			: 6-Jan-2025
**************************************************************************/

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
    "strings"
)

/******************************************************************************
 * FUNCTION:		HandleEditReportRequest
 * DESCRIPTION:     handler for EditReport request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleEditReportRequest(resp http.ResponseWriter, req *http.Request) {
    var (
        err          error
        whereEleList []interface{}
        updateFields []string
        dataReq      models.EditReportReq
        query        string
    )

    log.EnterFn(0, "HandleEditReportRequest")
    defer func() { log.ExitFn(0, "HandleEditReportRequest", err) }()

    if req.Body == nil {
        err = fmt.Errorf("HTTP Request body is null in update request")
        log.FuncErrorTrace(0, "%v", err)
        appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
        return
    }

    reqBody, err := ioutil.ReadAll(req.Body)
    if err != nil {
        log.FuncErrorTrace(0, "Failed to read HTTP Request body: %v", err)
        appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
        return
    }

    err = json.Unmarshal(reqBody, &dataReq)
    if err != nil {
        log.FuncErrorTrace(0, "Failed to unmarshal request: %v", err)
        appserver.FormAndSendHttpResp(resp, "Failed to unmarshal request", http.StatusBadRequest, nil)
        return
    }

    // Validate ReportId check
    if dataReq.ReportId <= 0 {
        err = fmt.Errorf("invalid report ID %d", dataReq.ReportId)
        log.FuncErrorTrace(0, "%v", err)
        appserver.FormAndSendHttpResp(resp, "Invalid report ID, update failed", http.StatusBadRequest, nil)
        return
    }

    if len(dataReq.Category) > 0 {
        whereEleList = append(whereEleList, dataReq.Category)
        updateFields = append(updateFields, fmt.Sprintf("category = $%d", len(whereEleList)))
    }

    if len(dataReq.Title) > 0 {
        whereEleList = append(whereEleList, dataReq.Title)
        updateFields = append(updateFields, fmt.Sprintf("title = $%d", len(whereEleList)))
    }

    if len(dataReq.Subtitle) > 0 {
        whereEleList = append(whereEleList, dataReq.Subtitle)
        updateFields = append(updateFields, fmt.Sprintf("subtitle = $%d", len(whereEleList)))
    }

    if len(dataReq.DashboardId) > 0 {
        whereEleList = append(whereEleList, dataReq.DashboardId)
        updateFields = append(updateFields, fmt.Sprintf("dashboard_id = $%d", len(whereEleList)))
    }

    if len(updateFields) == 0 {
        err = fmt.Errorf("no fields provided to update")
        log.FuncErrorTrace(0, "%v", err)
        appserver.FormAndSendHttpResp(resp, "No fields provided to update", http.StatusBadRequest, nil)
        return
    }

    whereEleList = append(whereEleList, dataReq.ReportId)
    query = fmt.Sprintf("UPDATE %s SET %s WHERE id = $%d", db.TableName_SupersetReports, strings.Join(updateFields, ", "), len(whereEleList))

    err, res := db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)

    if err != nil {
        log.FuncErrorTrace(0, "Failed to update report info: %v", err)
        appserver.FormAndSendHttpResp(resp, "Failed to update report info", http.StatusInternalServerError, nil)
        return
    }

    if res == 0 {
        log.FuncErrorTrace(0, "No rows updated for report details: %v", err)
        appserver.FormAndSendHttpResp(resp, "No rows were updated", http.StatusInternalServerError, nil)
        return
    }
    appserver.FormAndSendHttpResp(resp, "Report info updated successfully.", http.StatusOK, nil)
}
