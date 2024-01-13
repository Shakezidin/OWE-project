/**************************************************************************
 *      Function        : serviceGlobalConfig.go
 *      DESCRIPTION     : contains main structures used for configuration
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package models

type SrvHttpConf struct {
	HttpsSupport      string
	Addr              string
	SslAddr           string
	AddrStd           string
	SslAddrStd        string
	ServerCertFile    string
	ServerKeyFile     string
	ClientAuthType    string
	ClientCAFile      []string
	ClientCertFile    []string
	ClientKeyFile     []string
	ReadTimeout       int
	ReadHeaderTimeout int
	WriteTimeout      int
	IdleTimeout       int
	MaxHeaderBytes    int
}

type SrvConf struct {
	SrvHttpCfg       SrvHttpConf
	ValidateOAuthReq string
	OpenStdHTTPPort  bool
}

type SvcConfig struct {
	InstanceID            map[string]string
	SelfInstanceId        string
	SelfAddr              string
	HTTPTimerCallBackPath string
	HTTPCfg               HTTPConfig
	LogCfg                LoggingCfg
	DbConfInfo            DBCustersCfg
	SvcSrvCfg             SrvConf
}
