/**************************************************************************
 *      Function	: typesLogger.go
 *      DESCRIPTION	: This file contains structures, constants, utility functions
 *      DATE    	: 11-Jan-2024
 **************************************************************************/
package logger

import (
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"strconv"
	//"strings"
	"gopkg.in/natefinch/lumberjack.v2"
	"sync"
)

/* Defined global variables and types */
var lock sync.RWMutex
var writerLock = &lock

type InstanceIdtype string
type TenantIdtype string
type Nametype string
type LogLeveltype uint8
type Optype uint8

/* constants to defiine the Log level */
const (
	NOTRACE LogLeveltype = iota
	ERROR
	ALERT
	INFO
	DEBUG
	FUNCTRL
)

/* constants to defiine the Log type */
const (
	CONFIG Optype = iota
	FUNCTIONAL
	DBTRANSACTION
	ALARM
)

/* LoggerConfig structure to store the logger configuration */
type LoggerConfig struct {
	LoggingEnv   string
	LogEnvConfig *lumberjack.Logger
	LogLevel     LogLeveltype
	LogWriter    map[LogLeveltype]io.Writer
}

/* LogHandler structure to store the consolidated logger configuration */
type LogHandler struct {
	ServiceName Nametype
	Instanceid  InstanceIdtype
	Tenantid    TenantIdtype
	Config      LoggerConfig
}

/******************************************************************************
 * FUNCTION:        loggerGetInstanceId
 *
 * DESCRIPTION:     This function in used to get the instance ID
 * INPUT:			LogHandler
 * RETURNS:         InstanceIdtype
 ******************************************************************************/
func (handle *LogHandler) loggerGetInstanceId() InstanceIdtype {
	return handle.Instanceid
}

/******************************************************************************
 * FUNCTION:        loggerSetInstanceId
 *
 * DESCRIPTION:     This function in used to set the instance ID
 * INPUT:			LogHandler, InstanceIdtype
 * RETURNS:         error
 ******************************************************************************/
func (handle *LogHandler) loggerSetInstanceId(id InstanceIdtype) error {
	/*if id == "" {
		return fmt.Errorf("Invalid InstanceId: %s", id)
	}*/
	handle.Instanceid = id
	return nil
}

/******************************************************************************
 * FUNCTION:        loggerGetTenantId
 *
 * DESCRIPTION:     This function in used to get the tenant ID
 * INPUT:			LogHandler
 * RETURNS:         TenantIdtype
 ******************************************************************************/
func (handle *LogHandler) loggerGetTenantId() TenantIdtype {
	return handle.Tenantid
}

/******************************************************************************
 * FUNCTION:        loggerSetTenantId
 *
 * DESCRIPTION:     This function in used to set the tenant ID
 * INPUT:			LogHandler, TenantIdtype
 * RETURNS:         error
 ******************************************************************************/
func (handle *LogHandler) loggerSetTenantId(tenantId TenantIdtype) error {
	if tenantId == "" {
		return fmt.Errorf("Invalid TenantId: %v", tenantId)
	}
	handle.Tenantid = tenantId
	return nil
}

/******************************************************************************
 * FUNCTION:        loggerGetName
 *
 * DESCRIPTION:     This function in used to get the service name
 * INPUT:			LogHandler
 * RETURNS:         Nametype
 ******************************************************************************/
func (handle *LogHandler) loggerGetName() Nametype {
	return handle.ServiceName
}

/******************************************************************************
 * FUNCTION:        loggerGetName
 *
 * DESCRIPTION:     This function in used to set the service name
 * INPUT:			LogHandler, Nametype
 * RETURNS:         error
 ******************************************************************************/
func (handle *LogHandler) loggerSetName(serviceName Nametype) error {
	if serviceName == "" {
		return fmt.Errorf("invalid Service Name: %v", serviceName)
	}
	handle.ServiceName = serviceName
	return nil
}

/******************************************************************************
 * FUNCTION:        loggerGetLogLevel
 *
 * DESCRIPTION:     This function in used to get the Log Level
 * INPUT:			LogHandler,
 * RETURNS:         LogLeveltype
 ******************************************************************************/
func (handle *LogHandler) loggerGetLogLevel() LogLeveltype {
	return handle.Config.LogLevel
}

/******************************************************************************
 * FUNCTION:        loggerGetLogLevel
 *
 * DESCRIPTION:     This function in used to set the Log Level
 * INPUT:			LogHandler, LogLeveltype
 * RETURNS:         error
 ******************************************************************************/
