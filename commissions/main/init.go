/**************************************************************************
 *      Function        : init.go
 *      DESCRIPTION     : This file contains functions to initialize
 *							 service
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package main

import (
	"OWEApp/types"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"

	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"
	apiHandler "OWEApp/services"

	"github.com/google/uuid"
)

type CfgFilePaths struct {
	CfgJsonDir          string
	LoggingConfJsonPath string
	HTTPConfJsonPath    string
	DbConfJsonPath      string
}

var (
	gCfgFilePaths CfgFilePaths
)

const (
	AppVersion = "1.0.0"
)

/* constains api execution information
*  service names, methods, patterns and
*  handler function*/
type ServiceApiRoute struct {
	Method             string
	Pattern            string
	Handler            http.HandlerFunc
	IsAuthReq          bool
	RolesAllowedAccess []types.UserRoles
}

type ApiRoutes []ServiceApiRoute

var apiRoutes = ApiRoutes{
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/loggingconf",
		handleDynamicLoggingConf,
		false,
		[]types.UserRoles{},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/httpconf",
		handleDynamicHttpConf,
		false,
		[]types.UserRoles{},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/login",
		apiHandler.HandleLoginRequest,
		false,
		[]types.UserRoles{},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/forgot_password",
		apiHandler.HandleForgotPassRequest,
		false,
		[]types.UserRoles{},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/change_password",
		apiHandler.HandleChangePassRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_user",
		apiHandler.HandleCreateUserRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_team",
		apiHandler.HandleCreateTeamRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_appointment_setter",
		apiHandler.HandleCreateAptSetterRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"), //Changed to POST
		"/owe-commisions-service/v1/get_teams",
		apiHandler.HandleGetTeamDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_commission",
		apiHandler.HandleCreateCommissionRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"), //Changed to POST
		"/owe-commisions-service/v1/get_commissions",
		apiHandler.HandleGetCommissionsDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"), //Changed to POST
		"/owe-commisions-service/v1/get_users",
		apiHandler.HandleGetUsersDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_dealer",
		apiHandler.HandleCreateDealerRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"), //Changed to POST
		"/owe-commisions-service/v1/get_dealers",
		apiHandler.HandleGetDealersDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_marketingfee",
		apiHandler.HandleCreateMarketingFeesRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"), //Changed to POST
		"/owe-commisions-service/v1/get_marketingfee",
		apiHandler.HandleGetMarketingFeesDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_vadder",
		apiHandler.HandleCreateVAddersRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"), //Changed to POST
		"/owe-commisions-service/v1/get_vadders",
		apiHandler.HandleGetVAdderDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_saletype",
		apiHandler.HandleCreateSaleTypeRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"), //Changed to POST
		"/owe-commisions-service/v1/get_saletypes",
		apiHandler.HandleGetSaleTypeDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_tierloanfee",
		apiHandler.HandleCreateTierLoanFeeRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"), //Changed to POST
		"/owe-commisions-service/v1/get_tierloanfees",
		apiHandler.HandleGetTierLoanFeesDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_dealertier",
		apiHandler.HandleCreateDealerTierRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"), //Changed to POST
		"/owe-commisions-service/v1/get_dealerstier",
		apiHandler.HandleGetDealersTierDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_paymentschedule",
		apiHandler.HandleCreatePaymentScheduleRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"), //Changed to POST
		"/owe-commisions-service/v1/get_paymentschedules",
		apiHandler.HandleGetPaymentSchedulesDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_timelinesla",
		apiHandler.HandleCreateTimelineSlaRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_timelineslas",
		apiHandler.HandleGetTimelineSlasDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_partner",
		apiHandler.HandleCreatePartnerRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_partners",
		apiHandler.HandleGetPartnerDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_state",
		apiHandler.HandleCreateStateRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_states",
		apiHandler.HandleGetStatesDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_loantype",
		apiHandler.HandleCreateLoanTypeRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_loantypes",
		apiHandler.HandleGetLoanTypesDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_newformdata",
		apiHandler.HandleGetNewFormDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_commission",
		apiHandler.HandleUpdateCommissionRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_dealer",
		apiHandler.HandleUpdateDealerRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_marketingfee",
		apiHandler.HandleUpdateMarketingFeeRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_vadders",
		apiHandler.HandleUpdateVAddersRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_saletype",
		apiHandler.HandleUpdateSaleTypeRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_tierloanfee",
		apiHandler.HandleUpdateTierLoanFeeRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_dealertier",
		apiHandler.HandleUpdateDealerTierRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_paymentschedule",
		apiHandler.HandleUpdatePaymentScheduleRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_timelinesla",
		apiHandler.HandleUpdateTimelineSlaRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_loantype",
		apiHandler.HandleUpdateLoanTypeRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_commission_archive",
		apiHandler.HandleUpdateCommissionArchiveRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_marketing_fees_archive",
		apiHandler.HandleUpdateMarketingFeesArchiveRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_dealer_archive",
		apiHandler.HandleUpdateDealerArchiveRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_vadders_archive",
		apiHandler.HandleUpdateVAddersArchiveRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_saletype_archive",
		apiHandler.HandleUpdateSaleTypeArchiveRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_tierloanfee_archive",
		apiHandler.HandleUpdateTierLoanFeeArchiveRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_dealertier_archive",
		apiHandler.HandleUpdateDealerTierArchiveRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_paymentschedule_archive",
		apiHandler.HandleUpdatePaymentScheduleArchiveRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_timelinesla_archive",
		apiHandler.HandleUpdateTimelineSlaArchiveRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_loantype_archive",
		apiHandler.HandleUpdateLoanTypeArchiveRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_autoadder",
		apiHandler.HandleCreateAutoAdderRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_autoadder",
		apiHandler.HandleGetAutoAdderDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_autoadder",
		apiHandler.HandleUpdateAutoAdderRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_autoadder_archive",
		apiHandler.HandleUpdateAutoAdderArchiveRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_user",
		apiHandler.HandleUpdateUserRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_users_onboarding",
		apiHandler.HandleGetUserMgmtOnboardingDataRequest,
		true,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_referraldata",
		apiHandler.HandleCreateReferralDataRequest,
		false,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_dealercredit",
		apiHandler.HandleCreateDealerCreditRequest,
		false,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_noncommdlrpay",
		apiHandler.HandleCreateNonCommDlrPayRequest,
		false,
		[]types.UserRoles{
			types.RoleAdmin,
		},
	},
}

