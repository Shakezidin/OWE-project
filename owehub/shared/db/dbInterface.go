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

	OWEDB                                    string = "owe_db"
	dbDriverName                             string = "postgres"
	CreateUserFunction                       string = "create_new_user"
	GetDbTables                              string = "get_db_tables"
	CreateTeamFunction                       string = "create_new_team"
	CreateApiSetterFunction                  string = "create_appointment_setter"
	CreateCommissionFunction                 string = "create_new_commission"
	CreateDealerFunction                     string = "create_new_dealer"
	CreateVAddersFunction                    string = "create_new_vadders"
	CreateMarketingFeesFunction              string = "create_new_marketing_fees"
	CreateSaleTypeFunction                   string = "create_new_sale_type"
	CreateTierLoanFeeFunction                string = "create_tier_loan_fee_type"
	CreateDealerTierFunction                 string = "create_new_dealer_tier"
	CreatePaymentScheduleFunction            string = "create_new_payment_schedule"
	CreateTimelineSlaFunction                string = "create_new_timeline_sla"
	CreatePartnerFunction                    string = "create_new_partner"
	CreateStateFunction                      string = "create_new_state"
	CreateLoanTypeFunction                   string = "create_new_loan_type"
	CreateAutoAdderFunction                  string = "create_new_auto_adder"
	CreateRebateDataFunction                 string = "create_new_rebate_data"
	CreateAdderDataFunction                  string = "create_new_adder_data"
	CreateLoanFeeAdderFunction               string = "create_new_loan_fee_adder"
	CreateDLR_OTHFunction                    string = "create_new_dlr_oth"
	CreateDealerCreditFunction               string = "create_new_dealer_credit"
	CreateNonCommDlrPayFunction              string = "create_new_non_comm_dlr_pay"
	CreateReferralDataFunction               string = "create_new_referral_data"
	CreateRepPaySettingsDataFunction         string = "create_new_rep_pay_settings"
	CreateLeaderOverrideFunction             string = "create_new_leader_override"
	CreateRateAdjustmentsFunction            string = "create_new_rate_adjustments"
	CreateInstallCostFunction                string = "create_new_install_cost"
	CreateArScheduleFunction                 string = "create_new_ar_schedule"
	CreateAdjustmentsFunction                string = "create_new_adjustments"
	CreateAdderResponsibilityFunction        string = "create_new_adder_responsibility"
	CreateAdderCreditFunction                string = "create_new_adder_credit"
	CreateLoanFeeFunction                    string = "create_new_loan_fee"
	CreateArImportFunction                   string = "create_new_ar_import"
	CreateArFunction                         string = "create_new_ar"
	CreateApptSettersFunction                string = "create_new_appt_setters"
	CreateReconcileFunction                  string = "create_new_reconcile"
	CreateAdderDataConfigFunction            string = "create_new_adder_data_config"
	CreateApRepFunction                      string = "create_new_ap_rep"
	CreateVDealerFunction                    string = "create_v_dealer"
	CreateApOthFuntion                       string = "create_ap_oth"
	CreateApDedFuntion                       string = "create_ap_ded"
	CreateApPdaFuntion                       string = "create_ap_pda"
	CreateApAdvFuntion                       string = "create_ap_adv"
	CreateRepIncentFuntion                   string = "create_rep_incent"
	CreateRepStatusFuntion                   string = "create_rep_status"
	CreateRepCreditFuntion                   string = "create_rep_credit"
	CreateDBAFuntion                         string = "create_dba"
	CreateSlackConfigFuntion                 string = "create_slack_config"
	UpdateSlackConfigArchiveFuntion          string = "update_slack_config_archive"
	UpdateSlackConfigFuntion                 string = "update_slack_config"
	AddTeamMembers                           string = "add_team_members"
	DeleteTeamMember                         string = "delete_team_member"
	DeleteTeams                              string = "delete_teams"
	UpdateTeamName                           string = "update_team_name"
	UpdateApOthFuntion                       string = "update_ap_oth"
	UpdateRepTeamFuntion                     string = "update_rep_team"
	UpdateApOthArchiveFunction               string = "update_ap_oth_archive"
	UpdateApDedFuntion                       string = "update_ap_ded"
	UpdateApDedArchiveFunction               string = "update_ap_ded_archive"
	UpdateApPdaFuntion                       string = "update_ap_pda"
	UpdateApPdaArchiveFunction               string = "update_ap_pda_archive"
	UpdateApAdvFuntion                       string = "update_ap_adv"
	UpdateApAdvArchiveFunction               string = "update_ap_adv_archive"
	UpdateRepIncentFuntion                   string = "update_rep_incent"
	UpdateRepIncentArchiveFunction           string = "update_rep_incent_archive"
	UpdateRepStatusFuntion                   string = "update_rep_status"
	UpdateRepStatusArchiveFunction           string = "update_rep_status_archive"
	UpdateRepCreditFuntion                   string = "update_rep_credit"
	UpdateRepCreditArchiveFunction           string = "update_rep_credit_archive"
	UpdateDBAFuntion                         string = "update_dba"
	UpdateDBAArchiveFunction                 string = "update_dba_archive"
	UpdateCommissionFunction                 string = "update_commission"
	UpdateCommissionArchiveFunction          string = "update_commission_archive"
	UpdateDealerOverrideFunction             string = "update_dealer_override"
	UpdateDealerOverrideArchiveFunction      string = "update_dealer_override_archive"
	UpdateMarketingFeeFunction               string = "update_marketing_fee"
	UpdateMarketingFeesArchiveFunction       string = "update_marketing_fees_archive"
	UpdateAdderDataFunction                  string = "update_adder_data"
	UpdateAdderDataArchiveFunction           string = "update_adder_data_archive"
	UpdateVAddersFunction                    string = "update_v_adders"
	UpdateVAddersArchiveFunction             string = "update_v_adders_archive"
	UpdateSaleTypeFunction                   string = "update_sale_type"
	UpdateSaleTypeArchiveFunction            string = "update_sale_type_archive"
	UpdateUsersArchiveFunction               string = "update_users_archive"
	UpdateTierLoanFeeFunction                string = "update_tier_loan_fee"
	UpdateLeaderOverrideFunction             string = "update_leader_override"
	UpdateLeaderOverrideArchiveFunction      string = "update_leader_override_archive"
	UpdateTierLoanFeeArchiveFunction         string = "update_tier_loan_fee_archive"
	UpdateDealerTierFunction                 string = "update_dealer_tier"
	UpdateDealerTierArchiveFunction          string = "update_dealer_tier_archive"
	UpdatePaymentScheduleFunction            string = "update_payment_schedule"
	UpdatePaymentScheduleArchiveFunction     string = "update_payment_schedule_archive"
	UpdateTimelineSlaFunction                string = "update_timeline_Sla"
	UpdateTimelineSlaArchiveFunction         string = "update_timeline_sla_archive"
	UpdateLoanTypeFunction                   string = "update_loan_type"
	UpdateLoanTypeArchiveFunction            string = "update_loan_type_archive"
	UpdateAutoAdderFunction                  string = "update_auto_adder"
	UpdateAutoAdderArchiveFunction           string = "update_auto_adder_archive"
	UpdateUserFunction                       string = "update_user"
	UpdateRebateDataFunction                 string = "update_rebate_data"
	UpdateRebateDataArchiveFunction          string = "update_rebate_data_archive"
	UpdateLoanFeeAdderFunction               string = "update_loan_fee_adder"
	UpdateLoanFeeAdderArchiveFunction        string = "update_loan_fee_adder_archive"
	UpdateReferralDataFunction               string = "update_new_referral_data"
	UpdateDLR_OTHFunction                    string = "update_dlr_oth"
	UpdateDLR_OTHArchiveFunction             string = "update_dlr_oth_archive"
	UpdateDealerCreditFunction               string = "update_dealer_credit"
	UpdateDealerCreditArchiveFunction        string = "update_dealer_credit_archive"
	UpdateAdjustmentsFunction                string = "update_adjustments"
	UpdateApRepArchiveFunction               string = "update_aprep_archive"
	UpdateAdjustmentsArchiveFunction         string = "update_adjustments_archive"
	UpdateNonCommDlrPayFunction              string = "update_non_comm_dlr_pay"
	UpdateNonCommDlrPayArchiveFunction       string = "update_noncomm_dlr_pay_archive"
	UpdateReferralDataArchiveFunction        string = "update_referral_data_archive"
	UpdateRepPaySettingsDataFunction         string = "update_rep_pay_settings"
	UpdateInstallCostFunction                string = "update_install_cost"
	UpdateInstallCostArchiveFunction         string = "update_install_cost_archive"
	UpdateArScheduleFunction                 string = "update_ar_schedule"
	UpdateArScheduleArchiveFunction          string = "update_ar_schedule_archive"
	UpdateRateAdjustmentsFunction            string = "update_rate_adjustments"
	UpdateRateAdjustmentsArchiveFunction     string = "update_rate_adjustments_archive"
	UpdateRepPaySettingsArchiveFunction      string = "update_rep_pay_settings_archive"
	UpdateAdderResponsibilityFunction        string = "update_adder_responsibility"
	UpdateAdderResponsibilityArchiveFunction string = "update_adder_responsibility_archive"
	UpdateAdderCreditFunction                string = "update_adder_credit"
	UpdateAdderCreditArchiveFunction         string = "update_adder_credit_archive"
	UpdateLoanFeeFunction                    string = "update_loan_fee"
	UpdateLoanFeeArchiveFunction             string = "update_loan_fee_archive"
	UpdateArImportFunction                   string = "update_ar_import"
	UpdateArImportArchiveFunction            string = "update_ar_import_archive"
	UpdateArFunction                         string = "update_ar"
	UpdateArArchiveFunction                  string = "update_ar_archive"
	UpdateApptSettersFunction                string = "update_appt_setters"
	UpdateApptSettersArchiveFunction         string = "update_appt_setters_archive"
	UpdateReconcileFunction                  string = "update_reconcile"
	UpdateReconcileArchiveFunction           string = "update_reconcile_archive"
	UpdateAdderDataConfigFunction            string = "update_adder_data_config"
	UpdateApRepFunction                      string = "update_ap_rep"
	UpdateVDealerFunction                    string = "update_v_dealer"
	UpdateVDealerArchiveFunction             string = "update_v_dealer_archive"
	UpdateProfileFunction                    string = "update_profile_function"
	TableName_teams                          string = "teams"
	TableName_commission_rates               string = "commission_rates"
	TableName_users_details                  string = "user_details"
	TableName_dealer_override                string = "dealer_override"
	TableName_marketing_fees                 string = "marketing_fees"
	TableName_v_adders                       string = "v_adders"
	TableName_sale_type                      string = "sale_type"
	TableName_tier_loan_fee                  string = "tier_loan_fee"
	TableName_dealer_tier                    string = "dealer_tier"
	TableName_payment_schedule               string = "payment_schedule"
	TableName_timeline_sla                   string = "timeline_sla"
	TableName_partners                       string = "partners"
	TableName_states                         string = "states"
	TableName_loan_type                      string = "loan_type"
	TableName_source                         string = "source"
	TableName_adder_type                     string = "adder_type"
	TableName_tier                           string = "tier"
	TableName_auto_adder                     string = "auto_adder"
	TableName_user_roles                     string = "user_roles"
	TableName_loan_fee_adder                 string = "loan_fee_adder"
	TableName_referral_data                  string = "referral_data"
	TableName_noncomm_dlr_pay                string = "noncomm_dlrpay"
	TableName_dealer_credit                  string = "dealer_credit"
	TableName_RepPaySettingss                string = "rep_pay_settings"
	TableName_leader_override                string = "leader_override"
	TableName_rate_adjustments               string = "rate_adjustments"
	TableName_install_cost                   string = "install_cost"
	TableName_ar_schedule                    string = "ar_schedule"
	TableName_adjustments                    string = "adjustments"
	TableName_AdderResponsibility            string = "adder_responsibility"
	TableName_AdderCredit                    string = "adder_credit"
	TableName_LoanFee                        string = "loan_fee"
	TableName_SalesArCalc                    string = "sales_ar_calc"
	TableName_ArImport                       string = "ar_import"
	TableName_Ar                             string = "sales_ar_cfg"
	TableName_Appt_Setters                   string = "appt_setters"
	TableName_Reconcile                      string = "reconcile"
	ViewName_ConsolidatedDataView            string = "consolidated_data_view"
	TableName_Dlr_Oth                        string = "dlr_oth"
	TableName_rebate_data                    string = "rebate_data"
	TableName_adder_data                     string = "adder_data"
	TableName_sales_metrics_schema           string = "sales_metrics_schema"
	TableName_Adder_data_config              string = "adder_data_cfg_shema"
	TableName_finance_metrics_schema         string = "finance_metrics_schema"
	TableName_Pg_Stat_Activity               string = "pg_stat_activity"
	TableName_v_dealer                       string = "v_dealer"
	TableName_ap_rep                         string = "ap_rep"
	TableName_DLR_PAY_APCALC                 string = "dealer_pay_calc_standard"
	TableName_REP_PAY_APCALC                 string = "rep_pay_cal_standard"
	TableName_REP_PAY_APCALC_OVRD            string = "rep_pay_cal_ovrrd_standard"
	TableName_ap_oth                         string = "ap_oth"
	TableName_ap_ded                         string = "ap_ded"
	TableName_ap_pda                         string = "ap_pda"
	TableName_ap_adv                         string = "ap_adv"
	TableName_dba                            string = "dba"
	TableName_slackconfig                    string = "slackconfig"
	TableName_rep_incent                     string = "rep_incent"
	TableName_rep_status                     string = "rep_status"
	TableName_rep_credit                     string = "rep_credit"
	TableName_rep_type                       string = "rep_type"
	TableName_Sales_Rep_DBhub                string = "sales_rep_dbhub_schema"
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
