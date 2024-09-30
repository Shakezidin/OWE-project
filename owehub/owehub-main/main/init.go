/**************************************************************************
 *      Function        : init.go
 *      DESCRIPTION     : This file contains functions to initialize
 *							OWE-Main service
 *      DATE            : 11-April-2024
 **************************************************************************/

package main

import (
	appserver "OWEApp/shared/appserver"
	"OWEApp/shared/types"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	apiHandler "OWEApp/owehub-main/services"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"github.com/google/uuid"
	"gopkg.in/natefinch/lumberjack.v2"
)

type CfgFilePaths struct {
	CfgJsonDir           string
	LoggingConfJsonPath  string
	HTTPConfJsonPath     string
	DbConfJsonPath       string
	PodioConfJsonPath    string
	PodioAppConfJsonPath string
}

var (
	gCfgFilePaths CfgFilePaths
)

const (
	AppVersion = "1.0.0"
)

var apiRoutes = appserver.ApiRoutes{
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/loggingconf",
		handleDynamicLoggingConf,
		false,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/httpconf",
		handleDynamicHttpConf,
		false,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/active",
		apiHandler.HandleGetActiveAndStartTime,
		false,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/login",
		apiHandler.HandleLoginRequest,
		false,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/forgot_password",
		apiHandler.HandleForgotPassRequest,
		false,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/change_password",
		apiHandler.HandleChangePassRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_user",
		apiHandler.HandleCreateUserRequest,
		true,
		[]types.UserGroup{types.GroupAdminDealer},
	},
	// {
	// 	strings.ToUpper("POST"),
	// 	"/owe-commisions-service/v1/db_tables",
	// 	apiHandler.HandleGetTableRequest,
	// 	true,
	// 	[]types.UserGroup{types.GroupAdmin},
	// },
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/db_tables",
		apiHandler.HandleGetTableRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_team",
		apiHandler.HandleCreateTeamRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_appointment_setter",
		apiHandler.HandleCreateAptSetterRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_commission",
		apiHandler.HandleCreateCommissionRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_commissions",
		apiHandler.HandleGetCommissionsDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_users",
		apiHandler.HandleGetUsersDataRequest,
		true,
		[]types.UserGroup{types.GroupAdminDealerAccounts},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_dealer",
		apiHandler.HandleCreateDealerRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_dealers",
		apiHandler.HandleGetDealersDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_marketingfee",
		apiHandler.HandleCreateMarketingFeesRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_marketingfee",
		apiHandler.HandleGetMarketingFeesDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_vadder",
		apiHandler.HandleCreateVAddersRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_vadders",
		apiHandler.HandleGetVAdderDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_saletype",
		apiHandler.HandleCreateSaleTypeRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_saletypes",
		apiHandler.HandleGetSaleTypeDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_tierloanfee",
		apiHandler.HandleCreateTierLoanFeeRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_tierloanfees",
		apiHandler.HandleGetTierLoanFeesDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_dealertier",
		apiHandler.HandleCreateDealerTierRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_dealerstier",
		apiHandler.HandleGetDealersTierDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_paymentschedule",
		apiHandler.HandleCreatePaymentScheduleRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_paymentschedules",
		apiHandler.HandleGetPaymentSchedulesDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_timelinesla",
		apiHandler.HandleCreateTimelineSlaRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_timelineslas",
		apiHandler.HandleGetTimelineSlasDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_partner",
		apiHandler.HandleCreatePartnerRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_partners",
		apiHandler.HandleGetPartnerDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_state",
		apiHandler.HandleCreateStateRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_states",
		apiHandler.HandleGetStatesDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_loantype",
		apiHandler.HandleCreateLoanTypeRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_loantypes",
		apiHandler.HandleGetLoanTypesDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_newformdata",
		apiHandler.HandleGetNewFormDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_commission",
		apiHandler.HandleUpdateCommissionRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_dealer",
		apiHandler.HandleUpdateDealerRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_marketingfee",
		apiHandler.HandleUpdateMarketingFeeRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_vadders",
		apiHandler.HandleUpdateVAddersRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_saletype",
		apiHandler.HandleUpdateSaleTypeRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_tierloanfee",
		apiHandler.HandleUpdateTierLoanFeeRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_dealertier",
		apiHandler.HandleUpdateDealerTierRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_paymentschedule",
		apiHandler.HandleUpdatePaymentScheduleRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_timelinesla",
		apiHandler.HandleUpdateTimelineSlaRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_loantype",
		apiHandler.HandleUpdateLoanTypeRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_commission_archive",
		apiHandler.HandleUpdateCommissionArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_marketingfee_archive",
		apiHandler.HandleUpdateMarketingFeesArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_dealer_archive",
		apiHandler.HandleUpdateDealerArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_v_adder_archive",
		apiHandler.HandleUpdateVAddersArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_saletype_archive",
		apiHandler.HandleUpdateSaleTypeArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_tierloanfee_archive",
		apiHandler.HandleUpdateTierLoanFeeArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_dealertier_archive",
		apiHandler.HandleUpdateDealerTierArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_paymentschedule_archive",
		apiHandler.HandleUpdatePaymentScheduleArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_timelinesla_archive",
		apiHandler.HandleUpdateTimelineSlaArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_loantype_archive",
		apiHandler.HandleUpdateLoanTypeArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_autoadder",
		apiHandler.HandleCreateAutoAdderRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_autoadder",
		apiHandler.HandleGetAutoAdderDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_autoadder",
		apiHandler.HandleUpdateAutoAdderRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_autoadder_archive",
		apiHandler.HandleUpdateAutoAdderArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_user",
		apiHandler.HandleUpdateUserRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_users_onboarding",
		apiHandler.HandleGetUserMgmtOnboardingDataRequest,
		true,
		[]types.UserGroup{types.GroupAdminDealerAccounts},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_users_by_role",
		apiHandler.HandleGetUsersByRoleDataRequest,
		true,
		[]types.UserGroup{types.GroupAdminDealerAccounts},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_users_by_dealer",
		apiHandler.HandleGetUsersByDealerRequest,
		true,
		[]types.UserGroup{types.GroupAdminDealerAccounts},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_rebate_data",
		apiHandler.HandleCreateRebateDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_rebate_data",
		apiHandler.HandleUpdateRebateDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_rebate_data",
		apiHandler.HandleGetRebateDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_rebate_data_archive",
		apiHandler.HandleUpdateRebateArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_loan_fee_adder_data",
		apiHandler.HandleCreateLoanFeeAdderDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_loan_fee_adder_data",
		apiHandler.HandleUpdateLoanFeeAdderDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_loan_fee_adder_data",
		apiHandler.HandleGetLoanFeeAdderDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_loan_fee_adder_archive",
		apiHandler.HandleUpdateLoanFeeAdderArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_referraldata",
		apiHandler.HandleCreateReferralDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_referraldata",
		apiHandler.HandleUpdateReferralDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_dealercredit",
		apiHandler.HandleCreateDealerCreditRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_dealercredit",
		apiHandler.HandleUpdateDealerCreditRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_noncommdlrpay",
		apiHandler.HandleCreateNonCommDlrPayRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_noncommdlrpay",
		apiHandler.HandleUpdateNonCommDlrPayRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_referraldata",
		apiHandler.HandleGetReferralDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_dealercredit",
		apiHandler.HandleGetDealerCreditDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_noncommdlrpay",
		apiHandler.HandleGetNonCommDlrPayDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_referraldata_archive",
		apiHandler.HandleUpdateReferralDataArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_dealercredit_archive",
		apiHandler.HandleUpdateCreditDealerArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_noncommdlrpay_archive",
		apiHandler.HandleUpdateNonCommDlrPayArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_dlr_oth",
		apiHandler.HandleCreateDLROTHDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_dlr_oth",
		apiHandler.HandleUpdateDLROTHDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_dlr_oth_data",
		apiHandler.HandleGetDLROTHDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_dlr_oth_archive",
		apiHandler.HandleUpdateDLROTHArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/delete_users",
		apiHandler.HandleDeleteUsersRequest,
		true,
		[]types.UserGroup{types.GroupAdminDealer},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_rep_pay_settings",
		apiHandler.HandleCreateRepPaySettingsDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_rep_pay_settings",
		apiHandler.HandleUpdateRepPaySettingsDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_rep_pay_settings",
		apiHandler.HandleGetRepPaySettingsDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	}, {
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_rep_pay_settings_archive",
		apiHandler.HandleUpdateRepPaySettingsArchiveRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_adder_responsibility",
		apiHandler.HandleCreateAdderResponsibilityDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_adder_responsibility",
		apiHandler.HandleUpdateAdderResponsibilityDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_adder_responsibility",
		apiHandler.HandleGetAdderResponsibilityDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_adder_responsibility_archive",
		apiHandler.HandleUpdateAdderResponsibilityArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_adder_credit",
		apiHandler.HandleCreateAdderCreditDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_adder_credit",
		apiHandler.HandleUpdateAdderCreditDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_adder_credit",
		apiHandler.HandleGetAdderCreditDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_adder_credit_archive",
		apiHandler.HandleUpdateAdderCreditArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_loan_fee",
		apiHandler.HandleCreateLoanFeeDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_loan_fee",
		apiHandler.HandleUpdateLoanFeeDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_loan_fee",
		apiHandler.HandleGetLoanFeeDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_loan_fee_archive",
		apiHandler.HandleUpdateLoanFeeArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_reconcile",
		apiHandler.HandleCreateReconcileRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_reconcile",
		apiHandler.HandleUpdateReconcileRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_reconcile",
		apiHandler.HandleGetReconcileRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_reconcile_archive",
		apiHandler.HandleUpdateReconcileDataArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_adjustments",
		apiHandler.HandleGetAdjustmentsDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_adjustments",
		apiHandler.HandleCreateAdjustmentsRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_adjustments_archive",
		apiHandler.HandleUpdateAdjustmentsArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_adjustments",
		apiHandler.HandleUpdateAdjustmentsRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_arschedule",
		apiHandler.HandleGetArScheduleDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_arschedule",
		apiHandler.HandleCreateArScheduleRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_arschedule_archive",
		apiHandler.HandleUpdateArScheduleArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_arschedule",
		apiHandler.HandleUpdateArScheduleRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_installcost",
		apiHandler.HandleGetInstallCostDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_installcost",
		apiHandler.HandleCreateInstallCostRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_installcost_archive",
		apiHandler.HandleUpdateInstallCostArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_installcost",
		apiHandler.HandleUpdateInstallCostDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_rateadjustments",
		apiHandler.HandleGetRateAdjustmentsRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_rateadjustments",
		apiHandler.HandleCreateRateAdjustmentsRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_rateadjustments_archive",
		apiHandler.HandleUpdateRateAdjustmentsArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_rateadjustments",
		apiHandler.HandleUpdateRateAdjustmentsRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_leaderoverride",
		apiHandler.HandleGetLeaderOverrideDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_leaderoverride",
		apiHandler.HandleCreateLeaderOverrideRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_leaderoverride_archive",
		apiHandler.HandleUpdateLeaderOverrideArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_leaderoverride",
		apiHandler.HandleUpdateLeaderOverrideRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_ar_import",
		apiHandler.HandleCreateArImportDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_ar_import",
		apiHandler.HandleUpdateArImportDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_ar_import",
		apiHandler.HandleGetArImportDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_ar_import_archive",
		apiHandler.HandleUpdateArImportArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_ar",
		apiHandler.HandleCreateARDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_ar",
		apiHandler.HandleUpdateARDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_ar",
		apiHandler.HandleGetARDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_ar_archive",
		apiHandler.HandleUpdateARArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_appt_setters",
		apiHandler.HandleCreateApptSettersDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_appt_setters",
		apiHandler.HandleUpdateApptSettersDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_appt_setters",
		apiHandler.HandleGetApptSettersDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_appt_setters_archive",
		apiHandler.HandleUpdateApptSettersArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_adderdata",
		apiHandler.HandleCreateAdderDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_adderdata",
		apiHandler.HandleUpdateAdderDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_adderdata_archive",
		apiHandler.HandleUpdateAdderDataArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_adderdata",
		apiHandler.HandleGetAdderDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_perfomancetiledata",
		apiHandler.HandleGetPerfomanceTileDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_perfomanceprojectstatus",
		apiHandler.HandleGetPerfomanceProjectStatusRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_ar_data",
		apiHandler.GetARDataFromView,
		false,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/user_exists",
		apiHandler.HandleCheckUserExists,
		false,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_app_table_list",
		apiHandler.HandleGetUserTableListRequest,
		true,
		[]types.UserGroup{types.GroupAdminDealer},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_app_data",
		apiHandler.HandleGetAnyTableDataRequest,
		true,
		[]types.UserGroup{types.GroupDb},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_projectmgmnt",
		apiHandler.HandleGetProjectMngmntRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_adder_data_cfg_schema",
		apiHandler.HandleGetAdderDataConfigRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_projectmanagementlist",
		apiHandler.HandleGetPrjctMngmntListRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/useractivity",
		apiHandler.HandleGetDbLogsRequest,
		true,
		[]types.UserGroup{types.GroupDb},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_profile",
		apiHandler.HandleGetProfileDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_aprep",
		apiHandler.HandleCreateArRepRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_aprep_archive",
		apiHandler.HandleApRepArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_aprep",
		apiHandler.HandleUpdateApRepDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_aprep",
		apiHandler.HandleGetApRepDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_profile",
		apiHandler.HandleUpdateProfileRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_vdealer",
		apiHandler.HandleCreateVDealerRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_vdealer",
		apiHandler.HandleUpdateVDealerDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_vdealer_active",
		apiHandler.HandleUpdateVDealerActiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_vdealer",
		apiHandler.HandleGetVDealerDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_dealerpay",
		apiHandler.HandleGetDealerPayDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_apoth",
		apiHandler.HandleCreateApOthRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_apoth",
		apiHandler.HandleUpdateApOthRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_apoth_archive",
		apiHandler.HandleApOthArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_apoth",
		apiHandler.HandleGetApOthDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_apded",
		apiHandler.HandleCreateApDedRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_apded",
		apiHandler.HandleUpdateApDedRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_apded_archive",
		apiHandler.HandleApDedArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_apded",
		apiHandler.HandleGetApDedDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_appda",
		apiHandler.HandleCreateApPdaRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_appda",
		apiHandler.HandleUpdateApPdaRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_appda_archive",
		apiHandler.HandleApPdaArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_appda",
		apiHandler.HandleGetApPdaDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	}, {
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_apadv",
		apiHandler.HandleCreateApAdvRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_apadv",
		apiHandler.HandleUpdateApAdvRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_apadv_archive",
		apiHandler.HandleApAdvArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_apadv",
		apiHandler.HandleGetApAdvDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	}, {
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_rep_incentive",
		apiHandler.HandleCreateRepIncentRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_rep_incentive",
		apiHandler.HandleUpdateRepIncentRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_rep_incentive_archive",
		apiHandler.HandleRepIncentArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_rep_incentive",
		apiHandler.HandleGetRepIncentDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_dba",
		apiHandler.HandleCreateDBARequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_dba",
		apiHandler.HandleUpdateDBARequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_dba_archive",
		apiHandler.HandleDBAArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_dba",
		apiHandler.HandleGetDBADataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_slack_config",
		apiHandler.HandleCreateSlackConfig,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_slack_config",
		apiHandler.HandleUpdateSlackConfigRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_slack_config_archive",
		apiHandler.HandleArchiveSlackConfigRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_slack_config",
		apiHandler.HandleGetSlackConfigRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/delete_slack_config",
		apiHandler.HandleDeleteSlackConfigRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	// {
	// 	strings.ToUpper("POST"),
	// 	"/owe-commisions-service/v1/update_dba",
	// 	apiHandler.HandleUpdateDBARequest,
	// 	true,
	// 	[]types.UserGroup{types.GroupAdmin},
	// },
	// {
	// 	strings.ToUpper("POST"),
	// 	"/owe-commisions-service/v1/update_dba_archive",
	// 	apiHandler.HandleDBAArchiveRequest,
	// 	true,
	// 	[]types.UserGroup{types.GroupAdmin},
	// },

	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_rep_status",
		apiHandler.HandleCreateRepStatusRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_rep_status",
		apiHandler.HandleUpdateRepStatusRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_rep_status_archive",
		apiHandler.HandleRepStatusArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_rep_status",
		apiHandler.HandleGetRepStatusDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/create_rep_credit",
		apiHandler.HandleCreateRepCreditRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_rep_credit",
		apiHandler.HandleUpdateRepCreditRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_rep_credit_archive",
		apiHandler.HandleRepCreditArchiveRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_rep_credit",
		apiHandler.HandleGetRepCreditDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_rep_pay",
		apiHandler.GetRepPayDataFromView,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_teams",
		apiHandler.HandleGetTeamsDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	}, {
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_team",
		apiHandler.HandleGetTeamDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_team_member_dropdown",
		apiHandler.HandleGetSalesRepDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/add_team_member",
		apiHandler.HandleAddTeamMemberDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/delete_team_member",
		apiHandler.HandleDeleteTeamMemberRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/delete_teams",
		apiHandler.HandleDeleteTeamsRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/update_team",
		apiHandler.HandleUpdateTeamNameRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_dlrpay_tiledata",
		apiHandler.HandleManageDlrPayTileDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_reppay_tiledata",
		apiHandler.HandleManageRepPayTileDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_rep_type",
		apiHandler.HandleGetRepTypeDataRequest,
		true,
		[]types.UserGroup{types.GroupAdmin},
	},
	// {
	// 	strings.ToUpper("POST"),
	// 	"/owe-commisions-service/v1/get_performance_tiledata",
	// 	apiHandler.HandleManagePerformanceTileDataRequest,
	// 	true,
	// 	[]types.UserGroup{types.GroupEveryOne},
	// },
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_perfomance_leaderboard",
		apiHandler.HandleGetLeaderBoardRequestTemp,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_perfomance_leaderboard_data",
		apiHandler.HandleGetLeaderBoardRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	// {
	// 	strings.ToUpper("POST"),
	// 	"/owe-commisions-service/v1/get_perfomance_pie",
	// 	apiHandler.HandleGetPerfomancePieDataRequest,
	// 	true,
	// 	[]types.UserGroup{types.GroupAdmin},
	// },
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_leaderboarddatarequest",
		apiHandler.HandlePerformerDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_leaderboardprofiledatarequest",
		apiHandler.GetperformerProfileDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_peroformancecsvdownload",
		apiHandler.HandleGetPerformanceCsvDownloadRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_leaderboardcsvdownload",
		apiHandler.HandleGetLeaderBoardCsvDownloadRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_pendingqueuesdata",
		apiHandler.HandleGetPendingQuesDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_pendingqueuestiledata",
		apiHandler.HandleGetPendingQuesTileDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_calender_data",
		apiHandler.HandleGetCalenderDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_calender_csv_download",
		apiHandler.HandleGetCalenderCsvDownloadRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_user_address",
		apiHandler.HandleGetUserAddressDataRequest,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_graph_api_access_token",
		apiHandler.HandleGraphApiAccessToken,
		true,
		[]types.UserGroup{types.GroupEveryOne},
	},

	/************ Battery Backup Calculator API *******************/
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/set_prospect_info",
		apiHandler.HandleSetProspectInfo,
		false,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_prospect_info",
		apiHandler.HandleGetProspectInfo,
		false,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/set_prospect_load",
		apiHandler.HandleSetProspectLoad,
		false,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/get_prospect_load",
		apiHandler.HandleGetProspectLoad,
		false,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/sendmail",
		apiHandler.SendMailToUserFromUI,
		false,
		[]types.UserGroup{types.GroupEveryOne},
	},
	{
		strings.ToUpper("POST"),
		"/owe-commisions-service/v1/SendMail_to_IT_from_User",
		apiHandler.SendMailtoITfromUser,
		false,
		[]types.UserGroup{types.GroupEveryOne},
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
	initLogger("OWEHUB-MAIN", "-", "-", log.FUNCTRL, "VM", "/var/log/owe/owehub-main.log", 100, 28, 3)

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
		log.ConfDebugTrace(0, "Database Configuration fatched Successfully from file.")
	}

	//* Read and Initialize Podio configuration from cfg */
	err = FetchPodioCfg()
	if err != nil {
		log.ConfErrorTrace(0, "FetchPodioCfg failed %+v", err)
		return
	} else {
		log.ConfDebugTrace(0, "Podio Configuration fatched Successfully from file.")
	}

	//* For initial setting up podio
	go apiHandler.SyncHubUsersToPodioOnInit()
	// if err != nil {
	// 	log.ConfErrorTrace(0, "Failed to insert users to PODIO err: %+v", err)
	// }

	time.Sleep(time.Minute * 1)
	types.ExitChan = make(chan error)
	types.CommGlbCfg.SelfInstanceId = uuid.New().String()

	PrintSvcGlbConfig(types.CommGlbCfg)

	/*Initialize logger package again with new configuraion*/
	initLogger("OWEHUB-MAIN", log.InstanceIdtype(types.CommGlbCfg.SelfInstanceId), "-", log.LogLeveltype(types.CommGlbCfg.LogCfg.LogLevel), types.CommGlbCfg.LogCfg.LogEnv, types.CommGlbCfg.LogCfg.LogFile, int(types.CommGlbCfg.LogCfg.LogFileSize), int(types.CommGlbCfg.LogCfg.LogFileAge), int(types.CommGlbCfg.LogCfg.LogFileBackup))

	/* Initialize OTP Services */
	apiHandler.InitializeOTPServices()
}

