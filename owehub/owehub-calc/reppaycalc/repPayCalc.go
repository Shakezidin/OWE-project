/**************************************************************************
* File            : repPayCalc.go
* DESCRIPTION     : This file contains functions to perform
*                          Calculations for RepPay
* DATE            : 28-April-2024
**************************************************************************/

package arcalc

import (
	common "OWEApp/owehub-calc/common"
	dataMgmt "OWEApp/owehub-calc/dataMgmt"
	"OWEApp/shared/db"
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
		err               error
		repPayCalcList    []map[string]interface{}
		oldrepPayCalcList []map[string]interface{}
	)
	log.EnterFn(0, "ExecRepPayInitialCalculation")
	defer func() { log.ExitFn(0, "ExecRepPayInitialCalculation", err) }()
	date1, _ := time.Parse("01-02-2006", "01-01-2016")
	date2, _ := time.Parse("01-02-2006", "01-01-2023")

	for _, saleData := range dataMgmt.SaleData.SaleDataList {
		var repPayCalc map[string]interface{}
		log.FuncErrorTrace(0, "saleData.UniuqeId : %v, saleData.RepPay : %v, saleData.contractDate: %v", saleData.UniqueId, saleData.RepPay, saleData.ContractDate)
		saleData.RepPay = "YES" //for calculating reppay we need type, that's y I hardcoded this
		if len(saleData.UniqueId) > 0 && (saleData.RepPay == "YES" || saleData.RepPay == "Rep Pay") && saleData.ContractDate.After(date2) {
			repPayCalc, err = CalculateRepPayProject(saleData)
			if err != nil || repPayCalc == nil {
				if len(saleData.UniqueId) > 0 {
					log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data for unique id : %+v err: %+v", saleData.UniqueId, err)
				} else {
					log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data err : %+v", err)
				}
			} else {
				repPayCalcList = append(repPayCalcList, repPayCalc)
			}
		} else if len(saleData.UniqueId) > 0 && (saleData.RepPay == "YES" || saleData.RepPay == "Rep Pay") && saleData.ContractDate.After(date1) {
			repPayCalc, err = CalculateOldRepPayProject(saleData)
			if err != nil || repPayCalc == nil {
				if len(saleData.UniqueId) > 0 {
					log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data for unique id : %+v err: %+v", saleData.UniqueId, err)
				} else {
					log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data err : %+v", err)
				}
			} else {
				oldrepPayCalcList = append(oldrepPayCalcList, repPayCalc)
			}
		}
	}
	log.FuncErrorTrace(0, "data := %v", repPayCalcList)
	/* Update Calculated and Fetched data PR.Data Table */
	err = db.AddMultipleRecordInDB(db.OweHubDbIndex, db.TableName_REP_PAY_APCALC, repPayCalcList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to insert initial rep_pay_cal_standard Data in DB err, because there is no schema right now: %v", err)
	}

	/* Update Calculated and Fetched data PR.Data Table */
	err = db.AddMultipleRecordInDB(db.OweHubDbIndex, db.TableName_REP_PAY_APCALC_OVRD, oldrepPayCalcList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to insert initial rep_pay_cal_ovrrd_standard Data in DB err, because there is no schema right now: %v", err)
	}

	resultChan <- "SUCCESS"
}

