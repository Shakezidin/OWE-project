/**************************************************************************
 * File       	   : apiGetPerfomanceProjectStatus.go
 * DESCRIPTION     : This file contains functions for get perfomance status data handler
 * DATE            : 07-May-2024
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
	"math"
	"net/http"
	"strings"
	"time"
)

/******************************************************************************
 * FUNCTION:		HandleGetPerfomanceProjectStatusRequest
 * DESCRIPTION:     handler for get perfomance status data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

const (
	green = "#63ACA3"
	blue  = "#377CF6"
	grey  = "#E9E9E9"
)

type ForAgRp struct {
	SurveyClr     string
	CadClr        string
	PermittingClr string
	RoofingClr    string
	InstallClr    string
	ElectricalClr string
	InspectionClr string
	ActivationClr string
	NTPClr        string
}

func HandleGetPerfomanceProjectStatusRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err            error
		dataReq        models.PerfomanceStatusReq
		perfomanceList models.PerfomanceListResponse
		data           []map[string]interface{}
		userRole       string
		roleFilter     string
		pipelineQuery  string
		queueStatus    string
		searchValue    string
		RecordCount    int64
		forAGRp        = make(map[string]ForAgRp)
		updated        = make(map[string]bool)
	)
	log.EnterFn(0, "HandleGetPerfomanceProjectStatusRequest")
	defer func() { log.ExitFn(0, "HandleGetPerfomanceProjectStatusRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get PerfomanceProjectStatus data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get PerfomanceProjectStatus data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get PerfomanceProjectStatus data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get PerfomanceProjectStatus data Request body", http.StatusBadRequest, nil)
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
		searchValue = fmt.Sprintf(" AND (cust.customer_name ILIKE '%%%s%%' OR cust.unique_id ILIKE '%%%s%%') ", dataReq.UniqueIds[0], dataReq.UniqueIds[0])
	}

	//pipelineQuery = models.PipelineTileDataBelowQuery(roleFilter, projectStatus, queueStatus, searchValue)
	switch dataReq.SelectedMilestone {
	case "survey":
		pipelineQuery = models.PipelineSurveyDataBelow(roleFilter, projectStatus, queueStatus, searchValue)
	case "cad":
		pipelineQuery = models.PipelineCadDataBelow(roleFilter, projectStatus, queueStatus, searchValue)
	case "permit":
		pipelineQuery = models.PipelinePermitDataBelow(roleFilter, projectStatus, queueStatus, searchValue)
	case "roof":
		pipelineQuery = models.PipelineRoofingDataBelow(roleFilter, projectStatus, queueStatus, searchValue)
	case "install":
		pipelineQuery = models.PipelineInstallDataBelow(roleFilter, projectStatus, queueStatus, searchValue)
	case "inspection":
		pipelineQuery = models.PipelineInspectionDataBelow(roleFilter, projectStatus, queueStatus, searchValue)
	case "activation":
		pipelineQuery = models.PipelineActivationDataBelow(roleFilter, projectStatus, queueStatus, searchValue)
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

	/*
		The following does
		1. It counts the total existing data count for the selected milestone
		2. Paginates the data according to user request
		3. Then collects the unqiue id lists and joins
		4. With this we get the full data for those unique ids after joining
	*/

	data, err = FilterAgRpData(dataReq, data)
	if err != nil {
		log.FuncErrorTrace(0, "error while calling FilterAgRpData : %v", err)
	}
	RecordCount = int64(len(data))
	paginateData := PaginateData(data, dataReq)
	paginatedUniqueIds := joinUniqueIdsWithDbResponse(paginateData)
	tileQuery := models.GetBasePipelineQuery(paginatedUniqueIds)

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, tileQuery, nil)
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

		var (
			SiteSurveyScheduleDate, SiteSurverCompleteDate, CadReady, PlanSetCompleteDate,
			PvSubmittedDate, IcSubmittedDate, PermitApprovedDate, IcAPprovedDate,
			RoofingCratedDate, RoofinCompleteDate, PVInstallCreatedDate, BatteryScheduleDate,
			BatteryCompleteDate, PvInstallCompletedDate,
			FinCreatedDate, FinPassdate, PtoSubmittedDate, PtoDate time.Time
		)

		SiteSurveyScheduleDate, _ = item["site_survey_scheduled_date"].(time.Time)
		SiteSurverCompleteDate, _ = item["survey_final_completion_date"].(time.Time)
		CadReady, _ = item["cad_ready"].(time.Time)
		PlanSetCompleteDate, _ = item["cad_complete_date"].(time.Time)
		PvSubmittedDate, _ = item["permit_submitted_date"].(time.Time)
		IcSubmittedDate, _ = item["ic_submitted_date"].(time.Time)
		PermitApprovedDate, _ = item["permit_approval_date"].(time.Time)
		IcAPprovedDate, _ = item["ic_approval_date"].(time.Time)
		RoofingCratedDate, _ = item["roofing_created_date"].(time.Time)
		RoofinCompleteDate, _ = item["roofing_completed_date"].(time.Time)
		PVInstallCreatedDate, _ = item["pv_install_created_date"].(time.Time)
		BatteryScheduleDate, _ = item["battery_scheduled_date"].(time.Time)
		BatteryCompleteDate, _ = item["battery_complete_date"].(time.Time)
		PvInstallCompletedDate, _ = item["install_completed_date"].(time.Time)

		FinCreatedDate, _ = item["fin_created_date"].(time.Time)
		FinPassdate, _ = item["fin_pass_date"].(time.Time)
		PtoSubmittedDate, _ = item["pto_submitted_date"].(time.Time)
		PtoDate, _ = item["pto_granted_new"].(time.Time)

		surveyColor, SiteSurevyDate, _ := getSurveyColor(SiteSurveyScheduleDate, SiteSurverCompleteDate)
		cadColor, CadDesignDate := getCadColor(CadReady, PlanSetCompleteDate)
		permitColor, PermittingDate := getPermittingColor(PvSubmittedDate, IcSubmittedDate, PermitApprovedDate, IcAPprovedDate)
		roofingColor, RoofingDate := roofingColor(RoofingCratedDate, RoofinCompleteDate)
		installColor, InstallDate, _ := installColor(PVInstallCreatedDate, BatteryScheduleDate, BatteryCompleteDate, PvInstallCompletedDate)
		inspectionColor, InspectionDate := InspectionColor(FinCreatedDate, FinPassdate, PvInstallCompletedDate)
		activationColor, ActivationDate := activationColor(PtoSubmittedDate, PtoDate, FinPassdate, FinCreatedDate)

		perfomanceResponse := models.PerfomanceResponse{
			UniqueId:          UniqueId,
			Customer:          Customer,
			SiteSurevyDate:    formatDate(SiteSurevyDate),
			CadDesignDate:     formatDate(CadDesignDate),
			PermittingDate:    formatDate(PermittingDate),
			RoofingDate:       formatDate(RoofingDate),
			InstallDate:       formatDate(InstallDate),
			InspectionDate:    formatDate(InspectionDate),
			ActivationDate:    formatDate(ActivationDate),
			SiteSurveyColour:  surveyColor,
			CADDesignColour:   cadColor,
			PermittingColour:  permitColor,
			RoofingColour:     roofingColor,
			InstallColour:     installColor,
			InspectionsColour: inspectionColor,
			ActivationColour:  activationColor,
		}

		forAGRp[UniqueId] = ForAgRp{
			SurveyClr:     surveyColor,
			CadClr:        cadColor,
			PermittingClr: permitColor,
			RoofingClr:    roofingColor,
			InstallClr:    installColor,
			InspectionClr: inspectionColor,
			ActivationClr: activationColor,
		}

		perfomanceList.PerfomanceList = append(perfomanceList.PerfomanceList, perfomanceResponse)
	}

	agngRpForUserId, err := agngRpData(forAGRp, dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get agngRpForUserId err: %v", err)
	}

	for i := range perfomanceList.PerfomanceList {
		prsntUniqueId := perfomanceList.PerfomanceList[i].UniqueId

		if _, alreadyUpdated := updated[prsntUniqueId]; !alreadyUpdated {
			if exists, ok := agngRpForUserId[prsntUniqueId]; ok {

				perfomanceList.PerfomanceList[i].Days_Pending_Permits = exists.Days_Pending_Permits
				perfomanceList.PerfomanceList[i].Days_Pending_Install = exists.Days_Pending_Install
				perfomanceList.PerfomanceList[i].Days_Pending_PTO = exists.Days_Pending_PTO
				perfomanceList.PerfomanceList[i].Days_Pending_Project_Age = exists.Days_Pending_Project_Age
				perfomanceList.PerfomanceList[i].Days_Pending_Cad_Design = exists.Days_Pending_Cad_Design
				perfomanceList.PerfomanceList[i].Days_Pending_Roofing = exists.Days_Pending_Roofing
				perfomanceList.PerfomanceList[i].Days_Pending_Inspection = exists.Days_Pending_Inspection
				updated[prsntUniqueId] = true
			}
		}
	}

	// RecordCount = int64(len(perfomanceList.PerfomanceList))
	paginatedData := postCalculation(perfomanceList, dataReq, agngRpForUserId)
	perfomanceList.PerfomanceList = paginatedData

	log.FuncInfoTrace(0, "Number of PerfomanceProjectStatus List fetched : %v list %+v\n", RecordCount, perfomanceList)
	appserver.FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, perfomanceList, RecordCount)

}

