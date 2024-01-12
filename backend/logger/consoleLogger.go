/**************************************************************************
 *      Function	: consoleLogger.go
 *      DESCRIPTION	: This file contains functions for console logging
 *      DATE    	: 11-Jan-2024
 **************************************************************************/

package logger

import (
	"os"
	"syscall"
)

var (
	gOutFd     = syscall.Stdout //Stdout
	gErrFd     = syscall.Stderr //Stderr
	gOutFdCopy = -1             //Stdout backup copy
	gErrFdCopy = -1             //Stderr backup copy
)

/******************************************************************************
 * FUNCTION:        loggerBackupConsoleLog
 *
 * DESCRIPTION:     This function to create backup of console logs
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func loggerBackupConsoleLog() (err error) {
	if gOutFdCopy == -1 {
		gOutFdCopy, err = syscall.Dup(gOutFd)
		if err != nil {
			LoggerPrintError(FUNCTIONAL, nil, "Backup stdout failed :: err=%v", err)
		}
	}
	if gErrFdCopy == -1 {
		gErrFdCopy, err = syscall.Dup(gErrFd)
		if err != nil {
			LoggerPrintError(FUNCTIONAL, nil, "Backup stderr failed :: err=%v", err)
		}
	}
	return
}

/******************************************************************************
 * FUNCTION:        loggerRevertConsoleLog
 *
 * DESCRIPTION:     This function to revert of console logs
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func loggerRevertConsoleLog() (err error) {
	if gOutFdCopy != -1 {
		err = syscall.Dup3(gOutFdCopy, gOutFd, 0)
		if err != nil {
			LoggerPrintError(FUNCTIONAL, nil, "Revert stdout failed :: err=%v", err)
		}
		err = syscall.Close(gOutFdCopy)
		if err != nil {
			LoggerPrintError(FUNCTIONAL, nil, "Close stdout failed :: err=%v", err)
		}
		gOutFdCopy = -1
	}
	if gErrFdCopy != -1 {
		err = syscall.Dup3(gErrFdCopy, gErrFd, 0)
		if err != nil {
			LoggerPrintError(FUNCTIONAL, nil, "Revert stderr failed :: err=%v", err)
		}
		err = syscall.Close(gErrFdCopy)
		if err != nil {
			LoggerPrintError(FUNCTIONAL, nil, "Close stderr failed :: err=%v", err)
		}
		gErrFdCopy = -1
	}
	return
}

/******************************************************************************
 * FUNCTION:        loggerChangeConsoleLog
 *
 * DESCRIPTION:     This function to change the console logs
 * INPUT:
 * RETURNS:         error
 ******************************************************************************/
func loggerChangeConsoleLog(logEnv, logFile string) {
	var err error
	if logEnv != "VM" {
		loggerRevertConsoleLog()
		return
	}
	loggerBackupConsoleLog()
	fp, err := os.OpenFile(logFile, os.O_WRONLY|os.O_CREATE|os.O_APPEND|os.O_SYNC, 0644)
	if err != nil {
		LoggerPrintError(FUNCTIONAL, nil, "Console log file open failed :: err=%v", err)
		return
	}
	//Close file after cloning stdout, stderr
	defer func() {
		err = fp.Close()
		if err != nil {
			LoggerPrintError(FUNCTIONAL, nil, "Console log file close failed :: err=%v", err)
		}
	}()
	err = syscall.Dup3(int(fp.Fd()), gOutFd, 0)
	if err != nil {
		LoggerPrintError(FUNCTIONAL, nil, "Redirect stdout failed :: err=%v", err)
	}
	err = syscall.Dup3(int(fp.Fd()), gErrFd, 0)
	if err != nil {
		LoggerPrintError(FUNCTIONAL, nil, "Redirect stdout failed :: err=%v", err)
	}
	return
}
