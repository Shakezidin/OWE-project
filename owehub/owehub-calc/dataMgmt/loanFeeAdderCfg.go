/**************************************************************************
 * File            : loanFeeAdderCfg.go
 * DESCRIPTION     : This file contains the model and data form LoanFeeAdder
 * DATE            : 05-May-2024
 **************************************************************************/

package datamgmt

import log "OWEApp/shared/logger"

type LoanFeeAdder struct {
	uniqueId string
	AddrAmt  float64
}

type LoanFeeAdderCfgStruct struct {
	LoanFeeAdderList []LoanFeeAdder
}

var (
	LoanFeeAdderCfg LoanFeeAdderCfgStruct
)

/******************************************************************************
 * FUNCTION:        CalculateLoanFee
 * DESCRIPTION:     calculates the "loanFee" value based on the provided data
 * RETURNS:         loanFee
 *****************************************************************************/
func (LoanFeeAdderCfg *LoanFeeAdderCfgStruct) CalculateLoanFee(dealer string, uniqueId string) (loanFee float64) {
	log.EnterFn(0, "CalculateLoanFee")
	defer func() { log.ExitFn(0, "CalculateLoanFee", nil) }()
	if len(dealer) > 0 {
		for _, data := range LoanFeeAdderCfg.LoanFeeAdderList {
			if data.uniqueId == uniqueId {
				loanFee += data.AddrAmt
			}
		}
	}
	return loanFee
}
