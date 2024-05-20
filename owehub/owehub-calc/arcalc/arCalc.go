/**************************************************************************
 * File            : arInitCalc.go
 * DESCRIPTION     : This file contains functions to perform
 *							Calculations for AR
 * DATE            : 28-April-2024
 **************************************************************************/

package arcalc

import (
	common "OWEApp/owehub-calc/common"
	dataMgmt "OWEApp/owehub-calc/dataMgmt"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"time"
)

/******************************************************************************
 * FUNCTION:            ExecArInitialCalculation
 * DESCRIPTION:        Execute initial calculations for AR
 * INPUT:                       N/A
 * RETURNS:             error
 *****************************************************************************/
func ExecArInitialCalculation(resultChan chan string) {
	var (
		err        error
		arDataList []map[string]interface{}
	)
	log.EnterFn(0, "ExecArInitialCalculation")
	defer func() { log.ExitFn(0, "ExecArInitialCalculation", err) }()

	for _, saleData := range dataMgmt.SaleData.SaleDataList {
		var arData map[string]interface{}
		arData, err = CalculateARProject(saleData)
		if err != nil || arData == nil {
			if len(saleData.UniqueId) <= 0 {
				log.FuncErrorTrace(0, "Failed to calculate AR Data for unique id : %+v err: %+v", saleData.UniqueId, err)
			} else {
				log.FuncErrorTrace(0, "Failed to calculate AR Data err : %+v", err)
			}
		} else {
			arDataList = append(arDataList, arData)
		}
	}
	/* Update Calculated and Fetched data AR.Data Table */
	err = db.AddMultipleRecordInDB(db.OweHubDbIndex, db.TableName_SalesArCalc, arDataList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to insert initial AR Data in DB err: %v", err)
	}

	resultChan <- "SUCCESS"
}

/******************************************************************************
 * FUNCTION:        CalculateARProject
 * DESCRIPTION:     calculate the calculated data for ARCalc
 * RETURNS:        	outData
 *****************************************************************************/
func CalculateARProject(saleData dataMgmt.SaleDataStruct) (outData map[string]interface{}, err error) {
	var (
		contractCalc float64
		epcCalc      float64
		grossRev     float64
		redLine      float64
		permitPayM1  float64
		installPayM2 float64
		permitMax    float64
		addrPtr      float64
		addrAuto     float64
		loanFee      float64
		adjust       float64
		netRev       float64
		status       string
		permitPay    float64
		installPay   float64
		reconcile    float64
		totalPaid    float64
		currentDue   float64
		balance      float64
	)
	log.EnterFn(0, "CalculateARProject")
	defer func() { log.ExitFn(0, "CalculateARProject", err) }()

	outData = make(map[string]interface{})
	//outData["serial_num"] = saleData.UniqueId
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
	/* Calculated Fields */
	status = saleData.ProjectStatus
	redLine, permitPayM1, permitMax, installPayM2 = dataMgmt.ArSkdConfig.GetArSkdForSaleData(&saleData)
	contractCalc = common.CalculateContractAmount(saleData.NetEpc, outData["contract"].(float64), outData["sys_size"].(float64))
	epcCalc = common.CalculateEPCCalc(contractCalc, saleData.WC1, saleData.NetEpc, saleData.SystemSize)
	grossRev = CalculateGrossRev(epcCalc, redLine, saleData.SystemSize)
	addrPtr = dataMgmt.AdderDataCfg.CalculateAddrPtr(saleData.Dealer, saleData.UniqueId)
	addrAuto = dataMgmt.AutoAdderCfg.CalculateAddrAuto(saleData.Dealer, saleData.UniqueId, saleData.SystemType)
	loanFee = dataMgmt.LoanFeeAdderCfg.CalculateLoanFee(saleData.Dealer, saleData.UniqueId)
	adjust = dataMgmt.AdjustmentsConfig.CalculateAdjust(saleData.Dealer, saleData.UniqueId)
	netRev = CalculateNetRev(grossRev, addrPtr, addrAuto, loanFee, adjust)
	permitPay = CalculatePermitPay(status, grossRev, netRev, permitPayM1, permitMax)
	installPay = common.CalculateInstallPay(status, grossRev, netRev, installPayM2, permitPay)
	reconcile = dataMgmt.ReconcileCfgData.CalculateReconcile(saleData.Dealer, saleData.UniqueId)
	totalPaid = dataMgmt.ArCfgData.GetTotalPaidForUniqueId(saleData.UniqueId)
	currentDue = CalculateCurrentDue(&saleData, netRev, totalPaid, permitPay, installPay, reconcile)
	balance = CalculateBalance(saleData.UniqueId, status, saleData.Dealer, totalPaid, netRev, reconcile)

	outData["status"] = status
	/*outData["status_date"] = common.CalculateProjectStatusDate(saleData.UniqueId, saleData.PtoDate, saleData.PvInstallCompletedDate,
	saleData.CancelledDate, saleData.PermitSubmittedDate, saleData.NtpDate, saleData.WC1)*/
	outData["contract_calc"] = contractCalc
	outData["loan_fee"] = loanFee
	outData["owe_ar"] = CalculateOweAR(outData["contract_calc"].(float64), outData["loan_fee"].(float64))
	outData["total_paid"] = totalPaid
	outData["epc_calc"] = epcCalc
	outData["gross_rev"] = grossRev
	outData["addr_ptr"] = addrPtr
	outData["addr_auto"] = addrAuto
	outData["adjustment"] = adjust
	outData["net_rev"] = netRev
	outData["permit_pay"] = permitPay
	outData["install_pay"] = installPay
	outData["reconcile"] = reconcile
	outData["current_due"] = currentDue
	outData["balance"] = balance

	return outData, err
}

