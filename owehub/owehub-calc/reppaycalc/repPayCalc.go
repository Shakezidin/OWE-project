/**************************************************************************
 * File            : repPayCalc.go
 * DESCRIPTION     : This file contains functions to perform
 *							Calculations for RepPay
 * DATE            : 28-April-2024
 **************************************************************************/

package arcalc

import (
	common "OWEApp/owehub-calc/common"
	dataMgmt "OWEApp/owehub-calc/dataMgmt"
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"encoding/json"
	"fmt"
	"os"
	"time"
)

/******************************************************************************
* FUNCTION:            ExecDlrPayInitialCalculation
* DESCRIPTION:        Execute initial calculations for DealerPay
* INPUT:                       N/A
* RETURNS:             error
*****************************************************************************/
func ExecRepPayInitialCalculation(resultChan chan string) {
	var (
		err            error
		dlrPayDataList []map[string]interface{}
	)
	// log.EnterFn(0, "ExecDlrPayInitialCalculation")
	// defer func() { log.ExitFn(0, "ExecDlrPayInitialCalculation", err) }()

	for _, saleData := range dataMgmt.SaleData.SaleDataList {
		var dlrPayData map[string]interface{}
		dlrPayData, err = CalculateRepPayProject(saleData)
		log.FuncErrorTrace(0, "rep pay ====> : %+v", dlrPayData)

		if err != nil || dlrPayData == nil {
			if len(saleData.UniqueId) > 0 {
				log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data for unique id : %+v err: %+v", saleData.UniqueId, err)
			} else {
				log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data err : %+v", err)
			}
		} else {
			dlrPayDataList = append(dlrPayDataList, dlrPayData)
		}
	}
	/* Update Calculated and Fetched data PR.Data Table */
	err = db.AddMultipleRecordInDB(db.OweHubDbIndex, db.TableName_DLR_PAY_APCALC, dlrPayDataList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to insert initial DLR Pay Data in DB err: %v", err)
	}

	resultChan <- "SUCCESS"
}

/******************************************************************************
 * FUNCTION:        CalculateARProject
 * DESCRIPTION:     calculate the calculated data for ARCalc
 * RETURNS:        	outData
 *****************************************************************************/
