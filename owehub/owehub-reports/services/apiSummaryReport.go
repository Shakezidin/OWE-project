/**************************************************************************
 * File       	   : apiSummaryReport.go
 * DESCRIPTION     : This file contains functions to get summary report
 * DATE            : 22-Dec-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"math/rand"
	"strings"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetOverallSpeedSummaryReportRequest
 * DESCRIPTION:     handler for get overall speed summary request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetOverallSpeedSummaryReportRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.SummaryReportRequest
		RecordCount int = 0
		reportResp  models.SummaryReportResponse
	)

	log.EnterFn(0, "HandleGetOverallSpeedSummaryReportRequest")
	defer func() { log.ExitFn(0, "HandleGetOverallSpeedSummaryReportRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get overall speed summary")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get overall speed summary err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get overall speed summary err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal overall speed summary", http.StatusBadRequest, nil)
		return
	}

	/* Dummy Data Sent to API */
	rand.Seed(time.Now().UnixNano())
	categories := []string{"Sale To Install", "Sale To MPU", "Sale To Battery"}
	reportResp.Data = make(map[string][]models.DataPoint)

	for _, category := range categories {
		var data []models.DataPoint = make([]models.DataPoint, 52)
		for i := 0; i < 52; i++ {
			data[i].Value = make(map[string]interface{})

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
	}

	appserver.FormAndSendHttpResp(resp, "Overall Speed Summary", http.StatusOK, reportResp, int64(RecordCount))
}

/******************************************************************************
 * FUNCTION:		HandleGetSpeedSaleToInstallSummaryReportRequest
 * DESCRIPTION:     handler for get speed sale to isntall summary request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetSpeedSaleToInstallSummaryReportRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.SaleToInstallSpeedSummaryReportRequest
		RecordCount int = 0
		reportResp  models.SummaryReportResponse
	)

	log.EnterFn(0, "HandleGetSpeedSaleToInstallSummaryReportRequest")
	defer func() { log.ExitFn(0, "HandleGetSpeedSaleToInstallSummaryReportRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get sale to install speed summary")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get speed sale to install summary err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get speed sale to install summary err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal speed sale to install summary", http.StatusBadRequest, nil)
		return
	}

	/* Dummy Data Sent to API */
	rand.Seed(time.Now().UnixNano())
	categories := []string{"Speed (Sale To Install)"}
	reportResp.Data = make(map[string][]models.DataPoint)

	for _, category := range categories {
		var data []models.DataPoint = make([]models.DataPoint, 52)
		for i := 0; i < 52; i++ {
			data[i].Value = make(map[string]interface{})

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
	}

	appserver.FormAndSendHttpResp(resp, "Speed Sale To Install Summary", http.StatusOK, reportResp, int64(RecordCount))
}

/******************************************************************************
 * FUNCTION:		HandleGetFTCQualityPerOfficeSummaryReportRequest
 * DESCRIPTION:     handler for get speed sale to isntall summary request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetFTCQualityPerOfficeSummaryReportRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.SummaryReportRequest
		RecordCount int = 0
		reportResp  models.SummaryReportResponse
	)

	log.EnterFn(0, "HandleGetFTCQualityPerOfficeSummaryReportRequest")
	defer func() { log.ExitFn(0, "HandleGetFTCQualityPerOfficeSummaryReportRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get quality per office first time completion summary")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get quality per office first time completion summary err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get quality per office first time completion summary err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal quality per office first time completion summary", http.StatusBadRequest, nil)
		return
	}

	/* Dummy Data Sent to API */
	rand.Seed(time.Now().UnixNano())
	categories := []string{"Overall"}
	categories = append(categories, dataReq.Office...)
	reportResp.Data = make(map[string][]models.DataPoint)

	for _, category := range categories {
		var data []models.DataPoint = make([]models.DataPoint, 52)
		for i := 0; i < 52; i++ {
			data[i].Value = make(map[string]interface{})

			data[i].Value["Survey - Completed First Time"] = rand.Float64()
			data[i].Value["Install - Completed First Time"] = rand.Float64()
			data[i].Value["Service - Completed First Time"] = rand.Float64()
			data[i].Value["MPU - Completed First Time"] = rand.Float64()
			data[i].Value["Derate - Completed First Time"] = rand.Float64()
			data[i].Value["Battery - Completed First Time"] = rand.Float64()

			data[i].Value["Survey - Incompleted First Time"] = rand.Float64()
			data[i].Value["Install - Incompleted First Time"] = rand.Float64()
			data[i].Value["Service - Incompleted First Time"] = rand.Float64()
			data[i].Value["MPU - Incompleted First Time"] = rand.Float64()
			data[i].Value["Derate - Incompleted First Time"] = rand.Float64()
			data[i].Value["Battery - Incompleted First Time"] = rand.Float64()
		}
		reportResp.Data[category] = data
	}

	appserver.FormAndSendHttpResp(resp, "First Time Completion Quality Per Office Summary", http.StatusOK, reportResp, int64(RecordCount))
}

