/**************************************************************************
 * File       	   : apiGetPerfomanceSales.go
 * DESCRIPTION     : This file contains functions for get PerfomanceSales handler
 * DATE            : 03-May-2024
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
	"strings"
	"time"

	"fmt"
	"net/http"
)

/******************************************************************************
* FUNCTION:		HandleGetPerfomanceTileDataRequest
* DESCRIPTION:     handler for get PerfomanceSales request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetPerfomanceTileDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		singleData         map[string]bool
		err                error
		dataReq            models.PerfomanceTileDataReq
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
	)

	log.EnterFn(0, "HandleGetPerfomanceTileDataRequest")
	defer func() { log.ExitFn(0, "HandleGetPerfomanceTileDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get perfomance tile data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get perfomance tile data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get perfomance tile data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get perfomance tile data Request body", http.StatusBadRequest, nil)
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
		dealerName, ok := data[0]["dealer_name"].(string)
		if dealerName == "" || !ok {
			dealerName = ""
		}

		if role == string(types.RoleAdmin) || role == string(types.RoleFinAdmin) || role == string(types.RoleAccountExecutive) || role == string(types.RoleAccountManager) {
			if len(dataReq.DealerNames) <= 0 {
				perfomanceResponse := models.PerfomanceTileDataResponse{}
				appserver.FormAndSendHttpResp(resp, "perfomance tile Data", http.StatusOK, perfomanceResponse, RecordCount)
				return
			}
		} else {
			dataReq.DealerNames = []string{dealerName}
		}
		rgnSalesMgrCheck = false

		switch role {
		case string(types.RoleAdmin), string(types.RoleFinAdmin):
			filter, whereEleList = PrepareAdminDlrTalesFilters(tableName, dataReq, true, false, false)
		case string(types.RoleDealerOwner),string(types.RoleSubDealerOwner):
			filter, whereEleList = PrepareAdminDlrTalesFilters(tableName, dataReq, false, false, false)
		case string(types.RoleAccountManager), string(types.RoleAccountExecutive):
			dealerNames, err := FetchDealerForAmAe(dataReq, role)
			if err != nil {
				appserver.FormAndSendHttpResp(resp, fmt.Sprintf("%s", err), http.StatusBadRequest, nil)
				return
			}
			if len(dealerNames) == 0 {
				log.FuncInfoTrace(0, "No dealer list present")
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
			filter, whereEleList = PrepareAdminDlrTalesFilters(tableName, dataReq, false, false, false)
		case string(types.RoleSalesRep):
			SaleRepList = append(SaleRepList, name)
			filter, whereEleList = PrepareSaleRepTalesFilters(tableName, dataReq, SaleRepList)
		// this is for the roles regional manager and sales manager
		default:
			SaleRepList = append(SaleRepList, name)
			rgnSalesMgrCheck = true
		}
	} else {
		log.FuncErrorTrace(0, "Failed to get perfomance tile data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get perfomance tile data", http.StatusBadRequest, nil)
		return
	}

	if rgnSalesMgrCheck {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, allSaleRepQuery, whereEleList)

		// This is thrown if no sale rep are available and for other user roles
		if len(SaleRepList) == 0 {
			emptyPerfomanceList := models.PerfomanceListResponse{
				PerfomanceList: []models.PerfomanceResponse{},
			}
			log.FuncErrorTrace(0, "No sale representatives: %v", err)
			appserver.FormAndSendHttpResp(resp, "No sale representatives", http.StatusOK, emptyPerfomanceList, int64(len(data)))
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
		filter, whereEleList = PrepareSaleRepTalesFilters(tableName, dataReq, SaleRepList)
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
		log.FuncErrorTrace(0, "Failed to get perfomance tile data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get perfomance tile data", http.StatusBadRequest, nil)
		return
	}

	singleData = make(map[string]bool)
	invalidDate, _ := time.Parse("2006-01-02", "2199-01-01")

	for _, item := range data {

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

		RecordCount++

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

		RoofingStatus, ok := item["roofing_status"].(string)
		if !ok || RoofingStatus == "" {
			// log.FuncErrorTrace(0, "Failed to get roofing status Item: %+v\n", item)
			// continue
		}

		_, SiteSurveyCountT, _, _ := getSurveyColor(SiteSurveyD, SiteSurveyComD, contractD)
		SiteSurveyCount += SiteSurveyCountT
		_, CadDesignCountT, _ := getCadColor(CadD, CadCompleteD, SiteSurveyComD)
		CadDesignCount += CadDesignCountT
		_, PerimittingCountT, _ := getPermittingColor(permitSubmittedD, IcSubmitD, PermitApprovedD, IcaprvdD, CadCompleteD)
		PerimittingCount += PerimittingCountT
		_, RoofingCountT, _ := roofingColor(RoofingCreatedD, RoofingCompleteD, RoofingStatus)
		RoofingCount += RoofingCountT
		_, InstallCountT, _, _ := installColor(PvInstallCreateD, BatteryScheduleD, BatteryCompleteD, PvInstallCompleteD, PermitApprovedD, IcaprvdD)
		InstallCount += InstallCountT
		_, electricCountT, _ := electricalColor(MpuCreateD, DerateCreateD, TrechingWSOpenD, DerateCompleteD, MpucompleteD, TrenchingComD)
		ElectricalCount += electricCountT
		_, InspectionCountT, _ := InspectionColor(FinCreateD, FinPassD, PvInstallCompleteD)
		InspectionCount += InspectionCountT
		_, actiovationCountT, _ := activationColor(PTOSubmitD, PTOD, FinPassD, FinCreateD)
		ActivationCount += actiovationCountT

	}
	perfomanceResponse := models.PerfomanceTileDataResponse{
		SiteSurveyCount:  SiteSurveyCount,
		CadDesignCount:   CadDesignCount,
		PerimittingCount: PerimittingCount,
		RoofingCount:     RoofingCount,
		InstallCount:     InstallCount,
		ElectricalCount:  ElectricalCount,
		InspectionCount:  InspectionCount,
		ActivationCount:  ActivationCount,
	}

	log.FuncInfoTrace(0, "Number of perfomance tile List fetched : %v list %+v", 1, perfomanceResponse)
	appserver.FormAndSendHttpResp(resp, "perfomance tile Data", http.StatusOK, perfomanceResponse, RecordCount)
}

/******************************************************************************
* FUNCTION:		PrepareAdminDlrTalesFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func PrepareAdminDlrTalesFilters(tableName string, dataFilter models.PerfomanceTileDataReq, adminCheck, filterCheck, dataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareAdminDlrTalesFilters")
	defer func() { log.ExitFn(0, "PrepareAdminDlrTalesFilters", nil) }()

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

	// // Add dealer filter if not adminCheck and not filterCheck
	// if !adminCheck && !filterCheck {
	// 	if whereAdded {
	// 		filtersBuilder.WriteString(" AND")
	// 	} else {
	// 		filtersBuilder.WriteString(" WHERE")
	// 		whereAdded = true
	// 	}
	// 	filtersBuilder.WriteString(fmt.Sprintf(" salMetSchema.dealer = $%d", len(whereEleList)+1))
	// 	whereEleList = append(whereEleList, dataFilter.DealerName)
	// }

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
* FUNCTION:		PrepareAdminDlrTalesFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func PrepareAeAmFilter(dealerList []string, dataFilter models.PerfomanceTileDataReq, dataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareAeAmFilters")
	defer func() { log.ExitFn(0, "PrepareAeAmFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false

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

	placeholders := []string{}
	for i := range dealerList {
		placeholders = append(placeholders, fmt.Sprintf("$%d", len(whereEleList)+i+1))
	}

	if len(placeholders) != 0 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}
		filtersBuilder.WriteString(fmt.Sprintf(" customers_customers_schema.dealer IN (%s) ", strings.Join(placeholders, ",")))
		for _, dealer := range dealerList {
			whereEleList = append(whereEleList, dealer)
		}
	}

	if whereAdded {
		filtersBuilder.WriteString(" AND")
	} else {
		filtersBuilder.WriteString(" WHERE")
		whereAdded = true
	}
	filtersBuilder.WriteString(` customers_customers_schema.unique_id IS NOT NULL
			AND customers_customers_schema.unique_id <> ''
			AND system_customers_schema.contracted_system_size_parent IS NOT NULL
			AND system_customers_schema.contracted_system_size_parent > 0`)

	if len(dataFilter.ProjectStatus) > 0 {
		var statusValues []string
		for _, val := range dataFilter.ProjectStatus {
			statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
		}
		statusList := strings.Join(statusValues, ", ")
		filtersBuilder.WriteString(fmt.Sprintf(` AND customers_customers_schema.project_status IN (%s)`, statusList))
	} else {
		filtersBuilder.WriteString(` AND customers_customers_schema.project_status IN ('ACTIVE')`)
	}

	filters = filtersBuilder.String()
	return filters, whereEleList
}

/******************************************************************************
* FUNCTION:		PrepareSaleRepTalesFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PrepareSaleRepTalesFilters(tableName string, dataFilter models.PerfomanceTileDataReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareSaleRepTalesFilters")
	defer func() { log.ExitFn(0, "PrepareSaleRepTalesFilters", nil) }()

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

	// // Add dealer filter
	// if whereAdded {
	// 	filtersBuilder.WriteString(" AND ")
	// } else {
	// 	filtersBuilder.WriteString(" WHERE ")
	// 	whereAdded = true
	// }
	// filtersBuilder.WriteString(fmt.Sprintf(" salMetSchema.dealer = $%d", len(whereEleList)+1))
	// whereEleList = append(whereEleList, dataFilter.DealerName)

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

/******************************************************************************
* FUNCTION:		FetchDealerForAmAe
* DESCRIPTION:  Retrieves a list of dealers for an Account Manager (AM) or Account Executive (AE)
*               based on the email provided in the request.
* INPUT:		dataReq - contains the request details including email.
*               role    - role of the user (Account Manager or Account Executive).
* RETURNS:		[]string - list of sales partner names.
*               error   - if any error occurs during the process.
******************************************************************************/
func FetchDealerForAmAe(dataReq models.PerfomanceTileDataReq, userRole interface{}) ([]string, error) {
	log.EnterFn(0, "FetchDealerForAmAe")
	defer func() { log.ExitFn(0, "FetchDealerForAmAe", nil) }()

	var items []string

	accountName, err := fetchAmAeName(dataReq.Email)
	if err != nil {
		log.FuncErrorTrace(0, "Unable to fetch name for Account Manager/Account Executive; err: %v", err)
		return nil, fmt.Errorf("unable to fetch name for account manager / account executive; err: %v", err)
	}

	var roleBase string
	role, _ := userRole.(string)
	if role == "Account Manager" {
		roleBase = "account_manager2"
	} else {
		roleBase = "account_executive"
	}

	log.FuncInfoTrace(0, "Logged user %v is %v", accountName, roleBase)

	query := fmt.Sprintf("SELECT sales_partner_name AS data FROM sales_partner_dbhub_schema WHERE LOWER(%s) = LOWER('%s')", roleBase, accountName)
	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get partner_name from sales_partner_dbhub_schema; err: %v", err)
		return nil, fmt.Errorf("failed to get partner_name from sales_partner_dbhub_schema; err: %v", err)
	}

	for _, item := range data {
		name, ok := item["data"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to parse 'data' item: %+v", item)
			continue
		}
		items = append(items, name)
	}

	return items, nil
}
