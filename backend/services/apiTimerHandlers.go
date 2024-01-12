/**************************************************************************
 * File       	    : timerHandlers.go
 * DESCRIPTION     : This file contains functions for timer handler
 * DATE            : 11-Jan-2024
 **************************************************************************/

package ApiHandler

import (
	log "logger"
	timer "timer"
)

/******************************************************************************
 * FUNCTION:       ServiceTimerHandler
 *
 * DESCRIPTION:     timer handler for  services
 * INPUT:			timerType, ctx
 * RETURNS:    		void
 ******************************************************************************/
func ServiceTimerHandler(timerType int32, ctx interface{}) {
	var (
		err error
	)
	log.EnterFn(0, "ServiceTimerHandler")
	defer func() { log.ExitFn(0, "ServiceTimerHandler", err) }()

	switch timerType {
	case timer.SampleTime:
		{
			log.FuncDebugTrace(0, "Processing data Notification timer expired timerType = %v", timerType)
		}
	default:
		{
			log.FuncDebugTrace(0, "Unknown timer expired timer Type = ", timerType)
		}
	}
}
