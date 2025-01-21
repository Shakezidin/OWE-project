/**************************************************************************
 * File       	   : apiGetPerfomanceCsvDownload.go
 * DESCRIPTION     : This file contains functions for download perofmance data handler
 * DATE            : 07-May-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"io/ioutil"
	"strings"
	"time"

	"fmt"
	"net/http"
)

func HandleGetPerformanceCsvDownloadRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err            error
		dataReq        models.GetCsvDownload
		data           []map[string]interface{}
		userRole       string
		roleFilter     string
		pipelineQuery  string
		queueStatus    string
		searchValue    string
		RecordCount    int64
		perfomanceList = models.GetCsvPerformanceList{}
	)

	log.EnterFn(0, "HandleGetPerformanceCsvDownloadRequest")
	defer func() { log.ExitFn(0, "HandleGetPerformanceCsvDownloadRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get PerfomanceCsvDownload data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get PerfomanceCsvDownload data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get PerfomanceCsvDownload data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get PerfomanceCsvDownload data Request body", http.StatusBadRequest, nil)
		return
	}

	/* Project status out of this will be rejected */
	allowedStatuses := map[string]bool{
		"JEOPARDY": true,
		"HOLD":     true,
		"ACTIVE":   true,
	}

	if len(dataReq.ProjectStatus) == 0 {
		log.FuncErrorTrace(0, "empty  project status: %v", err)
		appserver.FormAndSendHttpResp(resp, "empty project status", http.StatusBadRequest, nil)
		return
	}

	for _, status := range dataReq.ProjectStatus {
		if !allowedStatuses[status] {
			log.FuncErrorTrace(0, "invalid project status: %s", status)
			appserver.FormAndSendHttpResp(resp, "invalid project status", http.StatusBadRequest, nil)
			return
		}
	}

	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}
	userRole = req.Context().Value("rolename").(string)
	if len(userRole) == 0 {
		appserver.FormAndSendHttpResp(resp, "Unauthorized Role", http.StatusBadRequest, nil)
		return
	}

	roleFilter, err = HandleDataFilterOnUserRoles(dataReq.Email, userRole, "cust", dataReq.DealerNames)
	if err != nil {
		if !strings.Contains("<not an error>", err.Error()) && !strings.Contains("<emptyerror>", err.Error()) {
			log.FuncErrorTrace(0, "error creating user role query %v", err)
			appserver.FormAndSendHttpResp(resp, "Something is not right!", http.StatusBadRequest, nil)
			return
		} else if strings.Contains("<emptyerror>", err.Error()) || strings.Contains("<not an error>", err.Error()) {
			appserver.FormAndSendHttpResp(resp, "perfomance tile Data", http.StatusOK, perfomanceList, RecordCount)
			return
		}
	}

	/*
		These below codes sets the filter
		1. Project status - [ACTIVE, HOLD, JEOPARDY]
		2. Queue status - [either of the 7 milestone]
		3. Search based on unique id / customer name
	*/

	projectStatus := joinNames(dataReq.ProjectStatus)
	queueStatus = buildQueueStatus(dataReq.SelectedMilestone)
	searchValue = ""
	if len(dataReq.UniqueIds) > 0 {
		searchValue = fmt.Sprintf(" AND (home_owner ILIKE '%%%s%%' OR customer_unique_id ILIKE '%%%s%%') ", dataReq.UniqueIds[0], dataReq.UniqueIds[0])
	}

	pipelineQuery = models.PipelineTileDataBelowQuery(roleFilter, projectStatus, queueStatus, searchValue)
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, pipelineQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get perfomance tile data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get perfomance tile data", http.StatusBadRequest, nil)
		return
	} else if len(data) == 0 {
		log.FuncErrorTrace(0, "empty data set from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, perfomanceList, RecordCount)
		return
	}

	for _, item := range data {

		UniqueId, ok := item["customer_unique_id"].(string)
		if !ok || UniqueId == "" {
			continue
		}

		Customer, _ := item["home_owner"].(string)
		CustomerEmail, _ := item["customer_email"].(string)
		CustomerPhoneNumber, _ := item["customer_phone_number"].(string)
		Address, _ := item["address"].(string)
		State, _ := item["state"].(string)
		ContractTotal, ok := item["contract_total"].(float64)
		SystemSize, ok := item["system_size"].(float64)

		var (
			SiteSurveyScheduleDate, SiteSurverCompleteDate, CadReady, PlanSetCompleteDate,
			PermitSubmittedDate, IcSubmittedDate, PermitApprovedDate, IcAPprovedDate,
			RoofingCratedDate, RoofinCompleteDate, PVInstallCreatedDate, BatteryScheduleDate,
			BatteryCompleteDate, PvInstallCompletedDate,
			FinCreatedDate, FinPassdate, PtoSubmittedDate, PtoDate, ContractDate time.Time
		)

		SiteSurveyScheduleDate, _ = item["site_survey_scheduled_date"].(time.Time)
		SiteSurverCompleteDate, _ = item["survey_final_completion_date"].(time.Time)
		CadReady, _ = item["cad_ready"].(time.Time)
		PlanSetCompleteDate, _ = item["cad_complete_date"].(time.Time)
		IcSubmittedDate, _ = item["ic_submitted_date"].(time.Time)
		PermitApprovedDate, _ = item["permit_approval_date"].(time.Time)
		IcAPprovedDate, _ = item["ic_approval_date"].(time.Time)
		RoofingCratedDate, _ = item["roofing_created_date"].(time.Time)
		RoofinCompleteDate, _ = item["roofing_completed_date"].(time.Time)
		PVInstallCreatedDate, _ = item["pv_install_created_date"].(time.Time)
		BatteryScheduleDate, _ = item["battery_scheduled_date"].(time.Time)
		BatteryCompleteDate, _ = item["battery_complete_date"].(time.Time)
		PvInstallCompletedDate, _ = item["install_completed_date"].(time.Time)
		PermitSubmittedDate, _ = item["permit_submitted_date"].(time.Time)

		FinCreatedDate, _ = item["fin_created_date"].(time.Time)
		FinPassdate, _ = item["fin_pass_date"].(time.Time)
		PtoSubmittedDate, _ = item["pto_submitted_date"].(time.Time)
		PtoDate, _ = item["pto_granted_new"].(time.Time)
		ContractDate, _ = item["sale_date"].(time.Time)

		perfomanceResponse := models.GetCsvPerformance{
			UniqueId:                UniqueId,
			HomeOwner:               Customer,
			Email:                   CustomerEmail,
			PhoneNumber:             CustomerPhoneNumber,
			Address:                 Address,
			State:                   State,
			ContractAmount:          ContractTotal,
			SystemSize:              SystemSize,
			ContractDate:            formatDate(ContractDate),
			SiteSurevyScheduleDate:  formatDate(SiteSurveyScheduleDate),
			SiteSurveyCompletedDate: formatDate(SiteSurverCompleteDate),
			CadReadyDate:            formatDate(CadReady),
			CadCompletedDate:        formatDate(PlanSetCompleteDate),
			PermitSubmittedDate:     formatDate(PermitSubmittedDate),
			IcSubmittedDate:         formatDate(IcSubmittedDate),
			PermitApprovedDate:      formatDate(PermitApprovedDate),
			IcApprovedDate:          formatDate(IcAPprovedDate),
			RoofingCreatedDate:      formatDate(RoofingCratedDate),
			RoofingCompleteDate:     formatDate(RoofinCompleteDate),
			PvInstallCreatedDate:    formatDate(PVInstallCreatedDate),
			BatteryScheduledDate:    formatDate(BatteryScheduleDate),
			BatteryCompletedDate:    formatDate(BatteryCompleteDate),
			PvInstallCompletedDate:  formatDate(PvInstallCompletedDate),
			FinCreateDate:           formatDate(FinCreatedDate),
			FinPassDate:             formatDate(FinPassdate),
			PtoSubmittedDate:        formatDate(PtoSubmittedDate),
			PtoDate:                 formatDate(PtoDate),
		}

		perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceResponse)
	}

	log.FuncInfoTrace(0, "Number of data List fetched : %v list %+v", len(data), data)
	appserver.FormAndSendHttpResp(resp, "Perfomance Csv Data", http.StatusOK, perfomanceList, RecordCount)
}
