/**************************************************************************
 *      Function        : loggingConfig.go
 *      DESCRIPTION     : contains structure for logging configuration
 *      DATE            : 11-Jan-2024
 **************************************************************************/
package models

type LoggingCfg struct {
	LogEnv          string `json:"logEnv"`
	LogLevel        uint8  `json:"logLevel"`
	LogFile         string `json:"logFile"`
	LogFileSize     int32  `json:"logFileSize,omitempty"`
	LogFileBackup   int32  `json:"logFileBackup,omitempty"`
	LogFileAge      int32  `json:"logFileAge,omitempty"`
	LogFileCompress *bool  `json:"logFileCompress,omitempty"`
}
