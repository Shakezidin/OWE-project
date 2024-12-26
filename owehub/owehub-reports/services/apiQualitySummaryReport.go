/**************************************************************************
* File                  : apiQualitySummaryReport.go
* DESCRIPTION           : This file contains functions to get quality summary reports on weekly basis

* DATE                  : 23-december-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
* FUNCTION:		    HandleGetQualitySummaryReportRequest
* DESCRIPTION:      handler for quality summary data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleGetQualitySummaryReportRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		dataReq models.QualitySummaryReportRequest
		// apiResponse         models.QualitySummaryReportRequestResponse
		summaryCalcResponse interface{}
		// data         []map[string]interface{}
		// query        string
		// whereEleList []interface{}
		// whereClause  string
	)

	log.EnterFn(0, "HandleGetQualitySummaryReportRequest")

	defer func() { log.ExitFn(0, "HandleGetQualitySummaryReportRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in quality Summary data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from quality summary report data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal quality summary report data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal quality summary report data Request body", http.StatusInternalServerError, nil)
		return
	}

	switch dataReq.ReportType {
	case "FIN":
		summaryCalcResponse, err = calculateFinSummaryReport(dataReq)
	case "PTO":
		summaryCalcResponse, err = calculatePtoSummaryReport(dataReq)
	case "INSTALL_FUNDING":
		summaryCalcResponse, err = calculateInstallFundingSummaryReport(dataReq)
	case "FINAL_FUNDING":
		summaryCalcResponse, err = calculateFinalFundingSummaryReport(dataReq)
	}

	appserver.FormAndSendHttpResp(resp, fmt.Sprintf("%v Data", dataReq.ReportType), http.StatusOK, summaryCalcResponse, 0)
	appserver.FormAndSendHttpResp(resp, "Chart Data", http.StatusOK, summaryCalcResponse, 0)

}