/******************************************************************************
 * FUNCTION:        initializelog
 *
 * DESCRIPTION:     This will initialize the logger package with default config
 * INPUT:
 * RETURNS:    VOID
 ******************************************************************************/
func initLogger(svcName log.Nametype, instId log.InstanceIdtype, tnId log.TenantIdtype, level log.LogLeveltype, logenv string, fname string, size int, age int, bkp int) {
	logCfg := &log.LogHandler{
		ServiceName: svcName, Instanceid: instId, Tenantid: tnId,
		Config: log.LoggerConfig{
			LogLevel:   level,
			LoggingEnv: logenv,
			LogEnvConfig: &lumberjack.Logger{
				Filename: fname,
				MaxSize:  size, MaxAge: age, MaxBackups: bkp,
			},
		},
	}
	err := log.InitLogger(logCfg)
	if err != nil {
		fmt.Println("Error in initializing logger from logpackage err: %v\n", err)
		panic(err)

	}
	log.ExitFn(0, "initLogger", err)
}

/******************************************************************************
 * FUNCTION:        ValidateRequiredEnv
 * DESCRIPTION:     This function will check if all required ENV are exported
 * INPUT:
 * RETURNS:    		true if provided, else false
 ******************************************************************************/
func ValidateRequiredEnv() bool {
	log.EnterFn(0, "ValidateRequiredEnv")
	defer func() { log.ExitFn(0, "ValidateRequiredEnv", nil) }()

	return true
}

/******************************************************************************
 * FUNCTION:        init
 *
 * DESCRIPTION:     This function will be called before main and initialize the
 *					 service
 * INPUT:
 * RETURNS:    VOID
 ******************************************************************************/
