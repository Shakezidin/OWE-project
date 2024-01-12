/**************************************************************************
 *      Function	: wrapperLogger.go
 *      DESCRIPTION	: This file contains wrappers functions on top of logger package
 *      DATE    	: 11-Jan-2024
 **************************************************************************/
package logger

/******************************************************************************
 * FUNCTION:       Function Enter Exit wrapper fubctions
 *
 * DESCRIPTION:
 * INPUT:
 * RETURNS:
 ******************************************************************************/
func EnterFn(primaryID interface{}, name string) {
	LoggerPrintEnter(FUNCTIONAL, primaryID, name)
}
func ExitFn(primaryID interface{}, name string, err interface{}) {
	LoggerPrintExit(FUNCTIONAL, primaryID, name, err)
}

/******************************************************************************
 * FUNCTION:        Configutrational wraaper functions
 *
 * DESCRIPTION:
 * INPUT:
 * RETURNS:
 ******************************************************************************/
func ConfErrorTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintError(CONFIG, primaryID, format, args...)
}
func ConfBriefTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintBrief(CONFIG, primaryID, format, args...)
}
func ConfInfoTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintInfo(CONFIG, primaryID, format, args...)
}
func ConfDebugTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintDebug(CONFIG, primaryID, format, args...)
}
func ConfFuncTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintFunctional(CONFIG, primaryID, format, args...)
}
func ConfWarnTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintWarn(CONFIG, primaryID, format, args...)
}
func SysConfTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintSysConf(CONFIG, primaryID, format, args...)
}

/******************************************************************************
 * FUNCTION:        Functional wraaper functions
 *
 * DESCRIPTION:
 * INPUT:
 * RETURNS:
 ******************************************************************************/
func FuncErrorTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintError(FUNCTIONAL, primaryID, format, args...)
}
func FuncBriefTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintBrief(FUNCTIONAL, primaryID, format, args...)
}
func FuncInfoTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintInfo(FUNCTIONAL, primaryID, format, args...)
}
func FuncDebugTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintDebug(FUNCTIONAL, primaryID, format, args...)
}
func FuncFuncTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintFunctional(FUNCTIONAL, primaryID, format, args...)
}
func FuncWarnTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintWarn(FUNCTIONAL, primaryID, format, args...)
}

/******************************************************************************
 * FUNCTION:        DB Transaction wraaper functions
 *
 * DESCRIPTION:
 * INPUT:
 * RETURNS:
 ******************************************************************************/
func DBTransErrorTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintError(DBTRANSACTION, primaryID, format, args...)
}
func DBTransBriefTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintBrief(DBTRANSACTION, primaryID, format, args...)
}
func DBTransInfoTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintInfo(DBTRANSACTION, primaryID, format, args...)
}
func DBTransDebugTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintDebug(DBTRANSACTION, primaryID, format, args...)
}
func DBTransFuncTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintFunctional(DBTRANSACTION, primaryID, format, args...)
}
func DBTransWarnTrace(primaryID interface{}, format string, args ...interface{}) {
	LoggerPrintWarn(DBTRANSACTION, primaryID, format, args...)
}
