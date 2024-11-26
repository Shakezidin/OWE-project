/**************************************************************************
 *      Function        : init.go
 *      DESCRIPTION     : This file contains functions to initialize
 *							 OWE Leads service
 *      DATE            : 11-Sept-2024
 **************************************************************************/

package main

import (
	leadsService "OWEApp/owehub-leads/common"
	"OWEApp/owehub-leads/docusignclient"
	apiHandler "OWEApp/owehub-leads/services"
	appserver "OWEApp/shared/appserver"
	"OWEApp/shared/db"
	emailClient "OWEApp/shared/email"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	timerHandler "OWEApp/shared/timer"
	"OWEApp/shared/types"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"

	azidentity "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/google/uuid"
	msgraphsdk "github.com/microsoftgraph/msgraph-sdk-go"
	"gopkg.in/natefinch/lumberjack.v2"
)

type CfgFilePaths struct {
	CfgJsonDir          string
	LoggingConfJsonPath string
	HTTPConfJsonPath    string
	DbConfJsonPath      string
	LeadAppConfJsonPath string
	OutlookApiConfig    string
	EmailConfJsonPath   string
}

var (
	gCfgFilePaths CfgFilePaths
)

const (
	AppVersion = "1.0.0"
)

var leadsRoleGroup = []types.UserGroup{types.GroupEveryOne}

var apiRoutes = appserver.ApiRoutes{
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/loggingconf",
		handleDynamicLoggingConf,
		false,
		[]types.UserGroup{},
	},

	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/get_sales_reps",
		apiHandler.HandleGetSalesRepsRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/create_leads",
		apiHandler.HandleCreateLeadsRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/get_leads_count_by_status",
		apiHandler.HandleGetLeadsCountByStatusRequest,
		true,
		leadsRoleGroup,
	},

	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/toggle_archive",
		apiHandler.HandleToggleArchive,
		true,
		leadsRoleGroup,
	},

	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/get_leads",
		apiHandler.HandleGetLeadsDataRequest,
		true,
		leadsRoleGroup,
	},

	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/leads_history",
		apiHandler.HandleGetLeadsHistory,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/sent_appointment",
		apiHandler.HandleSentAppointmentRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/delete_lead",
		apiHandler.HandleDeleteRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/get_periodic_won_lost_leads",
		apiHandler.HandleGetPeriodicWonLostLeadsRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/edit_leads",
		apiHandler.HandleEditLeadsRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/status_won",
		apiHandler.HandleWonRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/update_lead_status",
		apiHandler.HandleUpdateLeadStatusRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/get_lead_info",
		apiHandler.HandleGetLeadInfo,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/get_leads_home_page",
		apiHandler.HandleGetLeadHomePage,
		true,
		leadsRoleGroup,
	},

	// AURORA
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/aurora_create_project",
		apiHandler.HandleAuroraCreateProjectRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/aurora_create_design",
		apiHandler.HandleAuroraCreateDesignRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/aurora_create_proposal",
		apiHandler.HandleAuroraCreateProposalRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/aurora_get_project",
		apiHandler.HandleAuroraGetProjectRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/aurora_get_proposal",
		apiHandler.HandleAuroraGetProposalRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/aurora_list_modules",
		apiHandler.HandleAuroraListModulestRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/aurora_retrieve_modules",
		apiHandler.HandleAuroraRetrieveModulestRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/aurora_generate_web_proposal",
		apiHandler.HandleAuroraGenerateWebProposalRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/aurora_retrieve_Web_Proposal",
		apiHandler.HandleAuroraRetrieveWebProposalRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("GET"),
		"/owe-leads-service/v1/aurora_generate_pdf",
		apiHandler.HandleAuroraGeneratePdfRequest,
		false,
		leadsRoleGroup,
	},

	// DOCUSIGN
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/docusign_oauth",
		apiHandler.HandleDocusignOauth,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/docusign_create_envelope",
		apiHandler.HandleDocusignCreateEnvelopeRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/docusign_create_recipient_view",
		apiHandler.HandleDocusignCreateRecipientViewRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/docusign_get_document",
		apiHandler.HandleDocusignGetDocumentRequest,
		true,
		leadsRoleGroup,
	},
	{
		strings.ToUpper("GET"),
		"/owe-leads-service/v1/docusign_get_signing_url",
		apiHandler.HandleDocusignGetSigningUrlRequest,
		false,
		[]types.UserGroup{},
	},
	// WEBHOOKS
	{
		strings.ToUpper("GET"),
		"/owe-leads-service/v1/aurora_webhook",
		apiHandler.HandleAuroraWebhookAction,
		false,
		[]types.UserGroup{},
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/receive_graph_notification",
		apiHandler.HandleReceiveGraphNotificationRequest,
		false,
		[]types.UserGroup{},
	},
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/docusign_connect_listener",
		apiHandler.HandleDocusignConnectListenerRequest,
		false,
		[]types.UserGroup{},
	},

	// get_appointment_setters_under
	{
		strings.ToUpper("POST"),
		"/owe-leads-service/v1/get_appointment_setters_under",
		apiHandler.HandleGetAppointmentSettersUnderRequest,
		true,
		leadsRoleGroup,
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
			log.ConfInfoTrace(0, "Owe-Calculation Service Initialization failed. Exiting... %+v", err)
			os.Exit(1)
		}
		log.ConfDebugTrace(0, "Owe-Calculation Service Initialized Successfully")
	}()
	/* Initializing Logger package */
	initLogger("OWEHUB-LEADS", "-", "-", log.FUNCTRL, "VM", "/var/log/owe/owehub-leads.log", 100, 28, 3)
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
	} else {
		log.FuncDebugTrace(0, "Successfully Connected with Database.")
	}

	//*******************************************************************************************
	/* Initializing Graph Api Connection */
	err = FetchgraphApiCfg()
	if err != nil {
		log.ConfErrorTrace(0, "Failed to get Graph Api Cfg error = %+v", err)
		return
	} else {
		log.FuncDebugTrace(0, "Successfully Fetched Graph Api Cgf")
	}

	/* Creating outlook client */
	err = GenerateGraphApiClient()
	if err != nil {
		log.ConfErrorTrace(0, "Failed to get generate Graph Api Client error = %+v", err)
		return
	} else {
		log.FuncDebugTrace(0, "Successfully created Graph Api Client")
	}

	types.ExitChan = make(chan error)
	types.CommGlbCfg.SelfInstanceId = uuid.New().String()

	PrintSvcGlbConfig(types.CommGlbCfg)

	/* Initialize docusign client */
	err = InitDocusignClient()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to initialize docusign client err %v", err)
		return
	}

	/* Setup outlook webhooks */
	err = leadsService.SetupOutlookWebhooks()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to setup outlook webhooks err %v", err)
		return
	}

	/* Initialize email client */
	err = emailClient.FetchEmailCfg(gCfgFilePaths.EmailConfJsonPath)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to initialize email client err %v", err)
		return
	}

	/*Initialize logger package again with new configuraion*/
	initLogger("OWEHUB-LEADS", log.InstanceIdtype(types.CommGlbCfg.SelfInstanceId), "-", log.LogLeveltype(types.CommGlbCfg.LogCfg.LogLevel), types.CommGlbCfg.LogCfg.LogEnv, types.CommGlbCfg.LogCfg.LogFile, int(types.CommGlbCfg.LogCfg.LogFileSize), int(types.CommGlbCfg.LogCfg.LogFileAge), int(types.CommGlbCfg.LogCfg.LogFileBackup))
}