/* Function to join the unique id lists */
func joinUniqueIdsWithDbResponse(data []map[string]interface{}) (joinedNames string) {
	if len(data) > 0 {
		escapedNames := make([]string, len(data))
		for i, item := range data {
			UniqueId, ok := item["customer_unique_id"].(string)
			if !ok || len(UniqueId) == 0 {
				UniqueId = ""
			}
			escapedNames[i] = "'" + strings.Replace(UniqueId, "'", "''", -1) + "'"
		}
		joinedNames = strings.Join(escapedNames, ", ")
	}
	return joinedNames
}

/* Function to set the db milestone */
func buildQueueStatus(milestone string) string {
	var status string
	switch milestone {
	case "survey":
		status = "Survey Queue"
	case "cad":
		status = "CAD Queue"
	case "permit":
		status = "Permit Queue"
	case "roof":
		status = "Roofing Queue"
	case "install":
		status = "Install (Scheduling) Queue"
	case "inspection":
		status = "Inspections Queue"
	case "activation":
		status = "Activation Queue"
	default:
		return ""
	}
	return fmt.Sprintf(" WHERE q.queue_status = '%v' ", status)
}

func formatDate(t time.Time) string {
	if t.IsZero() {
		return ""
	}
	formatted := t.Format("2006-01-02")
	return formatted
}

