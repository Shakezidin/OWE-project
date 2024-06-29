package arcalc

import (
	datamgmt "OWEApp/owehub-calc/dataMgmt"
	log "OWEApp/shared/logger"
	"math"
	"time"
)

/******************************************************************************
* FUNCTION:        calculateRR
* DESCRIPTION:     calculates the "rr" value based on the provided data
* RETURNS:         RR
*****************************************************************************/
func calculateRR(repName string, val1, val2 float64) (result float64) {
	log.EnterFn(0, "calculateRR")
	defer func() { log.ExitFn(0, "calculateRR", nil) }()
	if len(repName) > 0 {
		return val1 + val2
	}
	return 0
}

/******************************************************************************
* FUNCTION:        calculateRCommStatudCheck
* DESCRIPTION:     calculates the "r_status_comm_check" value based on the provided data
* RETURNS:         result
*****************************************************************************/
func calculateRCommStatudCheck(repName, salesRepType, status string, RCommTotal float64) (result float64) {
	log.EnterFn(0, "calculateRCommStatudCheck")
	defer func() { log.ExitFn(0, "calculateRCommStatudCheck", nil) }()
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
* FUNCTION:        calculateR1CommStatudCheck
* DESCRIPTION:     calculates the "r_status_comm_check" value based on the provided data
* RETURNS:         result
*****************************************************************************/
func calculateR1CommStatudCheck(commissionModel, repName, salesRepType, status string, RCommTotal float64) (result float64) {
	log.EnterFn(0, "calculateR1CommStatudCheck")
	defer func() { log.ExitFn(0, "calculateR1CommStatudCheck", nil) }()
	if commissionModel == "standard" {
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
	} else {
		if len(repName) > 0 {
			if status == "Cancel" {
				return 0
			} else if status == "Shaky" {
				return 0
			} else {
				return RCommTotal
			}
		}
	}
	return 0
}

/******************************************************************************
* FUNCTION:        calculateRepKw
* DESCRIPTION:     calculates the "rep_kw" value based on the provided data
* RETURNS:         float64
*****************************************************************************/
func calculateRepKw(rep string, netEpc, SysSize, adderPerKw float64) float64 {
	log.EnterFn(0, "calculateRepKw")
	defer func() { log.ExitFn(0, "calculateRepKw", nil) }()
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
* RETURNS:         result
*****************************************************************************/
func calculateRPayRateSubTotal(repName string, val1, val2 float64) (result float64) {
	log.EnterFn(0, "calculateRPayRateSubTotal")
	defer func() { log.ExitFn(0, "calculateRPayRateSubTotal", nil) }()
	if len(repName) > 0 {
		return val1 - val2
	}
	return 0
}

/******************************************************************************
* FUNCTION:        calculateR1PayRateSubTotal
* DESCRIPTION:     calculates the "r_pay_rate_sub_total" value based on the provided data
* RETURNS:         result
*****************************************************************************/
func calculateR1PayRateSubTotal(commissionModels, repName, source string, val1, val2, val3, val4 float64) (result float64) {
	log.EnterFn(0, "calculateR1PayRateSubTotal")
	defer func() { log.ExitFn(0, "calculateR1PayRateSubTotal", nil) }()
	if commissionModels == "standard" {
		if len(repName) > 0 {
			return val1 - val2
		}
	} else {
		if len(repName) > 0 {
			if source == "Onyx D2D" {
				return val1 - val3
			} else {
				return val4 - val1 - val3
			}
		}
	}
	return 0
}

/******************************************************************************
* FUNCTION:        CalculatePayRateSemi
* DESCRIPTION:     calculates the "contract$$" value based on the provided data
* RETURNS:         payRateSemi
*****************************************************************************/
func CalculatePayRateSemi(Rep string, rl, rate, adjustment, r1Incentive, epcCalc float64) (payRateSemi float64) {
	log.EnterFn(0, "CalculatePayRateSemi")
	defer func() { log.ExitFn(0, "CalculatePayRateSemi", nil) }()
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
* FUNCTION:        CalculateR1PayRateSemi
* DESCRIPTION:     calculates the "contract$$" value based on the provided data
* RETURNS:         payRateSemi
*****************************************************************************/
func CalculateR1PayRateSemi(commissionModels, Rep, source string, rl, rate, adjustment, r1Incentive, epcCalc, sysSize, perRepKw, netEpc float64, wc time.Time) (payRateSemi float64) {
	log.EnterFn(0, "CalculateR1PayRateSemi")
	defer func() { log.ExitFn(0, "CalculateR1PayRateSemi", nil) }()
	date, _ := time.Parse("2006-01-02", "2023-12-20")
	if commissionModels == "standard" {
		if len(Rep) > 0 && Rep != "" {
			if rl <= 0 {
				return rate + adjustment + r1Incentive
			} else if rate <= 0 {
				return ((epcCalc - rl) * 1000) + adjustment + r1Incentive
			} else {
				return payRateSemi
			}
		}
	} else {
		payRateSemi = rl * (perRepKw * 1000)

		if len(Rep) > 0 && sysSize != 0 {
			if Rep == "Scott McCollester" && wc.After(date) {
				payRateSemi = 1.88 * (perRepKw * 1000)
			} else if source == "Onyx D2D" {
				payRateSemi = math.Round((netEpc - 1.98) * sysSize)
			}
		}

		return payRateSemi
	}
	return payRateSemi
}

/******************************************************************************
* FUNCTION:        CalculateEPCCalc
* DESCRIPTION:    calculates the EPC based on the provided data
* RETURNS:         float64
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
* RETURNS:         contractdoldol
*****************************************************************************/
func CalculateContractDolDol(netEpc float64, contract float64, sysSize float64) (contractdoldol float64) {
	log.EnterFn(0, "CalculateContractDolDol")
	defer func() { log.ExitFn(0, "CalculateContractDolDol", nil) }()
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
* RETURNS:         result
*****************************************************************************/
func calculateRAdderPerKw(repName string, val1, val2 float64) (result float64) {
	log.EnterFn(0, "calculateRAdderPerKw")
	defer func() { log.ExitFn(0, "calculateRAdderPerKw", nil) }()
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
	log.EnterFn(0, "calculateRAdderTotal")
	defer func() { log.ExitFn(0, "calculateRAdderTotal", nil) }()
	if len(repName) > 0 {
		return val1 + val2 + val3 + val4 + val5
	}
	return 0
}

/******************************************************************************
* FUNCTION:        calculateRAdderTotal
* DESCRIPTION:     calculates the "r_adder_total" value based on the provided data
* RETURNS:         result
*****************************************************************************/
func calculateR1AdderTotal(repName, commissionModel string, val1, val2, val3, val4, val5 float64) (result float64) {
	log.EnterFn(0, "calculateR1AdderTotal")
	defer func() { log.ExitFn(0, "calculateR1AdderTotal", nil) }()
	if commissionModel == "standard" {
		if len(repName) > 0 {
			return val1 + val2 + val3 + val4 + val5
		}
	} else {
		if len(repName) > 0 {
			return val1 + val3 + val4 + val5
		}
	}
	return 0
}

/******************************************************************************
* FUNCTION:        calculateR1CommTotal
* DESCRIPTION:     calculates the "calculateR1CommTotal" value based on the provided data
* RETURNS:         r1CommTotal
*****************************************************************************/
func calculateR2CommTotal(rep2, source string, rMinOrMax, perRepKw, rCredit float64) (r1CommTotal float64) {
	log.EnterFn(0, "calculateRCommTotal")
	defer func() { log.ExitFn(0, "calculateRCommTotal", nil) }()
	if len(rep2) > 0 {
		return math.Round((rMinOrMax * perRepKw) + rCredit)
	}
	return r1CommTotal
}

/******************************************************************************
* FUNCTION:        calculateR1CommTotal
* DESCRIPTION:     calculates the "calculateR1CommTotal" value based on the provided data
* RETURNS:         r1CommTotal
*****************************************************************************/
func calculateR1CommTotal(commissionModel, rep1, source string, rMinOrMax, perRepKw, rCredit float64, wc time.Time) (r1CommTotal float64) {
	log.EnterFn(0, "calculateR1CommTotal")
	defer func() { log.ExitFn(0, "calculateR1CommTotal", nil) }()
	var multiplier float64
	if commissionModel == "standard" {
		if len(rep1) > 0 {
			if source == "BPN: SETTER" {
				return math.Round(((rMinOrMax * perRepKw) + rCredit) * 0.6)
			} else {
				return math.Round((rMinOrMax * perRepKw) + rCredit)
			}
		}
	} else {
		if len(rep1) > 0 {
			switch source {
			case "REP at 1.88 RL":
				multiplier = 0.8
			case "P&S":
				multiplier = 0.2
			case "Onyx D2D":
				if rep1 == "Ramon Roybal" {
					multiplier = 0.75
				} else if rep1 == "Joshua Freitas" {
					multiplier = 0.9
				} else if rep1 == "Custom Construction" {
					multiplier = 0.4
				}
			case "Onyx Solar":
				if rep1 == "Theo Rosenberg" {
					if source != "P&S" {
						multiplier = 0.65
					} else {
						multiplier = 0.3
					}
				} else {
					dateThreshold, _ := time.Parse("2006-01-02", "2024-04-22")
					if wc.Before(dateThreshold) {
						multiplier = 0.5
					} else {
						multiplier = 0.6
					}
				}
			default:
				multiplier = 0.0
			}

			return math.Round(rMinOrMax+rCredit) * multiplier
		}
	}
	return r1CommTotal
}

/******************************************************************************
* FUNCTION:        calculateRMinOrMax
* DESCRIPTION:     calculates the "calculateR1MinOrMax" value based on the provided data
* RETURNS:         r1MinOrMax
*****************************************************************************/
func calculateRMinOrMax(rep1 string, rPayRateSubTotal, minRate, maxRate float64) (rMinOrMax float64) {
	log.EnterFn(0, "calculateRMinOrMax")
	defer func() { log.ExitFn(0, "calculateRMinOrMax", nil) }()
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
* FUNCTION:        calculateRDrawAmount
* DESCRIPTION:     calculates the "r1 draw amount" value based on the provided data
* RETURNS:         r1DrawAmount
*****************************************************************************/
func calculateRDrawAmount(rCommStatusCheck, drawMax, perRepSales, drawPerentage float64) (r1DrawAmount float64) {
	log.EnterFn(0, "calculateRDrawAmount")
	defer func() { log.ExitFn(0, "calculateRDrawAmount", nil) }()
	if rCommStatusCheck > 0 {
		drawPerentage = drawPerentage / 100
		if (drawMax * perRepSales) < (rCommStatusCheck * drawPerentage) {
			r1DrawAmount = math.Round(drawMax * perRepSales)
		} else {
			r1DrawAmount = math.Round(rCommStatusCheck * drawPerentage)
		}
	}
	return r1DrawAmount
}

/******************************************************************************
* FUNCTION:        calculatePerRepSales
* DESCRIPTION:     calculates the "per rep sales" value based on the provided data
* RETURNS:         perRepsales
*****************************************************************************/
func calculatePerRepSales(rep1, rep2 string) (perRepsales float64) {
	log.EnterFn(0, "calculatePerRepSales")
	defer func() { log.ExitFn(0, "calculatePerRepSales", nil) }()
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
	log.EnterFn(0, "calculateApptBalance")
	defer func() { log.ExitFn(0, "calculateApptBalance", nil) }()
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
func calculateApptAmount(commissionModels string, apptSetStatusCheck, apptsetTotal float64) (apptAmount float64) {
	log.EnterFn(0, "calculateApptAmount")
	defer func() { log.ExitFn(0, "calculateApptAmount", nil) }()
	if commissionModels == "standard" {
		if apptSetStatusCheck > 0 {
			return apptSetStatusCheck
		}
	} else {
		if apptsetTotal > 0 {
			return apptsetTotal
		}
	}
	return 0
}

/******************************************************************************
* FUNCTION:        calculateApptSetStatusCheck
* DESCRIPTION:     calculates the "appt set status check" value based on the provided data
* RETURNS:         apptSetStatusCheck
*****************************************************************************/
func calculateApptSetStatusCheck(apptSetter, status string, apptSetTotal float64) (apptSetStatusCheck float64) {
	log.EnterFn(0, "calculateApptSetStatusCheck")
	defer func() { log.ExitFn(0, "calculateApptSetStatusCheck", nil) }()
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
func calculateApptSetTotal(commissionModel, apptSetter, source string, rep1CommStatusCheck, payRate, systemSize float64) (apptSetTotal float64) {
	log.EnterFn(0, "calculateApptSetTotal")
	defer func() { log.ExitFn(0, "calculateApptSetTotal", nil) }()
	if commissionModel == "standard" {
		if len(apptSetter) > 0 {
			if source == "BPN: SETTER" {
				return rep1CommStatusCheck * 0.8
			} else {
				return math.Round(payRate * systemSize)
			}
		}
	} else {
		if len(apptSetter) > 0 {
			return payRate * systemSize
		}
	}
	return apptSetTotal
}

/***************************************************************************
* FUNCTION:        calculateR1DrawAmount
* DESCRIPTION:     calculates the "r1 draw amount" value based on the provided data
* RETURNS:         netEpc
*****************************************************************************/
func calculateRNetEpc(rep string, contractCalc, adderTotal, RloanFee, loanFee, systemSize float64) (netEpc float64) {
	log.EnterFn(0, "calculateRNetEpc")
	defer func() { log.ExitFn(0, "calculateRNetEpc", nil) }()
	if len(rep) > 0 {
		netEpc = math.Round(((contractCalc-(adderTotal-RloanFee+loanFee))/systemSize/1000)*1000) / 1000
	}
	return netEpc
}

/***************************************************************************
* FUNCTION:        calculateR1NetEpc
* DESCRIPTION:     calculates the "r1 draw amount" value based on the provided data
* RETURNS:         netEpc
*****************************************************************************/
func calculateR1NetEpc(perRepKw, contractCalc, adderTotal, RloanFee, loanFee, systemSize float64) (netEpc float64) {
	log.EnterFn(0, "calculateR1NetEpc")
	defer func() { log.ExitFn(0, "calculateR1NetEpc", nil) }()
	if perRepKw > 0 {
		netEpc = math.Round(((contractCalc-(adderTotal-RloanFee+loanFee))/systemSize/1000)*1000) / 1000
	}
	return netEpc
}

/******************************************************************************
* FUNCTION:        CalculateStatusDate
* DESCRIPTION:     calculates the "status_date" value based on the provided data
* RETURNS:         time.Time
*****************************************************************************/
func CalculateStatusDate(uniqueID string, shaky bool, pto, instSys, cancel, ntp, permSub, wc time.Time) time.Time {
	log.EnterFn(0, "CalculateStatusDate")
	defer func() { log.ExitFn(0, "CalculateStatusDate", nil) }()
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

/******************************************************************************
* FUNCTION:        calculateR2DmBal
* DESCRIPTION:     calculates the "r2 dm balance" value based on the provided data
* RETURNS:         r2DmBal
*****************************************************************************/
func calculateR2DmBal(R2DmName string, r2DmCOmm, r2DmPaid float64) (r2DmBal float64) {
	log.EnterFn(0, "calculateR2DmBal")
	defer func() { log.ExitFn(0, "calculateR2DmBal", nil) }()
	if len(R2DmName) > 0 {
		return math.Round(r2DmCOmm - r2DmPaid)
	}

	return r2DmBal
}

/******************************************************************************
* FUNCTION:        calculateR2Comm
* DESCRIPTION:     calculates the "r2 dm comm" value based on the provided data
* RETURNS:         r2DmComm
*****************************************************************************/
func calculateR2Comm(r2DmName string, r2DmRate, perTeamKw float64) (r2DmComm float64) {
	log.EnterFn(0, "calculateR2Comm")
	defer func() { log.ExitFn(0, "calculateR2Comm", nil) }()
	if len(r2DmName) > 0 {
		return math.Round(r2DmRate * perTeamKw)
	}
	return r2DmComm
}

/******************************************************************************
* FUNCTION:        calculateR2DirComm
* DESCRIPTION:     calculates the "r2 dm comm" value based on the provided data
* RETURNS:         r2DirComm
*****************************************************************************/
func calculateR2DirComm(r2DirName string, r2DirRate, perTeamKw float64) (r2DmComm float64) {
	log.EnterFn(0, "calculateR2DirComm")
	defer func() { log.ExitFn(0, "calculateR2DirComm", nil) }()
	if len(r2DirName) > 0 {
		return math.Round(r2DirRate * perTeamKw)
	}
	return r2DmComm
}

/******************************************************************************
* FUNCTION:        calculateTeamCount
* DESCRIPTION:     calculates the "team count" value based on the provided data
* RETURNS:         teamCount
*****************************************************************************/
func calculateTeamCount(rep1Team, rep2Team string) (teamCount float64) {
	log.EnterFn(0, "calculateTeamCount")
	defer func() { log.ExitFn(0, "calculateTeamCount", nil) }()
	if len(rep1Team) > 0 {
		if len(rep2Team) > 0 && rep1Team != rep2Team {
			return 2
		} else {
			return 1
		}
	} else {
		return 1
	}
}

/******************************************************************************
* FUNCTION:        calculateR2Bal
* DESCRIPTION:     calculates the "r2 bal" value based on the provided data
* RETURNS:         r2DirBal
*****************************************************************************/
func calculateR2Bal(r2DirName string, r2DirComm, R2DirPaid float64) (r2DirBal float64) {
	log.EnterFn(0, "calculateR2Bal")
	defer func() { log.ExitFn(0, "calculateR2Bal", nil) }()
	if len(r2DirName) > 0 {
		return r2DirComm - R2DirPaid
	}
	return r2DirBal
}

/******************************************************************************
* FUNCTION:        calculateR1Bal
* DESCRIPTION:     calculates the "r bal" value based on the provided data
* RETURNS:         r1slBal
*****************************************************************************/
func calculateR1Bal(R1SlName string, R1SlComm, R1SlPaid float64) (r1SlBal float64) {
	log.EnterFn(0, "calculateR1Bal")
	defer func() { log.ExitFn(0, "calculateR1Bal", nil) }()
	if len(R1SlName) > 0 {
		return math.Round(R1SlComm - R1SlPaid)
	}
	return r1SlBal
}

/******************************************************************************
* FUNCTION:        calculateR1Comm
* DESCRIPTION:     calculates the "r2 dir bal" value based on the provided data
* RETURNS:         r1SlComm
*****************************************************************************/
func calculateR1Comm(R1SlName string, R1SlRate, perTeamKw float64) (r1SlComm float64) {
	log.EnterFn(0, "calculateR1Comm")
	defer func() { log.ExitFn(0, "calculateR1Comm", nil) }()
	if len(R1SlName) > 0 {
		return math.Round(R1SlRate * perTeamKw)
	}
	return r1SlComm
}

/******************************************************************************
* FUNCTION:        CalculateSalesRepType
* DESCRIPTION:     calculates the "r2 dir bal" value based on the provided data
* RETURNS:         salesRepType
*****************************************************************************/
func CalculateSalesRepType(uniqueId, rep1, rep2 string) (salesRepType string) {
	log.EnterFn(0, "CalculateSalesRepType")
	defer func() { log.ExitFn(0, "CalculateSalesRepType", nil) }()
	var ax string
	r1Tracking := datamgmt.DealerOwnersConfig.CalculateR1Tracking(rep1)
	r2Tracking := datamgmt.DealerOwnersConfig.CalculateR2Tracking(rep2)
	ay := calculateAy(uniqueId, r1Tracking, r2Tracking)
	if ay != "Dealer Owner" {
		ax = "Sales Rep"
	}
	return ax
}

/******************************************************************************
* FUNCTION:        calculateAy
* DESCRIPTION:     calculates the "ay" value based on the provided data
* RETURNS:         ay
*****************************************************************************/
func calculateAy(uniqueId, r1Tracking, r2Tracking string) (ay string) {
	log.EnterFn(0, "calculateAy")
	defer func() { log.ExitFn(0, "calculateAy", nil) }()
	if len(uniqueId) > 0 {
		if r1Tracking == "Sales Rep" {
			return "Sales Rep"
		} else if r1Tracking == "Dealer Owner" && (r2Tracking == "No Rep 2" || r2Tracking == "Dealer Owner") {
			return "Dealer Owner"
		} else {
			return "Sales Rep 2"
		}
	}
	return ay
}
