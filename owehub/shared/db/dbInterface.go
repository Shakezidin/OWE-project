/**************************************************************************
 * File            : dbInterface.go
 * DESCRIPTION     : This file contains common structures and functions
 * DATE            : 15-Jan-2024
 **************************************************************************/

package db

import (
	log "OWEApp/shared/logger"
	CfgModels "OWEApp/shared/models"
	types "OWEApp/shared/types"
	"time"

	"database/sql"
	"fmt"
)

var (
	dbHandleCxt = make([]CfgModels.DBHandleCxt, 0)
)

const (
	OweHubDbIndex  uint8 = 0
	RowDataDBIndex uint8 = 1

	OWEDB                            string = "owe_db"
	RowDataApiSecret                 string = "XEBLLtt1nlfwa0uQL1tEMlGG"
	dbDriverName                     string = "postgres"
	CreateUserFunction               string = "create_new_user"
	GetDbTables                      string = "get_db_tables"
	CreateTeamFunction               string = "create_new_team"
	CreatePartnerFunction            string = "create_new_partner"
	CreateStateFunction              string = "create_new_state"
	CreateVDealerFunction            string = "create_v_dealer"
	CreateSlackConfigFuntion         string = "create_slack_config"
	UpdateSlackConfigArchiveFuntion  string = "update_slack_config_archive"
	UpdateSlackConfigFuntion         string = "update_slack_config"
	AddTeamMembers                   string = "add_team_members"
	DeleteTeamMember                 string = "delete_team_member"
	DeleteTeams                      string = "delete_teams"
	UpdateTeamName                   string = "update_team_name"
	UpdateRepTeamFuntion             string = "update_rep_team"
	UpdateUsersArchiveFunction       string = "update_users_archive"
	UpdateUserFunction               string = "update_user"
	UpdateVDealerFunction            string = "update_v_dealer"
	UpdateVDealerArchiveFunction     string = "update_v_dealer_archive"
	UpdateProfileFunction            string = "update_profile_function"
	TableName_teams                  string = "teams"
	TableName_users_details          string = "user_details"
	TableName_partners               string = "partners"
	TableName_states                 string = "states"
	TableName_user_roles             string = "user_roles"
	ViewName_ConsolidatedDataView    string = "consolidated_data_view"
	TableName_sales_metrics_schema   string = "sales_metrics_schema"
	TableName_finance_metrics_schema string = "finance_metrics_schema"
	TableName_Pg_Stat_Activity       string = "pg_stat_activity"
	TableName_v_dealer               string = "v_dealer"
	TableName_slackconfig            string = "slackconfig"
	TableName_Sales_Rep_DBhub        string = "sales_rep_dbhub_schema"

	/* Battery Backup Calculator Tables and Procedures */
	CreateBatteryBackupCalcProspectInfo string = "create_prospect_info"
	InsertBatteryBackupCalcProspectLoad string = "insert_prospect_load_info"
	TableName_Prospect_Info             string = "prospects_info"
	TableName_Prospect_Load             string = "prospect_load_info"
	TableName_Breaker_Info              string = "breaker_info"
	TableName_Prospect_LoadBreaker_Map  string = "prospect_load_breakers"

	/*Commissions Config Tables*/
	TableName_DealerOverrideCommisionsDbhub          string = "dealer_override_commisions_dbhub"
	TableName_DealerCreditsCommisionsDbhub           string = "dealer_credits_commisions_dbhub"
	TableName_DealerPaymentsCommisionsDbhub          string = "dealer_payments_commisions_dbhub"
	TableName_SalesPartnerPayScheduleCommisionsDbhub string = "sales_partner_pay_schedule_commisions_dbhub"
	TableName_FinanceScheduleCommisionsDbhub         string = "finance_schedule_commisions_dbhub"
	TableName_FinanceTypesCommisionsDbhub            string = "finance_types_commisions_dbhub"

	/* Leads Tables and Procedures */
	TableName_Leads_Info          string = "leads_info"
	CreateLeadFunction            string = "create_lead"
	UpdateLeadAddProposalFunction string = "update_lead_add_proposal"
	GetUsersUnderFunction         string = "get_users_under"

	/* Scheduling Tables and Procedures */
	TableName_SchedulingProjects    string = "scheduling_projects"
	TableName_SchedulingLocations   string = "scheduling_locations"
	CreateSchedulingProjectFunction string = "create_scheduling_project"
	UpdateSchedulingProjectFunction string = "update_scheduling_project"

	/* Reports Tables and Procedures */
	TableName_SupersetReports    string = "superset_reports"
	CreateSupersetReportFunction string = "create_superset_report"
)

/******************************************************************************
 * FUNCTION:        InitDBConnection
 * DESCRIPTION:     This function will try to initalize DB Connection
 * INPUT:			None
 * RETURNS:    		err
 ******************************************************************************/
func InitDBConnection() (err error) {
	log.EnterFn(0, "InitDBConnection")
	defer func() { log.ExitFn(0, "InitDBConnection", err) }()

	for _, dbConfig := range types.CommGlbCfg.DbConfList.DBConfigs {

		connStr := fmt.Sprintf("postgres://%v:%v@%v/%v?sslmode=disable",
			dbConfig.Username, dbConfig.Password, dbConfig.HostName, OWEDB)

		log.FuncInfoTrace(0, "Connection String is %s", connStr)
		var retry int = 1
		for {
			err = InitializeDB(connStr)
			if (retry >= 3) || (err == nil) {
				break
			}
			retry++
			time.Sleep(2 * time.Second)
		}
	}

	log.FuncInfoTrace(0, "Database Initialized Successfully")
	return err
}

/******************************************************************************
 * FUNCTION:        InitializeDB
 * DESCRIPTION:     This will Initialize the db context
 * INPUT:			dbName,
 * RETURNS:    		err
 ******************************************************************************/
func InitializeDB(dbConnString string) (err error) {
	var (
		DbCtx CfgModels.DBHandleCxt
	)

	defer func() {
		log.ExitFn(0, "InitializeDB", nil)
	}()
	log.EnterFn(0, "InitializeDB")

	openConnValue, _ := types.UtilsGetInt("DB_MAX_OPEN_CONN", 2000)
	idleConnValue, _ := types.UtilsGetInt("DB_MAX_IDLE_CONN", 100)

	ctxH, err := sql.Open(dbDriverName, dbConnString)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to initialize Database error = %v", err.Error())
		return err
	}

	ctxH.SetMaxOpenConns(openConnValue)
	ctxH.SetMaxIdleConns(idleConnValue)
	err = ctxH.Ping()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to Ping the Database error = %v\n", err.Error())
		return err
	}

	DbCtx.CtxH = ctxH
	dbHandleCxt = append(dbHandleCxt, DbCtx)

	return err
}

/******************************************************************************
 * FUNCTION:        getDBConnection
 * DESCRIPTION:     This will return the connection of DB
 * INPUT:			dbName
 * RETURNS:    		err
 ******************************************************************************/
func getDBConnection(dbIdx uint8, dbName string) (con *CfgModels.DBHandleCxt, err error) {
	defer func() {
		log.ExitFn(0, "getDBConnection", nil)
	}()
	log.EnterFn(0, "getDBConnection")

	return &dbHandleCxt[dbIdx], nil
}
