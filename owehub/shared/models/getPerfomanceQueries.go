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

// func SalesMetricsRetrieveQueryFunc() string {
// 	SalesMetricsRetrieveQuery := `
//         SELECT sm.home_owner, sm.unique_id, sm.contract_date, sm.permit_approved_date,
//             sm.pv_install_completed_date, sm.pto_date, fs.site_survey_completed_date,
//             fs.install_ready_date, sm.dealer, sm.primary_sales_rep
//         FROM sales_metrics_schema sm
//         JOIN field_ops_metrics_schema fs ON sm.unique_id = fs.unique_id
//     `
// 	return SalesMetricsRetrieveQuery
// }

// func SalesMetricsRetrieveQueryFunc() string {
// 	SalesMetricsRetrieveQuery := `
//         SELECT
//             intOpsMetSchema.home_owner,
//             intOpsMetSchema.unique_id,
//             intOpsMetSchema.site_survey_scheduled_date,
//             intOpsMetSchema.site_survey_completed_date,
//             intOpsMetSchema.cad_ready,
//             intOpsMetSchema.cad_complete_date,
//             intOpsMetSchema.permit_submitted_date,
//             intOpsMetSchema.ic_submitted_date,
//             intOpsMetSchema.permit_approved_date,
//             intOpsMetSchema.ic_approved_date,
//             fieldOpsSchema.roofing_created_date,
//             fieldOpsSchema.roofing_completed_date,
//             intOpsMetSchema.pv_install_created_date,
//             fieldOpsSchema.battery_scheduled_date,
//             fieldOpsSchema.battery_complete_date,
//             intOpsMetSchema.pv_install_completed_date,
//             fieldOpsSchema.mpu_created_date,
//             fieldOpsSchema.derate_created_date,
//             secondFieldOpsSchema.trenching_ws_open,
//             fieldOpsSchema.derate_completed_date,
//             fieldOpsSchema.mpu_complete_date,
//             secondFieldOpsSchema.trenching_completed,
//             fieldOpsSchema.fin_created_date,
//             fieldOpsSchema.fin_pass_date,
//             intOpsMetSchema.pto_submitted_date,
//             intOpsMetSchema.pto_date,
//             salMetSchema.contract_date,
//             salMetSchema.dealer,
//             salMetSchema.primary_sales_rep,
//             salMetSchema.ntp_date,
//             secondFieldOpsSchema.roofing_status

