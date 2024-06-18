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
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"encoding/json"
	"fmt"
	"os"
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
* RETURNS:         outData
*****************************************************************************/
func CalculateRepPayProject(saleData dataMgmt.SaleDataStruct) (outData map[string]interface{}, err error) {

	log.EnterFn(0, "CalculateARProject")
	defer func() { log.ExitFn(0, "CalculateARProject", err) }()

	outData = make(map[string]interface{})

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
	contractTotal := saleData.ContractTotal    //S (miss match)
	epc := (systemSize * 1000) / contractTotal //S
	homeOwner := saleData.HomeOwner            //H
	rep2 := saleData.SecondarySalesRep         //N
	pto := saleData.PtoDate                    //AG
	instSys := saleData.PvInstallCompletedDate //AD
	cancel := saleData.CancelledDate           //AC
	ntp := saleData.NtpDate                    //W
	permSub := saleData.PermitSubmittedDate    //X
	shaky := false                             //* confirm with shushank //AB
	types := ""                                //* not received from Colten yet //E
	kwh := 0.0                                 //* confirm with shushank //Q
	apptSetter := ""                           //* confirm with shushank //O
	commissionModels := "standard"

	//*==================== COMMON ==========================/
	statusDate := CalculateStatusDate(uniqueID, shaky, pto, instSys, cancel, ntp, permSub, wc)                                                    //AK
	perTeamKw := calculatePerTeamKw(rep1, rep2, wc, systemSize)                                                                                   //AW
	perRepKw := calculatePerRepKw(rep1, rep2, systemSize)                                                                                         //AN
	RepPerRepSales := calculatePerRepSales(rep1, rep2)                                                                                            //AM
	contractCalc := CalculateRepContractCalc(epc, contractTotal, systemSize)                                                                      //AP
	epcCalc := common.CalculateAREPCCalc(contractCalc, wc, epc, systemSize, common.ARWc1FilterDate)                                               //AQ
	RepDrawPercentage, repDrawMax, repPay := dataMgmt.PayScheduleCfg.CalculateRepDrawPerc(uniqueID, dealer, partner, installer, types, state, wc) //DH DI DJ
	payRate := dataMgmt.ApptSettersCfg.CalculatePayRate(apptSetter, wc)                                                                           //DC (O, U)
	loanFee := dataMgmt.SaleData.CalculateLoanFee(uniqueID, contractTotal)                                                                        //AR

	//*==================== REP 1 ==========================/
	rep1Referral := dataMgmt.ReferralDataConfig.CalculateRReferral(rep1, uniqueID, true)                                                                                      //BP
	rep1Rebate := dataMgmt.RebateCfg.CalculateRRebate(rep1, uniqueID, true)                                                                                                   //BO
	rep1Dba := dataMgmt.DBACfg.CalculateReprepDba(rep1)                                                                                                                       //AZ
	rep1Credit := dataMgmt.RepCreditCfg.CalculateRCredit(rep1, uniqueID)                                                                                                      //BI  there is no schema and get endpoint in main for repcredit
	rep1Addr := dataMgmt.AdderDataCfg.CalculateR1AddrResp(commissionModels, dealer, rep1, rep2, uniqueID, state, systemSize, true)                                            //BL
	rep1PayScale, rep1Position := dataMgmt.RepPayCfg.CalculateRPayScale(rep1, saleData.State, wc)                                                                             //BA //BB
	rep1Rl, rep1Rate := dataMgmt.CmmsnRatesCfg.CalculateRep1Rl(commissionModels, dealer, rep1, partner, installer, state, types, rep1PayScale, kwh, wc)                       //BC BD ! kwh, types value not set
	rep1Adjustment, rep1minRate, rep1maxRate := dataMgmt.RateAdjustmentsCfg.CalculateAdjustmentMinRateMaxRate(rep1PayScale, rep1Position)                                     //BE BF BG
	rep1R_R := calculateRR(rep1, rep1Rebate, rep1Referral)                                                                                                                    //BQ
	rep1Incentive := dataMgmt.RepIncentCfg.CalculateRepR1Incentive(rep1, wc)                                                                                                  //BH
	rep1AutoAdder := dataMgmt.AutoAdderCfg.CalculateRepRAutoAddr(rep1, rep2, uniqueID, state, systemSize, wc, true)                                                           //BM
	rep1LoanFee := dataMgmt.LoanFeeAdderCfg.CalculateRepRLoanFee(rep1, uniqueID, dealer, installer, state)                                                                    //BN                                                                                              //BN                                                                                                              //BN
	rep1AdderTotal := calculateR1AdderTotal(rep1, commissionModels, rep1Addr, rep1AutoAdder, rep1LoanFee, rep1Rebate, rep1Referral)                                           //BR (BL, BM, BN, BO, BP)
	rep1NetEpc := calculateR1NetEpc(perRepKw, contractCalc, rep1AdderTotal, rep1LoanFee, loanFee, systemSize)                                                                 //BU
	rep1payRateSemi := CalculateR1PayRateSemi(commissionModels, rep1, source, rep1Rl, rep1Rate, rep1Adjustment, rep1Incentive, epcCalc, systemSize, perRepKw, rep1NetEpc, wc) //BJ (BC, BD, BE, BH, AQ) (filed name in 8020 is project base cost)
	rep1AdderPerKw := calculateRAdderPerKw(rep1, rep1AdderTotal, perRepKw)                                                                                                    //BS (BR, AN)
	rep1PayRateSubTotal := calculateR1PayRateSubTotal(commissionModels, rep1, source, rep1payRateSemi, rep1AdderPerKw, rep1AdderTotal, contractCalc)                          //BT (BJ, BS)
	rep1MinOrMaxCorrect := calculateRMinOrMax(rep1, rep1PayRateSubTotal, rep1minRate, rep1maxRate)                                                                            //BV (BT, BF, BG)
	rep1CommTotal := calculateR1CommTotal(commissionModels, rep1, source, rep1MinOrMaxCorrect, perRepKw, rep1Credit, wc)                                                      //BW (BV, AN, BI)
	rep1CommStatusCheck := calculateR1CommStatudCheck(commissionModels, rep1, "Sales Rep 2", status, rep1CommTotal)                                                           //BX (DG, AJ, BW)
	rep1DrawAmount := calculateRDrawAmount(rep1CommStatusCheck, repDrawMax, RepPerRepSales, RepDrawPercentage)                                                                //DL
	rep1DrawPaid := dataMgmt.ApRepCfg.CalculateRepRDrawPaid(uniqueID, rep1)                                                                                                   //DM
	rep1CommPaid := dataMgmt.ApRepCfg.CalculateRepRCommPaid(uniqueID, rep1)                                                                                                   //DO
	rep1Balance := CalculateRepRBalance(rep1, rep1CommStatusCheck, rep1CommPaid)                                                                                              //DP

	//*==================== Appt ===========================/
	apptSetDba := dataMgmt.DBACfg.CalculateApptSetDba(apptSetter)                                                         //DB (O)
	apptSetTotal := calculateApptSetTotal(commissionModels, apptSetter, source, rep1CommStatusCheck, payRate, systemSize) //DD (O, D, BX, DC, P)
	apptSetStatusCheck := calculateApptSetStatusCheck(apptSetter, status, apptSetTotal)                                   //DE (O, AJ, DD)
	apptAmount := calculateApptAmount(commissionModels, apptSetStatusCheck, apptSetTotal)                                 //DX (DE)
	apptPaid := dataMgmt.ApRepCfg.CalculateApptPaid(apptSetter, uniqueID)                                                 //DY (O, G)
	apptBalance := calculateApptBalance(apptSetter, apptAmount, apptPaid)                                                 //DZ (O, DX, DY)

	//*==================== REP 2 ==========================/
	rep2Dba := dataMgmt.DBACfg.CalculateReprepDba(rep2)                                                                                   //CA
	rep2Referral := dataMgmt.ReferralDataConfig.CalculateRReferral(rep2, uniqueID, false)                                                 //CQ
	rep2Rebate := dataMgmt.RebateCfg.CalculateRRebate(rep2, uniqueID, false)                                                              //CP
	rep2R_R := calculateRR(rep2, rep2Rebate, rep2Referral)                                                                                //CR
	rep2LoanFee := dataMgmt.LoanFeeAdderCfg.CalculateRepRLoanFee(rep2, uniqueID, dealer, installer, state)                                //CO                                                                                              //BN                                                                                                              //BN
	rep2AutoAdder := dataMgmt.AutoAdderCfg.CalculateRepRAutoAddr(rep1, rep2, uniqueID, state, systemSize, wc, false)                      //CN
	rep2Addr := dataMgmt.AdderDataCfg.CalculateRAddrResp(dealer, rep1, rep2, uniqueID, state, systemSize, false)                          //CM
	rep2AdderTotal := calculateRAdderTotal(rep2, rep2Addr, rep2AutoAdder, rep2LoanFee, rep2Rebate, rep2Referral)                          //CS (N, CM, CN, CO, CP, CQ)
	rep2NetEpc := calculateRNetEpc(rep2, contractCalc, rep2AdderTotal, rep2LoanFee, loanFee, systemSize)                                  //CV
	rep2PayScale, rep2Position := dataMgmt.RepPayCfg.CalculateRPayScale(rep2, saleData.State, wc)                                         //CB CC
	rep2Incentive := dataMgmt.RepIncentCfg.CalculateRepR1Incentive(rep2, wc)                                                              //CI
	rep2Rl, rep2Rate := dataMgmt.CmmsnRatesCfg.CalculateRepRl(dealer, rep2, partner, installer, state, types, rep1PayScale, kwh, wc)      //CD CE ! kwh, types value not set
	rep2AdderPerKw := calculateRAdderPerKw(rep2, rep2AdderTotal, perRepKw)                                                                //CT (CS, AN)
	rep2Adjustment, rep2minRate, rep2maxRate := dataMgmt.RateAdjustmentsCfg.CalculateAdjustmentMinRateMaxRate(rep2PayScale, rep2Position) //CF CG CH
	rep2payRateSemi := CalculatePayRateSemi(rep2, rep2Rl, rep2Rate, rep2Adjustment, rep2Incentive, epcCalc)                               //CK (BC, BD, BE, BH, AQ)
	rep2PayRateSubTotal := calculateRPayRateSubTotal(rep2, rep2payRateSemi, rep2AdderPerKw)                                               //CU (CK, CT)
	rep2Credit := dataMgmt.RepCreditCfg.CalculateRCredit(rep2, uniqueID)                                                                  //CJ  there is no schema and get endpoint in main for repcredit
	rep2MinOrMax := calculateRMinOrMax(rep2, rep2PayRateSubTotal, rep2minRate, rep2maxRate)                                               //CW (BT, BF, BG)
	rep2CommTotal := calculateRCommTotal(rep2, "", rep2MinOrMax, perRepKw, rep2Credit)                                                    //CX (BV, AN, BI)
	rep2CommStatusCheck := calculateRCommStatudCheck(rep2, "", status, rep2CommTotal)                                                     //CY (DG, AJ, BW)
	rep2DrawAmount := calculateRDrawAmount(rep2CommStatusCheck, repDrawMax, RepPerRepSales, RepDrawPercentage)                            //DR
	rep2DrawPaid := dataMgmt.ApRepCfg.CalculateRepRDrawPaid(uniqueID, rep2)                                                               //DS
	rep2CommPaid := dataMgmt.ApRepCfg.CalculateRepRCommPaid(uniqueID, rep2)                                                               //DU
	rep2Balance := CalculateRepRBalance(rep2, rep2CommStatusCheck, rep2CommPaid)                                                          //DV

	//==================== OvrdCalc ==========================/
	rep1Team := dataMgmt.TeamDataCfg.CalculateRTeamName(rep1, wc)                                  //AS
	rep2Team := dataMgmt.TeamDataCfg.CalculateRTeamName(rep2, wc)                                  //AT (N, U)
	teamCount := calculateTeamCount(rep1Team, rep2Team)                                            //AU
	R2DmName, r2DmRate := dataMgmt.LeaderOverrideCfg.CalculateR2DmName(teamCount, rep2Team, wc)    //BP BQ (AT, AU, U)
	R2DmComm := calculateR2DmComm(R2DmName, r2DmRate, perTeamKw)                                   //BS (BP, BQ, AW)
	R2DmPaid := dataMgmt.ApRepCfg.CalculateR2DmPaid(R2DmName, uniqueID)                            //CL (BP, G,)
	R2DmBal := calculateR2DmBal(R2DmName, R2DmComm, R2DmPaid)                                      //CM (BP, BS, CL)
	r2DirName, r2DirRate := dataMgmt.LeaderOverrideCfg.CalculateR2DirName(teamCount, rep2Team, wc) //BT BU
	r2DirComm := calculateR2DirComm(r2DirName, r2DirRate, perTeamKw)                               //BW (BT,BU, AW)
	R2DirPaid := dataMgmt.ApRepCfg.CalculateR2DirPaid(r2DirName, uniqueID)                         //CO (BT, G)
	r2DirBal := calculateR2DirBal(r2DirName, r2DirComm, R2DirPaid)                                 //CP
	r2DmDba := dataMgmt.DBACfg.CalculateR2DmDba(R2DmName)                                          //BR
	r2DirDba := dataMgmt.DBACfg.CalculateR2DirDba(r2DirName)                                       //BV

	//*==================== AP-OTH ==========================/
	apOthPaidAmnt := dataMgmt.ApOthData.CalculatePaidAmount(uniqueID, "") //* what is payee corresponding value
	aptOthBalance := dataMgmt.ApOthData.CalculateBalance(uniqueID, "", apOthPaidAmnt)

	//*==================== AP-PDA ==========================/
	apPdaRcmdAmnt := dataMgmt.ApPdaData.GetApPdaRcmdAmount(uniqueID, "", rep1, rep2, rep1DrawAmount, rep2DrawAmount)
	apdPdaAmnt := dataMgmt.ApPdaData.GetApPdaAmount(uniqueID, "", apPdaRcmdAmnt)
	apdPdaPaidAmnt, apdPaidClawAmnt := dataMgmt.ApPdaData.GetApPdaPaidAmount(uniqueID, "")
	apdPdaPaidBalance, adpPdaDba := dataMgmt.ApPdaData.GetApPdaBalance(uniqueID, "", apdPdaPaidAmnt, apdPdaAmnt, apdPaidClawAmnt)

	//*==================== AP-ADV ==========================/
	apAdvRcmdAmnt := dataMgmt.ApAdvData.GetApAdvRcmdAmount(uniqueID, "", rep1, rep2, rep1DrawAmount, rep2DrawAmount)
	apdAdvAmnt := dataMgmt.ApAdvData.GetApAdvAmount(uniqueID, "", apAdvRcmdAmnt)
	apdAdvPaidAmnt := dataMgmt.ApAdvData.GetApAdvPaidAmount(uniqueID, "")
	apdAdvPaidBalance, adpAdvDba := dataMgmt.ApAdvData.GetApAdvBalance(uniqueID, "", apdAdvPaidAmnt, apdAdvAmnt)

	//*==================== AP-DED ==========================/
	apDedPaidAmnt := dataMgmt.ApDedData.GetApDedPaidAmount(uniqueID, "") //* what is payee corresponding value
	apDedBalance := dataMgmt.ApDedData.CalculateBalance(uniqueID, "", apDedPaidAmnt)

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
	outData["per_rep_sales"] = RepPerRepSales
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
	outData["appt_amount"] = apptAmount
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
	outData["rep)2_pay_scale"] = rep2PayScale
	outData["rep_2_position"] = rep2Position
	outData["rep_2_incentive"] = rep2Incentive
	outData["rep_2_rl"] = rep2Rl
	outData["reP-2_rate"] = rep2Rate
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
	outData["rep_1_team"] = rep1Team
	outData["rep_2_team"] = rep2Team
	outData["team_count"] = teamCount
	outData["r2_dm_name"] = R2DmName
	outData["r2_db_rate"] = r2DmRate
	outData["r2_dm_comm"] = R2DmComm
	outData["r2_dm_paid"] = R2DmPaid
	outData["r2_dm_bal"] = R2DmBal
	outData["r2_dir_name"] = r2DirName
	outData["r2_dir_rate"] = r2DirRate
	outData["r2_dir_comm"] = r2DirComm
	outData["r2_dir_bal"] = R2DirPaid
	outData["r2_dir_paid"] = r2DirBal
	outData["r2_dir_bal"] = r2DmDba
	outData["r2_dir_dba"] = r2DirDba
	outData["ap_oth_paid"] = apOthPaidAmnt
	outData["ap_oth_balance"] = aptOthBalance
	outData["ap_pda_rc_amnt"] = apPdaRcmdAmnt
	outData["ap_pda_amnt"] = apdPdaAmnt
	outData["ap_pda_paid_amnt"] = apdPdaPaidAmnt
	outData["ap_paid_claw_amnt"] = apdPaidClawAmnt
	outData["ap_pda_paid_balance"] = apdPdaPaidBalance
	outData["ap_pda_dba"] = adpPdaDba
	outData["ap_adv_rc_amnt"] = apAdvRcmdAmnt
	outData["ap_adv_amnt"] = apdAdvAmnt
	outData["ap_adv_paid_amnt"] = apdAdvPaidAmnt
	outData["ap_adv_paid_balance"] = apdAdvPaidBalance
	outData["ap_adv_dba"] = adpAdvDba
	outData["ap_ded_paid_amnt"] = apDedPaidAmnt
	outData["ap_ded_balance"] = apDedBalance

	mapToJson(outData, uniqueID, "outData")
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