/*
*****************************************************************************

  - DESCRIPTION:
    The below function contains the logic to set the different color
    for the tiles based on dates and other params

*****************************************************************************
*/
func getSurveyColor(siteSurveyscheduledDate, siteSurveycompletedDate time.Time) (string, time.Time, string) {

	if !siteSurveycompletedDate.IsZero() {
		return green, siteSurveycompletedDate, "Completed"
	} else if !siteSurveyscheduledDate.IsZero() {
		return blue, siteSurveyscheduledDate, "Scheduled"
	}
	return grey, time.Time{}, ""
}

func getCadColor(cadCreatedDate, planSetcompletedDate time.Time) (string, time.Time) {

	if !planSetcompletedDate.IsZero() {
		return green, planSetcompletedDate
	} else if !cadCreatedDate.IsZero() {
		return blue, cadCreatedDate
	}
	return grey, time.Time{}
}

func getPermittingColor(permitSubmittedDate, IcSubmittedDate, permitApprovedDate, IcApprovedDate time.Time) (string, time.Time) {

	if !permitApprovedDate.IsZero() && !IcApprovedDate.IsZero() {
		latestApprovedDate := permitApprovedDate
		if IcApprovedDate.After(permitApprovedDate) {
			latestApprovedDate = IcApprovedDate
		}
		return green, latestApprovedDate
	} else if !permitSubmittedDate.IsZero() && !IcSubmittedDate.IsZero() {
		latestSubmittedDate := permitSubmittedDate
		if IcSubmittedDate.After(permitSubmittedDate) {
			latestSubmittedDate = IcSubmittedDate
		}
		return blue, latestSubmittedDate
	}
	return grey, time.Time{}
}

func installColor(pvInstallCreateDate, batteryScheduleDate, batteryCompleted, pvInstallCompletedDate time.Time) (string, time.Time, string) {

	if !batteryScheduleDate.IsZero() && batteryCompleted.IsZero() && !pvInstallCompletedDate.IsZero() {
		return blue, pvInstallCompletedDate, "Scheduled"
	} else if !pvInstallCreateDate.IsZero() {
		return blue, pvInstallCreateDate, "Scheduled"
	}

	return grey, time.Time{}, ""
}

