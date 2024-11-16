/**************************************************************************
* File            : loadInstallEtaSchemas.go
* DESCRIPTION     : This file contains the model and data to fetch datas from
										schemas that are required for install eta calculation
* DATE            : 17-Oct-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"fmt"
	"strings"
	"time"
)

type InitialStruct struct {
	UniqueId                              string
	Ahj                                   string
	CustomersCustomersSchemaSaleDate      time.Time
	CustomersCustomersSchemaItemCreatedOn time.Time

	PermitFinPvPermitsSchemaItemCreatedOn          time.Time
	PermitFinPvPermitsSchemaPvSubmitted            time.Time
	PermitFinPvPermitsSchemaPermitTurnaroundTime   string
	PermitFinPvPermitsSchemaPvRedlinedDate         time.Time
	PermitFinPvPermitsSchemaPvResubmitted          time.Time
	PermitFinPvPermitsSchemaPvExpectedApprovalDate time.Time
	PermitFinPvPermitsSchemaPvApproved             time.Time
	PermitFinPvPermitsSchemaAbExpectedApprovalDate time.Time
	PermitFinPvPermitsSchemaSolarAppSubmission     string
	PermitFinPvPermitsSchemaAppStatus              string

	ICICPtoSchemaUtilityTurnaroundTime   string
	ICICPtoSchemaIcEstimatedApprovalDate time.Time
	ICICPtoSchemaIcApprovedDate          time.Time
	ICICPtoSchemaAppStatus               string

	PvInstallInstallSubcontractingSchemaItemCreatedOn           time.Time
	PvInstallInstallSubcontractingSchemaPvSchedulingReadyDate   time.Time
	PvInstallInstallSubcontractingSchemaAppStatus               string
	PvInstallInstallSubcontractingSchemaInstallFixCompletedDate time.Time
	PvInstallInstallSubcontractingSchemaInstallFixScheduleDate  time.Time

	AhjDbDbhubSchemaAhjTimeline                              string
	AhjDbDbhubSchemaAverageTimeToPvInstall                   string
	AhjDbDbhubSchemaAverageTimeToInstallSurveyToSolarInstall string

	RoofingRequestInstallSubcontractingSchemaWorkScheduledDate time.Time
	SurveySurveySchemaSurveyCompletionDate                     time.Time
}

type InitialDataLists struct {
	InitialDataList []InitialStruct
}

func LoadInstallEtaInitialData(uniqueIds []string) (InitialData InitialDataLists, err error) {
	var (
		query    string
		dataList []map[string]interface{}
	)

	log.EnterFn(0, "LoadInstallEtaInitialData")
	defer func() { log.ExitFn(0, "LoadInstallEtaInitialData", err) }()

	query = `
		SELECT 
			cust.unique_id,
      cust.ahj,
			cust.sale_date AS customers_customers_schema_sale_date,
			cust.item_created_on AS customers_customers_schema_item_created_on,
			
			permit.item_created_on AS permit_fin_pv_permits_schema_item_created_on,
			permit.pv_submitted AS permit_fin_pv_permits_schema_pv_submitted,
			permit.permit_turnaround_time AS permit_fin_pv_permits_schema_permit_turnaround_time,
			permit.pv_redlined_date AS permit_fin_pv_permits_schema_pv_redlined_date,
			permit.pv_resubmitted AS permit_fin_pv_permits_schema_pv_resubmitted,
			permit.pv_expected_approval_date AS permit_fin_pv_permits_schema_pv_expected_approval_date,
			permit.pv_approved AS permit_fin_pv_permits_schema_pv_approved,
			permit.ab_expected_approval_date AS permit_fin_pv_permits_schema_ab_expected_approval_date,
			permit.solar_app_submission AS permit_fin_pv_permits_schema_solar_app_submission,
			permit.app_status AS permit_fin_pv_permits_schema_app_status,
			
			ic.utility_turnaround_time AS ic_ic_pto_schema_utility_turnaround_time,
			ic.ic_estimated_approval_date AS ic_ic_pto_schema_ic_estimated_approval_date,
			ic.ic_approved_date AS ic_ic_pto_schema_ic_approved_date,
			ic.app_status AS ic_ic_pto_schema_app_status,
			
			pv.item_created_on AS pv_install_install_subcontracting_schema_item_created_on,
			pv.pv_scheduling_ready_date AS pv_install_install_subcontracting_schema_pv_scheduling_ready_date,
			pv.app_status AS pv_install_install_subcontracting_schema_app_status,
			pv.install_fix_complete_date AS pv_install_install_subcontracting_schema_install_fix_complete_date,
			pv.install_fix_scheduled_date AS pv_install_install_subcontracting_schema_install_fix_scheduled_date,

	
			ahj.ahj_timeline AS ahj_db_dbhub_schema_ahj_timeline,
			ahj.average_time_to_pv_install AS ahj_db_dbhub_schema_average_time_to_pv_install,
			ahj.average_time_to_install_survey_to_solar_install AS ahj_db_dbhub_schema_average_time_to_install_survey_to_solar_install,
			
			roofing.work_scheduled_date AS roofing_request_install_subcontracting_schema_work_scheduled_date,

			survey.survey_completion_date AS survey_survey_schema_survey_completion_date
		FROM 
			customers_customers_schema AS cust
		JOIN 
			permit_fin_pv_permits_schema AS permit ON cust.unique_id = permit.customer_unique_id
		JOIN 
			ic_ic_pto_schema AS ic ON cust.unique_id = ic.customer_unique_id
		JOIN 
			pv_install_install_subcontracting_schema AS pv ON cust.unique_id = pv.customer_unique_id
		JOIN 
			ahj_db_dbhub_schema AS ahj ON cust.ahj = ahj.title
		JOIN 
			roofing_request_install_subcontracting_schema AS roofing ON cust.unique_id = roofing.customer_unique_id
		JOIN 
			survey_survey_schema AS survey ON cust.unique_id = survey.customer_unique_id;
		`

	if len(uniqueIds) > 0 {
		placeholders := make([]string, len(uniqueIds))
		for i, id := range uniqueIds {
			placeholders[i] = fmt.Sprintf("'%s'", id)
		}
		query += fmt.Sprintf(" WHERE cust.unique_id IN (%s)", strings.Join(placeholders, ",")) //* change query here
	}

	dataList, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil || len(dataList) == 0 {
		log.FuncErrorTrace(0, "Failed to fetch inital data from DB err: %+v", err)
		err = fmt.Errorf("failed to fetch inital data from db")
		return InitialData, err
	}
	log.FuncInfoTrace(0, "Reterived raw data frm DB Count: %+v", len(dataList))

	for _, data := range dataList {
		var initialData InitialStruct

		// CustomersCustomersSchema fields
		if uniqueId, ok := data["unique_id"]; ok && uniqueId != nil {
			initialData.UniqueId = uniqueId.(string)
		}
		if ahj, ok := data["ahj"]; ok && ahj != nil {
			initialData.Ahj = ahj.(string)
		}
		if saleDate, ok := data["customers_customers_schema_sale_date"]; ok && saleDate != nil {
			initialData.CustomersCustomersSchemaSaleDate = saleDate.(time.Time)
		}
		if itemCreatedOn, ok := data["customers_customers_schema_item_created_on"]; ok && itemCreatedOn != nil {
			initialData.CustomersCustomersSchemaItemCreatedOn = itemCreatedOn.(time.Time)
		}

		// PermitFinPvPermitsSchema fields
		if itemCreatedOnPermit, ok := data["permit_fin_pv_permits_schema_item_created_on"]; ok && itemCreatedOnPermit != nil {
			initialData.PermitFinPvPermitsSchemaItemCreatedOn = itemCreatedOnPermit.(time.Time)
		}
		if pvSubmitted, ok := data["permit_fin_pv_permits_schema_pv_submitted"]; ok && pvSubmitted != nil {
			initialData.PermitFinPvPermitsSchemaPvSubmitted = pvSubmitted.(time.Time)
		}
		if permitTurnaroundTime, ok := data["permit_fin_pv_permits_schema_permit_turnaround_time"]; ok && permitTurnaroundTime != nil {
			initialData.PermitFinPvPermitsSchemaPermitTurnaroundTime = permitTurnaroundTime.(string)
		}
		if pvRedlinedDate, ok := data["permit_fin_pv_permits_schema_pv_redlined_date"]; ok && pvRedlinedDate != nil {
			initialData.PermitFinPvPermitsSchemaPvRedlinedDate = pvRedlinedDate.(time.Time)
		}
		if pvResubmitted, ok := data["permit_fin_pv_permits_schema_pv_resubmitted"]; ok && pvResubmitted != nil {
			initialData.PermitFinPvPermitsSchemaPvResubmitted = pvResubmitted.(time.Time)
		}
		if pvExpectedApprovalDate, ok := data["permit_fin_pv_permits_schema_pv_expected_approval_date"]; ok && pvExpectedApprovalDate != nil {
			initialData.PermitFinPvPermitsSchemaPvExpectedApprovalDate = pvExpectedApprovalDate.(time.Time)
		}
		if pvApproved, ok := data["permit_fin_pv_permits_schema_pv_approved"]; ok && pvApproved != nil {
			initialData.PermitFinPvPermitsSchemaPvApproved = pvApproved.(time.Time)
		}
		if abExpectedApprovalDate, ok := data["permit_fin_pv_permits_schema_ab_expected_approval_date"]; ok && abExpectedApprovalDate != nil {
			initialData.PermitFinPvPermitsSchemaAbExpectedApprovalDate = abExpectedApprovalDate.(time.Time)
		}
		if solarAppSubmission, ok := data["permit_fin_pv_permits_schema_solar_app_submission"]; ok && solarAppSubmission != nil {
			initialData.PermitFinPvPermitsSchemaSolarAppSubmission = solarAppSubmission.(string)
		}
		if appStatusPermit, ok := data["permit_fin_pv_permits_schema_app_status"]; ok && appStatusPermit != nil {
			initialData.PermitFinPvPermitsSchemaAppStatus = appStatusPermit.(string)
		}

		// ICICPtoSchema fields
		if utilityTurnaroundTime, ok := data["ic_ic_pto_schema_utility_turnaround_time"]; ok && utilityTurnaroundTime != nil {
			initialData.ICICPtoSchemaUtilityTurnaroundTime = utilityTurnaroundTime.(string)
		}
		if icEstimatedApprovalDate, ok := data["ic_ic_pto_schema_ic_estimated_approval_date"]; ok && icEstimatedApprovalDate != nil {
			initialData.ICICPtoSchemaIcEstimatedApprovalDate = icEstimatedApprovalDate.(time.Time)
		}
		if icApprovedDate, ok := data["ic_ic_pto_schema_ic_approved_date"]; ok && icApprovedDate != nil {
			initialData.ICICPtoSchemaIcApprovedDate = icApprovedDate.(time.Time)
		}
		if appStatusIc, ok := data["ic_ic_pto_schema_app_status"]; ok && appStatusIc != nil {
			initialData.ICICPtoSchemaAppStatus = appStatusIc.(string)
		}

		// PvInstallInstallSubcontractingSchema fields
		if itemCreatedOnPv, ok := data["pv_install_install_subcontracting_schema_item_created_on"]; ok && itemCreatedOnPv != nil {
			initialData.PvInstallInstallSubcontractingSchemaItemCreatedOn = itemCreatedOnPv.(time.Time)
		}
		if pvSchedulingReadyDate, ok := data["pv_install_install_subcontracting_schema_pv_scheduling_ready_date"]; ok && pvSchedulingReadyDate != nil {
			initialData.PvInstallInstallSubcontractingSchemaPvSchedulingReadyDate = pvSchedulingReadyDate.(time.Time)
		}
		if appStatusPv, ok := data["pv_install_install_subcontracting_schema_app_status"]; ok && appStatusPv != nil {
			initialData.PvInstallInstallSubcontractingSchemaAppStatus = appStatusPv.(string)
		}
		if installFixComplete, ok := data["pv_install_install_subcontracting_schema_install_fix_complete_date"]; ok && installFixComplete != nil {
			initialData.PvInstallInstallSubcontractingSchemaInstallFixCompletedDate = installFixComplete.(time.Time)
		}
		if installFixSchedule, ok := data["pv_install_install_subcontracting_schema_install_fix_scheduled_date"]; ok && installFixSchedule != nil {
			initialData.PvInstallInstallSubcontractingSchemaInstallFixScheduleDate = installFixSchedule.(time.Time)
		}

		// AhjDbDbhubSchema fields
		if ahjTimeline, ok := data["ahj_db_dbhub_schema_ahj_timeline"]; ok && ahjTimeline != nil {
			initialData.AhjDbDbhubSchemaAhjTimeline = ahjTimeline.(string)
		}
		if averageTimeToPvInstall, ok := data["ahj_db_dbhub_schema_average_time_to_pv_install"]; ok && averageTimeToPvInstall != nil {
			initialData.AhjDbDbhubSchemaAverageTimeToPvInstall = averageTimeToPvInstall.(string)
		}
		if averageTimeToInstallSurveyToSolarInstall, ok := data["ahj_db_dbhub_schema_average_time_to_install_survey_to_solar_install"]; ok && averageTimeToInstallSurveyToSolarInstall != nil {
			initialData.AhjDbDbhubSchemaAverageTimeToInstallSurveyToSolarInstall = averageTimeToInstallSurveyToSolarInstall.(string)
		}

		// RoofingRequestInstallSubcontractingSchema fields
		if workScheduledDate, ok := data["roofing_request_install_subcontracting_schema_work_scheduled_date"]; ok && workScheduledDate != nil {
			initialData.RoofingRequestInstallSubcontractingSchemaWorkScheduledDate = workScheduledDate.(time.Time)
		}

		// SurveySurveySchema fields
		if surveyCompletionDate, ok := data["survey_survey_schema_survey_completion_date"]; ok && surveyCompletionDate != nil {
			initialData.SurveySurveySchemaSurveyCompletionDate = surveyCompletionDate.(time.Time)
		}

		InitialData.InitialDataList = append(InitialData.InitialDataList, initialData)
	}

	return InitialData, err
}