func handleDynamicLoggingConf(resp http.ResponseWriter, req *http.Request) {
	types.CommGlbCfg.LogCfg = HandleDynamicLoggingConf(resp, req)
	initLogger("OWEHUB-LEADS", log.InstanceIdtype(types.CommGlbCfg.SelfInstanceId), "-", log.LogLeveltype(types.CommGlbCfg.LogCfg.LogLevel), types.CommGlbCfg.LogCfg.LogEnv, types.CommGlbCfg.LogCfg.LogFile, int(types.CommGlbCfg.LogCfg.LogFileSize), int(types.CommGlbCfg.LogCfg.LogFileAge), int(types.CommGlbCfg.LogCfg.LogFileBackup))

}

func handleDynamicHttpConf(resp http.ResponseWriter, req *http.Request) {
	types.CommGlbCfg.HTTPCfg = HandleDynamicHttpConf(resp, req)
}

/******************************************************************************
* FUNCTION:        FetchgraphApiCfg
*
* DESCRIPTION:   function is used to get the Graph Api configurations
* INPUT:        service name to be initialized
* RETURNS:      error
******************************************************************************/
func FetchgraphApiCfg() (err error) {
	log.EnterFn(0, "FetchgraphApiCfg")
	defer func() { log.ExitFn(0, "FetchgraphApiCfg", err) }()

	var graphApiCfg models.GraphApiConfInfo

	log.ConfDebugTrace(0, "Reading Graph Api Config from: %+v", gCfgFilePaths.OutlookApiConfig)
	file, err := os.Open(gCfgFilePaths.OutlookApiConfig)
	if err != nil {
		log.ConfErrorTrace(0, "Failed to open file %+v: %+v", gCfgFilePaths.OutlookApiConfig, err)
		panic(err)
	}
	bVal, _ := ioutil.ReadAll(file)
	err = json.Unmarshal(bVal, &graphApiCfg)
	if err != nil {
		log.ConfErrorTrace(0, "Failed to Urmarshal file: %+v Error: %+v", gCfgFilePaths.OutlookApiConfig, err)
		panic(err)
	}

	types.CommGlbCfg.GraphApiCfg = graphApiCfg
	log.ConfDebugTrace(0, "Graph Api Configurations: %+v", types.CommGlbCfg.GraphApiCfg)

	return err
}

