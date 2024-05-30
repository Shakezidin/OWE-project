/**************************************************************************
* File            : dlrPayInitCalc.go
* DESCRIPTION     : This file contains functions to perform
*                          Calculations for DealerPay
* DATE            : 28-April-2024
**************************************************************************/

package arcalc

import (
	common "OWEApp/owehub-calc/common"
	dataMgmt "OWEApp/owehub-calc/dataMgmt"
	"encoding/json"
	"fmt"
	"os"

	// db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"time"
)

/******************************************************************************
* FUNCTION:            ExecDlrPayInitialCalculation
* DESCRIPTION:        Execute initial calculations for DealerPay
* INPUT:                       N/A
* RETURNS:             error
*****************************************************************************/
func ExecDlrPayInitialCalculation(resultChan chan string) {
	var (
		err            error
		dlrPayDataList []map[string]interface{}
	)
	// log.EnterFn(0, "ExecDlrPayInitialCalculation")
	// defer func() { log.ExitFn(0, "ExecDlrPayInitialCalculation", err) }()

	for _, saleData := range dataMgmt.SaleData.SaleDataList {
		var dlrPayData map[string]interface{}
		if saleData.UniqueId == "OUR11347" {
			dlrPayData, err = CalculateDlrPayProject(saleData)
			log.FuncErrorTrace(0, "dealer data ====> : %+v", dlrPayData)
		} else {
			continue
		}
		if err != nil || dlrPayData == nil {

			if len(saleData.UniqueId) <= 0 {
				log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data for unique id : %+v err: %+v", saleData.UniqueId, err)
			} else {
				log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data err : %+v", err)
			}
		} else {
			dlrPayDataList = append(dlrPayDataList, dlrPayData)
		}

		break // delete
	}
	/* Update Calculated and Fetched data AR.Data Table */
	// err = db.AddMultipleRecordInDB(db.OweHubDbIndex, db.TableName_DLR_PAY_APCALC, dlrPayDataList)
	// if err != nil {
	//  log.FuncErrorTrace(0, "Failed to insert initial AR Data in DB err: %v", err)
	// }

	resultChan <- "SUCCESS"
}

