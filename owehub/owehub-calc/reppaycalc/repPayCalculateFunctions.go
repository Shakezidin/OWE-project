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
func calculateR1RR(repName string, val1, val2 float64) (result float64) {
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
func calculateRCommStatudCheck(repName, salesRepType, status string, R1CommTotal float64) (result float64) {
    if len(repName) > 0 {
        if salesRepType == "Sales Rep 2" {
            return 0
        } else if status == "Cancel" {
            return 0
        } else if status == "Shaky" {
            return 0
        } else {
            return R1CommTotal
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
func calculateR1PayRateSubTotal(repName string, val1, val2 float64) (result float64) {
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
func CalculatePayRateSemi(Rep1 string, rl, rate, adjustment, r1Incentive, epcCalc float64) (payRateSemi float64) {
    if len(Rep1) > 0 && Rep1 != "" {
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
* RETURNS:         gross revenue
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
* RETURNS:         gross revenue
*****************************************************************************/
func calculateR1CommTotal(rep1, source string, r1MinOrMax, perRepKw, r1Credit float64) (r1CommTotal float64) {
    if len(rep1) > 0 {
        if source == "BPN: SETTER" {
            return math.Round(((r1MinOrMax * perRepKw) + r1Credit) * 0.6)
        } else {
            math.Round((r1MinOrMax * perRepKw) + r1Credit)
        }
    }
    return r1CommTotal
}
 
/******************************************************************************
* FUNCTION:        calculateR1MinOrMax
* DESCRIPTION:     calculates the "calculateR1MinOrMax" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func calculateR1MinOrMax(rep1 string, r1PayRateSubTotal, minRate, maxRate float64) (r1MinOrMax float64) {
    if len(rep1) > 0 {
        if r1PayRateSubTotal < minRate {
            return minRate
        } else if r1PayRateSubTotal > maxRate {
            return maxRate
        } else {
            return r1PayRateSubTotal
        }
    }
    return r1MinOrMax
}
 