func handleDynamicLoggingConf(resp http.ResponseWriter, req *http.Request) {
	types.CommGlbCfg.LogCfg = HandleDynamicLoggingConf(resp, req)
	initLogger("OWEHUB-MAIN", log.InstanceIdtype(types.CommGlbCfg.SelfInstanceId), "-", log.LogLeveltype(types.CommGlbCfg.LogCfg.LogLevel), types.CommGlbCfg.LogCfg.LogEnv, types.CommGlbCfg.LogCfg.LogFile, int(types.CommGlbCfg.LogCfg.LogFileSize), int(types.CommGlbCfg.LogCfg.LogFileAge), int(types.CommGlbCfg.LogCfg.LogFileBackup))

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
	gCfgFilePaths.PodioConfJsonPath = gCfgFilePaths.CfgJsonDir + "podioConfig.json"
	gCfgFilePaths.PodioAppConfJsonPath = gCfgFilePaths.CfgJsonDir + "podioAppConfig.json"

	log.ExitFn(0, "InitCfgPaths", nil)
}

/******************************************************************************
* FUNCTION:        FetchPodioCfg
*
* DESCRIPTION:   function is used to get the podio configuration
* INPUT:        service name to be initialized
* RETURNS:      error
******************************************************************************/
func FetchPodioCfg() (err error) {
	log.EnterFn(0, "FetchPodioCfg")
	defer func() { log.ExitFn(0, "FetchPodioCfg", err) }()

	var podioCfg models.PodioConfigList
	var podioAppCfg models.PodioAppConfig

	log.ConfDebugTrace(0, "Reading Podio Config from: %+v", gCfgFilePaths.PodioConfJsonPath)
	file, err := os.Open(gCfgFilePaths.PodioConfJsonPath)
	if err != nil {
		log.ConfErrorTrace(0, "Failed to open file %+v: %+v", gCfgFilePaths.PodioConfJsonPath, err)
		panic(err)
	}
	bVal, _ := ioutil.ReadAll(file)
	err = json.Unmarshal(bVal, &podioCfg)
	if err != nil {
		log.ConfErrorTrace(0, "Failed to Urmarshal file: %+v Error: %+v", gCfgFilePaths.PodioConfJsonPath, err)
		panic(err)
	}

	log.ConfDebugTrace(0, "Reading Podio Config from: %+v", gCfgFilePaths.PodioAppConfJsonPath)
	file, err = os.Open(gCfgFilePaths.PodioAppConfJsonPath)
	if err != nil {
		log.ConfErrorTrace(0, "Failed to open file %+v: %+v", gCfgFilePaths.PodioAppConfJsonPath, err)
		panic(err)
	}
	bVal, _ = ioutil.ReadAll(file)
	err = json.Unmarshal(bVal, &podioAppCfg)
	if err != nil {
		log.ConfErrorTrace(0, "Failed to Urmarshal file: %+v Error: %+v", gCfgFilePaths.PodioAppConfJsonPath, err)
		panic(err)
	}

	types.CommGlbCfg.PodioCfg = podioCfg
	types.CommGlbCfg.PodioAppCfg = podioAppCfg
	log.ConfDebugTrace(0, "Logging Configurations: %+v", types.CommGlbCfg.LogCfg)

	return err
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
	log.SysConfTrace(0, "owehub-main Service Configuration: %+v", cfg)
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
