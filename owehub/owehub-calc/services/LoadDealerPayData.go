package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	oweconfig "OWEApp/shared/oweconfig"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"
)

func ExecDlrPayInitialCalculation(batchData []map[string]interface{}, fetchFromDb bool) error {
	var (
		err            error
		dlrPayDataList []map[string]interface{}
		InitailData    oweconfig.InitialDataLists
	)
	log.EnterFn(0, "ExecDlrPayInitialCalculation")
	defer func() { log.ExitFn(0, "ExecDlrPayInitialCalculation", err) }()

	count := 0
	dataReq := models.DataRequestBody{}
	if fetchFromDb {
		InitailData, err = oweconfig.LoadDlrPayInitialData()
		if err != nil {
			log.FuncErrorTrace(0, "error while loading initial data %v", err)
			return err
		}
	} else {
		// Use the mapping function to populate InitialDataLists
		InitailData = mapBatchDataToInitialData(batchData)
	}
	financeSchedule, err := oweconfig.GetFinanceScheduleConfigFromDB(dataReq)
	dealerCredit, err := oweconfig.GetDealerCreditsConfigFromDB(dataReq)
	dealerPayments, err := oweconfig.GetDealerPaymentsConfigFromDB(dataReq)
	dealerOvrd, err := oweconfig.GetDealerOverrideConfigFromDB(dataReq)
	partnerPaySchedule, err := oweconfig.GetPartnerPayScheduleConfigFromDB(dataReq)

	for _, data := range InitailData.InitialDataList {
		var dlrPayData map[string]interface{}
		dlrPayData, err = CalculateDlrPayProject(data, financeSchedule, dealerCredit, dealerPayments, dealerOvrd, partnerPaySchedule)

		if err != nil || dlrPayData == nil {
			if len(data.UniqueId) > 0 {
				log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data for unique id : %+v err: %+v", data.UniqueId, err)
			} else {
				log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data err : %+v", err)
			}
		} else {
			dlrPayDataList = append(dlrPayDataList, dlrPayData)
		}

		if (count+1)%1000 == 0 && len(dlrPayDataList) > 0 {
			err = db.AddMultipleRecordInDB(db.OweHubDbIndex, "dealer_pay", dlrPayDataList)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to insert initial dlr pay Data in DB err: %v", err)
			}
			dlrPayDataList = nil // Clear the dlrpayDataList
		}
		count++
	}
	/* Update Calculated and Fetched data PR.Data Table */
	err = db.AddMultipleRecordInDB(db.OweHubDbIndex, "dealer_pay", dlrPayDataList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to insert initial DLR Pay Data in DB err: %v", err)
	}

	return err
}

