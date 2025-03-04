package models

import (
	"fmt"
	"strings"
)

func SalesRepRetrieveQueryFunc() string {
	salerRepRetrieveQuery := `
    WITH RECURSIVE RegionalManagerHierarchy AS (
        SELECT user_id, name, reporting_manager, role_id
        FROM user_details
        WHERE email_id = $1
        UNION
        SELECT ud.user_id, ud.name, ud.reporting_manager, ud.role_id
        FROM user_details ud
        INNER JOIN RegionalManagerHierarchy rmh ON rmh.user_id = ud.reporting_manager
    ),
    SalesRepsUnderRegionalManager AS (
        SELECT us.user_id, us.name as name, us.dealer_owner as dealer_id, d.name as dealer_name
        FROM RegionalManagerHierarchy rmh
        JOIN user_details us ON rmh.user_id = us.reporting_manager
        LEFT JOIN user_details d ON us.dealer_owner = d.user_id
        WHERE us.role_id = (SELECT role_id FROM user_roles WHERE role_name = 'Sale Representative')
    )
    SELECT * FROM SalesRepsUnderRegionalManager;
    `
	return salerRepRetrieveQuery
}

func SalesMetricsRetrieveQueryFunc() string {
	SalesMetricsRetrieveQuery := `
        SELECT
            DISTINCT ON(customers_customers_schema.unique_id)
			customers_customers_schema.unique_id,
            customers_customers_schema.customer_name AS home_owner,
            survey_survey_schema.original_survey_scheduled_date AS site_survey_scheduled_date,
            survey_survey_schema.survey_completion_date AS site_survey_completed_date,
            planset_cad_schema.item_created_on AS cad_ready,
            planset_cad_schema.plan_set_complete_day AS plan_set_complete_day,
            permit_fin_pv_permits_schema.pv_submitted AS permit_submitted_date,
            ic_ic_pto_schema.ic_submitted_date AS ic_submitted_date,
            pv_install_install_subcontracting_schema.created_on AS pv_install_created_date,
            pv_install_install_subcontracting_schema.pv_completion_date AS pv_install_completed_date,
            pto_ic_schema.submitted AS pto_submitted_date,
            pto_ic_schema.pto_granted AS pto_date,
            permit_fin_pv_permits_schema.pv_approved AS permit_approved_date,
            ic_ic_pto_schema.ic_approved_date AS ic_approved_date,
            roofing_request_install_subcontracting_schema.record_created_on AS roofing_created_date,
            roofing_request_install_subcontracting_schema.work_completed_date AS roofing_completed_date,
            batteries_service_electrical_schema.battery_installation_date AS battery_scheduled_date,
            batteries_service_electrical_schema.completion_date AS battery_complete_date,
            mpu_service_electrical_schema.mpu_created_on AS mpu_created_date,
            derates_service_electrical_schema.derate_created_on AS derate_created_date,
            derates_service_electrical_schema.completion_date AS derate_completed_date,
            mpu_service_electrical_schema.pk_or_cutover_date_of_completion AS mpu_complete_date,
            fin_permits_fin_schema.created_on AS fin_created_date,
            fin_permits_fin_schema.pv_fin_date AS fin_pass_date,
            trenching_service_electrical_schema.trenching_created_on AS trenching_ws_open,
            trenching_service_electrical_schema.completion_date AS trenching_completed,
            roofing_request_install_subcontracting_schema.app_status AS roofing_status,
            customers_customers_schema.sale_date AS contract_date,
            customers_customers_schema.dealer AS dealer,
            customers_customers_schema.primary_sales_rep,
            ntp_ntp_schema.ntp_complete_date AS ntp_date
        FROM
            customers_customers_schema
        LEFT JOIN survey_survey_schema
            ON survey_survey_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN planset_cad_schema
           ON planset_cad_schema.our_number = customers_customers_schema.unique_id
        LEFT JOIN permit_fin_pv_permits_schema
            ON permit_fin_pv_permits_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN ic_ic_pto_schema
            ON ic_ic_pto_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN pv_install_install_subcontracting_schema
            ON pv_install_install_subcontracting_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN pto_ic_schema
            ON pto_ic_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN roofing_request_install_subcontracting_schema
            ON roofing_request_install_subcontracting_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN batteries_service_electrical_schema
            ON batteries_service_electrical_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN mpu_service_electrical_schema
            ON mpu_service_electrical_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN derates_service_electrical_schema
            ON derates_service_electrical_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN fin_permits_fin_schema
            ON fin_permits_fin_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN trenching_service_electrical_schema
            ON trenching_service_electrical_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN ntp_ntp_schema
            ON ntp_ntp_schema.unique_id = customers_customers_schema.unique_id
        LEFT JOIN system_customers_schema
            ON system_customers_schema.customer_id = customers_customers_schema.unique_id
    `
	return SalesMetricsRetrieveQuery
}

func CsvSalesMetricsRetrieveQueryFunc() string {
	SalesMetricsRetrieveQuery := `
        SELECT
            DISTINCT ON(customers_customers_schema.unique_id)
			customers_customers_schema.unique_id,
            customers_customers_schema.customer_name AS home_owner,
            customers_customers_schema.email_address AS customer_email,
            customers_customers_schema.phone_number AS customer_phone_number,
            customers_customers_schema.address,
            customers_customers_schema.state,
            customers_customers_schema.total_system_cost AS contract_total,
            system_customers_schema.contracted_system_size_parent AS system_size,
            customers_customers_schema.sale_date AS contract_date,
            survey_survey_schema.original_survey_scheduled_date AS site_survey_scheduled_date,
            survey_survey_schema.survey_completion_date AS site_survey_completed_date,
            planset_cad_schema.item_created_on AS cad_ready,
            planset_cad_schema.plan_set_complete_day AS cad_complete_date,
            permit_fin_pv_permits_schema.pv_submitted AS permit_submitted_date,
            ic_ic_pto_schema.ic_submitted_date AS ic_submitted_date,
            pv_install_install_subcontracting_schema.created_on AS pv_install_created_date,
            pv_install_install_subcontracting_schema.pv_completion_date AS pv_install_completed_date,
            pto_ic_schema.submitted AS pto_submitted_date,
            pto_ic_schema.pto_granted AS pto_date,
            permit_fin_pv_permits_schema.pv_approved AS permit_approved_date,
            ic_ic_pto_schema.ic_approved_date AS ic_approved_date,
            roofing_request_install_subcontracting_schema.record_created_on AS roofing_created_date,
            roofing_request_install_subcontracting_schema.work_completed_date AS roofing_completed_date,
            batteries_service_electrical_schema.battery_installation_date AS battery_scheduled_date,
            batteries_service_electrical_schema.completion_date AS battery_complete_date,
            mpu_service_electrical_schema.mpu_created_on AS mpu_created_date,
            derates_service_electrical_schema.derate_created_on AS derate_created_date,
            derates_service_electrical_schema.completion_date AS derate_completed_date,
            mpu_service_electrical_schema.pk_or_cutover_date_of_completion AS mpu_complete_date,
            fin_permits_fin_schema.created_on AS fin_created_date,
            fin_permits_fin_schema.pv_fin_date AS fin_pass_date,
            trenching_service_electrical_schema.trenching_created_on AS trenching_ws_open,
            trenching_service_electrical_schema.completion_date AS trenching_completed,
            roofing_request_install_subcontracting_schema.app_status AS roofing_status,
            customers_customers_schema.dealer AS dealer,
            customers_customers_schema.primary_sales_rep,
            ntp_ntp_schema.ntp_complete_date AS ntp_date
        FROM
            customers_customers_schema
        LEFT JOIN survey_survey_schema
            ON survey_survey_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN planset_cad_schema
           ON planset_cad_schema.our_number = customers_customers_schema.unique_id
        LEFT JOIN permit_fin_pv_permits_schema
            ON permit_fin_pv_permits_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN ic_ic_pto_schema
            ON ic_ic_pto_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN pv_install_install_subcontracting_schema
            ON pv_install_install_subcontracting_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN pto_ic_schema
            ON pto_ic_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN roofing_request_install_subcontracting_schema
            ON roofing_request_install_subcontracting_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN batteries_service_electrical_schema
            ON batteries_service_electrical_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN mpu_service_electrical_schema
            ON mpu_service_electrical_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN derates_service_electrical_schema
            ON derates_service_electrical_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN fin_permits_fin_schema
            ON fin_permits_fin_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN trenching_service_electrical_schema
            ON trenching_service_electrical_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN ntp_ntp_schema
            ON ntp_ntp_schema.unique_id = customers_customers_schema.unique_id
        LEFT JOIN system_customers_schema
            ON system_customers_schema.customer_id = customers_customers_schema.unique_id
    `
	return SalesMetricsRetrieveQuery
}

func SalesRetrieveQueryFunc() string {
	SalesMetricsRetrieveQuery := `
        SELECT customers_customers_schema.unique_id, customers_customers_schema.customer_name AS home_owner
        FROM customers_customers_schema `
	return SalesMetricsRetrieveQuery
}

func AdminDlrSaleRepRetrieveQueryFunc() string {
	AdminDlrSaleRepRetrieveQuery := `
    SELECT ud.name AS name,
        ur.role_name AS role_name,
        d.sales_partner_name AS dealer_name
    FROM user_details ud
    JOIN user_roles ur ON ud.role_id = ur.role_id
    LEFT JOIN sales_partner_dbhub_schema d ON ud.partner_id = d.partner_id
    WHERE ud.email_id = $1;
    `
	return AdminDlrSaleRepRetrieveQuery
}