func roofingColor(roofingCreateDate, roofingCompleteDate time.Time) (string, time.Time) {

	if !roofingCompleteDate.IsZero() {
		return green, roofingCompleteDate
	} else if !roofingCreateDate.IsZero() {
		return blue, roofingCreateDate
	}
	return "", time.Time{}
}

func activationColor(ptoSubmittedDate, ptoDate, finPassDate, finCreatedDate time.Time) (string, time.Time) {

	if !ptoDate.IsZero() {
		return green, ptoDate
	} else if !ptoSubmittedDate.IsZero() {
		return blue, ptoSubmittedDate
	}
	return grey, time.Time{}
}

func InspectionColor(finCreatedDate, finPassDate, pvInstallCompletedDate time.Time) (string, time.Time) {

	if !finPassDate.IsZero() {
		return green, finPassDate
	} else if !finCreatedDate.IsZero() {
		return blue, finCreatedDate
	}
	return grey, time.Time{}
}

/*
*****************************************************************************

  - FUNCTION:		agngRpData
  - DESCRIPTION:
    Function is used to collect the remaining days for all unique ids

*****************************************************************************
*/
func agngRpData(AgRp map[string]ForAgRp, dataFilter models.PerfomanceStatusReq) (map[string]models.PerfomanceResponse, error) {
	var (
		err     error
		resp    = make(map[string]models.PerfomanceResponse)
		filters []string
	)
	log.EnterFn(0, "HandleGetAgingReport")
	defer func() { log.ExitFn(0, "HandleGetAgingReport", err) }()

	query := `SELECT unique_id, days_pending_ntp, days_pending_permits, days_pending_install, days_pending_pto, project_age FROM aging_report`

	if len(AgRp) > 0 {
		uniqueIdValues := make([]string, 0, len(AgRp))
		for uid := range AgRp {
			uniqueIdValues = append(uniqueIdValues, fmt.Sprintf("'%s'", strings.ReplaceAll(uid, "'", "''")))
		}
		filters = append(filters, fmt.Sprintf("unique_id IN (%s)", strings.Join(uniqueIdValues, ", ")))
	}

	if len(dataFilter.ProjectStatus) > 0 {
		statusValues := make([]string, 0, len(dataFilter.ProjectStatus))
		for _, status := range dataFilter.ProjectStatus {
			statusValues = append(statusValues, fmt.Sprintf("'%s'", strings.ReplaceAll(status, "'", "''")))
		}
		filters = append(filters, fmt.Sprintf("project_status IN (%s)", strings.Join(statusValues, ", ")))
	} else {
		filters = append(filters, "project_status IN ('ACTIVE')")
	}

	if len(filters) > 0 {
		query += " WHERE " + strings.Join(filters, " AND ")
	}

	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AgingReport data from db err: %v", err)
		return resp, err
	}

	for _, agRp := range data {
		uniqueId, ok := agRp["unique_id"].(string)
		if !ok {
			// log.FuncErrorTrace(0, "[agngRpData] error while fetching data for uniqueId: %v", err)
			continue
		}

		exists, existsOk := AgRp[uniqueId]
		if !existsOk {
			continue
		}

		resp1 := models.PerfomanceResponse{
			UniqueId: uniqueId,
		}

		if exists.SurveyClr == blue {
			resp1.Days_Pending_Survey = TextAccToInput("0")
		}
		if exists.CadClr == blue {
			resp1.Days_Pending_Cad_Design = TextAccToInput("0")
		}
		if exists.PermittingClr == blue {
			resp1.Days_Pending_Permits = TextAccToInput(getFieldText(agRp, "days_pending_permits"))
		}
		if exists.RoofingClr == blue {
			resp1.Days_Pending_Roofing = TextAccToInput("0")
		}
		if exists.InstallClr == blue {
			resp1.Days_Pending_Install = TextAccToInput(getFieldText(agRp, "days_pending_install"))
		}
		if exists.InspectionClr == blue {
			resp1.Days_Pending_Inspection = TextAccToInput("0")
		}
		if exists.ActivationClr == blue {
			resp1.Days_Pending_Activation = TextAccToInput("0")
		}
		if exists.NTPClr == "" {
			resp1.Days_Pending_NTP = TextAccToInput(getFieldText(agRp, "days_pending_ntp"))
		}

		resp1.Days_Pending_Project_Age = TextAccToInput(getFieldText(agRp, "project_age"))

		resp1.Days_Pending_PTO = TextAccToInput(getFieldText(agRp, "days_pending_pto"))

		resp[uniqueId] = resp1
	}

	// log.FuncInfoTrace(0, " :  %v and count is : %d", resp, len(resp))
	return resp, nil
}

