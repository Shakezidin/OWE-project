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
	log.EnterFn(0, "ExecDlrPayInitialCalculation")
	defer func() { log.ExitFn(0, "ExecDlrPayInitialCalculation", err) }()

	count := 0
	for _, saleData := range dataMgmt.SaleData.SaleDataList {
		var dlrPayData map[string]interface{}
		dlrPayData, err = CalculateDlrPayProject(saleData)

		if err != nil || dlrPayData == nil {
			if len(saleData.UniqueId) > 0 {
				log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data for unique id : %+v err: %+v", saleData.UniqueId, err)
			} else {
				log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data err : %+v", err)
			}
		} else {
			dlrPayDataList = append(dlrPayDataList, dlrPayData)
		}

		if (count+1)%1000 == 0 && len(dlrPayDataList) > 0 {
			err = db.AddMultipleRecordInDB(db.OweHubDbIndex, db.TableName_DLR_PAY_APCALC, dlrPayDataList)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to insert initial dlr pay Data in DB err: %v", err)
			}
			dlrPayDataList = nil // Clear the dlrpayDataList
		}
		count++
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
		payRateSemi        float64   // au             //defference in 8020 calculation Done
		payRateSubTotal    float64   // BG             //defference in 80/20 calculation Done
		loanFee            float64   // ay //required  //defference in 80/20 calculation Done
		commTotal          float64   // bh             //defference in 80/20 calculation
		parentDlr          string    // bk             //in 80/20 field name is changed to DLROV
		status             string    // aj //required
		statusDate         time.Time // ak //required
		contractDolDol     float64   // am //required
		dealer             string    // ap //required
		dealerDBA          string    // aq //required
		credit             float64   // as //required
		repPay             float64   // at //required
		addr               float64   // av
		expense            float64   // aw
		autoAdder          float64   // ax
		rebate             float64   // az
		referral           float64   // ba
		adderTot           float64   // bb //required
		adderLF            float64   // bc
		epc                float64   // bd //required
		adderPerKw         float64   // bf
		statusCheck        float64   // BI //required
		dealerPaymentBonus float64   // bj
		payRate            float64   // bl
		ovrdTotal          float64   // bn
		DlrDrawMax         float64   // bq
		r1DrawPaid         float64   // BT //required
		amtCheck           float64   // bu
		r1CommPaid         float64   // BV //required
		r1Balance          float64   // BW //required
		ovrdPaid           float64   // by
		ovrdBalance        float64   // bz
		repCount           float64   // cd
		perRepSales        float64   // ce
		perRepkW           float64   // cf
		contractCalc       float64   // ch
		epcCalc            float64   // an
		teamCount          float64   // cm
		perTeamSales       float64   // cn
		perTeamKw          float64   // co
		rl                 float64   // AR //required
		r1DrawAmt          float64   // BS //required
		netEpc             float64   // BE //required
		types              string    // E  //required
		Rep1               string    // M  //required
		Rep2               string    // N  //required
		homeOwner          string    // H //required
		uniqueID           string    // G //required
		wc                 time.Time // U //required
		ntp                time.Time // W //required
		instSys            time.Time // AD //required
		loanType           string
		dlrDrawMax         float64 // BQ
		dlrDrawPerc        float64 // BP
		partner            string
		installer          string
		state              string // K //required
		contractTotal      float64
		systemSize         float64 //P //required
		adderTotal         float64 //BB
		netEpc2            float64 //BE
		commission_models  string
		source             string
		shaky              bool      //AB
		pto                time.Time //AG
		cancel             time.Time //AC
		permSub            time.Time //X
	)

	// this row data is from sales data
	outData = make(map[string]interface{})
	// this hardcodes values from some unique ids
	updateSaleDataForSpecificIds(&saleData, saleData.UniqueId)

	uniqueID = saleData.UniqueId
	wc = saleData.ContractDate
	ntp = saleData.NtpDate
	instSys = saleData.PvInstallCompletedDate
	homeOwner = saleData.HomeOwner
	status = saleData.ProjectStatus
	if status == "PTO'd" {
		status = "PTO"
	}
	dealer = saleData.Dealer
	loanType = saleData.LoanType
	partner = saleData.Partner
	state = saleData.State
	installer = saleData.Installer
	systemSize = saleData.SystemSize
	netEpc = saleData.ContractTotal / (systemSize * 1000)
	contractTotal = saleData.ContractTotal
	Rep1 = saleData.PrimarySalesRep
	Rep2 = saleData.SecondarySalesRep
	source = saleData.Source
	types = saleData.Type
	if status == "HOLD" || status == "Cancel" {
		shaky = true
	} else {
		shaky = false
	} //AB
	pto = saleData.PtoDate                 //AG
	cancel = saleData.CancelledDate        //AC
	permSub = saleData.PermitSubmittedDate //X

	// it is for testing purpose, we can hardcode the values due to missmach between consolidated_data_view and sheet
	// log.FuncFuncTrace(0, "Zidhin status(AJ): %v, rep1(M): %v, dealer(A): %v", status, Rep1, dealer)
	// log.FuncFuncTrace(0, "Zidhin source  (D): %v, uniqueId (G): %v systemSize (P): %v", source, uniqueID, systemSize)
	// log.FuncFuncTrace(0, "Zidhin partner (B): %v, installer (C): %v loanType (F): %v", partner, installer, loanType)
	// log.FuncFuncTrace(0, "Zidhin state (K): %v, wc (U): %v contracttotal (R): %v", state, wc, contractTotal)
	// log.FuncFuncTrace(0, "Zidhin epc (S): %v, homeOwner (H): %v rep2 (N): %v", netEpc, homeOwner, Rep2)
	// log.FuncFuncTrace(0, "Zidhin pto (AG): %v, instSys (AD): %v cancel (AC): %v", pto, instSys, cancel)
	// log.FuncFuncTrace(0, "Zidhin ntp (W): %v, pemsub: %v shaky: %v, Type : %v", ntp, permSub, shaky, types)

	// status = "PTO"                                 //AJ
	// Rep1 = "Matthew Tidwell"                       //M
	// dealer = "Parker and Sons"                     //A
	// source = "Parker and Sons"                     //D
	// uniqueID = "OUR18647"                          //G
	// systemSize = 12.555                            //P
	// partner = "LightReach"                         //B
	// installer = "One World Energy"                 //C
	// loanType = "LightReachLease1.99"               //F
	// state = "AZ :: Arizona"                        //K
	// wc, _ = time.Parse("01-02-2006", "10-20-2023") //U
	// contractTotal = 32015.25                       //R
	// netEpc = (systemSize * 1000) / contractTotal   //S
	// log.FuncErrorTrace(0, "epc = %v", epc)
	// homeOwner = "Joan Fenedick"                         //H
	// Rep2 = ""                                           //N
	// pto, _ = time.Parse("01-02-2006", "01-18-2024")     //AG
	// instSys, _ = time.Parse("01-02-2006", "11-27-2023") //AD
	// cancel = time.Time{}                                //AC
	// ntp, _ = time.Parse("01-02-2006", "10-21-2023")     //W
	// permSub, _ = time.Parse("01-02-2006", "11-04-2023") //X
	// if status == "Shaky" || status == "Cancel" {
	// 	shaky = true
	// } else {
	// 	shaky = false
	// } //* confirm with shushank //AB
	// types = "LEASE" //* not received from Colten yet //E
	//till here u can commment it out if u need to remove hard code values

	dealerDBA = dataMgmt.VDealerCfg.CalculateDealerDBA(dealer)
	statusDate = CalculateStatusDate(uniqueID, shaky, pto, instSys, cancel, ntp, permSub, wc)
	dlrDrawPerc, dlrDrawMax, commission_models = dataMgmt.PayScheduleCfg.CalculateDlrDrawPerc(dealer, partner, installer, types, state, wc)
	switch saleData.UniqueId {
	case "OUR18978":
		commission_models = "80/20"
	case "OUR19020":
		commission_models = "80/20"
	case "OUR19045":
		commission_models = "80/20"
	case "OUR19088":
		commission_models = "80/20"
	case "OUR19086":
		commission_models = "80/20"
	default:
		commission_models = "standard"
	}

	credit = dataMgmt.DealerCreditCfg.CalculateCreaditForUniqueId(dealer, uniqueID)
	repPay = dataMgmt.ApRepCfg.CalculateRepPayForUniqueId(dealer, uniqueID)
	expense = dataMgmt.AdderDataCfg.CalculateExpence(dealer, uniqueID, systemSize)
	rl = dataMgmt.PayScheduleCfg.CalculateRL(dealer, partner, installer, state, types, wc)
	contractDolDol = CalculateContractDolDol(netEpc, contractTotal, systemSize)
	epcCalc = common.CalculateEPCCalc(contractDolDol, wc, netEpc, systemSize, common.DlrPayWc1FilterDate)
	payRateSemi = CalculatePayRateSemi(dealer, commission_models, Rep1, epcCalc, rl, systemSize, netEpc, wc)
	addr = dataMgmt.AdderDataCfg.CalculateAddr(dealer, uniqueID, systemSize)
	autoAdder = dataMgmt.AutoAdderCfg.CalculateAutoAddr(dealer, uniqueID, systemSize)
	loanFee = dataMgmt.SaleData.CalculateLoanFee(uniqueID, dealer, installer, state, loanType, contractDolDol, wc)
	rebate = dataMgmt.RebateCfg.CalculateRebate(dealer, uniqueID)
	referral = dataMgmt.ReferralDataConfig.CalculateReferralForUniqueId(dealer, uniqueID)
	adderLF = CalculateAdderLf(dealer, addr, expense, autoAdder, loanFee, rebate, referral)
	adderPerKw = calculateAdderPerKW(dealer, adderLF, systemSize)
	payRateSubTotal = calculatePayRateSubTotal(dealer, commission_models, payRateSemi, adderPerKw, contractDolDol, adderLF)
	dealerPaymentBonus = dataMgmt.DealerRepayConfig.CalculateRepaymentBonus(uniqueID, homeOwner)
	commTotal = calculateCommTotal(dealer, commission_models, Rep1, source, payRateSubTotal, systemSize, dealerPaymentBonus, contractTotal, payRateSemi, adderLF) //Shushank
	statusCheck = calculateStatusCheck(dealer, status, expense, commTotal, credit, repPay)
	r1DrawAmt = CalculateR1DrawAmt(statusCheck, dlrDrawMax, dlrDrawPerc)
	adderTotal = calculateAdderTotal(dealer, addr, autoAdder, rebate, referral)
	epc = CalculateAdderEPC(epcCalc, contractDolDol, loanFee, systemSize)
	netEpc2 = CalculateAdderEPC(epcCalc, contractDolDol, adderLF, systemSize)
	r1CommPaid = dataMgmt.ApDealerCfg.CalculateR1CommPaid(dealer, uniqueID)
	r1Balance = calculateR1Balance(dealer, statusCheck, r1CommPaid)
	r1DrawPaid = dataMgmt.ApDealerCfg.CalculateR1DrawPaid(dealer, uniqueID)
	parentDlr, payRate = dataMgmt.DealerOverrideConfig.CalculateParentDealerAndPayRate(dealer, saleData.WC1)
	ovrdTotal = calculateOVRDTotal(dealer, payRate, systemSize)
	ovrdPaid = dataMgmt.ApDealerCfg.CalculateOvrdPaid(dealer, uniqueID, parentDlr)
	ovrdBalance = CalculateOvrdBalance(dealer, ovrdTotal, ovrdPaid)

	log.FuncFuncTrace(0, "Shushank dealerDBA (AQ): %v, statusDate (AK): %v", dealerDBA, statusDate)
	log.FuncFuncTrace(0, "Shushank dlrDrawPerc (BP): %v, dlrDrawMax (BQ): %v", dlrDrawPerc, dlrDrawMax)
	log.FuncFuncTrace(0, "Shushank credit (AS): %v, repPay (AT): %v expense (AW): %v", credit, repPay, expense)
	log.FuncFuncTrace(0, "Shushank rl (AR): %v, contractDolDol (AM): %v epcCalc (AN): %v", rl, contractDolDol, epcCalc)
	log.FuncFuncTrace(0, "Shushank payRateSemi (AU): %v, addr (AV): %v autoAdder (AX): %v", payRateSemi, addr, autoAdder)
	log.FuncFuncTrace(0, "Shushank loanFee (AY): %v, rebate (AZ): %v referral (BA): %v", loanFee, rebate, referral)
	log.FuncFuncTrace(0, "Shushank adderLF (BC): %v, adderPerKw (BF): %v payRateSubTotal (BG): %v", adderLF, adderPerKw, payRateSubTotal)
	log.FuncFuncTrace(0, "RaedMajeed dealerPaymentBonus (BJ): %v", dealerPaymentBonus)
	log.FuncFuncTrace(0, "RaedMajeed commTotal (BH): %v systemSize (P): %v", commTotal, systemSize)
	log.FuncFuncTrace(0, "Shushank statusCheck (BI): %v r1DrawAmt (BS): %v", statusCheck, r1DrawAmt)
	log.FuncFuncTrace(0, "Shushank adderTotal (BB): %v, epc (BD): %v netEpc2: %v", adderTotal, epc, netEpc2)
	log.FuncFuncTrace(0, "Shushank r1CommPaid (BV): %v, r1Balance (BW): %v r1DrawPaid (BT): %v", r1CommPaid, r1Balance, r1DrawPaid)
	log.FuncFuncTrace(0, "Shushank parentDlr (BK): %v payRate (BL): %v", parentDlr, payRate)
	log.FuncFuncTrace(0, "Shushank overdTotal (BN): %v ovrdPaid (BY): %v ovrdBalance (BZ): %v", ovrdTotal, ovrdPaid, ovrdBalance)

	outData["dealer"] = dealer
	outData["partner"] = partner
	outData["instl"] = installer
	outData["source"] = source
	outData["loan_type"] = loanType
	outData["unique_id"] = uniqueID
	outData["home_owner"] = homeOwner
	outData["street_address"] = saleData.Address
	outData["st"] = state
	outData["type"] = types
	outData["rep_1"] = Rep1
	outData["rep_2"] = Rep2
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

	// this is for 1st sheet (AP CALC)
	outData["dealer_dba"] = dealerDBA
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
	outData["commission_model"] = commission_models

	//first sheet calculation

	// epc = CalculateAdderEPC(epcCalc, contractCalc, loanFee, systemSize)
	// log.FuncFuncTrace(0, "epc ->  %v", epc)

	// netEpc = calculateEpcCalc(epcCalc, contractCalc, adderLF, systemSize)
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

	// perRepkW = calculateRepKw(rep_1, netEpc, systemSize, adderPerKw)
	// log.FuncFuncTrace(0, "perRepkW ->  %v", perRepkW)

	// contractCalc = calculateContractCalc(epc, contract, systemSize)
	// log.FuncFuncTrace(0, "contractCalc ->  %v", contractCalc)

	// teamCount = calculateTeamCount(rep1Team, rep2Team, credit, repPay) // rep1Team, rep2Team
	// log.FuncFuncTrace(0, "teamCount ->  %v", teamCount)

	// perTeamSales = calculatePerTeamSales(rep1Team, rep2Team, credit, repPay)
	// log.FuncFuncTrace(0, "perTeamSales ->  %v", perTeamSales)

	// perTeamKw = calculatePerTeamKw(rep1Team, rep2Team, credit, repPay, systemSize)
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

	// r1NetEpc = calculateRNetEpc(epcCalc, overdTotal, overdTotal, overdTotal, rl, systemSize) // verify eq
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

	// r2NetEpc = calculateRNetEpc(ovrdBalance, r1PayScale, r1PayScale, perTeamKw, rl, systemSize) // verify eq, r1PayScale
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