/******************************************************************************
* FUNCTION:        CalculateDlrPayProject
* DESCRIPTION:     calculate the calculated data for DLR Pay
* RETURNS:         outData
*****************************************************************************/
func CalculateDlrPayProject(dlrPayData oweconfig.InitialStruct, financeSchedule oweconfig.FinanceSchedule, dealerCredit oweconfig.DealerCredits, dealerPayments oweconfig.DealerPayments, dealerovrd oweconfig.DealerOverride, partnerPaySchedule oweconfig.PartnerPaySchedule) (outData map[string]interface{}, err error) {
	// this row data is from sales data
	outData = make(map[string]interface{})

	HomeOwner := dlrPayData.HomeOwner
	CurrectStatus := dlrPayData.CurrectStatus
	uniqueID := dlrPayData.UniqueId
	DealerCode := dlrPayData.DealerCode
	SystemSize := dlrPayData.SystemSize
	ContractDolDol := dlrPayData.ContractDolDol
	OtherAdders := dlrPayData.OtherAdders
	Rep1 := dlrPayData.Rep1
	Rep2 := dlrPayData.Rep2
	Setter := dlrPayData.Setter
	ST := dlrPayData.ST
	ContractDate := dlrPayData.ContractDate
	NetEpc := dlrPayData.NetEpc
	financeType := dlrPayData.FinanceType
	mktFee := 5.0                                                                                                                                               //pemding from Colten sice
	DrawAmt, drawMax, Rl := CalcDrawPercDrawMaxRedLineCommissionDealerPay(partnerPaySchedule.PartnerPayScheduleData, DealerCode, financeType, ST, ContractDate) // draw %
	NtpCompleteDate := dlrPayData.NtpCompleteDate
	PvComplettionDate := dlrPayData.PvComplettionDate
	credit := GetCreditByUniqueID(dealerCredit.DealerCreditsData, uniqueID)
	amt_paid := CalcAmtPaidByDealerForProjectId(dealerPayments.DealerPaymentsData, DealerCode, uniqueID)
	totalGrossCommission := CalcTotalGrossCommissionDealerPay(NetEpc, Rl, SystemSize)
	dlrOvrdAmount := CalcDealerOvrdCommissionDealerPay(dealerovrd.DealerOverrideData, DealerCode)
	financeCompany := dlrPayData.FinanceCompany
	LoanFee := CalcLoanFeeCommissionDealerPay(financeSchedule.FinanceScheduleData, financeType, financeCompany, ST, time.Time{})
	totalNetCommission := CalcTotalNetCommissionsDealerPay(totalGrossCommission, dlrOvrdAmount, SystemSize, mktFee, amt_paid)
	m1Payment, m2Payment := CalcPaymentsDealerPay(totalNetCommission, DrawAmt, drawMax)
	amount := CalcAmountDealerPay(NtpCompleteDate, PvComplettionDate, m1Payment, m2Payment)
	balance := totalNetCommission - amt_paid
	// here i have some doubts

	outData["home_owner"] = HomeOwner
	outData["current_status"] = CurrectStatus
	outData["unique_id"] = uniqueID
	outData["dealer_code"] = DealerCode
	outData["today"] = time.Now()
	outData["amount"] = amount
	outData["sys_size"] = SystemSize
	outData["rl"] = Rl
	outData["contract_dol_dol"] = ContractDolDol
	outData["loan_fee"] = LoanFee
	outData["epc"] = ContractDolDol / (SystemSize * 1000)
	outData["net_epc"] = NetEpc
	outData["other_adders"] = OtherAdders
	outData["credit"] = credit
	outData["rep_1"] = Rep1
	outData["rep_2"] = Rep2
	outData["setter"] = Setter
	outData["draw_amt"] = DrawAmt
	outData["amt_paid"] = amt_paid
	outData["balance"] = balance
	outData["st"] = ST
	outData["contract_date"] = ContractDate
	outData["finance_type"] = financeType
	outData["ntp_date"] = NtpCompleteDate

	// outData["ntp_complete_date"] = NtpCompleteDate
	// outData["pv_complete_date"] = PvComplettionDate
	// outData["total_gross_commission"] = totalGrossCommission
	// outData["total_net_commission"] = totalNetCommission
	// outData["m1_payment"] = m1Payment
	// outData["m2payment"] = m2Payment
	return outData, err
}

func ClearDlrPay() error {
	query := `TRUNCATE TABLE dealer_pay`
	err := db.ExecQueryDB(db.OweHubDbIndex, query)
	if err != nil {
		return err
	}
	return nil
}