func TextAccToInput(s string) string {
	if s == "0" || s == "1" {
		return fmt.Sprintf("%s day pending", s)
	}
	return fmt.Sprintf("%s days pending", s)
}

func getFieldText(data map[string]interface{}, field string) string {
	if value, ok := data[field]; ok {
		return value.(string)
	}
	// log.FuncErrorTrace(0, "[agngRpData] error while fetching data for %s", field)
	return ""
}

/*
*****************************************************************************

	- FUNCTION:		PaginateData
  - DESCRIPTION:
    PaginateData function paginates data directly from the returned data itself
    without setting any offset value. For large data sizes, using an offset
    was creating performance issues. This approach manages to keep the response
    time under 2 seconds.

*****************************************************************************
*/

func PaginateData(data []map[string]interface{}, req models.PerfomanceStatusReq) []map[string]interface{} {
	paginatedData := []map[string]interface{}{}
	startIndex := (req.PageNumber - 1) * req.PageSize
	endIndex := int(math.Min(float64(startIndex+req.PageSize), float64(len(data))))

	if startIndex >= len(data) || startIndex >= endIndex {
		return make([]map[string]interface{}, 0)
	}

	paginatedData = append(paginatedData, data[startIndex:endIndex]...)
	return paginatedData
}

/*
*****************************************************************************

	- FUNCTION:		postCalculation
  - DESCRIPTION:
    function helps in calculating the ntp/qc data for the unique ids that is
		displayed in UI at present. See the value next to each unique id in UI

*****************************************************************************
*/

func postCalculation(data models.PerfomanceListResponse, req models.PerfomanceStatusReq, agngRpForUserId map[string]models.PerfomanceResponse) []models.PerfomanceResponse {

	var (
		updated = make(map[string]bool)
		err     error
	)

	log.EnterFn(0, "PaginateData")
	defer func() { log.ExitFn(0, "PaginateData", err) }()
	paginatedData := data.PerfomanceList

	uniqueIds := make([]string, len(paginatedData))
	for i, item := range paginatedData {
		uniqueIds[i] = item.UniqueId
	}

	var filtersBuilder strings.Builder
	filtersBuilder.WriteString(models.PipelineNTPQuery(uniqueIds))

	linkQuery := filtersBuilder.String()

	result, err := db.ReteriveFromDB(db.RowDataDBIndex, linkQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get qc and ntp data from DB err: %v", err)
		return paginatedData
	}

	resultMap := make(map[string]map[string]interface{})
	for _, row := range result {
		uniqueId := row["unique_id"].(string)
		resultMap[uniqueId] = row
	}

	for i, datas := range paginatedData {
		if row, ok := resultMap[paginatedData[i].UniqueId]; ok {
			var prospectId string
			if val, ok := row["current_live_cad"].(string); ok {
				paginatedData[i].CADLink = val
			} else {
				paginatedData[i].CADLink = ""
			}

			if val, ok := row["system_sold_er"].(string); ok {
				paginatedData[i].DATLink = val
			} else {
				paginatedData[i].DATLink = ""
			}

			if val, ok := row["podio_link"].(string); ok {
				paginatedData[i].PodioLink = val
			} else {
				paginatedData[i].PodioLink = ""
			}

			if val, ok := row["change_order_status"].(string); ok {
				paginatedData[i].CoStatus = val
			} else {
				paginatedData[i].CoStatus = ""
			}

			if val, ok := row["first_value"].(string); ok {
				prospectId = val
			} else {
				prospectId = ""
			}

			var actionRequiredCount int64

			ProductionDiscrepancy, count := getStringValue(row, "production_discrepancy", datas.NTPdate, prospectId)
			actionRequiredCount += count
			FinanceNTPOfProject, count := getStringValue(row, "finance_ntp_of_project", datas.NTPdate, prospectId)
			actionRequiredCount += count
			UtilityBillUploaded, count := getStringValue(row, "utility_bill_uploaded", datas.NTPdate, prospectId)
			actionRequiredCount += count
			PowerClerkSignaturesComplete, count := getStringValue(row, "powerclerk_signatures_complete", datas.NTPdate, prospectId)
			actionRequiredCount += count
			paginatedData[i].Ntp = models.NTP{
				ProductionDiscrepancy:        ProductionDiscrepancy,
				FinanceNTPOfProject:          FinanceNTPOfProject,
				UtilityBillUploaded:          UtilityBillUploaded,
				PowerClerkSignaturesComplete: PowerClerkSignaturesComplete,
				ActionRequiredCount:          actionRequiredCount,
			}
			if actionRequiredCount >= 1 {
				if _, alrdyupdatd := updated[paginatedData[i].UniqueId]; !alrdyupdatd {
					if exists, ok := agngRpForUserId[paginatedData[i].UniqueId]; ok {
						paginatedData[i].Days_Pending_NTP = exists.Days_Pending_NTP
						updated[paginatedData[i].UniqueId] = true
					}
				}
			}
			PowerClerk, count := getStringValue(row, "powerclerk_sent_az", datas.NTPdate, prospectId)
			actionRequiredCount += count
			ACHWaiveSendandSignedCashOnly, count := getStringValue(row, "ach_waiver_sent_and_signed_cash_only", datas.NTPdate, prospectId)
			actionRequiredCount += count
			GreenAreaNMOnly, count := getStringValue(row, "green_area_nm_only", datas.NTPdate, prospectId)
			actionRequiredCount += count
			FinanceCreditApprovalLoanorLease, count := getStringValue(row, "finance_credit_approved_loan_or_lease", datas.NTPdate, prospectId)
			actionRequiredCount += count
			FinanceAgreementCompletedLoanorLease, count := getStringValue(row, "finance_agreement_completed_loan_or_lease", datas.NTPdate, prospectId)
			actionRequiredCount += count
			OWEDocumentsCompleted, count := getStringValue(row, "owe_documents_completed", datas.NTPdate, prospectId)
			actionRequiredCount += count
			paginatedData[i].Qc = models.QC{
				PowerClerk:                           PowerClerk,
				ACHWaiveSendandSignedCashOnly:        ACHWaiveSendandSignedCashOnly,
				GreenAreaNMOnly:                      GreenAreaNMOnly,
				FinanceCreditApprovalLoanorLease:     FinanceCreditApprovalLoanorLease,
				FinanceAgreementCompletedLoanorLease: FinanceAgreementCompletedLoanorLease,
				OWEDocumentsCompleted:                OWEDocumentsCompleted,
			}
		}
	}

	return paginatedData
}

