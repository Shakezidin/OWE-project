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

	log.EnterFn(0, "CalculateARProject")
	defer func() { log.ExitFn(0, "CalculateARProject", err) }()

	outData = make(map[string]interface{})

	status := saleData.ProjectStatus
	rep1 := saleData.PrimarySalesRep
	dealer := saleData.Dealer
	source := saleData.Source
	uniqueID := saleData.UniqueId
	systemSize := saleData.SystemSize
	partner := saleData.Partner
	installer := saleData.Installer
	loanType := saleData.LoanType
	state := saleData.State
	wc := saleData.ContractDate
	contractTotal := saleData.ContractTotal
	epc := (systemSize * 1000) / contractTotal
	homeOwner := saleData.HomeOwner
	rep2 := saleData.SecondarySalesRep
	pto := saleData.PtoDate
	instSys := saleData.PvInstallCompletedDate
	cancel := saleData.CancelledDate
	ntp := saleData.NtpDate
	permSub := saleData.PermitSubmittedDate
	shaky := false //* confirm with shushank
	types := ""    //* not received from Colten yet
	kwh := 0.0     //* confirm with shushank
	loanFee := 0.0 //* yet to be calculated

	//==================== COMMON ==========================/
	statusDate := CalculateStatusDate(uniqueID, shaky, pto, instSys, cancel, ntp, permSub, wc)
	perTeamKw := calculatePerTeamKw(rep1, rep2, wc, systemSize)
	perRepKw := calculatePerRepKw(rep1, rep2, systemSize)
	RepPerRepSales := calculatePerRepSales(rep1, rep2)
	contractCalc := CalculateRepContractCalc(epc, contractTotal, systemSize)
	epcCalc := common.CalculateAREPCCalc(contractCalc, wc, epc, systemSize, common.ARWc1FilterDate)                                       //AQ
	RepDrawPercentage, repDrawMax := dataMgmt.PayScheduleCfg.CalculateRepDrawPerc(uniqueID, dealer, partner, installer, types, state, wc) //DH DI

	//==================== REP 1 ==========================/
	rep1Name := rep1
	rep1Referral := dataMgmt.ReferralDataConfig.CalculateRReferral(rep1, uniqueID, true) //BP
	rep1Rebate := dataMgmt.RebateCfg.CalculateRRebate(rep1, uniqueID, true)              //BO
	rep1Dba := dataMgmt.DBACfg.CalculateReprepDba(rep1)                                  // AZ
	rep1Credit := dataMgmt.RepCreditCfg.CalculateRCredit(rep1, uniqueID)                 //BI  there is no schema and get endpoint in main for repcredit
	rep1Addr := dataMgmt.AdderDataCfg.CalculateRAddrResp(dealer, rep1, rep2, uniqueID, state, systemSize, true)
	rep1PayScale, rep1Position := dataMgmt.RepPayCfg.CalculateRPayScale(rep1, saleData.State, wc)                                         //BA
	rep1Rl, rep1Rate := dataMgmt.CmmsnRatesCfg.CalculateRepRl(partner, installer, state, types, rep1PayScale, kwh, wc)                    //! kwh, types value not set
	rep1Adjustment, rep1minRate, rep1maxRate := dataMgmt.RateAdjustmentsCfg.CalculateAdjustmentMinRateMaxRate(rep1PayScale, rep1Position) //BE BF BG
	rep1R_R := calculateRR(rep1, rep1Rebate, rep1Referral)
	rep1Incentive := dataMgmt.RepIncentCfg.CalculateRepR1Incentive(rep1, wc)                                        //BH
	rep1payRateSemi := CalculatePayRateSemi(rep1, rep1Rl, rep1Rate, rep1Adjustment, rep1Incentive, epcCalc)         //BJ (BC, BD, BE, BH, AQ)
	rep1AutoAdder := dataMgmt.AutoAdderCfg.CalculateRepRAutoAddr(rep1, rep2, uniqueID, state, systemSize, wc, true) //BM
	rep1LoanFee := dataMgmt.LoanFeeAdderCfg.CalculateRepRLoanFee(rep1, uniqueID)                                    //BN                                                                                              //BN                                                                                                              //BN
	rep1AdderTotal := calculateRAdderTotal(rep1, rep1Addr, rep1AutoAdder, rep1LoanFee, rep1Rebate, rep1Referral)    //BR (BL, BM, BN, BO, BP)
	rep1AdderPerKw := calculateRAdderPerKw(rep1, rep1AdderTotal, perRepKw)                                          //BS (BR, AN)
	rep1PayRateSubTotal := calculateRPayRateSubTotal(rep1, rep1payRateSemi, rep1AdderPerKw)                         //BT (BJ, BS)
	rep1MinOrMax := calculateRMinOrMax(rep1, rep1PayRateSubTotal, rep1minRate, rep1maxRate)                         //BV (BT, BF, BG)
	rep1CommTotal := calculateRCommTotal(rep1, source, rep1MinOrMax, perRepKw, rep1Credit)                          //BW (BV, AN, BI)
	rep1CommStatusCheck := calculateRCommStatudCheck(rep1, "Sales Rep 2", status, rep1CommTotal)                    //BX (DG, AJ, BW)
	rep1DrawAmount := calculateRDrawAmount(rep1CommStatusCheck, repDrawMax, RepPerRepSales, RepDrawPercentage)      //DL
	rep1DrawPaid := dataMgmt.ApRepCfg.CalculateRepRDrawPaid(uniqueID, rep1)                                         //DM
	rep1CommPaid := dataMgmt.ApRepCfg.CalculateRepRCommPaid(uniqueID, rep1)
	rep1Balance := CalculateRepRBalance(rep1, rep1CommStatusCheck, rep1CommPaid)

	//==================== REP 2 ==========================/

	rep2Dba := dataMgmt.DBACfg.CalculateReprepDba(rep2)
	rep2Referral := dataMgmt.ReferralDataConfig.CalculateRReferral(rep2, uniqueID, false)
	rep2Rebate := dataMgmt.RebateCfg.CalculateRRebate(rep2, uniqueID, false)
	rep2R_R := calculateRR(rep2, rep2Rebate, rep2Referral)                                                           //BO
	rep2LoanFee := dataMgmt.LoanFeeAdderCfg.CalculateRepRLoanFee(rep2, uniqueID)                                     //BN                                                                                              //BN                                                                                                              //BN
	rep2AutoAdder := dataMgmt.AutoAdderCfg.CalculateRepRAutoAddr(rep1, rep2, uniqueID, state, systemSize, wc, false) //BM
	rep2Addr := dataMgmt.AdderDataCfg.CalculateRAddrResp(dealer, rep1, rep2, uniqueID, state, systemSize, false)
	rep2AdderTotal := calculateRAdderTotal(rep2, rep2Addr, rep2AutoAdder, rep2LoanFee, rep2Rebate, rep2Referral) //BR (BL, BM, BN, BO, BP)
	rep2NetEpc := calculateRNetEpc(rep2, contractCalc, rep2AdderTotal, rep2LoanFee, loanFee, systemSize)
	rep2PayScale, rep2Position := dataMgmt.RepPayCfg.CalculateRPayScale(rep2, saleData.State, wc)                                         //BA
	rep2Incentive := dataMgmt.RepIncentCfg.CalculateRepR1Incentive(rep2, wc)                                                              //BH
	rep2Rl, rep2Rate := dataMgmt.CmmsnRatesCfg.CalculateRepRl(partner, installer, state, types, rep1PayScale, kwh, wc)                    //! kwh, types value not set
	rep2AdderPerKw := calculateRAdderPerKw(rep2, rep2AdderTotal, perRepKw)                                                                //BS (BR, AN)
	rep2Adjustment, rep2minRate, rep2maxRate := dataMgmt.RateAdjustmentsCfg.CalculateAdjustmentMinRateMaxRate(rep2PayScale, rep2Position) //BE BF BG
	rep2payRateSemi := CalculatePayRateSemi(rep2, rep2Rl, rep2Rate, rep2Adjustment, rep2Incentive, epcCalc)                               //BJ (BC, BD, BE, BH, AQ)
	rep2PayRateSubTotal := calculateRPayRateSubTotal(rep2, rep2payRateSemi, rep2AdderPerKw)                                               //BT (BJ, BS)
	rep2Credit := dataMgmt.RepCreditCfg.CalculateRCredit(rep2, uniqueID)                                                                  //BI  there is no schema and get endpoint in main for repcredit
	rep2MinOrMax := calculateRMinOrMax(rep2, rep2PayRateSubTotal, rep2minRate, rep2maxRate)                                               //BV (BT, BF, BG)
	rep2CommTotal := calculateRCommTotal(rep2, "", rep2MinOrMax, perRepKw, rep2Credit)                                                    //BW (BV, AN, BI)
	rep2CommStatusCheck := calculateRCommStatudCheck(rep2, "", status, rep2CommTotal)                                                     //BX (DG, AJ, BW)
	rep2DrawAmount := calculateRDrawAmount(rep2CommStatusCheck, repDrawMax, RepPerRepSales, RepDrawPercentage)
	rep2DrawPaid := dataMgmt.ApRepCfg.CalculateRepRDrawPaid(uniqueID, rep2) //DL
	rep2CommPaid := dataMgmt.ApRepCfg.CalculateRepRCommPaid(uniqueID, rep2)
	rep2Balance := CalculateRepRBalance(rep2, rep2CommStatusCheck, rep2CommPaid)

	// outData["rep_1_dba"] = rep1Dba
	// outData["status"] = status
	// outData["rep_1"] = rep1
	// outData["r1_balance"] = r1Balance
	// outData["r1_comm_paid"] = r1CommPaid
	// outData["loan_fee"] = loanFee
	// outData["r1_addr"] = repR1Addr
	// outData["per_team_kw"] = perTeamKw
	// outData["rl"] = rl
	// outData["per_rep_kw"] = perRepKw
	// outData["rl"] = repRl
	// outData["rate"] = repRate
	// outData["position"] = position

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
