package arcalc

import (
	datamgmt "OWEApp/owehub-calc/dataMgmt"
	log "OWEApp/shared/logger"
	"math"
	"time"
)

/******************************************************************************
* FUNCTION:        calculatePerTeamKw
* DESCRIPTION:     calculates the per team kw value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func calculatePerTeamKw(rep1, rep2 string, date time.Time, sysSize float64) float64 {
	log.EnterFn(0, "calculatePerTeamKw")
	defer func() { log.ExitFn(0, "calculatePerTeamKw", nil) }()
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
	log.EnterFn(0, "calculatePerRepKw")
	defer func() { log.ExitFn(0, "calculatePerRepKw", nil) }()
	if len(rep1) > 0 && len(rep2) > 0 {
		return sysSize / 2
	} else if len(rep1) > 0 || len(rep2) > 0 {
		return sysSize / 1
	} else {
		return perRepKw
	}
}

/******************************************************************************
 * FUNCTION:        CalculateAREPCCalc
 * DESCRIPTION:    calculates the EPC based on the provided data
 * RETURNS:         contact amount
 *****************************************************************************/
func CalculateAREPCCalc(contractCalc float64, contractDate time.Time, epc float64, systemSize float64, wc1Filterdate time.Time) float64 {

	log.EnterFn(0, "CalculateAREPCCalc")
	defer func() { log.ExitFn(0, "CalculateAREPCCalc", nil) }()

	if contractCalc > 0.0 {
		if excelDateFromTime(contractDate) < 44287 {
			return epc
		} else {
			return contractCalc / 1000 / systemSize
		}
	}
	return 0
}

func excelDateFromTime(t time.Time) int {
	const excelEpoch = "1899-12-30"
	excelEpochDate, _ := time.Parse("2006-01-02", excelEpoch)
	duration := t.Sub(excelEpochDate)
	return int(duration.Hours() / 24)
}

/******************************************************************************
 * FUNCTION:        CalculateRepContractCalc
 * DESCRIPTION:     Calculate Contract calc
 * RETURNS:         contact amount
 *****************************************************************************/
func CalculateRepContractCalc(epc float64, contractTotal float64, systemSize float64) float64 {

	log.EnterFn(0, "CalculateRepContractCalc")
	defer func() { log.ExitFn(0, "CalculateRepContractCalc", nil) }()

	if epc > 0.0 {
		if contractTotal > 0 {
			return contractTotal
		} else {
			return epc * 1000 * systemSize
		}
	}
	return 0
}

/******************************************************************************
 * FUNCTION:        CalculateRepRBalance
 * DESCRIPTION:     Calculate rep balance
 * RETURNS:         balance amount
 *****************************************************************************/
func CalculateRepRBalance(rep string, commStatusCheck, commPaid float64) (balance float64) {
	log.EnterFn(0, "CalculateRepRBalance")
	defer func() { log.ExitFn(0, "CalculateRepRBalance", nil) }()
	if len(rep) > 0 {
		balance = math.Round(commStatusCheck - commPaid)
	}
	return balance
}

/******************************************************************************
 * FUNCTION:        CalculateType
 * DESCRIPTION:     Calculate pr_appt_type
 * RETURNS:         types
 *****************************************************************************/
func CalculateType(data, val string) (types string) {
	log.EnterFn(0, "CalculateType")
	defer func() { log.ExitFn(0, "CalculateType", nil) }()
	if len(data) > 0 {
		return val
	}
	return types
}

/******************************************************************************
 * FUNCTION:        calculatePrRDType
 * DESCRIPTION:     Calculate pr r d type
 * RETURNS:         types
 *****************************************************************************/
func calculatePrRDType(dealer string, repDrawAmount float64) (types string) {
	log.EnterFn(0, "calculatePrRDType")
	defer func() { log.ExitFn(0, "calculatePrRDType", nil) }()
	if len(dealer) > 0 {
		if repDrawAmount > 0 {
			types = "Draw"
		} else {
			types = "Adjustment"
		}
	}
	return types
}

/******************************************************************************
 * FUNCTION:        calculatePrRFType
 * DESCRIPTION:     Calculate pr r F type
 * RETURNS:         types
 *****************************************************************************/
func calculatePrRFType(dealer string, repBalance float64) (types string) {
	log.EnterFn(0, "calculatePrRFType")
	defer func() { log.ExitFn(0, "calculatePrRFType", nil) }()
	if len(dealer) > 0 {
		if repBalance > 0 {
			types = "Final"
		} else {
			types = "Adjustment"
		}
	}
	return types
}

/******************************************************************************
 * FUNCTION:        calculatePrRBType
 * DESCRIPTION:     Calculate pr r B type
 * RETURNS:         types
 *****************************************************************************/
func calculatePrRBType(dealer string) (types string) {
	log.EnterFn(0, "calculatePrRBType")
	defer func() { log.ExitFn(0, "calculatePrRBType", nil) }()
	if len(dealer) > 0 {
		return "Bonus"
	}
	return types
}

/******************************************************************************
 * FUNCTION:        calculatePrRType
 * DESCRIPTION:     Calculate pr r R type
 * RETURNS:         types
 *****************************************************************************/
func calculatePrRType(dealer, Val string) (types string) {
	log.EnterFn(0, "calculatePrRType")
	defer func() { log.ExitFn(0, "calculatePrRType", nil) }()
	if len(dealer) > 0 {
		return Val
	}
	return types
}