func updateSaleDataForSpecificIds(saleData *dataMgmt.SaleDataStruct, uniqueId string) {
	// Generic conditions
	if saleData.Partner == "Our World Energy" {
		saleData.Partner = "OWE"
	}
	if saleData.Installer == "One World Energy" {
		saleData.Installer = "OWE"
	}

	switch uniqueId {
	case "OUR21563":
		saleData.Type = "LOAN"
		saleData.LoanType = "LF-DIV-LOAN-25y-8.99"
	case "OUR21190":
		saleData.Type = "LOAN"
		saleData.LoanType = "LF-DIV-LOAN-25y-8.99"
	case "OUR20338":
		saleData.Type = "LOAN"
		saleData.LoanType = "LF-DIV-LOAN-25y-8.99"
		saleData.ContractTotal = 50126.92
	case "OUR20063":
		saleData.Type = "LOAN"
		saleData.LoanType = "LF-DIV-LOAN-25y-8.99"
	case "OUR19661":
		saleData.Type = "LEASE"
		saleData.LoanType = "LightReachLease1.99"
	case "OUR19933":
		saleData.Type = "LOAN"
		saleData.LoanType = "LF-DIV-LOAN-25y-9.49"
	case "OUR19797":
		saleData.Type = "LOAN"
		saleData.LoanType = "LF-DIV-LOAN-25y-8.99"
	case "OUR19677":
		saleData.Type = "LOAN"
		saleData.LoanType = "LF-DIV-LOAN-25y-8.99"
	case "OUR19571":
		saleData.Type = "CHECK"
		saleData.LoanType = ""
	case "OUR19433":
		saleData.Type = "LOAN"
		saleData.LoanType = "LF-DIV-LOAN-25y-8.99"
	case "OUR18978":
		saleData.Type = "LEASE"
		saleData.LoanType = "LightReachLease0.0"
		saleData.Source = "Parker and Sons"
		saleData.Partner = "LightReach"
		saleData.ContractTotal = 40056.25
	case "OUR19020":
		saleData.Type = "LOAN"
		saleData.LoanType = "LF-SN-LOAN-25Y-8.99"
		saleData.Source = "Parker and Sons"
	case "OUR19045":
		saleData.Source = "Parker and Sons"
		saleData.Partner = "LightReach"
		saleData.Type = "LEASE"
		saleData.LoanType = "LightReachLease0.0"
	case "OUR19088":
		saleData.Type = "LEASE 1.9"
		saleData.LoanType = "LEASE-SOVA-1.9"
		saleData.Source = "Parker and Sons"
	case "OUR19086":
		saleData.Type = "LOAN"
		saleData.LoanType = "LF-DIV-LOAN-25y-6.99"
		saleData.Source = "Parker and Sons"
		saleData.Partner = "Dividend"
	}
}