func init() {
	var err error
	defer func() {
		if err != nil {
			log.ConfInfoTrace(0, "Commissions Service Initialization failed. Exiting... %+v", err)
			os.Exit(1)
		}
		log.ConfDebugTrace(0, "Commissions Service Initialized Successfully")
	}()

	/* Initializing Logger package */
	initLogger("COMM", "-", "-", log.FUNCTRL, "VM", "/var/log/owe/owehub.log", 100, 28, 3)

	if !ValidateRequiredEnv() {
		err = fmt.Errorf("missing required env variables")
		return
	}

	log.ConfInfoTrace(0, "App Version: %+v", AppVersion)
	/*Initialize deplpoyement framewok and namespace*/

	/* Initialize default server configuration */
	InitSrvDefaultConfig()

	/* Read and Initialize DB configuration from cfg */
	err = FetchDbCfg()
	if err != nil {
		log.ConfErrorTrace(0, "FetchDbCfg failed %+v", err)
		return
	} else {
		log.ConfDebugTrace(0, "Database Configuration fatched Successfully from file.")
	}

	/* Init postgre DB from the config and save handler, Create initial connection */
	/* In case of intentional service restart and MNO wants config to be read from files*/
	/* Read configuration and initialize the service*/
	err = InitConfigFromFiles()
	if err == nil {
		/*Update server configuration based on recieved glb config*/
		UpdateSrvConfiguration()
	} else {
		log.ConfErrorTrace(0, "Failed to read the config from files. %+v", err)
		return
	}

	/* Init DB Connection */
	/* If Connection from DB gets failed then abort the application */
	err = db.InitDBConnection()
	if err != nil {
		log.ConfErrorTrace(0, "Failed to connect to DB error = %+v", err)
		return
	}

	types.ExitChan = make(chan error)
	types.CommGlbCfg.SelfInstanceId = uuid.New().String()

	PrintSvcGlbConfig(types.CommGlbCfg)

	/*Initialize logger package again with new configuraion*/
	initLogger("COMM", log.InstanceIdtype(types.CommGlbCfg.SelfInstanceId), "-", log.LogLeveltype(types.CommGlbCfg.LogCfg.LogLevel), types.CommGlbCfg.LogCfg.LogEnv, types.CommGlbCfg.LogCfg.LogFile, int(types.CommGlbCfg.LogCfg.LogFileSize), int(types.CommGlbCfg.LogCfg.LogFileAge), int(types.CommGlbCfg.LogCfg.LogFileBackup))

	/* Initialize OTP Services */
	apiHandler.InitializeOTPServices()
}

func handleDynamicLoggingConf(resp http.ResponseWriter, req *http.Request) {
	types.CommGlbCfg.LogCfg = HandleDynamicLoggingConf(resp, req)
	initLogger("COMM", log.InstanceIdtype(types.CommGlbCfg.SelfInstanceId), "-", log.LogLeveltype(types.CommGlbCfg.LogCfg.LogLevel), types.CommGlbCfg.LogCfg.LogEnv, types.CommGlbCfg.LogCfg.LogFile, int(types.CommGlbCfg.LogCfg.LogFileSize), int(types.CommGlbCfg.LogCfg.LogFileAge), int(types.CommGlbCfg.LogCfg.LogFileBackup))

}

func handleDynamicHttpConf(resp http.ResponseWriter, req *http.Request) {
	types.CommGlbCfg.HTTPCfg = HandleDynamicHttpConf(resp, req)
}

/******************************************************************************
 * FUNCTION:        InitSrvDefaultConfig
 *
 * DESCRIPTION:    Read the env variables and initialize global variable
 *                  with default configuration
 * INPUT:
 * RETURNS:
 ******************************************************************************/
