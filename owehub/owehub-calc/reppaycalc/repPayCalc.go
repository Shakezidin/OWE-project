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
		rep1Dba           string
		status            string
		rep1              string
		r1Balance         float64
		dealer            string
		uniqueID          string
		systemSize        float64
		partner           string
		installer         string
		state             string
		wc                time.Time
		loanFee           float64
		payRateSemi       float64
		epcCalc           float64
		rl                float64
		r1CommPaid        float64
		rep2              string
		perTeamKw         float64
		perRepKw          float64
		types             string
		repRl             float64
		repRate           float64
		payScale          string
		position          string
		kwh               float64
		R1Rebate          float64
		R1Referral        float64
		PayScale          string
		Position          string
		R1Credit          float64
		R1CommTotal       float64
		R1MinOrMax        float64
		PerRepKw          float64
		r1PayRateSubTotal float64
		r1AdderPerKw      float64
		repR1Addr         float64
		minRate           float64
		maxRate           float64
		adjustment        float64
		r1Incentive       float64
		r1AdderTotal      float64
		r1AutoAdder       float64
		r1LoanFee         float64
		loanType          string
		netEpc            float64
		contractTotal     float64
		homeOwner         string
		R1R_R             float64
		Adjustment        float64
		r1CommStatusCheck float64
		contractDate      time.Time
		epc               float64
		contractCalc      float64
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
	contractTotal = saleData.ContractTotal
	netEpc = contractTotal / (systemSize * 1000)
	epc = (systemSize * 1000) / contractTotal
	systemSize = saleData.SystemSize
	homeOwner = saleData.HomeOwner
	rep2 = saleData.SecondarySalesRep
	contractDate = saleData.ContractDate
	types = "" //* not received from Colten yet
	kwh = 0.0  //* confirm with shushank

	rep1Dba = dataMgmt.DBACfg.CalculateDBA(outData["rep_1"].(string))
	repR1Addr = dataMgmt.AdderDataCfg.CalculateR1AddrResp(dealer, rep1, rep2, uniqueID, state, systemSize)
	perTeamKw = calculatePerTeamKw(rep1, rep2, wc, systemSize)
	perRepKw = calculatePerRepKw(rep1, rep2, systemSize)
	repRl, repRate = dataMgmt.CmmsnRatesCfg.CalculateRepRl(partner, installer, state, types, payScale, kwh, wc)                  //! kwh, types value not set
	R1Rebate = dataMgmt.RebateCfg.CalculateR1Rebate(saleData.PrimarySalesRep, saleData.UniqueId)                                 //BO
	R1Referral = dataMgmt.ReferralDataConfig.CalculateR1Referral(saleData.PrimarySalesRep, saleData.UniqueId)                    //BP
	R1R_R = calculateR1RR(saleData.PrimarySalesRep, R1Rebate, R1Referral)                                                        //BQ
	PayScale, Position = dataMgmt.RepPayCfg.CalculateR1PayScale(saleData.PrimarySalesRep, saleData.State, saleData.ContractDate) //BA
	R1Credit = dataMgmt.RepCreditCfg.CalculateR1Credit(saleData.UniqueId)                                                        //BI  there is no schema and get endpoint in main for repcredit
	Adjustment, minRate, maxRate = dataMgmt.RateAdjustmentsCfg.CalculateAdjustmentMinRateMaxRate(PayScale, Position)             //BE BF BG
	r1Incentive = dataMgmt.RepIncentCfg.CalculateRepR1Incentive(rep1, wc)                                                        //BH
	contractCalc = CalculateRepContractCalc(epc, contractTotal, systemSize)
	epcCalc = common.CalculateAREPCCalc(contractCalc, contractDate, epc, systemSize, common.ARWc1FilterDate)           //AQ
	payRateSemi = CalculatePayRateSemi(saleData.PrimarySalesRep, repRl, repRate, adjustment, r1Incentive, epcCalc)              //BJ (BC, BD, BE, BH, AQ)
	r1AutoAdder = dataMgmt.AutoAdderCfg.CalculateRepR1AutoAddr(rep1, rep2, uniqueID, state, systemSize, wc)                                                                                                           //BM
	r1LoanFee = 0                                                                                                               //BN
	r1AdderTotal = calculateRAdderTotal(saleData.PrimarySalesRep, repR1Addr, r1AutoAdder, r1LoanFee, R1Rebate, R1Referral)      //BR (BL, BM, BN, BO, BP)
	r1AdderPerKw = calculateRAdderPerKw(saleData.PrimarySalesRep, r1AdderTotal, PerRepKw)                                       //BS (BR, AN)
	r1PayRateSubTotal = calculateR1PayRateSubTotal(saleData.PrimarySalesRep, payRateSemi, r1AdderPerKw)                         //BT (BJ, BS)
	R1MinOrMax = calculateR1MinOrMax(saleData.PrimarySalesRep, r1PayRateSubTotal, minRate, maxRate)                             //BV (BT, BF, BG)
	R1CommTotal = calculateR1CommTotal(saleData.PrimarySalesRep, saleData.Source, R1MinOrMax, PerRepKw, R1Credit)               //BW (BV, AN, BI)
	r1CommStatusCheck = calculateRCommStatudCheck(saleData.PrimarySalesRep, "Sales Rep 2", saleData.ProjectStatus, R1CommTotal) //BX (DG, AJ, BW)

	outData["rep_1_dba"] = rep1Dba
	outData["status"] = status
	outData["rep_1"] = rep1
	outData["r1_balance"] = r1Balance
	outData["r1_comm_paid"] = r1CommPaid
	outData["loan_fee"] = loanFee
	outData["r1_addr"] = repR1Addr
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
