/**************************************************************************
 * File            : commonCalc.go
 * DESCRIPTION     : This file contains common calculations
 *							 required for AR, DLR PAY & REP PAY
 * DATE            : 28-April-2024
 **************************************************************************/

package Common

import (
	log "OWEApp/shared/logger"
)

/******************************************************************************
 * FUNCTION:        CalculateProjectStatus
 * DESCRIPTION:     function to get project status
 * RETURNS:         project status
 *****************************************************************************/
func CalculateProjectStatus(uniqueID string, ptoDate, installDate, cancelDate, permitDate, ntpDate, wc1 string) (status Project_Status) {
	log.EnterFn(0, "CalculateProjectStatus")
	defer func() { log.ExitFn(0, "CalculateProjectStatus", "") }()

	if len(uniqueID) > 0 && ptoDate != "" {
		return PTO
	} else if len(uniqueID) > 0 && installDate != "" {
		return Install
	} else if len(uniqueID) > 0 && cancelDate != "" {
		return Cancel
	} else if len(uniqueID) > 0 && permitDate != "" {
		return Permits
	} else if len(uniqueID) > 0 && ntpDate != "" {
		return NTP
	} else if len(uniqueID) > 0 && wc1 != "" {
		return Sold
	} /* else if len(uniqueID) > 0 && handSign == "TRUE" {
		return Shaky
	}*/
	return Null
}

/******************************************************************************
 * FUNCTION:        GetProjectStatusDate
 * DESCRIPTION:     function to get project status date
 * RETURNS:         project status
 *****************************************************************************/
func CalculateProjectStatusDate(uniqueID, ptoDate, installDate, cancelDate, permitDate, ntpDate, wc1 string) string {
	log.EnterFn(0, "CalculateProjectStatusDate")
	defer func() { log.ExitFn(0, "CalculateProjectStatusDate", "") }()

	if len(uniqueID) > 0 {
		switch {
		case ptoDate != "":
			return ptoDate
		case installDate != "":
			return installDate
		case cancelDate != "":
			return cancelDate
		/*case handSign == "TRUE":
		return "Shaky"*/
		case permitDate != "":
			return permitDate
		case ntpDate != "":
			return ntpDate
		case wc1 != "":
			return wc1
		default:
			return "NULL"
		}
	}
	return "NULL"
}

/******************************************************************************
 * FUNCTION:        CalculateRepCount
 * DESCRIPTION:     function to get Sales Reps Count
 * RETURNS:         Reps count
 *****************************************************************************/
func CalculateRepCount(primarySalesRep, secondarySalesRep string) int {
	log.EnterFn(0, "CalculateRepCount")
	defer func() { log.ExitFn(0, "CalculateRepCount", "") }()

	repCount := 0
	if len(primarySalesRep) > 0 {
		repCount++
	}
	if len(secondarySalesRep) > 0 {
		repCount++
	}
	return repCount
}

/******************************************************************************
 * FUNCTION:        CalculatePerRepSales
 * DESCRIPTION:     function to get sales per rep
 * RETURNS:         Reps count
 *****************************************************************************/
func CalculatePerRepSales(primarySalesRep, secondarySalesRep string) float64 {
	log.EnterFn(0, "CalculatePerRepSales")
	defer func() { log.ExitFn(0, "CalculatePerRepSales", "") }()

	primaryRepCount := 0
	if len(primarySalesRep) > 0 {
		primaryRepCount = 1
	}

	secondaryRepCount := 0
	if len(secondarySalesRep) > 0 {
		secondaryRepCount = 1
	}

	denominator := float64(primaryRepCount + secondaryRepCount)

	// Handle division by zero case
	if denominator == 0 {
		return 0
	}

	result := 1 / denominator
	return result
}

/******************************************************************************
 * FUNCTION:        CalculatePerRepKw
 * DESCRIPTION:     function to get Kw per rep
 * RETURNS:         Reps count
 *****************************************************************************/
func CalculatePerRepKw(systemSize float64, primarySalesRep, secondarySalesRep string) float64 {

	log.EnterFn(0, "CalculatePerRepKw")
	defer func() { log.ExitFn(0, "CalculatePerRepKw", "") }()

	primaryRepCount := 0
	if len(primarySalesRep) > 0 {
		primaryRepCount = 1
	}

	secondaryRepCount := 0
	if len(secondarySalesRep) > 0 {
		secondaryRepCount = 1
	}

	denominator := float64(primaryRepCount + secondaryRepCount)

	// Handle division by zero case
	if denominator == 0 {
		return 0
	}

	result := systemSize / denominator
	return result
}

/******************************************************************************
 * FUNCTION:        CalculateContractAmount
 * DESCRIPTION:     Calculate Contract Ammount
 * RETURNS:         contact amount
 *****************************************************************************/
