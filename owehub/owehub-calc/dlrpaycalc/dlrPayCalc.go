/**************************************************************************
 * File            : dlrPayInitCalc.go
 * DESCRIPTION     : This file contains functions to perform
 *							Calculations for DealerPay
 * DATE            : 28-April-2024
 **************************************************************************/

package arcalc

import (
	log "OWEApp/shared/logger"
)

/******************************************************************************
 * FUNCTION:            ExecDlrPayInitialCalculation
 * DESCRIPTION:        Execute initial calculations for DealerPay
 * INPUT:                       N/A
 * RETURNS:             error
 *****************************************************************************/
func ExecDlrPayInitialCalculation(resultChan chan string) {
	var (
		err error
	)
	log.EnterFn(0, "ExecDlrPayInitialCalculation")
	defer func() { log.ExitFn(0, "ExecDlrPayInitialCalculation", err) }()

	resultChan <- "SUCCESS"
}
