// /**************************************************************************
// * File       	   : apiGetPipelineDealerData.go
// * DESCRIPTION     : This file contains functions for for getting dealer
// 										 specific data in pipeline
// * DATE            : 07-May-2024
// **************************************************************************/

package services

// import (
// 	"OWEApp/shared/appserver"
// 	"OWEApp/shared/db"
// 	log "OWEApp/shared/logger"
// 	models "OWEApp/shared/models"
// 	"encoding/json"
// 	"fmt"
// 	"io/ioutil"
// 	"net/http"
// 	"time"
// )

// /******************************************************************************
// * FUNCTION:					HandleGetPipelineDealerData
// * DESCRIPTION:      handler for getting dealer specific data in pipeline
// * INPUT:						resp, req
// * RETURNS:    			void
// ******************************************************************************/

// /*
// 	This helps us in fetching dealer specific datas. It returns milestone data for each projects
// 	Dealers supported now
// 	1. Sky Power Arizona

// */

// var DealerList = []string{
// 	"Sky Power Arizona",
// }

// type PipelineDealerDataList struct {
// 	PipelineDealerDataList []PipelineDealerData `json:"pipeline_dealer_data_list"`
// }

// type PipelineDealerData struct {
// 	CustomerName         string `json:"customer_name"`
// 	PartnerDealer        string `json:"partner_dealer"`
// 	FinanceCompany       string `json:"finance_company"`
// 	SourceType           string `json:"source_type"`
// 	LoanType             string `json:"loan_type"`
// 	UniqueId             string `json:"unique_id"`
// 	HomeOwner            string `json:"home_owner"`
// 	StreetAddress        string `json:"street_address"`
// 	City                 string `json:"city"`
// 	State                string `json:"state"`
// 	ZipCode              string `json:"zip_code"`
// 	Email                string `json:"email"`
// 	PhoneNumber          string `json:"phone_number"`
// 	Rep1                 string `json:"rep_1"`
// 	Rep2                 string `json:"rep_2"`
// 	SystemSize           string `json:"system_size"`
// 	ContractAmount       string `json:"contract_amount"`
// 	CreatedDate          string `json:"created_date"`
// 	ContractDate         string `json:"contract_date"`
// 	SurveyCompletionDate string `json:"survey_final_completion_date"`
// 	NtpCompleteDate      string `json:"ntp_complete_date"`
// 	PermitSubmitDate     string `json:"permit_submit_date"`
// 	PermitApprovalDate   string `json:"permit_approval_date"`
// 	IcSubmitDate         string `json:"ic_submit_date"`
// 	IcApprovalDate       string `json:"ic_approval_date"`
// 	JeopardyDate         string `json:"jeopardy_date"`
// 	CancelDate           string `json:"cancel_date"`
// 	PvInstallDate        string `json:"pv_install_date"`
// 	FinCompleteDate      string `json:"fin_complete_date"`
// 	PtoDate              string `json:"pto_date"`
// }

// func HandleGetPipelineDealerData(resp http.ResponseWriter, req *http.Request) {
// 	var (
// 		err                    error
// 		dataReq                models.PerfomanceStatusReq
// 		pipelineDealerDataList PipelineDealerDataList
// 		data                   []map[string]interface{}
// 		email                  string
// 		dealerName             string
// 		pipelineDealerQuery    string
// 		queryFilter            string
// 		query                  string
// 		RecordCount            int64
// 	)

// 	log.EnterFn(0, "HandleGetPipelineDealerData")
// 	defer func() { log.ExitFn(0, "HandleGetPipelineDealerData", err) }()

// 	if req.Body == nil {
// 		err = fmt.Errorf("HTTP Request body is null in get PipelineDealerData data request")
// 		log.FuncErrorTrace(0, "%v", err)
// 		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
// 		return
// 	}

// 	reqBody, err := ioutil.ReadAll(req.Body)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get PipelineDealerData data request err: %v", err)
// 		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
// 		return
// 	}

// 	err = json.Unmarshal(reqBody, &dataReq)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "Failed to unmarshal get PipelineDealerData data request err: %v", err)
// 		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get PipelineDealerData data Request body", http.StatusBadRequest, nil)
// 		return
// 	}

// 	email = req.Context().Value("emailid").(string)
// 	if email == "" {
// 		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
// 		return
// 	}

// 	_, dealerName, err = fetchDealerNameForUser(email, "")
// 	if err != nil {
// 		log.FuncErrorTrace(0, "%v", err)
// 		appserver.FormAndSendHttpResp(resp, "Something is not right", http.StatusBadRequest, nil)
// 		return
// 	}

// 	if check := containsString(dealerName); !check {
// 		appserver.FormAndSendHttpResp(resp, "Unauthorized Dealer", http.StatusBadRequest, nil)
// 		return
// 	}

// 	/* Base query */
// 	pipelineDealerQuery = models.PipelineDealerDataQuery()

// 	/* Creating Filter */
// 	queryFilter = funcCreatePipelineFilter()

// 	/* Querying the final query */
// 	query = pipelineDealerQuery + queryFilter