/******************************************************************************
* FUNCTION:        GenerateGraphApiClient
*
* DESCRIPTION:   function is used to generate the Graph Api client
* INPUT:        service name to be initialized
* RETURNS:      error
******************************************************************************/
func GenerateGraphApiClient() error {
	cred, err := azidentity.NewClientSecretCredential(
		types.CommGlbCfg.GraphApiCfg.TenantId,
		types.CommGlbCfg.GraphApiCfg.ClientId,
		types.CommGlbCfg.GraphApiCfg.ClientSecret,
		nil,
	)

	if err != nil {
		log.ConfErrorTrace(0, "Failed to GenerateGraphApiClient: %v", err)
		return err
	}

	client, err := msgraphsdk.NewGraphServiceClientWithCredentials(cred, []string{
		"https://graph.microsoft.com/.default",
	})

	if err != nil {
		log.ConfErrorTrace(0, "Failed to create Graph client: %v", err)
		return err
	}

	types.CommGlbCfg.ScheduleGraphApiClient = client
	log.ConfDebugTrace(0, "Graph Client Created: %+v", types.CommGlbCfg.ScheduleGraphApiClient)
	return nil
}

/*******************************************************************************
 * FUNCTION:        InitDocusignClient
 *
 * DESCRIPTION:     This function will be used to initialize docusign client
 *
 * INPUT:           N/A
 *
 * RETURNS:         error
 *******************************************************************************/
func InitDocusignClient() error {
	var err error

	log.EnterFn(0, "InitDocusignClient")
	defer func() { log.ExitFn(0, "InitDocusignClient", err) }()

	err = docusignclient.RegenerateAuthToken()

	if err != nil {
		log.ConfErrorTrace(0, "Failed to initialize docusign client err %v", err)
		return err
	}

	_, err = timerHandler.StartTimer(timerHandler.TimerData{
		Recurring:    true,
		TimeToExpire: 45 * 60, // 45 minutes
		FuncHandler: func(timerType int32, data interface{}) {
			err := docusignclient.RegenerateAuthToken()
			if err != nil {
				log.FuncDebugTrace(0, "Failed to regenerate Docusign Auth token: %v", err)
				return
			}
			log.FuncDebugTrace(0, "Docusign Auth token regenerated")
		},
	})

	return err
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

	/* Read and Initialize Aurora configuration from cfg */
	if err := FetchAuroraCfg(); err != nil {
		log.ConfErrorTrace(0, "FetchAuroraCfg failed %+v", err)
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
	gCfgFilePaths.LeadAppConfJsonPath = gCfgFilePaths.CfgJsonDir + "leadAppConfig.json"
	gCfgFilePaths.OutlookApiConfig = gCfgFilePaths.CfgJsonDir + "outlookGraphConfig.json"
	gCfgFilePaths.EmailConfJsonPath = gCfgFilePaths.CfgJsonDir + "emailConfig.json"

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

	var dbCfgList models.DBConfigList
	log.ConfDebugTrace(0, "Reading DB Config for from: %+v", gCfgFilePaths.DbConfJsonPath)
	file, err := os.Open(gCfgFilePaths.DbConfJsonPath)
	if err != nil {
		log.ConfErrorTrace(0, "Failed to open file %+v: %+v", gCfgFilePaths.DbConfJsonPath, err)
		panic(err)
	}
	bVal, _ := ioutil.ReadAll(file)
	err = json.Unmarshal(bVal, &dbCfgList)
	types.CommGlbCfg.DbConfList = dbCfgList
	log.ConfDebugTrace(0, "Database Configurations: %+v", types.CommGlbCfg.DbConfList)
	return err
}

/******************************************************************************
 * FUNCTION:        FetchAuroraCfg
 *
 * DESCRIPTION:   function is used to get the Aurora configuration
 * INPUT:        service name to be initialized
 * RETURNS:      error
 ******************************************************************************/
func FetchAuroraCfg() (err error) {
	log.EnterFn(0, "FetchAuroraCfg")
	defer func() { log.ExitFn(0, "FetchAuroraCfg", err) }()

	var auroraCfg leadsService.LeadAppConfig
	log.ConfDebugTrace(0, "Reading Aurora Config from: %+v", gCfgFilePaths.LeadAppConfJsonPath)
	file, err := os.Open(gCfgFilePaths.LeadAppConfJsonPath)
	if err != nil {
		log.ConfErrorTrace(0, "Failed to open file %+v: %+v", gCfgFilePaths.LeadAppConfJsonPath, err)
		panic(err)
	}
	bVal, _ := ioutil.ReadAll(file)
	err = json.Unmarshal(bVal, &auroraCfg)
	if err != nil {
		log.ConfErrorTrace(0, "Failed to Urmarshal file: %+v Error: %+v", gCfgFilePaths.LeadAppConfJsonPath, err)
		panic(err)
	}
	leadsService.LeadAppCfg = auroraCfg
	log.ConfDebugTrace(0, "Aurora Configurations: %+v", leadsService.LeadAppCfg)

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

	types.CommGlbCfg.HTTPTimerCallBackPath = models.URISchemehttp + types.CommGlbCfg.SelfAddr + "/owe-leads-service/v1"

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
	log.SysConfTrace(0, "owehub-leads Service Configuration: %+v", cfg)
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
