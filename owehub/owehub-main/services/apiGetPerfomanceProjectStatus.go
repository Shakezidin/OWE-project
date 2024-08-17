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
	"math"
	"strings"
	"time"

	"fmt"
	"net/http"
)

/******************************************************************************
* FUNCTION:		HandleGetPerfomanceProjectStatusRequest
* DESCRIPTION:     handler for get InstallCost data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
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
	// this sets the data interval bracket for querying
	dataReq.IntervalDays = "90"
	// Check whether the user is Admin, Dealer, Sales Rep

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
		case "Admin":
			filter, whereEleList = PrepareAdminDlrFilters(tableName, dataReq, true, false, false)
		case "Dealer Owner":
			filter, whereEleList = PrepareAdminDlrFilters(tableName, dataReq, false, false, false)
		case "Sale Representative":
			SaleRepList = append(SaleRepList, name)
			filter, whereEleList = PrepareSaleRepFilters(tableName, dataReq, SaleRepList)
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

		dealerName = data[0]["dealer_name"]
		dataReq.DealerName = dealerName
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
			RoofingCompleteD = BatteryScheduleDate.Format("2006-01-02")
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

		surveyColor, SiteSurveyCountT := getSurveyColor(SiteSurveyD, SiteSurveyComD)
		SiteSurveyCount += SiteSurveyCountT
		cadColor, CadDesignCountT := getCadColor(CadD, CadCompleteD)
		CadDesignCount += CadDesignCountT
		permitColor, PerimittingCountT := getPermittingColor(permitSubmittedD, IcSubmitD, PermitApprovedD, IcaprvdD)
		PerimittingCount += PerimittingCountT
		roofingColor, RoofingCountT := roofingColor(RoofingCreatedD, RoofingCompleteD)
		RoofingCount += RoofingCountT
		installColor, InstallCountT := installColor(PvInstallCreateD, BatteryScheduleD, BatteryCompleteD, PvInstallCompleteD)
		InstallCount += InstallCountT
		electricColor, electricCountT := electricalColor(MpuCreateD, DerateCreateD, TrechingWSOpenD, DerateCompleteD, MpucompleteD, TrenchingComD)
		ElectricalCount += electricCountT
		inspectionColor, InspectionCountT := InspectionColor(FinCreateD, FinPassD)
		InspectionCount += InspectionCountT
		activationColor, actiovationCountT := activationColor(PTOSubmitD, PTOD)
		ActivationCount += actiovationCountT

		perfomanceResponse := models.PerfomanceResponse{
			UniqueId:                 UniqueId,
			Customer:                 Customer,
			SiteSurevyRescheduleDate: SiteSurveyD,
			SiteSurveyCompletedDate:  SiteSurveyComD,
			CadReady:                 CadD,
			CadCompleteDate:          CadCompleteD,
			PermitSubmittedDate:      permitSubmittedD,
			IcSubmittedDate:          IcSubmitD,
			PermitApprovedDate:       PermitApprovedD,
			IcAPprovedDate:           IcaprvdD,
			RoofingCratedDate:        RoofingCreatedD,
			RoofingCompleteDate:      RoofingCompleteD,
			BatteryScheduleDate:      BatteryScheduleD,
			BatteryCompleteDate:      BatteryCompleteD,
			PvInstallCompletedDate:   PvInstallCompleteD,
			MpuCreateDate:            MpuCreateD,
			DerateCreateDate:         DerateCreateD,
			TrenchingWSOpenDate:      TrechingWSOpenD,
			DerateCompleteDate:       DerateCompleteD,
			MPUCompleteDate:          MpucompleteD,
			TrenchingCompleteDate:    TrenchingComD,
			FinCreatedDate:           FinCreateD,
			FinPassdate:              FinPassD,
			PtoSubmittedDate:         PTOSubmitD,
			PTODate:                  PTOD,
			PVInstallCreatedDate:     PvInstallCreateD,
			SiteSurveyColour:         surveyColor,
			CADDesignColour:          cadColor,
			PermittingColour:         permitColor,
			RoofingColour:            roofingColor,
			InstallColour:            installColor,
			ElectricalColour:         electricColor,
			InspectionsColour:        inspectionColor,
			ActivationColour:         activationColor,
		}
		perfomanceList.PerfomanceList = append(perfomanceList.PerfomanceList, perfomanceResponse)
	}

	paginatedData := PaginateData(perfomanceList, dataReq)
	perfomanceList.PerfomanceList = paginatedData
	perfomanceList.SiteSurveyCount = SiteSurveyCount
	perfomanceList.CadDesignCount = CadDesignCount
	perfomanceList.PerimittingCount = PerimittingCount
	perfomanceList.RoofingCount = RoofingCount
	perfomanceList.InstallCount = InstallCount
	perfomanceList.ElectricalCount = ElectricalCount
	perfomanceList.InspectionCount = InspectionCount
	perfomanceList.ActivationCount = ActivationCount

	log.FuncInfoTrace(0, "Number of PerfomanceProjectStatus List fetched : %v list %+v", len(perfomanceList.PerfomanceList), perfomanceList)
	FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, perfomanceList, RecordCount)
}

/******************************************************************************
* FUNCTION:		PrepareAdminDlrFilters
* DESCRIPTION:
		PaginateData function paginates data directly from the returned data itself
		without setting any offset value. For large data sizes, using an offset
		was creating performance issues. This approach manages to keep the response
		time under 2 seconds.
******************************************************************************/

