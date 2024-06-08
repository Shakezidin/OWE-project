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
	"encoding/json"
	"fmt"
	"os"
	"strings"

	// dlrPay "OWEApp/owehub-calc/dlrpaycalc"
	db "OWEApp/shared/db"
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

		if count > 20 {
			break
		}
		// Process and clear the batch every 1000 records
		// if (i+1)%1000 == 0 && len(arDataList) > 0 {
		err = db.AddMultipleRecordInDB(db.OweHubDbIndex, db.TableName_SalesArCalc, arDataList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to insert initial AR Data in DB err: %v", err)
		}
		arDataList = nil // Clear the arDataList
		// }
		count++
	}
	/*
		// Process remaining records if any
		if len(arDataList) > 0 {
			err = db.AddMultipleRecordInDB(db.OweHubDbIndex, db.TableName_SalesArCalc, arDataList)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to insert initial AR Data in DB err: %v", err)
			}
		}
	*/
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
		state        string
	)
	log.EnterFn(0, "CalculateARProject")
	defer func() { log.ExitFn(0, "CalculateARProject", err) }()

	// netEpc := saleData.NetEpc
	// contractTotal := saleData.ContractTotal
	// systemSize := saleData.SystemSize

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

	redLine, permitPayM1, permitMax, installPayM2 = dataMgmt.ArSkdConfig.GetArSkdForSaleData(&saleData) //* ArSkdConfig

	// redLine = -0.15
	// permitPayM1 = 30
	// permitMax = 50000
	// installPayM2 = 100

	log.FuncErrorTrace(0, "RAED redline -> %v permitPayM1 -> %v permitMax -> %v installPayM2 -> %v", redLine, permitPayM1, permitMax, installPayM2)

	epc := (outData["sys_size"].(float64) * 1000) / outData["contract"].(float64)
	contractCalc = common.CalculateARContractAmount(epc, outData["contract"].(float64), outData["sys_size"].(float64))
	epcCalc = common.CalculateAREPCCalc(contractCalc, saleData.ContractDate, epc, saleData.SystemSize, common.ARWc1FilterDate) //!&* calculate epc value
	// contractdoldol := dlrPay.CalculateContractDolDol(epcCalc, contractTotal, systemSize)
	// log.FuncErrorTrace(0, "RAED saleData.NetEpc -> %v contract -> %v sys_size -> %v", saleData.NetEpc, outData["contract"].(float64), outData["sys_size"].(float64))
	// log.FuncErrorTrace(0, "RAED saleData.WC1 -> %v saleData.SystemSize -> %v", saleData.WC1, saleData.SystemSize)

	grossRev = CalculateGrossRev(epcCalc, redLine, saleData.SystemSize)                                       //! 0 since redline is zero
	addrPtr = dataMgmt.AdderDataCfg.CalculateAddrPtr(saleData.Dealer, saleData.UniqueId, saleData.SystemSize) //* AdderDataCfg

	log.FuncErrorTrace(0, "RAED contractCalc -> %v epcCalc -> %v grossRev -> %v addrPtr -> %v", contractCalc, epcCalc, grossRev, addrPtr)

	// addrAuto = dataMgmt.AutoAdderCfg.CalculateAddrAuto(saleData.Dealer, saleData.UniqueId, saleData.SystemType)
	addrAuto = dataMgmt.AutoAdderCfg.CalculateArAddrAuto(saleData.Dealer, saleData.UniqueId, saleData.SystemSize, saleData.State, saleData.Installer)
	// loanFee = dataMgmt.LoanFeeAdderCfg.CalculateLoanFee(saleData.UniqueId, saleData.Dealer, saleData.Installer, saleData.State, saleData.LoanType, saleData.ContractDate, contractdoldol) //~ LoanFeeAdderCfg need to verify
	loanFee = 0
	adjust = dataMgmt.AdjustmentsConfig.CalculateAdjust(saleData.Dealer, saleData.UniqueId) //* AdjustmentsConfig
	netRev = CalculateNetRev(grossRev, addrPtr, addrAuto, loanFee, adjust)                  //! 0 since grossRev is zero
	log.FuncErrorTrace(0, "RAED addrAuto -> %v loanFee -> %v adjust -> %v netRev -> %v", addrAuto, loanFee, adjust, netRev)

	permitPay = CalculatePermitPay(status, grossRev, netRev, permitPayM1, permitMax)             //! 0 since grossRev is zero
	installPay = common.CalculateInstallPay(status, grossRev, netRev, installPayM2, permitPay)   //! 0 since grossRev is zero
	reconcile = dataMgmt.ReconcileCfgData.CalculateReconcile(saleData.Dealer, saleData.UniqueId) // ReconcileCfgData
	totalPaid = dataMgmt.ArCfgData.GetTotalPaidForUniqueId(saleData.UniqueId)                    //! need to add data for  sales_ar_cfg
	log.FuncErrorTrace(0, "RAED permitPay -> %v installPay -> %v reconcile -> %v totalPaid -> %v", permitPay, installPay, reconcile, totalPaid)

	oweAr := CalculateOweAR(contractCalc, loanFee)
	currentDue = CalculateCurrentDue(&saleData, netRev, totalPaid, permitPay, installPay, reconcile)
	balance = CalculateBalance(saleData.UniqueId, status, saleData.Dealer, totalPaid, netRev, reconcile)
	log.FuncErrorTrace(0, "RAED currentDue -> %v balance -> %v oweAr -> %v", currentDue, balance, oweAr)

	if len(saleData.State) > 0 {
		state = saleData.State[5:]
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
		// if redLine > 0.0 {
		/* Calculate gross_rev */
		return (epcCalc - redLine) * 1000 * systemSize
		// }
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