func mapBatchDataToInitialData(batchData []map[string]interface{}) oweconfig.InitialDataLists {
	var initialDataLists oweconfig.InitialDataLists

	for _, val := range batchData {
		// Process as usual for non-delete operations
		var initialData oweconfig.InitialStruct

		// Safely retrieve unique_id with nil check
		if uniqueId, ok := val["unique_id"].(string); ok {
			initialData.UniqueId = uniqueId
		} else {
			log.FuncErrorTrace(0, "unique_id not found or not a string in data: %v", val)
			continue // Skip to the next entry if unique_id is missing or invalid
		}

		// Assign other fields with nil checks
		if homeOwner, ok := val["customer_name"].(string); ok {
			initialData.HomeOwner = homeOwner
		}

		if projectStatus, ok := val["project_status"].(string); ok {
			initialData.CurrectStatus = projectStatus
		}

		if contractedSystemSize, ok := val["contracted_system_size"].(float64); ok {
			initialData.SystemSize = contractedSystemSize
		}

		if dealerCode, ok := val["dealer"].(string); ok {
			initialData.DealerCode = dealerCode
		}

		if totalSystemCost, ok := val["total_system_cost"].(string); ok {
			costStr := strings.TrimSpace(totalSystemCost)
			re := regexp.MustCompile(`<.*?>`)
			costStr = re.ReplaceAllString(costStr, "")
			costStr = strings.ReplaceAll(costStr, ",", "")
			costStr = strings.ReplaceAll(costStr, "$", "")
			costStr = strings.TrimSpace(costStr)

			if costStr != "" {
				var err error
				initialData.ContractDolDol, err = strconv.ParseFloat(costStr, 64)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to parse total_system_cost: %v", err)
					initialData.ContractDolDol = 0.0 // Default value on error
				}
			}
		}

		if adderBreakdownandTotalNew, ok := val["adder_breakdown_and_total_new"].(string); ok {
			initialData.OtherAdders = adderBreakdownandTotalNew
		}

		if primarySalesRep, ok := val["primary_sales_rep"].(string); ok {
			initialData.Rep1 = primarySalesRep
		}

		if secondarySalesRep, ok := val["secondary_sales_rep"].(string); ok {
			initialData.Rep2 = secondarySalesRep
		}

		if setter, ok := val["setter"].(string); ok {
			initialData.Setter = setter
		}

		if state, ok := val["state"].(string); ok {
			initialData.ST = state
		}

		if saleDate, ok := val["sale_date"].(time.Time); ok {
			initialData.ContractDate = saleDate
		}

		if netEpc, ok := val["net_epc"].(float64); ok {
			initialData.NetEpc = netEpc
		}

		if ntpCompleteDate, ok := val["ntp_complete_date"].(time.Time); ok {
			initialData.NtpCompleteDate = ntpCompleteDate
		}

		if pvCompletionDate, ok := val["pv_completion_date"].(time.Time); ok {
			initialData.PvComplettionDate = pvCompletionDate
		}

		if financeCompany, ok := val["finance"].(string); ok {
			initialData.FinanceCompany = financeCompany
		}

		if financeType, ok := val["finance_type"].(string); ok {
			initialData.FinanceType = financeType
		}

		// Append each processed `initialData` to `initialDataLists`
		initialDataLists.InitialDataList = append(initialDataLists.InitialDataList, initialData)
	}

	return initialDataLists
}

func DeleteFromDealerPay(uniqueIDs []string) error {
	// Ensure there are IDs to delete
	if len(uniqueIDs) == 0 {
		log.FuncErrorTrace(0, "No unique IDs provided for deletion.")
		return nil
	}

	// Construct a parameterized query with a placeholder for each unique ID
	placeholders := make([]string, len(uniqueIDs))
	args := make([]interface{}, len(uniqueIDs))
	for i, id := range uniqueIDs {
		placeholders[i] = fmt.Sprintf("$%d", i+1)
		args[i] = id
	}

	query := fmt.Sprintf("DELETE FROM dealer_pay WHERE unique_id IN (%s)", strings.Join(placeholders, ","))

	// Execute the delete query
	err := db.ExecQueryDB(db.OweHubDbIndex, query)
	if err != nil {
		return fmt.Errorf("failed to delete rows from dealer_pay: %w", err)
	}

	log.FuncErrorTrace(0, "Deleted %d rows from dealer_pay table.\n", len(uniqueIDs))
	return nil
}
