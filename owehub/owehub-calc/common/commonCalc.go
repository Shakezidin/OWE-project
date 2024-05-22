/**************************************************************************
 * File            : commonCalc.go
 * DESCRIPTION     : This file contains common calculations
 *							 required for AR, DLR PAY & REP PAY
 * DATE            : 28-April-2024
 **************************************************************************/

package Common

import (
	log "OWEApp/shared/logger"
	"fmt"
	"strconv"
	"time"
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
func CalculateContractAmount(netEPC float64, contractTotal float64, systemSize float64) float64 {

	log.EnterFn(0, "CalculateContractAmount")
	defer func() { log.ExitFn(0, "CalculateContractAmount", nil) }()

	if contractTotal > 0.0 {
		/* Use contract_total if available */
		return contractTotal
	} else {
		/* Calculate contract amount if contract_total is not available*/
		return netEPC * 1000 * systemSize
	}
	/* Return 0 if netEPC is empty or if contract_total is not available and netEPC cannot be parsed*/
	return 0
}

/******************************************************************************
 * FUNCTION:        CalculateEPCCalc
 * DESCRIPTION:    calculates the EPC based on the provided data
 * RETURNS:         contact amount
 *****************************************************************************/
func CalculateEPCCalc(contractCalc float64, wc1 time.Time, netEPC float64, systemSize float64, wc1Filterdate time.Time) float64 {

	log.EnterFn(0, "CalculateEPCCalc")
	defer func() { log.ExitFn(0, "CalculateEPCCalc", nil) }()

	if contractCalc > 0.0 {
		if wc1.Equal(wc1Filterdate) {
			/* Use net_epc if wc_1 is less than 44287*/
			if netEPC != 0.0 {
				return netEPC
			}
		} else {
			/* Calculate EPC based on contract $$ Calc */
			return contractCalc / 1000 / systemSize
		}
	}
	/* Return 0 if Contract $$ Calc is empty or cannot be parsed */
	return 0
}

/******************************************************************************
 * FUNCTION:        CalculateInstallPay
 * DESCRIPTION:     calculates the "installPay" value based on the provided data
 * RETURNS:         installPay
 *****************************************************************************/
func CalculateInstallPay(status string, grossRev, netRev float64, installPayM2 float64, permitPay float64) (installPay float64) {

	log.EnterFn(0, "CalculateInstallPay")
	defer func() { log.ExitFn(0, "CalculateInstallPay", nil) }()

	installPay = 0
	if status == string(Cancel) || status == string(Shaky) {
		return installPay
	}
	if grossRev > 0 {
		if installPayM2 > 0 {
			installPay = Round(netRev*(installPayM2)-permitPay, 2)
		}
	}
	return installPay
}

/******************************************************************************
 * FUNCTION:        CalculatePayRateSemi
 * DESCRIPTION:     calculates the "installPay" value based on the provided data
 * RETURNS:         float or error string
 *****************************************************************************/

func CalculatePayRateSemi(anValue, arValue string) string {
	anFloat, errAn := strconv.ParseFloat(anValue, 64)
	arFloat, errAr := strconv.ParseFloat(arValue, 64)

	if errAn == nil && errAr == nil {
		result := (anFloat - arFloat) * 1000
		return fmt.Sprintf("%.2f", result)
	}
	return "ERROR"
}

/******************************************************************************
 * FUNCTION:        CalculateADDR
 * DESCRIPTION:     calculates the addr value based on the provided data
 * RETURNS:         addr value
 *****************************************************************************/

func CalculateADDR(gValue string, criteriaRange, sumRange []string) float64 {
	var sum float64 = 0
	for i, val := range criteriaRange {
		if val == gValue {
			sumVal, err := strconv.ParseFloat(sumRange[i], 64)
			if err != nil {
				return sum
			}
			sum += sumVal
		}
	}
	return sum
}
