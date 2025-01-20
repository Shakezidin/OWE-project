// /**************************************************************************
//  * File       	   : apiGetPerfomanceCsvDownload.go
//  * DESCRIPTION     : This file contains functions for download perofmance data handler
//  * DATE            : 07-May-2024
//  **************************************************************************/

package services

// import (
// 	"OWEApp/shared/appserver"
// 	"OWEApp/shared/db"
// 	log "OWEApp/shared/logger"
// 	models "OWEApp/shared/models"
// 	"OWEApp/shared/types"
// 	"encoding/json"
// 	"io/ioutil"
// 	"strings"
// 	"time"

// 	"fmt"
// 	"net/http"
// )

// func HandleGetPerformanceCsvDownloadRequest(resp http.ResponseWriter, req *http.Request) {
// 	var (
// 		err                error
// 		dataReq            models.GetCsvDownload
// 		data               []map[string]interface{}
// 		whereEleList       []interface{}
// 		queryWithFiler     string
// 		filter             string
// 		rgnSalesMgrCheck   bool
// 		RecordCount        int64
// 		SaleRepList        []interface{}
// 		query              string
// 		SiteSurveyD        string
// 		SiteSurveyComD     string
// 		CadD               string
// 		CadCompleteD       string
// 		permitSubmittedD   string
// 		IcSubmitD          string
// 		PermitApprovedD    string
// 		IcaprvdD           string
// 		RoofingCreatedD    string
// 		RoofingCompleteD   string
// 		MpuCreateD         string
// 		BatteryScheduleD   string
// 		BatteryCompleteD   string
// 		PvInstallCompleteD string
// 		DerateCreateD      string
// 		TrechingWSOpenD    string
// 		DerateCompleteD    string
// 		MpucompleteD       string
// 		TrenchingComD      string
// 		FinCreateD         string
// 		FinPassD           string
// 		PTOSubmitD         string
// 		PTOD               string
// 		PvInstallCreateD   string
// 		SiteSurveyCount    int64
// 		CadDesignCount     int64
// 		PerimittingCount   int64
// 		RoofingCount       int64
// 		InstallCount       int64
// 		ElectricalCount    int64
// 		InspectionCount    int64
// 		ActivationCount    int64
// 		contractD          string
// 	)

// 	log.EnterFn(0, "HandleGetPerformanceCsvDownloadRequest")
// 	defer func() { log.ExitFn(0, "HandleGetPerformanceCsvDownloadRequest", err) }()

// 	if req.Body == nil {
// 		err = fmt.Errorf("HTTP Request body is null in get PerfomanceCsvDownload data request")
// 		log.FuncErrorTrace(0, "%v", err)
// 		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
// 		return
// 	}

// 	reqBody, err := ioutil.ReadAll(req.Body)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get PerfomanceCsvDownload data request err: %v", err)
// 		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
// 		return
// 	}

// 	err = json.Unmarshal(reqBody, &dataReq)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "Failed to unmarshal get PerfomanceCsvDownload data request err: %v", err)
// 		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get PerfomanceCsvDownload data Request body", http.StatusBadRequest, nil)
// 		return
// 	}

// 	query = models.CsvSalesMetricsRetrieveQueryFunc()
// 	allSaleRepQuery := models.SalesRepRetrieveQueryFunc()
// 	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()

// 	// change table name here
// 	tableName := db.ViewName_ConsolidatedDataView
// 	dataReq.Email = req.Context().Value("emailid").(string)
// 	if dataReq.Email == "" {
// 		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
// 		return
// 	}

// 	whereEleList = append(whereEleList, dataReq.Email)
// 	data, err = db.ReteriveFromDB(db.OweHubDbIndex, otherRoleQuery, whereEleList)

// 	// This checks if the user is admin, sale rep or dealer
// 	if len(data) > 0 {
// 		role := data[0]["role_name"]
// 		name := data[0]["name"]
// 		rgnSalesMgrCheck = false
// 		dealerName, ok := data[0]["dealer_name"].(string)
// 		if dealerName == "" || !ok {
// 			dealerName = ""
// 		}

