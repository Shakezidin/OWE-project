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
	"OWEApp/shared/db"
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
		dlrPayData, err = CalculateDlrPayProject(saleData)
		log.FuncErrorTrace(0, "dealer data ====> : %+v", dlrPayData)

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
* FUNCTION:        CalculateDlrPayProject
* DESCRIPTION:     calculate the calculated data for DLR Pay
* RETURNS:         outData
*****************************************************************************/
func CalculateDlrPayProject(saleData dataMgmt.SaleDataStruct) (outData map[string]interface{}, err error) {
	var (
		SysSize         float64   // p
		payRateSemi     float64   // au             //defference in 8020 calculation Done
		payRateSubTotal float64   // BG             //defference in 80/20 calculation Done
		loanFee         float64   // ay //required  //defference in 80/20 calculation Done
		commTotal       float64   // bh             //defference in 80/20 calculation
		parentDlr       string    // bk             //in 80/20 field name is changed to DLROV
		status          string    // aj //required
		statusDate      time.Time // ak //required
		contractDolDol  float64   // am //required
		dealer          string    // ap //required
		// dealerDBA          string    // aq //required
		credit             float64 // as //required
		repPay             float64 // at //required
		addr               float64 // av
		expense            float64 // aw
		autoAdder          float64 // ax
		rebate             float64 // az
		referral           float64 // ba
		adderTot           float64 // bb //required
		adderLF            float64 // bc
		epc                float64 // bd //required
		adderPerKw         float64 // bf
		statusCheck        float64 // BI //required
		dealerPaymentBonus float64 // bj
		payRate            float64 // bl
		ovrdTotal          float64 // bn
		DlrDrawMax         float64 // bq
		r1DrawPaid         float64 // BT //required
		amtCheck           float64 // bu
		r1CommPaid         float64 // BV //required
		r1Balance          float64 // BW //required
		ovrdPaid           float64 // by
		ovrdBalance        float64 // bz
		repCount           float64 // cd
		perRepSales        float64 // ce
		perRepkW           float64 // cf
		contractCalc       float64 // ch
		epcCalc            float64 // an
		teamCount          float64 // cm
		perTeamSales       float64 // cn
		perTeamKw          float64 // co
		rl                 float64 // AR //required
		r1DrawAmt          float64 // BS //required
		// Type               string    // E  //required
		netEpc float64 // BE //required
		// Rep1               string    // M  //required
		// Rep2               string    // N  //required

		homeOwner         string    // H //required
		uniqueID          string    // G //required
		wc                time.Time // U //required
		ntp               time.Time // W //required
		instSys           time.Time // AD //required
		loanType          string
		dlrDrawMax        float64 // BQ
		dlrDrawPerc       float64 // BP
		partner           string
		installer         string
		state             string // K //required
		contractTotal     float64
		systemSize        float64 //P //required
		adderTotal        float64
		netEpc2           float64
		commission_models string
	)

	// this row data is from sales data
	outData = make(map[string]interface{})

	uniqueID = saleData.UniqueId
	wc = saleData.ContractDate
	ntp = saleData.NtpDate
	instSys = saleData.PvInstallCompletedDate
	homeOwner = saleData.HomeOwner
	status = saleData.ProjectStatus
	dealer = saleData.Dealer
	loanType = saleData.LoanType
	// saleType = saleData.SaleType
	partner = saleData.Partner
	state = saleData.State
	installer = saleData.Installer
	SysSize = saleData.SystemSize
	systemSize = saleData.SystemSize
	netEpc = saleData.ContractTotal / (systemSize * 1000)
	contractTotal = saleData.ContractTotal

	outData["dealer"] = dealer
	outData["partner"] = partner
	outData["instl"] = installer
	outData["source"] = saleData.Source
	outData["loan_type"] = loanType
	outData["unique_id"] = uniqueID
	outData["home_owner"] = homeOwner
	outData["street_address"] = saleData.Address
	outData["st"] = state
	outData["rep_1"] = saleData.PrimarySalesRep
	outData["rep_2"] = saleData.SecondarySalesRep
	outData["sys_size"] = systemSize
	outData["contract"] = contractTotal
	outData["epc"] = netEpc
	outData["wc"] = wc
	outData["ntp"] = ntp
	outData["perm_sub"] = saleData.PermitSubmittedDate
	outData["perm_app"] = saleData.PermitApprovedDate
	outData["ic_sub"] = saleData.IcSubmittedDate
	outData["ic_app"] = saleData.IcApprovedDate
	outData["cancel"] = saleData.CancelledDate
	outData["inst_sys"] = instSys
	outData["pto"] = saleData.PtoDate

	// statusDate = CalculateStatusDate(uniqueID, shakyHand, pto, instSys, cancel, ntp, permSub, wc) //! shakyHand
	dlrDrawPerc, dlrDrawMax, commission_models = dataMgmt.PayScheduleCfg.CalculateDlrDrawPerc(dealer, partner, installer, loanType, state, wc)

	credit = dataMgmt.DealerCreditCfg.CalculateCreaditForUniqueId(dealer, uniqueID)
	repPay = dataMgmt.ApRepCfg.CalculateRepPayForUniqueId(dealer, uniqueID)
	expense = dataMgmt.AdderDataCfg.CalculateExpence(dealer, uniqueID, systemSize)

	rl = dataMgmt.PayScheduleCfg.CalculateRL(dealer, partner, installer, state, wc)
	log.FuncFuncTrace(0, "zidhin repPay: %v", repPay)
	// repPay = 2815 //zidhin
	log.FuncFuncTrace(0, "zidhin rl: %v", rl)
	// rl = 2 //zidhin
	log.FuncFuncTrace(0, "zidhin netepc:  %v", netEpc)
	// netEpc = 4.536372851
	log.FuncFuncTrace(0, "zidhin contractTotal: %v", contractTotal)
	// contractTotal = 50126.92 //zidhin
	contractDolDol = CalculateContractDolDol(netEpc, contractTotal, systemSize)
	epcCalc = common.CalculateEPCCalc(contractDolDol, wc, netEpc, systemSize, common.DlrPayWc1FilterDate)

	payRateSemi = CalculatePayRateSemi(dealer, commission_models, saleData.PrimarySalesRep, epcCalc, rl, systemSize, netEpc, wc)
	addr = dataMgmt.AdderDataCfg.CalculateAddr(dealer, uniqueID, systemSize)
	autoAdder = dataMgmt.AutoAdderCfg.CalculateAutoAddr(dealer, uniqueID, systemSize)

	loanFee = dataMgmt.SaleData.CalculateLoanFee(uniqueID, commission_models, contractDolDol)
	// loanFee = 1253.17
	rebate = dataMgmt.RebateCfg.CalculateRebate(dealer, uniqueID)
	referral = dataMgmt.ReferralDataConfig.CalculateReferralForUniqueId(dealer, uniqueID)

	adderLF = CalculateAdderLf(dealer, addr, expense, autoAdder, loanFee, rebate, referral)
	adderPerKw = calculateAdderPerKW(dealer, adderLF, SysSize)
	payRateSubTotal = calculatePayRateSubTotal(dealer, commission_models, payRateSemi, adderPerKw, contractDolDol, adderLF)
	// for 80/20 am-au-bc

	dealerPaymentBonus = dataMgmt.DealerRepayConfig.CalculateRepaymentBonus(uniqueID, homeOwner)

	commTotal = calculateCommTotal(dealer, commission_models, saleData.PrimarySalesRep, saleData.Source, payRateSubTotal, systemSize, dealerPaymentBonus, contractTotal, payRateSemi, adderLF) // dealerPaymentBonus
	// commTotal = -2888.39             17644 -> commtotal = 6295                                                    //Shushank
	// commTotal = -2888.39                                                                    //Shushank
	statusCheck = calculateStatusCheck(dealer, status, expense, commTotal, credit, repPay)
	r1DrawAmt = CalculateR1DrawAmt(statusCheck, dlrDrawMax, dlrDrawPerc)

	adderTotal = calculateAdderTotal(dealer, addr, autoAdder, rebate, referral)
	epc = CalculateAdderEPC(epcCalc, contractDolDol, loanFee, SysSize)
	netEpc2 = CalculateAdderEPC(epcCalc, contractDolDol, adderLF, SysSize)

	r1CommPaid = dataMgmt.ApDealerCfg.CalculateR1CommPaid(dealer, uniqueID)
	r1Balance = calculateR1Balance(dealer, statusCheck, r1CommPaid)
	r1DrawPaid = dataMgmt.ApDealerCfg.CalculateR1DrawPaid(dealer, uniqueID)

	parentDlr, payRate = dataMgmt.DealerOverrideConfig.CalculateParentDealerAndPayRate(saleData.Dealer, saleData.WC1)

	ovrdTotal = calculateOVRDTotal(dealer, payRate, SysSize)
	ovrdPaid = dataMgmt.ApDealerCfg.CalculateOvrdPaid(dealer, uniqueID, parentDlr)
	ovrdBalance = CalculateOvrdBalance(dealer, ovrdTotal, ovrdPaid)
	log.FuncFuncTrace(0, "Shushank dlrDrawPerc: %v, dlrDrawMax: %v", dlrDrawPerc, dlrDrawMax)
	log.FuncFuncTrace(0, "Shushank credit: %v, repPay: %v expense: %v", credit, repPay, expense)
	log.FuncFuncTrace(0, "Shushank rl: %v, contractDolDol: %v epcCalc: %v", rl, contractDolDol, epcCalc)
	log.FuncFuncTrace(0, "Shushank payRateSemi: %v, addr: %v autoAdder: %v", payRateSemi, addr, autoAdder)
	log.FuncFuncTrace(0, "Shushank loanFee: %v, rebate: %v referral: %v", loanFee, rebate, referral)
	log.FuncFuncTrace(0, "Shushank adderLF: %v, adderPerKw: %v payRateSubTotal: %v", adderLF, adderPerKw, payRateSubTotal)
	log.FuncFuncTrace(0, "RaedMajeed dealerPaymentBonus: %v", dealerPaymentBonus)
	log.FuncFuncTrace(0, "RaedMajeed commTotal: %v payRateSubTotal -> %v systemSize -> %v", commTotal, payRateSubTotal, systemSize)
	log.FuncFuncTrace(0, "Shushank commTotal: %v, statusCheck: %v r1DrawAmt: %v", commTotal, statusCheck, r1DrawAmt)
	log.FuncFuncTrace(0, "Shushank adderTotal: %v, epc: %v netEpc2: %v", adderTotal, epc, netEpc2)
	log.FuncFuncTrace(0, "Shushank r1CommPaid: %v, r1Balance: %v r1DrawPaid: %v", r1CommPaid, r1Balance, r1DrawPaid)
	log.FuncFuncTrace(0, "Shushank parentDlr: %v payRate: %v", parentDlr, payRate)
	log.FuncFuncTrace(0, "Shushank overdTotal: %v ovrdPaid: %v ovrdBalance: %v", ovrdTotal, ovrdPaid, ovrdBalance)

	// this is for 1st sheet (AP CALC)
	outData["pay_rate_sub_total"] = payRateSubTotal
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
	outData["ovrd_total"] = ovrdTotal
	outData["status_check"] = statusCheck
	outData["contract_$$"] = contractDolDol

	// this is for 2nd sheet (DEALER PAY)
	// DlrDrawMax = 0.0
	// r1Balance = 0.0
	outData["dlr_draw_max"] = DlrDrawMax // nocal
	outData["r1_draw_amt"] = r1DrawAmt
	outData["amt_check"] = amtCheck
	outData["r1_balance"] = r1Balance
	outData["ovrd_balance"] = ovrdBalance
	outData["ovrd_paid"] = ovrdPaid
	outData["status"] = status
	outData["status_date"] = statusDate
	outData["rep_count"] = repCount
	outData["per_rep_sales"] = perRepSales
	outData["per_rep_kw"] = perRepkW
	outData["contract_calc"] = contractCalc
	outData["epc_calc"] = epcCalc
	outData["pay_rate_semi"] = payRateSemi
	outData["expense"] = expense
	outData["loan_fee"] = loanFee
	outData["team_count"] = teamCount
	outData["per_team_sales"] = perTeamSales
	outData["per_team_kw"] = perTeamKw

	//first sheet calculation

	// epc = CalculateAdderEPC(epcCalc, contractCalc, loanFee, SysSize)
	// log.FuncFuncTrace(0, "epc ->  %v", epc)

	// netEpc = calculateEpcCalc(epcCalc, contractCalc, adderLF, SysSize)
	// log.FuncFuncTrace(0, "netEpc ->  %v", netEpc)

	// status = CalculateStatus(uniqueId, hand, pto, instSys, cancel, ntp, permSub, wc)
	// log.FuncFuncTrace(0, "status ->  %v", status)

	// DlrDrawPerc = dataMgmt.PayScheduleCfg.CalculateDlrDrawPerc(saleData.Dealer, saleData.Partner, saleData.Installer, saleData.LoanType, saleData.State, saleData.StartDate.Format("2006-01-02"), saleData.EndDate.Format("2006-01-02"), saleData.WC1.Format("2006-01-02"))
	// log.FuncFuncTrace(0, "DlrDrawPerc ->  %v", DlrDrawPerc) // converted string to float in CalculateDlrDrawPerc

	// amtCheck = CalculateAmtCheck(r1DrawPaid, r1DrawAmt)
	// log.FuncFuncTrace(0, "amtCheck ->  %v", amtCheck) // r1DrawPaid [eqn present] // no schema

	// repCount = calculateRepCount(rep_1, netEpc, adderPerKw)
	// log.FuncFuncTrace(0, "repCount ->  %v", repCount)

	// perRepSales = calculateRepSales(rep_1, netEpc, adderPerKw)
	// log.FuncFuncTrace(0, "perRepSales ->  %v", perRepSales)

	// perRepkW = calculateRepKw(rep_1, netEpc, SysSize, adderPerKw)
	// log.FuncFuncTrace(0, "perRepkW ->  %v", perRepkW)

	// contractCalc = calculateContractCalc(epc, contract, SysSize)
	// log.FuncFuncTrace(0, "contractCalc ->  %v", contractCalc)

	// teamCount = calculateTeamCount(rep1Team, rep2Team, credit, repPay) // rep1Team, rep2Team
	// log.FuncFuncTrace(0, "teamCount ->  %v", teamCount)

	// perTeamSales = calculatePerTeamSales(rep1Team, rep2Team, credit, repPay)
	// log.FuncFuncTrace(0, "perTeamSales ->  %v", perTeamSales)

	// perTeamKw = calculatePerTeamKw(rep1Team, rep2Team, credit, repPay, SysSize)
	// log.FuncFuncTrace(0, "perTeamKw ->  %v", perTeamKw)

	// r1Name = saleData.PrimarySalesRep
	// log.FuncFuncTrace(0, "r1Name ->  %v", r1Name)

	// r1PayRateSemi = calculateRPayRateSemi(rep_1, adderLF, epc, netEpc, commTotal, 0.0) // dlrdba string cant do calc
	// log.FuncFuncTrace(0, "r1PayRateSemi ->  %v", r1PayRateSemi)

	// r1Rr = calculateRRR(rep_1, DlrDrawPerc, DlrDrawPerc) // verify eq, no key
	// log.FuncFuncTrace(0, "r1Rr ->  %v", r1Rr)

	// r1AdderTotal = calculateRAdderTotal(rep_1, payRate, overdTotal, overdTotal, DlrDrawPerc, DlrDrawPerc) // verify eq
	// log.FuncFuncTrace(0, "r1AdderTotal ->  %v", r1AdderTotal)

	// r1AdderPerKw = calculateRAdderPerKw(rep_1, epcCalc, epcCalc) // verify eq
	// log.FuncFuncTrace(0, "r1AdderPerKw ->  %v", r1AdderPerKw)

	// r1PayRateSubTotal = calculateRPayRateSubTotal(rep_1, dealerPaymentBonus, r1DrawAmt) // dealerPaymentBonus
	// log.FuncFuncTrace(0, "r1PayRateSubTotal ->  %v", r1PayRateSubTotal)

	// r1NetEpc = calculateRNetEpc(epcCalc, overdTotal, overdTotal, overdTotal, rl, SysSize) // verify eq
	// log.FuncFuncTrace(0, "r1NetEpc ->  %v", r1NetEpc)

	// r1MinmaxCorrect = calculateRminmaxCorrect(rep_1, r1DrawPaid, adderPerKw, payRateSubTotal) // verify eq, r1DrawPaid
	// log.FuncFuncTrace(0, "r1MinmaxCorrect ->  %v", r1MinmaxCorrect)

	// r1CommTotal = calculateRCommTotal(rep_1, r1MinmaxCorrect, perRepkW, r1Credit) // r1Credit verify eq, r1_credit calc not done
	// log.FuncFuncTrace(0, "r1CommTotal ->  %v", r1CommTotal)

	// r1CommStatusCheck = calculateRStatusCommCheck(rep_1, status, r1Balance)
	// log.FuncFuncTrace(0, "r1CommStatusCheck ->  %v", r1CommStatusCheck)

	// r2Name = saleData.SecondarySalesRep
	// log.FuncFuncTrace(0, "r2Name ->  %v", r2Name)

	// r2PayRateSemi = calculateR2PayRateSemi(rep_1, repCount, perRepSales, perRepkW, epcCalc, 0.0) // verify eq, dlrdba is string, but adding
	// log.FuncFuncTrace(0, "r2PayRateSemi ->  %v", r2PayRateSemi)                                  //  problem mention in sheet

	// r2Rr = calculateRRR(rep_2, DlrDrawPerc, DlrDrawPerc) // verify eq
	// log.FuncFuncTrace(0, "r2Rr ->  %v", r2Rr)

	// r2AdderTotal = calculateRAdderTotal(rep_2, teamCount, perTeamSales, perTeamKw, perTeamKw, perTeamKw) // verify eq
	// log.FuncFuncTrace(0, "r2AdderTotal ->  %v", r2AdderTotal)

	// r2AdderPerKw = calculateRAdderPerKw(rep_2, r1PayScale, epcCalc) // r1PayScale verify eq
	// log.FuncFuncTrace(0, "r2AdderPerKw ->  %v", r2AdderPerKw)

	// r2PayRateSubTotal = calculateRPayRateSubTotal(rep_2, position, position) // verify eq
	// log.FuncFuncTrace(0, "r2PayRateSubTotal ->  %v", r2PayRateSubTotal)

	// r2NetEpc = calculateRNetEpc(ovrdBalance, r1PayScale, r1PayScale, perTeamKw, rl, SysSize) // verify eq, r1PayScale
	// log.FuncFuncTrace(0, "r2NetEpc ->  %v", r2NetEpc)

	// r2MinmaxCorrect = calculateRminmaxCorrect(rep_2, rl, contractCalc, contractCalc) // veridy eq
	// log.FuncFuncTrace(0, "r2MinmaxCorrect ->  %v", r2MinmaxCorrect)

	// r2CommTotal = calculateRCommTotal(rep_2, epcCalc, epcCalc, loanFee2) // verify eq
	// log.FuncFuncTrace(0, "r2CommTotal ->  %v", r2CommTotal)

	// r2CommStatusCheck = calculateRStatusCommCheck(rep_2, status, contractCalc) // verify eq
	// log.FuncFuncTrace(0, "r2CommStatusCheck ->  %v", r2CommStatusCheck)

	/* ========================= %v== short words used ========================= %v===
	   nocal = here we are not calculating anything, need to sort where value comes

	   ========================= %v== short words used ========================= %v=== */

	return outData, err
}

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