func CalculateContractAmount(netEPC, contractTotal string, systemSize float64) float64 {

	log.EnterFn(0, "CalculateContractAmount")
	defer func() { log.ExitFn(0, "CalculateContractAmount", "") }()

	if len(netEPC) > 0 {
		if len(contractTotal) > 0 {
			/* Use contract_total if available */
			contractAmount := StrToFloat(contractTotal)
			if contractAmount != nil {
				return *contractAmount
			}
		} else {
			/* Calculate contract amount if contract_total is not available*/
			netEPCAmount := StrToFloat(netEPC)
			if netEPCAmount != nil {
				return *netEPCAmount * 1000 * systemSize
			}
		}
	}
	/* Return 0 if netEPC is empty or if contract_total is not available and netEPC cannot be parsed*/
	return 0
}

/******************************************************************************
 * FUNCTION:        CalculateEPCCalc
 * DESCRIPTION:    calculates the EPC based on the provided data
 * RETURNS:         contact amount
 *****************************************************************************/
func CalculateEPCCalc(contractCalc string, wc1 int, netEPC string, systemSize float64) float64 {

	log.EnterFn(0, "CalculateEPCCalc")
	defer func() { log.ExitFn(0, "CalculateEPCCalc", "") }()

	if len(contractCalc) > 0 {
		contractCalcAmount := StrToFloat(contractCalc)
		if contractCalcAmount != nil {
			if wc1 < 44287 {
				/* Use net_epc if wc_1 is less than 44287*/
				netEPCAmount := StrToFloat(netEPC)
				if netEPCAmount != nil {
					return *netEPCAmount
				}
			} else {
				/* Calculate EPC based on contract $$ Calc */
				return *contractCalcAmount / 1000 / systemSize
			}
		}
	}
	/* Return 0 if Contract $$ Calc is empty or cannot be parsed */
	return 0
}

/******************************************************************************
 * FUNCTION:        CalculateAddrPtr
 * DESCRIPTION:     calculates the "addr_ptr" value based on the provided data
 * RETURNS:         addrPtr
 *****************************************************************************/
/*ASIF TODO: Commented becasue it needs configuration */

/* func CalculateAddrPtr(dealer string, adderData []AdderData) int {
	log.EnterFn(0, "CalculateAddrPtr")
	defer func() { log.ExitFn(0, "CalculateAddrPtr", "") }()

	if len(dealer) > 0 {
		var addrPtrSum int
		for _, data := range adderData {
			if data.Dealer == dealer && data.UniqueID+data.GC == data.UniqueID+"Partner" {
				addrPtrSum += data.AdderCalc
			}
		}
		return addrPtrSum
	}
	return 0
}*/

/******************************************************************************
 * FUNCTION:        CalculateAddrAuto
 * DESCRIPTION:     calculates the "addr_auto" value based on the provided data
 * RETURNS:         addr_auto
 *****************************************************************************/
/*ASIF TODO: Commented becasue it needs configuration */

/*
 func CalculateAddrAuto(dealer string, autoAdder []AutoAdder) float64 {
	log.EnterFn(0, "CalculateAddrAuto")
	defer func() { log.ExitFn(0, "CalculateAddrAuto", "") }()

	if len(dealer) > 0 {
		var addrAutoSum float64
		for _, data := range autoAdder {
			if data.Dealer == dealer && data.UniqueID == data.UniqueID {
				addrAutoSum += data.ExactAmt
			}
		}
		return addrAutoSum
	}
	return 0
}*/

/******************************************************************************
 * FUNCTION:        CalculateAddrAuto
 * DESCRIPTION:     calculates the "loan_fee" value based on the provided data
 * RETURNS:         loan fee
 *****************************************************************************/
/*ASIF TODO: Commented becasue it needs configuration */
/*func CalculateLoanFee(dealer string, loanFeeAdder []LoanFeeAdder) interface{} {
	log.EnterFn(0, "CalculateLoanFee")
	defer func() { log.ExitFn(0, "CalculateLoanFee", "") }()
	if len(dealer) > 0 {
		var loanFeeSum float64
		for _, data := range loanFeeAdder {
			if data.Dealer == dealer && data.UniqueID == data.UniqueID {
				loanFeeSum += data.AddrAmt
			}
		}
		if loanFeeSum == 0 {
			return "LoanERR"
		}
		return loanFeeSum
	}
	return nil
}*/

/******************************************************************************
 * FUNCTION:        CalculateInstallPay
 * DESCRIPTION:     calculates the "install_pay" value based on the provided data
 * RETURNS:         addr_auto
 *****************************************************************************/
func CalculateInstallPay(status string, grossRev, netRev, installPayM2, permitPay float64) float64 {

	log.EnterFn(0, "CalculateInstallPay")
	defer func() { log.ExitFn(0, "CalculateInstallPay", "") }()

	if status == string(Cancel) || status == string(Shaky) {
		return 0
	}
	if grossRev > 0 {
		return Round(netRev*installPayM2-permitPay, 2)
	}
	return 0
}