/******************************************************************************
* FUNCTION:        CalculateARProject
* DESCRIPTION:     calculate the calculated data for ARCalc
* RETURNS:         outData
*****************************************************************************/
func CalculateRepPayProject(saleData dataMgmt.SaleDataStruct) (outData map[string]interface{}, err error) {

	log.EnterFn(0, "CalculateARProject")
	defer func() { log.ExitFn(0, "CalculateARProject", err) }()

	outData = make(map[string]interface{})
	var shaky bool

	status := saleData.ProjectStatus           //AJ
	rep1 := saleData.PrimarySalesRep           //M
	dealer := saleData.Dealer                  //A
	source := saleData.Source                  //D
	uniqueID := saleData.UniqueId              //G
	systemSize := saleData.SystemSize          //P
	partner := saleData.Partner                //B
	installer := saleData.Installer            //C
	loanType := saleData.LoanType              //F
	state := saleData.State                    //K
	wc := saleData.ContractDate                //U
	contractTotal := saleData.ContractTotal    //R (miss match)
	epc := (systemSize * 1000) / contractTotal //S
	homeOwner := saleData.HomeOwner            //H
	rep2 := saleData.SecondarySalesRep         //N
	pto := saleData.PtoDate                    //AG
	instSys := saleData.PvInstallCompletedDate //AD
	cancel := saleData.CancelledDate           //AC
	ntp := saleData.NtpDate                    //W
	permSub := saleData.PermitSubmittedDate    //X
	if status == "HOLD" || status == "CANCEL" {
		shaky = true
	} else {
		shaky = false
	} //* confirm with shushank //AB
	types := ""                                //* not received from Colten yet //E
	kwh := (systemSize * 1000) / contractTotal //* confirm with shushank //Q
	apptSetter := saleData.Setter              //* confirm with shushank //O
	commissionModels := "standard"             //* confirm with sushank

	log.FuncFuncTrace(0, "Zidhin status(AJ): %v, rep1(M): %v, dealer(A): %v", status, rep1, dealer)
	log.FuncFuncTrace(0, "Zidhin source  (D): %v, uniqueId (G): %v systemSize (P): %v", source, uniqueID, systemSize)
	log.FuncFuncTrace(0, "Zidhin partner (B): %v, installer (C): %v loanType (F): %v", partner, installer, loanType)
	log.FuncFuncTrace(0, "Zidhin state (K): %v, wc (U): %v contracttotal (R): %v", state, wc, contractTotal)
	log.FuncFuncTrace(0, "Zidhin epc (S): %v, homeOwner (H): %v rep2 (N): %v", epc, homeOwner, rep2)
	log.FuncFuncTrace(0, "Zidhin pto (AG): %v, instSys (AD): %v cancel (AC): %v", pto, instSys, cancel)
	log.FuncFuncTrace(0, "Zidhin ntp (W): %v, pemsub: %v shaky: %v, setter : %v", ntp, permSub, shaky, apptSetter)

	status = "PTO"                                 //AJ
	rep1 = "Nate Brammer"                          //M
	dealer = "OWE-JG"                              //A
	source = "REP"                                 //D
	uniqueID = "OUR22410"                          //G
	systemSize = 10.4                              //P
	partner = "LightReach"                         //B
	installer = "One World Energy"                 //C
	loanType = "LightReachLease1.99"               //F
	state = "AZ :: Arizona"                        //K
	wc, _ = time.Parse("01-02-2006", "04-01-2024") //U
	contractTotal = 35672                          //S (miss match)
	epc = (systemSize * 1000) / contractTotal      //S
	log.FuncErrorTrace(0, "epc = %v", epc)
	homeOwner = "Lucas Brubaker"                        //H
	rep2 = "Adrian Bonham"                              //N
	pto, _ = time.Parse("01-02-2006", "05-10-2024")     //AG
	instSys, _ = time.Parse("01-02-2006", "04-23-2024") //AD
	cancel = time.Time{}                                //AC
	ntp, _ = time.Parse("01-02-2006", "04-09-2024")     //W
	permSub, _ = time.Parse("01-02-2006", "04-12-2024") //X
	if status == "HOLD" || status == "CANCEL" {
		shaky = true
	} else {
		shaky = false
	} //* confirm with shushank //AB
	types = "LEASE"                           //* not received from Colten yet //E
	kwh = (systemSize * 1000) / contractTotal //Q
	apptSetter = ""                           //O
	payee := ""                               //confirm with sushank

	//*==================== COMMON ==========================/
	salesRepType := CalculateSalesRepType(uniqueID, rep1, rep2)                                                                                                     //DG need to confirm with sushank
	statusDate := CalculateStatusDate(uniqueID, shaky, pto, instSys, cancel, ntp, permSub, wc)                                                                      //AK
	perTeamKw := calculatePerTeamKw(rep1, rep2, wc, systemSize)                                                                                                     //AW
	perRepKw := calculatePerRepKw(rep1, rep2, systemSize)                                                                                                           //AN
	RepPerRepSales := calculatePerRepSales(rep1, rep2)                                                                                                              //AM
	contractCalc := CalculateRepContractCalc(epc, contractTotal, systemSize)                                                                                        //AP
	epcCalc := common.CalculateAREPCCalc(contractCalc, wc, epc, systemSize, common.ARWc1FilterDate)                                                                 //AQ
	RepDrawPercentage, repDrawMax, repPay, commissionModels := dataMgmt.PayScheduleCfg.CalculateRepDrawPerc(uniqueID, dealer, partner, installer, types, state, wc) //DH DI DJ
	RepDrawPercentage = 50
	repDrawMax = 2000
	repPay = "YES"
	payRate := dataMgmt.ApptSettersCfg.CalculatePayRate(apptSetter, wc)                                            //DC (O, U)
	loanFee := dataMgmt.SaleData.CalculateLoanFee(uniqueID, dealer, installer, state, loanType, contractTotal, wc) //AR

	commissionModels = "standard"
	//*==================== REP 1 ==========================/
	rep1Referral := dataMgmt.ReferralDataConfig.CalculateRReferral(rep1, uniqueID, rep1, rep2, state, wc, true)                                                               //BP (mistake)
	rep1Rebate := dataMgmt.RebateCfg.CalculateRRebate(rep1, rep2, state, uniqueID, true)                                                                                      //BO
	rep1Dba := dataMgmt.DBACfg.CalculateReprepDba(rep1)                                                                                                                       //AZ
	rep1Credit := dataMgmt.RepCreditCfg.CalculateRCredit(rep1, uniqueID)                                                                                                      //BI  there is no schema and get endpoint in main for repcredit
	rep1Addr := dataMgmt.AdderDataCfg.CalculateR1AddrResp(commissionModels, dealer, rep1, rep2, uniqueID, state, systemSize, true)                                            //BL
	rep1PayScale, rep1Position := dataMgmt.RepPayCfg.CalculateRPayScale(rep1, state, wc)                                                                                      //BA //BB
	rep1Rl, rep1Rate := dataMgmt.CmmsnRatesCfg.CalculateRep1Rl(commissionModels, dealer, rep1, partner, installer, state, types, rep1PayScale, kwh, wc)                       //BC BD
	rep1Adjustment, rep1minRate, rep1maxRate := dataMgmt.RateAdjustmentsCfg.CalculateAdjustmentMinRateMaxRate(rep1PayScale, rep1Position)                                     //BE BF BG
	rep1R_R := calculateRR(rep1, rep1Rebate, rep1Referral)                                                                                                                    //BQ
	rep1Incentive := dataMgmt.RepIncentCfg.CalculateRepR1Incentive(rep1, wc)                                                                                                  //BH
	rep1AutoAdder := dataMgmt.AutoAdderCfg.CalculateRepRAutoAddr(rep1, rep2, uniqueID, state, types, systemSize, wc, true)                                                    //BM(mistake)
	rep1LoanFee := dataMgmt.LoanFeeAdderCfg.CalculateRepRLoanFee(rep1, uniqueID, dealer, installer, state, rep1, rep2, systemSize)                                            //BN
	rep1AdderTotal := calculateR1AdderTotal(rep1, commissionModels, rep1Addr, rep1AutoAdder, rep1LoanFee, rep1Rebate, rep1Referral)                                           //BR (BL, BM, BN, BO, BP)
	rep1NetEpc := calculateR1NetEpc(perRepKw, contractCalc, rep1AdderTotal, rep1LoanFee, loanFee, systemSize)                                                                 //BU
	rep1payRateSemi := CalculateR1PayRateSemi(commissionModels, rep1, source, rep1Rl, rep1Rate, rep1Adjustment, rep1Incentive, epcCalc, systemSize, perRepKw, rep1NetEpc, wc) //BJ (BC, BD, BE, BH, AQ) (filed name in 8020 is project base cost)
	rep1AdderPerKw := calculateRAdderPerKw(rep1, rep1AdderTotal, perRepKw)                                                                                                    //BS (BR, AN)
	rep1PayRateSubTotal := calculateR1PayRateSubTotal(commissionModels, rep1, source, rep1payRateSemi, rep1AdderPerKw, rep1AdderTotal, contractCalc)                          //BT (BJ, BS)
	rep1MinOrMaxCorrect := calculateRMinOrMax(rep1, rep1PayRateSubTotal, rep1minRate, rep1maxRate)                                                                            //BV (BT, BF, BG)
	rep1CommTotal := calculateR1CommTotal(commissionModels, rep1, source, rep1MinOrMaxCorrect, perRepKw, rep1Credit, wc)                                                      //BW (BV, AN, BI)
	rep1CommStatusCheck := calculateR1CommStatudCheck(commissionModels, rep1, salesRepType, status, rep1CommTotal)                                                            //BX (DG, AJ, BW)
	rep1DrawAmount := calculateRDrawAmount(rep1CommStatusCheck, repDrawMax, RepPerRepSales, RepDrawPercentage)                                                                //DL
	rep1DrawPaid := dataMgmt.ApRepCfg.CalculateRepRDrawPaid(uniqueID, rep1)                                                                                                   //DM
	rep1CommPaid := dataMgmt.ApRepCfg.CalculateRepRCommPaid(uniqueID, rep1)                                                                                                   //DO
	rep1Balance := CalculateRepRBalance(rep1, rep1CommStatusCheck, rep1CommPaid)                                                                                              //DP

	log.FuncFuncTrace(0, "Zidhin statusDate(AK): %v, perteamKw (AW): %v", statusDate, perTeamKw)
	log.FuncFuncTrace(0, "Zidhin perrepkw (AN): %v, perrepsales (AM): %v, contractcalc (AP): %v", perRepKw, RepPerRepSales, contractCalc)
	log.FuncFuncTrace(0, "Zidhin epcCalc (AQ): %v , RepDrawPercentage (DH): %v, repdrawMax (DI): %v", epcCalc, RepDrawPercentage, repDrawMax)
	log.FuncFuncTrace(0, "Zidhin repPay (DJ): %v , payRate (DC): %v, LoanFee (AR): %v", repPay, payRate, loanFee)
	log.FuncFuncTrace(0, "Zidhin rep1Referral (BP): %v, rep1Rebate (BO): %v rep1Dba (AZ): %v", rep1Referral, rep1Rebate, rep1Dba)
	log.FuncFuncTrace(0, "Zidhin rep1Credit (BI): %v, rep1Addr (BL): %v rep1PayScale (BA): %v", rep1Credit, rep1Addr, rep1PayScale)
	log.FuncFuncTrace(0, "Zidhin rep1Position (BB): %v, rep1Rl (BC): %v, rep1Rate (BD): %v", rep1Position, rep1Rl, rep1Rate)
	log.FuncFuncTrace(0, "Zidhin rep1Adjustment (BE): %v rep1minRate (BF): %v, rep1maxRate (BG): %v", rep1Adjustment, rep1minRate, rep1maxRate)
	log.FuncFuncTrace(0, "Zidhin rep1R_R (BQ): %v rep1Incentive (BH): %v, rep1AutoAdder (BM): %v", rep1R_R, rep1Incentive, rep1AutoAdder)
	log.FuncFuncTrace(0, "Zidhin rep1LoanFee (BN): %v, rep1AdderTotal (BR): %v rep1NetEpc (BU): %v", rep1LoanFee, rep1AdderTotal, rep1NetEpc)
	log.FuncFuncTrace(0, "Zidhin rep1payRateSemi (BJ): %v, rep1AdderPerKw (BS): %v rep1PayRateSubTotal (BT): %v", rep1payRateSemi, rep1AdderPerKw, rep1PayRateSubTotal)
	log.FuncFuncTrace(0, "Zidhin rep1MinOrMaxCorrect (BV): %v rep1CommTotal (BW): %v, rep1CommStatusCheck (BX): %v", rep1MinOrMaxCorrect, rep1CommTotal, rep1CommStatusCheck)
	log.FuncFuncTrace(0, "Zidhin rep1DrawAmount (DL): %v rep1DrawPaid (DM): %v rep1CommPaid (DO): %v, rep1Balance (DP): %v", rep1DrawAmount, rep1DrawPaid, rep1CommPaid, rep1Balance)

	//*==================== Appt ===========================/
	apptSetDba := dataMgmt.DBACfg.CalculateApptSetDba(apptSetter)                                                         //DB (O)
	apptSetTotal := calculateApptSetTotal(commissionModels, apptSetter, source, rep1CommStatusCheck, payRate, systemSize) //DD (O, D, BX, DC, P)
	apptSetStatusCheck := calculateApptSetStatusCheck(apptSetter, status, apptSetTotal)                                   //DE (O, AJ, DD)
	apptAmount := calculateApptAmount(commissionModels, apptSetStatusCheck, apptSetTotal)                                 //DX (DE)
	apptPaid := dataMgmt.ApRepCfg.CalculateApptPaid(apptSetter, uniqueID)                                                 //DY (O, G)
	apptBalance := calculateApptBalance(apptSetter, apptAmount, apptPaid)                                                 //DZ (O, DX, DY)

	log.FuncFuncTrace(0, "Zidhin apptSetDba (DB): %v, apptSetTotal (DD): %v, apptSetStatusCheck (DE): %v", apptSetDba, apptSetTotal, apptSetStatusCheck)
	log.FuncFuncTrace(0, "Zidhin apptAmount (DX): %v, apptPaid (DY): %v apptBalance (DZ): %v", apptAmount, apptPaid, apptBalance)

	//*==================== REP 2 ==========================/
	rep2Dba := dataMgmt.DBACfg.CalculateReprepDba(rep2)                                                                                   //CA
	rep2Referral := dataMgmt.ReferralDataConfig.CalculateRReferral(rep2, uniqueID, rep1, rep2, state, wc, false)                          //CQ(mistake)
	rep2Rebate := dataMgmt.RebateCfg.CalculateRRebate(rep1, rep2, state, uniqueID, false)                                                 //CP
	rep2R_R := calculateRR(rep2, rep2Rebate, rep2Referral)                                                                                //CR
	rep2LoanFee := dataMgmt.LoanFeeAdderCfg.CalculateRepRLoanFee(rep2, uniqueID, dealer, installer, state, rep1, rep2, systemSize)        //CO
	rep2AutoAdder := dataMgmt.AutoAdderCfg.CalculateRepRAutoAddr(rep1, rep2, uniqueID, state, types, systemSize, wc, false)               //CN(mistake)
	rep2Addr := dataMgmt.AdderDataCfg.CalculateRAddrResp(dealer, rep1, rep2, uniqueID, state, systemSize, false)                          //CM
	rep2AdderTotal := calculateRAdderTotal(rep2, rep2Addr, rep2AutoAdder, rep2LoanFee, rep2Rebate, rep2Referral)                          //CS (N, CM, CN, CO, CP, CQ)
	rep2NetEpc := calculateRNetEpc(rep2, contractCalc, rep2AdderTotal, rep2LoanFee, loanFee, systemSize)                                  //CV
	rep2PayScale, rep2Position := dataMgmt.RepPayCfg.CalculateRPayScale(rep2, saleData.State, wc)                                         //CB CC
	rep2Incentive := dataMgmt.RepIncentCfg.CalculateRepR1Incentive(rep2, wc)                                                              //CI
	rep2Rl, rep2Rate := dataMgmt.CmmsnRatesCfg.CalculateRepRl(rep2, partner, installer, state, types, rep1PayScale, kwh, wc)              //CD CE
	rep2AdderPerKw := calculateRAdderPerKw(rep2, rep2AdderTotal, perRepKw)                                                                //CT (CS, AN)
	rep2Adjustment, rep2minRate, rep2maxRate := dataMgmt.RateAdjustmentsCfg.CalculateAdjustmentMinRateMaxRate(rep2PayScale, rep2Position) //CF CG CH
	rep2payRateSemi := CalculatePayRateSemi(rep2, rep2Rl, rep2Rate, rep2Adjustment, rep2Incentive, epcCalc)                               //CK (BC, BD, BE, BH, AQ)
	rep2PayRateSubTotal := calculateRPayRateSubTotal(rep2, rep2payRateSemi, rep2AdderPerKw)                                               //CU (CK, CT)
	rep2Credit := dataMgmt.RepCreditCfg.CalculateRCredit(rep2, uniqueID)                                                                  //CJ
	rep2MinOrMax := calculateRMinOrMax(rep2, rep2PayRateSubTotal, rep2minRate, rep2maxRate)                                               //CW (BT, BF, BG)
	rep2CommTotal := calculateR2CommTotal(rep2, "", rep2MinOrMax, perRepKw, rep2Credit)                                                   //CX (BV, AN, BI)
	rep2CommStatusCheck := calculateRCommStatudCheck(rep2, "", status, rep2CommTotal)                                                     //CY (DG, AJ, BW)
	rep2DrawAmount := calculateRDrawAmount(rep2CommStatusCheck, repDrawMax, RepPerRepSales, RepDrawPercentage)                            //DR
	rep2DrawPaid := dataMgmt.ApRepCfg.CalculateRepRDrawPaid(uniqueID, rep2)                                                               //DS
	rep2CommPaid := dataMgmt.ApRepCfg.CalculateRepRCommPaid(uniqueID, rep2)                                                               //DU
	rep2Balance := CalculateRepRBalance(rep2, rep2CommStatusCheck, rep2CommPaid)                                                          //DV

	log.FuncFuncTrace(0, "Zidhin rep2Dba (CA): %v, rep2Referral (CQ): %v, rep2Rebate (CP): %v", rep2Dba, rep2Referral, rep2Rebate)
	log.FuncFuncTrace(0, "Zidhin rep2R_R (CR): %v, rep2LoanFee (CO): %v rep2AutoAdder (CN): %v", rep2R_R, rep2LoanFee, rep2AutoAdder)
	log.FuncFuncTrace(0, "Zidhin rep2Addr (CM): %v, rep2AdderTotal (CS): %v rep2NetEpc (CV): %v", rep2Addr, rep2AdderTotal, rep2NetEpc)
	log.FuncFuncTrace(0, "Zidhin rep2PayScale (CB): %v, rep2Position (CC): %v rep2Incentive (CI): %v", rep2PayScale, rep2Position, rep2Incentive)
	log.FuncFuncTrace(0, "Zidhin rep2Rl (CD): %v, rep2Rate (CE): %v rep2AdderPerKw (CT) : %v", rep2Rl, rep2Rate, rep2AdderPerKw)
	log.FuncFuncTrace(0, "Zidhin rep2Adjustment (CF): %v, rep2minRate (CG): %v rep2maxRate (CH): %v", rep2Adjustment, rep2minRate, rep2maxRate)
	log.FuncFuncTrace(0, "Zidhin rep2payRateSemi (CK): %v, rep2PayRateSubTotal (CU): %v, rep2Credit (CJ): %v", rep2payRateSemi, rep2PayRateSubTotal, rep2Credit)
	log.FuncFuncTrace(0, "Zidhin rep2MinOrMax (CW): %v rep2CommTotal (CX): %v, rep2CommStatusCheck (CY): %v", rep2MinOrMax, rep2CommTotal, rep2CommStatusCheck)
	log.FuncFuncTrace(0, "Zidhin rep2DrawAmount (DR): %v rep2DrawPaid (DS): %v, rep2CommPaid (DU): %v", rep2DrawAmount, rep2DrawPaid, rep2CommPaid)
	log.FuncFuncTrace(0, "Zidhin rep2Balance (DV): %v", rep2Balance)

	//*==================== AP-OTH ==========================/
	apOthPaidAmnt := dataMgmt.ApOthData.CalculatePaidAmount(uniqueID, payee) //* what is payee corresponding value
	aptOthBalance := dataMgmt.ApOthData.CalculateBalance(uniqueID, payee, apOthPaidAmnt)

	//*==================== AP-PDA ==========================/
	log.FuncFuncTrace(0, "Zidhin + rep1DrawAmount: %v, rep2DrawAmount: %v", rep1DrawAmount, rep2DrawAmount)
	// rep1DrawAmount = 2000
	payee = saleData.PrimarySalesRep //* for now assigning payee as rep1, on what condition it should be rep2
	rep1 = saleData.PrimarySalesRep
	rep2 = saleData.SecondarySalesRep
	apPdaRcmdAmnt := dataMgmt.ApPdaData.GetApPdaRcmdAmount(uniqueID, payee, rep1, rep2, rep1DrawAmount, rep2DrawAmount)
	apdPdaAmnt := dataMgmt.ApPdaData.GetApPdaAmount(uniqueID, payee, apPdaRcmdAmnt)
	apdPdaPaidAmnt, apdPaidClawAmnt := dataMgmt.ApPdaData.GetApPdaPaidAmount(uniqueID, payee)
	apdPdaPaidBalance, adpPdaDba := dataMgmt.ApPdaData.GetApPdaBalance(uniqueID, payee, apdPdaPaidAmnt, apdPdaAmnt, apdPaidClawAmnt)

	log.FuncFuncTrace(0, "Zidhin + Payee: %v", payee)
	log.FuncFuncTrace(0, "Zidhin + apPdaRcmdAmnt: %v", apPdaRcmdAmnt)
	log.FuncFuncTrace(0, "Zidhin + apdPdaAmnt: %v", apdPdaAmnt)
	log.FuncFuncTrace(0, "Zidhin + apdPdaPaidAmnt: %v, apdPaidClawAmnt: %v", apdPdaPaidAmnt, apdPaidClawAmnt)
	log.FuncFuncTrace(0, "Zidhin + apdPdaPaidBalance: %v, adpPdaDba: %v", apdPdaPaidBalance, adpPdaDba)

	//*==================== AP-ADV ==========================/
	apAdvRcmdAmnt := dataMgmt.ApAdvData.GetApAdvRcmdAmount(uniqueID, payee, rep1, rep2, rep1DrawAmount, rep2DrawAmount)
	apdAdvAmnt := dataMgmt.ApAdvData.GetApAdvAmount(uniqueID, payee, apAdvRcmdAmnt)
	apdAdvPaidAmnt := dataMgmt.ApAdvData.GetApAdvPaidAmount(uniqueID, payee)
	apdAdvPaidBalance, adpAdvDba := dataMgmt.ApAdvData.GetApAdvBalance(uniqueID, payee, apdAdvPaidAmnt, apdAdvAmnt)

	log.FuncFuncTrace(0, "Zidhin + Payee: %v", payee)
	log.FuncFuncTrace(0, "Zidhin + apAdvRcmdAmnt: %v", apAdvRcmdAmnt)
	log.FuncFuncTrace(0, "Zidhin + apdAdvAmnt: %v", apdAdvAmnt)
	log.FuncFuncTrace(0, "Zidhin + apdAdvPaidAmnt: %v", apdAdvPaidAmnt)
	log.FuncFuncTrace(0, "Zidhin + apdAdvPaidBalance: %v, adpAdvDba: %v", apdAdvPaidBalance, adpAdvDba)

	//*==================== AP-DED ==========================/
	apDedPaidAmnt := dataMgmt.ApDedData.GetApDedPaidAmount(uniqueID, payee) //* what is payee corresponding value
	apDedBalance := dataMgmt.ApDedData.CalculateBalance(uniqueID, payee, apDedPaidAmnt)

	log.FuncFuncTrace(0, "Zidhin + apDedPaidAmnt: %v", apDedPaidAmnt)
	log.FuncFuncTrace(0, "Zidhin + apDedBalance: %v", apDedBalance)

	outData["status"] = status
	outData["rep_1"] = rep1
	outData["dealer"] = dealer
	outData["source"] = source
	outData["unique_id"] = uniqueID
	outData["system_size"] = systemSize
	outData["partner"] = partner
	outData["installer"] = installer
	outData["loan_type"] = loanType
	outData["state"] = state
	outData["wc"] = wc
	outData["contract_total"] = contractTotal
	outData["epc"] = epc
	outData["home_owner"] = homeOwner
	outData["rep_2"] = rep2
	outData["pto"] = pto
	outData["inst_sys"] = instSys
	outData["cancel"] = cancel
	outData["ntp"] = ntp
	outData["perm_sub"] = permSub
	outData["shaky"] = shaky
	outData["types"] = types
	outData["kwh"] = kwh
	outData["appt_setter"] = apptSetter
	outData["status_date"] = statusDate
	outData["per_team_kw"] = perTeamKw
	outData["per_rep_kw"] = perRepKw
	// outData["per_rep_sales"] = RepPerRepSales
	outData["contract_calc"] = contractCalc
	outData["epc_calc"] = epcCalc
	outData["rep_draw_percentage"] = RepDrawPercentage
	outData["rep_draw_max"] = repDrawMax
	outData["rep_pay"] = repPay
	outData["pay_rate"] = payRate
	outData["loan_fee"] = loanFee
	outData["rep_1_referral"] = rep1Referral
	outData["rep_1_rebate"] = rep1Rebate
	outData["rep_1_dba"] = rep1Dba
	outData["rep_1_credit"] = rep1Credit
	outData["rep_1_addr"] = rep1Addr
	outData["rep_1_pay_scale"] = rep1PayScale
	outData["rep_1_position"] = rep1Position
	outData["rep_1_rl"] = rep1Rl
	outData["rep_1_rate"] = rep1Rate
	outData["rep_1_adjustment"] = rep1Adjustment
	outData["rep_1_min_rate"] = rep1minRate
	outData["rep_1_max_rate"] = rep1maxRate
	outData["rep_1_rr"] = rep1R_R
	outData["rep_1_incentive"] = rep1Incentive
	outData["rep_1_pay_rate_semi"] = rep1payRateSemi
	outData["rep_1_auto_adder"] = rep1AutoAdder
	outData["rep_1_loan_fee"] = rep1LoanFee
	outData["rep_1_adder_total"] = rep1AdderTotal
	outData["rep_1_adder_per_kw"] = rep1AdderPerKw
	outData["rep_1_pay_rate_sub_total"] = rep1PayRateSubTotal
	outData["rep_1_min_or_max"] = rep1MinOrMaxCorrect
	outData["rep_1_comm_total"] = rep1CommTotal
	outData["rep_1_comm_status_check"] = rep1CommStatusCheck
	outData["rep_1_draw_amount"] = rep1DrawAmount
	outData["rep_1_draw_paid"] = rep1DrawPaid
	outData["rep_1_comm_paid"] = rep1CommPaid
	outData["rep_1_balance"] = rep1Balance
	outData["appt_set_dba"] = apptSetDba
	outData["appt_set_total"] = apptSetTotal
	outData["appt_set_status_check"] = apptSetStatusCheck
	outData["appt_amt"] = apptAmount
	outData["appt_paid"] = apptPaid
	outData["appt_balance"] = apptBalance
	outData["rep_2_dba"] = rep2Dba
	outData["rep_2_referral"] = rep2Referral
	outData["rep_2_rebate"] = rep2Rebate
	outData["rep_2_rr"] = rep2R_R
	outData["rep_2_loan_fee"] = rep2LoanFee
	outData["rep_2_auto_adder"] = rep2AutoAdder
	outData["rep_2_addr"] = rep2Addr
	outData["rep_2_adder_total"] = rep2AdderTotal
	outData["rep_2_net_epc"] = rep2NetEpc
	outData["rep_2_pay_scale"] = rep2PayScale
	outData["rep_2_position"] = rep2Position
	outData["rep_2_incentive"] = rep2Incentive
	outData["rep_2_rl"] = rep2Rl
	outData["rep_2_rate"] = rep2Rate
	outData["rep_2_adder_per_kw"] = rep2AdderPerKw
	outData["rep_2_adjustment"] = rep2Adjustment
	outData["rep_2_min_rate"] = rep2minRate
	outData["rep_2_max_rate"] = rep2maxRate
	outData["rep_2_pay_rate_semi"] = rep2payRateSemi
	outData["rep_2_pay_rate_sub_total"] = rep2PayRateSubTotal
	outData["rep_2_credit"] = rep2Credit
	outData["rep_2_min_or_max"] = rep2MinOrMax
	outData["rep_2_comm_total"] = rep2CommTotal
	outData["rep_2_comm_status_check"] = rep2CommStatusCheck
	outData["rep_2_draw_amount"] = rep2DrawAmount
	outData["rep_2_draw_paid"] = rep2DrawPaid
	outData["rep_2_comm_paid"] = rep2CommPaid
	outData["rep_2_balance"] = rep2Balance
	outData["ap_oth_paid"] = apOthPaidAmnt
	outData["ap_oth_balance"] = aptOthBalance
	outData["ap_oth_date"] = dataMgmt.ApOthData.GetDate(uniqueID)
	outData["ap_oth_payee"] = dataMgmt.ApOthData.GetPayee(uniqueID)
	outData["ap_pda_rc_amnt"] = apPdaRcmdAmnt
	outData["ap_pda_amnt"] = apdPdaAmnt
	outData["ap_pda_paid_amnt"] = apdPdaPaidAmnt
	outData["ap_pda_paid_amnt"] = apdPaidClawAmnt
	outData["ap_pda_paid_balance"] = apdPdaPaidBalance
	outData["ap_pda_dba"] = adpPdaDba
	outData["ap_pda_date"] = dataMgmt.ApPdaData.GetDate(uniqueID)
	outData["ap_pda_payee"] = dataMgmt.ApPdaData.GetPayee(uniqueID)
	outData["ap_adv_rc_amnt"] = apAdvRcmdAmnt
	outData["ap_adv_amnt"] = apdAdvAmnt
	outData["ap_adv_paid_amnt"] = apdAdvPaidAmnt
	outData["ap_adv_paid_balance"] = apdAdvPaidBalance
	outData["ap_adv_dba"] = adpAdvDba
	outData["ap_adv_date"] = dataMgmt.ApAdvData.GetDate(uniqueID)
	outData["ap_adv_payee"] = dataMgmt.ApAdvData.GetPayee(uniqueID)
	outData["ap_ded_paid_amnt"] = apDedPaidAmnt
	outData["ap_ded_balance"] = apDedBalance
	outData["ap_ded_date"] = dataMgmt.ApDedData.GetDate(uniqueID)
	outData["ap_ded_payee"] = dataMgmt.ApDedData.GetPayee(uniqueID)
	outData["commission_model"] = commissionModels
	outData["pr_r1_d_type"] = calculatePrRDType(dealer, rep1DrawAmount)
	outData["pr_r1_d_today"] = time.Now().Format("02-01-2006")
	outData["pr_r1_d_status"] = dataMgmt.RepNameConfig.CalculateStatus(rep1)
	outData["pr_r1_f_type"] = calculatePrRFType(dealer, rep1Balance)
	outData["pr_r1_f_today"] = time.Now().Format("02-01-2006")
	outData["pr_r1_f_status"] = dataMgmt.RepNameConfig.CalculateStatus(rep1)
	outData["pr_r1_b_type"] = calculatePrRBType(dealer)
	outData["pr_r1_b_today"] = time.Now().Format("02-01-2006")
	outData["pr_r1_b_status"] = dataMgmt.RepNameConfig.CalculateStatus(rep1)
	outData["pr_r2_d_type"] = calculatePrRDType(dealer, rep2DrawAmount)
	outData["pr_r2_d_today"] = time.Now().Format("02-01-2006")
	outData["pr_r2_d_status"] = dataMgmt.RepNameConfig.CalculateStatus(rep2)
	outData["pr_r2_f_type"] = calculatePrRFType(dealer, rep2Balance)
	outData["pr_r2_f_today"] = time.Now().Format("02-01-2006")
	outData["pr_r2_f_status"] = dataMgmt.RepNameConfig.CalculateStatus(rep2)
	outData["pr_r2_b_type"] = calculatePrRBType(dealer)
	outData["pr_r2_b_today"] = time.Now().Format("02-01-2006")
	outData["pr_r2_b_status"] = dataMgmt.RepNameConfig.CalculateStatus(rep2)
	outData["pr_appt_type"] = CalculateType(dealer, "Appt-Set")
	outData["pr_appt_today"] = time.Now().Format("02-01-2006")
	outData["pr_appt_status"] = dataMgmt.RepNameConfig.CalculateStatus(apptSetter)
	outData["pr_oth_type"] = CalculateType(uniqueID, "AP-OTHER")
	outData["pr_oth_today"] = time.Now().Format("02-01-2006")
	outData["pr_oth_status"] = dataMgmt.RepNameConfig.CalculateStatus(dataMgmt.ApOthData.GetPayee(uniqueID))
	outData["pr_pda_type"] = CalculateType(uniqueID, "AP-PDA")
	outData["pr_pda_today"] = time.Now().Format("02-01-2006")
	outData["pr_pda_status"] = dataMgmt.RepNameConfig.CalculateStatus(dataMgmt.ApPdaData.GetPayee(uniqueID))
	outData["pr_adv_type"] = CalculateType(uniqueID, "Advance")
	outData["pr_adv_today"] = time.Now().Format("02-01-2006")
	outData["pr_adv_status"] = dataMgmt.RepNameConfig.CalculateStatus(dataMgmt.ApAdvData.GetPayee(uniqueID))
	outData["pr_ded_type"] = CalculateType(uniqueID, "AP_DEDUCT")
	outData["pr_ded_today"] = time.Now().Format("02-01-2006")
	outData["pr_ded_status"] = dataMgmt.RepNameConfig.CalculateStatus(dataMgmt.ApDedData.GetPayee(uniqueID))

	mapToJson(outData, uniqueID, "outData")
	return outData, err
}

