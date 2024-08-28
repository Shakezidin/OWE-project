/**************************************************************************
 * File       	   : apiGetPerfomanceProjectStatus.go
 * DESCRIPTION     : This file contains functions for get InstallCost data handler
 * DATE            : 07-May-2024
 **************************************************************************/

package services

import (
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

func HandleGetCsvDownloadRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		dataReq            models.GetCsvDownload
		data               []map[string]interface{}
		whereEleList       []interface{}
		queryWithFiler     string
		filter             string
		dealerName         interface{}
		rgnSalesMgrCheck   bool
		RecordCount        int64
		SaleRepList        []interface{}
		query              string
		dealerIn           string
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

	log.EnterFn(0, "HandleGetCsvDownloadRequest")
	defer func() { log.ExitFn(0, "HandleGetCsvDownloadRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get PerfomanceProjectStatus data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get PerfomanceProjectStatus data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get PerfomanceProjectStatus data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get PerfomanceProjectStatus data Request body", http.StatusBadRequest, nil)
		return
	}

	switch dataReq.Page {
	case "leaderboard":
		query = "SELECT unique_id,home_owner,customer_email,customer_phone_number,address,state,contract_total,system_size, contract_date FROM consolidated_data_view"
	case "performance":
		query = "SELECT intOpsMetSchema.home_owner, intOpsMetSchema.unique_id, salMetSchema.customer_email, salMetSchema.customer_phone_number, salMetSchema.address, salMetSchema.state, " +
			"salMetSchema.contract_total, intOpsMetSchema.system_size, salMetSchema.contract_date, intOpsMetSchema.site_survey_scheduled_date, intOpsMetSchema.site_survey_completed_date, intOpsMetSchema.cad_ready, " +
			"intOpsMetSchema.cad_complete_date, intOpsMetSchema.permit_submitted_date, intOpsMetSchema.ic_submitted_date, intOpsMetSchema.permit_approved_date, intOpsMetSchema.ic_approved_date, fieldOpsSchema.roofing_created_date, " +
			"fieldOpsSchema.roofing_completed_date, intOpsMetSchema.pv_install_created_date, fieldOpsSchema.battery_scheduled_date, fieldOpsSchema.battery_complete_date, intOpsMetSchema.pv_install_completed_date, " +
			"fieldOpsSchema.mpu_created_date, fieldOpsSchema.derate_created_date, secondFieldOpsSchema.trenching_ws_open, fieldOpsSchema.derate_completed_date, fieldOpsSchema.mpu_complete_date, " +
			"secondFieldOpsSchema.trenching_completed, fieldOpsSchema.fin_created_date, fieldOpsSchema.fin_pass_date, intOpsMetSchema.pto_submitted_date, intOpsMetSchema.pto_date, salMetSchema.contract_date, " +
			"salMetSchema.dealer, salMetSchema.primary_sales_rep FROM internal_ops_metrics_schema AS intOpsMetSchema LEFT JOIN sales_metrics_schema AS salMetSchema " +
			"ON intOpsMetSchema.unique_id = salMetSchema.unique_id LEFT JOIN field_ops_metrics_schema AS fieldOpsSchema ON intOpsMetSchema.unique_id = fieldOpsSchema.unique_id LEFT JOIN second_field_ops_metrics_schema AS secondFieldOpsSchema ON intOpsMetSchema.unique_id = secondFieldOpsSchema.unique_id "
	}
	allSaleRepQuery := models.SalesRepRetrieveQueryFunc()
	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()

	// change table name here
	tableName := db.ViewName_ConsolidatedDataView
	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}
	switch dataReq.Page {
	case "performance":
		whereEleList = append(whereEleList, dataReq.Email)
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, otherRoleQuery, whereEleList)

		// This checks if the user is admin, sale rep or dealer
		if len(data) > 0 {
			role := data[0]["role_name"]
			name := data[0]["name"]
			dealerName = data[0]["dealer_name"]
			rgnSalesMgrCheck = false
			dataReq.Dealer = dealerName

			switch role {
			case "Admin", "Finance Admin":
				filter, whereEleList = PrepareAdminDlrCsvFilters(tableName, dataReq, true, false, false)
			case "Dealer Owner":
				filter, whereEleList = PrepareAdminDlrCsvFilters(tableName, dataReq, false, false, false)
			case "Sale Representative":
				SaleRepList = append(SaleRepList, name)
				filter, whereEleList = PrepareSaleRepCsvFilters(tableName, dataReq, SaleRepList)
			// this is for the roles regional manager and sales manager
			default:
				rgnSalesMgrCheck = true
			}
		} else {
			log.FuncErrorTrace(0, "Failed to get PerfomanceProjectStatus data from DB err: %v", err)
			FormAndSendHttpResp(resp, "Failed to get PerfomanceProjectStatus data", http.StatusBadRequest, nil)
			return
		}

		if rgnSalesMgrCheck {
			data, err = db.ReteriveFromDB(db.OweHubDbIndex, allSaleRepQuery, whereEleList)

			// This is thrown if no sale rep are available and for other user roles
			if len(data) == 0 {
				emptyPerfomanceList := models.PerfomanceListResponse{
					PerfomanceList: []models.PerfomanceResponse{},
				}
				log.FuncErrorTrace(0, "No projects or sale representatives: %v", err)
				FormAndSendHttpResp(resp, "No projects or sale representatives", http.StatusOK, emptyPerfomanceList, int64(len(data)))
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
			filter, whereEleList = PrepareSaleRepCsvFilters(tableName, dataReq, SaleRepList)
		}
	case "leaderboard":
		if len(dataReq.DealerName) == 0 {
			errorResp := []string{}
			log.FuncErrorTrace(0, "No user exist with mail: %v", dataReq.Email)
			FormAndSendHttpResp(resp, "csv Data", http.StatusOK, errorResp, RecordCount)
			return
		}
		dealerIn = "dealer IN("
		for i, data := range dataReq.DealerName {
			if i > 0 {
				dealerIn += ","
			}
			escapedDealerName := strings.ReplaceAll(data, "'", "''")
			dealerIn += fmt.Sprintf("'%s'", escapedDealerName)
		}
		dealerIn += ")"
		filter, whereEleList = PrepareLeaderCsvDateFilters(dataReq, dealerIn)
	}

	if filter != "" {
		queryWithFiler = query + filter
	} else {
		log.FuncErrorTrace(0, "No user exist with mail: %v", dataReq.Email)
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	// retrieving value from owe_db from here
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get PerfomanceProjectStatus data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get PerfomanceProjectStatus data", http.StatusBadRequest, nil)
		return
	}

	RecordCount = int64(len(data))
	perfomanceList := models.GetCsvPerformanceList{}

	if dataReq.Page == "performance" {
		for _, item := range data {
			// if no unique id is present we skip that project
			UniqueId, ok := item["unique_id"].(string)
			if !ok || UniqueId == "" {
				log.FuncErrorTrace(0, "Failed to get UniqueId. Item: %+v\n", item)
				continue
			}

			HomeOwner, ok := item["home_owner"].(string)
			if !ok || HomeOwner == "" {
				log.FuncErrorTrace(0, "Failed to get Customer Item: %+v\n", item)
				continue
			}

			CustomerEmail, ok := item["customer_email"].(string)
			if !ok || CustomerEmail == "" {
				log.FuncErrorTrace(0, "Failed to get Customer email Item: %+v\n", item)
				continue
			}

			CustomerPhoneNumber, ok := item["customer_phone_number"].(string)
			if !ok || CustomerPhoneNumber == "" {
				log.FuncErrorTrace(0, "Failed to get Customer phone number Item: %+v\n", item)
				continue
			}

			Address, ok := item["address"].(string)
			if !ok || Address == "" {
				log.FuncErrorTrace(0, "Failed to get address Item: %+v\n", item)
				continue
			}

			State, ok := item["state"].(string)
			if !ok || State == "" {
				log.FuncErrorTrace(0, "Failed to get State Item: %+v\n", item)
				continue
			}

			ContractTotal, ok := item["contract_total"].(float64)
			if !ok || ContractTotal == 0.0 {
				log.FuncErrorTrace(0, "Failed to get ContractTotal Item: %+v\n", item)
				continue
			}

			SystemSize, ok := item["system_size"].(float64)
			if !ok || SystemSize == 0.0 {
				log.FuncErrorTrace(0, "Failed to get ContractTotal Item: %+v\n", item)
				continue
			}

			SiteSurveyScheduleDate, ok := item["site_survey_scheduled_date"].(time.Time)
			if !ok {
				// log.FuncErrorTrace(0, "Failed to get ContractDate for Unique ID %v. Item: %+v\n", UniqueId, item)
				SiteSurveyD = ""
			} else {
				SiteSurveyD = SiteSurveyScheduleDate.Format("2006-01-02")
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
			_, SiteSurveyCountT, _ := getSurveyColor(SiteSurveyD, SiteSurveyComD, contractD)
			SiteSurveyCount += SiteSurveyCountT
			_, CadDesignCountT, _ := getCadColor(CadD, CadCompleteD, SiteSurveyComD)
			CadDesignCount += CadDesignCountT
			_, PerimittingCountT, _ := getPermittingColor(permitSubmittedD, IcSubmitD, PermitApprovedD, IcaprvdD, CadCompleteD)
			PerimittingCount += PerimittingCountT
			_, RoofingCountT, _ := roofingColor(RoofingCreatedD, RoofingCompleteD)
			RoofingCount += RoofingCountT
			_, InstallCountT, _ := installColor(PvInstallCreateD, BatteryScheduleD, BatteryCompleteD, PvInstallCompleteD, PermitApprovedD, IcaprvdD)
			InstallCount += InstallCountT
			_, electricCountT, _ := electricalColor(MpuCreateD, DerateCreateD, TrechingWSOpenD, DerateCompleteD, MpucompleteD, TrenchingComD)
			ElectricalCount += electricCountT
			_, InspectionCountT, _ := InspectionColor(FinCreateD, FinPassD, PvInstallCompleteD)
			InspectionCount += InspectionCountT
			_, actiovationCountT, _ := activationColor(PTOSubmitD, PTOD, FinPassD, FinCreateD)
			ActivationCount += actiovationCountT

			perfomanceCsvResponse := models.GetCsvPerformance{
				UniqueId:       UniqueId,
				HomeOwner:      HomeOwner,
				Email:          CustomerEmail,
				PhoneNumber:    CustomerPhoneNumber,
				Address:        Address,
				State:          State,
				ContractAmount: ContractTotal,
				SystemSize:     SystemSize,
				ContractDate:   contractD,
			}

			switch dataReq.SelectedMilestone {
			case "survey":
				if SiteSurveyCountT == 1 {
					perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
				}
			case "cad":
				if CadDesignCountT == 1 {
					perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
				}
			case "permit":
				if PerimittingCountT == 1 {
					perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
				}
			case "roof":
				if RoofingCountT == 1 {
					perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
				}
			case "install":
				if InstallCountT == 1 {
					perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
				}
			case "electrical":
				if electricCountT == 1 {
					perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
				}
			case "inspection":
				if InspectionCountT == 1 {
					perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
				}
			case "activation":
				if actiovationCountT == 1 {
					perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
				}
			default:
				perfomanceList.GetCsvPerformance = append(perfomanceList.GetCsvPerformance, perfomanceCsvResponse)
			}
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

		// log.FuncInfoTrace(0, "Number of data List fetched : %v list %+v", len(data), data)
		FormAndSendHttpResp(resp, "csv Data", http.StatusOK, perfomanceList, RecordCount)
		return
	}

	data = Paginate(data, int64(dataReq.PageSize), int64(dataReq.PageNumber))

	// log.FuncInfoTrace(0, "Number of data List fetched : %v list %+v", len(data), data)
	FormAndSendHttpResp(resp, "csv Data", http.StatusOK, data, RecordCount)
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

func PrepareAdminDlrCsvFilters(tableName string, dataFilter models.GetCsvDownload, adminCheck, filterCheck, dataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareStatusFilters")
	defer func() { log.ExitFn(0, "PrepareStatusFilters", nil) }()

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
		filtersBuilder.WriteString(fmt.Sprintf(" salMetSchema.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
	}

	// Add dealer filter if not adminCheck and not filterCheck
	if !adminCheck && !filterCheck {
		if whereAdded {
			filtersBuilder.WriteString(" AND")
		} else {
			filtersBuilder.WriteString(" WHERE")
			whereAdded = true
		}
		filtersBuilder.WriteString(fmt.Sprintf(" salMetSchema.dealer = $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataFilter.DealerName)
	}

	// Always add the following filters
	if whereAdded {
		filtersBuilder.WriteString(" AND")
	} else {
		filtersBuilder.WriteString(" WHERE")
	}
	filtersBuilder.WriteString(` intOpsMetSchema.unique_id IS NOT NULL
			AND intOpsMetSchema.unique_id <> ''
			AND intOpsMetSchema.system_size IS NOT NULL
			AND intOpsMetSchema.system_size > 0 
			AND salMetSchema.project_status = 'ACTIVE'`)

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

/******************************************************************************
* FUNCTION:		PrepareInstallCostFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PrepareSaleRepCsvFilters(tableName string, dataFilter models.GetCsvDownload, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareStatusFilters")
	defer func() { log.ExitFn(0, "PrepareStatusFilters", nil) }()

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

		filtersBuilder.WriteString(fmt.Sprintf(" WHERE salMetSchema.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
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

		filtersBuilder.WriteString(" salMetSchema.primary_sales_rep IN (")
		for i, sale := range saleRepList {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, sale)

			if i < len(saleRepList)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(")")
	}

	// Add dealer filter
	if whereAdded {
		filtersBuilder.WriteString(" AND ")
	} else {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true
	}
	filtersBuilder.WriteString(fmt.Sprintf(" salMetSchema.dealer = $%d", len(whereEleList)+1))
	whereEleList = append(whereEleList, dataFilter.DealerName)

	// Add the always-included filters
	filtersBuilder.WriteString(` AND unique_id IS NOT NULL
			AND intOpsMetSchema.unique_id <> ''
			AND intOpsMetSchema.system_size IS NOT NULL
			AND intOpsMetSchema.system_size > 0 
			AND salMetSchema.project_status = 'ACTIVE'`)

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

func PrepareLeaderCsvDateFilters(dataFilter models.GetCsvDownload, dealerIn string) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareDateFilters")
	defer func() { log.ExitFn(0, "PrepareDateFilters", nil) }()

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
		filtersBuilder.WriteString(fmt.Sprintf(" contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
	}

	if len(dealerIn) > 13 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}
		filtersBuilder.WriteString(dealerIn)
	}

	filters = filtersBuilder.String()
	return filters, whereEleList
}
