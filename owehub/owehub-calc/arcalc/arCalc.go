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
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"encoding/json"
	"fmt"
	"os"
	"strings"
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

	count := 0
	for _, saleData := range dataMgmt.SaleData.SaleDataList {
		var arData map[string]interface{}
		arData, err = CalculateARProject(saleData)
		if err != nil || arData == nil {
			if len(saleData.UniqueId) <= 0 {
				log.FuncErrorTrace(0, "Failed to calculate AR Data for unique id: %+v err: %+v", saleData.UniqueId, err)
			} else {
				log.FuncErrorTrace(0, "Failed to calculate AR Data err: %+v", err)
			}
		} else {
			arDataList = append(arDataList, arData)
		}
		// Process and clear the batch every 1000 records
		if (count+1)%1000 == 0 && len(arDataList) > 0 {
			err = db.AddMultipleRecordInDB(db.OweHubDbIndex, db.TableName_SalesArCalc, arDataList)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to insert initial AR Data in DB err: %v", err)
			}
			arDataList = nil // Clear the arDataList
		}
		count++
	}

	// Process remaining records if any
	if len(arDataList) > 0 {
		err = db.AddMultipleRecordInDB(db.OweHubDbIndex, db.TableName_SalesArCalc, arDataList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to insert initial AR Data in DB err: %v", err)
		}
	}

	resultChan <- "SUCCESS"
}

/******************************************************************************
 * FUNCTION:        CalculateARProject
 * DESCRIPTION:     to set logs for production & development
 * RETURNS:        	outData
 *****************************************************************************/
var debugLogging = true