func PaginateData(data models.PerfomanceListResponse, req models.PerfomanceStatusReq) []models.PerfomanceResponse {
	paginatedData := make([]models.PerfomanceResponse, 0, req.PageSize)

	startIndex := (req.PageNumber - 1) * req.PageSize
	endIndex := int(math.Min(float64(startIndex+req.PageSize), float64(len(data.PerfomanceList))))

	if startIndex >= len(data.PerfomanceList) || startIndex >= endIndex {
		return make([]models.PerfomanceResponse, 0)
	}

	paginatedData = append(paginatedData, data.PerfomanceList[startIndex:endIndex]...)
	return paginatedData
}

/******************************************************************************
* FUNCTION:		PrepareAdminDlrFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func PrepareAdminDlrFilters(tableName string, dataFilter models.PerfomanceStatusReq, adminCheck, filterCheck, dataCount bool) (filters string, whereEleList []interface{}) {
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

	// Check if there are filters
	if len(dataFilter.UniqueIds) > 0 && !filterCheck {
		if whereAdded {
			filtersBuilder.WriteString(" AND")
		} else {
			filtersBuilder.WriteString(" WHERE")
			whereAdded = true
		}
		filtersBuilder.WriteString(" intOpsMetSchema.unique_id IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")
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
		 AND salMetSchema.project_status NOT IN ('CANCEL','PTO''d')`)

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
func PrepareSaleRepFilters(tableName string, dataFilter models.PerfomanceStatusReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
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

	// Check if there are filters for unique IDs
	if len(dataFilter.UniqueIds) > 0 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}

		filtersBuilder.WriteString(" intOpsMetSchema.unique_id IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")
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
		 AND intOpsMetSchema.system_size > 0 
		 AND salMetSchema.project_status NOT IN ('CANCEL', 'PTO''d')`)

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

func getSurveyColor(scheduledDate, completedDate string) (string, int64) {
	if completedDate != "" {
		return "green", 1
	} else if scheduledDate != "" {
		return "blue", 0
	}
	return "grey", 0
}

func getCadColor(createdDate, completedDate string) (string, int64) {
	if completedDate != "" {
		return "green", 1
	} else if createdDate != "" {
		return "blue", 0
	}
	return "grey", 0
}

func getPermittingColor(permitSubmittedDate, IcSubmittedDate, permitApprovedDate, IcApprovedDate string) (string, int64) {
	if permitApprovedDate != "" && IcApprovedDate != "" {
		return "green", 1
	} else if permitSubmittedDate != "" && IcSubmittedDate != "" {
		return "blue", 0
	}
	return "grey", 0
}

func roofingColor(roofingCreateDate, roofingCompleteDate string) (string, int64) {
	if roofingCompleteDate != "" {
		return "green", 1
	} else if roofingCreateDate != "" {
		return "blue", 0
	}
	return "", 0
}

func installColor(pvInstallCreatedate, batteryScheduleDate, batteryCompleted, PvInstallcompletedDate string) (string, int64) {
	if batteryScheduleDate != "" && batteryCompleted != "" && PvInstallcompletedDate != "" {
		return "green", 1
	} else if pvInstallCreatedate != "" {
		return "blue", 0
	}
	return "grey", 0
}

func electricalColor(mpuCreateDate, derateCreateDate, TrenchingWSOpen, derateCompleteDate, mpuCompletedDate, TrenchingCompleted string) (string, int64) {
	if derateCreateDate != "" {
		if derateCompleteDate != "" {
			return "green", 1
		}
	} else if mpuCompletedDate != "" {
		return "green", 1
	}

	if TrenchingWSOpen != "" {
		if TrenchingCompleted != "" {
			return "green", 1
		}
		return "blue", 0
	}

	if mpuCreateDate != "" || derateCreateDate != "" || TrenchingWSOpen != "" {
		return "blue", 0
	}

	return "grey", 0
}

func InspectionColor(finCreateddate, finPassdate string) (string, int64) {
	if finPassdate != "" {
		return "green", 1
	} else if finCreateddate != "" {
		return "blue", 0
	}
	return "grey", 0
}

func activationColor(ptoSubmittedDate, ptodate string) (string, int64) {
	if ptodate != "" {
		return "green", 1
	} else if ptoSubmittedDate != "" {
		return "blue", 0
	}
	return "grey", 0
}