func InitSrvDefaultConfig() {
	log.EnterFn(0, "InitSrvDefaultConfig")

	types.CommGlbCfg.SvcSrvCfg.ValidateOAuthReq = types.UtilsGetString("OAUTH2_SUPPORT", "NO")
	types.CommGlbCfg.SvcSrvCfg.OpenStdHTTPPort = types.UtilsGetStringBool(types.UtilsGetString("OPEN_HTTP_STD_PORT", "NO"), false)
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.HttpsSupport = types.UtilsGetString("HTTPS_SUPPORT", "NO")
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.Addr = ":8080"
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.SslAddr = ":10443"
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.AddrStd = ":8080"
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.SslAddrStd = ":443"
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ServerCertFile = types.UtilsGetString("HTTPS_SERVER_CERT", "")
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ServerKeyFile = types.UtilsGetString("HTTPS_SERVER_KEY", "")
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ClientAuthType = types.UtilsGetString("HTTPS_CLIENT_AUTH_TYPE", "NO_CLIENT_CERT")
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ClientCAFile = types.UtilsGetStringTocken("HTTPS_CLIENT_CA_CERT", ",", nil)
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ClientCertFile = types.UtilsGetStringTocken("HTTPS_CLI_CERT", ",", nil)
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ClientKeyFile = types.UtilsGetStringTocken("HTTPS_CLI_KEY", ",", nil)
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ReadHeaderTimeout, _ = types.UtilsGetInt("HTTP_READ_HEADER_TIMEOUT", 10)
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.MaxHeaderBytes, _ = types.UtilsGetInt("HTTP_MAX_HEADER_BYTES ", http.DefaultMaxHeaderBytes)

	/*Initialize config file default paths and instance id*/
	InitCfgPaths()

	log.ConfDebugTrace(0, "Default server configuration Initialized successfully")
	log.ExitFn(0, "InitSrvDefaultConfig", nil)
}

/******************************************************************************
 * FUNCTION:        InitConfigFromFiles
 *
 * DESCRIPTION:   function used to read the configuration and initilize services
 * INPUT:        service name to be initialized
 * RETURNS:      error
 ******************************************************************************/
func InitConfigFromFiles() (err error) {
	log.EnterFn(0, "initConfigFromFiles")
	defer func() { log.ExitFn(0, "initConfigFromFiles", err) }()

	log.ConfDebugTrace(0, "Initializing configuration from files for service:")

	/* Read and Initialize logging configuration from cfg */
	if err := FetchLoggingCfg(); err != nil {
		log.ConfErrorTrace(0, "GetLoggingCfg failed %+v", err)
		return err
	}
	/* Read and Initialize HTTP configuration from cfg */
	if err := FetchHttpCfg(); err != nil {
		log.ConfErrorTrace(0, "FetchHttpCfg failed %+v", err)
		return err
	}

	/* Set HTTP Callback paths*/
	InitHttpCallbackPath()

	return nil
}

/******************************************************************************
 * FUNCTION:        InitCfgPaths
 *
 * DESCRIPTION:   function to init default paths and instance id
 * INPUT:
 * RETURNS:
 ******************************************************************************/
func InitCfgPaths() {
	log.EnterFn(0, "InitCfgPaths")

	/*set config file paths*/
	gCfgFilePaths.CfgJsonDir = types.UtilsGetString("SELF_CFG_PATH", "json/")
	gCfgFilePaths.LoggingConfJsonPath = gCfgFilePaths.CfgJsonDir + "logConfig.json"
	gCfgFilePaths.DbConfJsonPath = gCfgFilePaths.CfgJsonDir + "sqlDbConfig.json"
	gCfgFilePaths.HTTPConfJsonPath = gCfgFilePaths.CfgJsonDir + "httpConfig.json"

	log.ExitFn(0, "InitCfgPaths", nil)
}

/******************************************************************************
 * FUNCTION:        FetchLoggingCfg
 *
 * DESCRIPTION:   function is used to get the logging configuration
 * INPUT:        service name to be initialized
 * RETURNS:      error
 ******************************************************************************/