/******************************************************************************
 * FUNCTION:        CalculateOweAR
 * DESCRIPTION:     calculates the "owe_ar" value based on the provided data
 * RETURNS:        owe ar
 *****************************************************************************/
func CalculateOweAR(contractCalc float64, loanFee float64) float64 {

	log.EnterFn(0, "CalculateOweAR")
	defer func() { log.ExitFn(0, "CalculateOweAR", nil) }()

	if contractCalc > 0.0 {
		if loanFee != 0.0 {
			/* Subtract loanFee from contractCalc */
			return contractCalc - loanFee
		}
	}
	/* Return 0 if Contract $$ Calc is empty or cannot be parsed */
	return 0
}

/******************************************************************************
 * FUNCTION:        CalculateOweAR
 * DESCRIPTION:     calculates the "gross_rev" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func CalculateGrossRev(epcCalc float64, redLine float64, systemSize float64) float64 {

	log.EnterFn(0, "CalculateGrossRev")
	defer func() { log.ExitFn(0, "CalculateGrossRev", nil) }()

	if epcCalc > 0.0 {
		if redLine > 0.0 {
			/* Calculate gross_rev */
			return (epcCalc - redLine) * 1000 * systemSize
		}
	}
	/* Return 0 if EPC Calc is empty or cannot be parsed */
	return 0
}

/******************************************************************************
 * FUNCTION:        CalculateNetRev
 * DESCRIPTION:     calculates the "net_rev" value based on the provided data
 * RETURNS:        Net revenue
 *****************************************************************************/