func ProjectMngmntRetrieveQueryFunc(filterUserQuery, searchValue string) string {
	if filterUserQuery == "" {
		filterUserQuery = "1 = 1"
	}

	ProjectMngmntRetrieveQuery := fmt.Sprintf(`
        SELECT customers_customers_schema.unique_id,
        customers_customers_schema.sale_date AS contract_date,
		ntp_ntp_schema.ntp_complete_date AS ntp_date,
        survey_survey_schema.original_survey_scheduled_date AS site_survey_scheduled_date,
        survey_survey_schema.reschedule_needed_on_date AS site_survey_rescheduled_date,
        CASE
            WHEN (survey_survey_schema.reschedule_needed_on_date IS NOT NULL
            AND survey_survey_schema.twond_visit_date IS NULL)
            THEN NULL
            WHEN survey_survey_schema.twond_visit_date IS NOT NULL
            THEN survey_survey_schema.twond_completion_date
            ELSE survey_survey_schema.survey_completion_date
        END AS site_survey_completed_date,
		permit_fin_pv_permits_schema.created_on AS permit_created,
        permit_fin_pv_permits_schema.pv_submitted AS permit_submitted_date,
        permit_fin_pv_permits_schema.pv_approved AS permit_approved_date,
		ic_ic_pto_schema.created_on AS ic_created_date,
        ic_ic_pto_schema.ic_submitted_date,
        ic_ic_pto_schema.ic_approved_date,
		pv_install_install_subcontracting_schema.created_on AS pv_install_created_date,
        pv_install_install_subcontracting_schema.pv_scheduling_ready_date AS pv_install_ready_date,
        pv_install_install_subcontracting_schema.install_fix_scheduled_date AS pv_install_scheduled_date,
        pv_install_install_subcontracting_schema.pv_completion_date AS pv_install_completed_date,
		fin_permits_fin_schema.pv_fin_date AS fin_scheduled_date,
        fin_permits_fin_schema.approved_date AS fin_pass_date,
		pto_ic_schema.pto_created_on AS pto_created_date,
        pto_ic_schema.submitted AS pto_submitted_date,
        pto_ic_schema.pto_granted AS pto_date,
		customers_customers_schema.customer_name AS home_owner,
		system_customers_schema.contracted_system_size_parent AS system_size,
		customers_customers_schema.state,
		ntp_ntp_schema.ahj,
		customers_customers_schema.adder_breakdown_and_total_new AS adder_breakdown_and_total,
		customers_customers_schema.total_system_cost AS contract_total,
		ntp_ntp_schema.finance AS finance_company,
		ntp_ntp_schema.net_epc
FROM customers_customers_schema
LEFT JOIN ntp_ntp_schema
    ON ntp_ntp_schema.unique_id = customers_customers_schema.unique_id
    AND LOWER(ntp_ntp_schema.project_status) NOT ILIKE '%%DUPLICATE%%'
    AND LOWER(ntp_ntp_schema.app_status) NOT ILIKE '%%DUPLICATE%%'
LEFT JOIN survey_survey_schema
    ON survey_survey_schema.customer_unique_id = customers_customers_schema.unique_id
    AND LOWER(survey_survey_schema.project_status) NOT ILIKE '%%DUPLICATE%%'
    AND LOWER(survey_survey_schema.app_status) NOT ILIKE '%%DUPLICATE%%'
LEFT JOIN pv_install_install_subcontracting_schema
    ON pv_install_install_subcontracting_schema.customer_unique_id = customers_customers_schema.unique_id
    AND LOWER(pv_install_install_subcontracting_schema.project_status) NOT ILIKE '%%DUPLICATE%%'
    AND LOWER(pv_install_install_subcontracting_schema.app_status) NOT ILIKE '%%DUPLICATE%%'
LEFT JOIN ic_ic_pto_schema
    ON ic_ic_pto_schema.customer_unique_id = customers_customers_schema.unique_id
    AND LOWER(ic_ic_pto_schema.project_status) NOT ILIKE '%%DUPLICATE%%'
    AND LOWER(ic_ic_pto_schema.app_status) NOT ILIKE '%%DUPLICATE%%'
LEFT JOIN permit_fin_pv_permits_schema
    ON permit_fin_pv_permits_schema.customer_unique_id = customers_customers_schema.unique_id
    AND LOWER(permit_fin_pv_permits_schema.project_status) NOT ILIKE '%%DUPLICATE%%'
    AND LOWER(permit_fin_pv_permits_schema.app_status) NOT ILIKE '%%DUPLICATE%%'
LEFT JOIN fin_permits_fin_schema
    ON fin_permits_fin_schema.customer_unique_id = customers_customers_schema.unique_id
    AND LOWER(fin_permits_fin_schema.project_status) NOT ILIKE '%%DUPLICATE%%'
    AND LOWER(fin_permits_fin_schema.app_status) NOT ILIKE '%%DUPLICATE%%'
LEFT JOIN pto_ic_schema
    ON pto_ic_schema.customer_unique_id = customers_customers_schema.unique_id
    AND LOWER(pto_ic_schema.project_status) NOT ILIKE '%%DUPLICATE%%'
LEFT JOIN system_customers_schema
    ON system_customers_schema.customer_id = customers_customers_schema.unique_id
    AND LOWER(system_customers_schema.project_status) NOT ILIKE '%%DUPLICATE%%'
    WHERE %s %s `, filterUserQuery, searchValue)
	return ProjectMngmntRetrieveQuery
}

func QcNtpRetrieveQueryFunc() string {
	var filtersBuilder strings.Builder
	filtersBuilder.WriteString(`
        SELECT
            customers_customers_schema.current_live_cad,
            customers_customers_schema.system_sold_er,
            customers_customers_schema.podio_link,
            customers_customers_schema.unique_id,
            ntp_ntp_schema.production_discrepancy,
            ntp_ntp_schema.finance_ntp_of_project,
            ntp_ntp_schema.utility_bill_uploaded,
            ntp_ntp_schema.powerclerk_signatures_complete,
            ntp_ntp_schema.change_order_status,
            customers_customers_schema.utility_company,
            customers_customers_schema.state,
            customers_customers_schema.customer_name AS home_owner,
            ntp_ntp_schema.ntp_complete_date AS ntp_date,
            split_part(ntp_ntp_schema.prospectid_dealerid_salesrepid, ',', 1) AS first_value,
            CASE
                WHEN customers_customers_schema.utility_company = 'APS' THEN prospects_customers_schema.powerclerk_sent_az
                ELSE 'Not Needed'
            END AS powerclerk_sent_az,
            CASE
                WHEN prospects_customers_schema.payment_method = 'Cash' THEN prospects_customers_schema.ach_waiver_sent_and_signed_cash_only
                ELSE 'Not Needed'
            END AS ach_waiver_sent_and_signed_cash_only,
            CASE
                WHEN customers_customers_schema.state = 'NM :: New Mexico' THEN prospects_customers_schema.green_area_nm_only
                ELSE 'Not Needed'
            END AS green_area_nm_only,
            CASE
                WHEN prospects_customers_schema.payment_method = 'Lease' OR prospects_customers_schema.payment_method = 'Loan' THEN prospects_customers_schema.finance_credit_approved_loan_or_lease
                ELSE 'Not Needed'
            END AS finance_credit_approved_loan_or_lease,
            CASE
                WHEN prospects_customers_schema.payment_method = 'Lease' OR prospects_customers_schema.payment_method = 'Loan' THEN prospects_customers_schema.finance_agreement_completed_loan_or_lease
                ELSE 'Not Needed'
            END AS finance_agreement_completed_loan_or_lease,
            CASE
                WHEN prospects_customers_schema.payment_method = 'Cash' OR prospects_customers_schema.payment_method = 'Loan' THEN prospects_customers_schema.owe_documents_completed
                ELSE 'Not Needed'
            END AS owe_documents_completed
        FROM customers_customers_schema
        LEFT JOIN ntp_ntp_schema
            ON customers_customers_schema.unique_id = ntp_ntp_schema.unique_id
            AND ntp_ntp_schema.app_status NOT ILIKE '%DUPLICATE%'
        LEFT JOIN system_customers_schema
            ON customers_customers_schema.unique_id = system_customers_schema.customer_id
            AND system_customers_schema.project_status NOT ILIKE '%DUPLICATE%'
        LEFT JOIN prospects_customers_schema
        ON split_part(ntp_ntp_schema.prospectid_dealerid_salesrepid, ',', 1) = prospects_customers_schema.prospect_id::text
        AND ntp_ntp_schema.prospectid_dealerid_salesrepid IS NOT NULL
        AND ntp_ntp_schema.prospectid_dealerid_salesrepid <> ''
        AND TRIM(ntp_ntp_schema.prospectid_dealerid_salesrepid) <> ','
    `)

	return filtersBuilder.String()
}

func PendingActionPageCoQuery(filterUserQuery, searchValue string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}
	var filtersBuilder strings.Builder
	filtersBuilder.WriteString(fmt.Sprintf(`
        SELECT
            customers_customers_schema.unique_id,
            ntp_ntp_schema.change_order_status,
            customers_customers_schema.customer_name AS home_owner,
            ntp_ntp_schema.ntp_complete_date AS ntp_date
     FROM ntp_ntp_schema
     LEFT JOIN customers_customers_schema
        ON customers_customers_schema.unique_id = ntp_ntp_schema.unique_id
        AND customers_customers_schema.unique_id != ''
     WHERE ntp_ntp_schema.project_status NOT IN (
        'HOLD', E'PTO\'d (Service)', E'PTO\'d (Audit)', 'BLOCKED',
        'JEOPARDY', 'CANCEL', 'DUPLICATE', 'COMPETING'
     )
     AND ntp_ntp_schema.app_status IN (
        'Pending NTP Review', 'Pending QC', 'Pending NTP',
        'Pending NTP - Legal', 'Pending NTP - Change Order', 'Under Review'
     ) AND ntp_ntp_schema.app_status = 'Pending NTP - Change Order'
     %v %v
    `, filterUserQuery, searchValue))

	return filtersBuilder.String()
}

func PendingActionPageCoQueryNew(filterUserQuery, searchValue string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}
	var filtersBuilder strings.Builder
	filtersBuilder.WriteString(fmt.Sprintf(`
        SELECT
            customers_customers_schema.unique_id,
            ntp_ntp_schema.production_discrepancy,
            ntp_ntp_schema.finance_ntp_of_project,
            ntp_ntp_schema.utility_bill_uploaded,
            ntp_ntp_schema.powerclerk_signatures_complete,
            ntp_ntp_schema.change_order_status,
            customers_customers_schema.customer_name AS home_owner,
            ntp_ntp_schema.ntp_complete_date AS ntp_date,

            ntp_ntp_schema.sale_date  AS sold_date,
            ntp_ntp_schema.app_status,
            ntp_ntp_schema.project_status,
            ntp_ntp_schema.sales_rep,
            sales_metrics_schema.setter,
            prospects_customers_schema.lead_source as deal_type,
            ntp_ntp_schema.pending_ntp_date,
            ntp_ntp_schema.ntp_delayed_by,
            ntp_ntp_schema.ntp_delay_notes

     FROM ntp_ntp_schema
     LEFT JOIN customers_customers_schema
        ON customers_customers_schema.unique_id = ntp_ntp_schema.unique_id
     LEFT JOIN sales_metrics_schema ON ntp_ntp_schema.unique_id = sales_metrics_schema.unique_id
        AND customers_customers_schema.unique_id != ''
    LEFT JOIN prospects_customers_schema
        ON split_part(ntp_ntp_schema.prospectid_dealerid_salesrepid, ',', 1) = prospects_customers_schema.prospect_id::text
     WHERE ntp_ntp_schema.project_status NOT IN (
        'HOLD', E'PTO\'d (Service)', E'PTO\'d (Audit)', 'BLOCKED',
        'JEOPARDY', 'CANCEL', 'DUPLICATE', 'COMPETING'
     )
     AND ntp_ntp_schema.app_status IN (
        'Pending NTP Review', 'Pending QC', 'Pending NTP',
        'Pending NTP - Legal', 'Pending NTP - Change Order', 'Under Review'
     ) AND ntp_ntp_schema.app_status = 'Pending NTP - Change Order'
     %v %v
    `, filterUserQuery, searchValue))

	return filtersBuilder.String()
}