func FetchLoggingCfg() (err error) {
	log.EnterFn(0, "FetchLoggingCfg")
	defer func() { log.ExitFn(0, "FetchLoggingCfg", err) }()
	var logCfg models.LoggingCfg
	log.ConfDebugTrace(0, "Reading Logging Config from: %+v", gCfgFilePaths.LoggingConfJsonPath)
	file, err := os.Open(gCfgFilePaths.LoggingConfJsonPath)
	if err != nil {
		log.ConfErrorTrace(0, "Failed to open file %+v: %+v", gCfgFilePaths.LoggingConfJsonPath, err)
		panic(err)
	}
	bVal, _ := ioutil.ReadAll(file)
	err = json.Unmarshal(bVal, &logCfg)
	if err != nil {
		log.ConfErrorTrace(0, "Failed to Urmarshal file: %+v Error: %+v", gCfgFilePaths.LoggingConfJsonPath, err)
		panic(err)
	}
	types.CommGlbCfg.LogCfg = logCfg
	log.ConfDebugTrace(0, "Logging Configurations: %+v", types.CommGlbCfg.LogCfg)

	return err
}

/******************************************************************************
 * FUNCTION:        FetchHttpCfg
 *
 * DESCRIPTION:   function is used to get the HTTP configuration
 * INPUT:        service name to be initialized
 * RETURNS:      error
 ******************************************************************************/
func FetchHttpCfg() (err error) {
	log.EnterFn(0, "FetchHttpCfg")
	defer func() { log.ExitFn(0, "FetchHttpCfg", err) }()

	var httpCfg models.HTTPConfig
	log.ConfDebugTrace(0, "Reading HTTP Config from: %+v", gCfgFilePaths.HTTPConfJsonPath)
	file, err := os.Open(gCfgFilePaths.HTTPConfJsonPath)
	if err != nil {
		log.ConfErrorTrace(0, "Failed to open file %+v: %+v", gCfgFilePaths.HTTPConfJsonPath, err)
		panic(err)
	}
	bVal, _ := ioutil.ReadAll(file)
	err = json.Unmarshal(bVal, &httpCfg)
	if err != nil {
		log.ConfErrorTrace(0, "Failed to Urmarshal file: %+v Error: %+v", gCfgFilePaths.HTTPConfJsonPath, err)
		panic(err)
	}
	types.CommGlbCfg.HTTPCfg = httpCfg
	log.ConfDebugTrace(0, "HTTP Configurations: %+v", types.CommGlbCfg.HTTPCfg)

	return err
}

/******************************************************************************
 * FUNCTION:        FetchDbCfg
 *
 * DESCRIPTION:   function is used to get the Database configuration
 * INPUT:        service name to be initialized
 * RETURNS:      error
 ******************************************************************************/
func FetchDbCfg() (err error) {
	log.EnterFn(0, "FetchDbCfg")
	defer func() { log.ExitFn(0, "FetchDbCfg", err) }()

	var dbCfg models.DbConfInfo
	log.ConfDebugTrace(0, "Reading DB Config for from: %+v", gCfgFilePaths.DbConfJsonPath)
	file, err := os.Open(gCfgFilePaths.DbConfJsonPath)
	if err != nil {
		log.ConfErrorTrace(0, "Failed to open file %+v: %+v", gCfgFilePaths.DbConfJsonPath, err)
		panic(err)
	}
	bVal, _ := ioutil.ReadAll(file)
	err = json.Unmarshal(bVal, &dbCfg)
	types.CommGlbCfg.DbConfInfo = dbCfg
	log.ConfDebugTrace(0, "Database Configurations: %+v", types.CommGlbCfg.DbConfInfo)
	return err
}

/******************************************************************************
 * FUNCTION:        InitHttpCallbackPath
 *
 * DESCRIPTION:   function used to set the http callback paths for services
 * INPUT:           service name
 * RETURNS:
 ******************************************************************************/
func InitHttpCallbackPath() {
	log.EnterFn(0, "InitHttpCallbackPath")

	types.CommGlbCfg.HTTPTimerCallBackPath = models.URISchemehttp + types.CommGlbCfg.SelfAddr + "/owe-commisions-service/v1"

	log.ExitFn(0, "InitHttpCallbackPath", nil)
}

/******************************************************************************
 * FUNCTION:        PrintSvcGlbConfig
 *
 * DESCRIPTION:   function is used to display the configuration
 * INPUT:
 * RETURNS:
 ******************************************************************************/