func CalculateOldRepPayProject(saleData dataMgmt.SaleDataStruct) (outData map[string]interface{}, err error) {
	log.EnterFn(0, "CalculateOldRepPayProject")
	defer func() { log.ExitFn(0, "CalculateOldRepPayProject", err) }()

	outData = make(map[string]interface{})
	var shaky bool

	dealer := saleData.Dealer                  //A
	homeOwner := saleData.HomeOwner            //H
	uniqueID := saleData.UniqueId              //G
	status := saleData.ProjectStatus           //AJ
	rep1 := saleData.PrimarySalesRep           //M
	source := saleData.Source                  //D
	systemSize := saleData.SystemSize          //P
	partner := saleData.Partner                //B
	installer := saleData.Installer            //C
	loanType := saleData.LoanType              //F
	state := saleData.State                    //K
	wc := saleData.ContractDate                //U
	contractTotal := saleData.ContractTotal    //R (miss match)
	epc := (systemSize * 1000) / contractTotal //S
	rep2 := saleData.SecondarySalesRep         //N
	pto := saleData.PtoDate                    //AG
	instSys := saleData.PvInstallCompletedDate //AD
	cancel := saleData.CancelledDate           //AC
	ntp := saleData.NtpDate                    //W
	permSub := saleData.PermitSubmittedDate    //X
	if status == "HOLD" || status == "CANCEL" {
		shaky = true
	} else {
		shaky = false
	} //* confirm with shushank //AB
	types := ""                                //* not received from Colten yet //E
	kwh := (systemSize * 1000) / contractTotal //* confirm with shushank //Q
	apptSetter := saleData.Setter              //* confirm with shushank //O

	//*==================== OvrdCalc ==========================/
	perTeamKw := calculatePerTeamKw(rep1, rep2, wc, systemSize)                                //AW
	rep1Team := dataMgmt.TeamDataCfg.CalculateRTeamName(rep1, wc)                              //AS
	rep2Team := dataMgmt.TeamDataCfg.CalculateRTeamName(rep2, wc)                              //AT (N, U)
	teamCount := calculateTeamCount(rep1Team, rep2Team)                                        //AU
	statusDate := CalculateStatusDate(uniqueID, shaky, pto, instSys, cancel, ntp, permSub, wc) //AK

	R1SlName, R1SlRate := dataMgmt.LeaderOverrideCfg.CalculateR1Name(rep1Team, "SL", wc) //AZ BA
	R1SlDBA := dataMgmt.DBACfg.CalculateR1DBA(R1SlName)                                  //BB
	R1SlComm := calculateR1Comm(R1SlName, R1SlRate, perTeamKw)                           //BC (AZ, BA, AW)
	R1SlPaid := dataMgmt.ApRepCfg.CalculateR1Paid(R1SlName, uniqueID, "SL-OVRD")         //BZ (AZ, G)
	R1SlBal := calculateR1Bal(R1SlName, R1SlComm, R1SlPaid)                              //CA (AZ, BC, BZ)

	R1DmName, R1DmRate := dataMgmt.LeaderOverrideCfg.CalculateR1Name(rep1Team, "DM", wc) //BD,BE
	R1DmDBA := dataMgmt.DBACfg.CalculateR2DBA(R1DmName)                                  //BF
	R1DmComm := calculateR1Comm(R1DmName, R1DmRate, perTeamKw)                           //BG
	R1DmPaid := dataMgmt.ApRepCfg.CalculateR1Paid(R1DmName, uniqueID, "DM-OVRD")         //CC
	R1DmBal := calculateR1Bal(R1DmName, R1DmComm, R1DmPaid)                              //CD (BD, BG, CC)

	R1DirName, R1DirRate := dataMgmt.LeaderOverrideCfg.CalculateR1Name(rep1Team, "DIR", wc) //BH BI
	R1DirDBA := dataMgmt.DBACfg.CalculateR1DBA(R1DirName)                                   //BJ
	R1DirComm := calculateR1Comm(R1DirName, R1DirRate, perTeamKw)                           //BK (BH, BI, AW)
	R1DirPaid := dataMgmt.ApRepCfg.CalculateR1SlPaid(R1DirName, uniqueID, "DIR-OVRD")       //CF
	R1DirBal := calculateR1Bal(R1DirName, R1DirComm, R1DirPaid)                             //CG (BH, BK, CF)

	R2SlName, R2SlRate := dataMgmt.LeaderOverrideCfg.CalculateR2Name(teamCount, rep2Team, "SL", wc) //BL, BM
	R2SlDBA := dataMgmt.DBACfg.CalculateR2DBA(R2SlName)                                             //BN
	R2SlComm := calculateR2Comm(R2SlName, R2SlRate, perTeamKw)                                      //BO
	R2SlPaid := dataMgmt.ApRepCfg.CalculateR2Paid(R2SlName, uniqueID, "SL-OVRD")                    //CI
	R2SlBal := calculateR2Bal(R2SlName, R2SlComm, R2SlPaid)                                         //CJ

	R2DmName, r2DmRate := dataMgmt.LeaderOverrideCfg.CalculateR2Name(teamCount, rep2Team, "DM", wc) //BP BQ (AT, AU, U)
	R2DmDBA := dataMgmt.DBACfg.CalculateR2DBA(R2DmName)                                             //BR
	R2DmComm := calculateR2Comm(R2DmName, r2DmRate, perTeamKw)                                      //BS (BP, BQ, AW)
	R2DmPaid := dataMgmt.ApRepCfg.CalculateR2Paid(R2DmName, uniqueID, "DM-OVRD")                    //CL (BP, G,)
	R2DmBal := calculateR2DmBal(R2DmName, R2DmComm, R2DmPaid)                                       //CM (BP, BS, CL)

	R2DirName, r2DirRate := dataMgmt.LeaderOverrideCfg.CalculateR2Name(teamCount, rep2Team, "DIR", wc) //BT BU
	R2DirDBA := dataMgmt.DBACfg.CalculateR2DBA(R2DirName)                                              //BV
	R2DirComm := calculateR2DirComm(R2DirName, r2DirRate, perTeamKw)                                   //BW (BT,BU, AW)
	R2DirPaid := dataMgmt.ApRepCfg.CalculateR2Paid(R2DirName, uniqueID, "DIR-OVRD")                    //CO (BT, G)
	R2DirBal := calculateR2Bal(R2DirName, R2DirComm, R2DirPaid)                                        //CP

	log.FuncFuncTrace(0, "Zidhin rep1Team (AS): %v, rep2Team (AT): %v, teamCount (AU): %v", rep1Team, rep2Team, teamCount)
	log.FuncFuncTrace(0, "Zidhin R2DmName (BP): %v, r2DmRate (BQ): %v, R2DmComm (BS): %v", R2DmName, r2DmRate, R2DmComm)
	log.FuncFuncTrace(0, "Zidhin R2DmPaid (CL): %v, R2DmBal (CM): %v, r2DirName (BT): %v", R2DmPaid, R2DmBal, R2DirName)
	log.FuncFuncTrace(0, "Zidhin r2DirRate(BU): %v, r2DirComm (BW): %v, R2DirPaid (CO): %v", R2DirComm, R2DirPaid, R2DirBal)
	log.FuncFuncTrace(0, "Zidhin r2DirBal (CP): %v, r2DmDba (BR): %v, r2DirDba (BV): %v", r2DirRate, R2DmDBA, R2DirDBA)

	outData["status"] = status
	outData["rep_1"] = rep1
	outData["dealer"] = dealer
	outData["source"] = source
	outData["unique_id"] = uniqueID
	outData["system_size"] = systemSize
	outData["partner"] = partner
	outData["installer"] = installer
	outData["loan_type"] = loanType
	outData["state"] = state
	outData["wc"] = wc
	outData["contract_total"] = contractTotal
	outData["epc"] = epc
	outData["home_owner"] = homeOwner
	outData["rep_2"] = rep2
	outData["pto"] = pto
	outData["inst_sys"] = instSys
	outData["cancel"] = cancel
	outData["ntp"] = ntp
	outData["perm_sub"] = permSub
	outData["shaky"] = shaky
	outData["types"] = types
	outData["kwh"] = kwh
	outData["appt_setter"] = apptSetter
	outData["per_team_kw"] = perTeamKw
	outData["rep_1_team"] = rep1Team
	outData["rep_2_team"] = rep2Team
	outData["team_count"] = teamCount
	outData["status_date"] = statusDate
	outData["r1_sl_name"] = R1SlName
	outData["r1_sl_rate"] = R1SlRate
	outData["r1_sl_dba"] = R1SlDBA
	outData["r1_sl_comm"] = R1SlComm
	outData["r1_sl_paid"] = R1SlPaid
	outData["r1_sl_bal"] = R1SlBal
	outData["r1_dm_name"] = R1DmName
	outData["r1_dm_rate"] = R1DmRate
	outData["r1_dm_dba"] = R1DmDBA
	outData["r1_dm_comm"] = R1DmComm
	outData["r1_dm_paid"] = R1DmPaid
	outData["r1_dm_bal"] = R1DmBal
	outData["r1_dir_name"] = R1DirName
	outData["r1_dir_rate"] = R1DirRate
	outData["r1_dir_dba"] = R1DirDBA
	outData["r1_dir_comm"] = R1DirComm
	outData["r1_dir_paid"] = R1DirPaid
	outData["r1_dir_bal"] = R1DirBal
	outData["r2_sl_name"] = R2SlName
	outData["r2_sl_rate"] = R2SlRate
	outData["r2_sl_dba"] = R2SlDBA
	outData["r2_sl_comm"] = R2SlComm
	outData["r2_sl_paid"] = R2SlPaid
	outData["r2_sl_bal"] = R2SlBal
	outData["r2_dm_name"] = R2DmName
	outData["r2_dm_rate"] = r2DmRate
	outData["r2_dm_dba"] = R2DmDBA
	outData["r2_dm_comm"] = R2DmComm
	outData["r2_dm_paid"] = R2DmPaid
	outData["r2_dm_bal"] = R2DmBal
	outData["r2_dir_name"] = R2DirName
	outData["r2_dir_rate"] = r2DirRate
	outData["r2_dir_dba"] = R2DirDBA
	outData["r2_dir_comm"] = R2DirComm
	outData["r2_dir_paid"] = R2DirPaid
	outData["r2_dir_bal"] = R2DirBal
	outData["pr_r1_sl_type"] = calculatePrRType(dealer, "SL-OVRD")
	outData["pr_r1_sl_today"] = time.Now().Format("02-01-2006")
	outData["pr_r1_sl_status"] = dataMgmt.RepNameConfig.CalculateStatus(R1SlName)
	outData["pr_r1_dm_type"] = calculatePrRType(dealer, "DM-OVRD")
	outData["pr_r1_dm_today"] = time.Now().Format("02-01-2006")
	outData["pr_r1_dm_status"] = dataMgmt.RepNameConfig.CalculateStatus(R1DmName)
	outData["pr_r1_dir_type"] = calculatePrRType(dealer, "DIR-OVRD")
	outData["pr_r1_dir_today"] = time.Now().Format("02-01-2006")
	outData["pr_r1_dir_status"] = dataMgmt.RepNameConfig.CalculateStatus(R1DirName)
	outData["pr_r2_sl_type"] = calculatePrRType(dealer, "SL-OVRD")
	outData["pr_r2_sl_today"] = time.Now().Format("02-01-2006")
	outData["pr_r2_sl_status"] = dataMgmt.RepNameConfig.CalculateStatus(R2SlName)
	outData["pr_r2_dm_type"] = calculatePrRType(dealer, "DM-OVRD")
	outData["pr_r2_dm_today"] = time.Now().Format("02-01-2006")
	outData["pr_r2_dm_status"] = dataMgmt.RepNameConfig.CalculateStatus(R2DmName)
	outData["pr_r2_dir_type"] = calculatePrRType(dealer, "DIR-OVRD")
	outData["pr_r2_dir_today"] = time.Now().Format("02-01-2006")
	outData["pr_r2_dir_status"] = dataMgmt.RepNameConfig.CalculateStatus(R2DirName)

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