func PendingActionPageNtpQuery(filterUserQuery, searchValue string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}
	var filtersBuilder strings.Builder
	filtersBuilder.WriteString(fmt.Sprintf(`
        SELECT
            customers_customers_schema.unique_id,
            ntp_ntp_schema.production_discrepancy,
            ntp_ntp_schema.finance_ntp_of_project,
            ntp_ntp_schema.utility_bill_uploaded,
            ntp_ntp_schema.powerclerk_signatures_complete,
            customers_customers_schema.customer_name AS home_owner,
            ntp_ntp_schema.ntp_complete_date AS ntp_date
        FROM ntp_ntp_schema
	 LEFT JOIN customers_customers_schema ON customers_customers_schema.unique_id = ntp_ntp_schema.unique_id
     AND customers_customers_schema.unique_id != ''
	 WHERE ntp_ntp_schema.app_status IN ('Pending NTP Review','Pending QC','Pending NTP','Pending NTP - Change Order','Under Review')
     AND ntp_ntp_schema.project_status NOT IN ('HOLD',E'PTO\'d (Service)', E'PTO\'d (Audit)','BLOCKED','JEOPARDY','CANCEL','DUPLICATE','COMPETING')
     %v %v
    `, filterUserQuery, searchValue))

	return filtersBuilder.String()
}

func PendingActionPageNtpQueryNew(filterUserQuery, searchValue string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}
	var filtersBuilder strings.Builder
	filtersBuilder.WriteString(fmt.Sprintf(`
        SELECT
            customers_customers_schema.unique_id,
            ntp_ntp_schema.production_discrepancy,
            ntp_ntp_schema.finance_ntp_of_project,
            ntp_ntp_schema.utility_bill_uploaded,
            ntp_ntp_schema.powerclerk_signatures_complete,
            ntp_ntp_schema.change_order_status,
            customers_customers_schema.customer_name AS home_owner,
            ntp_ntp_schema.ntp_complete_date AS ntp_date,

            ntp_ntp_schema.sale_date  AS sold_date,
            ntp_ntp_schema.app_status,
            ntp_ntp_schema.project_status,
            ntp_ntp_schema.sales_rep,
            sales_metrics_schema.setter,
            prospects_customers_schema.lead_source as deal_type,
            ntp_ntp_schema.pending_ntp_date,
            ntp_ntp_schema.ntp_delayed_by,
            ntp_ntp_schema.ntp_delay_notes

     FROM ntp_ntp_schema
     LEFT JOIN customers_customers_schema
        ON customers_customers_schema.unique_id = ntp_ntp_schema.unique_id
    LEFT JOIN sales_metrics_schema ON ntp_ntp_schema.unique_id = sales_metrics_schema.unique_id

        AND customers_customers_schema.unique_id != ''
    LEFT JOIN prospects_customers_schema
        ON split_part(ntp_ntp_schema.prospectid_dealerid_salesrepid, ',', 1) = prospects_customers_schema.prospect_id::text
     WHERE ntp_ntp_schema.project_status NOT IN (
        'HOLD', E'PTO\'d (Service)', E'PTO\'d (Audit)', 'BLOCKED',
        'JEOPARDY', 'CANCEL', 'DUPLICATE', 'COMPETING'
     )
      AND ntp_ntp_schema.app_status IN (
        'Pending NTP Review', 'Pending QC', 'Pending NTP',
        'Pending NTP - Legal', 'Pending NTP - Change Order', 'Under Review'
    )
     %v %v
    `, filterUserQuery, searchValue))

	return filtersBuilder.String()
}

func PendingActionPageTileQuery(filterUserQuery, searchValue string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}
	var filtersBuilder strings.Builder
	filtersBuilder.WriteString(fmt.Sprintf(`
        SELECT
    (SELECT COUNT(*)
     FROM ntp_ntp_schema
	 LEFT JOIN customers_customers_schema ON customers_customers_schema.unique_id = ntp_ntp_schema.unique_id
     AND customers_customers_schema.unique_id != ''
	 WHERE ntp_ntp_schema.app_status IN ('Pending NTP Review','Pending QC','Pending NTP','Pending NTP - Change Order','Under Review')
     AND ntp_ntp_schema.project_status NOT IN ('HOLD',E'PTO\'d (Service)', E'PTO\'d (Audit)','BLOCKED','JEOPARDY','CANCEL','DUPLICATE','COMPETING')
     %v %v) AS ntp_count,

    (SELECT COUNT(*)
     FROM ntp_ntp_schema
     LEFT JOIN customers_customers_schema
        ON customers_customers_schema.unique_id = ntp_ntp_schema.unique_id
        AND customers_customers_schema.unique_id != ''
     WHERE ntp_ntp_schema.project_status NOT IN (
        'HOLD', E'PTO\'d (Service)', E'PTO\'d (Audit)', 'BLOCKED',
        'JEOPARDY', 'CANCEL', 'DUPLICATE', 'COMPETING'
     )
     AND ntp_ntp_schema.app_status IN (
        'Pending NTP Review', 'Pending QC', 'Pending NTP',
        'Pending NTP - Legal', 'Pending NTP - Change Order', 'Under Review'
     ) AND ntp_ntp_schema.app_status = 'Pending NTP - Change Order'
     %v %v) AS co_count;
    `, filterUserQuery, searchValue, filterUserQuery, searchValue))

	return filtersBuilder.String()
}

func CsvDownloadRetrieveQueryFunc() string {
	// Build the SQL Query
	var filtersBuilder strings.Builder
	filtersBuilder.WriteString(`
        SELECT cs.unique_id,cs.customer_name as home_owner,cs.email_address,
        cs.phone_number,cs.address,cs.state,
        scs.contracted_system_size_parent,
        cs.sale_date,ns.ntp_complete_date, pis.pv_completion_date,
        ps.pto_granted as pto_date, cs.cancel_date, cs.primary_sales_rep,
        cs.secondary_sales_rep, cs.total_system_cost as contract_total FROM customers_customers_schema cs
								LEFT JOIN ntp_ntp_schema ns ON ns.unique_id = cs.unique_id
								LEFT JOIN pv_install_install_subcontracting_schema pis ON pis.customer_unique_id = cs.unique_id
                                --LEFT JOIN sales_metrics_schema ss ON ss.unique_id = cs.unique_id
								LEFT JOIN system_customers_schema scs ON scs.customer_id = cs.unique_id
                                LEFT JOIN pto_ic_schema ps ON ps.customer_unique_id = cs.unique_id
        `)

	return filtersBuilder.String()
}

func PipelineTileDataAboveQuery(filterUserQuery, projectStatus string) string {
	PipelineTileDataQuery := fmt.Sprintf(`
     WITH time_intervals AS (
            SELECT
                --=====================
                -- Basic info
                --=====================
                cust.record_id AS customer_record_id,
                cust.our        AS customer_unique_id,
                cust.sale_date  AS sale_date,
                cust.project_status AS customer_project_status,
                --=====================
                -- NTP date
                --=====================
                ntp.ntp_complete_date AS ntp_complete_date,

                --=====================
                -- Two-Visit Survey fields
                --=====================
                survey.survey_completion_date AS survey_completion_date,
                survey.twond_visit_date       AS twond_visit_date,
                survey.twond_completion_date  AS twond_completion_date,

               CASE
                    WHEN (survey.reschedule_needed_on_date IS NOT NULL
                        AND survey.twond_visit_date IS NULL)
                        THEN NULL
                    WHEN survey.twond_visit_date IS NOT NULL
                        THEN survey.twond_completion_date
                  ELSE survey.survey_completion_date
                END AS survey_final_completion_date,

                --=====================
                -- CAD
                --=====================
                cad.item_created_on AS cad_ready,
                cad.plan_set_complete_day AS cad_complete_date,
                cad.active_inactive       AS cad_active_status,
                cad.plan_set_status,
                cad.plan_set_version AS cad_version,
                cad.project_status_new,


                --=====================
                -- Permit
                --=====================
                permit.pv_approved        AS permit_approval_date,

                --=====================
                -- IC
                --=====================
                ic.ic_approved_date       AS ic_approval_date,

                --=====================
                -- Install
                --=====================
                install.pv_completion_date    AS install_complete_date,
                install.pv_install_day_window AS pv_install_day_window,

                --=====================
                -- FIN & PTO
                --=====================
                fin.approved_date AS fin_approved_date,
                pto.pto_granted   AS pto_granted_new,

                --=====================
                -- Roofing Request
                --=====================
                roofing.record_created_on AS roofing_created_date,
                roofing.work_completed_date AS roofing_completed_date,
                roofing.app_status AS roofing_status,
                roofing.no_roof_work_needed_date_h AS no_roof_work_needed,
                roofing.roof_work_needed_date as roof_work_needed

            FROM customers_customers_schema AS cust

            -- Original Joins
            LEFT JOIN ntp_ntp_schema AS ntp
                ON cust.our = ntp.unique_id
            LEFT JOIN survey_survey_schema AS survey
                ON cust.our = survey.customer_unique_id
            LEFT JOIN planset_cad_schema AS cad
                ON cust.our = cad.our_number
                AND cad.active_inactive = 'Active'
            LEFT JOIN permit_fin_pv_permits_schema AS permit
                ON cust.our = permit.customer_unique_id
            LEFT JOIN ic_ic_pto_schema AS ic
                ON cust.our = ic.customer_unique_id
            LEFT JOIN pv_install_install_subcontracting_schema AS install
                ON cust.our = install.customer_unique_id
        LEFT JOIN roofing_request_install_subcontracting_schema AS roofing
                ON cust.our = roofing.customer_unique_id

            -- New FIN & PTO Joins
            LEFT JOIN fin_permits_fin_schema AS fin
                ON cust.our = fin.customer_unique_id
            LEFT JOIN pto_ic_schema AS pto
                ON cust.our = pto.customer_unique_id


             WHERE
            cust.project_status IN (%v)
               AND %v
        ),

        all_queues AS (
            SELECT
                ti.*,
                'NTP Queue' AS queue_status
            FROM time_intervals ti
            WHERE ti.ntp_complete_date IS NULL

            UNION ALL

            SELECT
                ti.*,
                CASE
                    WHEN ti.survey_final_completion_date IS NULL
                        AND ti.cad_complete_date IS NULL
                        AND ti.permit_approval_date IS NULL
                        AND ti.ic_approval_date IS NULL
                        AND ti.install_complete_date IS NULL
                    THEN 'Survey Queue'

                   WHEN ti.cad_complete_date IS NULL
						and ti.plan_set_status NOT IN ('Plan Set Complete')
						and ti.cad_active_status IN ('Active')
						AND ti.project_status_new IN ('ACTIVE')
						AND ti.cad_version NOT IN ('ABCAD 1', 'ABCAD 2', 'ABCAD 3',
					'ABCAD 4','ABCAD 5', 'ABCAD 6', 'ABCAD 7',
					'ABCAD 8', 'ABCAD 9', 'ABCAD 10+')
                    THEN 'CAD Queue'

                    WHEN ti.permit_approval_date IS NULL
                        AND ti.cad_complete_date IS NOT NULL
                        AND ti.ic_approval_date IS NULL
                        AND ti.install_complete_date IS NULL
                    THEN 'Permit Queue'

                    WHEN ti.ic_approval_date IS NULL
                        AND ti.permit_approval_date IS NOT NULL
                        AND ti.install_complete_date IS NULL
                    THEN 'IC Queue'

                    WHEN ti.install_complete_date IS NULL
                        AND ti.permit_approval_date IS NOT NULL
                        AND ti.ic_approval_date IS NOT NULL
                        AND ti.pv_install_day_window IS NULL
                        AND ( ti.no_roof_work_needed IS NOT NULL
                        OR (ti.roof_work_needed IS NOT NULL AND ti.roofing_completed_date IS NOT NULL))
                    THEN 'Install (Scheduling) Queue'

                    WHEN ti.install_complete_date IS NULL
                        AND ti.permit_approval_date IS NOT NULL
                        AND ti.ic_approval_date IS NOT NULL
                        AND ti.pv_install_day_window IS NOT NULL
                    THEN 'Install (Pending) Queue'

                    WHEN ti.install_complete_date IS NOT NULL
                        AND ti.fin_approved_date IS NULL
                        AND ti.pto_granted_new IS NULL
                    THEN 'Inspections Queue'

                    WHEN ti.install_complete_date IS NOT NULL
                        AND ti.fin_approved_date IS NOT NULL
                        AND ti.pto_granted_new IS NULL
                    THEN 'Activation Queue'

                    WHEN ti.roofing_created_date IS NOT NULL
                        AND ti.roofing_completed_date IS NULL
                        AND ti.roof_work_needed IS NOT NULL
                    THEN 'Roofing Queue'

                    ELSE NULL
                END AS queue_status
            FROM time_intervals ti
        ),

        final_queues AS (
            SELECT
                aq.*,
                CASE
                    WHEN aq.queue_status = 'NTP Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.sale_date)
                    WHEN aq.queue_status = 'Survey Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.sale_date)
                    WHEN aq.queue_status = 'CAD Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.survey_final_completion_date)
                    WHEN aq.queue_status = 'Permit Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.cad_complete_date)
                    WHEN aq.queue_status = 'IC Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.permit_approval_date)
                    WHEN aq.queue_status IN ('Install (Scheduling) Queue', 'Install (Pending) Queue')
                    THEN DATE_PART('day', CURRENT_DATE - GREATEST(aq.permit_approval_date, aq.ic_approval_date))
                    WHEN aq.queue_status = 'Inspections Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.install_complete_date)
                    WHEN aq.queue_status = 'Activation Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.fin_approved_date)
                    WHEN aq.queue_status = 'Roofing Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.roofing_completed_date)
                    ELSE NULL
                END AS queue_days
            FROM all_queues aq
        )

        SELECT
            queue_status,
            COUNT(DISTINCT customer_unique_id) AS distinct_customer_count
        FROM final_queues
        WHERE queue_status IS NOT NULL
        GROUP BY queue_status
        ORDER BY distinct_customer_count DESC;
 `, projectStatus, filterUserQuery)
	return PipelineTileDataQuery
}

