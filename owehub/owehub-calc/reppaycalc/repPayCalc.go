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
		contractCalc       float64
		epcCalc            float64
		grossRev           float64
		// redLine      float64
		// permitPayM1  float64
		// installPayM2 float64
		// permitMax    float64
		addrPtr           float64
		addrAuto          float64
		loanFee           float64
		adjust            float64
		netRev            float64
		status            string
		permitPay         float64
		installPay        float64
		reconcile         float64
		totalPaid         float64
		currentDue        float64
		balance           float64
		state             string
		R1R_R             float64
		R1Rebate          float64
		R1Referral        float64
		PayScale          string
		Position          string
		R1Credit          float64
		r1CommStatusCheck float64
		R1CommTotal       float64
		R1MinOrMax        float64
		PerRepKw          float64
		r1PayRateSubTotal float64
		payRateSemi       float64
		dlrDrawPerc       float64
		dlrDrawMax        float64
		commission_models string
		contractDolDol    float64
		netEpc            float64
		r1AdderPerKw      float64
		rl                float64
		r1Addr            float64
		Adjustment        float64
		minRate           float64
		maxRate           float64
		rate              float64
		adjustment        float64
		r1Incentive       float64
		r1AdderTotal      float64
		r1AutoAdder       float64
		r1LoanFee         float64
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
	netEpc = saleData.ContractTotal / (saleData.SystemSize * 1000)
	/* Calculated Fields */

	R1Rebate = dataMgmt.RebateCfg.CalculateR1Rebate(saleData.PrimarySalesRep, saleData.UniqueId)                                 //BO
	R1Referral = dataMgmt.ReferralDataConfig.CalculateR1Referral(saleData.PrimarySalesRep, saleData.UniqueId)                    //BP
	R1R_R = calculateR1RR(saleData.PrimarySalesRep, R1Rebate, R1Referral)                                                        //BQ
	PayScale, Position = dataMgmt.RepPayCfg.CalculateR1PayScale(saleData.PrimarySalesRep, saleData.State, saleData.ContractDate) //BA
	R1Credit = dataMgmt.RepCreditCfg.CalculateR1Credit(saleData.UniqueId)                                                        //BI  there is no schema and get endpoint in main for repcredit
	rl = 0                                                                                                                       //BC
	rate = 0                                                                                                                     //BD
	adjustment = 0                                                                                                               //BE
	r1Incentive = 0                                                                                                              //BH
	epcCalc = 0                                                                                                                  //AQ
	PerRepKw = 0                                                                                                                 //AN  will calculate by raed
	payRateSemi = CalculatePayRateSemi(saleData.PrimarySalesRep, rl, rate, adjustment, r1Incentive, epcCalc)                     //BJ (BC, BD, BE, BH, AQ)
	r1Addr = dataMgmt.AdderDataCfg.CalculateR1Addr(saleData.UniqueId, saleData.PrimarySalesRep, saleData.SecondarySalesRep)      //BL
	r1AutoAdder = 0                                                                                                              //BM
	r1LoanFee = 0                                                                                                                //BN
	r1AdderTotal = calculateRAdderTotal(saleData.PrimarySalesRep, r1Addr, r1AutoAdder, r1LoanFee, R1Rebate, R1Referral)          //BR (BL, BM, BN, BO, BP)
	r1AdderPerKw = calculateRAdderPerKw(saleData.PrimarySalesRep, r1AdderTotal, PerRepKw)                                        //BS (BR, AN)
	r1PayRateSubTotal = calculateR1PayRateSubTotal(saleData.PrimarySalesRep, payRateSemi, r1AdderPerKw)                          //BT (BJ, BS)
	Adjustment, minRate, maxRate = dataMgmt.RateAdjustmentsCfg.CalculateAdjustmentMinRateMaxRate(PayScale, Position)             //BE BF BG
	R1MinOrMax = calculateR1MinOrMax(saleData.PrimarySalesRep, r1PayRateSubTotal, minRate, maxRate)                              //BV (BT, BF, BG)
	R1CommTotal = calculateR1CommTotal(saleData.PrimarySalesRep, saleData.Source, R1MinOrMax, PerRepKw, R1Credit)                //BW (BV, AN, BI)
	r1CommStatusCheck = calculateRCommStatudCheck(saleData.PrimarySalesRep, "Sales Rep 2", saleData.ProjectStatus, R1CommTotal)  //BX (DG, AJ, BW)
	// redLine = -0.15
	// permitPayM1 = 30
	// permitMax = 50000
	// installPayM2 = 100

	// log.FuncErrorTrace(0, "RAED redline -> %v permitPayM1 -> %v permitMax -> %v installPayM2 -> %v", redLine, permitPayM1, permitMax, installPayM2)

	// epc := (outData["sys_size"].(float64) * 1000) / outData["contract"].(float64)
	// contractCalc = common.CalculateARContractAmount(epc, outData["contract"].(float64), outData["sys_size"].(float64))
	// epcCalc = common.CalculateAREPCCalc(contractCalc, saleData.ContractDate, epc, saleData.SystemSize, common.ARWc1FilterDate) //!&* calculate epc value
	// contractdoldol := dlrPay.CalculateContractDolDol(epcCalc, contractTotal, systemSize)
	// log.FuncErrorTrace(0, "RAED saleData.NetEpc -> %v contract -> %v sys_size -> %v", saleData.NetEpc, outData["contract"].(float64), outData["sys_size"].(float64))
	// log.FuncErrorTrace(0, "RAED saleData.WC1 -> %v saleData.SystemSize -> %v", saleData.WC1, saleData.SystemSize)

	// log.FuncErrorTrace(0, "RAED epc -> %v epcCalc -> %v netEpc -> %v syssize -> %v projectStatus -> %v", epc, epcCalc, saleData.NetEpc, saleData.SystemSize, saleData.ProjectStatus)
	// grossRev = CalculateGrossRev(epcCalc, redLine, saleData.SystemSize)                                       //! 0 since redline is zero
	// addrPtr = dataMgmt.AdderDataCfg.CalculateAddrPtr(saleData.Dealer, saleData.UniqueId, saleData.SystemSize) //* AdderDataCfg

	// log.FuncErrorTrace(0, "RAED contractCalc -> %v epcCalc -> %v grossRev -> %v addrPtr -> %v", contractCalc, epcCalc, grossRev, addrPtr)

	// addrAuto = dataMgmt.AutoAdderCfg.CalculateAddrAuto(saleData.Dealer, saleData.UniqueId, saleData.SystemType)
	// addrAuto = dataMgmt.AutoAdderCfg.CalculateArAddrAuto(saleData.Dealer, saleData.UniqueId, saleData.SystemSize, saleData.State, saleData.Installer)
	// loanFee = dataMgmt.LoanFeeAdderCfg.CalculateLoanFee(saleData.UniqueId, saleData.Dealer, saleData.Installer, saleData.State, saleData.LoanType, saleData.ContractDate, contractdoldol) //~ LoanFeeAdderCfg need to verify
	// loanFee = 5266.2
	// adjust = dataMgmt.AdjustmentsConfig.CalculateAdjust(saleData.Dealer, saleData.UniqueId) //* AdjustmentsConfig
	// netRev = CalculateNetRev(grossRev, addrPtr, addrAuto, loanFee, adjust)                  //! 0 since grossRev is zero
	// log.FuncErrorTrace(0, "RAED addrAuto -> %v loanFee -> %v adjust -> %v netRev -> %v", addrAuto, loanFee, adjust, netRev)

	// permitPay = CalculatePermitPay(status, grossRev, netRev, permitPayM1, permitMax)             //! 0 since grossRev is zero
	// installPay = common.CalculateInstallPay(status, grossRev, netRev, installPayM2, permitPay)   //! 0 since grossRev is zero
	// reconcile = dataMgmt.ReconcileCfgData.CalculateReconcile(saleData.Dealer, saleData.UniqueId) // ReconcileCfgData
	// totalPaid = dataMgmt.ArCfgData.GetTotalPaidForUniqueId(saleData.UniqueId)                    //! need to add data for  sales_ar_cfg
	// log.FuncErrorTrace(0, "RAED permitPay -> %v installPay -> %v reconcile -> %v totalPaid -> %v", permitPay, installPay, reconcile, totalPaid)

	// oweAr := CalculateOweAR(contractCalc, loanFee)
	// currentDue = CalculateCurrentDue(&saleData, netRev, totalPaid, permitPay, installPay, reconcile)
	// balance = CalculateBalance(saleData.UniqueId, status, saleData.Dealer, totalPaid, netRev, reconcile)
	// log.FuncErrorTrace(0, "RAED currentDue -> %v balance -> %v oweAr -> %v", currentDue, balance, oweAr)

	// if len(saleData.State) > 0 {
	// 	state = saleData.State[5:]
	// }
	// if saleData.ProjectStatus == "PTO'd" {
	// 	status = "PTO"
	// }

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