func CalculateRepPayProject(saleData dataMgmt.SaleDataStruct) (outData map[string]interface{}, err error) {
	var (
		rep1Dba     string
		status      string
		rep1        string
		r1Balance   float64
		statusCheck float64
		dealer      string
		expense     float64
		uniqueID    string
		systemSize  float64
		commTotal   float64
		// dlrDrawPerc        float64
		// dlrDrawMax         float64
		commission_models  string
		partner            string
		installer          string
		loanType           string
		state              string
		wc                 time.Time
		adderLF            float64
		adderPerKw         float64
		payRateSubTotal    float64
		addr               float64
		autoAdder          float64
		loanFee            float64
		rebate             float64
		referral           float64
		netEpc             float64
		contractDolDol     float64
		contractTotal      float64
		payRateSemi        float64
		epcCalc            float64
		rl                 float64
		repPay             float64
		credit             float64
		dealerPaymentBonus float64
		homeOwner          string
		r1CommPaid         float64
		rep2               string
		r1Addr             float64
		perTeamKw          float64
		perRepKw           float64
		types              string
		repRl              float64
		repRate            float64
		payScale           string
		position           string
		kwh                float64
	)
	log.EnterFn(0, "CalculateARProject")
	defer func() { log.ExitFn(0, "CalculateARProject", err) }()

	outData = make(map[string]interface{})

	status = saleData.ProjectStatus
	rep1 = saleData.PrimarySalesRep
	dealer = saleData.Dealer
	uniqueID = saleData.UniqueId
	systemSize = saleData.SystemSize
	partner = saleData.Partner
	installer = saleData.Installer
	loanType = saleData.LoanType
	state = saleData.State
	wc = saleData.ContractDate
	netEpc = saleData.ContractTotal / (systemSize * 1000)
	contractTotal = saleData.ContractTotal
	systemSize = saleData.SystemSize
	homeOwner = saleData.HomeOwner
	rep2 = saleData.SecondarySalesRep

	rep1Dba = dataMgmt.DBACfg.CalculateDBA(outData["rep_1"].(string))

	expense = dataMgmt.AdderDataCfg.CalculateExpence(dealer, uniqueID, systemSize)
	_, _, commission_models = dataMgmt.PayScheduleCfg.CalculateDlrDrawPerc(dealer, partner, installer, loanType, state, wc)
	addr = dataMgmt.AdderDataCfg.CalculateAddr(dealer, uniqueID, systemSize)
	autoAdder = dataMgmt.AutoAdderCfg.CalculateAutoAddr(dealer, uniqueID, systemSize)
	contractDolDol = CalculateContractDolDol(netEpc, contractTotal, systemSize)
	loanFee = dataMgmt.SaleData.CalculateLoanFee(uniqueID, contractDolDol)
	rebate = dataMgmt.RebateCfg.CalculateRebate(dealer, uniqueID)
	referral = dataMgmt.ReferralDataConfig.CalculateReferralForUniqueId(dealer, uniqueID)
	adderLF = CalculateAdderLf(dealer, addr, expense, autoAdder, loanFee, rebate, referral)
	adderPerKw = calculateAdderPerKW(dealer, adderLF, systemSize)
	epcCalc = common.CalculateEPCCalc(contractDolDol, wc, netEpc, systemSize, common.DlrPayWc1FilterDate)
	rl = dataMgmt.PayScheduleCfg.CalculateRL(dealer, partner, installer, state, wc)
	payRateSemi = CalculatePayRateSemi(dealer, commission_models, saleData.PrimarySalesRep, epcCalc, rl, systemSize, netEpc, wc)
	payRateSubTotal = calculatePayRateSubTotal(dealer, commission_models, payRateSemi, adderPerKw, contractDolDol, adderLF)
	dealerPaymentBonus = dataMgmt.DealerRepayConfig.CalculateRepaymentBonus(uniqueID, homeOwner)
	commTotal = calculateCommTotal(dealer, commission_models, saleData.PrimarySalesRep, saleData.Source, payRateSubTotal, systemSize, dealerPaymentBonus, contractTotal, payRateSemi, adderLF) // dealerPaymentBonus
	credit = dataMgmt.DealerCreditCfg.CalculateCreaditForUniqueId(dealer, uniqueID)
	repPay = dataMgmt.ApRepCfg.CalculateRepPayForUniqueId(dealer, uniqueID)
	statusCheck = calculateStatusCheck(dealer, status, expense, commTotal, credit, repPay)
	r1CommPaid = dataMgmt.ApDealerCfg.CalculateR1CommPaid(dealer, uniqueID)
	r1Balance = calculateR1Balance(dealer, statusCheck, r1CommPaid)
	r1Addr = dataMgmt.AdderDataCfg.CalculateR1AddrResp(dealer, rep1, rep2, uniqueID, state, systemSize)
	perTeamKw = calculatePerTeamKw(rep1, rep2, wc, systemSize)
	perRepKw = calculatePerRepKw(rep1, rep2, systemSize)
	payScale, position = dataMgmt.RepPayCfg.CalculateR1PayScale(rep1, state, wc)
	repRl, repRate = dataMgmt.CmmsnRatesCfg.CalculateRepRl(partner, installer, state, types, payScale, kwh, wc) //! kwh, types value not set

	outData["rep_1_dba"] = rep1Dba
	outData["status"] = status
	outData["rep_1"] = rep1
	outData["r1_balance"] = r1Balance
	outData["r1_comm_paid"] = r1CommPaid
	outData["loan_fee"] = loanFee
	outData["r1_addr"] = r1Addr
	outData["per_team_kw"] = perTeamKw
	outData["rl"] = rl
	outData["per_rep_kw"] = perRepKw
	outData["rl"] = repRl
	outData["rate"] = repRate
	outData["position"] = position

	mapToJson(outData, saleData.UniqueId, "outData")
	return outData, err
}

/******************************************************************************
 * FUNCTION:        CalculateOweAR
 * DESCRIPTION:     calculates the "owe_ar" value based on the provided data
 * RETURNS:        owe ar
 *****************************************************************************/
func mapToJson(outData map[string]interface{}, uid, fileName string) {
	jsonData, err := json.MarshalIndent(outData, "", "    ")
	if err != nil {
		log.FuncFuncTrace(0, "Error writing JSON to file: %v", err)
		return
	}

	fileName = fmt.Sprintf("%v_%v_dlr_values.json", uid, fileName)
	err = os.WriteFile(fileName, jsonData, 0644)
	if err != nil {
		log.FuncFuncTrace(0, "Error writing JSON to file: %v", err)
		return
	}
	log.FuncFuncTrace(0, "success file name %v", fileName)
}