func PipelineSurveyTileData(filterUserQuery, projectStatus string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}

	PipelineTileDataQuery := fmt.Sprintf(`
        SELECT
            'Survey Queue' AS queue_status, count(survey.
                customer_unique_id) AS distinct_customer_count
        FROM
	        survey_survey_schema AS survey
        LEFT JOIN customers_customers_schema AS cust
            ON survey.customer_unique_id = cust.unique_id
        WHERE
	        survey.project_status IN (%s) AND
	        survey.app_status NOT IN ('Reschedule Complete','CANCEL', 'DUPLICATE', 'Complete')
	        %v;
        `, addSurveyStatus(projectStatus), filterUserQuery)
	return PipelineTileDataQuery
}

func PipelineCadTileData(filterUserQuery, projectStatus string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}

	// pvDateCheck := ""
	// if projectStatus == "'ACTIVE'" {
	// 	pvDateCheck = "AND (cad.pv_install_completed_date IS NULL OR cad.pv_install_completed_date = '')"
	// } else {
	// }

	PipelineTileDataQuery := fmt.Sprintf(`
        SELECT 'CAD Queue' AS queue_status, COUNT(*) AS distinct_customer_count
        FROM planset_cad_schema AS cad
        LEFT JOIN customers_customers_schema AS cust
            ON cad.our_number = cust.unique_id
        WHERE
            cad.active_inactive = 'Active'
            AND cad.plan_set_status != 'Plan Set Complete'
            AND cad.project_status_new IN (%v)
            AND (cad.pv_install_completed_date IS NULL OR cad.pv_install_completed_date = '')
            %v`, addCADStatus(projectStatus), filterUserQuery)

	return PipelineTileDataQuery
}

func PipelinePermitTileData(filterUserQuery, projectStatus string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}

	var permitCondition, icCondition string

	if projectStatus == "'ACTIVE'" {
		permitCondition = `permit.project_status IN ('ACTIVE')`
		icCondition = `ic.project_status IN ('ACTIVE')`
	} else {
		permitCondition = `permit.project_status IN ('HOLD', 'JEOPARDY', 'HOLD - CO Needed', 'HOLD - Exceptions')`
		icCondition = `ic.project_status NOT IN ('ACTIVE', 'HOLD', 'JEOPARDY', 'CANCEL', 'DUPLICATE')`
	}

	PipelineTileDataQuery := fmt.Sprintf(`
WITH permits AS (
    SELECT DISTINCT permit.customer_unique_id
    FROM permit_fin_pv_permits_schema permit
    LEFT JOIN customers_customers_schema AS cust
        ON cust.unique_id = permit.customer_unique_id
    WHERE
        %s
        AND permit.app_status NOT IN ('Approved - Permit in Hand', 'CANCEL', 'DUPLICATE')
        AND permit.pv_approved IS NULL
        %s
),
ic AS (
    SELECT DISTINCT ic.customer_unique_id
    FROM ic_ic_pto_schema AS ic
    LEFT JOIN customers_customers_schema AS cust
        ON cust.unique_id = ic.customer_unique_id
    WHERE
        %s
        AND ic.app_status IN ('Pending Requirement Review', 'Ready to Resubmit', 'Submitted',
                              'Redlined - Send to RAT', 'Ready to Submit', 'Resubmitted',
                              'Submitted - Pending Technical Review (NM)')
        AND ic.ic_approved_date IS NULL
        %s
),
combined_customers AS (
    SELECT customer_unique_id FROM permits
    UNION
    SELECT customer_unique_id FROM ic
)
SELECT
    'Permit Queue' AS queue_status,
    COUNT(cc.customer_unique_id) AS distinct_customer_count
FROM combined_customers cc
`, permitCondition, filterUserQuery, icCondition, filterUserQuery)

	return PipelineTileDataQuery
}

func PipelineRoofingTileData(filterUserQuery, projectStatus string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}
	if projectStatus != "'ACTIVE'" {
		projectStatus = fmt.Sprintf("'HOLD - CO Needed', 'HOLD - Exceptions', %s", projectStatus)
	}

	PipelineTileDataQuery := fmt.Sprintf(`
        SELECT
            'Roofing Queue' AS queue_status, count(cust.unique_id) AS distinct_customer_count
        FROM
	        roofing_request_install_subcontracting_schema AS roofing
        LEFT JOIN
	        customers_customers_schema AS cust ON cust.our = roofing.customer_unique_id
        WHERE
	        roofing.project_status IN (%v)              AND
	        roofing.record_created_on IS NOT NULL		AND
	        roofing.roof_work_needed_date IS NOT NULL 	AND
	        roofing.work_completed_date IS NULL
            %v`, addRoofingStatus(projectStatus), filterUserQuery)

	return PipelineTileDataQuery
}

func PipelineInstallTileData(filterUserQuery, projectStatus string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}

	PipelineTileDataQuery := fmt.Sprintf(`
        SELECT
            'Install (Scheduling) Queue' AS queue_status,
            COUNT(cust.unique_id) AS distinct_customer_count
        FROM
            pv_install_install_subcontracting_schema AS install
        LEFT JOIN
            customers_customers_schema AS cust
            ON cust.our = install.customer_unique_id
        WHERE
            install.project_status %s
            AND install.app_status NOT IN ('Install Complete', 'CANCEL', 'DUPLICATE')
            %s`, addInstallStatus(projectStatus), filterUserQuery)

	return PipelineTileDataQuery
}

func PipelineInspectionTileData(filterUserQuery, projectStatus string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}

	PipelineTileDataQuery := fmt.Sprintf(`
    SELECT
        'Inspections Queue' AS queue_status, COUNT(customer_unique_id) AS distinct_customer_count
    FROM
        fin_permits_fin_schema AS fin
    LEFT JOIN
        customers_customers_schema AS cust ON fin.customer_unique_id = cust.unique_id
    WHERE
        fin.project_status  %v
    AND fin.app_status NOT IN ('FIN Complete', 'DUPLICATE')
    %v`, addInspectionStatus(projectStatus), filterUserQuery)

	return PipelineTileDataQuery
}

func PipelineActivationTileData(filterUserQuery, projectStatus string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}

	PipelineTileDataQuery := fmt.Sprintf(`
        SELECT
            'Activation Queue' AS queue_status,
            COUNT(pto.customer_unique_id) AS distinct_customer_count
        FROM
	        pto_ic_schema AS pto
            LEFT JOIN customers_customers_schema cust
			ON cust.unique_id  = pto.customer_unique_id
        WHERE
            pto.project_status %v
            AND pto.pto_app_status IN ('New: Pending Audit','Submitted','Resubmitted ','Ready for Resubmission','Needs Review','PTO Overdue',
            'Ready to Submit','Pending Query','Redlined','Query Resolved')
            %s`, addActivationStatus(projectStatus), filterUserQuery)

	return PipelineTileDataQuery
}

func PipelineSurveyDataBelow(filterUserQuery, projectStatus, queueStatus, searchValue string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}

	PipelineDataQuery := fmt.Sprintf(`
        SELECT
            cust.unique_id AS customer_unique_id,
            cust.customer_name AS home_owner,
            cust.sale_date,
            cust.dealer,
            cust.primary_sales_rep,
            cust.email_address AS customer_email,
            cust.phone_number AS customer_phone_number,
            cust.address,
            cust.state,
            cust.total_system_cost AS contract_total,
            cust.contracted_system_size AS system_size,
            survey.original_survey_scheduled_date AS site_survey_scheduled_date,
	        CASE
		        WHEN (survey.reschedule_needed_on_date IS NOT NULL
			        AND survey.twond_visit_date IS NULL)
			        THEN NULL
		        WHEN survey.twond_visit_date IS NOT NULL
			        THEN survey.twond_completion_date
		        ELSE survey.survey_completion_date
	        END AS survey_final_completion_date
        FROM
	        survey_survey_schema AS survey
        LEFT JOIN
	        customers_customers_schema AS cust ON survey.customer_unique_id = cust.unique_id
        WHERE
	        survey.project_status IN (%v) AND
	        survey.app_status NOT IN ('Reschedule Complete','CANCEL', 'DUPLICATE', 'Complete')
	        %v %v;
        `, addSurveyStatus(projectStatus), filterUserQuery, searchValue)
	return PipelineDataQuery
}