func debugLog(format string, args ...interface{}) {
	if debugLogging {
		log.FuncErrorTrace(0, format, args...)
	}
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
		state        string
	)
	log.EnterFn(0, "CalculateARProject")
	defer func() { log.ExitFn(0, "CalculateARProject", err) }()

	outData = make(map[string]interface{})
	outData["dealer"] = saleData.Dealer
	outData["partner"] = saleData.Partner
	outData["instl"] = saleData.Installer
	outData["source"] = saleData.Source
	outData["loan_type"] = saleData.LoanType
	outData["unique_id"] = saleData.UniqueId
	outData["home_owner"] = saleData.HomeOwner
	outData["street_address"] = saleData.Address
	outData["rep_1"] = saleData.PrimarySalesRep
	outData["rep_2"] = saleData.SecondarySalesRep
	outData["sys_size"] = saleData.SystemSize
	outData["contract"] = saleData.ContractTotal
	outData["epc"] = saleData.NetEpc
	outData["wc"] = saleData.ContractDate
	outData["ntp"] = saleData.NtpDate
	outData["perm_sub"] = saleData.PermitSubmittedDate
	outData["perm_app"] = saleData.PermitApprovedDate
	outData["ic_sub"] = saleData.IcSubmittedDate
	outData["ic_app"] = saleData.IcApprovedDate
	outData["cancel"] = saleData.CancelledDate
	outData["inst_sys"] = saleData.PvInstallCompletedDate
	outData["pto"] = saleData.PtoDate
	status = saleData.ProjectStatus
	if status == "PTO'd" {
		status = "PTO"
	}

	// this hardcodes values for some unique ids
	loanFee = updateSaleDataForSpecificIds(&saleData, saleData.UniqueId, loanFee)

	redLine, permitPayM1, permitMax, installPayM2 = dataMgmt.ArSkdConfig.GetArSkdForSaleData(&saleData)
	epc := saleData.ContractTotal / (saleData.SystemSize * 1000)
	contractCalc = common.CalculateARContractAmount(epc, saleData.ContractTotal, saleData.SystemSize)
	epcCalc = common.CalculateAREPCCalc(contractCalc, saleData.ContractDate, epc, saleData.SystemSize, common.ARWc1FilterDate)
	grossRev = CalculateGrossRev(epcCalc, redLine, saleData.SystemSize)
	addrPtr = dataMgmt.AdderDataCfg.CalculateAddrPtr(saleData.Dealer, saleData.UniqueId, saleData.SystemSize)
	addrAuto = dataMgmt.AutoAdderCfg.CalculateArAddrAuto(saleData.Dealer, saleData.UniqueId, saleData.SystemSize, saleData.State, saleData.Installer)
	if loanFee == 0 {
		loanFee = dataMgmt.SaleData.CalculateLoanFee(saleData.UniqueId, saleData.Dealer, saleData.Installer, saleData.State, saleData.LoanType, contractCalc, saleData.ContractDate)
	}
	adjust = dataMgmt.AdjustmentsConfig.CalculateAdjust(saleData.Dealer, saleData.UniqueId)
	netRev = CalculateNetRev(grossRev, addrPtr, addrAuto, loanFee, adjust)
	permitPay = CalculatePermitPay(status, grossRev, netRev, permitPayM1, permitMax)
	installPay = common.CalculateInstallPay(status, grossRev, netRev, installPayM2, permitPay)
	reconcile = dataMgmt.ReconcileCfgData.CalculateReconcile(saleData.Dealer, saleData.UniqueId)
	totalPaid = dataMgmt.ArCfgData.GetTotalPaidForUniqueId(saleData.UniqueId)
	oweAr := CalculateOweAR(contractCalc, loanFee)
	currentDue = CalculateCurrentDue(&saleData, netRev, totalPaid, permitPay, installPay, reconcile)
	balance = CalculateBalance(saleData.UniqueId, status, saleData.Dealer, totalPaid, netRev, reconcile)

	debugLog("permitPay -> %v installPay -> %v reconcile -> %v totalPaid -> %v", permitPay, installPay, reconcile, totalPaid)
	debugLog("addrAuto -> %v loanFee -> %v adjust -> %v netRev -> %v", addrAuto, loanFee, adjust, netRev)
	debugLog("contractCalc -> %v epcCalc -> %v grossRev -> %v addrPtr -> %v", contractCalc, epcCalc, grossRev, addrPtr)
	debugLog("epc -> %v epcCalc -> %v netEpc -> %v syssize -> %v projectStatus -> %v", epc, epcCalc, saleData.NetEpc, saleData.SystemSize, saleData.ProjectStatus)
	debugLog("redline -> %v permitPayM1 -> %v permitMax -> %v installPayM2 -> %v", redLine, permitPayM1, permitMax, installPayM2)
	debugLog("currentDue -> %v balance -> %v oweAr -> %v", currentDue, balance, oweAr)

	if len(saleData.State) > 6 {
		state = saleData.State[6:]
	}
	if saleData.ProjectStatus == "PTO'd" {
		status = "PTO"
	}

	outData["status"] = status
	outData["st"] = state
	outData["contract_calc"] = contractCalc
	outData["loan_fee"] = loanFee
	outData["owe_ar"] = oweAr
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

	mapToJson(outData, saleData.UniqueId, "outData")
	return outData, err
}

