package models

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
        SELECT home_owner, unique_id, contract_date, permit_approved_date, 
            pv_install_completed_date, pto_date, site_survey_completed_date, 
            install_ready_date, dealer, primary_sales_rep
        FROM consolidated_data_view
    `
	return SalesMetricsRetrieveQuery
}

func SalesRetrieveQueryFunc() string {
	SalesMetricsRetrieveQuery := `
        SELECT unique_id, home_owner
        FROM consolidated_data_view
    `
	return SalesMetricsRetrieveQuery
}

func AdminDlrSaleRepRetrieveQueryFunc() string {
	AdminDlrSaleRepRetrieveQuery := `
    SELECT ud.name AS name,
        ur.role_name AS role_name,
        d.name AS dealer_name
    FROM user_details ud
    JOIN user_roles ur ON ud.role_id = ur.role_id
    LEFT JOIN user_details d ON ud.dealer_owner = d.user_id
    WHERE ud.email_id = $1;
    `
	return AdminDlrSaleRepRetrieveQuery
}

func ProjectMngmntRetrieveQueryFunc() string {
	ProjectMngmntRetrieveQuery := `
        SELECT unique_id, contract_date, ntp_working_date, 
        ntp_date, site_survey_scheduled_date, site_survey_rescheduled_date, 
        site_survey_completed_date, roofing_scheduled_date, roofing_created_date,
        roofing_completed_date, electrical_permit_created_date, electrical_submitted_date, 
        electrical_approved_date, pv_install_created_date, pv_install_scheduled_date,
        pv_install_completed_date, ic_created_date, ic_submitted_date, 
        ic_approved_date, credit_expiration_date, permit_created,
        permit_submitted_date, permit_approved_date, fin_scheduled_date, 
        fin_pass_date, pto_created_date, pto_submitted_date,
        pto_date, system_size, prospect,
        ahj, project_status, state, epc,
        contract_total, finance_company, net_epc,
        pv_install_created_date AS pv_install_created_date_2,
        mpu_created_date, mpu_scheduled_date, mpu_complete_date,
        derate_created_date, derate_scheduled_date, derate_completed_date
        FROM consolidated_data_view
    `
	return ProjectMngmntRetrieveQuery
}