//         FROM
//             internal_ops_metrics_schema AS intOpsMetSchema
//         LEFT JOIN sales_metrics_schema AS salMetSchema
//             ON intOpsMetSchema.unique_id = salMetSchema.unique_id
//         LEFT JOIN field_ops_metrics_schema AS fieldOpsSchema
//             ON intOpsMetSchema.unique_id = fieldOpsSchema.unique_id
//         LEFT JOIN second_field_ops_metrics_schema AS secondFieldOpsSchema
//             ON intOpsMetSchema.unique_id = secondFieldOpsSchema.unique_id
//     `
// 	return SalesMetricsRetrieveQuery
// }

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
        FROM customers_customers_schema
        LEFT JOIN system_customers_schema 
            ON customers_customers_schema.unique_id = system_customers_schema.customer_id `
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

func ProjectMngmntRetrieveQueryFunc() string {

	ProjectMngmntRetrieveQuery := `
        SELECT 
        customers_customers_schema.unique_id, 
        customers_customers_schema.sale_date AS contract_date,
        ntp_ntp_schema.pending_ntp_date AS ntp_working_date, 
        ntp_ntp_schema.ntp_complete_date AS ntp_date, 
        survey_survey_schema.original_survey_scheduled_date AS site_survey_scheduled_date, 
        survey_survey_schema.survey_completion_date AS site_survey_completed_date, 
        roofing_request_install_subcontracting_schema.work_scheduled_date AS roofing_scheduled_date, 
        roofing_request_install_subcontracting_schema.record_created_on AS roofing_created_date,
        roofing_request_install_subcontracting_schema.work_completed_date AS roofing_completed_date, 
        electrical_permits_permit_fin_schema.created_on AS electrical_permit_created_date, 
        pv_install_install_subcontracting_schema.created_on AS pv_install_created_date, 
        pv_install_install_subcontracting_schema.time_stamp_scheduled AS pv_install_scheduled_date,
        pv_install_install_subcontracting_schema.pv_completion_date AS pv_install_completed_date, 
        ic_ic_pto_schema.created_on AS ic_created_date, 
        ic_ic_pto_schema.ic_submitted_date, 
        ic_ic_pto_schema.ic_approved_date, 
        customers_customers_schema.credit_expiration_date_field AS credit_expiration_date, 
        permit_fin_pv_permits_schema.created_on AS permit_created,
        permit_fin_pv_permits_schema.pv_submitted AS permit_submitted_date, 
        permit_fin_pv_permits_schema.pv_approved AS permit_approved_date, 
        fin_permits_fin_schema.pv_fin_date AS fin_scheduled_date, 
        fin_permits_fin_schema.approved_date AS fin_pass_date, 
        pto_ic_schema.pto_created_on AS pto_created_date, 
        pto_ic_schema.submitted AS pto_submitted_date,
        pto_ic_schema.pto_granted AS pto_date, 
        system_customers_schema.contracted_system_size_parent AS system_size, 
        ntp_ntp_schema.ahj, 
        customers_customers_schema.project_status, 
        customers_customers_schema.state, 
        CASE
        WHEN ((system_customers_schema.contracted_system_size_parent IS NULL) 
            OR (system_customers_schema.contracted_system_size_parent <= (0)::double precision)) THEN (0)::double precision
        WHEN customers_customers_schema.total_system_cost_calc_h ~ '^[0-9]+(\.[0-9]+)?$' THEN 
            (customers_customers_schema.total_system_cost_calc_h::double precision / 
            (system_customers_schema.contracted_system_size_parent * (1000)::double precision))
        ELSE 0
        END AS epc,
        customers_customers_schema.total_system_cost AS contract_total, 
        ntp_ntp_schema.finance AS finance_company, 
        ntp_ntp_schema.net_epc,
        mpu_service_electrical_schema.mpu_created_on AS mpu_created_date, 
        mpu_service_electrical_schema.pk_or_cutover_date AS mpu_scheduled_date, 
        mpu_service_electrical_schema.pk_or_cutover_date_of_completion AS mpu_complete_date,
        derates_service_electrical_schema.derate_created_on AS derate_created_date, 
        derates_service_electrical_schema.scheduled_date AS derate_scheduled_date, 
        derates_service_electrical_schema.completion_date AS derate_completed_date,
        trenching_service_electrical_schema.trenching_created_on AS trenching_ws_open, 
        trenching_service_electrical_schema.work_scheduled_date AS trenching_scheduled, 
        trenching_service_electrical_schema.completion_date AS trenching_completed,
        customers_customers_schema.adder_breakdown_and_total_new AS adder_breakdown_and_total, 
        sales_metrics_schema.adders_total,
        planset_cad_schema.item_created_on AS cad_ready,
        planset_cad_schema.plan_set_complete_day AS cad_complete_date,
        batteries_service_electrical_schema.battery_installation_date AS battery_scheduled_date,
        batteries_service_electrical_schema.completion_date AS battery_complete_date,
        fin_permits_fin_schema.created_on AS fin_created_date,
        customers_customers_schema.customer_name AS home_owner
        FROM customers_customers_schema
        LEFT JOIN ntp_ntp_schema 
        ON ntp_ntp_schema.unique_id = customers_customers_schema.unique_id
        LEFT JOIN survey_survey_schema
        ON survey_survey_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN roofing_request_install_subcontracting_schema
        ON roofing_request_install_subcontracting_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN electrical_permits_permit_fin_schema
        ON electrical_permits_permit_fin_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN pv_install_install_subcontracting_schema
        ON pv_install_install_subcontracting_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN ic_ic_pto_schema 
        ON ic_ic_pto_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN permit_fin_pv_permits_schema 
        ON permit_fin_pv_permits_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN fin_permits_fin_schema
        ON fin_permits_fin_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN pto_ic_schema 
        ON pto_ic_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN system_customers_schema
        ON system_customers_schema.customer_id = customers_customers_schema.unique_id
        LEFT JOIN mpu_service_electrical_schema
        ON mpu_service_electrical_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN derates_service_electrical_schema
        ON derates_service_electrical_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN trenching_service_electrical_schema
        ON trenching_service_electrical_schema.customer_unique_id = customers_customers_schema.unique_id
        --LEFT JOIN planset_cad_schema
        --ON planset_cad_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN batteries_service_electrical_schema
        ON batteries_service_electrical_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN sales_metrics_schema
            ON sales_metrics_schema.unique_id = customers_customers_schema.unique_id
        LEFT JOIN planset_cad_schema 
           ON planset_cad_schema.our_number = customers_customers_schema.unique_id
        `
	return ProjectMngmntRetrieveQuery
}

// pv_install_created_date AS pv_install_created_date_2,
// electrical_submitted_date,active_date,        prospect, removed from prjectmnmnt query
//         electrical_approved_date,

// func QcNtpRetrieveQueryFunc() string {
// 	var filtersBuilder strings.Builder
// 	filtersBuilder.WriteString(`
//         SELECT
//             ips.unique_id,
//             n.production_discrepancy,
//             n.finance_ntp_of_project,
//             n.utility_bill_uploaded,
//             n.powerclerk_signatures_complete,
//             n.change_order_status,
//             split_part(ss.prospectid_dealerid_salesrepid, ',', 1) AS first_value,
//             ips.utility_company,
//             ss.state,
//             ips.home_owner,
//             ss.ntp_date,
//             CASE
//                 WHEN ips.utility_company = 'APS' THEN p.powerclerk_sent_az
//                 ELSE 'Not Needed'
//             END AS powerclerk_sent_az,
//             CASE
//                 WHEN p.payment_method = 'Cash' THEN p.ach_waiver_sent_and_signed_cash_only
//                 ELSE 'Not Needed'
//             END AS ach_waiver_sent_and_signed_cash_only,
//             CASE
//                 WHEN ss.state = 'NM :: New Mexico' THEN p.green_area_nm_only
//                 ELSE 'Not Needed'
//             END AS green_area_nm_only,
//             CASE
//                 WHEN p.payment_method = 'Lease' OR p.payment_method = 'Loan' THEN p.finance_credit_approved_loan_or_lease
//                 ELSE 'Not Needed'
//             END AS finance_credit_approved_loan_or_lease,
//             CASE
//                 WHEN p.payment_method = 'Lease' OR p.payment_method = 'Loan' THEN p.finance_agreement_completed_loan_or_lease
//                 ELSE 'Not Needed'
//             END AS finance_agreement_completed_loan_or_lease,
//             CASE
//                 WHEN p.payment_method = 'Cash' OR p.payment_method = 'Loan' THEN p.owe_documents_completed
//                 ELSE 'Not Needed'
//             END AS owe_documents_completed
//         FROM internal_ops_metrics_schema ips
//         LEFT JOIN sales_metrics_schema ss
//             ON ips.unique_id = ss.unique_id
//         LEFT JOIN ntp_ntp_schema n
//             ON ips.unique_id = n.unique_id
//         LEFT JOIN prospects_customers_schema p
//             ON split_part(ss.prospectid_dealerid_salesrepid, ',', 1) = p.item_id::text
//     `)