func PipelineCadDataBelow(filterUserQuery, projectStatus, queueStatus, searchValue string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}
	PipelineDataQuery := fmt.Sprintf(`
        SELECT
            cust.unique_id AS customer_unique_id,
            cust.customer_name AS home_owner,
            cust.dealer,
            cust.primary_sales_rep,
            cust.email_address AS customer_email,
            cust.phone_number AS customer_phone_number,
            cust.address,
            cust.state,
            cust.total_system_cost AS contract_total,
            cust.contracted_system_size AS system_size,
            cust.customer_name AS home_owner,
	        cad.record_created_on AS cad_ready,
	        cad.pv_install_completed_date AS cad_complete_date
        FROM
	        planset_cad_schema AS cad
        LEFT JOIN
	        customers_customers_schema AS cust ON cad.our_number = cust.unique_id
        WHERE
	        cad.active_inactive = 'Active'
            AND cad.plan_set_status != 'Plan Set Complete'
            AND cad.project_status_new IN (%v)
            AND (cad.pv_install_completed_date IS NULL OR cad.pv_install_completed_date = '')
	            %v %v
            ;`, addCADStatus(projectStatus), filterUserQuery, searchValue)

	return PipelineDataQuery
}

func PipelinePermitDataBelow(filterUserQuery, projectStatus, queueStatus, searchValue string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}

	var permitCondition, icCondition string

	if projectStatus == "'ACTIVE'" {
		permitCondition = `permit.project_status IN ('ACTIVE')`
		icCondition = `ic.project_status IN ('ACTIVE')`
	} else {
		permitCondition = `permit.project_status IN ('HOLD', 'JEOPARDY', 'HOLD - CO Needed', 'HOLD - Exceptions')`
		icCondition = `ic.project_status NOT IN ('ACTIVE', 'HOLD', 'JEOPARDY', 'CANCEL', 'DUPLICATE')`
	}

	PipelineDataQuery := fmt.Sprintf(`
WITH combined_customers AS (
    SELECT DISTINCT permit.customer_unique_id
    FROM permit_fin_pv_permits_schema permit
    LEFT JOIN customers_customers_schema AS cust
        ON cust.unique_id = permit.customer_unique_id
    WHERE
        %s
        AND permit.app_status NOT IN (
            'Approved - Permit in Hand',
            'Approved - No Permit Required - Permitting Complete',
            'AB Not Required - Permitting Complete',
            'AB Permitting Complete ',
            'CANCEL',
            'DUPLICATE'
        )
        AND permit.pv_approved IS NULL

    UNION

    SELECT DISTINCT ic.customer_unique_id
    FROM ic_ic_pto_schema AS ic
    LEFT JOIN customers_customers_schema AS cust
        ON cust.unique_id = ic.customer_unique_id
    WHERE
        %s
        AND ic.app_status IN (
            'Pending Requirement Review',
            'Ready to Resubmit',
            'Submitted',
            'Redlined - Send to RAT',
            'Ready to Submit',
            'Resubmitted',
            'Submitted - Pending Technical Review (NM)'
        )
        AND ic.ic_approved_date IS NULL
)
SELECT
	DISTINCT ON (cc.customer_unique_id)
    cust.unique_id AS customer_unique_id,
    cust.customer_name AS home_owner,
    cust.dealer,
    cust.primary_sales_rep,
    cust.email_address AS customer_email,
    cust.phone_number AS customer_phone_number,
    cust.address,
    cust.state,
    cust.total_system_cost AS contract_total,
    cust.contracted_system_size AS system_size,
    cad.pv_install_completed_date AS cad_complete_date,
    permit.pv_submitted AS permit_submitted_date,
    ic.ic_submitted_date,
    permit.pv_approved AS permit_approval_date,
    ic.ic_approved_date AS ic_approval_date
FROM
    combined_customers cc
LEFT JOIN
    customers_customers_schema AS cust ON cust.unique_id = cc.customer_unique_id
    AND cust.project_status NOT ILIKE '%%duplicate%%'
LEFT JOIN
    planset_cad_schema AS cad ON cust.unique_id = cad.our_number
LEFT JOIN
    permit_fin_pv_permits_schema AS permit ON cust.unique_id = permit.customer_unique_id
    AND permit.project_status NOT ILIKE '%%duplicate%%' AND permit.app_status  NOT ILIKE '%%duplicate%%'
LEFT JOIN
    ic_ic_pto_schema AS ic ON cust.unique_id = ic.customer_unique_id
    AND ic.project_status NOT ILIKE '%%duplicate%%' AND ic.app_status  NOT ILIKE '%%duplicate%%'
WHERE 1=1 %s %s;
`, permitCondition, icCondition, filterUserQuery, searchValue)

	return PipelineDataQuery
}

func PipelineRoofingDataBelow(filterUserQuery, projectStatus, queueStatus, searchValue string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}
	PipelineDataQuery := fmt.Sprintf(`
        SELECT
            cust.unique_id AS customer_unique_id,
            cust.customer_name AS home_owner,
            cust.dealer,
            cust.primary_sales_rep,
            cust.email_address AS customer_email,
            cust.phone_number AS customer_phone_number,
            cust.address,
            cust.state,
            cust.total_system_cost AS contract_total,
            cust.contracted_system_size AS system_size,
            roofing.record_created_on AS roofing_created_date,
			roofing.work_completed_date AS roofing_completed_date,
			roofing.app_status AS roofing_status
        FROM
            roofing_request_install_subcontracting_schema AS roofing
        LEFT JOIN
            customers_customers_schema AS cust ON cust.unique_id = roofing.customer_unique_id
        WHERE
	        roofing.project_status IN (%v)                 AND
	        roofing.record_created_on IS NOT NULL		AND
	        roofing.roof_work_needed_date IS NOT NULL 	AND
	        roofing.work_completed_date IS NULL
            %v %v;`, addRoofingStatus(projectStatus), filterUserQuery, searchValue)

	return PipelineDataQuery
}

func PipelineInstallDataBelow(filterUserQuery, projectStatus, queueStatus, searchValue string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}
	PipelineDataQuery := fmt.Sprintf(`
        SELECT
            DISTINCT ON (cust.unique_id)
            cust.unique_id AS customer_unique_id,
            cust.customer_name AS home_owner,
            cust.dealer,
            cust.primary_sales_rep,
            cust.email_address AS customer_email,
            cust.phone_number AS customer_phone_number,
            cust.address,
            cust.state,
            cust.total_system_cost AS contract_total,
            cust.contracted_system_size AS system_size,
            install.created_on AS pv_install_created_date,
			b.battery_installation_date AS battery_scheduled_date,
			b.completion_date AS battery_complete_date,
			install.pv_completion_date AS install_completed_date
        FROM
            pv_install_install_subcontracting_schema AS install
        LEFT JOIN
            customers_customers_schema AS cust ON cust.unique_id = install.customer_unique_id
        LEFT JOIN
            batteries_service_electrical_schema b ON b.customer_unique_id = install.customer_unique_id
        WHERE
            install.project_status %s AND
            install.app_status not in
                ('Install Complete', 'CANCEL', 'DUPLICATE')
            %v %v;`, addInstallStatus(projectStatus), filterUserQuery, searchValue)

	return PipelineDataQuery
}

func PipelineInspectionDataBelow(filterUserQuery, projectStatus, queueStatus, searchValue string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}
	PipelineDataQuery := fmt.Sprintf(`
    SELECT
        fin.customer_unique_id AS customer_unique_id,
        cust.customer_name AS home_owner,
        cust.dealer,
        cust.primary_sales_rep,
        cust.email_address AS customer_email,
        cust.phone_number AS customer_phone_number,
        cust.address,
        cust.state,
        cust.total_system_cost AS contract_total,
        cust.contracted_system_size AS system_size,
        fin.created_on AS fin_created_date,
        fin.pv_fin_date AS fin_pass_date
        --install.pv_completion_date AS install_completed_date
    FROM fin_permits_fin_schema AS fin
    LEFT JOIN customers_customers_schema cust ON cust.unique_id = fin.customer_unique_id
	WHERE
    fin.project_status  %v
    AND fin.app_status NOT IN ('FIN Complete', 'DUPLICATE')
    %v %v`, addInspectionStatus(projectStatus), filterUserQuery, searchValue)
	return PipelineDataQuery
}

func PipelineActivationDataBelow(filterUserQuery, projectStatus, queueStatus, searchValue string) string {
	if filterUserQuery != "" {
		filterUserQuery = "AND " + filterUserQuery
	}
	PipelineDataQuery := fmt.Sprintf(`
        SELECT
            cust.unique_id AS customer_unique_id,
            cust.customer_name AS home_owner,
            cust.dealer,
            cust.primary_sales_rep,
            cust.email_address AS customer_email,
            cust.phone_number AS customer_phone_number,
            cust.address,
            cust.state,
            cust.total_system_cost AS contract_total,
            cust.contracted_system_size AS system_size,
            pto.submitted AS pto_submitted_date,
			pto.pto_granted AS pto_granted_new
			--fin.pv_fin_date AS fin_pass_date,
			--fin.created_on AS fin_created_date
        FROM
            pto_ic_schema AS pto
        LEFT JOIN
            customers_customers_schema AS cust ON cust.unique_id = pto.customer_unique_id
        WHERE
            pto.project_status %v
            AND pto.pto_app_status IN ('New: Pending Audit','Submitted','Resubmitted ','Ready for Resubmission','Needs Review','PTO Overdue',
            'Ready to Submit','Pending Query','Redlined','Query Resolved')
            %v %v;`, addActivationStatus(projectStatus), filterUserQuery, searchValue)

	return PipelineDataQuery
}