func (handle *LogHandler) loggerSetLogLevel(loglevel LogLeveltype) error {
	if loglevel < NOTRACE || loglevel > FUNCTRL {
		return fmt.Errorf("Invalid Log Level: %v", loglevel)
	}
	handle.Config.LogLevel = loglevel
	var fd = io.Writer(os.Stdout)
	if handle.Config.LoggingEnv == "VM" {
		fd = handle.Config.LogEnvConfig
	}
	writerLock.Lock()
	handle.Config.LogWriter = map[LogLeveltype]io.Writer{
		ERROR:   ioutil.Discard,
		ALERT:   ioutil.Discard,
		INFO:    ioutil.Discard,
		DEBUG:   ioutil.Discard,
		FUNCTRL: ioutil.Discard,
	}
	switch loglevel {
	case FUNCTRL:
		handle.Config.LogWriter[ERROR] = fd
		handle.Config.LogWriter[ALERT] = fd
		handle.Config.LogWriter[INFO] = fd
		handle.Config.LogWriter[DEBUG] = fd
		handle.Config.LogWriter[FUNCTRL] = fd
	case DEBUG:
		handle.Config.LogWriter[ERROR] = fd
		handle.Config.LogWriter[ALERT] = fd
		handle.Config.LogWriter[INFO] = fd
		handle.Config.LogWriter[DEBUG] = fd
	case INFO:
		handle.Config.LogWriter[ERROR] = fd
		handle.Config.LogWriter[ALERT] = fd
		handle.Config.LogWriter[INFO] = fd
	case ALERT:
		handle.Config.LogWriter[ERROR] = fd
		handle.Config.LogWriter[ALERT] = fd
	case ERROR:

		handle.Config.LogWriter[ERROR] = fd
	}
	writerLock.Unlock()
	return nil
}

/******************************************************************************
 * FUNCTION:        loggerGetConfig
 *
 * DESCRIPTION:     This function in used to get the logger config
 * INPUT:			LogHandler
 * RETURNS:         LoggerConfig
 ******************************************************************************/
func (handle *LogHandler) loggerGetConfig() LoggerConfig {
	return handle.Config
}

/******************************************************************************
 * FUNCTION:        loggerSetConfig
 *
 * DESCRIPTION:     This function in used to set the logger config
 * INPUT:			LogHandler, LoggerConfig
 * RETURNS:         error
 ******************************************************************************/
func (handle *LogHandler) loggerSetConfig(config LoggerConfig) error {
	temp := handle.Config
	if config.LoggingEnv != "VM" && config.LoggingEnv != "CONTAINER" {
		return fmt.Errorf("invalid LoggingEnv: +%v", config)

	}
	if config.LoggingEnv == "VM" && *config.LogEnvConfig == (lumberjack.Logger{}) {
		return fmt.Errorf("invalid LogConfig for VMEnv: +%v", config)

	}
	handle.Config.LoggingEnv = config.LoggingEnv
	handle.Config.LogEnvConfig = config.LogEnvConfig
	if err := handle.loggerSetLogLevel(config.LogLevel); err != nil {
		handle.Config = temp
		return err
	}
	loggerChangeConsoleLog(config.LoggingEnv, config.LogEnvConfig.Filename)
	return nil
}

/******************************************************************************
 * FUNCTION:        loggerSetHandler
 *
 * DESCRIPTION:     This function in used to set the logger handler
 * INPUT:			LogHandler
 * RETURNS:         error
 ******************************************************************************/
func (handle *LogHandler) loggerSetHandler(handler *LogHandler) error {
	if err := handle.loggerSetName(handler.ServiceName); err != nil {
		return err
	}
	if err := handle.loggerSetTenantId(handler.Tenantid); err != nil {
		return err
	}
	if err := handle.loggerSetInstanceId(handler.Instanceid); err != nil {
		return err
	}
	if err := handle.loggerSetConfig(handler.Config); err != nil {
		return err
	}
	return nil
}

/******************************************************************************
 * FUNCTION:        loggerReadEnvConfig
 *
 * DESCRIPTION:     This function in used to read the logger configuration
 * INPUT:			LogHandler
 * RETURNS:         error
 ******************************************************************************/
func loggerReadEnvConfig() LoggerConfig {
	logLevel, _ := loggerGetInt("LOG_LEVEL", 1)
	logFileSize, _ := loggerGetInt("LOG_FILESIZE", 500)
	logFileBackups, _ := loggerGetInt("LOG_FILEBACKUP", 2)
	logFileAge, _ := loggerGetInt("LOG_FILEAGE", 28)
	return LoggerConfig{
		LoggingEnv: loggerGetString("LOG_ENV", "CONTAINER"),
		LogEnvConfig: &lumberjack.Logger{
			Filename:   loggerGetString("LOG_FILE", "/var/log/sample.log"),
			MaxSize:    logFileSize,
			MaxBackups: logFileBackups,
			MaxAge:     logFileAge,
		},
		LogLevel: LogLeveltype(logLevel),
		LogWriter: map[LogLeveltype]io.Writer{ERROR: ioutil.Discard,
			ALERT:   ioutil.Discard,
			INFO:    ioutil.Discard,
			DEBUG:   ioutil.Discard,
			FUNCTRL: ioutil.Discard,
		},
	}
}

/******************************************************************************
 * FUNCTION:        loggerGetString
 *
 * DESCRIPTION:     This function in used to get string value of given
 *                   environment if set.
 * INPUT:			key, string
 * RETURNS:         string
 ******************************************************************************/
func loggerGetString(key, def string) string {
	val, set := os.LookupEnv(key)
	if !set {
		return def
	}
	return val
}

/******************************************************************************
 * FUNCTION:        loggerGetInt
 *
 * DESCRIPTION:     This function in used to get int value of given
 *                   environment if set.
 * INPUT:			key, int
 * RETURNS:         int, error
 ******************************************************************************/
func loggerGetInt(key string, def int) (int, error) {
	str, set := os.LookupEnv(key)
	if !set {
		return def, nil
	}
	val, err := strconv.ParseInt(str, 10, 64)
	if err != nil {
		return def, err
	}
	return int(val), nil
}
