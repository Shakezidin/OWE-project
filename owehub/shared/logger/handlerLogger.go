/**************************************************************************
 *      File	: handlerLogger.go
 *      DESCRIPTION	: This file contains functions which are exposed
 *                     toward applciations
 *      DATE    	: 11-Jan-2024
 **************************************************************************/
package logger

import (
	"fmt"
	"io/ioutil"
	"runtime"
	"time"
)

/* Conversion from string to Log level.
*  and Create handler object */
var (
	stringToLogLevel = map[string]LogLeveltype{
		"ERROR":   ERROR,
		"ALARM":   ERROR,
		"BRIEF":   ALERT,
		"INFO":    INFO,
		"EVENT":   ERROR,
		"DEBUG":   DEBUG,
		"FUNCTRL": FUNCTRL,
		"WARN":    ERROR,
		"SYSCONF": ERROR,
	}

	logTypeStr = map[Optype]string{
		CONFIG:        "CONF",
		FUNCTIONAL:    "FUNC",
		DBTRANSACTION: "DB",
	}
	handle = new(LogHandler)
)

/******************************************************************************
 * FUNCTION:        loggerTypeString
 *
 * DESCRIPTION:     This function in used to convert int type tp log type
 * INPUT:			Optype
 * RETURNS:         string
 ******************************************************************************/
func (optype Optype) loggerTypeString() string {
	if logTypeString, ok := logTypeStr[optype]; ok {
		return logTypeString
	}
	return "----"
}

/******************************************************************************
 * FUNCTION:        loggerGetfilename
 *
 * DESCRIPTION:     This function in used to get log file name
 * INPUT:			Optype
 * RETURNS:         string, int
 ******************************************************************************/
func loggerGetfilename() (string, int) {
	_, file, line, ok := runtime.Caller(4)
	if !ok {
		file = "???"
		line = 0
	}
	for i := len(file) - 1; i >= 0; i-- {
		if file[i] == '/' {
			file = file[i+1:]
			break
		}
	}
	return file, line
}

/******************************************************************************
 * FUNCTION:        loggerWriteLog
 *
 * DESCRIPTION:     This function in used to format the log and prints given
 *                  logs as per log settings.
 *                  Format: <Time>|<Tenant>|<Service>|<Log-Type>|<Log-Cat>|
 *                           <P-ID>|<S-ID>|<File>:<Line>|<Log-Msg>
 * INPUT:			LogHandler, string, Optype, primaryID, string args
 * RETURNS:         string, int
 ******************************************************************************/
func (handle *LogHandler) loggerWriteLog(stream string, option Optype, primaryID interface{},
	format string, args ...interface{}) {

	level := stringToLogLevel[stream]
	writerLock.RLock()
	levelstream := handle.Config.LogWriter[level]
	writerLock.RUnlock()

	if levelstream == ioutil.Discard || levelstream == nil {
		return
	}
	if primaryID == nil || primaryID == "" || primaryID == 0 {
		primaryID = "-"
	}
	timestamp := time.Now().Format("2006-01-02T15:04:05.999Z")
	msg := fmt.Sprintf(format, args...)
	file, line := loggerGetfilename()

	fmt.Fprintf(levelstream, "%v|%v|%v|%v|%v|%v|%v:%v|%v\n",
		timestamp, handle.Tenantid, handle.ServiceName, stream, option, primaryID, file, line, msg)
}

/******************************************************************************
 * FUNCTION:        InitLogger
 * DESCRIPTION:     This function in used to initialize logger
 * INPUT:			LogHandler
 * RETURNS:         error
 ******************************************************************************/
func InitLogger(hndl *LogHandler) error {
	envconfig := loggerReadEnvConfig()
	if hndl.Config.LoggingEnv != "" {
		envconfig.LoggingEnv = hndl.Config.LoggingEnv
	}
	if hndl.Config.LogEnvConfig != nil {
		envconfig.LogEnvConfig = hndl.Config.LogEnvConfig
	}
	if hndl.Config.LogLevel != 0 {
		envconfig.LogLevel = hndl.Config.LogLevel
	}
	handle.Config = envconfig
	if err := handle.loggerSetHandler(hndl); err != nil {
		return err
	}
	return nil
}

