/**************************************************************************
 * File            : arInitCalc.go
 * DESCRIPTION     : This file contains functions to perform
 *							Calculations for AR
 * DATE            : 28-April-2024
 **************************************************************************/

package arcalc

import (
	common "OWEApp/owehub-calc/common"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
)

/******************************************************************************
 * FUNCTION:            ExecArInitialCalculation
 * DESCRIPTION:        Execute initial calculations for AR
 * INPUT:                       N/A
 * RETURNS:             error
 *****************************************************************************/
func ExecArInitialCalculation(resultChan chan string) {
	var (
		err error
	)
	log.EnterFn(0, "ExecArInitialCalculation")
	defer func() { log.ExitFn(0, "ExecArInitialCalculation", err) }()

	/* Feth Config from DB */

	/* Fetch Data for Calculation From DB */
	viewName := db.ViewName_ConsolidatedDataView
	query := "SELECT * from " + viewName

	dataList, err := db.ReteriveFromDB(query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get commissions data from DB err: %v", err)
		resultChan <- "FAILURE"
		return
	}

	//for data, _

	resultChan <- "SUCCESS"
}

/******************************************************************************
 * FUNCTION:        CalculateOweAR
 * DESCRIPTION:     calculates the "owe_ar" value based on the provided data
 * RETURNS:        owe ar
 *****************************************************************************/
func CalculateOweAR(contractCalc, loanFee string) float64 {

	log.EnterFn(0, "CalculateOweAR")
	defer func() { log.ExitFn(0, "CalculateOweAR", "") }()

	if len(contractCalc) > 0 {
		contractCalcAmount := common.StrToFloat(contractCalc)
		if contractCalcAmount != nil {
			loanFeeAmount := common.StrToFloat(loanFee)
			if loanFeeAmount != nil {
				/* Subtract loanFee from contractCalc */
				return *contractCalcAmount - *loanFeeAmount
			}
		}
	}
	/* Return 0 if Contract $$ Calc is empty or cannot be parsed */
	return 0
}

/******************************************************************************
 * FUNCTION:        CalculateOweAR
 * DESCRIPTION:     calculates the "gross_rev" value based on the provided data
 * RETURNS:        gross revenue
 *****************************************************************************/
func CalculateGrossRev(epcCalc, redLine string, systemSize float64) float64 {

	log.EnterFn(0, "CalculateGrossRev")
	defer func() { log.ExitFn(0, "CalculateGrossRev", "") }()

	if len(epcCalc) > 0 {
		epcCalcAmount := common.StrToFloat(epcCalc)
		if epcCalcAmount != nil {
			redLineAmount := common.StrToFloat(redLine)
			if redLineAmount != nil {
				/* Calculate gross_rev */
				return (*epcCalcAmount - *redLineAmount) * 1000 * systemSize
			}
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
func CalculateNetRev(grossRev, addrPtr, autoAddr, loanFee float64) float64 {
	log.EnterFn(0, "CalculateNetRev")
	defer func() { log.ExitFn(0, "CalculateNetRev", "") }()

	if grossRev > 0 {
		return common.Round(grossRev-addrPtr-autoAddr-loanFee+loanFee, 2)
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        CalculatePermitPay
 * DESCRIPTION:     calculates the "permit_pay" value based on the provided data
 * RETURNS:        permit pay
 *****************************************************************************/
func CalculatePermitPay(status string, grossRev, netRev, permitPayM1, permitMax float64) float64 {
	log.EnterFn(0, "CalculatePermitPay")
	defer func() { log.ExitFn(0, "CalculatePermitPay", "") }()

	if status == string(common.Cancel) || status == string(common.Shaky) {
		return 0
	}
	if grossRev > 0 {
		if netRev*permitPayM1 > permitMax {
			return common.Round(permitMax, 2)
		}
		return common.Round(netRev*permitPayM1, 2)
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        CalculatePTOPay
 * DESCRIPTION:      calculates the "pto_pay" value based on the provided data
 * RETURNS:        pto pay
 *****************************************************************************/
func CalculatePTOPay(status string, grossRev, netRev, ptoPayM3, permitPay, installPay float64) float64 {
	log.EnterFn(0, "CalculatePTOPay")
	defer func() { log.ExitFn(0, "CalculatePTOPay", "") }()

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
func CalculateBalance(uniqueID string, status string, dealer string, totalPaid float64, netRev float64, reconcile float64) float64 {

	log.EnterFn(0, "CalculateBalance")
	defer func() { log.ExitFn(0, "CalculateBalance", "") }()

	if len(uniqueID) > 0 {
		if status == string(common.Cancel) || status == string(common.Shaky) {
			return 0 - totalPaid
		} else if len(dealer) > 0 {
			return netRev - totalPaid + reconcile
		}
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        CalculateTotalPaid
 * DESCRIPTION:     calculates the "total_paid" value based on the provided data
 * RETURNS:       Adjust
 *****************************************************************************/
/*ASIF TODO: Commented becasue it needs configuration */
/*func CalculateTotalPaid(dealer string, arData []AR) float64 {
	log.EnterFn(0, "CalculateTotalPaid")
	defer func() { log.ExitFn(0, "CalculateTotalPaid", "") }()
	if len(dealer) > 0 {
		var totalPaidSum float64
		for _, data := range arData {
			if data.UniqueID == data.UniqueID {
				totalPaidSum += data.Amount
			}
		}
		return totalPaidSum
	}
	return 0
}*/

/******************************************************************************
 * FUNCTION:        CalculateAdjust
 * DESCRIPTION:     calculates the "adjust" value based on the provided data
 * RETURNS:       Adjust
 *****************************************************************************/
/*ASIF TODO: Commented becasue it needs configuration */
/* func CalculateAdjust(dealer string, adjustData []Adjust) float64 {
	log.EnterFn(0, "CalculateAdjust")
	defer func() { log.ExitFn(0, "CalculateAdjust", "") }()
	if len(dealer) > 0 {
		var adjustSum float64
		for _, data := range adjustData {
			if data.Dealer == dealer && data.UniqueID == data.UniqueID {
				adjustSum += data.Amount
			}
		}
		return adjustSum
	}
	return 0
} */

/******************************************************************************
 * FUNCTION:        CalculateReconcile
 * DESCRIPTION:      calculates the "reconcile" value based on the provided data
 * RETURNS:       Reconsile
 *****************************************************************************/
/*ASIF TODO: Commented becasue it needs  configuration */
/* func CalculateReconcile(dealer string, reconcileData []Reconcile) float64 {
	log.EnterFn(0, "CalculateReconcile")
	defer func() { log.ExitFn(0, "CalculateReconcile", "") }()
	if len(dealer) > 0 {
		var reconcileSum float64
		for _, data := range reconcileData {
			if data.Dealer == dealer && data.UniqueID == data.UniqueID {
				reconcileSum += data.Amount
			}
		}
		return reconcileSum
	}
	return 0
}*/
