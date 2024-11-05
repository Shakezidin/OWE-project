package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	oweconfig "OWEApp/shared/oweconfig"
	"fmt"
	"strings"
	"time"
)

func ExecDlrPayInitialCalculation(uniqueIds string, hookType string) error {
	var (
		err            error
		dlrPayDataList []map[string]interface{}
		InitailData    oweconfig.InitialDataLists
	)
	log.EnterFn(0, "ExecDlrPayInitialCalculation")
	defer func() { log.ExitFn(0, "ExecDlrPayInitialCalculation", err) }()

	count := 0
	dataReq := models.DataRequestBody{}

	var idList []string
	if uniqueIds != "" {
		idList = []string{uniqueIds}
	} else {
		idList = []string{}
	}

	InitailData, err = oweconfig.LoadDlrPayInitialData(idList)
	if err != nil {
		log.FuncErrorTrace(0, "error while loading initial data %v", err)
		return err
	}
	financeSchedule, err := oweconfig.GetFinanceScheduleConfigFromDB(dataReq)
	dealerCredit, err := oweconfig.GetDealerCreditsConfigFromDB(dataReq)
	dealerPayments, err := oweconfig.GetDealerPaymentsConfigFromDB(dataReq)
	dealerOvrd, err := oweconfig.GetDealerOverrideConfigFromDB(dataReq)
	partnerPaySchedule, err := oweconfig.GetPartnerPayScheduleConfigFromDB(dataReq)

	for _, data := range InitailData.InitialDataList {
		var dlrPayData map[string]interface{}
		dlrPayData, err = CalculateDlrPayProject(data, financeSchedule, dealerCredit, dealerPayments, dealerOvrd, partnerPaySchedule)

		// if err != nil || dlrPayData == nil {
		// 	if len(data.UniqueId) > 0 {
		// 		log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data for unique id : %+v err: %+v", data.UniqueId, err)
		// 	} else {
		// 		log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data err : %+v", err)
		// 	}
		// } else if operaiton == "create" {
		// 	dlrPayDataList = append(dlrPayDataList, dlrPayData)
		// } else {
		// 	updateDlrPayData = append(updateDlrPayData, dlrPayData)
		// }

		if hookType == "update" {
			// Build the update query
			query, _ := buildUpdateQuery("dealer_pay", dlrPayData, "unique_id", data.UniqueId)

			// Execute the update query
			err = db.ExecQueryDB(db.OweHubDbIndex, query)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to update DLR Pay Data for unique id: %+v err: %+v", data.UniqueId, err)
			}
		} else { // Assuming "create" operation
			dlrPayDataList = append(dlrPayDataList, dlrPayData) // Prepare data for insertion
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

func buildUpdateQuery(tableName string, row map[string]interface{}, idColumn string, idValue interface{}) (string, error) {
	sets := []string{}

	for col, val := range row {
		if col != idColumn {
			var valStr string
			switch v := val.(type) {
			case string:
				// Escape single quotes in string values
				valStr = strings.ReplaceAll(v, "'", "''")
				valStr = fmt.Sprintf("'%s'", valStr) // Enclose string values in quotes

			case time.Time:
				// Format time.Time values and enclose in quotes
				valStr = fmt.Sprintf("'%s'", v.Format("2006-01-02 15:04:05"))

			default:
				valStr = fmt.Sprintf("%v", v) // Keep numeric and other types as they are
			}
			sets = append(sets, fmt.Sprintf("%s = %s", col, valStr))
		}
	}

	// Escape the idValue to prevent SQL injection
	var idValueStr string
	switch v := idValue.(type) {
	case string:
		idValueStr = strings.ReplaceAll(v, "'", "''")
		idValueStr = fmt.Sprintf("'%s'", idValueStr) // Enclose string ID values in quotes
	default:
		idValueStr = fmt.Sprintf("%v", idValue) // Keep numeric and other types as they are
	}

	// Build the query
	query := fmt.Sprintf("UPDATE %s SET %s WHERE %s = %s", tableName, strings.Join(sets, ", "), idColumn, idValueStr)
	return query, nil
}
