/**************************************************************************
 * File       	   : apiEditReport.go
 * DESCRIPTION     : This file contains functions to edit superset report
 * DATE            : 6-Jan-2025
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
		 //"strings"
 )

 /******************************************************************************
	* FUNCTION:				HandleEditReportRequest
	* DESCRIPTION:     handler for edit report request
	* INPUT:						resp, req
	* RETURNS:    			void
	******************************************************************************/
 func HandleEditReportRequest(resp http.ResponseWriter, req *http.Request) {
		 var (
				 err     error
				 query   string
				 dataReq models.EditReportReq
		 )

		 log.EnterFn(0, "HandleEditReportRequest")
		 defer func() { log.ExitFn(0, "HandleEditReportRequest", err) }()

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
				 UPDATE %s
				 SET
						 category = '%s',
						 title = '%s',
						 subtitle = '%s',
						 dashboard_id = '%s'
				 WHERE
						 id = %d
		 `, db.TableName_SupersetReports, dataReq.Category, dataReq.Title, dataReq.Subtitle, dataReq.DashboardId, dataReq.ReportId)


		 log.FuncErrorTrace(0, "Executing query: %s", query)

		 err, res := db.UpdateDataInDB(db.OweHubDbIndex, query, nil)
		 if err != nil {
				 log.FuncErrorTrace(0, "Failed to update superset report in DB err: %v", err)
				 appserver.FormAndSendHttpResp(resp, "Failed to update superset report", http.StatusInternalServerError, nil)
				 return
		 }

		 if err != nil {
			log.FuncErrorTrace(0, "Failed to edit report : %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to edit report", http.StatusInternalServerError, nil)
			return
		}

		if res == 0 {
			log.FuncErrorTrace(0, "No rows updated for report id: %v", err)
			appserver.FormAndSendHttpResp(resp, "No rows were updated", http.StatusInternalServerError, nil)
			return
		}
		appserver.FormAndSendHttpResp(resp, "report updated successfully.", http.StatusOK, nil)
	}