func FilterAgRpData(req models.PerfomanceStatusReq, alldata []map[string]interface{}) ([]map[string]interface{}, error) {

	var (
		conditions []string
		result     []map[string]interface{}
		uniqueIds  = make(map[string]struct{})
		err        error
	)

	log.EnterFn(0, "FilterAgRpData")
	defer func() { log.ExitFn(0, "FilterAgRpData", err) }()

	if req.Fields == nil {
		return alldata, err
	}

	baseQuery := "SELECT unique_id\n FROM aging_report %s \n"
	for _, value := range req.Fields {
		conditions = append(conditions, fmt.Sprintf("(%s AS INTEGER)  BETWEEN %d AND %d", value, req.ProjectPendingStartDate, req.ProjectPendingEndDate))
	}
	conditionsStr := "\nWHERE CAST " + strings.Join(conditions, " \nAND CAST ")
	query := fmt.Sprintf(baseQuery, conditionsStr)

	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get FilterAgRpData data from db err: %v", err)
		return nil, err
	}
	// Collect unique IDs into a map for efficient lookup
	for _, value := range data {
		if id, ok := value["unique_id"]; ok {
			if strID, ok := id.(string); ok {
				uniqueIds[strID] = struct{}{}
			} else {
				log.FuncErrorTrace(0, "[FilterAgRpData] unexpected type for unique_id: %T", id)
			}
		} else {
			log.FuncErrorTrace(0, "[FilterAgRpData] unique_id not found in data")
		}
	}

	// Filter the original data based on the fetched unique IDs
	for _, item := range alldata {
		if uniqueId, ok := item["customer_unique_id"].(string); ok {
			if _, exists := uniqueIds[uniqueId]; exists {
				result = append(result, item)
			}
		} else {
			log.FuncErrorTrace(0, "[FilterAgRpData] customer_unique_id not found or invalid in alldata")
		}
	}

	log.FuncInfoTrace(0, "FilterAgRpData filtered result count: %d", len(result))
	return result, nil
}