func GetBasePipelineQuery(uniqueIds string) string {
	return fmt.Sprintf(`
        SELECT
            DISTINCT ON (cust.unique_id)
            cust.unique_id AS customer_unique_id,
            cust.customer_name AS home_owner,
            cust.dealer,
            cust.primary_sales_rep,
            cust.email_address AS customer_email,
            cust.phone_number AS customer_phone_number,
            cust.address,
            cust.state,
            cust.total_system_cost AS contract_total,
            cust.contracted_system_size AS system_size,
			cust.sale_date,

			install.created_on AS pv_install_created_date,
            install.pv_completion_date AS install_completed_date,

			b.battery_installation_date AS battery_scheduled_date,
            b.completion_date AS battery_complete_date,

			ic.ic_approved_date AS ic_approval_date,
            ic.ic_submitted_date,

			pto.submitted AS pto_submitted_date,
            pto.pto_granted AS pto_granted_new,

			fin.pv_fin_date AS fin_pass_date,
            fin.created_on AS fin_created_date,

            roofing.work_completed_date AS roofing_completed_date,
            roofing.app_status AS roofing_status,
            roofing.record_created_on AS roofing_created_date,

			permit.pv_approved AS permit_approval_date,
            permit.pv_submitted AS permit_submitted_date,

			cad.record_created_on AS cad_ready,
            cad.plan_set_complete_day AS cad_complete_date,

            pto.submitted AS pto_submitted_date,
			pto.pto_granted AS pto_granted_new,

            ntp.ntp_complete_date AS ntp_complete_date,

			survey.original_survey_scheduled_date AS site_survey_scheduled_date,
            CASE
                WHEN (survey.reschedule_needed_on_date IS NOT NULL
                    AND survey.twond_visit_date IS NULL)
                    THEN NULL
                WHEN survey.twond_visit_date IS NOT NULL
                    THEN survey.twond_completion_date
                ELSE survey.survey_completion_date
            END AS survey_final_completion_date
        FROM
            customers_customers_schema AS cust
        LEFT JOIN
			ntp_ntp_schema AS ntp ON cust.unique_id = ntp.unique_id
        LEFT JOIN
            permit_fin_pv_permits_schema AS permit ON cust.unique_id = permit.customer_unique_id
        LEFT JOIN
            ic_ic_pto_schema AS ic ON cust.unique_id = ic.customer_unique_id
        LEFT JOIN
            survey_survey_schema AS survey ON cust.our = survey.customer_unique_id
        LEFT JOIN
            pv_install_install_subcontracting_schema AS install ON cust.unique_id = install.customer_unique_id
        LEFT JOIN
            roofing_request_install_subcontracting_schema AS roofing ON cust.our = roofing.customer_unique_id
        LEFT JOIN
            planset_cad_schema AS cad ON cust.unique_id = cad.our_number
        LEFT JOIN
            batteries_service_electrical_schema b ON cust.unique_id = b.customer_unique_id
        LEFT JOIN
            fin_permits_fin_schema AS fin ON cust.unique_id = fin.customer_unique_id
        LEFT JOIN
            pto_ic_schema AS pto ON cust.our = pto.customer_unique_id
		WHERE cust.unique_id in (%v) ORDER BY cust.unique_id, install.pv_completion_date DESC NULLS LAST`, uniqueIds)
}

func PipelineDealerDataQuery(filterUserQuery string) string {
	PipelineDealerQuery := fmt.Sprintf(`
    WITH filtered_customers AS (
        SELECT DISTINCT *
        FROM customers_customers_schema cust
        WHERE %s
        AND cust.unique_id <> ''
    ),
    -- NTP:
    ntp_single AS (
        SELECT
            unique_id,
            ntp_complete_date,
            finance_type,
            ROW_NUMBER() OVER (
                PARTITION BY unique_id
                ORDER BY ntp_complete_date DESC
            ) AS rn
        FROM ntp_ntp_schema
    ),
    -- SURVEY:
    survey_single AS (
        SELECT
            customer_unique_id,
            CASE
                WHEN (reschedule_needed_on_date IS NOT NULL AND twond_visit_date IS NULL) THEN NULL
                WHEN twond_visit_date IS NOT NULL THEN twond_completion_date
                ELSE survey_completion_date
            END AS survey_final_completion_date,
            ROW_NUMBER() OVER (
                PARTITION BY customer_unique_id
                ORDER BY
                    CASE
                        WHEN (reschedule_needed_on_date IS NOT NULL AND twond_visit_date IS NULL) THEN NULL
                        WHEN twond_visit_date IS NOT NULL THEN twond_completion_date
                        ELSE survey_completion_date
                    END DESC
            ) AS rn
        FROM survey_survey_schema
    ),
    -- PERMIT:
    permit_single AS (
        SELECT
            customer_unique_id,
            pv_submitted,
            pv_approved,
            ROW_NUMBER() OVER (
                PARTITION BY customer_unique_id
                ORDER BY pv_submitted DESC
            ) AS rn
        FROM permit_fin_pv_permits_schema
    ),
    -- INTERCONNECTION:
    ic_single AS (
        SELECT
            customer_unique_id,
            ic_submitted_date,
            ic_approved_date,
            ROW_NUMBER() OVER (
                PARTITION BY customer_unique_id
                ORDER BY ic_submitted_date DESC
            ) AS rn
        FROM ic_ic_pto_schema
    ),
    -- INSTALL:
    install_single AS (
        SELECT
            customer_unique_id,
            pv_completion_date,
            ROW_NUMBER() OVER (
                PARTITION BY customer_unique_id
                ORDER BY pv_completion_date DESC
            ) AS rn
        FROM pv_install_install_subcontracting_schema
    ),
    -- FIN:
    fin_single AS (
        SELECT
            customer_unique_id,
            pv_fin_date,
            ROW_NUMBER() OVER (
                PARTITION BY customer_unique_id
                ORDER BY pv_fin_date DESC
            ) AS rn
        FROM fin_permits_fin_schema
    ),
    -- PTO:
    pto_single AS (
        SELECT
            customer_unique_id,
            pto_granted,
            ROW_NUMBER() OVER (
                PARTITION BY customer_unique_id
                ORDER BY pto_granted DESC
            ) AS rn
        FROM pto_ic_schema
    )
    SELECT
        -- Customer Basic Information
        cust.unique_id,
        cust.customer_name,
        cust.dealer AS partner_dealer,
        cust.finance_company,
        cust.address AS street_address,
        cust.state,
        cust.email_address AS email,
        cust.phone_number,
        cust.primary_sales_rep AS rep_1,
        cust.secondary_sales_rep AS rep_2,
        cust.contracted_system_size AS system_size,
        cust.total_system_cost AS contract_amount,
        cust.sale_date AS created_date,
        cust.sale_date AS contract_date,

        -- NTP Dates
        ntp.ntp_complete_date,
        ntp.finance_type AS loan_type,

        -- Survey Dates
        survey.survey_final_completion_date,

        -- Permit Dates
        permit.pv_submitted AS permit_submit_date,
        permit.pv_approved AS permit_approval_date,

        -- Interconnection Dates
        ic.ic_submitted_date AS ic_submit_date,
        ic.ic_approved_date AS ic_approval_date,

        -- Additional Milestone Dates (from the customer record)
        cust.jeopardy_date,
        cust.cancel_date,

        -- Installation and Final Dates
        install.pv_completion_date AS pv_install_date,
        fin.pv_fin_date AS fin_complete_date,
        pto.pto_granted AS pto_date

    FROM filtered_customers AS cust
    LEFT JOIN ntp_single AS ntp
        ON cust.unique_id = ntp.unique_id
    AND ntp.rn = 1
    LEFT JOIN survey_single AS survey
        ON cust.unique_id = survey.customer_unique_id
    AND survey.rn = 1
    LEFT JOIN permit_single AS permit
        ON cust.unique_id = permit.customer_unique_id
    AND permit.rn = 1
    LEFT JOIN ic_single AS ic
        ON cust.unique_id = ic.customer_unique_id
    AND ic.rn = 1
    LEFT JOIN install_single AS install
        ON cust.unique_id = install.customer_unique_id
    AND install.rn = 1
    LEFT JOIN fin_single AS fin
        ON cust.unique_id = fin.customer_unique_id
    AND fin.rn = 1
    LEFT JOIN pto_single AS pto
        ON cust.unique_id = pto.customer_unique_id
    AND pto.rn = 1
    `, filterUserQuery)
	return PipelineDealerQuery
}

