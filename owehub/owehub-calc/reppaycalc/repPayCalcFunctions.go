package arcalc

import (
	datamgmt "OWEApp/owehub-calc/dataMgmt"
	log "OWEApp/shared/logger"
	"math"
	"time"
)

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
* FUNCTION:        CalculateContractDolDol
* DESCRIPTION:     calculates the "contract$$" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func CalculateAdderLf(dealer string, addr, expence, autoadder, loanfee, rebate, referral float64) (adderlf float64) {
	log.FuncErrorTrace(0, "addr : %v expence : %v autoadder : %v loanFee : %v rabate : %v referral : %v", addr, expence, autoadder, loanfee, rebate, referral)
	if len(dealer) > 0 {
		return addr + expence + autoadder + loanfee + rebate + referral
	}
	return adderlf
}

/******************************************************************************
* FUNCTION:        calculateAdderPerKW
* DESCRIPTION:     calculates the "adder_pw" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func calculateAdderPerKW(dealer string, adderLF, sysSize float64) (adderPerKW float64) {

	adderPerKW = 0
	if len(dealer) > 0 {
		adderPerKW = adderLF / sysSize
	}
	return adderPerKW
}

/******************************************************************************
* FUNCTION:        CalculateContractDolDol
* DESCRIPTION:     calculates the "contract$$" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func CalculatePayRateSemi(dealer, commission_models, rep_1 string, epcCalc, rl, systemSize, netEpc float64, wc time.Time) (payRateSemi float64) {
	date, _ := time.Parse("2006,01,02", "2023,12,20")
	if commission_models == "standard" {
		if len(dealer) > 0 {
			return (epcCalc - rl) * 1000
		}
		return 0
	} else {
		if len(dealer) > 0 && systemSize > 0 {
			if rep_1 == "Scott McCollester" && wc.After(date) {
				return 1.88 * (systemSize * 1000)
			} else if dealer == "Onyx D2D" {
				return (netEpc - 1.98) * systemSize
			} else {
				return rl * (systemSize * 1000)
			}
		}
	}
	return 0
}

/******************************************************************************
* FUNCTION:        calculatePayRateSubTotal
* DESCRIPTION:     calculates the "pay_rate_sub_total" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func calculatePayRateSubTotal(dealer, commission_models string, payRateSemi, adderPer, contractdoldol, adderLF float64) float64 {
	if commission_models == "standard" {
		if len(dealer) > 0 {
			return (payRateSemi - adderPer)
		}
		return 0
	} else {
		if len(dealer) > 0 {
			return (contractdoldol - payRateSemi - adderLF)
		}
	}
	return 0
}

/******************************************************************************
* FUNCTION:        calculateCommTotal
* DESCRIPTION:     calculates the "comm_total" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func calculateCommTotal(dealer, commission_models, rep_1, source string, payRateSubTotal, sysSize, dealerPaymentBonus, contractTotal, baseCost, adderLF float64) float64 {
	if commission_models == "standard" {
		if len(dealer) > 0 {
			commTotal := (payRateSubTotal * sysSize) + dealerPaymentBonus
			return math.Round(commTotal*100) / 100
		}
		return 0
	} else {
		if len(dealer) > 0 && dealer == "Onyx D2D" && (rep_1 == "Ramon Roybal" || rep_1 == "Joshua Freitas") {
			commTotal := ((contractTotal - (baseCost - adderLF)) + dealerPaymentBonus) * 0.25
			return math.Round(commTotal*100) / 100
		} else if rep_1 == "Theo Rosenberg" {
			if source == "P&S" {
				commTotal := ((contractTotal - (baseCost - adderLF)) + dealerPaymentBonus) * 0.4
				return math.Round(commTotal*100) / 100
			} else {
				commTotal := ((contractTotal - (baseCost - adderLF)) + dealerPaymentBonus) * 0.15
				return math.Round(commTotal*100) / 100
			}
		} else {
			commTotal := ((contractTotal - (baseCost - adderLF)) + dealerPaymentBonus) * 0.8
			return math.Round(commTotal*100) / 100
		}
	}
	return 0
}

/******************************************************************************
* FUNCTION:        calculateStatusCheck
* DESCRIPTION:     calculates the "status_total" value based on the provided data
* RETURNS:         gross revenue
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
* RETURNS:         gross revenue
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
* FUNCTION:        calculateR1Balance
* DESCRIPTION:     calculates the "r1_balance" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func calculatePerTeamKw(rep1, rep2 string, date time.Time, sysSize float64) float64 {
	var balance float64
	r1Team := datamgmt.TeamDataCfg.CalculateRTeamName(rep1, date)
	r2Team := datamgmt.TeamDataCfg.CalculateRTeamName(rep2, date)
	if r1Team != r2Team {
		balance = 2
	} else {
		balance = 1
	}
	return sysSize / balance
}

/******************************************************************************
* FUNCTION:        calculatePerRepKw
* DESCRIPTION:     calculates the "per_rep_kw" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func calculatePerRepKw(rep1, rep2 string, sysSize float64) (perRepKw float64) {
	if len(rep1) > 0 && len(rep2) > 0 {
		return sysSize / 2
	} else if len(rep1) > 0 || len(rep2) > 0 {
		return sysSize / 1
	} else {
		return perRepKw
	}
}