func updateSaleDataForSpecificIds(saleData *dataMgmt.SaleDataStruct, uniqueId string, loanFee float64) float64 {
	// Generic conditions
	if saleData.Installer == "One World Energy" { // for OUR11354
		saleData.Installer = "OWE"
	}
	if saleData.Partner == "SOVA" {
		saleData.Partner = "Sunnova"
	}
	switch uniqueId {
	case "OUR11354":
		saleData.Type = "LOAN"
		saleData.LoanType = "LF-DIV-0MONTH-25y-2.99"
		saleData.Partner = "Dividend"
		loanFee = 7922.35
	case "OUR11364":
		saleData.Type = "LOAN"
		saleData.LoanType = "LF-DIV-0MONTH-25y-2.99"
		saleData.Partner = "Dividend"
		loanFee = 18622.06
	case "OUR11356":
		saleData.Type = "LOAN"
		saleData.LoanType = "LF-DIV-12MONTH-25y-2.99"
		saleData.Partner = "Dividend"
		loanFee = 22408.68
	case "OUR11372":
		saleData.Type = "LEASE 1.9"
		saleData.LoanType = "LEASE-SOVA-1.9"
		saleData.Installer = "OWE"
		saleData.ContractTotal = 34794.29
	case "OUR11403":
		saleData.Type = "LOAN"
		saleData.LoanType = "LF-DIV-12MONTH-25y-3.99"
		saleData.Partner = "Dividend"
		loanFee = 8612.41
	case "OUR24952":
		saleData.Type = "LEASE"
		saleData.LoanType = "LEASE-LightReach-2.99"
		saleData.Partner = "LightReach"
		// loanFee = 8612.41
		// case "OUR11433":
		// 	saleData.Type = "LOAN"
		// 	saleData.LoanType = "LF-DIV-0Month-25y-2.99"
		// 	saleData.LoanType = ""
		// case "OUR11472":
		// 	saleData.Type = "LOAN"
		// 	saleData.LoanType = "LF-DIV-LOAN-25y-7.99"
		// 	saleData.LoanType = ""
		// case "OUR11455":
		// 	saleData.Type = "LOAN"
		// 	saleData.LoanType = "SerFI"
		// 	saleData.LoanType = ""
		// case "OUR11478":
		// 	saleData.Type = "LOAN"
		// 	saleData.LoanType = "LF-DIV-0Month-25y-2.99"
		// 	saleData.LoanType = ""
		// case "OUR11512":
		// 	saleData.Type = "LOAN"
		// 	saleData.LoanType = "LF-GL-LOAN-25Y-3.99"
		// 	saleData.LoanType = ""
		// case "OUR11510":
		// 	saleData.Type = "LOAN"
		// 	saleData.LoanType = "LF-DIV-0Month-25y-2.99"
		// 	saleData.LoanType = ""
	}
	return loanFee
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

/******************************************************************************
 * FUNCTION:        CalculateOweAR
 * DESCRIPTION:     calculates the "owe_ar" value based on the provided data
 * RETURNS:        owe ar
 *****************************************************************************/
func logPrinter(key string, val interface{}) {
	log.FuncErrorTrace(0, "VALUE FOR %v -> %v", key, val)
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
		// if loanFee != 0.0 {
		/* Subtract loanFee from contractCalc */
		return contractCalc - loanFee
		// }
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
		return (epcCalc - redLine) * 1000 * systemSize
	}
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

	if strings.EqualFold(status, string(common.Cancel)) || strings.EqualFold(status, string(common.Shaky)) {
		return permitPay
	}

	if grossRev > 0.0 {
		if (permitPayM1 > 0.0) && (permitMax > 0.0) {
			if (netRev * (permitPayM1 / 100)) > permitMax {
				permitPay = common.Round(permitMax, 2)
			} else {
				permitPay = netRev * (permitPayM1 / 100)
				// permitPay = common.Round((netRev * (permitPayM1/100)), 2)
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
		if strings.EqualFold(status, string(common.Cancel)) || strings.EqualFold(status, string(common.Shaky)) {
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
	if !saleData.CancelledDate.IsZero() || saleData.ProjectStatus == "Hold" || saleData.ProjectStatus == "Jeopardy" {
		currentDue = (0 - totalPaid)
	} else {
		truncatedPermitSubmittedDate := truncateToDay(saleData.PermitSubmittedDate)

		if !truncatedPermitSubmittedDate.IsZero() &&
			(truncatedPermitSubmittedDate.Before(today) || truncatedPermitSubmittedDate.Equal(today)) {

			truncatedPtoDate := truncateToDay(saleData.PtoDate)
			truncatedPvInstallCompletedDate := truncateToDay(saleData.PvInstallCompletedDate)

			if !truncatedPtoDate.IsZero() &&
				(truncatedPtoDate.Before(today) || truncatedPtoDate.Equal(today)) {

				currentDue = common.Round(netRev-totalPaid, 2) + reconcile

			} else if !truncatedPvInstallCompletedDate.IsZero() &&
				(truncatedPvInstallCompletedDate.Before(today) || truncatedPvInstallCompletedDate.Equal(today)) {

				currentDue = common.Round(permitPay+installPay-totalPaid, 2) + reconcile
			} else {
				currentDue = common.Round(permitPay-totalPaid, 2) + reconcile
			}
		}
	}

	return currentDue
}

func truncateToDay(t time.Time) time.Time {
	return t.Truncate(24 * time.Hour)
}
