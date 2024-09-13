/**************************************************************************
 * File       	   : apiGetPerfomanceProjectStatus.go
 * DESCRIPTION     : This file contains functions for get perfomance status data handler
 * DATE            : 07-May-2024
 **************************************************************************/

package services

import (
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

func HandleGetPerfomanceProjectStatusRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		dataReq            models.PerfomanceStatusReq
		data               []map[string]interface{}
		whereEleList       []interface{}
		queryWithFiler     string
		filter             string
		dealerName         interface{}
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
	)

	log.EnterFn(0, "HandleGetPerfomanceProjectStatusRequest")
	defer func() { log.ExitFn(0, "HandleGetPerfomanceProjectStatusRequest", err) }()

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

	allSaleRepQuery := models.SalesRepRetrieveQueryFunc()
	saleMetricsQuery := models.SalesMetricsRetrieveQueryFunc()
	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()

	// change table name here
	tableName := db.ViewName_ConsolidatedDataView
	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	whereEleList = append(whereEleList, dataReq.Email)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, otherRoleQuery, whereEleList)

	// This checks if the user is admin, sale rep or dealer
	if len(data) > 0 {
		role := data[0]["role_name"]
		name := data[0]["name"]
		dealerName = data[0]["dealer_name"]
		rgnSalesMgrCheck = false
		dataReq.DealerName = dealerName

		switch role {
		case string(types.RoleAdmin), string(types.RoleFinAdmin):
			filter, whereEleList = PrepareAdminDlrFilters(tableName, dataReq, true, false, false)
		case string(types.RoleDealerOwner):
			filter, whereEleList = PrepareAdminDlrFilters(tableName, dataReq, false, false, false)
		case string(types.RoleAccountManager), string(types.RoleAccountExecutive):
			dealerNames, err := FetchProjectDealerForAmAe(dataReq, role)
			if err != nil {
				FormAndSendHttpResp(resp, fmt.Sprintf("%s", err), http.StatusBadRequest, nil)
				return
			}

			if len(dealerNames) == 0 {
				FormAndSendHttpResp(resp, "No dealer list present for this user", http.StatusOK, []string{}, RecordCount)
				return
			}
			filter, whereEleList = PrepareProjectAeAmFilters(dealerNames, dataReq, false)
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
		FormAndSendHttpResp(resp, "Failed to get PerfomanceProjectStatus data", http.StatusBadRequest, nil)
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
			FormAndSendHttpResp(resp, "No sale representatives exist", http.StatusOK, emptyPerfomanceList, int64(len(data)))
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
	perfomanceList := models.PerfomanceListResponse{}
	invalidDate, _ := time.Parse("2006-01-02", "2199-01-01")

	for _, item := range data {
		// if no unique id is present we skip that project
		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get UniqueId. Item: %+v\n", item)
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
		surveyColor, SiteSurveyCountT, SiteSurevyDate, _ := getSurveyColor(SiteSurveyD, SiteSurveyComD, contractD)
		SiteSurveyCount += SiteSurveyCountT
		cadColor, CadDesignCountT, CadDesignDate := getCadColor(CadD, CadCompleteD, SiteSurveyComD)
		CadDesignCount += CadDesignCountT
		permitColor, PerimittingCountT, PermittingDate := getPermittingColor(permitSubmittedD, IcSubmitD, PermitApprovedD, IcaprvdD, CadCompleteD)
		PerimittingCount += PerimittingCountT
		roofingColor, RoofingCountT, RoofingDate := roofingColor(RoofingCreatedD, RoofingCompleteD)
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
	paginatedData := PaginateData(perfomanceList, dataReq)
	perfomanceList.PerfomanceList = paginatedData

	log.FuncInfoTrace(0, "Number of PerfomanceProjectStatus List fetched : %v list %+v", len(perfomanceList.PerfomanceList), perfomanceList)
	FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, perfomanceList, RecordCount)
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
func PaginateData(data models.PerfomanceListResponse, req models.PerfomanceStatusReq) []models.PerfomanceResponse {
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
            ips.unique_id, 
            c.current_live_cad, 
            c.system_sold_er, 
            c.podio_link,
            n.production_discrepancy, 
            n.finance_ntp_of_project, 
            n.utility_bill_uploaded, 
            n.powerclerk_signatures_complete, 
            n.over_net_3point6_per_w, 
            n.premium_panel_adder_10c, 
            n.change_order_status
        FROM 
            internal_ops_metrics_schema ips
        LEFT JOIN 
            customers_customers_schema c ON ips.unique_id = c.unique_id
        LEFT JOIN 
            ntp_ntp_schema n ON ips.unique_id = n.unique_id
        WHERE 
            ips.unique_id = ANY(ARRAY['` + strings.Join(uniqueIds, "','") + `'])
    ), 
    extracted_values AS (
        SELECT 
            ips.unique_id, 
            ips.utility_company, 
            ss.state,
            split_part(ss.prospectid_dealerid_salesrepid, ',', 1) AS first_value
        FROM 
            internal_ops_metrics_schema ips
        LEFT JOIN 
            sales_metrics_schema ss ON ips.unique_id = ss.unique_id
        WHERE 
            ips.unique_id = ANY(ARRAY['` + strings.Join(uniqueIds, "','") + `'])
    )
    SELECT 
        b.*, 
        e.first_value,
        CASE 
            WHEN e.utility_company = 'APS' THEN p.powerclerk_sent_az
            ELSE 'Not Needed' 
        END AS powerclerk_sent_az,
        CASE 
            WHEN p.payment_method = 'Cash' THEN p.ach_waiver_sent_and_signed_cash_only
            ELSE 'Not Needed'
        END AS ach_waiver_sent_and_signed_cash_only,
        CASE 
            WHEN e.state = 'NM :: New Mexico' THEN p.green_area_nm_only
            ELSE 'Not Needed'
        END AS green_area_nm_only,
        CASE 
            WHEN p.payment_method IN ('Lease', 'Loan') THEN p.finance_credit_approved_loan_or_lease
            ELSE 'Not Needed'
        END AS finance_credit_approved_loan_or_lease,
        CASE 
            WHEN p.payment_method IN ('Lease', 'Loan') THEN p.finance_agreement_completed_loan_or_lease
            ELSE 'Not Needed'
        END AS finance_agreement_completed_loan_or_lease,
        CASE 
            WHEN p.payment_method IN ('Cash', 'Loan') THEN p.owe_documents_completed
            ELSE 'Not Needed'
        END AS owe_documents_completed
    FROM 
        base_query b
    LEFT JOIN 
        extracted_values e ON b.unique_id = e.unique_id
    LEFT JOIN 
        prospects_customers_schema p ON e.first_value = p.item_id::text;`)

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
		filtersBuilder.WriteString(fmt.Sprintf(" salMetSchema.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
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
		filtersBuilder.WriteString("LOWER(intOpsMetSchema.unique_id) IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("LOWER($%d)", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")

		// Add OR condition for LOWER(cv.unique_id) ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR LOWER(intOpsMetSchema.unique_id) ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("])")

		// Add OR condition for intOpsMetSchema.home_owner ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR intOpsMetSchema.home_owner ILIKE ANY (ARRAY[")
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
			AND intOpsMetSchema.system_size > 0`)

	if len(dataFilter.ProjectStatus) > 0 {
		// Prepare the values for the IN clause
		var statusValues []string
		for _, val := range dataFilter.ProjectStatus {
			statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
		}
		// Join the values with commas
		statusList := strings.Join(statusValues, ", ")

		// Append the IN clause to the filters
		filtersBuilder.WriteString(fmt.Sprintf(` AND salMetSchema.project_status IN (%s)`, statusList))
	} else {
		filtersBuilder.WriteString(` AND salMetSchema.project_status IN ('ACTIVE')`)

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

		filtersBuilder.WriteString(fmt.Sprintf(" WHERE salMetSchema.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
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
		filtersBuilder.WriteString("LOWER(intOpsMetSchema.unique_id) IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("LOWER($%d)", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")

		// Add OR condition for LOWER(cv.unique_id) ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR LOWER(intOpsMetSchema.unique_id) ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("])")

		// Add OR condition for intOpsMetSchema.home_owner ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR intOpsMetSchema.home_owner ILIKE ANY (ARRAY[")
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
	filtersBuilder.WriteString(` AND intOpsMetSchema.unique_id IS NOT NULL
			AND intOpsMetSchema.unique_id <> ''
			AND intOpsMetSchema.system_size IS NOT NULL
			AND intOpsMetSchema.system_size > 0`)

	if len(dataFilter.ProjectStatus) > 0 {
		// Prepare the values for the IN clause
		var statusValues []string
		for _, val := range dataFilter.ProjectStatus {
			statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
		}
		// Join the values with commas
		statusList := strings.Join(statusValues, ", ")

		// Append the IN clause to the filters
		filtersBuilder.WriteString(fmt.Sprintf(` AND salMetSchema.project_status IN (%s)`, statusList))
	} else {
		filtersBuilder.WriteString(` AND salMetSchema.project_status IN ('ACTIVE')`)
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

func roofingColor(roofingCreateDate, roofingCompleteDate string) (string, int64, string) {
	var count int64
	if roofingCreateDate != "" && roofingCompleteDate == "" {
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

/******************************************************************************
* FUNCTION:		FetchProjectStatusDealerForAmAe
* DESCRIPTION:  Retrieves a list of dealers for an Account Manager (AM) or Account Executive (AE)
*               based on the email provided in the request.
* INPUT:		dataReq - contains the request details including email.
*               role    - role of the user (Account Manager or Account Executive).
* RETURNS:		[]string - list of sales partner names.
*               error   - if any error occurs during the process.
******************************************************************************/
func FetchProjectDealerForAmAe(dataReq models.PerfomanceStatusReq, userRole interface{}) ([]string, error) {
	log.EnterFn(0, "FetchProjectStatusDealerForAmAe")
	defer func() { log.ExitFn(0, "FetchProjectStatusDealerForAmAe", nil) }()

	var items []string

	accountName, err := fetchAmAeName(dataReq.Email)
	if err != nil {
		log.FuncErrorTrace(0, "Unable to fetch name for Account Manager/Account Executive; err: %v", err)
		return nil, fmt.Errorf("unable to fetch name for account manager / account executive; err: %v", err)
	}

	var roleBase string
	role, _ := userRole.(string)
	if role == "Account Manager" {
		roleBase = "account_manager"
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

/******************************************************************************
* FUNCTION:		PrepareProjectAeAmFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func PrepareProjectAeAmFilters(dealerList []string, dataFilter models.PerfomanceStatusReq, dataCount bool) (filters string, whereEleList []interface{}) {
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
		filtersBuilder.WriteString(fmt.Sprintf(" salMetSchema.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
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
		filtersBuilder.WriteString("LOWER(intOpsMetSchema.unique_id) IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("LOWER($%d)", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")

		// Add OR condition for LOWER(cv.unique_id) ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR LOWER(intOpsMetSchema.unique_id) ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("])")

		// Add OR condition for intOpsMetSchema.home_owner ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR intOpsMetSchema.home_owner ILIKE ANY (ARRAY[")
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
		filtersBuilder.WriteString(fmt.Sprintf(" salMetSchema.dealer IN (%s) ", strings.Join(placeholders, ",")))
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
	filtersBuilder.WriteString(` intOpsMetSchema.unique_id IS NOT NULL
			AND intOpsMetSchema.unique_id <> ''
			AND intOpsMetSchema.system_size IS NOT NULL
			AND intOpsMetSchema.system_size > 0`)

	if len(dataFilter.ProjectStatus) > 0 {
		var statusValues []string
		for _, val := range dataFilter.ProjectStatus {
			statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
		}
		statusList := strings.Join(statusValues, ", ")
		filtersBuilder.WriteString(fmt.Sprintf(` AND salMetSchema.project_status IN (%s)`, statusList))
	} else {
		filtersBuilder.WriteString(` AND salMetSchema.project_status IN ('ACTIVE')`)
	}

	filters = filtersBuilder.String()
	return filters, whereEleList
}
