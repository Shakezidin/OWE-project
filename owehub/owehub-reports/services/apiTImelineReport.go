/**************************************************************************
 * File       	   : apiSummaryReport.go
 * DESCRIPTION     : This file contains functions to timeline report
 * DATE            : 22-Dec-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"math/rand"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetTimelineAhjFifteenReportRequest
 * DESCRIPTION:     handler for get AHJ+15 Report request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetTimelineAhjFifteenReportRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.SummaryReportRequest
		RecordCount int = 0
		reportResp  models.SummaryReportResponse
	)

	log.EnterFn(0, "HandleGetTimelineAhjFifteenReportRequest")
	defer func() { log.ExitFn(0, "HandleGetTimelineAhjFifteenReportRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get AHJ+15 Report")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get AHJ+15 Report err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get AHJ+15 Report err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal AHJ+15 Report", http.StatusBadRequest, nil)
		return
	}

	/* Dummy Data Sent to API */
	rand.Seed(time.Now().UnixNano())
	//categories := []string{"AHJ +15 Days SLA"}
	reportResp.Data = make(map[string][]models.DataPoint)

	/*for _, category := range categories {
		var data []models.DataPoint = make([]models.DataPoint, 52)
		for i := 0; i < 52; i++ {
			data[i].Value = make(map[string]float64)

			if contains(dataReq.Office, "Tempe") {
				data[i].Value["Tempe"] = rand.Float64()
			}
			if contains(dataReq.Office, "Colorado") {
				data[i].Value["Colorado"] = rand.Float64()
			}
			if contains(dataReq.Office, "Texas") {
				data[i].Value["Texas"] = rand.Float64()
			}
			if contains(dataReq.Office, "#N/A") {
				data[i].Value["#N/A"] = rand.Float64()
			}
			if contains(dataReq.Office, "Tucson") {
				data[i].Value["Tucson"] = rand.Float64()
			}
			if contains(dataReq.Office, "Albuquerque/El Paso") {
				data[i].Value["Albuquerque/El Paso"] = rand.Float64()
			}
			if contains(dataReq.Office, "Peoria/Kingman") {
				data[i].Value["Peoria/Kingman"] = rand.Float64()
			}
		}
		reportResp.Data[category] = data
	}*/

	appserver.FormAndSendHttpResp(resp, "AHJ+15 Report", http.StatusOK, reportResp, int64(RecordCount))
}

/******************************************************************************
 * FUNCTION:		HandleGetTimelineInstallToFinReportRequest
 * DESCRIPTION:     handler for get Install To Fin Report request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetTimelineInstallToFinReportRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.SummaryReportRequest
		RecordCount int = 0
		reportResp  models.SummaryReportResponse
	)

	log.EnterFn(0, "HandleGetTimelineInstallToFinReportRequest")
	defer func() { log.ExitFn(0, "HandleGetTimelineInstallToFinReportRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Install To Fin Report")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Install To Fin Report err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Install To Fin Report err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Install To Fin Report", http.StatusBadRequest, nil)
		return
	}

	/* Dummy Data Sent to API */
	rand.Seed(time.Now().UnixNano())
	//categories := []string{"AHJ +15 Days SLA"}
	reportResp.Data = make(map[string][]models.DataPoint)

	/*for _, category := range categories {
		var data []models.DataPoint = make([]models.DataPoint, 52)
		for i := 0; i < 52; i++ {
			data[i].Value = make(map[string]float64)

			if contains(dataReq.Office, "Tempe") {
				data[i].Value["Tempe"] = rand.Float64()
			}
			if contains(dataReq.Office, "Colorado") {
				data[i].Value["Colorado"] = rand.Float64()
			}
			if contains(dataReq.Office, "Texas") {
				data[i].Value["Texas"] = rand.Float64()
			}
			if contains(dataReq.Office, "#N/A") {
				data[i].Value["#N/A"] = rand.Float64()
			}
			if contains(dataReq.Office, "Tucson") {
				data[i].Value["Tucson"] = rand.Float64()
			}
			if contains(dataReq.Office, "Albuquerque/El Paso") {
				data[i].Value["Albuquerque/El Paso"] = rand.Float64()
			}
			if contains(dataReq.Office, "Peoria/Kingman") {
				data[i].Value["Peoria/Kingman"] = rand.Float64()
			}
		}
		reportResp.Data[category] = data
	}*/

	appserver.FormAndSendHttpResp(resp, "Install To Fin Report", http.StatusOK, reportResp, int64(RecordCount))
}
