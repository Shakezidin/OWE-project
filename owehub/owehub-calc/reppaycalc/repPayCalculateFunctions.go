package arcalc

import (
	log "OWEApp/shared/logger"
	"math"
	"time"
)

/******************************************************************************
* FUNCTION:        calculateR1RR
* DESCRIPTION:     calculates the "r_rr" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func calculateRR(repName string, val1, val2 float64) (result float64) {
	if len(repName) > 0 {
		return val1 + val2
	}
	return 0
}

/******************************************************************************
* FUNCTION:        calculateRStatusCommCheck
* DESCRIPTION:     calculates the "r_status_comm_check" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func calculateRCommStatudCheck(repName, salesRepType, status string, RCommTotal float64) (result float64) {
	if len(repName) > 0 {
		if salesRepType == "Sales Rep 2" {
			return 0
		} else if status == "Cancel" {
			return 0
		} else if status == "Shaky" {
			return 0
		} else {
			return RCommTotal
		}
	}
	return 0
}

/******************************************************************************
* FUNCTION:        calculateRepKw
* DESCRIPTION:     calculates the "rep_kw" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func calculateRepKw(rep string, netEpc, SysSize, adderPerKw float64) float64 {
	if len(rep) == 0 {
		return 0
	}
	result := 0.0
	if len(rep) > 0 {
		if netEpc > 0 && adderPerKw > 0 {
			result = (SysSize / 2)
		} else if netEpc > 0 || adderPerKw > 0 {
			result = (SysSize / 1)
		}
	}
	return result
}

/******************************************************************************
* FUNCTION:        calculateRPayRateSubTotal
* DESCRIPTION:     calculates the "r_pay_rate_sub_total" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func calculateRPayRateSubTotal(repName string, val1, val2 float64) (result float64) {
	if len(repName) > 0 {
		return val1 - val2
	}
	return 0
}

/******************************************************************************
* FUNCTION:        CalculateContractDolDol
* DESCRIPTION:     calculates the "contract$$" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func CalculatePayRateSemi(Rep string, rl, rate, adjustment, r1Incentive, epcCalc float64) (payRateSemi float64) {
	if len(Rep) > 0 && Rep != "" {
		if rl <= 0 {
			return rate + adjustment + r1Incentive
		} else if rate <= 0 {
			return ((epcCalc - rl) * 1000) + adjustment + r1Incentive
		} else {
			return payRateSemi
		}
	}
	return payRateSemi
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
* FUNCTION:        CalculateContractDolDol
* DESCRIPTION:     calculates the "contract$$" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func CalculateContractDolDol(netEpc float64, contract float64, sysSize float64) (contractdoldol float64) {
	log.FuncErrorTrace(0, "netEpc %v  contract %v sysSize %v", netEpc, contract, sysSize)
	if netEpc > 0 {
		if contract > 0 {
			contractdoldol = contract
		} else {
			contractdoldol = netEpc * 1000 * sysSize
		}
	}
	return contractdoldol
}

/******************************************************************************
* FUNCTION:        calculateRAdderPerKw
* DESCRIPTION:     calculates the "r_adder_per_kw" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func calculateRAdderPerKw(repName string, val1, val2 float64) (result float64) {
	if len(repName) > 0 {
		return val1 / val2
	}
	return 0
}

/******************************************************************************
* FUNCTION:        calculateRAdderTotal
* DESCRIPTION:     calculates the "r_adder_total" value based on the provided data
* RETURNS:         result
*****************************************************************************/
func calculateRAdderTotal(repName string, val1, val2, val3, val4, val5 float64) (result float64) {
	if len(repName) > 0 {
		return val1 + val2 + val3 + val4 + val5
	}
	return 0
}

/******************************************************************************
* FUNCTION:        calculateR1CommTotal
* DESCRIPTION:     calculates the "calculateR1CommTotal" value based on the provided data
* RETURNS:         r1CommTotal
*****************************************************************************/
func calculateRCommTotal(rep1, source string, rMinOrMax, perRepKw, rCredit float64) (r1CommTotal float64) {
	if len(rep1) > 0 {
		if source == "BPN: SETTER" {
			return math.Round(((rMinOrMax * perRepKw) + rCredit) * 0.6)
		} else {
			math.Round((rMinOrMax * perRepKw) + rCredit)
		}
	}
	return r1CommTotal
}

/******************************************************************************
* FUNCTION:        calculateR1MinOrMax
* DESCRIPTION:     calculates the "calculateR1MinOrMax" value based on the provided data
* RETURNS:         r1MinOrMax
*****************************************************************************/
func calculateRMinOrMax(rep1 string, rPayRateSubTotal, minRate, maxRate float64) (rMinOrMax float64) {
	if len(rep1) > 0 {
		if rPayRateSubTotal < minRate {
			return minRate
		} else if rPayRateSubTotal > maxRate {
			return maxRate
		} else {
			return rPayRateSubTotal
		}
	}
	return rMinOrMax
}