// 		if role == string(types.RoleAdmin) || role == string(types.RoleFinAdmin) || role == string(types.RoleAccountExecutive) || role == string(types.RoleAccountManager) {
// 			if len(dataReq.DealerName) <= 0 {
// 				perfomanceList := models.PerfomanceListResponse{}
// 				appserver.FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, perfomanceList, RecordCount)
// 				return
// 			}
// 		} else {
// 			dataReq.DealerName = []string{dealerName}
// 		}

// 		switch role {
// 		case string(types.RoleAdmin), string(types.RoleFinAdmin):
// 			filter, whereEleList = PrepareAdminDlrCsvFilters(tableName, dataReq, true, false, false)
// 		case string(types.RoleDealerOwner):
// 			filter, whereEleList = PrepareAdminDlrCsvFilters(tableName, dataReq, false, false, false)
// 		case string(types.RoleAccountManager), string(types.RoleAccountExecutive):
// 			dealerNames, err := FetchProjectDealerForAmAndAe(dataReq.Email, role)
// 			if err != nil {
// 				appserver.FormAndSendHttpResp(resp, fmt.Sprintf("%s", err), http.StatusBadRequest, nil)
// 				return
// 			}

// 			if len(dealerNames) == 0 {
// 				appserver.FormAndSendHttpResp(resp, "No dealer list present for this user", http.StatusOK, []string{}, RecordCount)
// 				return
// 			}
// 			dealerNameSet := make(map[string]bool)
// 			for _, dealer := range dealerNames {
// 				dealerNameSet[dealer] = true
// 			}

// 			for _, dealerNameFromUI := range dataReq.DealerName {
// 				if !dealerNameSet[dealerNameFromUI] {
// 					appserver.FormAndSendHttpResp(resp, "Please select your dealer name(s) from the allowed list", http.StatusBadRequest, nil)
// 					return
// 				}
// 			}
// 			filter, whereEleList = PrepareAdminDlrCsvFilters(tableName, dataReq, false, false, false)
// 		case string(types.RoleSalesRep):
// 			SaleRepList = append(SaleRepList, name)
// 			filter, whereEleList = PrepareSaleRepCsvFilters(tableName, dataReq, SaleRepList)
// 		// this is for the roles regional manager and sales manager
// 		default:
// 			SaleRepList = append(SaleRepList, name)
// 			rgnSalesMgrCheck = true
// 		}
// 	} else {
// 		log.FuncErrorTrace(0, "Failed to get Perfomance Csv Download data from DB err: %v", err)
// 		appserver.FormAndSendHttpResp(resp, "Failed to get Perfomance Csv Download data", http.StatusBadRequest, nil)
// 		return
// 	}

// 	if rgnSalesMgrCheck {
// 		data, err = db.ReteriveFromDB(db.OweHubDbIndex, allSaleRepQuery, whereEleList)

// 		// This is thrown if no sale rep are available and for other user roles
// 		if len(SaleRepList) == 0 {
// 			emptyPerfomanceList := models.PerfomanceListResponse{
// 				PerfomanceList: []models.PerfomanceResponse{},
// 			}
// 			log.FuncErrorTrace(0, "No sale representatives: %v", err)
// 			appserver.FormAndSendHttpResp(resp, "No sale representatives", http.StatusOK, emptyPerfomanceList, int64(len(data)))
// 			return
// 		}

// 		// this loops through sales rep under regional or sales manager
// 		for _, item := range data {
// 			SaleRepName, Ok := item["name"]
// 			if !Ok || SaleRepName == "" {
// 				log.FuncErrorTrace(0, "Failed to get name. Item: %+v\n", item)
// 				continue
// 			}
// 			SaleRepList = append(SaleRepList, SaleRepName)
// 		}
// 		filter, whereEleList = PrepareSaleRepCsvFilters(tableName, dataReq, SaleRepList)
// 	}

// 	if filter != "" {
// 		queryWithFiler = query + filter
// 	} else {
// 		log.FuncErrorTrace(0, "No user exist with mail: %v", dataReq.Email)
// 		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
// 		return
// 	}

