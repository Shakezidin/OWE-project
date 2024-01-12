/**************************************************************************
 *      Function        : httpTypes.go
 *      DESCRIPTION     : contains structure for HTTP configuration
 *      DATE            : 11-Jan-2024
 **************************************************************************/
package ConfigModels

type HTTPConfig struct {
	HTTPDialRetryCount    int32 `json:"httpDialRetryCount,omitempty"`
	HTTPDialTimeOut       int32 `json:"httpDialTimeOut,omitempty"`
	HTTPDialWaitTime      int32 `json:"httpDialWaitTime,omitempty"`
	HTTPIdleTimeOut       int32 `json:"httpIdleTimeOut,omitempty"`
	HTTPReadTimeOut       int32 `json:"httpReadTimeOut,omitempty"`
	HTTPWriteTimeOut      int32 `json:"httpWriteTimeOut,omitempty"`
	HTTPHeartBeatTimer    int32 `json:"httpHeartBeatTimer,omitempty"`
	HTTPHeartBeatMaxRetry int32 `json:"httpHeartBeatMaxRetry,omitempty"`
}
