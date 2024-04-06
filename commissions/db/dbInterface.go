/**************************************************************************
 * File            : dbInterface.go
 * DESCRIPTION     : This file contains common structures and functions
 * DATE            : 15-Jan-2024
 **************************************************************************/

package db

import (
	log "OWEApp/logger"
	CfgModels "OWEApp/models"
	types "OWEApp/types"
	"time"

	"database/sql"
	"fmt"
)

var (
	dbHandleCxt CfgModels.DBHandleCxt
)

const (
	OWEDB                         string = "owe_db"
	dbDriverName                  string = "postgres"
	CreateUserFunction            string = "create_new_user"
	CreateTeamFunction            string = "create_new_team"
	CreateApiSetterFunction       string = "create_appointment_setter"
	CreateCommissionFunction      string = "create_new_commission"
	CreateDealerFunction          string = "create_new_dealer"
	CreateVAddersFunction         string = "create_new_vadders"
	CreateMarketingFeesFunction   string = "create_new_marketing_fees"
	CreateSaleTypeFunction        string = "create_new_sale_type"
	CreateTierLoanFeeFunction     string = "create_tier_loan_fee_type"
	CreateDealerTierFunction      string = "create_new_dealer_tier"
	CreatePaymentScheduleFunction string = "create_new_payment_schedule"
	CreateTimelineSlaFunction     string = "create_new_timeline_sla"
	CreatePartnerFunction         string = "create_new_partner"
	CreateStateFunction           string = "create_new_state"
	CreateLoanTypeFunction        string = "create_new_loan_type"
	UpdateCommissionFunction      string = "update_commission"
	UpdateDealerOverrideFunction  string = "update_dealer_override"
	UpdateMarketingFeeFunction    string = "update_marketing_fee"
	UpdateVAddersFunction         string = "update_v_adders"
	UpdateSaleTypeFunction        string = "update_sale_type"
	UpdateTierLoanFeeFunction     string = "update_tier_loan_fee"
	UpdateDealerTierFunction      string = "update_dealer_tier"
	UpdatePaymentScheduleFunction string = "update_payment_schedule"
	TableName_teams               string = "teams"
	TableName_commission_rates    string = "commission_rates"
	TableName_users_details       string = "user_details"
	TableName_dealer_override     string = "dealer_override"
	TableName_marketing_fees      string = "marketing_fees"
	TableName_v_adders            string = "v_adders"
	TableName_sale_type           string = "sale_type"
	TableName_tier_loan_fee       string = "tier_loan_fee"
	TableName_dealer_tier         string = "dealer_tier"
	TableName_payment_schedule    string = "payment_schedule"
	TableName_timeline_sla        string = "timeline_sla"
	TableName_partners            string = "partners"
	TableName_states              string = "states"
	TableName_loan_type           string = "loan_type"
	TableName_source              string = "source"
	TableName_adder_type          string = "adder_type"
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

	dbConfig := types.CommGlbCfg.DbConfInfo

	openConnValue, _ := types.UtilsGetInt("DB_MAX_OPEN_CONN", 2000)
	idleConnValue, _ := types.UtilsGetInt("DB_MAX_IDLE_CONN", 100)

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

	dbHandleCxt.CtxH.SetMaxOpenConns(openConnValue)
	dbHandleCxt.CtxH.SetMaxIdleConns(idleConnValue)
	err = dbHandleCxt.CtxH.Ping()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to Ping the Database error = %v\n", err.Error())
		return err
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
	defer func() {
		log.ExitFn(0, "InitializeDB", nil)
	}()
	log.EnterFn(0, "InitializeDB")

	ctxH, err := sql.Open(dbDriverName, dbConnString)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to initialize Database error = %v", err.Error())
		return err
	}

	dbHandleCxt.CtxH = ctxH
	return err
}

/******************************************************************************
 * FUNCTION:        getDBConnection
 * DESCRIPTION:     This will return the connection of DB
 * INPUT:			dbName
 * RETURNS:    		err
 ******************************************************************************/
func getDBConnection(dbName string) (con *CfgModels.DBHandleCxt, err error) {
	defer func() {
		log.ExitFn(0, "getDBConnection", nil)
	}()
	log.EnterFn(0, "getDBConnection")

	return &dbHandleCxt, nil
}