/******************************************************************************
 * FUNCTION:        loggerPrintError
 * DESCRIPTION:     This function in used to print the error level logs
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func LoggerPrintError(option Optype, primaryID interface{}, format string, args ...interface{}) {
	handle.loggerWriteLog("ERROR", option, primaryID, format, args...)
}

/******************************************************************************
 * FUNCTION:        loggerPrintAlarm
 * DESCRIPTION:     This function in used to print the alarm level logs
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func LoggerPrintAlarm(option Optype, primaryID interface{}, format string, args ...interface{}) {
	handle.loggerWriteLog("ALARM", option, primaryID, format, args...)
}

/******************************************************************************
 * FUNCTION:        loggerPrintBrief
 * DESCRIPTION:     This function in used to print the brief level logs
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func LoggerPrintBrief(option Optype, primaryID interface{}, format string, args ...interface{}) {
	handle.loggerWriteLog("BRIEF", option, primaryID, format, args...)
}

/******************************************************************************
 * FUNCTION:        loggerPrintInfo
 * DESCRIPTION:     This function in used to print the info level logs
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func LoggerPrintInfo(option Optype, primaryID interface{}, format string, args ...interface{}) {
	handle.loggerWriteLog("INFO", option, primaryID, format, args...)
}

/******************************************************************************
 * FUNCTION:        loggerPrintEvent
 * DESCRIPTION:     This function in used to print the event level logs
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func LoggerPrintEvent(option Optype, primaryID interface{}, format string, args ...interface{}) {
	handle.loggerWriteLog("EVENT", option, primaryID, format, args...)
}

/******************************************************************************
 * FUNCTION:        loggerPrintDebug
 * DESCRIPTION:     This function in used to print the debug level logs
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func LoggerPrintDebug(option Optype, primaryID interface{}, format string, args ...interface{}) {
	handle.loggerWriteLog("DEBUG", option, primaryID, format, args...)
}

/******************************************************************************
 * FUNCTION:        loggerPrintEnter
 * DESCRIPTION:     This function in used to print the function entery logs
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func LoggerPrintEnter(option Optype, primaryID interface{}, name string) {
	handle.loggerWriteLog("FUNCTRL", option, primaryID, "Entering function : %v :", name)
}

/******************************************************************************
 * FUNCTION:        loggerPrintExit
 * DESCRIPTION:     This function in used to print the function exit logs
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func LoggerPrintExit(option Optype, primaryID interface{}, name string, err interface{}) {
	retStatus := "SUCCESS"
	if err != nil {
		retStatus = "FAILURE With Error: " + fmt.Sprint(err)
	}
	handle.loggerWriteLog("FUNCTRL", option, primaryID, "Exiting function : %v : returned %v", name, retStatus)
}

/******************************************************************************
 * FUNCTION:        loggerPrintWarn
 * DESCRIPTION:     This function in used to print the warn level logs
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func LoggerPrintWarn(option Optype, primaryID interface{}, format string, args ...interface{}) {
	handle.loggerWriteLog("WARN", option, primaryID, format, args...)
}

/******************************************************************************
 * FUNCTION:        loggerPrintSysConf
 * DESCRIPTION:     This function in used to print the syster Configuration logs
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func LoggerPrintSysConf(option Optype, primaryID interface{}, format string, args ...interface{}) {
	handle.loggerWriteLog("SYSCONF", option, primaryID, format, args...)
}

/******************************************************************************
 * FUNCTION:        LoggerPrintFunctional
 * DESCRIPTION:     This function in used to print the function logs
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func LoggerPrintFunctional(option Optype, primaryID interface{}, format string, args ...interface{}) {
	handle.loggerWriteLog("FUNCTRL", option, primaryID, format, args...)
}

/******************************************************************************
 * FUNCTION:        loggerGethandler
 * DESCRIPTION:     This function in used to get the logger handler object
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func LoggerGethandler() *LogHandler {
	return handle
}