func PipelineTileDataBelowQuery(filterUserQuery, projectStatus, queueStatus, searchValue string) string {
	PipelineTileDataQuery := fmt.Sprintf(`
    WITH queue_customers AS (
        WITH time_intervals AS (
            SELECT
                --=====================
                -- Basic info
                --=====================
                distinct cust.record_id AS customer_record_id,
                cust.our        AS customer_unique_id,
                cust.sale_date  AS sale_date,
                cust.project_status AS customer_project_status,
                cust.customer_name AS home_owner,
                cust.dealer,
                cust.primary_sales_rep,
                cust.email_address AS customer_email,
                cust.phone_number AS customer_phone_number,
                cust.address,
                cust.state,
                cust.total_system_cost AS contract_total,
                cust.contracted_system_size AS system_size,

                --=====================
                -- NTP date
                --=====================
                ntp.ntp_complete_date AS ntp_complete_date,

                --=====================
                -- Two-Visit Survey fields
                --=====================
                survey.original_survey_scheduled_date AS site_survey_scheduled_date,
                survey.twond_visit_date       AS twond_visit_date,
                survey.twond_completion_date  AS twond_completion_date,

                CASE
                    WHEN (survey.reschedule_needed_on_date IS NOT NULL
                        AND survey.twond_visit_date IS NULL)
                        THEN NULL
                    WHEN survey.twond_visit_date IS NOT NULL
                        THEN survey.twond_completion_date
                  ELSE survey.survey_completion_date
                END AS survey_final_completion_date,

                --=====================
                -- CAD
                --=====================
                cad.item_created_on AS cad_ready,
                cad.plan_set_complete_day AS cad_complete_date,
                cad.active_inactive       AS cad_active_status,
                cad.plan_set_status,
                cad.plan_set_version AS cad_version,
                cad.project_status_new,

                --=====================
                -- Permit
                --=====================
                permit.pv_submitted     AS permit_submitted_date,
                permit.pv_approved        AS permit_approval_date,

                --=====================
                -- IC
                --=====================
                ic.ic_submitted_date,
                ic.ic_approved_date       AS ic_approval_date,

                --=====================
                -- Install
                --=====================
                install.created_on AS pv_install_created_date,
                install.pv_completion_date    AS install_completed_date,
                install.pv_install_day_window AS pv_install_day_window,

                --=====================
                -- FIN & PTO
                --=====================
                pto.submitted AS pto_submitted_date,
                pto.pto_granted   AS pto_granted_new,
                fin.approved_date AS fin_approved_date,
                fin.created_on AS fin_created_date,
                fin.pv_fin_date AS fin_pass_date,

                --=====================
                -- Roofing Request
                --=====================
                roofing.record_created_on AS roofing_created_date,
                roofing.work_completed_date AS roofing_completed_date,
                roofing.app_status AS roofing_status,
                roofing.no_roof_work_needed_date_h AS no_roof_work_needed,
                roofing.roof_work_needed_date as roof_work_needed

            FROM customers_customers_schema AS cust

            -- Original Joins
            LEFT JOIN ntp_ntp_schema AS ntp
                ON cust.our = ntp.unique_id
            LEFT JOIN survey_survey_schema AS survey
                ON cust.our = survey.customer_unique_id
            LEFT JOIN planset_cad_schema AS cad
                ON cust.our = cad.our_number
                AND cad.active_inactive = 'Active'
            LEFT JOIN permit_fin_pv_permits_schema AS permit
                ON cust.our = permit.customer_unique_id
            LEFT JOIN ic_ic_pto_schema AS ic
                ON cust.our = ic.customer_unique_id
            LEFT JOIN pv_install_install_subcontracting_schema AS install
                ON cust.our = install.customer_unique_id
            LEFT JOIN roofing_request_install_subcontracting_schema AS roofing
               ON cust.our = roofing.customer_unique_id

            -- New FIN & PTO Joins
            LEFT JOIN fin_permits_fin_schema AS fin
                ON cust.our = fin.customer_unique_id
            LEFT JOIN pto_ic_schema AS pto
                ON cust.our = pto.customer_unique_id


              WHERE
                cust.project_status IN (%v)
                AND %v
        ),

       all_queues AS (
            SELECT
                ti.*,
                'NTP Queue' AS queue_status
            FROM time_intervals ti
            WHERE ti.ntp_complete_date IS NULL

            UNION ALL

            SELECT
                ti.*,
                CASE
                    WHEN ti.survey_final_completion_date IS NULL
                        AND ti.cad_complete_date IS NULL
                        AND ti.permit_approval_date IS NULL
                        AND ti.ic_approval_date IS NULL
                        AND ti.install_completed_date IS NULL
                    THEN 'Survey Queue'

                    WHEN ti.cad_complete_date IS NULL
						and ti.plan_set_status NOT IN ('Plan Set Complete')
						and ti.cad_active_status IN ('Active')
						AND ti.project_status_new IN ('ACTIVE')
						AND ti.cad_version NOT IN ('ABCAD 1', 'ABCAD 2', 'ABCAD 3',
					'ABCAD 4','ABCAD 5', 'ABCAD 6', 'ABCAD 7',
					'ABCAD 8', 'ABCAD 9', 'ABCAD 10+')
                    THEN 'CAD Queue'

                    WHEN ti.permit_approval_date IS NULL
                        AND ti.cad_complete_date IS NOT NULL
                        AND ti.ic_approval_date IS NULL
                        AND ti.install_completed_date IS NULL
                    THEN 'Permit Queue'

                    WHEN ti.ic_approval_date IS NULL
                        AND ti.permit_approval_date IS NOT NULL
                        AND ti.install_completed_date IS NULL
                    THEN 'IC Queue'

                    WHEN ti.install_completed_date IS NULL
                        AND ti.permit_approval_date IS NOT NULL
                        AND ti.ic_approval_date IS NOT NULL
                        AND ti.pv_install_day_window IS NULL
                        AND ( ti.no_roof_work_needed IS NOT NULL
                        OR (ti.roof_work_needed IS NOT NULL AND ti.roofing_completed_date IS NOT NULL))
                    THEN 'Install (Scheduling) Queue'

                    WHEN ti.install_completed_date IS NULL
                        AND ti.permit_approval_date IS NOT NULL
                        AND ti.ic_approval_date IS NOT NULL
                        AND ti.pv_install_day_window IS NOT NULL
                    THEN 'Install (Pending) Queue'

                    WHEN ti.install_completed_date IS NOT NULL
                        AND ti.fin_approved_date IS NULL
                        AND ti.pto_granted_new IS NULL
                    THEN 'Inspections Queue'

                    WHEN ti.install_completed_date IS NOT NULL
                        AND ti.fin_approved_date IS NOT NULL
                        AND ti.pto_granted_new IS NULL
                    THEN 'Activation Queue'

                    WHEN ti.roofing_created_date IS NOT NULL
                        AND ti.roofing_completed_date IS NULL
                        AND ti.roof_work_needed IS NOT NULL
                    THEN 'Roofing Queue'

                    ELSE NULL
                END AS queue_status
            FROM time_intervals ti
        ),

        final_queues AS (
            SELECT
                aq.*,
                CASE
                    WHEN aq.queue_status = 'NTP Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.sale_date)
                    WHEN aq.queue_status = 'Survey Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.sale_date)
                    WHEN aq.queue_status = 'CAD Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.survey_final_completion_date)
                    WHEN aq.queue_status = 'Permit Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.cad_complete_date)
                    WHEN aq.queue_status = 'IC Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.permit_approval_date)
                    WHEN aq.queue_status IN ('Install (Scheduling) Queue', 'Install (Pending) Queue')
                    THEN DATE_PART('day', CURRENT_DATE - GREATEST(aq.permit_approval_date, aq.ic_approval_date))
                    WHEN aq.queue_status = 'Inspections Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.install_completed_date)
                    WHEN aq.queue_status = 'Activation Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.fin_approved_date)
                    WHEN aq.queue_status = 'Roofing Queue'
                    THEN DATE_PART('day', CURRENT_DATE - aq.roofing_completed_date)
                    ELSE NULL
                END AS queue_days
            FROM all_queues aq
        )
        SELECT *
        FROM final_queues
        WHERE queue_status IS NOT NULL
        %v
    ),
    electrical_services AS (
        SELECT
            c.unique_id AS customer_unique_id,
            b.battery_installation_date AS battery_scheduled_date,
            b.completion_date AS battery_complete_date
        FROM customers_customers_schema c
        LEFT JOIN batteries_service_electrical_schema b ON c.unique_id = b.customer_unique_id
        WHERE EXISTS (
            SELECT 1
            FROM queue_customers qc
            WHERE qc.customer_unique_id = c.unique_id
        )
    )
    SELECT
        DISTINCT ON(q.customer_unique_id)
        *
        FROM queue_customers q
        LEFT JOIN electrical_services e ON e.customer_unique_id = q.customer_unique_id %v;
 `, projectStatus, filterUserQuery, searchValue, queueStatus)
	return PipelineTileDataQuery
}

func PipelineNTPQuery(uniqueIds []string) string {
	PipelineNTPQuery := `
        WITH base_query AS (
            SELECT
                customers_customers_schema.unique_id,
                customers_customers_schema.current_live_cad,
                customers_customers_schema.system_sold_er,
                customers_customers_schema.podio_link,
                ntp_ntp_schema.production_discrepancy,
                ntp_ntp_schema.finance_ntp_of_project,
                ntp_ntp_schema.utility_bill_uploaded,
                ntp_ntp_schema.powerclerk_signatures_complete,
                ntp_ntp_schema.change_order_status,
                customers_customers_schema.utility_company,
                customers_customers_schema.state,
                ntp_ntp_schema.ntp_complete_date,
                split_part(ntp_ntp_schema.prospectid_dealerid_salesrepid, ',', 1) AS first_value
            FROM
                customers_customers_schema
            LEFT JOIN ntp_ntp_schema
                ON customers_customers_schema.unique_id = ntp_ntp_schema.unique_id
            WHERE
                customers_customers_schema.unique_id = ANY(ARRAY['` + strings.Join(uniqueIds, "','") + `'])
        )
        SELECT
            b.*,
            CASE
                WHEN b.utility_company = 'APS' THEN prospects_customers_schema.powerclerk_sent_az
                ELSE 'Not Needed'
            END AS powerclerk_sent_az,
            CASE
                WHEN prospects_customers_schema.payment_method = 'Cash' THEN prospects_customers_schema.ach_waiver_sent_and_signed_cash_only
                ELSE 'Not Needed'
            END AS ach_waiver_sent_and_signed_cash_only,
            CASE
                WHEN b.state = 'NM :: New Mexico' THEN prospects_customers_schema.green_area_nm_only
                ELSE 'Not Needed'
            END AS green_area_nm_only,
            CASE
                WHEN prospects_customers_schema.payment_method IN ('Lease', 'Loan') THEN prospects_customers_schema.finance_credit_approved_loan_or_lease
                ELSE 'Not Needed'
            END AS finance_credit_approved_loan_or_lease,
            CASE
                WHEN prospects_customers_schema.payment_method IN ('Lease', 'Loan') THEN prospects_customers_schema.finance_agreement_completed_loan_or_lease
                ELSE 'Not Needed'
            END AS finance_agreement_completed_loan_or_lease,
            CASE
                WHEN prospects_customers_schema.payment_method IN ('Cash', 'Loan') THEN prospects_customers_schema.owe_documents_completed
                ELSE 'Not Needed'
            END AS owe_documents_completed
        FROM
            base_query b
        LEFT JOIN
            prospects_customers_schema ON b.first_value::text = prospects_customers_schema.prospect_id::text;
    `
	return PipelineNTPQuery
}

// LeaderBoardSaleCancelData fetches sale and cancel counts from customers_customers_schema
func LeaderBoardSaleCancelData(dateRange, dealers, groupBy, chosen string) (string, string) {
	var groupByFields, selectFields, additionalCondition string

	fields := strings.Split(strings.TrimSpace(groupBy), ",")
	selectFields = strings.TrimSpace(fields[0]) + " AS name"

	if len(fields) > 1 {
		selectFields += ", " + strings.Join(fields[1:], ",")
	}
	groupByFields = groupBy

	if strings.Contains(groupBy, "primary_sales_rep") {
		additionalCondition = "AND primary_sales_rep != ''"
	}

	var query string
	if chosen == "count" {
		query = fmt.Sprintf(`
		WITH distinct_sales AS (
		SELECT
			cs.unique_id, cs.sale_date, cs.cancel_date, cs.primary_sales_rep,cs.dealer,
			cs.setter, cs.state,
			split_part(srs.team_region_untd, '/'::text, 1) AS team,
			split_part(srs.team_region_untd, '/'::text, 2) AS region
		FROM customers_customers_schema cs
        LEFT JOIN ntp_ntp_schema ns
			ON ns.unique_id = cs.unique_id
            AND ns.project_status NOT ILIKE '%%DUPLICATE%%'  AND ns.app_status NOT ILIKE '%%DUPLICATE%%'
		LEFT JOIN sales_rep_dbhub_schema srs
			ON SPLIT_PART(ns.prospectid_dealerid_salesrepid, ',', 3) = srs.record_id::text
		WHERE cs.project_status NOT ILIKE '%%DUPLICATE%%'
			AND cs.unique_id != ''
			AND %v
		)
		SELECT
			%v,
			COUNT(CASE WHEN sale_date %v THEN 1 END) AS sale,
			COUNT(CASE WHEN cancel_date %v THEN 1 END) AS cancel
		FROM distinct_sales
		WHERE 1=1
		%v
		GROUP BY %v;`, "cs."+dealers, selectFields, dateRange, dateRange, additionalCondition, groupByFields)
	} else {
		query = fmt.Sprintf(`
		WITH distinct_sales AS (
		SELECT
			cs.unique_id, cs.sale_date, cs.cancel_date, cs.primary_sales_rep,cs.dealer,
			cs.setter, cs.state, scs.contracted_system_size_parent,
			split_part(srs.team_region_untd, '/'::text, 1) AS team,
			split_part(srs.team_region_untd, '/'::text, 2) AS region
		FROM customers_customers_schema cs
		LEFT JOIN ntp_ntp_schema ns
			ON ns.unique_id = cs.unique_id
            AND ns.project_status NOT ILIKE '%%DUPLICATE%%'  AND ns.app_status NOT ILIKE '%%DUPLICATE%%'
		LEFT JOIN sales_rep_dbhub_schema srs
			ON SPLIT_PART(ns.prospectid_dealerid_salesrepid, ',', 3) = srs.record_id::text
		LEFT JOIN system_customers_schema scs
			ON scs.customer_id = cs.unique_id
			AND scs.project_status NOT ILIKE '%%DUPLICATE%%'
		WHERE cs.project_status NOT ILIKE '%%DUPLICATE%%'
			AND cs.unique_id != ''
			AND %v
		)
		SELECT
			%v,
			SUM(CASE WHEN sale_date %v THEN contracted_system_size_parent ELSE 0 END) AS sale,
			SUM(CASE WHEN cancel_date %v THEN contracted_system_size_parent ELSE 0 END) AS cancel
		FROM distinct_sales
		WHERE 1=1
		%v
		GROUP BY %v;`, "cs."+dealers, selectFields, dateRange, dateRange, additionalCondition, groupByFields)
	}

	return query, "sale"
}