func CalculateNetRev(grossRev, addrPtr, autoAddr, loanFee, adjust float64) float64 {
	log.EnterFn(0, "CalculateNetRev")
	defer func() { log.ExitFn(0, "CalculateNetRev", nil) }()

	if grossRev > 0 {
		return common.Round(grossRev-addrPtr-autoAddr-loanFee+adjust, 2)
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        CalculatePermitPay
 * DESCRIPTION:     calculates the "permit_pay" value based on the provided data
 * RETURNS:        permit pay
 *****************************************************************************/
func CalculatePermitPay(status string, grossRev, netRev float64, permitPayM1 float64, permitMax float64) (permitPay float64) {
	log.EnterFn(0, "CalculatePermitPay")
	defer func() { log.ExitFn(0, "CalculatePermitPay", nil) }()

	permitPay = 0
	if status == string(common.Cancel) || status == string(common.Shaky) {
		return permitPay
	}
	if grossRev > 0.0 {
		if (permitPayM1 > 0.0) && (permitMax > 0.0) {
			if netRev*(permitPayM1) > permitMax {
				permitPay = common.Round(permitMax, 2)
			} else {
				permitPay = common.Round(netRev*(permitPayM1), 2)
			}
		}
	}
	return permitPay
}

/******************************************************************************
 * FUNCTION:        CalculatePTOPay
 * DESCRIPTION:      calculates the "pto_pay" value based on the provided data
 * RETURNS:        pto pay
 *****************************************************************************/
func CalculatePTOPay(status string, grossRev, netRev, ptoPayM3, permitPay, installPay float64) float64 {
	log.EnterFn(0, "CalculatePTOPay")
	defer func() { log.ExitFn(0, "CalculatePTOPay", nil) }()

	if status == string(common.Cancel) || status == string(common.Shaky) {
		return 0
	}
	if grossRev > 0 {
		return common.Round(netRev*ptoPayM3-(permitPay+installPay), 2)
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        CalculateBalance
 * DESCRIPTION:     calculates the balance based on given parameters.
 * RETURNS:       balance
 *****************************************************************************/
func CalculateBalance(uniqueID string, status string, dealer string, totalPaid float64, netRev float64, reconcile float64) (balance float64) {

	log.EnterFn(0, "CalculateBalance")
	defer func() { log.ExitFn(0, "CalculateBalance", nil) }()

	balance = 0
	if len(uniqueID) > 0 {
		if status == string(common.Cancel) || status == string(common.Shaky) {
			balance = (0 - totalPaid) + reconcile
		} else if len(dealer) > 0 {
			balance = common.Round(netRev-totalPaid, 2) + reconcile
		}
	}
	return balance
}

/******************************************************************************
 * FUNCTION:		CalculateCurrentDue
 * DESCRIPTION:		calculates the currentDue based on given parameters
 * RETURNS:			currentDue
 *****************************************************************************/
func CalculateCurrentDue(saleData *dataMgmt.SaleDataStruct, netRev, totalPaid, permitPay, installPay, reconcile float64) (currentDue float64) {
	var (
		today = time.Now().Truncate(24 * time.Hour)
	)

	log.EnterFn(0, "CalculateCurrentDue")
	defer func() { log.ExitFn(0, "CalculateCurrentDue", nil) }()

	currentDue = 0.0
	if saleData.CancelledDate.IsZero() || saleData.ProjectStatus == "Hold" || saleData.ProjectStatus == "Jeopardy" {
		currentDue = (0 - totalPaid)
	} else {
		if !saleData.PermitSubmittedDate.IsZero() &&
			(saleData.PermitSubmittedDate.Before(today) || saleData.PermitSubmittedDate.Equal(today)) {

			if !saleData.PtoDate.IsZero() &&
				(saleData.PtoDate.Before(today) || saleData.PtoDate.Equal(today)) {

				currentDue = common.Round(netRev-totalPaid, 2) + reconcile
			} else if !saleData.PvInstallCompletedDate.IsZero() &&
				(saleData.PvInstallCompletedDate.Before(today) || saleData.PvInstallCompletedDate.Equal(today)) {

				currentDue = common.Round(permitPay+installPay-totalPaid, 2) + reconcile
			} else if !saleData.PermitSubmittedDate.IsZero() &&
				(saleData.PermitSubmittedDate.Before(today) || saleData.PermitSubmittedDate.Equal(today)) {

				currentDue = common.Round(permitPay-totalPaid, 2) + reconcile
			}
		}
	}

	return currentDue
}
