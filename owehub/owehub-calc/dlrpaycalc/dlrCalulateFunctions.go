/**************************************************************************
 * File            : dlrPayInitCalc.go
 * DESCRIPTION     : This file contains functions to perform
 *							Calculations for DealerPay
 * DATE            : 28-April-2024
 **************************************************************************/

package arcalc

import (
	log "OWEApp/shared/logger"
	"math"
	"time"
)

/******************************************************************************
 * FUNCTION:        calculateAdderTotal
 * DESCRIPTION:     calculates the "gross_rev" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateAdderTotal(dealer string, adder, autoAdder, rebate, referral float64) (totalSum float64) {

	log.EnterFn(0, "CalculateAdderTotal")
	defer func() { log.ExitFn(0, "CalculateAdderTotal", nil) }()

	if len(dealer) > 0 {
		totalSum += adder + autoAdder + rebate + rebate
	}
	return totalSum
}

/******************************************************************************
 * FUNCTION:        calculateEpcCalc
 * DESCRIPTION:     calculates the "epc_total" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateEpcCalc(epcCalc, contract, adderLF, sysSize float64) float64 {
	if epcCalc != 0 {
		netEPC := ((contract - adderLF) / sysSize) / 1000
		netEPC = math.Round(netEPC*1000) / 1000 // Round to 3 decimal places
		return netEPC
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculateAdderPerKW
 * DESCRIPTION:     calculates the "adder_pw" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateAdderPerKW(dealer string, adderLF, sysSize float64) float64 {
	if len(dealer) > 0 {
		adderPerKW := adderLF / sysSize
		return adderPerKW
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculatePayRateSubTotal
 * DESCRIPTION:     calculates the "pay_rate_sub_total" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculatePayRateSubTotal(dealer string, payRateSemi, adderPer float64) float64 {
	if len(dealer) > 0 {
		return (payRateSemi - adderPer)
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculateCommTotal
 * DESCRIPTION:     calculates the "comm_total" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateCommTotal(dealer string, payRate, sysSize, dealerPaymentBonus float64) float64 {
	if len(dealer) > 0 {
		commTotal := (payRate * sysSize) + dealerPaymentBonus
		return math.Round(commTotal*100) / 100
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculateOVRDTotal
 * DESCRIPTION:     calculates the "ovrd_total" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateOVRDTotal(dealer string, payRate, sysSize float64) float64 {
	if len(dealer) > 0 {
		ovrdTotal := payRate * sysSize * 1000
		ovrdTotal = math.Round(ovrdTotal*100) / 100
		return ovrdTotal
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculateStatusCheck
 * DESCRIPTION:     calculates the "status_total" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateStatusCheck(dealer, status string, expense, commTotal, credit, repPay float64) float64 {
	var statusCheck float64

	if len(dealer) > 0 {
		if status == "Cancel" {
			statusCheck = 0 - expense
		} else if status == "Shaky" {
			statusCheck = 0 - expense
		} else {
			statusCheck = commTotal + credit
		}
		statusCheck = statusCheck - repPay
	}
	return statusCheck
}

/******************************************************************************
 * FUNCTION:        calculateR1Balance
 * DESCRIPTION:     calculates the "r1_balance" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateR1Balance(dealerStrings string, statusCheckValues, r1CommPaidValues float64) float64 {
	var balance float64
	if len(dealerStrings) > 0 {
		if !math.IsNaN(statusCheckValues) && !math.IsNaN(r1CommPaidValues) {
			balance = math.Round((statusCheckValues-r1CommPaidValues)*100) / 100
		} else {
			balance = math.NaN()
		}
	}
	return balance
}

/******************************************************************************
 * FUNCTION:        CalculateR1DrawAmt
 * DESCRIPTION:     calculates the "r1_draw_amt" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func CalculateR1DrawAmt(statusCheck float64, DlrDrawMax float64, DlrDrawPerc float64) (result float64) {

	if statusCheck > 0 {
		maxDraw := statusCheck * DlrDrawPerc
		if DlrDrawMax < maxDraw {
			result = DlrDrawMax
		} else {
			result = math.Round(maxDraw*100) / 100
		}
	} else {
		result = 0
	}
	return result
}

/******************************************************************************
 * FUNCTION:        CalculateAmtCheck
 * DESCRIPTION:     calculates the "amt_check" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func CalculateAmtCheck(r1DrawPaid float64, r1DrawAmt float64) (amtCheck float64) {

	if r1DrawPaid == 0 {
		amtCheck = 0
	} else {
		amtCheck = r1DrawAmt - r1DrawPaid
	}

	return amtCheck
}

/******************************************************************************
 * FUNCTION:        CalculateOvrdBalance
 * DESCRIPTION:     calculates the "ovrd_balance" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func CalculateOvrdBalance(dealer string, overdTotal float64, ovrdPaid float64) (ovrdBalance float64) {

	if len(dealer) > 0 {
		if overdTotal-ovrdPaid >= 0 {
			ovrdBalance = math.Round((overdTotal-ovrdPaid)*100) / 100
		} else {
			ovrdBalance = math.NaN()
		}
	}
	return ovrdBalance
}

/******************************************************************************
 * FUNCTION:        CalculateStatus
 * DESCRIPTION:     calculates the "status" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func CalculateStatus(uniqueId string, hand bool, pto, instSys, cancel, ntp, permits, wc time.Time) string {
	status := ""
	if len(uniqueId) > 0 {
		switch {
		case !pto.IsZero():
			status = "PTO"
		case !instSys.IsZero():
			status = "Install"
		case !cancel.IsZero():
			status = "Cancel"
		case hand == true:
			status = "Shaky"
		case !ntp.IsZero():
			status = "NTP"
		case !permits.IsZero():
			status = "Permits"
		case !wc.IsZero():
			status = "Sold"
		default:
			status = ""
		}
	}
	return status
}

/******************************************************************************
 * FUNCTION:        CalculateStatusDate
 * DESCRIPTION:     calculates the "status_date" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func CalculateStatusDate(uniqueID string, hand bool, pto time.Time, instSys time.Time, cancel time.Time, ntp time.Time, permSub time.Time, wc time.Time) time.Time {
	var statusDate time.Time

	switch {
	case !pto.IsZero():
		statusDate = pto
	case !instSys.IsZero():
		statusDate = instSys
	case !cancel.IsZero():
		statusDate = cancel
	case hand == true:
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

	return statusDate
}

/******************************************************************************
 * FUNCTION:        calculateRepCount
 * DESCRIPTION:     calculates the "rep_count" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateRepCount(rep string, netEpc float64, adderPerKw float64) float64 {
	if len(rep) == 0 {
		return 0
	}
	result := 0.0
	if len(rep) > 0 {
		if netEpc > 0 && adderPerKw > 0 {
			result = 2
		} else if netEpc > 0 || adderPerKw > 0 {
			result = 1
		}
	}
	return result
}

/******************************************************************************
 * FUNCTION:        calculateRepSales
 * DESCRIPTION:     calculates the "rep_sales" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateRepSales(rep string, netEpc float64, adderPerKw float64) float64 {
	if len(rep) == 0 {
		return 0
	}
	result := 0.0
	if len(rep) > 0 {
		if netEpc > 0 && adderPerKw > 0 {
			result = (1 / 2)
		} else if netEpc > 0 || adderPerKw > 0 {
			result = 1
		}
	}
	return result
}

/******************************************************************************
 * FUNCTION:        calculateRepKw
 * DESCRIPTION:     calculates the "rep_kw" value based on the provided data
 * RETURNS:        	gross revenue
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
 * FUNCTION:        calculateContractCalc
 * DESCRIPTION:     calculates the "contract_calc" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateContractCalc(epc, contract, sysSize float64) float64 {
	if epc > 0 {
		if contract > 0 {
			return contract
		} else {
			return epc * 1000 * sysSize
		}
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculateEPCCalc
 * DESCRIPTION:     calculates the "epc_calc" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateEPCCalc(dealer string, wc, epc, sysSize float64) float64 {
	if len(dealer) > 0 {
		if wc < 44287 {
			return epc
		} else {
			return 1000 / sysSize
		}
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculateTeamCount
 * DESCRIPTION:     calculates the "team_count" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateTeamCount(rep1Team, rep2Team string, credit float64, repPay float64) (result float64) {
	if credit > 0 {
		if len(rep1Team) > 0 && len(rep2Team) > 0 {
			if credit != repPay {
				return 2
			} else {
				return 1
			}
		}
	}
	return 1
}

/******************************************************************************
 * FUNCTION:        calculatePerTeamSales
 * DESCRIPTION:     calculates the "per_team_Sales" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculatePerTeamSales(rep1Team, rep2Team string, credit, repPay float64) float64 {
	if credit > 0 {
		if len(rep1Team) > 0 && len(rep2Team) > 0 {
			if credit != repPay {
				return 2
			} else {
				return 1
			}
		}
	}
	return 1
}

/******************************************************************************
 * FUNCTION:        calculatePerTeamKw
 * DESCRIPTION:     calculates the "per_team_kw" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculatePerTeamKw(rep1Team, rep2Team string, credit, repPay, sysSize float64) float64 {
	if credit > 0 {
		if len(rep1Team) > 0 && len(rep2Team) > 0 {
			if credit != repPay {
				return sysSize / 2
			} else {
				return sysSize
			}
		} else {
			return sysSize
		}
	}
	return 1
}

/******************************************************************************
 * FUNCTION:        calculateRRR
 * DESCRIPTION:     calculates the "r_rr" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateRRR(repName string, val1, val2 float64) (result float64) {
	if len(repName) > 0 {
		return val1 + val2
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculateRAdderTotal
 * DESCRIPTION:     calculates the "r_adder_total" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateRAdderTotal(repName string, val1, val2, val3, val4, val5 float64) (result float64) {
	if len(repName) > 0 {
		return val1 + val2 + val2 + val3 + val4 + val5
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculateRAdderPerKw
 * DESCRIPTION:     calculates the "r_adder_per_kw" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateRAdderPerKw(repName string, val1, val2 float64) (result float64) {
	if len(repName) > 0 {
		return val1 / val2
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculateRPayRateSubTotal
 * DESCRIPTION:     calculates the "r_pay_rate_sub_total" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateRPayRateSubTotal(repName string, val1, val2 float64) (result float64) {
	if len(repName) > 0 {
		return val1 - val2
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculateRNetEpc
 * DESCRIPTION:     calculates the "r_net_epc" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateRNetEpc(epcCalc, val1, val2, val3, val4, val5 float64) (result float64) {
	if epcCalc > 0 {
		result = (val1 - (val2 - val3 + val4)) / val5
		return math.Round(result*1000) / 1000
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculateRminmaxCorrect
 * DESCRIPTION:     calculates the "r_min_max_connect" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateRminmaxCorrect(repName string, val1, val2, val3 float64) (result float64) {
	if len(repName) > 0 {
		if val1 < val2 {
			return val2
		} else if val1 > val3 {
			return val3
		} else {
			return val1
		}
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculateRCommTotal
 * DESCRIPTION:     calculates the "r_comm_total" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateRCommTotal(repName string, val1, val2, val3 float64) (result float64) {
	if len(repName) > 0 {
		result = (val1 * val2) + val3
		return math.Round(result*100) / 100
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculateRStatusCommCheck
 * DESCRIPTION:     calculates the "r_status_comm_check" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateRStatusCommCheck(repName, val1 string, val2 float64) (result float64) {
	if len(repName) > 0 {
		if val1 == "Cancel" {
			return 0
		} else if val1 == "Shaky" {
			return 0
		} else {
			return val2
		}
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        calculateRPayRateSemi
 * DESCRIPTION:     calculates the "r_pay_rate_semi" value based on the provided data
 * RETURNS:        	gross revenue
 *****************************************************************************/
func calculateRPayRateSemi(repName, val1 string, val2 float64) (result float64) {
	if len(repName) > 0 {
		if val1 == "Cancel" {
			return 0
		} else if val1 == "Shaky" {
			return 0
		} else {
			return val2
		}
	}
	return 0
}