// LeaderBoardInstallBatteryData fetches install counts and battery sums from pv_install_install_subcontracting_schema
func LeaderBoardInstallBatteryData(dateRange, dealers, groupBy, chosen string) (string, string) {
	var groupByFields, additionalCondition string
	var selectFields string

	fields := strings.Split(strings.TrimSpace(groupBy), ",")
	selectFields = strings.TrimSpace(fields[0]) + " AS name"

	if len(fields) > 1 {
		selectFields += ", " + strings.Join(fields[1:], ",")
	}
	groupByFields = groupBy

	if strings.Contains(groupBy, "primary_sales_rep") {
		additionalCondition = "AND primary_sales_rep != ''"
	}

	var query string
	if chosen == "count" {
		query = fmt.Sprintf(`
		WITH distinct_installs AS (
		SELECT
			pis.customer_unique_id, pis.pv_completion_date,
			ns.battery_count, cs.primary_sales_rep, pis.state,cs.setter,pis.dealer,
			split_part(srs.team_region_untd, '/'::text, 1) AS team,
			split_part(srs.team_region_untd, '/'::text, 2) AS region
		FROM pv_install_install_subcontracting_schema pis
		LEFT JOIN ntp_ntp_schema ns
			ON ns.unique_id = pis.customer_unique_id
            AND ns.project_status NOT ILIKE '%%DUPLICATE%%'  AND ns.app_status NOT ILIKE '%%DUPLICATE%%'
		LEFT JOIN customers_customers_schema cs
			ON cs.unique_id = pis.customer_unique_id
            AND cs.project_status NOT ILIKE '%%DUPLICATE%%'
		LEFT JOIN sales_rep_dbhub_schema srs
			ON SPLIT_PART(ns.prospectid_dealerid_salesrepid, ',', 3) = srs.record_id::text
		WHERE pis.project_status NOT ILIKE '%%DUPLICATE%%'
			AND pis.app_status NOT ILIKE '%%DUPLICATE%%'
			AND pis.customer_unique_id != ''
			AND %v
		)
		SELECT
			%v,
			COUNT(CASE WHEN pv_completion_date %v THEN 1 END) AS install,
			SUM(CASE WHEN pv_completion_date %v THEN battery_count ELSE 0 END) AS battery
		FROM distinct_installs
		WHERE 1=1
		%v
		GROUP BY %v;`, "pis."+dealers, selectFields, dateRange, dateRange, additionalCondition, groupByFields)
	} else {
		query = fmt.Sprintf(`
		WITH distinct_installs AS (
		SELECT
			pis.customer_unique_id, pis.pv_completion_date,
			ns.battery_count, cs.primary_sales_rep, pis.state,cs.setter,
			split_part(srs.team_region_untd, '/'::text, 1) AS team,
			split_part(srs.team_region_untd, '/'::text, 2) AS region,pis.dealer,
			scs.contracted_system_size_parent
		FROM pv_install_install_subcontracting_schema pis
		LEFT JOIN ntp_ntp_schema ns
			ON ns.unique_id = pis.customer_unique_id
            AND ns.project_status NOT ILIKE '%%DUPLICATE%%'  AND ns.app_status NOT ILIKE '%%DUPLICATE%%'
		LEFT JOIN customers_customers_schema cs
			ON cs.unique_id = pis.customer_unique_id
            AND cs.project_status NOT ILIKE '%%DUPLICATE%%'
		LEFT JOIN sales_rep_dbhub_schema srs
			ON SPLIT_PART(ns.prospectid_dealerid_salesrepid, ',', 3) = srs.record_id::text
        LEFT JOIN system_customers_schema scs
            ON scs.customer_id = pis.customer_unique_id
            AND scs.project_status NOT ILIKE '%%DUPLICATE%%'
		WHERE pis.project_status NOT ILIKE '%%DUPLICATE%%'
			AND pis.app_status NOT ILIKE '%%DUPLICATE%%'
			AND pis.customer_unique_id != ''
			AND %v
		)
		SELECT
			%v,
			SUM(CASE WHEN pv_completion_date %v THEN contracted_system_size_parent ELSE 0 END) AS install
		FROM distinct_installs
		WHERE 1=1
		%v
		GROUP BY %v;`, "pis."+dealers, selectFields, dateRange, additionalCondition, groupByFields)
	}

	return query, "install"
}

// LeaderBoardNTPData fetches NTP counts from ntp_ntp_schema.
func LeaderBoardNTPData(dateRange, dealers, groupBy, chosen string) (string, string) {
	var groupByFields, additionalCondition, selectFields string

	// Default case when SPLIT_PART is not present
	fields := strings.Split(strings.TrimSpace(groupBy), ",")
	selectFields = strings.TrimSpace(fields[0]) + " AS name"

	if len(fields) > 1 {
		selectFields += ", " + strings.Join(fields[1:], ",")
	}
	groupByFields = groupBy

	if strings.Contains(groupBy, "primary_sales_rep") {
		additionalCondition = "AND primary_sales_rep != ''"
	}

	var query string
	if chosen == "count" {
		query = fmt.Sprintf(`
		WITH distinct_ntp AS (
    SELECT
        ns.unique_id,
        ns.dealer,
        ns.ntp_complete_date,
        cs.primary_sales_rep,
        cs.setter,
        ns.state,
        split_part(srs.team_region_untd, '/'::text, 1) AS team,
        split_part(srs.team_region_untd, '/'::text, 2) AS region
    FROM ntp_ntp_schema ns
    LEFT JOIN customers_customers_schema cs
        ON cs.unique_id = ns.unique_id
        AND cs.project_status NOT ILIKE '%%DUPLICATE%%'
    LEFT JOIN sales_rep_dbhub_schema srs
        ON SPLIT_PART(ns.prospectid_dealerid_salesrepid, ',', 3) = srs.record_id::text
    WHERE ns.project_status NOT ILIKE '%%DUPLICATE%%'
        AND ns.app_status NOT ILIKE '%%DUPLICATE%%'
        AND ns.unique_id != ''
        AND %v
)
SELECT
    %v,
    COUNT(CASE
        WHEN ntp_complete_date %v
        THEN 1
    END) AS ntp
FROM distinct_ntp
WHERE 1=1
%v
GROUP BY %v
	`, "ns."+dealers, selectFields, dateRange, additionalCondition, groupByFields)
	} else {
		query = fmt.Sprintf(`
		WITH distinct_ntp AS (
    SELECT
        ns.unique_id,
        ns.dealer,
        ns.ntp_complete_date,
        cs.primary_sales_rep,
        cs.setter,
        ns.state,
        split_part(srs.team_region_untd, '/'::text, 1) AS team,
        split_part(srs.team_region_untd, '/'::text, 2) AS region,
        ns.contracted_system_size_ntp_new
    FROM ntp_ntp_schema ns
    LEFT JOIN customers_customers_schema cs
        ON cs.unique_id = ns.unique_id
        AND cs.project_status NOT ILIKE '%%DUPLICATE%%'
    LEFT JOIN sales_rep_dbhub_schema srs
        ON SPLIT_PART(ns.prospectid_dealerid_salesrepid, ',', 3) = srs.record_id::text
    LEFT JOIN system_customers_schema scs
        ON scs.customer_id = ns.unique_id
        AND scs.project_status NOT ILIKE '%%DUPLICATE%%'
    WHERE ns.project_status NOT ILIKE '%%DUPLICATE%%'
        AND ns.app_status NOT ILIKE '%%DUPLICATE%%'
        AND ns.unique_id != ''
        AND %v
)
SELECT
    %v,
    SUM(CASE
        WHEN ntp_complete_date %v
        THEN contracted_system_size_ntp_new ELSE 0 END) AS ntp
FROM distinct_ntp
WHERE 1=1
%v
GROUP BY %v
	`, "ns."+dealers, selectFields, dateRange, additionalCondition, groupByFields)
	}

	return query, "ntp"
}
func addCADStatus(projectStatus string) string {
	if projectStatus == "'ACTIVE'" {
		return fmt.Sprintf(`'PTO''D (Service)', 'PTO''d (Audit)', 'PTO''d', %s`, projectStatus)
	}
	return fmt.Sprintf("'HOLD - CO Needed', 'HOLD - Exceptions', %s", projectStatus)
}

func addSurveyStatus(reqStatus string) string {
	if reqStatus == "'ACTIVE'" {
		return reqStatus
	}
	return fmt.Sprintf("'HOLD - CO Needed', 'HOLD - Exceptions', %s", reqStatus)
}

func addPermitStatus(projectStatus string) string {
	if projectStatus != "'ACTIVE'" {
		return fmt.Sprintf("'HOLD - CO Needed', 'HOLD - Exceptions', %s", projectStatus)
	}
	return projectStatus
}

func addRoofingStatus(projectStatus string) string {
	if projectStatus != "'ACTIVE'" {
		return fmt.Sprintf("'HOLD - CO Needed', 'HOLD - Exceptions', %s", projectStatus)
	}
	return projectStatus
}

func addInstallStatus(projectStatus string) string {
	if projectStatus == "'ACTIVE'" {
		return "IN ('ACTIVE')"
	}
	return "NOT IN ('ACTIVE', 'CANCEL', 'DUPLICATE', 'HOLD - CO Needed')"
}

// addInspectionStatus or fin
func addInspectionStatus(projectStatus string) string {
	if projectStatus != "'ACTIVE'" {
		return fmt.Sprintf(`NOT IN ('ACTIVE', 'PTO''d (Service)', 'PTO''d (Audit)', 'PTO''d', 'UNRESPONSIVE', 'CANCEL', 'DUPLICATE', 'ARM', 'LEGAL - Customer has an attorney involved', %s)`, projectStatus)
	}
	return "IN ('ACTIVE')"
}

func addActivationStatus(projectStatus string) string {
	if projectStatus != "'ACTIVE'" {
		return `NOT IN ('ACTIVE', 'PTO''d (Service)', 'PTO''d (Audit)', 'PTO''d',
			'UNRESPONSIVE', 'CANCEL', 'DUPLICATE', 'ARM', 'LEGAL - Customer has an attorney involved')`
	}
	return "IN ('ACTIVE')"
}
