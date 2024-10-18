package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	oweconfig "OWEApp/shared/oweconfig"
	"time"
)

func ExecDlrPayInitialCalculation(resultChan chan string) {
	var (
		err            error
		dlrPayDataList []map[string]interface{}
	)
	log.EnterFn(0, "ExecDlrPayInitialCalculation")
	defer func() { log.ExitFn(0, "ExecDlrPayInitialCalculation", err) }()

	count := 0
	dataReq := models.DataRequestBody{}
	InitailData, err := oweconfig.LoadDlrPayInitialData()
	financeSchedule, err := oweconfig.GetFinanceScheduleConfigFromDB(dataReq)
	dealerCredit, err := oweconfig.GetDealerCreditsConfigFromDB(dataReq)
	dealerPayments, err := oweconfig.GetDealerPaymentsConfigFromDB(dataReq)

	for _, data := range InitailData.InitialDataList {
		var dlrPayData map[string]interface{}
		dlrPayData, err = CalculateDlrPayProject(data, financeSchedule, dealerCredit, dealerPayments)

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

	resultChan <- "SUCCESS"
}

/******************************************************************************
* FUNCTION:        CalculateDlrPayProject
* DESCRIPTION:     calculate the calculated data for DLR Pay
* RETURNS:         outData
*****************************************************************************/
func CalculateDlrPayProject(dlrPayData oweconfig.InitialStruct, financeSchedule oweconfig.FinanceSchedule, dealerCredit oweconfig.DealerCredits, dealerPayments oweconfig.DealerPayments) (outData map[string]interface{}, err error) {
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
	DrawAmt := dlrPayData.DrawAmt
	NtpCompleteDate := dlrPayData.NtpCompleteDate
	PvComplettionDate := dlrPayData.PvComplettionDate
	financeFee, err := GetFinanceFeeByItemID(financeSchedule.FinanceScheduleData, 1234)
	if err != nil {
		financeFee = 0.0
	}
	dealercredit, err := GetDealerCreditByUniqueID(dealerCredit.DealerCreditsData, uniqueID)
	if err != nil {
		dealercredit = ""
	}

	dealerpayments, err := GetDealerpaymentsByItemID(dealerPayments.DealerPaymentsData, uniqueID)
	if err != nil {
		dealerpayments = ""
	}
	Rl := 0.0 // config is not available
	drawPercent := 0.0
	drawMax := 0.0
	dlrOvrdAmount := 0.0
	mktFee := 0.0
	payments := 0.0
	amt_paid := 0.0 // how to calculate sum of dealer payments
	balance := 0.0  //Total Net Commission - Sum of Dealer Paid by Project ID how I get these values?
	totalGrossCommission := CalcTotalGrossCommissionDealerPay(NetEpc, Rl, SystemSize)
	totalNetCommission := CalcTotalNetCommissionsDealerPay(totalGrossCommission, dlrOvrdAmount, SystemSize, mktFee, payments)
	m1Payment, m2Payment := CalcPaymentsDealerPay(totalNetCommission, drawPercent, drawMax)

	var amount float64
	if !NtpCompleteDate.IsZero() {
		amount = m1Payment
	} else if !PvComplettionDate.IsZero() {
		amount = m2Payment
	}
	outData["home_owner"] = HomeOwner
	outData["currect_status"] = CurrectStatus
	outData["unique_id"] = uniqueID
	outData["dealer_code"] = DealerCode
	outData["sys_size"] = SystemSize
	outData["contract_dol_dol"] = ContractDolDol
	outData["other_adders"] = OtherAdders
	outData["rep_1"] = Rep1
	outData["rep_2"] = Rep2
	outData["setter"] = Setter
	outData["st"] = ST
	outData["contract_date"] = ContractDate
	outData["net_epc"] = NetEpc
	outData["draw_amt"] = DrawAmt
	outData["ntp_complete_date"] = NtpCompleteDate
	outData["pv_complete_date"] = PvComplettionDate
	outData["finance_fee"] = financeFee
	outData["dealer_credit"] = dealercredit
	outData["dealer_payments"] = dealerpayments
	outData["today"] = time.Now()
	outData["amount"] = amount
	outData["epc"] = ContractDolDol / (SystemSize * 1000)
	outData["amt_paid"] = amt_paid
	outData["balance"] = balance
	outData["total_gross_commission"] = totalGrossCommission
	outData["total_net_commission"] = totalNetCommission
	outData["m1_payment"] = m1Payment
	outData["m2payment"] = m2Payment
	return outData, err
}