func PrintSvcGlbConfig(cfg models.SvcConfig) {
	log.EnterFn(0, "PrintSvcGlbConfig")
	log.SysConfTrace(0, "Commissions Service Configuration: %+v", cfg)
	log.ExitFn(0, "PrintSvcGlbConfig", nil)
}

/******************************************************************************
 * FUNCTION:        UpdateSrvConfiguration
 *
 * DESCRIPTION:   function is used to update the server config structure
 * INPUT:        N/A
 * RETURNS:      N/A
 ******************************************************************************/
func UpdateSrvConfiguration() {
	log.EnterFn(0, "UpdateSrvConfiguration")

	if strings.Contains(types.CommGlbCfg.SelfAddr, ":") {
		ipPort := strings.Split(types.CommGlbCfg.SelfAddr, ":")
		if len(ipPort) == 2 {
			port, _ := strconv.Atoi(ipPort[1])
			if port != 0 {
				if nil == net.ParseIP(ipPort[0]) {
					types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.Addr = fmt.Sprintf(":%v", port)
					types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.SslAddr = fmt.Sprintf(":%v", port+1)
				} else {
					types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.Addr = fmt.Sprintf("%v:%v", ipPort[0], port)
					types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.SslAddr = fmt.Sprintf("%v:%v", ipPort[0], port+1)
					types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.AddrStd = fmt.Sprintf("%v:%v", ipPort[0], 80)
					types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.SslAddrStd = fmt.Sprintf("%v:%v", ipPort[0], 443)
				}
			}
		}
	}
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ReadTimeout = int(types.CommGlbCfg.HTTPCfg.HTTPReadTimeOut)
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.WriteTimeout = int(types.CommGlbCfg.HTTPCfg.HTTPWriteTimeOut)
	types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.IdleTimeout = int(types.CommGlbCfg.HTTPCfg.HTTPIdleTimeOut)

	log.ExitFn(0, "UpdateSrvConfiguration", nil)
}

/******************************************************************************
 * FUNCTION:       HandleDynamicLoggingConf
 *
 * DESCRIPTION:    function to get handle logging configuration
 *                       recieved at run time through an external entity
 * INPUT:
 * RETURNS:
 ******************************************************************************/
func HandleDynamicLoggingConf(resp http.ResponseWriter, req *http.Request) models.LoggingCfg {
	var err error
	var logCfg models.LoggingCfg

	log.EnterFn(0, "HandleDynamicLoggingConf")
	defer func() { log.ExitFn(0, "HandleDynamicLoggingConf", err) }()

	log.ConfDebugTrace(0, "Processing loggingConf api recieved from external peer.")
	bVal, _ := ioutil.ReadAll(req.Body)
	err = json.Unmarshal(bVal, &logCfg)
	if err == nil {
		/* Update the New Config in DB */
		types.CommGlbCfg.LogCfg = logCfg
		resp.WriteHeader(http.StatusOK)
	} else {
		log.ConfErrorTrace(0, "Failed to decode json data of loggingconf api.")
		resp.WriteHeader(http.StatusBadRequest)
	}
	return logCfg
}

func HandleDynamicHttpConf(resp http.ResponseWriter, req *http.Request) models.HTTPConfig {
	var err error
	var httpCfg models.HTTPConfig

	log.EnterFn(0, "HandleDynamicHttpConf")
	defer func() { log.ExitFn(0, "HandleDynamicHttpConf", err) }()

	log.ConfDebugTrace(0, "Processing httpConf api recieved from external peer.")
	bVal, _ := ioutil.ReadAll(req.Body)
	err = json.Unmarshal(bVal, &httpCfg)
	if err == nil {
		/* Update the new config in DB */
		types.CommGlbCfg.HTTPCfg = httpCfg
		resp.WriteHeader(http.StatusOK)
	} else {
		log.ConfErrorTrace(0, "Failed to decode json data of httpConf api.")
		resp.WriteHeader(http.StatusBadRequest)
	}
	return httpCfg
}