/******************************************************************************
* FUNCTION:        calculateR1DrawAmount
* DESCRIPTION:     calculates the "r1 draw amount" value based on the provided data
* RETURNS:         r1DrawAmount
*****************************************************************************/
func calculateRDrawAmount(rCommStatusCheck, drawMax, perRepSales, drawPerentage float64) (r1DrawAmount float64) {
	if rCommStatusCheck > 0 {
		if (drawMax * perRepSales) < (rCommStatusCheck * drawPerentage) {
			return math.Round(drawMax * perRepSales)
		} else {
			return math.Round(rCommStatusCheck * drawPerentage)
		}
	}
	return rCommStatusCheck
}

/******************************************************************************
* FUNCTION:        calculatePerRepSales
* DESCRIPTION:     calculates the "per rep sales" value based on the provided data
* RETURNS:         perRepsales
*****************************************************************************/
func calculatePerRepSales(rep1, rep2 string) (perRepsales float64) {
	if len(rep1) > 0 {
		if len(rep2) > 0 {
			return 0.5
		} else {
			return 1
		}
	} else {
		return 0
	}
}

/******************************************************************************
* FUNCTION:        calculateApptBalance
* DESCRIPTION:     calculates the "appt balance" value based on the provided data
* RETURNS:         apptBalance
*****************************************************************************/
func calculateApptBalance(apptSetter string, apptAmount, apptPaid float64) (apptBalance float64) {
	if len(apptSetter) > 0 {
		return math.Round(apptAmount - apptPaid)
	}
	return apptBalance
}

/******************************************************************************
* FUNCTION:        calculateApptAmount
* DESCRIPTION:     calculates the "appt amount" value based on the provided data
* RETURNS:         apptAmount
*****************************************************************************/
func calculateApptAmount(apptSetStatusCheck float64) (apptAmount float64) {
	if apptSetStatusCheck > 0 {
		return apptSetStatusCheck
	}
	return 0
}

/******************************************************************************
* FUNCTION:        calculateApptSetStatusCheck
* DESCRIPTION:     calculates the "appt set status check" value based on the provided data
* RETURNS:         apptSetStatusCheck
*****************************************************************************/
func calculateApptSetStatusCheck(apptSetter, status string, apptSetTotal float64) (apptSetStatusCheck float64) {
	if len(apptSetter) > 0 {
		if status == "Cancel" {
			apptSetStatusCheck = 0.0
		} else if status == "Shaky" {
			apptSetStatusCheck = 0.0
		} else {
			apptSetStatusCheck = apptSetTotal
		}
	}
	return apptSetStatusCheck
}

/******************************************************************************
* FUNCTION:        calculateApptSetTotal
* DESCRIPTION:     calculates the "appt set total" value based on the provided data
* RETURNS:         apptSetStatusCheck
*****************************************************************************/
func calculateApptSetTotal(apptSetter, source string, rep1CommStatusCheck, payRate, systemSize float64) (apptSetTotal float64) {
	if len(apptSetter) > 0 {
		if source == "BPN: SETTER" {
			return rep1CommStatusCheck * 0.8
		} else {
			return math.Round(payRate * systemSize)
		}
	}
	return apptSetTotal
}

/***************************************************************************
* FUNCTION:        calculateR1DrawAmount
* DESCRIPTION:     calculates the "r1 draw amount" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func calculateRNetEpc(rep string, contractCalc, adderTotal, RloanFee, loanFee, systemSize float64) (netEpc float64) {
	if len(rep) > 0 {
		netEpc = math.Round(((contractCalc-(adderTotal-RloanFee+loanFee))/systemSize/1000)*1000) / 1000
	}
	return netEpc
}

/******************************************************************************
* FUNCTION:        CalculateStatusDate
* DESCRIPTION:     calculates the "status_date" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func CalculateStatusDate(uniqueID string, shaky bool, pto, instSys, cancel, ntp, permSub, wc time.Time) time.Time {
	var statusDate time.Time

	if len(uniqueID) > 0 {
		switch {
		case !pto.IsZero():
			statusDate = pto
		case !instSys.IsZero():
			statusDate = instSys
		case !cancel.IsZero():
			statusDate = cancel
		case shaky == true:
			statusDate = time.Time{}
		case !ntp.IsZero():
			statusDate = ntp
		case !permSub.IsZero():
			statusDate = permSub
		case !wc.IsZero():
			statusDate = wc
		default:
			statusDate = time.Time{}
		}
	}
	return statusDate
}
