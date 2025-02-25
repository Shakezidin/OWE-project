/**************************************************************************
* File       	   : apiGetPipelineDealerData.go
* DESCRIPTION     : This file contains functions for for getting dealer
										 specific data in pipeline
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
	"net/http"
	"strings"
	"time"
)

/******************************************************************************
* FUNCTION:					HandleGetPipelineDealerData
* DESCRIPTION:      handler for getting dealer specific data in pipeline
* INPUT:						resp, req
* RETURNS:    			void
******************************************************************************/

var columnMap = map[string]ColumnInfo{
	"customer_name":                {"cust", TypeString, ""},
	"dealer":                       {"cust", TypeString, ""},
	"finance_company":              {"cust", TypeString, ""},
	"type":                         {"cust", TypeString, ""},
	"finance_type":                 {"ntp", TypeString, ""},
	"unique_id":                    {"cust", TypeString, ""},
	"address":                      {"cust", TypeString, ""},
	"state":                        {"cust", TypeString, ""},
	"email_address":                {"cust", TypeString, ""},
	"phone_number":                 {"cust", TypeString, ""},
	"primary_sales_rep":            {"cust", TypeString, ""},
	"secondary_sales_rep":          {"cust", TypeString, ""},
	"contracted_system_size":       {"cust", TypeString, "DECIMAL"},
	"total_system_cost":            {"cust", TypeString, ""},
	"jeopardy_date":                {"cust", TypeDate, ""},
	"sale_date":                    {"cust", TypeDate, ""},
	"survey_final_completion_date": {"survey", TypeDate, ""},
	"ntp_complete_date":            {"ntp", TypeDate, ""},
	"pv_submitted":                 {"permit", TypeDate, ""},
	"pv_approved":                  {"permit", TypeDate, ""},
	"ic_submitted_date":            {"ic", TypeDate, ""},
	"ic_approved_date":             {"ic", TypeDate, ""},
	"cancel_date":                  {"cust", TypeDate, ""},
	"pv_completion_date":           {"install", TypeDate, ""},
	"pv_fin_date":                  {"fin", TypeDate, ""},
	"pto_granted":                  {"pto", TypeDate, ""},
}

type PipelineByDealerReq struct {
	DealerNames   []string      `json:"dealer_names"`
	RequestParams RequestParams `json:"search_filters"`
}

