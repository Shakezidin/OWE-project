/**************************************************************************
 * File            : dlrPayInitCalc.go
 * DESCRIPTION     : This file contains functions to perform
 *							Calculations for DealerPay
 * DATE            : 28-April-2024
 **************************************************************************/

package arcalc

import (
	common "OWEApp/owehub-calc/common"
	dataMgmt "OWEApp/owehub-calc/dataMgmt"
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
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

	for _, saleData := range dataMgmt.SaleData.SaleDataList {
		var dlrPayData map[string]interface{}
		dlrPayData, err = CalculateDlrPayProject(saleData)
		if err != nil || dlrPayData == nil {
			if len(saleData.UniqueId) <= 0 {
				log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data for unique id : %+v err: %+v", saleData.UniqueId, err)
			} else {
				log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data err : %+v", err)
			}
		} else {
			dlrPayDataList = append(dlrPayDataList, dlrPayData)
		}
	}
	/* Update Calculated and Fetched data AR.Data Table */
	err = db.AddMultipleRecordInDB(db.OweHubDbIndex, db.TableName_DLR_PAY_APCALC, dlrPayDataList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to insert initial AR Data in DB err: %v", err)
	}

	resultChan <- "SUCCESS"
}

/******************************************************************************
 * FUNCTION:        CalculateDlrPayProject
 * DESCRIPTION:     calculate the calculated data for DLR Pay
 * RETURNS:        	outData
 *****************************************************************************/
func CalculateDlrPayProject(saleData dataMgmt.SaleDataStruct) (outData map[string]interface{}, err error) {
	var (
		status       string
		contractCalc float64
		epcCalc      float64
	
		payRateSemi  interface{}
		addr         interface{}
		loanFee      float64
		referral     float64
		rebate      float64
		//credit       float64
	)

	log.EnterFn(0, "CalculateDlrPayProject")
	defer func() { log.ExitFn(0, "CalculateDlrPayProject", err) }()

	outData = make(map[string]interface{})
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
	contractCalc = common.CalculateContractAmount(saleData.NetEpc, outData["contract"].(float64), outData["sys_size"].(float64))
	epcCalc = common.CalculateEPCCalc(contractCalc, saleData.WC1, saleData.NetEpc, saleData.SystemSize, common.DlrPayWc1FilterDate)
	//credit = dataMgmt.DealerCreditCfg.CalculateCreaditForUniqueId(saleData.Dealer, saleData.UniqueId)



	arValue := "1000"

	adderData := map[string]int{
		"G3": 10,
		"G4": 20,
		"G5": 30,
	}

	payRateSemi = common.CalculatePayRateSemi(epcCalc, arValue)
	addr = common.CalculateADDR(saleData.UniqueId, adderData)
	loanFee = common.CalculateExpense(saleData.UniqueId, adderData)
	rebate = common.CalculateAutoAddr(saleData.UniqueId, LoanFeeAdder)
	referral = common.CalculateLoanFee(saleData.UniqueId, rebateData)
	referral = common.CalculateRebate(saleData.UniqueId, referralData)
	referral = common.CalculateReferral(saleData.UniqueId, adderData)

	// Saquib


	outData["status"] = status
	outData["contract_calc"] = contractCalc
	outData["epc_calc"] = epcCalc
	outData["pay_rate_semi"] = payRateSemi
	outData["addr"] = addr

	return outData, err
}