// 	// retrieving value from owe_db from here
// 	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "Failed to get Perfomance Csv Download data from DB err: %v", err)
// 		appserver.FormAndSendHttpResp(resp, "Failed to get Perfomance Csv Download data", http.StatusBadRequest, nil)
// 		return
// 	}

// 	RecordCount = int64(len(data))
// 	perfomanceList := models.GetCsvPerformanceList{}

// 	for _, item := range data {
// 		// if no unique id is present we skip that project
// 		UniqueId, ok := item["unique_id"].(string)
// 		if !ok || UniqueId == "" {
// 			log.FuncErrorTrace(0, "Failed to get UniqueId. Item: %+v\n", item)
// 			// continue
// 		}

// 		HomeOwner, ok := item["home_owner"].(string)
// 		if !ok || HomeOwner == "" {
// 			log.FuncErrorTrace(0, "Failed to get Customer Item: %+v\n", item)
// 			// continue
// 		}

// 		CustomerEmail, ok := item["customer_email"].(string)
// 		if !ok || CustomerEmail == "" {
// 			log.FuncErrorTrace(0, "Failed to get Customer email Item: %+v\n", item)
// 			// continue
// 		}

// 		CustomerPhoneNumber, ok := item["customer_phone_number"].(string)
// 		if !ok || CustomerPhoneNumber == "" {
// 			log.FuncErrorTrace(0, "Failed to get Customer phone number Item: %+v\n", item)
// 			// continue
// 		}

// 		Address, ok := item["address"].(string)
// 		if !ok || Address == "" {
// 			log.FuncErrorTrace(0, "Failed to get address Item: %+v\n", item)
// 			// continue
// 		}

// 		State, ok := item["state"].(string)
// 		if !ok || State == "" {
// 			log.FuncErrorTrace(0, "Failed to get State Item: %+v\n", item)
// 			// continue
// 		}

// 		ContractTotal, ok := item["contract_total"].(float64)
// 		if !ok || ContractTotal == 0.0 {
// 			log.FuncErrorTrace(0, "Failed to get ContractTotal Item: %+v\n", item)
// 			// continue
// 		}

// 		SystemSize, ok := item["system_size"].(float64)
// 		if !ok || SystemSize == 0.0 {
// 			log.FuncErrorTrace(0, "Failed to get ContractTotal Item: %+v\n", item)
// 			// continue
// 		}

// 		SiteSurveyScheduleDate, ok := item["site_survey_scheduled_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get ContractDate for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			SiteSurveyD = ""
// 		} else {
// 			SiteSurveyD = SiteSurveyScheduleDate.Format("2006-01-02")
// 			if SiteSurveyD == "2199-12-30" {
// 				SiteSurveyD = "" // Set to empty string if date matches the invalid date
// 			}
// 		}

// 		SiteSurverCompleteDate, ok := item["site_survey_completed_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get PermitApprovedDate for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			SiteSurveyComD = ""
// 		} else {
// 			SiteSurveyComD = SiteSurverCompleteDate.Format("2006-01-02")
// 		}

// 		CadReady, ok := item["cad_ready"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get PvInstallCompletedDate for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			CadD = ""
// 		} else {
// 			CadD = CadReady.Format("2006-01-02")
// 		}

// 		CadCompleteDate, ok := item["cad_complete_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			CadCompleteD = ""
// 		} else {
// 			CadCompleteD = CadCompleteDate.Format("2006-01-02")
// 		}

// 		PvSubmittedDate, ok := item["permit_submitted_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get SiteSurverCompleteDate for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			permitSubmittedD = ""
// 		} else {
// 			permitSubmittedD = PvSubmittedDate.Format("2006-01-02")
// 		}

// 		IcSubmittedDate, ok := item["ic_submitted_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get cad complete date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			IcSubmitD = ""
// 		} else {
// 			IcSubmitD = IcSubmittedDate.Format("2006-01-02")
// 		}

// 		PermitApprovedDate, ok := item["permit_approved_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get InstallReadyDate for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			PermitApprovedD = ""
// 		} else {
// 			PermitApprovedD = PermitApprovedDate.Format("2006-01-02")
// 		}