// 	return filtersBuilder.String()
// }

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
        LEFT JOIN system_customers_schema  
            ON customers_customers_schema.unique_id = system_customers_schema.customer_id
        LEFT JOIN prospects_customers_schema 
        ON split_part(ntp_ntp_schema.prospectid_dealerid_salesrepid, ',', 1) = prospects_customers_schema.item_id::text
        AND ntp_ntp_schema.prospectid_dealerid_salesrepid IS NOT NULL
        AND ntp_ntp_schema.prospectid_dealerid_salesrepid <> ''
        AND TRIM(ntp_ntp_schema.prospectid_dealerid_salesrepid) <> ','
    `)

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
                                LEFT JOIN sales_metrics_schema ss ON ss.unique_id = cs.unique_id 
								LEFT JOIN system_customers_schema scs ON scs.customer_id = cs.unique_id
                                LEFT JOIN pto_ic_schema ps ON ps.customer_unique_id = cs.unique_id 
        `)

	return filtersBuilder.String()
}

func PipelineTileDataAboveQuery(filterUserQuery string) string {
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
                WHEN survey.twond_visit_date IS NOT NULL 
                    THEN survey.twond_completion_date
                ELSE survey.survey_completion_date
                END AS survey_final_completion_date,

                --=====================
                -- CAD
                --=====================
                cad.plan_set_complete_day AS cad_complete_date,
                cad.active_inactive       AS cad_active_status,

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
                roofing.app_status AS roofing_status

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
                        AND ti.survey_final_completion_date IS NOT NULL
                        AND ti.permit_approval_date IS NULL
                        AND ti.ic_approval_date IS NULL
                        AND ti.install_complete_date IS NULL
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
                        AND ti.roofing_status NOT IN (
                            'Customer Managed-COMPLETE', 'COMPLETE', 
                            'No Roof work required for Solar', 
                            'No Roof work required for Solar,CANCEL', 
                            'No Roof work required for Solar,COMPLETE', 
                            'No Roof work required for Solar,COMPLETE,COMPLETE', 
                            'No Roof work required for Solar,COMPLETE,COMPLETE,COMPLETE', 
                            'No Roof work required for Solar,Customer Managed-COMPLETE', 
                            'No Roof work required for Solar,Customer Managed', 
                            'No Roof work required for Solar,COMPLETE,No Roof work required for Solar', 
                            'No Roof work required for Solar,No Roof work required for Solar'
                        )
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
 `, filterUserQuery)
	return PipelineTileDataQuery
}
