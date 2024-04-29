/**************************************************************************
 * File            : repPayCalc.go
 * DESCRIPTION     : This file contains functions to perform
 *							Calculations for RepPay
 * DATE            : 28-April-2024
 **************************************************************************/

package arcalc

import (
	log "OWEApp/shared/logger"
)

/******************************************************************************
 * FUNCTION:            ExecRepPayInitialCalculation
 * DESCRIPTION:        Execute initial calculations for RepPay
 * INPUT:                       N/A
 * RETURNS:             error
 *****************************************************************************/
func ExecRepPayInitialCalculation(resultChan chan string) {
	var (
		err error
	)
	log.EnterFn(0, "ExecRepPayInitialCalculation")
	defer func() { log.ExitFn(0, "ExecRepPayInitialCalculation", err) }()

	resultChan <- "SUCCESS"
}
