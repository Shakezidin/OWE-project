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
	"regexp"
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
		if !strings.Contains(err.Error(), "<not an error>") && !strings.Contains(err.Error(), "<emptyerror>") {
			log.FuncErrorTrace(0, "error creating user role query %v", err)
			appserver.FormAndSendHttpResp(resp, "Something is not right!", http.StatusBadRequest, nil)
			return
		} else if strings.Contains(err.Error(), "<emptyerror>") || strings.Contains(err.Error(), "<not an error>") {
			appserver.FormAndSendHttpResp(resp, "perfomance csv Data", http.StatusOK, perfomanceList, RecordCount)
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

	switch dataReq.SelectedMilestone {
	case "survey":
		pipelineQuery = models.PipelineSurveyCsvData(roleFilter, projectStatus, queueStatus, searchValue)
	case "cad":
		pipelineQuery = models.PipelineCadCsvData(roleFilter, projectStatus, queueStatus, searchValue)
	case "permit":
		pipelineQuery = models.PipelinePermitCsvData(roleFilter, projectStatus, queueStatus, searchValue)
	case "roof":
		pipelineQuery = models.PipelineRoofingCsvData(roleFilter, projectStatus, queueStatus, searchValue)
	case "install":
		pipelineQuery = models.PipelineInstallCsvData(roleFilter, projectStatus, queueStatus, searchValue)
	case "inspection":
		pipelineQuery = models.PipelineInspectionCsvData(roleFilter, projectStatus, queueStatus, searchValue)
	case "activation":
		pipelineQuery = models.PipelineActivationCsvData(roleFilter, projectStatus, queueStatus, searchValue)
	default:
		log.FuncErrorTrace(0, "Invalid Milestone %v selected", dataReq.SelectedMilestone)
		appserver.FormAndSendHttpResp(resp, "Please select a valid milestone", http.StatusBadRequest, nil)
		return
	}

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

		UniqueId, _ := item["customer_unique_id"].(string)
		Customer, _ := item["home_owner"].(string)
		CustomerEmail, _ := item["customer_email"].(string)
		CustomerPhoneNumber, _ := item["customer_phone_number"].(string)
		Address, _ := item["address"].(string)
		State, _ := item["state"].(string)
		ContractTotal, _ := item["contract_total"].(string)
		SystemSize, _ := item["system_size"].(string)

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
			ContractAmount:          cleanAmount(ContractTotal),
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

	perfomanceList.GetCsvPerformance, err = getAgingReportForCSV(perfomanceList.GetCsvPerformance)
	if err != nil {
		log.FuncErrorTrace(0, "error while getting ageing report data")
	}

	log.FuncInfoTrace(0, "Number of data List fetched : %v list %+v", len(data), data)
	appserver.FormAndSendHttpResp(resp, "Perfomance Csv Data", http.StatusOK, perfomanceList, RecordCount)
}

/* contract amount has some spcl char in it, will clean this */
func cleanAmount(input string) string {
	input = strings.ReplaceAll(input, " ", "")

	reg := regexp.MustCompile("[^a-zA-Z0-9$.,]")
	cleaned := reg.ReplaceAllString(input, "")

	return cleaned
}

func getAgingReportForCSV(AgRp []models.GetCsvPerformance) ([]models.GetCsvPerformance, error) {
	var (
		err     error
		filters []string
		values  = make(map[string]models.GetCsvPerformance)
	)
	log.EnterFn(0, "HandleGetAgingReport")
	defer func() { log.ExitFn(0, "HandleGetAgingReport", err) }()

	query := `SELECT DISTINCT ON(unique_id)
	unique_id, days_pending_ntp, days_pending_permits, days_pending_install, days_pending_pto, project_age 
	FROM aging_report`

	if len(AgRp) > 0 {
		uniqueIdValues := make([]string, 0, len(AgRp))
		for _, uid := range AgRp {
			uniqueIdValues = append(uniqueIdValues, fmt.Sprintf("'%s'", strings.ReplaceAll(uid.UniqueId, "'", "''")))
			values[uid.UniqueId] = uid
		}
		filters = append(filters, fmt.Sprintf("unique_id IN (%s)", strings.Join(uniqueIdValues, ", ")))
	}

	if len(filters) > 0 {
		query += " WHERE " + strings.Join(filters, " AND ")
	}

	// Fetch data from DB
	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AgingReport data from db err: %v", err)
		return nil, err
	}

	// Struct for pending days
	type pending struct {
		DaysPendingSurvey     string
		DaysPendingCadDesign  string
		DaysPendingPermits    string
		DaysPendingRoofing    string
		DaysPendingInstall    string
		DaysPendingInspection string
		DaysPendingActivation string
		DaysPendingNTP        string
		DaysPendingProjectAge string
		DaysPendingPTO        string
	}

	// Map to store pending days
	pendingData := make(map[string]pending)

	// Parse DB result and store in pendingData
	for _, row := range data {
		uniqueId, _ := row["unique_id"].(string)
		pendingData[uniqueId] = pending{
			DaysPendingSurvey:     TextAccToInput("0"),
			DaysPendingCadDesign:  TextAccToInput("0"),
			DaysPendingPermits:    TextAccToInput(getFieldText(row, "days_pending_permits")),
			DaysPendingRoofing:    TextAccToInput("0"),
			DaysPendingInstall:    TextAccToInput(getFieldText(row, "days_pending_install")),
			DaysPendingInspection: TextAccToInput("0"),
			DaysPendingActivation: TextAccToInput("0"),
			DaysPendingNTP:        TextAccToInput(getFieldText(row, "days_pending_ntp")),
			DaysPendingProjectAge: TextAccToInput(getFieldText(row, "project_age")),
			DaysPendingPTO:        TextAccToInput(getFieldText(row, "days_pending_pto")),
		}
	}

	// Attach pending days to each project
	for i, project := range AgRp {
		if pendingInfo, exists := pendingData[project.UniqueId]; exists {
			AgRp[i].DaysPendingSurvey = pendingInfo.DaysPendingSurvey
			AgRp[i].DaysPendingCadDesign = pendingInfo.DaysPendingCadDesign
			AgRp[i].DaysPendingPermits = pendingInfo.DaysPendingPermits
			AgRp[i].DaysPendingRoofing = pendingInfo.DaysPendingRoofing
			AgRp[i].DaysPendingInstall = pendingInfo.DaysPendingInstall
			AgRp[i].DaysPendingInspection = pendingInfo.DaysPendingInspection
			AgRp[i].DaysPendingActivation = pendingInfo.DaysPendingActivation
			AgRp[i].DaysPendingNTP = pendingInfo.DaysPendingNTP
			AgRp[i].DaysPendingProjectAge = pendingInfo.DaysPendingProjectAge
			AgRp[i].DaysPendingPTO = pendingInfo.DaysPendingPTO
		}
	}

	return AgRp, nil
}