// 		IcAPprovedDate, ok := item["ic_approved_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get roofing complete date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			IcaprvdD = ""
// 		} else {
// 			IcaprvdD = IcAPprovedDate.Format("2006-01-02")
// 		}

// 		RoofingCratedDate, ok := item["roofing_created_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get electrical permit approved date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			RoofingCreatedD = ""
// 		} else {
// 			RoofingCreatedD = RoofingCratedDate.Format("2006-01-02")
// 		}

// 		RoofinCompleteDate, ok := item["roofing_completed_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			RoofingCompleteD = ""
// 		} else {
// 			RoofingCompleteD = RoofinCompleteDate.Format("2006-01-02")
// 		}

// 		PVInstallCreatedDate, ok := item["pv_install_created_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			PvInstallCreateD = ""
// 		} else {
// 			PvInstallCreateD = PVInstallCreatedDate.Format("2006-01-02")
// 		}

// 		BatteryScheduleDate, ok := item["battery_scheduled_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			BatteryScheduleD = ""
// 		} else {
// 			BatteryScheduleD = BatteryScheduleDate.Format("2006-01-02")
// 		}

// 		BatteryCompleteDate, ok := item["battery_complete_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			BatteryCompleteD = ""
// 		} else {
// 			BatteryCompleteD = BatteryCompleteDate.Format("2006-01-02")
// 		}

// 		PvInstallCompletedDate, ok := item["pv_install_completed_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			PvInstallCompleteD = ""
// 		} else {
// 			PvInstallCompleteD = PvInstallCompletedDate.Format("2006-01-02")
// 		}

// 		MpuCreateDate, ok := item["mpu_created_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			MpuCreateD = ""
// 		} else {
// 			MpuCreateD = MpuCreateDate.Format("2006-01-02")
// 		}

// 		DerateCreateDate, ok := item["derate_created_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			DerateCreateD = ""
// 		} else {
// 			DerateCreateD = DerateCreateDate.Format("2006-01-02")
// 		}

// 		TrenchingWSOpen, ok := item["trenching_ws_open"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			TrechingWSOpenD = ""
// 		} else {
// 			TrechingWSOpenD = TrenchingWSOpen.Format("2006-01-02")
// 		}

// 		DerateCompleteDate, ok := item["derate_completed_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			DerateCompleteD = ""
// 		} else {
// 			DerateCompleteD = DerateCompleteDate.Format("2006-01-02")
// 		}

// 		MPUCompleteDate, ok := item["mpu_complete_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			MpucompleteD = ""
// 		} else {
// 			MpucompleteD = MPUCompleteDate.Format("2006-01-02")
// 		}

// 		TrenchingCompleteDate, ok := item["trenching_completed"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			TrenchingComD = ""
// 		} else {
// 			TrenchingComD = TrenchingCompleteDate.Format("2006-01-02")
// 		}

// 		FinCreatedDate, ok := item["fin_created_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			FinCreateD = ""
// 		} else {
// 			FinCreateD = FinCreatedDate.Format("2006-01-02")
// 		}

// 		FinPassdate, ok := item["fin_pass_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			FinPassD = ""
// 		} else {
// 			FinPassD = FinPassdate.Format("2006-01-02")
// 		}

// 		PtoSubmittedDate, ok := item["pto_submitted_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			PTOSubmitD = ""
// 		} else {
// 			PTOSubmitD = PtoSubmittedDate.Format("2006-01-02")
// 		}

// 		PtoDate, ok := item["pto_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			PTOD = ""
// 		} else {
// 			PTOD = PtoDate.Format("2006-01-02")
// 		}

// 		ContractDate, ok := item["contract_date"].(time.Time)
// 		if !ok {
// 			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
// 			contractD = ""
// 		} else {
// 			contractD = ContractDate.Format("2006-01-02")
// 		}

