package arcalc

import (
	datamgmt "OWEApp/owehub-calc/dataMgmt"
	"time"
)

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