/******************************************************************************
 * FUNCTION:		HandleGetFTCReasonForIncompleteSummaryReportRequest
 * DESCRIPTION:     handler for get speed sale to isntall summary request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetFTCReasonForIncompleteSummaryReportRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.SummaryReportRequest
		RecordCount int = 0
		reportResp  models.SummaryReportResponse
	)

	log.EnterFn(0, "HandleGetFTCReasonForIncompleteSummaryReportRequest")
	defer func() { log.ExitFn(0, "HandleGetFTCReasonForIncompleteSummaryReportRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get reason for incomplete first time completion summary")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get reason for incomplete first time completion summary err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get reason for incomplete first time completion summary err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal reason for incomplete first time completion summary", http.StatusBadRequest, nil)
		return
	}

	/* Dummy Data Sent to API */
	rand.Seed(time.Now().UnixNano())
	categories := []string{"Survey (Weekly)", "Install (Weekly)", "Service (Weekly)", "MPU (Weekly)", "Derate (Weekly)", "Battery (Weekly)", "DER/LST/Sub-Panel (Weekly)"}
	reportResp.Data = make(map[string][]models.DataPoint)

	for _, category := range categories {
		var data []models.DataPoint = make([]models.DataPoint, 52)
		for i := 0; i < 52; i++ {
			data[i].Value = make(map[string]interface{})

			data[i].Value["Yes"] = rand.Float64()
			data[i].Value["No"] = rand.Float64()
			data[i].Value["null"] = rand.Float64()
			data[i].Value["Change SOW"] = rand.Float64()
			data[i].Value["Change SOW"] = rand.Float64()
			data[i].Value["Customer Cancel"] = rand.Float64()
			data[i].Value["Customer Is Not Okay"] = rand.Float64()
			data[i].Value["Customer Non Response"] = rand.Float64()
			data[i].Value["Customer Reschedule"] = rand.Float64()
			data[i].Value["Lack of Equipment"] = rand.Float64()
			data[i].Value["Missed Photos"] = rand.Float64()
			data[i].Value["No Access To Property"] = rand.Float64()
			data[i].Value["Over Scheduling"] = rand.Float64()
			data[i].Value["Sales Rep Reschedule"] = rand.Float64()
			data[i].Value["Tech Is Not Available"] = rand.Float64()
			data[i].Value["Tech Missed Arrival Window"] = rand.Float64()
			data[i].Value["Vehicle Issue"] = rand.Float64()
			data[i].Value["Weather"] = rand.Float64()

		}
		reportResp.Data[category] = data
	}

	appserver.FormAndSendHttpResp(resp, "First Time Completion Reason For Incomplete Summary", http.StatusOK, reportResp, int64(RecordCount))
}

func contains(arr []string, target string) bool {
	for _, item := range arr {
		if item == target {
			return true
		}
	}
	return false
}

func Paginate[T any](data []T, pageNumber int64, pageSize int64) []T {
	start := (pageNumber - 1) * pageSize
	if start >= int64(len(data)) {
		return []T{}
	}

	end := start + pageSize
	if end > int64(len(data)) {
		end = int64(len(data))
	}

	return data[start:end]
}

func PrepareProductionSummaryReportFilters(tableName string, dataFilter models.SummaryReportRequest) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareProductionSummaryReportFilters")
	defer func() { log.ExitFn(0, "PrepareProductionSummaryReportFilters", nil) }()

	var filtersBuilder strings.Builder

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