// 		RoofingStatus, ok := item["roofing_status"].(string)
// 		if !ok || RoofingStatus == "" {
// 			log.FuncErrorTrace(0, "Failed to get roofing status Item: %+v\n", item)
// 			// continue
// 		}
// 		// _, SiteSurveyCountT, _, _ := getSurveyColor(SiteSurveyD, SiteSurveyComD, contractD)
// 		// SiteSurveyCount += SiteSurveyCountT
// 		// _, CadDesignCountT, _ := getCadColor(CadD, CadCompleteD, SiteSurveyComD)
// 		// CadDesignCount += CadDesignCountT
// 		// _, PerimittingCountT, _ := getPermittingColor(permitSubmittedD, IcSubmitD, PermitApprovedD, IcaprvdD, CadCompleteD)
// 		// PerimittingCount += PerimittingCountT
// 		// _, RoofingCountT, _ := roofingColor(RoofingCreatedD, RoofingCompleteD, RoofingStatus)
// 		// RoofingCount += RoofingCountT
// 		// _, InstallCountT, _, _ := installColor(PvInstallCreateD, BatteryScheduleD, BatteryCompleteD, PvInstallCompleteD, PermitApprovedD, IcaprvdD)
// 		// InstallCount += InstallCountT
// 		// _, electricCountT, _ := electricalColor(MpuCreateD, DerateCreateD, TrechingWSOpenD, DerateCompleteD, MpucompleteD, TrenchingComD)
// 		// ElectricalCount += electricCountT
// 		// _, InspectionCountT, _ := InspectionColor(FinCreateD, FinPassD, PvInstallCompleteD)
// 		// InspectionCount += InspectionCountT
// 		// _, actiovationCountT, _ := activationColor(PTOSubmitD, PTOD, FinPassD, FinCreateD)
// 		// ActivationCount += actiovationCountT

// 		perfomanceCsvResponse := models.GetCsvPerformance{
// 			UniqueId:                UniqueId,
// 			HomeOwner:               HomeOwner,
// 			Email:                   CustomerEmail,
// 			PhoneNumber:             CustomerPhoneNumber,
// 			Address:                 Address,
// 			State:                   State,
// 			ContractAmount:          ContractTotal,
// 			SystemSize:              SystemSize,
// 			ContractDate:            contractD,
// 			SiteSurevyScheduleDate:  SiteSurveyD,
// 			SiteSurveyCompletedDate: SiteSurveyComD,
// 			CadReadyDate:            CadD,
// 			CadCompletedDate:        CadCompleteD,
// 			PermitSubmittedDate:     permitSubmittedD,
// 			IcSubmittedDate:         IcSubmitD,
// 			PermitApprovedDate:      PermitApprovedD,
// 			IcApprovedDate:          IcaprvdD,
// 			RoofingCreatedDate:      RoofingCreatedD,
// 			RoofingCompleteDate:     RoofingCompleteD,
// 			PvInstallCreatedDate:    PvInstallCreateD,
// 			BatteryScheduledDate:    BatteryScheduleD,
// 			BatteryCompletedDate:    BatteryCompleteD,
// 			PvInstallCompletedDate:  PvInstallCompleteD,
// 			MpuCreatedDate:          MpuCreateD,
// 			DerateCreateDate:        DerateCreateD,
// 			TrenchingWSOpenDate:     TrechingWSOpenD,
// 			DerateCompleteDate:      DerateCompleteD,
// 			MpucompleteDate:         MpucompleteD,
// 			TrenchingCompleteDate:   TrenchingComD,
// 			FinCreateDate:           FinCreateD,
// 			FinPassDate:             FinPassD,
// 			PtoSubmittedDate:        PTOSubmitD,
// 			PtoDate:                 PTOD,
// 		}

// 		switch dataReq.SelectedMilestone {
// 		case "survey":
// 			if SiteSurveyCountT == 1 {
// 				perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
// 			}
// 		case "cad":
// 			if CadDesignCountT == 1 {
// 				perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
// 			}
// 		case "permit":
// 			if PerimittingCountT == 1 {
// 				perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
// 			}
// 		case "roof":
// 			if RoofingCountT == 1 {
// 				perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
// 			}
// 		case "install":
// 			if InstallCountT == 1 {
// 				perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
// 			}
// 		case "electrical":
// 			if electricCountT == 1 {
// 				perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
// 			}
// 		case "inspection":
// 			if InspectionCountT == 1 {
// 				perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
// 			}
// 		case "activation":
// 			if actiovationCountT == 1 {
// 				perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
// 			}
// 		default:
// 			perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
// 		}

