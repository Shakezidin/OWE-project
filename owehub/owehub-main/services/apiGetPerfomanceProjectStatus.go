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
	"OWEApp/shared/types"
	"encoding/json"
	"io/ioutil"
	"math"
	"strings"
	"time"

	"fmt"
	"net/http"
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
		singleData         map[string]bool
		err                error
		dataReq            models.PerfomanceStatusReq
		data               []map[string]interface{}
		whereEleList       []interface{}
		queryWithFiler     string
		filter             string
		rgnSalesMgrCheck   bool
		RecordCount        int64
		SaleRepList        []interface{}
		SiteSurveyD        string
		SiteSurveyComD     string
		CadD               string
		CadCompleteD       string
		permitSubmittedD   string
		IcSubmitD          string
		PermitApprovedD    string
		IcaprvdD           string
		RoofingCreatedD    string
		RoofingCompleteD   string
		MpuCreateD         string
		BatteryScheduleD   string
		BatteryCompleteD   string
		PvInstallCompleteD string
		DerateCreateD      string
		TrechingWSOpenD    string
		DerateCompleteD    string
		MpucompleteD       string
		TrenchingComD      string
		FinCreateD         string
		FinPassD           string
		PTOSubmitD         string
		PTOD               string
		PvInstallCreateD   string
		SiteSurveyCount    int64
		CadDesignCount     int64
		PerimittingCount   int64
		RoofingCount       int64
		InstallCount       int64
		ElectricalCount    int64
		InspectionCount    int64
		ActivationCount    int64
		contractD          string
		ntpD               string
		forAGRp            = make(map[string]ForAgRp)
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

	allSaleRepQuery := models.SalesRepRetrieveQueryFunc()
	saleMetricsQuery := models.SalesMetricsRetrieveQueryFunc()
	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()

	// change table name here
	tableName := db.ViewName_ConsolidatedDataView
	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	whereEleList = append(whereEleList, dataReq.Email)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, otherRoleQuery, whereEleList)

	// This checks if the user is admin, sale rep or dealer
	if len(data) > 0 {
		role := data[0]["role_name"]
		name := data[0]["name"]
		rgnSalesMgrCheck = false
		dealerName, ok := data[0]["dealer_name"].(string)
		if dealerName == "" || !ok {
			dealerName = ""
		}

		if role == string(types.RoleAdmin) || role == string(types.RoleFinAdmin) || role == string(types.RoleAccountExecutive) || role == string(types.RoleAccountManager) {
			if len(dataReq.DealerNames) <= 0 {
				perfomanceList := models.PerfomanceListResponse{}
				appserver.FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, perfomanceList, RecordCount)
				return
			}
		} else {
			dataReq.DealerNames = []string{dealerName}
		}

		switch role {
		case string(types.RoleAdmin), string(types.RoleFinAdmin):
			filter, whereEleList = PrepareAdminDlrFilters(tableName, dataReq, true, false, false)
		case string(types.RoleDealerOwner), string(types.RoleSubDealerOwner):
			filter, whereEleList = PrepareAdminDlrFilters(tableName, dataReq, false, false, false)
		case string(types.RoleAccountManager), string(types.RoleAccountExecutive):
			dealerNames, err := FetchProjectDealerForAmAndAe(dataReq.Email, role)
			if err != nil {
				appserver.FormAndSendHttpResp(resp, fmt.Sprintf("%s", err), http.StatusBadRequest, nil)
				return
			}

			if len(dealerNames) == 0 {
				appserver.FormAndSendHttpResp(resp, "No dealer list present for this user", http.StatusOK, []string{}, RecordCount)
				return
			}
			dealerNameSet := make(map[string]bool)
			for _, dealer := range dealerNames {
				dealerNameSet[dealer] = true
			}

			for _, dealerNameFromUI := range dataReq.DealerNames {
				if !dealerNameSet[dealerNameFromUI] {
					appserver.FormAndSendHttpResp(resp, "Please select your dealer name(s) from the allowed list", http.StatusBadRequest, nil)
					return
				}
			}
			filter, whereEleList = PrepareAdminDlrFilters(tableName, dataReq, false, false, false)
		case string(types.RoleSalesRep):
			SaleRepList = append(SaleRepList, name)
			filter, whereEleList = PrepareSaleRepFilters(tableName, dataReq, SaleRepList)
		// this is for the roles regional manager and sales manager
		default:
			SaleRepList = append(SaleRepList, name)
			rgnSalesMgrCheck = true
		}
	} else {
		log.FuncErrorTrace(0, "Failed to get PerfomanceProjectStatus data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get PerfomanceProjectStatus data", http.StatusBadRequest, nil)
		return
	}

	if rgnSalesMgrCheck {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, allSaleRepQuery, whereEleList)

		// This is thrown if no sale rep are available and for other user roles
		if len(SaleRepList) == 0 {
			emptyPerfomanceList := models.PerfomanceListResponse{
				PerfomanceList: []models.PerfomanceResponse{},
			}
			log.FuncErrorTrace(0, "No sale representatives exist: %v", err)
			appserver.FormAndSendHttpResp(resp, "No sale representatives exist", http.StatusOK, emptyPerfomanceList, int64(len(data)))
			return
		}

		// this loops through sales rep under regional or sales manager
		for _, item := range data {
			SaleRepName, Ok := item["name"]
			if !Ok || SaleRepName == "" {
				log.FuncErrorTrace(0, "Failed to get name. Item: %+v\n", item)
				continue
			}
			SaleRepList = append(SaleRepList, SaleRepName)
		}

		// dealerName = data[0]["dealer_name"]
		// dataReq.DealerName = dealerName
		filter, whereEleList = PrepareSaleRepFilters(tableName, dataReq, SaleRepList)
	}

	if filter != "" {
		queryWithFiler = saleMetricsQuery + filter
	} else {
		log.FuncErrorTrace(0, "No user exist with mail: %v", dataReq.Email)
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	// retrieving value from owe_db from here
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get PerfomanceProjectStatus data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get PerfomanceProjectStatus data", http.StatusBadRequest, nil)
		return
	}

	RecordCount = int64(len(data))
	perfomanceList := models.PerfomanceListResponse{}
	invalidDate, _ := time.Parse("2006-01-02", "2199-01-01")
	var uniqueIds []string

	singleData = make(map[string]bool)

	for _, item := range data {

		// if no unique id is present we skip that project
		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get UniqueId. Item: %+v\n", item)
			continue
		}

		if !singleData[UniqueId] {
			singleData[UniqueId] = true
		} else {
			continue
		}

		Customer, ok := item["home_owner"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get Customer Item: %+v\n", item)
			// continue
		}

		SiteSurveyScheduleDate, ok := item["site_survey_scheduled_date"].(time.Time)
		if !ok || SiteSurveyScheduleDate.Equal(invalidDate) {
			// log.FuncErrorTrace(0, "Failed to get ContractDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			SiteSurveyD = ""
		} else {
			SiteSurveyD = SiteSurveyScheduleDate.Format("2006-01-02")
			if SiteSurveyD == "2199-12-30" {
				SiteSurveyD = "" // Set to empty string if date matches the invalid date
			}
		}

		SiteSurverCompleteDate, ok := item["site_survey_completed_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PermitApprovedDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			SiteSurveyComD = ""
		} else {
			SiteSurveyComD = SiteSurverCompleteDate.Format("2006-01-02")
		}

		CadReady, ok := item["cad_ready"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PvInstallCompletedDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			CadD = ""
		} else {
			CadD = CadReady.Format("2006-01-02")
		}

		CadCompleteDate, ok := item["cad_complete_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			CadCompleteD = ""
		} else {
			CadCompleteD = CadCompleteDate.Format("2006-01-02")
		}

		PvSubmittedDate, ok := item["permit_submitted_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get SiteSurverCompleteDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			permitSubmittedD = ""
		} else {
			permitSubmittedD = PvSubmittedDate.Format("2006-01-02")
		}

		IcSubmittedDate, ok := item["ic_submitted_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get cad complete date for Unique ID %v. Item: %+v\n", UniqueId, item)
			IcSubmitD = ""
		} else {
			IcSubmitD = IcSubmittedDate.Format("2006-01-02")
		}

		PermitApprovedDate, ok := item["permit_approved_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get InstallReadyDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PermitApprovedD = ""
		} else {
			PermitApprovedD = PermitApprovedDate.Format("2006-01-02")
		}

		IcAPprovedDate, ok := item["ic_approved_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get roofing complete date for Unique ID %v. Item: %+v\n", UniqueId, item)
			IcaprvdD = ""
		} else {
			IcaprvdD = IcAPprovedDate.Format("2006-01-02")
		}

		RoofingCratedDate, ok := item["roofing_created_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get electrical permit approved date for Unique ID %v. Item: %+v\n", UniqueId, item)
			RoofingCreatedD = ""
		} else {
			RoofingCreatedD = RoofingCratedDate.Format("2006-01-02")
		}

		RoofinCompleteDate, ok := item["roofing_completed_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			RoofingCompleteD = ""
		} else {
			RoofingCompleteD = RoofinCompleteDate.Format("2006-01-02")
		}

		PVInstallCreatedDate, ok := item["pv_install_created_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			PvInstallCreateD = ""
		} else {
			PvInstallCreateD = PVInstallCreatedDate.Format("2006-01-02")
		}

		BatteryScheduleDate, ok := item["battery_scheduled_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			BatteryScheduleD = ""
		} else {
			BatteryScheduleD = BatteryScheduleDate.Format("2006-01-02")
		}

		BatteryCompleteDate, ok := item["battery_complete_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			BatteryCompleteD = ""
		} else {
			BatteryCompleteD = BatteryCompleteDate.Format("2006-01-02")
		}

		PvInstallCompletedDate, ok := item["pv_install_completed_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			PvInstallCompleteD = ""
		} else {
			PvInstallCompleteD = PvInstallCompletedDate.Format("2006-01-02")
		}

		MpuCreateDate, ok := item["mpu_created_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			MpuCreateD = ""
		} else {
			MpuCreateD = MpuCreateDate.Format("2006-01-02")
		}

		DerateCreateDate, ok := item["derate_created_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			DerateCreateD = ""
		} else {
			DerateCreateD = DerateCreateDate.Format("2006-01-02")
		}

		TrenchingWSOpen, ok := item["trenching_ws_open"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			TrechingWSOpenD = ""
		} else {
			TrechingWSOpenD = TrenchingWSOpen.Format("2006-01-02")
		}

		DerateCompleteDate, ok := item["derate_completed_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			DerateCompleteD = ""
		} else {
			DerateCompleteD = DerateCompleteDate.Format("2006-01-02")
		}

		MPUCompleteDate, ok := item["mpu_complete_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			MpucompleteD = ""
		} else {
			MpucompleteD = MPUCompleteDate.Format("2006-01-02")
		}

		TrenchingCompleteDate, ok := item["trenching_completed"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			TrenchingComD = ""
		} else {
			TrenchingComD = TrenchingCompleteDate.Format("2006-01-02")
		}

		FinCreatedDate, ok := item["fin_created_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			FinCreateD = ""
		} else {
			FinCreateD = FinCreatedDate.Format("2006-01-02")
		}

		FinPassdate, ok := item["fin_pass_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			FinPassD = ""
		} else {
			FinPassD = FinPassdate.Format("2006-01-02")
		}

		PtoSubmittedDate, ok := item["pto_submitted_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			PTOSubmitD = ""
		} else {
			PTOSubmitD = PtoSubmittedDate.Format("2006-01-02")
		}

		PtoDate, ok := item["pto_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			PTOD = ""
		} else {
			PTOD = PtoDate.Format("2006-01-02")
		}

		ContractDate, ok := item["contract_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			contractD = ""
		} else {
			contractD = ContractDate.Format("2006-01-02")
		}

		ntpDate, ok := item["ntp_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			ntpD = ""
		} else {
			ntpD = ntpDate.Format("2006-01-02")
		}

		RoofingStatus, ok := item["roofing_status"].(string)
		if !ok || RoofingStatus == "" {
			log.FuncErrorTrace(0, "Failed to get roofing status Item: %+v\n", item)
			// continue
		}

		surveyColor, SiteSurveyCountT, SiteSurevyDate, _ := getSurveyColor(SiteSurveyD, SiteSurveyComD, contractD)

		SiteSurveyCount += SiteSurveyCountT

		cadColor, CadDesignCountT, CadDesignDate := getCadColor(CadD, CadCompleteD, SiteSurveyComD)

		CadDesignCount += CadDesignCountT

		permitColor, PerimittingCountT, PermittingDate := getPermittingColor(permitSubmittedD, IcSubmitD, PermitApprovedD, IcaprvdD, CadCompleteD)

		PerimittingCount += PerimittingCountT

		roofingColor, RoofingCountT, RoofingDate := roofingColor(RoofingCreatedD, RoofingCompleteD, RoofingStatus)

		RoofingCount += RoofingCountT

		installColor, InstallCountT, InstallDate, _ := installColor(PvInstallCreateD, BatteryScheduleD, BatteryCompleteD, PvInstallCompleteD, PermitApprovedD, IcaprvdD)

		InstallCount += InstallCountT

		electricColor, electricCountT, ElectricalDate := electricalColor(MpuCreateD, DerateCreateD, TrechingWSOpenD, DerateCompleteD, MpucompleteD, TrenchingComD)

		ElectricalCount += electricCountT

		inspectionColor, InspectionCountT, InspectionDate := InspectionColor(FinCreateD, FinPassD, PvInstallCompleteD)

		InspectionCount += InspectionCountT

		activationColor, actiovationCountT, ActivationDate := activationColor(PTOSubmitD, PTOD, FinPassD, FinCreateD)

		ActivationCount += actiovationCountT

		perfomanceResponse := models.PerfomanceResponse{
			UniqueId:          UniqueId,
			Customer:          Customer,
			SiteSurevyDate:    SiteSurevyDate,
			CadDesignDate:     CadDesignDate,
			PermittingDate:    PermittingDate,
			RoofingDate:       RoofingDate,
			InstallDate:       InstallDate,
			ElectricalDate:    ElectricalDate,
			InspectionDate:    InspectionDate,
			ActivationDate:    ActivationDate,
			SiteSurveyColour:  surveyColor,
			CADDesignColour:   cadColor,
			PermittingColour:  permitColor,
			RoofingColour:     roofingColor,
			InstallColour:     installColor,
			ElectricalColour:  electricColor,
			InspectionsColour: inspectionColor,
			ActivationColour:  activationColor,
			NTPdate:           ntpD,
		}
		forAGRp[UniqueId] = ForAgRp{
			SurveyClr:     surveyColor,
			CadClr:        cadColor,
			PermittingClr: permitColor,
			RoofingClr:    roofingColor,
			InstallClr:    installColor,
			ElectricalClr: electricColor,
			InspectionClr: inspectionColor,
			ActivationClr: activationColor,
			NTPClr:        "",
		}
		switch dataReq.SelectedMilestone {
		case "survey":
			if SiteSurveyCountT == 1 {
				perfomanceList.PerfomanceList = append(perfomanceList.PerfomanceList, perfomanceResponse)
			}
		case "cad":
			if CadDesignCountT == 1 {
				perfomanceList.PerfomanceList = append(perfomanceList.PerfomanceList, perfomanceResponse)
			}
		case "permit":
			if PerimittingCountT == 1 {
				perfomanceList.PerfomanceList = append(perfomanceList.PerfomanceList, perfomanceResponse)
			}
		case "roof":
			if RoofingCountT == 1 {
				perfomanceList.PerfomanceList = append(perfomanceList.PerfomanceList, perfomanceResponse)
			}
		case "install":
			if InstallCountT == 1 {
				perfomanceList.PerfomanceList = append(perfomanceList.PerfomanceList, perfomanceResponse)
			}
		case "electrical":
			if electricCountT == 1 {
				perfomanceList.PerfomanceList = append(perfomanceList.PerfomanceList, perfomanceResponse)
			}
		case "inspection":
			if InspectionCountT == 1 {
				perfomanceList.PerfomanceList = append(perfomanceList.PerfomanceList, perfomanceResponse)
			}
		case "activation":
			if actiovationCountT == 1 {
				perfomanceList.PerfomanceList = append(perfomanceList.PerfomanceList, perfomanceResponse)
			}
		default:
			perfomanceList.PerfomanceList = append(perfomanceList.PerfomanceList, perfomanceResponse)
		}
	}
	RecordCount = int64(len(perfomanceList.PerfomanceList))

	

	agngRpForUserId, err := agngRpData(forAGRp, dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get agngRpForUserId for Unique ID: %v err: %v", uniqueIds, err)
	}
	FilteredIds, err := FilterAgRpData(dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "error while calling FilterAgRpData : %v", err)

	}

	updated := make(map[string]bool)
	for i := range perfomanceList.PerfomanceList {
		if _, alreadyUpdated := updated[perfomanceList.PerfomanceList[i].UniqueId]; !alreadyUpdated {

			if exists, ok := agngRpForUserId[perfomanceList.PerfomanceList[i].UniqueId]; ok {

				perfomanceList.PerfomanceList[i].Days_Pending_Permits = exists.Days_Pending_Permits

				perfomanceList.PerfomanceList[i].Days_Pending_Install = exists.Days_Pending_Install

				perfomanceList.PerfomanceList[i].Days_Pending_PTO = exists.Days_Pending_PTO

				perfomanceList.PerfomanceList[i].Days_Pending_Project_Age = exists.Days_Pending_Project_Age

				perfomanceList.PerfomanceList[i].Days_Pending_Cad_Design = exists.Days_Pending_Cad_Design

				perfomanceList.PerfomanceList[i].Days_Pending_Roofing = exists.Days_Pending_Roofing

				perfomanceList.PerfomanceList[i].Days_Pending_Inspection = exists.Days_Pending_Inspection

				updated[perfomanceList.PerfomanceList[i].UniqueId] = true
			}

		}
	}
	var filteredData []models.PerfomanceResponse

	if len(FilteredIds) != 0 {

		for i := range perfomanceList.PerfomanceList {
			if _, ok := FilteredIds[perfomanceList.PerfomanceList[i].UniqueId]; ok {
				filteredData = append(filteredData, perfomanceList.PerfomanceList[i])
			}
		}
		log.FuncErrorTrace(0, "filteredData testin: %v", filteredData)
	}

	switch dataReq.SelectedMilestone {
	case "survey":
		RecordCount = SiteSurveyCount
	case "cad":
		RecordCount = CadDesignCount
	case "permit":
		RecordCount = PerimittingCount
	case "roof":
		RecordCount = RoofingCount
	case "install":
		RecordCount = InstallCount
	case "electrical":
		RecordCount = ElectricalCount
	case "inspection":
		RecordCount = InspectionCount
	case "activation":
		RecordCount = ActivationCount
	}
	if len(filteredData) != 0 {
		perfomanceList.PerfomanceList = filteredData
		RecordCount = int64(len(perfomanceList.PerfomanceList))
	}
	paginatedData := PaginateData(perfomanceList, dataReq, agngRpForUserId)
	perfomanceList.PerfomanceList = paginatedData

	log.FuncInfoTrace(0, "Number of PerfomanceProjectStatus List fetched : %v list %+v\n", len(perfomanceList.PerfomanceList), perfomanceList)
	appserver.FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, perfomanceList, RecordCount)
}