func HandleGetPipelineDealerData(resp http.ResponseWriter, req *http.Request) {
	var (
		err                    error
		dataReq                PipelineByDealerReq
		pipelineDealerDataList models.PipelineDealerDataList
		data                   []map[string]interface{}
		whereEleList           []interface{}
		specialFilters         []string
		email                  string
		userRole               string
		pipelineDealerQuery    string
		queryFilter            string
		query                  string
		roleFilter             string
		RecordCount            int64
	)

	log.EnterFn(0, "HandleGetPipelineDealerData")
	defer func() { log.ExitFn(0, "HandleGetPipelineDealerData", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get PipelineDealerData data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get PipelineDealerData data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get PipelineDealerData data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get PipelineDealerData data Request body", http.StatusBadRequest, nil)
		return
	}

	email = req.Context().Value("emailid").(string)
	if email == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	userRole = req.Context().Value("rolename").(string)
	if userRole == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	roleFilter, err = HandleDataFilterOnUserRoles(email, userRole, "cust", dataReq.DealerNames)
	if err != nil {
		if !strings.Contains(err.Error(), "<not an error>") && !strings.Contains(err.Error(), "<emptyerror>") {
			log.FuncErrorTrace(0, "error creating user role query %v", err)
			appserver.FormAndSendHttpResp(resp, "Something is not right!", http.StatusBadRequest, nil)
			return
		} else if strings.Contains(err.Error(), "<emptyerror>") || strings.Contains(err.Error(), "<not an error>") {
			appserver.FormAndSendHttpResp(resp, "perfomance tile Data", http.StatusOK, pipelineDealerDataList, RecordCount)
			return
		}
	}

	/* Base query */
	pipelineDealerQuery = models.PipelineDealerDataQuery(roleFilter)

	/*
		Creating Filter
		Special Filters are to wrap column in an OR bracket
	*/
	specialFilters = []string{"unique_id", "customer_name"}
	builder := NewFilterBuilder(columnMap)
	queryFilter, whereEleList = builder.BuildFilters(dataReq.RequestParams, "", false, false, specialFilters)

	/* Querying the final query */
	query = pipelineDealerQuery + queryFilter

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get perfomance tile data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get perfomance tile data", http.StatusBadRequest, nil)
		return
	} else if len(data) == 0 {
		log.FuncErrorTrace(0, "empty data set from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, pipelineDealerDataList, RecordCount)
		return
	}

	RecordCount = int64(len(data))
	paginateData := PaginateData(data, dataReq.RequestParams)

	for _, item := range paginateData {
		customerName, _ := item["customer_name"].(string)
		partnerDealer, _ := item["partner_dealer"].(string)
		financeCompany, _ := item["finance_company"].(string)
		Type, _ := item["type"].(string)
		loanType, _ := item["loan_type"].(string)
		uniqueId, _ := item["unique_id"].(string)
		streetAddress, _ := item["street_address"].(string)
		state, _ := item["state"].(string)
		email, _ := item["email"].(string)
		phoneNumber, _ := item["phone_number"].(string)
		rep1, _ := item["rep_1"].(string)
		rep2, _ := item["rep_2"].(string)
		systemSize, _ := item["system_size"].(string)
		contractAmount, _ := item["contract_amount"].(string)

		var (
			createdDate, contractDate, surveyCompletionDate, ntpCompleteDate,
			permitSubmitDate, permitApprovalDate, icSubmitDate, icApprovalDate,
			jeopardyDate, cancelDate, pvInstallDate, finCompleteDate, ptoDate time.Time
		)

		createdDate, _ = item["created_date"].(time.Time)
		contractDate, _ = item["contract_date"].(time.Time)
		surveyCompletionDate, _ = item["survey_final_completion_date"].(time.Time)
		ntpCompleteDate, _ = item["ntp_complete_date"].(time.Time)
		permitSubmitDate, _ = item["permit_submit_date"].(time.Time)
		permitApprovalDate, _ = item["permit_approval_date"].(time.Time)
		icSubmitDate, _ = item["ic_submit_date"].(time.Time)
		icApprovalDate, _ = item["ic_approval_date"].(time.Time)
		jeopardyDate, _ = item["jeopardy_date"].(time.Time)
		cancelDate, _ = item["cancel_date"].(time.Time)
		pvInstallDate, _ = item["pv_install_date"].(time.Time)
		finCompleteDate, _ = item["fin_complete_date"].(time.Time)
		ptoDate, _ = item["pto_date"].(time.Time)

		var jeopardyStatus bool
		if !jeopardyDate.IsZero() {
			jeopardyStatus = true
		} else {
			jeopardyStatus = false
		}

		pipelineDealerData := models.PipelineDealerData{
			HomeOwner:            customerName,
			PartnerDealer:        partnerDealer,
			FinanceCompany:       financeCompany,
			Type:                 Type,
			LoanType:             loanType,
			UniqueId:             uniqueId,
			StreetAddress:        streetAddress,
			State:                state,
			Email:                email,
			PhoneNumber:          phoneNumber,
			Rep1:                 rep1,
			Rep2:                 rep2,
			SystemSize:           systemSize,
			ContractAmount:       cleanAmount(contractAmount),
			CreatedDate:          formatDate(createdDate),
			ContractDate:         formatDate(contractDate),
			SurveyCompletionDate: formatDate(surveyCompletionDate),
			NtpCompleteDate:      formatDate(ntpCompleteDate),
			PermitSubmitDate:     formatDate(permitSubmitDate),
			PermitApprovalDate:   formatDate(permitApprovalDate),
			IcSubmitDate:         formatDate(icSubmitDate),
			IcApprovalDate:       formatDate(icApprovalDate),
			JeopardyStatus:       jeopardyStatus,
			CancelDate:           formatDate(cancelDate),
			PvInstallDate:        formatDate(pvInstallDate),
			FinCompleteDate:      formatDate(finCompleteDate),
			PtoDate:              formatDate(ptoDate),
		}

		pipelineDealerDataList.PipelineDealerDataList = append(pipelineDealerDataList.PipelineDealerDataList, pipelineDealerData)
	}

	pipelineDealerDataList.PipelineDealerDataList, err = getAgingReportForDealerData(pipelineDealerDataList.PipelineDealerDataList)
	if err != nil {
		log.FuncErrorTrace(0, "error while getting ageing report data")
	}

	log.FuncInfoTrace(0, "Number of PipelineDealerData List fetched : %v list %+v\n", RecordCount, pipelineDealerDataList)
	appserver.FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, pipelineDealerDataList, RecordCount)

}

func getAgingReportForDealerData(AgRp []models.PipelineDealerData) ([]models.PipelineDealerData, error) {
	var (
		err     error
		filters []string
		values  = make(map[string]models.PipelineDealerData)
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