// 		switch dataReq.SelectedMilestone {
// 		case "survey":
// 			RecordCount = SiteSurveyCount
// 		case "cad":
// 			RecordCount = CadDesignCount
// 		case "permit":
// 			RecordCount = PerimittingCount
// 		case "roof":
// 			RecordCount = RoofingCount
// 		case "install":
// 			RecordCount = InstallCount
// 		case "electrical":
// 			RecordCount = ElectricalCount
// 		case "inspection":
// 			RecordCount = InspectionCount
// 		case "activation":
// 			RecordCount = ActivationCount
// 		}

// 	}

// 	log.FuncInfoTrace(0, "Number of data List fetched : %v list %+v", len(data), data)
// 	appserver.FormAndSendHttpResp(resp, "Perfomance Csv Data", http.StatusOK, perfomanceList, RecordCount)
// }

// /*
// *****************************************************************************
//   - FUNCTION:		PrepareAdminDlrCsvFilters
//   - DESCRIPTION: this function help to add filter condition in query
//   				for admin and dealer owner
// *****************************************************************************
// */

// func PrepareAdminDlrCsvFilters(tableName string, dataFilter models.GetCsvDownload, adminCheck, filterCheck, dataCount bool) (filters string, whereEleList []interface{}) {
// 	log.EnterFn(0, "PrepareAdminDlrCsvFilters")
// 	defer func() { log.ExitFn(0, "PrepareAdminDlrCsvFilters", nil) }()

// 	var filtersBuilder strings.Builder
// 	whereAdded := false

// 	// Check if StartDate and EndDate are provided
// 	if dataFilter.StartDate != "" && dataFilter.EndDate != "" {
// 		startDate, _ := time.Parse("02-01-2006", dataFilter.StartDate)
// 		endDate, _ := time.Parse("02-01-2006", dataFilter.EndDate)

// 		endDate = endDate.Add(24*time.Hour - time.Second)

// 		whereEleList = append(whereEleList,
// 			startDate.Format("02-01-2006 00:00:00"),
// 			endDate.Format("02-01-2006 15:04:05"),
// 		)

// 		filtersBuilder.WriteString(" WHERE")
// 		filtersBuilder.WriteString(fmt.Sprintf(" customers_customers_schema.sale_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
// 		whereAdded = true
// 	}

// 	if len(dataFilter.DealerName) > 0 {
// 		if whereAdded {
// 			filtersBuilder.WriteString(" AND ")
// 		} else {
// 			filtersBuilder.WriteString(" WHERE ")
// 			whereAdded = true
// 		}

// 		filtersBuilder.WriteString(" customers_customers_schema.dealer IN (")
// 		for i, dealer := range dataFilter.DealerName {
// 			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
// 			whereEleList = append(whereEleList, dealer)

// 			if i < len(dataFilter.DealerName)-1 {
// 				filtersBuilder.WriteString(", ")
// 			}
// 		}
// 		filtersBuilder.WriteString(")")
// 	}

// 	// Always add the following filters
// 	if whereAdded {
// 		filtersBuilder.WriteString(" AND")
// 	} else {
// 		filtersBuilder.WriteString(" WHERE")
// 		whereAdded = true
// 	}
// 	// Add the always-included filters
// 	filtersBuilder.WriteString(` customers_customers_schema.unique_id IS NOT NULL
// 			AND customers_customers_schema.unique_id <> ''
// 			AND system_customers_schema.contracted_system_size_parent IS NOT NULL
// 			AND system_customers_schema.contracted_system_size_parent > 0`)

// 	if len(dataFilter.ProjectStatus) > 0 {
// 		// Prepare the values for the IN clause
// 		var statusValues []string
// 		for _, val := range dataFilter.ProjectStatus {
// 			statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
// 		}
// 		// Join the values with commas
// 		statusList := strings.Join(statusValues, ", ")

// 		// Append the IN clause to the filters
// 		filtersBuilder.WriteString(fmt.Sprintf(` AND customers_customers_schema.project_status IN (%s)`, statusList))
// 	} else {
// 		filtersBuilder.WriteString(` AND customers_customers_schema.project_status IN ('ACTIVE')`)
// 	}