// 	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "Failed to get perfomance tile data from DB err: %v", err)
// 		appserver.FormAndSendHttpResp(resp, "Failed to get perfomance tile data", http.StatusBadRequest, nil)
// 		return
// 	} else if len(data) == 0 {
// 		log.FuncErrorTrace(0, "empty data set from DB err: %v", err)
// 		appserver.FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, pipelineDealerDataList, RecordCount)
// 		return
// 	}

// 	RecordCount = int64(len(data))
// 	paginateData := PaginateData(data, dataReq)

// 	for _, item := range paginateData {
// 		customerName, _ := item["customer_name"].(string)
// 		partnerDealer, _ := item["partner_dealer"].(string)
// 		financeCompany, _ := item["finance_company"].(string)
// 		sourceType, _ := item["source_type"].(string)
// 		loanType, _ := item["loan_type"].(string)
// 		uniqueId, _ := item["unique_id"].(string)
// 		homeOwner, _ := item["home_owner"].(string)
// 		streetAddress, _ := item["street_address"].(string)
// 		city, _ := item["city"].(string)
// 		state, _ := item["state"].(string)
// 		zipCode, _ := item["zip_code"].(string)
// 		email, _ := item["email"].(string)
// 		phoneNumber, _ := item["phone_number"].(string)
// 		rep1, _ := item["rep_1"].(string)
// 		rep2, _ := item["rep_2"].(string)
// 		systemSize, _ := item["system_size"].(string)
// 		contractAmount, _ := item["contract_amount"].(string)

// 		var (
// 			createdDate, contractDate, surveyCompletionDate, ntpCompleteDate,
// 			permitSubmitDate, permitApprovalDate, icSubmitDate, icApprovalDate,
// 			jeopardyDate, cancelDate, pvInstallDate, finCompleteDate, ptoDate time.Time
// 		)

// 		createdDate, _ = item["created_date"].(time.Time)
// 		contractDate, _ = item["contract_date"].(time.Time)
// 		surveyCompletionDate, _ = item["survey_final_completion_date"].(time.Time)
// 		ntpCompleteDate, _ = item["ntp_complete_date"].(time.Time)
// 		permitSubmitDate, _ = item["permit_submit_date"].(time.Time)
// 		permitApprovalDate, _ = item["permit_approval_date"].(time.Time)
// 		icSubmitDate, _ = item["ic_submit_date"].(time.Time)
// 		icApprovalDate, _ = item["ic_approval_date"].(time.Time)
// 		jeopardyDate, _ = item["jeopardy_date"].(time.Time)
// 		cancelDate, _ = item["cancel_date"].(time.Time)
// 		pvInstallDate, _ = item["pv_install_date"].(time.Time)
// 		finCompleteDate, _ = item["fin_complete_date"].(time.Time)
// 		ptoDate, _ = item["pto_date"].(time.Time)

// 		pipelineDealerData := PipelineDealerData{
// 			CustomerName:         customerName,
// 			PartnerDealer:        partnerDealer,
// 			FinanceCompany:       financeCompany,
// 			SourceType:           sourceType,
// 			LoanType:             loanType,
// 			UniqueId:             uniqueId,
// 			HomeOwner:            homeOwner,
// 			StreetAddress:        streetAddress,
// 			City:                 city,
// 			State:                state,
// 			ZipCode:              zipCode,
// 			Email:                email,
// 			PhoneNumber:          phoneNumber,
// 			Rep1:                 rep1,
// 			Rep2:                 rep2,
// 			SystemSize:           systemSize,
// 			ContractAmount:       cleanAmount(contractAmount),
// 			CreatedDate:          formatDate(createdDate),
// 			ContractDate:         formatDate(contractDate),
// 			SurveyCompletionDate: formatDate(surveyCompletionDate),
// 			NtpCompleteDate:      formatDate(ntpCompleteDate),
// 			PermitSubmitDate:     formatDate(permitSubmitDate),
// 			PermitApprovalDate:   formatDate(permitApprovalDate),
// 			IcSubmitDate:         formatDate(icSubmitDate),
// 			IcApprovalDate:       formatDate(icApprovalDate),
// 			JeopardyDate:         formatDate(jeopardyDate),
// 			CancelDate:           formatDate(cancelDate),
// 			PvInstallDate:        formatDate(pvInstallDate),
// 			FinCompleteDate:      formatDate(finCompleteDate),
// 			PtoDate:              formatDate(ptoDate),
// 		}

// 		pipelineDealerDataList.PipelineDealerDataList = append(pipelineDealerDataList.PipelineDealerDataList, pipelineDealerData)
// 	}

// 	log.FuncInfoTrace(0, "Number of PipelineDealerData List fetched : %v list %+v\n", RecordCount, pipelineDealerDataList)
// 	appserver.FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, pipelineDealerDataList, RecordCount)

// }

// /* Function checks if the dealer is allowed */
// func containsString(target string) bool {
// 	for _, option := range DealerList {
// 		if target == option {
// 			return true
// 		}
// 	}
// 	return false
// }