/******************************************************************************
* FUNCTION:        CalculateDlrPayProject
* DESCRIPTION:     calculate the calculated data for DLR Pay
* RETURNS:         outData
*****************************************************************************/
func CalculateDlrPayProject(saleData dataMgmt.SaleDataStruct) (outData map[string]interface{}, err error) {
	var (
		// uniqueId           string    // g
		rep_1   string  // m
		rep_2   string  // n
		SysSize float64 // p
		// contract           float64   // r
		// wc                 time.Time // u
		// ntp                time.Time // w
		// permSub            time.Time // x
		// hand               bool      // ab -- doubt
		// cancel             time.Time // ac
		// instSys            time.Time // ad
		// pto                time.Time // ag
		payRateSubTotal    float64   // verify the column number
		status             string    // aj
		statusDate         time.Time // ak
		contractDolDol     float64   //am
		dealer             string    // ap
		credit             float64   // as
		repPay             float64   // at
		payRateSemi        float64   // au
		addr               float64   // av
		expense            float64   // aw
		autoAdder          float64   // ax
		loanFee            float64   // ay
		rebate             float64   // az
		referral           float64   // ba
		adderTot           float64   // bb
		adderLF            float64   // bc
		epc                float64   // bd
		netEpc             float64   // be
		adderPerKw         float64   // bf
		commTotal          float64   // bh
		statusCheck        float64   // bi
		dealerPaymentBonus float64   // bj
		parentDlr          string    // bk
		payRate            float64   // bl
		overdTotal         float64   // bn
		DlrDrawPerc        float64   // bp
		DlrDrawMax         float64   // bq
		r1DrawAmt          float64   // bs
		r1DrawPaid         float64   // bt
		amtCheck           float64   // bu
		r1CommPaid         float64   // bv
		r1Balance          float64   // bw
		ovrdPaid           float64   // by
		ovrdBalance        float64   // bz
		repCount           float64   // cd
		perRepSales        float64   // ce
		perRepkW           float64   // cf
		contractCalc       float64   // ch
		epcCalc            float64   // ci
		loanFee2           float64   // cj unocomment if referred
		rep1Team           string    // ck
		rep2Team           string    // cl
		teamCount          float64   // cm
		perTeamSales       float64   // cn
		perTeamKw          float64   // co
		r1Name             string    // cq
		r1PayScale         float64   // cs
		position           float64   // ct
		rl                 float64   // cu
		r1Credit           float64   // da
		r1PayRateSemi      float64   // db
		r1Rr               float64   // di
		r1AdderTotal       float64   // dj
		r1AdderPerKw       float64   // dk
		r1PayRateSubTotal  float64   // dl
		r1NetEpc           float64   // dm
		r1MinmaxCorrect    float64   // dn
		r1CommTotal        float64   // do
		r1CommStatusCheck  float64   // dp
		r2Name             string    // dr
		r2PayRateSemi      float64   // ec
		r2Rr               float64   // ej
		r2AdderTotal       float64   // ek
		r2AdderPerKw       float64   // el
		r2PayRateSubTotal  float64   // em
		r2NetEpc           float64   // en
		r2MinmaxCorrect    float64   // eo
		r2CommTotal        float64   // ep
		r2CommStatusCheck  float64   // eq
	)

	// log.EnterFn(0, "CalculateDlrPayProject")
	// defer func() { log.ExitFn(0, "CalculateDlrPayProject", err) }()

	outData = make(map[string]interface{})

	// this is from sales data
	outData["dealer"] = saleData.Dealer
	outData["partner"] = saleData.Partner
	outData["instl"] = saleData.Installer
	outData["source"] = saleData.Source
	outData["loan_type"] = saleData.LoanType
	outData["unique_id"] = saleData.UniqueId
	outData["home_owner"] = saleData.HomeOwner
	outData["street_address"] = saleData.Address
	outData["st"] = saleData.State
	outData["rep_1"] = saleData.PrimarySalesRep
	outData["rep_2"] = saleData.SecondarySalesRep
	outData["sys_size"] = saleData.SystemSize
	outData["contract"] = saleData.ContractTotal
	outData["epc"] = saleData.NetEpc
	outData["wc"] = saleData.WC1
	outData["ntp"] = saleData.NtpDate
	outData["perm_sub"] = saleData.PermitSubmittedDate
	outData["perm_app"] = saleData.PermitApprovedDate
	outData["ic_sub"] = saleData.IcSubmittedDate
	outData["ic_app"] = saleData.IcApprovedDate
	outData["cancel"] = saleData.CancelledDate
	outData["inst_sys"] = saleData.PvInstallCompletedDate
	outData["pto"] = saleData.PtoDate

	status = saleData.ProjectStatus
	dealer = saleData.Dealer
	// contract = saleData.ContractTotal
	SysSize = saleData.SystemSize
	// uniqueId = saleData.UniqueId
	rep_1 = saleData.PrimarySalesRep
	rep_2 = saleData.SecondarySalesRep

	// payRate = saleData.PayRate

	// epcCalc = common.CalculateEPCCalc(contractCalc, saleData.WC1, saleData.NetEpc, saleData.SystemSize, common.DlrPayWc1FilterDate)

	// loanFee2 = dataMgmt.LoanFeeAdder.CalculateLoanFee2(saleData.LoanType)
	// r1Credit =

	log.FuncFuncTrace(0, "================================ Calculated Values ================================")
	log.FuncFuncTrace(0, "===================================================================================")
	log.FuncFuncTrace(0, "===================================================================================")
	log.FuncFuncTrace(0, "===================================================================================")
	log.FuncFuncTrace(0, "===================================================================================")
	log.FuncFuncTrace(0, "===================================================================================")

	log.FuncFuncTrace(0, "========================== UNIQUE ID -> %v ===============================", saleData.UniqueId)

	//first sheet calculation
	contractDolDol = CalculateContractDolDol(saleData.NetEpc, saleData.ContractTotal, saleData.SystemSize)
	rl = dataMgmt.PayScheduleCfg.CalculateRL(saleData.Dealer, saleData.Partner, saleData.Installer, saleData.LoanType, saleData.State, saleData.WC1.Format("2006-01-02"))
	log.FuncFuncTrace(0, "rl ->  %v", rl)

	credit = dataMgmt.DealerCreditCfg.CalculateCreaditForUniqueId(saleData.Dealer, saleData.UniqueId)
	log.FuncFuncTrace(0, "credit ->  %v", credit)

	repPay = dataMgmt.ApRepCfg.CalculateApRepForUniqueId(dealer, saleData.UniqueId)
	log.FuncFuncTrace(0, "repPay ->  %v", repPay)

	contractCalc = common.CalculateContractAmount(saleData.NetEpc, outData["contract"].(float64), outData["sys_size"].(float64))
	log.FuncFuncTrace(0, "contractCalc ->  %v", contractCalc)

	// correct value
	epcCalc = common.CalculateEPCCalc(contractCalc, saleData.WC1, saleData.NetEpc, saleData.SystemSize, common.DlrPayWc1FilterDate) // verify equation
	log.FuncFuncTrace(0, "epcCalc ->  %v", epcCalc)

	payRateSemi = CalculatePayRateSemi(saleData.Dealer, rl, epcCalc)
	log.FuncFuncTrace(0, "payRateSemi ->  %v", payRateSemi)

	addr = dataMgmt.AdderDataCfg.CalculateAddr(saleData.Dealer, saleData.UniqueId)
	log.FuncFuncTrace(0, "addr ->  %v", addr)

	expense = dataMgmt.AdderDataCfg.CalculateExpence(saleData.Dealer, saleData.UniqueId)
	log.FuncFuncTrace(0, "expense ->  %v", expense)

	autoAdder = dataMgmt.AutoAdderCfg.CalculateAutoAddr(saleData.Dealer, saleData.UniqueId, saleData.ChargeDlr, saleData.SystemSize)
	log.FuncFuncTrace(0, "autoAdder ->  %v", autoAdder)

	loanFee = CalculateLoanFee(saleData.UniqueId)
	log.FuncFuncTrace(0, "loanFee ->  %v", loanFee)

	rebate = dataMgmt.RebateCfg.CalculateRebate(saleData.Dealer, saleData.UniqueId)
	log.FuncFuncTrace(0, "rebate ->  %v", rebate)

	referral = dataMgmt.ReferralDataConfig.CalculateReferralForUniqueId(saleData.Dealer, saleData.UniqueId)
	log.FuncFuncTrace(0, "referral ->  %v", referral)

	adderTot = calculateAdderTotal(saleData.UniqueId, addr, autoAdder, rebate, referral)
	log.FuncFuncTrace(0, "adderTot ->  %v", adderTot)

	adderLF = CalculateAdderLf(saleData.Dealer, addr, expense, autoAdder, loanFee, rebate, referral)
	log.FuncFuncTrace(0, "adderLF ->  %v", adderLF)

	epc = CalculateAdderEPC(epcCalc, contractCalc, loanFee, SysSize)
	log.FuncFuncTrace(0, "epc ->  %v", epc)

	netEpc = calculateEpcCalc(epcCalc, contractCalc, adderLF, SysSize)
	log.FuncFuncTrace(0, "netEpc ->  %v", netEpc)

	adderPerKw = calculateAdderPerKW(dealer, adderLF, SysSize)
	log.FuncFuncTrace(0, "adderPerKw ->  %v", adderPerKw)

	payRateSubTotal = calculatePayRateSubTotal(dealer, payRateSemi, adderPerKw)
	log.FuncFuncTrace(0, "payRateSubTotal ->  %v", payRateSubTotal)

	commTotal = calculateCommTotal(dealer, payRateSubTotal, SysSize, dealerPaymentBonus) // payRate, dealerPaymentBonus
	log.FuncFuncTrace(0, "commTotal ->  %v", commTotal)

	// status = CalculateStatus(uniqueId, hand, pto, instSys, cancel, ntp, permSub, wc)
	// log.FuncFuncTrace(0, "status ->  %v", status)

	statusCheck = calculateStatusCheck(dealer, status, expense, commTotal, credit, repPay)
	log.FuncFuncTrace(0, "statusCheck ->  %v", statusCheck)

	parentDlr = dataMgmt.DealerOverrideConfig.CalculateParentDealer(saleData.Dealer, saleData.WC1.Format("2006-01-02"))
	log.FuncFuncTrace(0, "parentDlr ->  %v", parentDlr)

	overdTotal = calculateOVRDTotal(dealer, payRate, SysSize) // payrate value confused [BL]
	log.FuncFuncTrace(0, "overdTotal ->  %v", overdTotal)

	DlrDrawPerc = dataMgmt.PayScheduleCfg.CalculateDlrDrawPerc(saleData.Dealer, saleData.Partner, saleData.Installer, saleData.LoanType, saleData.State, saleData.StartDate.Format("2006-01-02"), saleData.EndDate.Format("2006-01-02"), saleData.WC1.Format("2006-01-02"))
	log.FuncFuncTrace(0, "DlrDrawPerc ->  %v", DlrDrawPerc) // converted string to float in CalculateDlrDrawPerc

	r1DrawAmt = CalculateR1DrawAmt(statusCheck, DlrDrawMax, DlrDrawPerc) // DlrDrawMax
	log.FuncFuncTrace(0, "r1DrawAmt ->  %v", r1DrawAmt)

	amtCheck = CalculateAmtCheck(r1DrawPaid, r1DrawAmt)
	log.FuncFuncTrace(0, "amtCheck ->  %v", amtCheck) // r1DrawPaid [eqn present] // no schema

	r1Balance = calculateR1Balance(dealer, statusCheck, r1CommPaid) // r1CommPaid [eqn present] // no schema
	log.FuncFuncTrace(0, "r1Balance ->  %v", r1Balance)

	ovrdBalance = CalculateOvrdBalance(dealer, overdTotal, ovrdPaid)
	log.FuncFuncTrace(0, "ovrdBalance ->  %v", ovrdBalance) // ovrdPaid [eqn present] // no schema

	repCount = calculateRepCount(rep_1, netEpc, adderPerKw)
	log.FuncFuncTrace(0, "repCount ->  %v", repCount)

	perRepSales = calculateRepSales(rep_1, netEpc, adderPerKw)
	log.FuncFuncTrace(0, "perRepSales ->  %v", perRepSales)

	perRepkW = calculateRepKw(rep_1, netEpc, SysSize, adderPerKw)
	log.FuncFuncTrace(0, "perRepkW ->  %v", perRepkW)

	// contractCalc = calculateContractCalc(epc, contract, SysSize)
	// log.FuncFuncTrace(0, "contractCalc ->  %v", contractCalc)

	teamCount = calculateTeamCount(rep1Team, rep2Team, credit, repPay) // rep1Team, rep2Team
	log.FuncFuncTrace(0, "teamCount ->  %v", teamCount)

	perTeamSales = calculatePerTeamSales(rep1Team, rep2Team, credit, repPay)
	log.FuncFuncTrace(0, "perTeamSales ->  %v", perTeamSales)

	perTeamKw = calculatePerTeamKw(rep1Team, rep2Team, credit, repPay, SysSize)
	log.FuncFuncTrace(0, "perTeamKw ->  %v", perTeamKw)

	r1Name = saleData.PrimarySalesRep
	log.FuncFuncTrace(0, "r1Name ->  %v", r1Name)

	r1PayRateSemi = calculateRPayRateSemi(rep_1, adderLF, epc, netEpc, commTotal, 0.0) // dlrdba string cant do calc
	log.FuncFuncTrace(0, "r1PayRateSemi ->  %v", r1PayRateSemi)

	r1Rr = calculateRRR(rep_1, DlrDrawPerc, DlrDrawPerc) // verify eq, no key
	log.FuncFuncTrace(0, "r1Rr ->  %v", r1Rr)

	r1AdderTotal = calculateRAdderTotal(rep_1, payRate, overdTotal, overdTotal, DlrDrawPerc, DlrDrawPerc) // verify eq
	log.FuncFuncTrace(0, "r1AdderTotal ->  %v", r1AdderTotal)

	r1AdderPerKw = calculateRAdderPerKw(rep_1, epcCalc, epcCalc) // verify eq
	log.FuncFuncTrace(0, "r1AdderPerKw ->  %v", r1AdderPerKw)

	r1PayRateSubTotal = calculateRPayRateSubTotal(rep_1, dealerPaymentBonus, r1DrawAmt) // dealerPaymentBonus
	log.FuncFuncTrace(0, "r1PayRateSubTotal ->  %v", r1PayRateSubTotal)

	r1NetEpc = calculateRNetEpc(epcCalc, overdTotal, overdTotal, overdTotal, rl, SysSize) // verify eq
	log.FuncFuncTrace(0, "r1NetEpc ->  %v", r1NetEpc)

	r1MinmaxCorrect = calculateRminmaxCorrect(rep_1, r1DrawPaid, adderPerKw, payRateSubTotal) // verify eq, r1DrawPaid
	log.FuncFuncTrace(0, "r1MinmaxCorrect ->  %v", r1MinmaxCorrect)

	r1CommTotal = calculateRCommTotal(rep_1, r1MinmaxCorrect, perRepkW, r1Credit) // r1Credit verify eq, r1_credit calc not done
	log.FuncFuncTrace(0, "r1CommTotal ->  %v", r1CommTotal)

	r1CommStatusCheck = calculateRStatusCommCheck(rep_1, status, r1Balance)
	log.FuncFuncTrace(0, "r1CommStatusCheck ->  %v", r1CommStatusCheck)

	r2Name = saleData.SecondarySalesRep
	log.FuncFuncTrace(0, "r2Name ->  %v", r2Name)

	r2PayRateSemi = calculateR2PayRateSemi(rep_1, repCount, perRepSales, perRepkW, epcCalc, 0.0) // verify eq, dlrdba is string, but adding
	log.FuncFuncTrace(0, "r2PayRateSemi ->  %v", r2PayRateSemi)                                  //  problem mention in sheet

	r2Rr = calculateRRR(rep_2, DlrDrawPerc, DlrDrawPerc) // verify eq
	log.FuncFuncTrace(0, "r2Rr ->  %v", r2Rr)

	r2AdderTotal = calculateRAdderTotal(rep_2, teamCount, perTeamSales, perTeamKw, perTeamKw, perTeamKw) // verify eq
	log.FuncFuncTrace(0, "r2AdderTotal ->  %v", r2AdderTotal)

	r2AdderPerKw = calculateRAdderPerKw(rep_2, r1PayScale, epcCalc) // r1PayScale verify eq
	log.FuncFuncTrace(0, "r2AdderPerKw ->  %v", r2AdderPerKw)

	r2PayRateSubTotal = calculateRPayRateSubTotal(rep_2, position, position) // verify eq
	log.FuncFuncTrace(0, "r2PayRateSubTotal ->  %v", r2PayRateSubTotal)

	r2NetEpc = calculateRNetEpc(ovrdBalance, r1PayScale, r1PayScale, perTeamKw, rl, SysSize) // verify eq, r1PayScale
	log.FuncFuncTrace(0, "r2NetEpc ->  %v", r2NetEpc)

	r2MinmaxCorrect = calculateRminmaxCorrect(rep_2, rl, contractCalc, contractCalc) // veridy eq
	log.FuncFuncTrace(0, "r2MinmaxCorrect ->  %v", r2MinmaxCorrect)

	r2CommTotal = calculateRCommTotal(rep_2, epcCalc, epcCalc, loanFee2) // verify eq
	log.FuncFuncTrace(0, "r2CommTotal ->  %v", r2CommTotal)

	r2CommStatusCheck = calculateRStatusCommCheck(rep_2, status, contractCalc) // verify eq
	log.FuncFuncTrace(0, "r2CommStatusCheck ->  %v", r2CommStatusCheck)

	log.FuncFuncTrace(0, "===================================================================================")
	log.FuncFuncTrace(0, "===================================================================================")
	log.FuncFuncTrace(0, "===================================================================================")
	log.FuncFuncTrace(0, "===================================================================================")
	log.FuncFuncTrace(0, "===================================================================================")
	log.FuncFuncTrace(0, "============================ Calculated Values ends here ==========================")

	/* ========================= %v== short words used ========================= %v===
	   nocal = here we are not calculating anything, need to sort where value comes

	   ========================= %v== short words used ========================= %v=== */

	// this is for 1st sheet
	outData["pay_rate_sub_total float"] = payRateSubTotal
	outData["rl"] = rl
	outData["pay_rate_semi"] = payRateSemi
	outData["addr"] = addr
	outData["expense"] = expense
	outData["auto_adder"] = autoAdder
	outData["loan_fee"] = loanFee
	outData["rebate"] = rebate
	outData["referral"] = referral
	outData["parent_dlr"] = parentDlr
	outData["rep_pay"] = repPay
	outData["adder_total"] = adderTot
	outData["net_epc"] = netEpc
	outData["adder_per_kw"] = adderPerKw
	outData["pay_rate"] = payRate
	outData["comm_total"] = commTotal
	outData["ovrd_total"] = overdTotal
	outData["status_check"] = statusCheck
	outData["contract$$"] = contractDolDol

	// this is for 2nd sheet
	DlrDrawMax = 0.0
	r1Balance = 0.0
	outData["dlr_draw_max"] = DlrDrawMax // nocal
	outData["r1_draw_amt"] = r1DrawAmt
	outData["amt_check"] = amtCheck
	outData["r1_balance"] = r1Balance
	outData["ovrd_balance"] = ovrdBalance
	outData["status"] = status
	outData["status_date"] = statusDate
	outData["rep_count"] = repCount
	outData["per_rep_sales"] = perRepSales
	outData["per_rep_kw"] = perRepkW
	outData["contract_calc"] = contractCalc
	outData["epc_calc"] = epcCalc
	outData["pay_rate_semi"] = payRateSemi
	outData["expence"] = expense
	outData["loan_fee"] = loanFee
	outData["team_count"] = teamCount
	outData["per_team_sales"] = perTeamSales
	outData["per_team_kw"] = perTeamKw

	// this is for 2nd sheet R1
	outData["r1_name"] = r1Name
	outData["r1_pay_rate_semi"] = r1PayRateSemi
	outData["r1_r_r"] = r1Rr
	outData["r1_adder_total"] = r1AdderTotal
	outData["r1_adder_per_kw"] = r1AdderPerKw
	outData["r1_pay_rate_sub_total"] = r1PayRateSubTotal
	outData["r1_net_epc"] = r1NetEpc
	outData["r1_min_max_correct"] = r1MinmaxCorrect
	outData["r1_comm_total"] = r1CommTotal
	outData["r1_comm_status_check"] = r1CommStatusCheck

	// this is for 2nd sheet R2
	outData["r2_name"] = r2Name
	outData["r2_pay_rate_semi"] = r2PayRateSemi
	outData["r2_r_r"] = r2Rr
	outData["r2_adder_total"] = r2AdderTotal
	outData["r2_adder_per_kw"] = r2AdderPerKw
	outData["r2_pay_rate_sub_total"] = r2PayRateSubTotal
	outData["r2_net_epc"] = r2NetEpc
	outData["r2_min_max_correct"] = r2MinmaxCorrect
	outData["r2_comm_total"] = r2CommTotal
	outData["r2_comm_status_check"] = r2CommStatusCheck

	// func replaceNaN(data map[string]interface{}) {
	// for key, value := range outData {
	//  if math.IsNaN(value.(float64)) {
	//    outData[key] = nil
	//  }
	// }
	// }

	jsonData, err := json.MarshalIndent(outData, "", "    ")
	if err != nil {
		log.FuncFuncTrace(0, "Error writing JSON to file: %v", err)
		return outData, err
	}

	fileName := fmt.Sprintf("%v_dlr_values.json", outData["unique_id"].(string))
	err = os.WriteFile(fileName, jsonData, 0644)
	if err != nil {
		log.FuncFuncTrace(0, "Error writing JSON to file: %v", err)
		return outData, err
	}
	log.FuncFuncTrace(0, "success file name %v", fileName)
	return outData, err
}