// 	filters = filtersBuilder.String()

// 	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
// 	return filters, whereEleList
// }

// /******************************************************************************
// * FUNCTION:		PrepareInstallCostFilters
// * DESCRIPTION:     handler for prepare filter
// * INPUT:			resp, req
// * RETURNS:    		void
// ******************************************************************************/
// func PrepareSaleRepCsvFilters(tableName string, dataFilter models.GetCsvDownload, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
// 	log.EnterFn(0, "PrepareStatusFilters")
// 	defer func() { log.ExitFn(0, "PrepareStatusFilters", nil) }()

// 	var filtersBuilder strings.Builder
// 	whereAdded := false

// 	// Start constructing the WHERE clause if the date range is provided
// 	if dataFilter.StartDate != "" && dataFilter.EndDate != "" {
// 		startDate, _ := time.Parse("02-01-2006", dataFilter.StartDate)
// 		endDate, _ := time.Parse("02-01-2006", dataFilter.EndDate)

// 		endDate = endDate.Add(24*time.Hour - time.Second)

// 		whereEleList = append(whereEleList,
// 			startDate.Format("02-01-2006 00:00:00"),
// 			endDate.Format("02-01-2006 15:04:05"),
// 		)

// 		filtersBuilder.WriteString(fmt.Sprintf(" WHERE customers_customers_schema.sale_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
// 		whereAdded = true
// 	}

// 	// Add sales representative filter
// 	if len(saleRepList) > 0 {
// 		if whereAdded {
// 			filtersBuilder.WriteString(" AND ")
// 		} else {
// 			filtersBuilder.WriteString(" WHERE ")
// 			whereAdded = true
// 		}

// 		filtersBuilder.WriteString(" customers_customers_schema.primary_sales_rep IN (")
// 		for i, sale := range saleRepList {
// 			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
// 			whereEleList = append(whereEleList, sale)

// 			if i < len(saleRepList)-1 {
// 				filtersBuilder.WriteString(", ")
// 			}
// 		}
// 		filtersBuilder.WriteString(")")
// 	}

// 	if len(dataFilter.DealerName) > 0 {
// 		if whereAdded {
// 			filtersBuilder.WriteString(" AND ")
// 		} else {
// 			filtersBuilder.WriteString(" WHERE ")
// 			whereAdded = true
// 		}

// 		filtersBuilder.WriteString(" customers_customers_schema.dealer IN (")
// 		for i, dealer := range dataFilter.DealerName {
// 			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
// 			whereEleList = append(whereEleList, dealer)

// 			if i < len(dataFilter.DealerName)-1 {
// 				filtersBuilder.WriteString(", ")
// 			}
// 		}
// 		filtersBuilder.WriteString(")")
// 	}

// 	// Always add the following filters
// 	if whereAdded {
// 		filtersBuilder.WriteString(" AND")
// 	} else {
// 		filtersBuilder.WriteString(" WHERE")
// 		whereAdded = true
// 	}
// 	// Add the always-included filters
// 	filtersBuilder.WriteString(` customers_customers_schema.unique_id IS NOT NULL
// 			AND customers_customers_schema.unique_id <> ''
// 			AND system_customers_schema.contracted_system_size_parent IS NOT NULL
// 			AND system_customers_schema.contracted_system_size_parent > 0`)

// 	if len(dataFilter.ProjectStatus) > 0 {
// 		// Prepare the values for the IN clause
// 		var statusValues []string
// 		for _, val := range dataFilter.ProjectStatus {
// 			statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
// 		}
// 		// Join the values with commas
// 		statusList := strings.Join(statusValues, ", ")

// 		// Append the IN clause to the filters
// 		filtersBuilder.WriteString(fmt.Sprintf(` AND customers_customers_schema.project_status IN (%s)`, statusList))
// 	} else {
// 		filtersBuilder.WriteString(` AND customers_customers_schema.project_status IN ('ACTIVE')`)
// 	}

// 	filters = filtersBuilder.String()

// 	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
// 	return filters, whereEleList
// }