/*
*****************************************************************************
  - FUNCTION:		PrepareAdminDlrFilters
  - DESCRIPTION:
    PaginateData function paginates data directly from the returned data itself
    without setting any offset value. For large data sizes, using an offset
    was creating performance issues. This approach manages to keep the response
    time under 2 seconds.

*****************************************************************************
*/

func PaginateData(data models.PerfomanceListResponse, req models.PerfomanceStatusReq, agngRpForUserId map[string]models.PerfomanceResponse) []models.PerfomanceResponse {
	updated := make(map[string]bool)
	log.EnterFn(0, "PaginateData")
	defer func() { log.ExitFn(0, "PaginateData", nil) }()
	paginatedData := make([]models.PerfomanceResponse, 0, req.PageSize)

	startIndex := (req.PageNumber - 1) * req.PageSize
	endIndex := int(math.Min(float64(startIndex+req.PageSize), float64(len(data.PerfomanceList))))

	if startIndex >= len(data.PerfomanceList) || startIndex >= endIndex {
		return make([]models.PerfomanceResponse, 0)
	}

	paginatedData = append(paginatedData, data.PerfomanceList[startIndex:endIndex]...)

	// Extract Unique IDs from Paginated Data
	uniqueIds := make([]string, len(paginatedData))
	for i, item := range paginatedData {
		uniqueIds[i] = item.UniqueId // Assuming 'UniqueId' is the field name
	}

	// Build the SQL Query
	var filtersBuilder strings.Builder
	filtersBuilder.WriteString(
		`WITH base_query AS (
    SELECT 
        customers_customers_schema.unique_id, 
        customers_customers_schema.current_live_cad, 
        customers_customers_schema.system_sold_er, 
        customers_customers_schema.podio_link,
        ntp_ntp_schema.production_discrepancy, 
        ntp_ntp_schema.finance_ntp_of_project, 
        ntp_ntp_schema.utility_bill_uploaded, 
        ntp_ntp_schema.powerclerk_signatures_complete, 
        ntp_ntp_schema.change_order_status,
        customers_customers_schema.utility_company,
        customers_customers_schema.state,
        split_part(ntp_ntp_schema.prospectid_dealerid_salesrepid, ',', 1) AS first_value
    FROM 
        customers_customers_schema
    LEFT JOIN ntp_ntp_schema 
        ON customers_customers_schema.unique_id = ntp_ntp_schema.unique_id
    WHERE 
        customers_customers_schema.unique_id = ANY(ARRAY['` + strings.Join(uniqueIds, "','") + `'])
)
SELECT 
    b.*, 
    CASE 
        WHEN b.utility_company = 'APS' THEN prospects_customers_schema.powerclerk_sent_az
        ELSE 'Not Needed' 
    END AS powerclerk_sent_az,
    CASE 
        WHEN prospects_customers_schema.payment_method = 'Cash' THEN prospects_customers_schema.ach_waiver_sent_and_signed_cash_only
        ELSE 'Not Needed'
    END AS ach_waiver_sent_and_signed_cash_only,
    CASE 
        WHEN b.state = 'NM :: New Mexico' THEN prospects_customers_schema.green_area_nm_only
        ELSE 'Not Needed'
    END AS green_area_nm_only,
    CASE 
        WHEN prospects_customers_schema.payment_method IN ('Lease', 'Loan') THEN prospects_customers_schema.finance_credit_approved_loan_or_lease
        ELSE 'Not Needed'
    END AS finance_credit_approved_loan_or_lease,
    CASE 
        WHEN prospects_customers_schema.payment_method IN ('Lease', 'Loan') THEN prospects_customers_schema.finance_agreement_completed_loan_or_lease
        ELSE 'Not Needed'
    END AS finance_agreement_completed_loan_or_lease,
    CASE 
        WHEN prospects_customers_schema.payment_method IN ('Cash', 'Loan') THEN prospects_customers_schema.owe_documents_completed
        ELSE 'Not Needed'
    END AS owe_documents_completed
FROM 
    base_query b
LEFT JOIN 
    prospects_customers_schema ON b.first_value::text = prospects_customers_schema.item_id::text;
`)

	linkQuery := filtersBuilder.String()

	// Execute the Query
	result, err := db.ReteriveFromDB(db.RowDataDBIndex, linkQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get qc and ntp data from DB err: %v", err)
		return paginatedData
	}

	// Step 3: Map Result to `PerfomanceResponse` structs
	resultMap := make(map[string]map[string]interface{})
	for _, row := range result {
		uniqueId := row["unique_id"].(string)
		resultMap[uniqueId] = row
	}

	// actionRequiredCount = 0

	// Step 3: Map Result to `PerfomanceResponse` structs
	for i, datas := range paginatedData {
		if row, ok := resultMap[paginatedData[i].UniqueId]; ok {
			var prospectId string
			if val, ok := row["current_live_cad"].(string); ok {
				paginatedData[i].CADLink = val
			} else {
				paginatedData[i].CADLink = "" // or a default value
			}

			if val, ok := row["system_sold_er"].(string); ok {
				paginatedData[i].DATLink = val
			} else {
				paginatedData[i].DATLink = "" // or a default value
			}

			if val, ok := row["podio_link"].(string); ok {
				paginatedData[i].PodioLink = val
			} else {
				paginatedData[i].PodioLink = "" // or a default value
			}

			if val, ok := row["change_order_status"].(string); ok {
				paginatedData[i].CoStatus = val
			} else {
				paginatedData[i].CoStatus = "" // or a default value
			}

			if val, ok := row["first_value"].(string); ok {
				prospectId = val
			} else {
				prospectId = "" // or a default value
			}

			var actionRequiredCount int64

			// Assign values from the data map to the struct fields
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

/******************************************************************************
* FUNCTION:		PrepareAdminDlrFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func PrepareAdminDlrFilters(tableName string, dataFilter models.PerfomanceStatusReq, adminCheck, filterCheck, dataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareAdminDlrFilters")
	defer func() { log.ExitFn(0, "PrepareAdminDlrFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false

	// Check if StartDate and EndDate are provided
	if dataFilter.StartDate != "" && dataFilter.EndDate != "" {
		startDate, _ := time.Parse("02-01-2006", dataFilter.StartDate)
		endDate, _ := time.Parse("02-01-2006", dataFilter.EndDate)

		endDate = endDate.Add(24*time.Hour - time.Second)

		whereEleList = append(whereEleList,
			startDate.Format("02-01-2006 00:00:00"),
			endDate.Format("02-01-2006 15:04:05"),
		)

		filtersBuilder.WriteString(" WHERE")
		filtersBuilder.WriteString(fmt.Sprintf(" customers_customers_schema.sale_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
	}

	// Check if there are filters
	if len(dataFilter.UniqueIds) > 0 && !filterCheck {
		// Start with WHERE if none has been added
		if whereAdded {
			filtersBuilder.WriteString(" AND (") // Begin a group for the OR conditions
		} else {
			filtersBuilder.WriteString(" WHERE (") // Begin a group for the OR conditions
			whereAdded = true
		}

		// Add condition for LOWER(intOpsMetSchema.unique_id) IN (...)
		filtersBuilder.WriteString("LOWER(customers_customers_schema.unique_id) IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("LOWER($%d)", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")

		// Add OR condition for LOWER(cv.unique_id) ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR LOWER(customers_customers_schema.unique_id) ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("])")

		// Add OR condition for intOpsMetSchema.home_owner ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR customers_customers_schema.customer_name ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			// Wrap the filter in wildcards for pattern matching
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("]) ")

		// Close the OR group
		filtersBuilder.WriteString(")")
	}

	if len(dataFilter.DealerNames) > 0 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}

		filtersBuilder.WriteString(" customers_customers_schema.dealer IN (")
		for i, dealer := range dataFilter.DealerNames {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, dealer)

			if i < len(dataFilter.DealerNames)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(")")
	}

	// Always add the following filters
	if whereAdded {
		filtersBuilder.WriteString(" AND")
	} else {
		filtersBuilder.WriteString(" WHERE")
	}
	filtersBuilder.WriteString(` customers_customers_schema.unique_id IS NOT NULL
			AND customers_customers_schema.unique_id <> ''
			AND system_customers_schema.contracted_system_size_parent IS NOT NULL
			AND system_customers_schema.contracted_system_size_parent > 0`)

	if len(dataFilter.ProjectStatus) > 0 {
		// Prepare the values for the IN clause
		var statusValues []string
		for _, val := range dataFilter.ProjectStatus {
			statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
		}
		// Join the values with commas
		statusList := strings.Join(statusValues, ", ")

		// Append the IN clause to the filters
		filtersBuilder.WriteString(fmt.Sprintf(` AND customers_customers_schema.project_status IN (%s)`, statusList))
	} else {
		filtersBuilder.WriteString(` AND customers_customers_schema.project_status IN ('ACTIVE')`)

	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

/******************************************************************************
* FUNCTION:		PrepareSaleRepFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PrepareSaleRepFilters(tableName string, dataFilter models.PerfomanceStatusReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareSaleRepFilters")
	defer func() { log.ExitFn(0, "PrepareSaleRepFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false

	// Start constructing the WHERE clause if the date range is provided
	if dataFilter.StartDate != "" && dataFilter.EndDate != "" {
		startDate, _ := time.Parse("02-01-2006", dataFilter.StartDate)
		endDate, _ := time.Parse("02-01-2006", dataFilter.EndDate)

		endDate = endDate.Add(24*time.Hour - time.Second)

		whereEleList = append(whereEleList,
			startDate.Format("02-01-2006 00:00:00"),
			endDate.Format("02-01-2006 15:04:05"),
		)

		filtersBuilder.WriteString(fmt.Sprintf(" WHERE customers_customers_schema.sale_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
	}

	// Check if there are filters
	if len(dataFilter.UniqueIds) > 0 {
		// Start with WHERE if none has been added
		if whereAdded {
			filtersBuilder.WriteString(" AND (") // Begin a group for the OR conditions
		} else {
			filtersBuilder.WriteString(" WHERE (") // Begin a group for the OR conditions
			whereAdded = true
		}

		// Add condition for LOWER(intOpsMetSchema.unique_id) IN (...)
		filtersBuilder.WriteString("LOWER(customers_customers_schema.unique_id) IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("LOWER($%d)", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")

		// Add OR condition for LOWER(cv.unique_id) ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR LOWER(customers_customers_schema.unique_id) ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("])")

		// Add OR condition for intOpsMetSchema.home_owner ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR customers_customers_schema.customer_name ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			// Wrap the filter in wildcards for pattern matching
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("]) ")

		// Close the OR group
		filtersBuilder.WriteString(")")
	}

	// Add sales representative filter
	if len(saleRepList) > 0 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}

		filtersBuilder.WriteString(" customers_customers_schema.primary_sales_rep IN (")
		for i, sale := range saleRepList {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, sale)

			if i < len(saleRepList)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(")")
	}

	if len(dataFilter.DealerNames) > 0 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}

		filtersBuilder.WriteString(" customers_customers_schema.dealer IN (")
		for i, dealer := range dataFilter.DealerNames {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, dealer)

			if i < len(dataFilter.DealerNames)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(")")
	}

	// Add the always-included filters
	filtersBuilder.WriteString(` AND customers_customers_schema.unique_id IS NOT NULL
			AND customers_customers_schema.unique_id <> ''
			AND system_customers_schema.contracted_system_size_parent IS NOT NULL
			AND system_customers_schema.contracted_system_size_parent > 0`)

	if len(dataFilter.ProjectStatus) > 0 {
		// Prepare the values for the IN clause
		var statusValues []string
		for _, val := range dataFilter.ProjectStatus {
			statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
		}
		// Join the values with commas
		statusList := strings.Join(statusValues, ", ")

		// Append the IN clause to the filters
		filtersBuilder.WriteString(fmt.Sprintf(` AND customers_customers_schema.project_status IN (%s)`, statusList))
	} else {
		filtersBuilder.WriteString(` AND customers_customers_schema.project_status IN ('ACTIVE')`)
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

func getSurveyColor(scheduledDate, completedDate, contract_date string) (string, int64, string, string) {
	var count int64
	if contract_date != "" && completedDate == "" {
		count = 1
	}
	if completedDate != "" {
		return green, count, completedDate, "Completed"
	} else if scheduledDate != "" {
		return blue, count, scheduledDate, "Scheduled"
	}
	return grey, count, "", ""
}

func getCadColor(createdDate, completedDate, site_survey_completed_date string) (string, int64, string) {
	var count int64
	if site_survey_completed_date != "" && completedDate == "" {
		count = 1
	}
	if completedDate != "" {
		return green, count, completedDate
	} else if createdDate != "" {
		return blue, count, createdDate
	}
	return grey, count, ""
}

func roofingColor(roofingCreateDate, roofingCompleteDate, roofingStatus string) (string, int64, string) {
	var count int64
	if roofingCreateDate != "" && roofingCompleteDate == "" && roofingStatus != "Customer Managed-COMPLETE" && roofingStatus != "COMPLETE" && roofingStatus != "No Roof work required for Solar" &&
		roofingStatus != "No Roof work required for Solar,CANCEL" && roofingStatus != "No Roof work required for Solar,COMPLETE" && roofingStatus != "No Roof work required for Solar,COMPLETE,COMPLETE" &&
		roofingStatus != "No Roof work required for Solar,COMPLETE,COMPLETE,COMPLETE" && roofingStatus != "No Roof work required for Solar,Customer Managed-COMPLETE" && roofingStatus != "No Roof work required for Solar,Customer Managed" &&
		roofingStatus != "No Roof work required for Solar,COMPLETE,No Roof work required for Solar" && roofingStatus != "No Roof work required for Solar,No Roof work required for Solar" {
		count = 1
	}
	if roofingCompleteDate != "" {
		return green, count, roofingCompleteDate
	} else if roofingCreateDate != "" {
		return blue, count, roofingCreateDate
	}
	return "", count, ""
}

func InspectionColor(finCreatedDate, finPassDate, pv_install_completed_date string) (string, int64, string) {
	var count int64

	// Increment count if FIN created date is present and FIN pass date is not
	if pv_install_completed_date != "" && finPassDate == "" {
		count = 1
	}

	// Return colors based on the status of FIN pass and created dates
	if finPassDate != "" {
		return green, count, finPassDate
	} else if finCreatedDate != "" {
		return blue, count, finCreatedDate
	}

	// Default color if no dates are set
	return grey, count, ""
}

func activationColor(ptoSubmittedDate, ptodate, finPassDate, finCreatedDate string) (string, int64, string) {
	var count int64
	if (finPassDate != "" || finCreatedDate != "") && ptodate == "" {
		count = 1
	}
	if ptodate != "" {
		return green, count, ptodate
	} else if ptoSubmittedDate != "" {
		return blue, count, ptoSubmittedDate
	}
	return grey, count, ""
}

func parseDate(dateStr string) time.Time {
	layout := "2006-01-02" // Adjust layout as needed, e.g., "2006-01-02 15:04:05" for full datetime
	t, err := time.Parse(layout, dateStr)
	if err != nil {
		// log.FuncErrorTrace(0, "Error parsing date:", err)
		return time.Time{}
	}
	return t
}

func parseDateTime(dateStr string) time.Time {
	layout := "2006-01-02 15:04:05"
	t, err := time.Parse(layout, dateStr)
	if err != nil {
		// log.FuncErrorTrace(0, "Error parsing date:", err)
		return time.Time{}
	}
	return t
}

func getPermittingColor(permitSubmittedDate, IcSubmittedDate, permitApprovedDate, IcApprovedDate, CadCompleteDate string) (string, int64, string) {
	var count int64
	if CadCompleteDate != "" && (permitApprovedDate == "" || IcApprovedDate == "") {
		count = 1
	}

	permitApprovedDateParsed := parseDate(permitApprovedDate)
	IcApprovedDateParsed := parseDate(IcApprovedDate)
	permitSubmittedDateParsed := parseDate(permitSubmittedDate)
	IcSubmittedDateParsed := parseDate(IcSubmittedDate)

	if !permitApprovedDateParsed.IsZero() && !IcApprovedDateParsed.IsZero() {
		latestApprovedDate := permitApprovedDate
		if IcApprovedDateParsed.After(permitApprovedDateParsed) {
			latestApprovedDate = IcApprovedDate
		}
		return green, count, latestApprovedDate
	} else if !permitSubmittedDateParsed.IsZero() && !IcSubmittedDateParsed.IsZero() {
		latestSubmittedDate := permitSubmittedDate
		if IcSubmittedDateParsed.After(permitSubmittedDateParsed) {
			latestSubmittedDate = IcSubmittedDate
		}
		return blue, count, latestSubmittedDate
	}
	return grey, count, ""
}

func installColor(pvInstallCreatedate, batteryScheduleDate, batteryCompleted, pvInstallCompletedDate, permittedcompletedDate, iccompletedDate string) (string, int64, string, string) {
	var count int64
	if permittedcompletedDate != "" && iccompletedDate != "" && pvInstallCompletedDate == "" {
		count = 1
	}

	// Parse the dates
	pvInstallCreatedateParsed := parseDate(pvInstallCreatedate)
	batteryScheduleDateParsed := parseDate(batteryScheduleDate)
	batteryCompletedParsed := parseDate(batteryCompleted)
	pvInstallCompletedDateParsed := parseDate(pvInstallCompletedDate)
	// Green conditions
	if batteryScheduleDateParsed.IsZero() && batteryCompletedParsed.IsZero() && !pvInstallCompletedDateParsed.IsZero() ||
		batteryScheduleDateParsed.IsZero() && !batteryCompletedParsed.IsZero() && !pvInstallCompletedDateParsed.IsZero() ||
		batteryScheduleDateParsed.IsZero() && !pvInstallCompletedDateParsed.IsZero() {

		// Determine the latest date for green
		latestCompletedDate := pvInstallCompletedDate
		if batteryCompletedParsed.After(pvInstallCompletedDateParsed) {
			latestCompletedDate = batteryCompleted
		}
		return green, count, latestCompletedDate, "Completed"
	}

	// Blue conditions
	if !batteryScheduleDateParsed.IsZero() && batteryCompletedParsed.IsZero() && !pvInstallCompletedDateParsed.IsZero() {
		return blue, count, pvInstallCompletedDate, "Scheduled"
	} else if !pvInstallCreatedateParsed.IsZero() {
		return blue, count, pvInstallCreatedate, "Scheduled"
	}

	// Default grey condition
	return grey, count, "", ""
}

func CalenderInstallStatus(pvInstallCreatedate, batteryScheduleDate, batteryCompleted, pvInstallCompletedDate, permittedcompletedDate, iccompletedDate string) (string, int64, string, string) {
	var count int64
	if permittedcompletedDate != "" && iccompletedDate != "" && pvInstallCompletedDate == "" {
		count = 1
	}

	// Parse the dates
	pvInstallCreatedateParsed := parseDateTime(pvInstallCreatedate)
	batteryScheduleDateParsed := parseDateTime(batteryScheduleDate)
	batteryCompletedParsed := parseDateTime(batteryCompleted)
	pvInstallCompletedDateParsed := parseDateTime(pvInstallCompletedDate)
	// Green conditions
	if batteryScheduleDateParsed.IsZero() && batteryCompletedParsed.IsZero() && !pvInstallCompletedDateParsed.IsZero() ||
		batteryScheduleDateParsed.IsZero() && !batteryCompletedParsed.IsZero() && !pvInstallCompletedDateParsed.IsZero() ||
		batteryScheduleDateParsed.IsZero() && !pvInstallCompletedDateParsed.IsZero() {

		// Determine the latest date for green
		latestCompletedDate := pvInstallCompletedDate
		if batteryCompletedParsed.After(pvInstallCompletedDateParsed) {
			latestCompletedDate = batteryCompleted
		}
		return green, count, latestCompletedDate, "Completed"
	}

	// Blue conditions
	if !batteryScheduleDateParsed.IsZero() && batteryCompletedParsed.IsZero() && !pvInstallCompletedDateParsed.IsZero() {
		return blue, count, pvInstallCompletedDate, "Scheduled"
	} else if !pvInstallCreatedateParsed.IsZero() {
		return blue, count, pvInstallCreatedate, "Scheduled"
	}

	// Default grey condition
	return grey, count, "", ""
}

func electricalColor(mpuCreateDate, derateCreateDate, TrenchingWSOpen, derateCompleteDate, mpuCompletedDate, TrenchingCompleted string) (string, int64, string) {
	mpuCreateDateParsed := parseDate(mpuCreateDate)
	derateCreateDateParsed := parseDate(derateCreateDate)
	TrenchingWSOpenParsed := parseDate(TrenchingWSOpen)
	derateCompleteDateParsed := parseDate(derateCompleteDate)
	mpuCompletedDateParsed := parseDate(mpuCompletedDate)
	TrenchingCompletedParsed := parseDate(TrenchingCompleted)

	var latestCreateDate, latestCompleteDate time.Time

	// Check for green (complete dates must be present for all created dates)
	if !mpuCreateDateParsed.IsZero() && !mpuCompletedDateParsed.IsZero() {
		latestCompleteDate = mpuCompletedDateParsed
	}
	if !derateCreateDateParsed.IsZero() && !derateCompleteDateParsed.IsZero() {
		if derateCompleteDateParsed.After(latestCompleteDate) {
			latestCompleteDate = derateCompleteDateParsed
		}
	}
	if !TrenchingWSOpenParsed.IsZero() && !TrenchingCompletedParsed.IsZero() {
		if TrenchingCompletedParsed.After(latestCompleteDate) {
			latestCompleteDate = TrenchingCompletedParsed
		}
	}

	if latestCompleteDate.After(time.Time{}) {
		// All required complete dates are present, return green
		return green, 0, latestCompleteDate.Format("2006-01-02")
	}

	// Check for blue (at least one create date is present)
	latestCreateDate = time.Time{}
	if !mpuCreateDateParsed.IsZero() {
		latestCreateDate = mpuCreateDateParsed
	}
	if !derateCreateDateParsed.IsZero() && derateCreateDateParsed.After(latestCreateDate) {
		latestCreateDate = derateCreateDateParsed
	}
	if !TrenchingWSOpenParsed.IsZero() && TrenchingWSOpenParsed.After(latestCreateDate) {
		latestCreateDate = TrenchingWSOpenParsed
	}

	if latestCreateDate.After(time.Time{}) {
		// Return blue for the latest create date
		return blue, 1, latestCreateDate.Format("2006-01-02")
	}

	return grey, 1, ""
}

func agngRpData(AgRp map[string]ForAgRp, dataFilter models.PerfomanceStatusReq) (map[string]models.PerfomanceResponse, error) {
	var (
		err     error
		resp    = make(map[string]models.PerfomanceResponse)
		filters []string
	)
	log.EnterFn(0, "HandleGetAgingReport")
	defer func() { log.ExitFn(0, "HandleGetAgingReport", err) }()

	log.FuncErrorTrace(0, "map first: %#v", AgRp)

	query := `SELECT unique_id, days_pending_ntp, days_pending_permits, days_pending_install, days_pending_pto, project_age FROM aging_report`

	// Filter by uniqueId
	if len(AgRp) > 0 {
		uniqueIdValues := make([]string, 0, len(AgRp))
		for uid := range AgRp {
			uniqueIdValues = append(uniqueIdValues, fmt.Sprintf("'%s'", strings.ReplaceAll(uid, "'", "''")))
		}
		filters = append(filters, fmt.Sprintf("unique_id IN (%s)", strings.Join(uniqueIdValues, ", ")))
	}

	// Filter by ProjectStatus
	if len(dataFilter.ProjectStatus) > 0 {
		statusValues := make([]string, 0, len(dataFilter.ProjectStatus))
		for _, status := range dataFilter.ProjectStatus {
			statusValues = append(statusValues, fmt.Sprintf("'%s'", strings.ReplaceAll(status, "'", "''")))
		}
		filters = append(filters, fmt.Sprintf("project_status IN (%s)", strings.Join(statusValues, ", ")))
	} else {
		filters = append(filters, "project_status IN ('ACTIVE')")
	}

	// Append filters to query
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
			log.FuncErrorTrace(0, "[agngRpData] error while fetching data for uniqueId: %v", err)
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

	log.FuncInfoTrace(0, " :  %v and count is : %d", resp, len(resp))
	return resp, nil
}

func getFieldText(data map[string]interface{}, field string) string {
	if value, ok := data[field]; ok {
		return value.(string)
	}
	log.FuncErrorTrace(0, "[agngRpData] error while fetching data for %s", field)
	return ""
}

func FilterAgRpData(req models.PerfomanceStatusReq) (map[string]struct{}, error) {

	var (
		conditions []string
		uniqueIds  = make(map[string]struct{})
		err        error
	)

	log.EnterFn(0, "FilterAgRpData")

	defer func() { log.ExitFn(0, "FilterAgRpData", err) }()

	if req.Fields == nil {
		return uniqueIds, err
	}

	baseQuery := "SELECT unique_id\n FROM aging_report %s \n"
	for _, value := range req.Fields {
		conditions = append(conditions, fmt.Sprintf("(%s AS INTEGER)  BETWEEN %d AND %d", value, req.Project_Pending_StartDate, req.Project_Pending_EndDate))
	}
	conditionsStr := "\nWHERE CAST " + strings.Join(conditions, " \nAND CAST ")
	query := fmt.Sprintf(baseQuery, conditionsStr)

	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get FilterAgRpData data from db err: %v", err)
		return uniqueIds, err
	}
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

	log.FuncInfoTrace(0, "FilterAgRpData fetched:  %v and count is : %d", uniqueIds, len(uniqueIds))
	return uniqueIds, err

}

func TextAccToInput(s string) string {
	if s == "0" || s == "1" {
		return fmt.Sprintf("%s day pending", s)
	}
	return fmt.Sprintf("%s days pending", s)
}
