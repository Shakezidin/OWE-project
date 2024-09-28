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
	dbDriverName                     string = "postgres"
	CreateUserFunction               string = "create_new_user"
	GetDbTables                      string = "get_db_tables"
	CreateTeamFunction               string = "create_new_team"
	CreateVAddersFunction            string = "create_new_vadders"
	CreateSaleTypeFunction           string = "create_new_sale_type"
	CreateDealerTierFunction         string = "create_new_dealer_tier"
	CreateTimelineSlaFunction        string = "create_new_timeline_sla"
	CreatePartnerFunction            string = "create_new_partner"
	CreateStateFunction              string = "create_new_state"
	CreateLoanTypeFunction           string = "create_new_loan_type"
	CreateAutoAdderFunction          string = "create_new_auto_adder"
	CreateRebateDataFunction         string = "create_new_rebate_data"
	CreateArImportFunction           string = "create_new_ar_import"
	CreateArFunction                 string = "create_new_ar"
	CreateAdderDataConfigFunction    string = "create_new_adder_data_config"
	CreateVDealerFunction            string = "create_v_dealer"
	CreateDBAFuntion                 string = "create_dba"
	CreateSlackConfigFuntion         string = "create_slack_config"
	UpdateSlackConfigArchiveFuntion  string = "update_slack_config_archive"
	UpdateSlackConfigFuntion         string = "update_slack_config"
	AddTeamMembers                   string = "add_team_members"
	DeleteTeamMember                 string = "delete_team_member"
	DeleteTeams                      string = "delete_teams"
	UpdateTeamName                   string = "update_team_name"
	UpdateRepTeamFuntion             string = "update_rep_team"
	UpdateDBAFuntion                 string = "update_dba"
	UpdateVAddersFunction            string = "update_v_adders"
	UpdateVAddersArchiveFunction     string = "update_v_adders_archive"
	UpdateSaleTypeFunction           string = "update_sale_type"
	UpdateSaleTypeArchiveFunction    string = "update_sale_type_archive"
	UpdateUsersArchiveFunction       string = "update_users_archive"
	UpdateDealerTierFunction         string = "update_dealer_tier"
	UpdateDealerTierArchiveFunction  string = "update_dealer_tier_archive"
	UpdateTimelineSlaFunction        string = "update_timeline_Sla"
	UpdateTimelineSlaArchiveFunction string = "update_timeline_sla_archive"
	UpdateLoanTypeFunction           string = "update_loan_type"
	UpdateLoanTypeArchiveFunction    string = "update_loan_type_archive"
	UpdateAutoAdderFunction          string = "update_auto_adder"
	UpdateAutoAdderArchiveFunction   string = "update_auto_adder_archive"
	UpdateUserFunction               string = "update_user"
	UpdateRebateDataFunction         string = "update_rebate_data"
	UpdateRebateDataArchiveFunction  string = "update_rebate_data_archive"
	UpdateArImportFunction           string = "update_ar_import"
	UpdateArImportArchiveFunction    string = "update_ar_import_archive"
	UpdateArFunction                 string = "update_ar"
	UpdateArArchiveFunction          string = "update_ar_archive"
	UpdateAdderDataConfigFunction    string = "update_adder_data_config"
	UpdateVDealerFunction            string = "update_v_dealer"
	UpdateVDealerArchiveFunction     string = "update_v_dealer_archive"
	UpdateProfileFunction            string = "update_profile_function"
	TableName_teams                  string = "teams"
	TableName_users_details          string = "user_details"
	TableName_v_adders               string = "v_adders"
	TableName_sale_type              string = "sale_type"
	TableName_dealer_tier            string = "dealer_tier"
	TableName_timeline_sla           string = "timeline_sla"
	TableName_partners               string = "partners"
	TableName_states                 string = "states"
	TableName_loan_type              string = "loan_type"
	TableName_source                 string = "source"
	TableName_adder_type             string = "adder_type"
	TableName_tier                   string = "tier"
	TableName_auto_adder             string = "auto_adder"
	TableName_user_roles             string = "user_roles"
	TableName_SalesArCalc            string = "sales_ar_calc"
	TableName_ArImport               string = "ar_import"
	ViewName_ConsolidatedDataView    string = "consolidated_data_view"
	TableName_rebate_data            string = "rebate_data"
	TableName_sales_metrics_schema   string = "sales_metrics_schema"
	TableName_Adder_data_config      string = "adder_data_cfg_shema"
	TableName_finance_metrics_schema string = "finance_metrics_schema"
	TableName_Pg_Stat_Activity       string = "pg_stat_activity"
	TableName_v_dealer               string = "v_dealer"
	TableName_DLR_PAY_APCALC         string = "dealer_pay_calc_standard"
	TableName_REP_PAY_APCALC         string = "rep_pay_cal_standard"
	TableName_REP_PAY_APCALC_OVRD    string = "rep_pay_cal_ovrrd_standard"
	TableName_dba                    string = "dba"
	TableName_slackconfig            string = "slackconfig"
	TableName_rep_type               string = "rep_type"
	TableName_Sales_Rep_DBhub        string = "sales_rep_dbhub_schema"
	// TableName_DLR_PAY_APCALC                 string = "dealer_pay_calc_standard"
	// TableName_DLR_PAY_APCALC                 string = "dealer_pay_calc_standard"
	// TableName_DLR_PAY_APCALC                 string = "dealer_pay_calc_standard"
	// TableName_DLR_PAY_APCALC                 string = "dealer_pay_calc_standard"

	/* Battery Backup Calculator Tables and Procedures */
	CreateBatteryBackupCalcProspectInfo string = "create_prospect_info"
	InsertBatteryBackupCalcProspectLoad string = "insert_prospect_load_info"
	TableName_Prospect_Info             string = "prospects_info"
	TableName_Prospect_Load             string = "prospect_load_info"
	TableName_Breaker_Info              string = "breaker_info"
	TableName_Prospect_LoadBreaker_Map  string = "prospect_load_breakers"
	ViewName_REP_PAY                    string = "rep_pay_pr_data"

	/* Leads Tables and Procedures */
	TableName_Leads_Info string = "leads_info"
	CreateLeadFunction   string = "create_lead"
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
