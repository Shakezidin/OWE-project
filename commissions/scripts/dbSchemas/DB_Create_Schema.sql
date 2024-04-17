
drop database IF EXISTS owe_db WITH (FORCE);

/* create databases */
create database owe_db;

\c owe_db;

/**************************** OWE DB Schema ***********************************************************/
CREATE TABLE
    IF NOT EXISTS webhook_info (
        hook_id text unique not null,
        hook_type text,
        appid text,
        app_name text
    );

/* Test App Start */
CREATE TABLE
    IF NOT EXISTS owe_test_app_schema (
        item_id  bigint,
        id text,
        name text,
        phone text,
        email text
    );

/* Test App End */
CREATE TABLE
    IF NOT EXISTS internal_ops_metrics_schema (
        item_id  bigint unique,
        unique_id varchar,
        customer text,
        prospect text,
        installer text,
        project_status text,
        puma_cat text,
        puma_cat_supervisor text,
        customer_last_contacted timestamp,
        source text,
        loan_type varchar,
        home_owner text,
        office text,
        system_size float,
        created_on timestamp,
        contract_date timestamp,
        prospect_working_date timestamp,
        hours_to_welcome_call text,
        ntp_working_date timestamp,
        ntp_date timestamp,
        credit_expiration_date timestamp,
        first_5_days_date timestamp,
        site_survey_scheduled_date timestamp,
        site_survey_rescheduled_date timestamp,
        site_survey_completed_date timestamp,
        cad_rejection_date timestamp,
        peee_rejection_date timestamp,
        cad_requested_date timestamp,
        cad_designer text,
        cad_ready timestamp,
        cad_complete_date timestamp,
        electrical_review_completion_date timestamp,
        cad_redline timestamp,
        cad_revision_requested_date timestamp,
        cad_revisions_completed timestamp,
        abcad_ready timestamp,
        abcad_completed timestamp,
        abcad_revised timestamp,
        abcad_revisions_completed timestamp,
        cad_review_date timestamp,
        cad_reviewer text,
        permit_redlined timestamp,
        peee_submitted_date timestamp,
        ab_permit_redlined timestamp,
        peee_complete_date timestamp,
        peee_redline_date timestamp,
        stamp_provider text,
        ahj text,
        solar_app_submission text,
        permit_created timestamp,
        permit_submitted_date timestamp,
        permit_expected_approval_date timestamp,
        permitting_specialist text,
        permit_re_submitted_date timestamp,
        permit_approved_date timestamp,
        fire_permit_created_date timestamp,
        fire_permit_submitted_date timestamp,
        fire_permit_approved_date timestamp,
        battery_permit_created_date timestamp,
        battery_permit_submitted_date timestamp,
        battery_permit_approved_date timestamp,
        electrical_permit_created_date timestamp,
        electrical_permit_submitted_date timestamp,
        electrical_permit_approved_date timestamp,
        pv_redlined_date timestamp,
        permit_turnaround_time text,
        ic_created_date timestamp,
        ic_submitted_date timestamp,
        ic_expected_approval_date timestamp,
        utility_specialist text,
        utility_company text,
        ic_re_submitted_date timestamp,
        ic_approved_date timestamp,
        ic_rejection_date timestamp,
        canceled_date timestamp,
        pv_install_created_date timestamp,
        pv_install_completed_date timestamp,
        electrical_submitted_date timestamp,
        electrical_approved_date timestamp,
        pto_created_date timestamp,
        pto_submitted_date timestamp,
        pto_resubmitted_date timestamp,
        pto_fail_date timestamp,
        pto_date timestamp,
        inverter_part_number text,
        module text,
        re_sync_slas text,
        within_sla text,
        outside_sla_current text,
        outside_sla_past text,
        metrics_last_updated text,
        adders_added_post_cad_r text,
        daily_sla_last_checked text,
        google_sheet_field_last_changed timestamp,
        hubspot_details text,
        google_sheets_update_required text,
        today text,
        today_date timestamp,
        field text,
        site_survey_complete_to_cad_review_complete text,
        sync_to_genesis_power_solutions text
    );

CREATE TABLE
    IF NOT EXISTS finance_metrics_schema (
        item_id  bigint unique,
        unique_id varchar,
        customer text,
        prospect text,
        dealer text,
        partner varchar,
        project_status text,
        puma_cat text,
        puma_cat_supervisor text,
        source text,
        loan_type varchar,
        finance_company text,
        home_owner text,
        office text,
        primary_sales_rep text,
        secondary_sales_rep text,
        system_size float,
        contract_total float,
        created_on timestamp,
        contract_date timestamp,
        ntp_working_date timestamp,
        ntp_date timestamp,
        credit_expiration_date timestamp,
        substantial_submitted text,
        substantial_redlined text,
        substantial_follow_up text,
        substantial_approved text,
        cancelled_date timestamp,
        active_date timestamp,
        pto_submitted_date timestamp,
        pto_date timestamp,
        module text,
        loan_type_transferred text
    );

CREATE TABLE
    IF NOT EXISTS sales_metrics_schema (
        item_id  bigint unique,
        unique_id varchar,
        customer text,
        prospect text,
        dealer text,
        account_executive text,
        partner varchar,
        state text,
        project_status text,
        puma_cat text,
        puma_cat_supervisor text,
        customer_last_contacted timestamp,
        source text,
        address text,
        loan_type varchar,
        finance_company text,
        finance_id text,
        home_owner text,
        office text,
        primary_sales_rep text,
        secondary_sales_rep text,
        system_size float,
        contract_total float,
        net_epc float,
        prospect_created_on timestamp,
        cad_created_on timestamp,
        wc_1 timestamp,
        wc_2 timestamp,
        contract_date timestamp,
        ntp_date timestamp,
        ntp_working_date timestamp,
        adders_total text,
        survey_2nd_completion_date timestamp,
        permit_submitted_date timestamp,
        permit_approved_date timestamp,
        credit_expiration_date timestamp,
        shaky_status_date timestamp,
        cancelled_date timestamp,
        active_date timestamp,
        pv_install_scheduled_date timestamp,
        pv_install_complete_1_2_date timestamp,
        pv_install_complete_2_3_date timestamp,
        pv_install_completed_date timestamp,
        pto_submitted_date timestamp,
        pto_date timestamp,
        module text,
        field text,
        permit_submittal_eta timestamp,
        install_eta timestamp,
        estimated_project_lifespan text,
        adjusted_project_lifespan text,
        project_lifespan_delta text,
        calculate_project_lifespan text,
        account_exec_added text,
        account_executive_calculation text,
        cancellation_reason text,
        setter text,
        leaderboard_name text
    );

CREATE TABLE
    IF NOT EXISTS field_ops_metrics_schema (
        item_id  bigint unique,
        unique_id varchar,
        customer text,
        prospect text,
        dealer text,
        project_status text,
        puma_cat text,
        puma_cat_supervisor text,
        home_owner text,
        office text,
        manager text,
        director text,
        system_size float,
        module text,
        module_count text,
        inverter text,
        inverter_count text,
        racking text,
        first_battery_type text,
        first_battery_qty text,
        second_battery_type text,
        second_battery_qty text,
        ev_charger_type text,
        contract_date timestamp,
        site_survey_scheduled_date timestamp,
        site_survey_rescheduled_date timestamp,
        site_survey_completed_date timestamp,
        surveyor_name text,
        permit_created timestamp,
        permit_submitted_date timestamp,
        pv_redlined_date timestamp,
        permit_redline_count text,
        permit_approved_date timestamp,
        shaky_status_date timestamp,
        cancelled_date timestamp,
        permit_resubmitted_date timestamp,
        ab_resubmitted_date timestamp,
        install_ready_date timestamp,
        pv_install_scheduled_date timestamp,
        install_rescheduled_date timestamp,
        install_eta timestamp,
        pv_install_completed_date timestamp,
        install_team text,
        install_manager text,
        rtr_request_date_and_time timestamp,
        rtr_approved_date timestamp,
        roof_type text,
        roofing_created_date timestamp,
        roofing_scheduled_date timestamp,
        roofing_completed_date timestamp,
        derate_created_date timestamp,
        derate_ready_date timestamp,
        derate_scheduled_date timestamp,
        derate_completed_date timestamp,
        derate_tech text,
        derate_reschedule_count text,
        mpu_created_date timestamp,
        mpu_ready_date timestamp,
        mpu_scheduled_date timestamp,
        mpu_complete_date timestamp,
        mpu_tech text,
        mpu_reschedule_count timestamp,
        battery_ready_date timestamp,
        battery_scheduled_date timestamp,
        battery_complete_date timestamp,
        initial_battery_tech text,
        sub_panel_module text,
        sub_panel_module_name text,
        der_type text,
        der_sow text,
        fin_scheduled_date timestamp,
        fin_pv_redlined_date timestamp,
        technician_assigned text,
        fin_rescheduled_date timestamp,
        fin_created_date timestamp,
        fin_fail_date timestamp,
        fin_pass_date timestamp,
        pto_date timestamp,
        service_created_date timestamp,
        service_pending_action_date timestamp,
        service_reschedule_count text,
        service_reschedule_date timestamp,
        service_scheduled_date timestamp,
        service_completion_date timestamp,
        re_sync_slas text,
        within_sla text,
        outside_sla_current text,
        outside_sla_past text,
        metrics_last_updated text,
        sync_to_genesis_power_solutions text
    );

CREATE TABLE
    IF NOT EXISTS next_steps_schema (
        item_id  bigint unique,
        customer text,
        unique_id varchar,
        project_age_days text,
        next_milestone_pv_pre_install text,
        next_step_pv_pre_install text,
        next_milestone_pv_pre_install_calc text,
        next_step_pv_pre_install_calc text,
        next_milestone_pv_pre_install_sync text,
        next_steps_pv_pre_install_sync text,
        pv_post_install text,
        pv_post_install_calc text,
        pv_post_install_sync text,
        electrical text,
        electrical_calc text,
        electrical_sync text,
        roofing text,
        roofing_calc text,
        roofing_sync text,
        temp_next_milestone_synced text
    );

CREATE VIEW
    consolidated_data_view AS
SELECT
    intOpsMetSchema.unique_id,
    intOpsMetSchema.installer,
    intOpsMetSchema.customer_last_contacted,
    intOpsMetSchema.home_owner,
    intOpsMetSchema.office,
    intOpsMetSchema.system_size,
    intOpsMetSchema.prospect_working_date,
    intOpsMetSchema.hours_to_welcome_call,
    intOpsMetSchema.first_5_days_date,
    intOpsMetSchema.site_survey_scheduled_date,
    intOpsMetSchema.site_survey_rescheduled_date,
    intOpsMetSchema.site_survey_completed_date,
    intOpsMetSchema.cad_rejection_date,
    intOpsMetSchema.peee_rejection_date,
    intOpsMetSchema.cad_requested_date,
    intOpsMetSchema.cad_designer,
    intOpsMetSchema.cad_ready,
    intOpsMetSchema.cad_complete_date,
    intOpsMetSchema.cad_redline,
    intOpsMetSchema.cad_revision_requested_date,
    intOpsMetSchema.cad_revisions_completed,
    intOpsMetSchema.abcad_ready,
    intOpsMetSchema.abcad_completed,
    intOpsMetSchema.abcad_revised,
    intOpsMetSchema.abcad_revisions_completed,
    intOpsMetSchema.cad_review_date,
    intOpsMetSchema.cad_reviewer,
    intOpsMetSchema.permit_redlined,
    intOpsMetSchema.peee_submitted_date,
    intOpsMetSchema.ab_permit_redlined,
    intOpsMetSchema.peee_complete_date,
    intOpsMetSchema.peee_redline_date,
    intOpsMetSchema.stamp_provider,
    intOpsMetSchema.ahj,
    intOpsMetSchema.permit_created,
    intOpsMetSchema.permit_submitted_date,
    intOpsMetSchema.permit_expected_approval_date,
    intOpsMetSchema.permitting_specialist,
    intOpsMetSchema.permit_re_submitted_date,
    intOpsMetSchema.permit_approved_date,
    intOpsMetSchema.fire_permit_created_date,
    intOpsMetSchema.fire_permit_submitted_date,
    intOpsMetSchema.fire_permit_approved_date,
    intOpsMetSchema.battery_permit_created_date,
    intOpsMetSchema.battery_permit_submitted_date,
    intOpsMetSchema.battery_permit_approved_date,
    intOpsMetSchema.electrical_permit_created_date,
    intOpsMetSchema.electrical_permit_submitted_date,
    intOpsMetSchema.electrical_permit_approved_date,
    intOpsMetSchema.pv_redlined_date,
    intOpsMetSchema.permit_turnaround_time,
    intOpsMetSchema.ic_created_date,
    intOpsMetSchema.ic_submitted_date,
    intOpsMetSchema.ic_expected_approval_date,
    intOpsMetSchema.utility_specialist,
    intOpsMetSchema.utility_company,
    intOpsMetSchema.ic_re_submitted_date,
    intOpsMetSchema.ic_approved_date,
    intOpsMetSchema.ic_rejection_date,
    intOpsMetSchema.canceled_date,
    intOpsMetSchema.pv_install_created_date,
    intOpsMetSchema.pv_install_completed_date,
    intOpsMetSchema.electrical_submitted_date,
    intOpsMetSchema.electrical_approved_date,
    intOpsMetSchema.pto_created_date,
    intOpsMetSchema.pto_submitted_date,
    intOpsMetSchema.pto_fail_date,
    intOpsMetSchema.pto_date,
    intOpsMetSchema.inverter_part_number,
    intOpsMetSchema.module,
    salMetSchema.customer,
    salMetSchema.prospect,
    salMetSchema.project_status,
    salMetSchema.puma_cat,
    salMetSchema.puma_cat_supervisor,
    salMetSchema.source,
    salMetSchema.loan_type,
    salMetSchema.contract_date,
    salMetSchema.ntp_working_date,
    salMetSchema.ntp_date,
    salMetSchema.credit_expiration_date,
    salMetSchema.shaky_status_date,
    salMetSchema.cancelled_date,
    salMetSchema.pv_install_scheduled_date,
    salMetSchema.install_eta,
    salMetSchema.dealer,
    salMetSchema.account_executive,
    salMetSchema.partner,
    salMetSchema.state,
    salMetSchema.address,
    salMetSchema.finance_company,
    salMetSchema.finance_id,
    salMetSchema.primary_sales_rep,
    salMetSchema.secondary_sales_rep,
    salMetSchema.contract_total,
    salMetSchema.net_epc,
    salMetSchema.prospect_created_on,
    salMetSchema.wc_1,
    salMetSchema.wc_2,
    salMetSchema.active_date,
    salMetSchema.permit_submittal_eta,
    salMetSchema.estimated_project_lifespan,
    salMetSchema.adjusted_project_lifespan,
    salMetSchema.project_lifespan_delta,
    fieldOpsSchema.director,
    fieldOpsSchema.surveyor_name,
    fieldOpsSchema.permit_redline_count,
    fieldOpsSchema.permit_resubmitted_date,
    fieldOpsSchema.ab_resubmitted_date,
    fieldOpsSchema.install_ready_date,
    fieldOpsSchema.install_rescheduled_date,
    fieldOpsSchema.install_team,
    fieldOpsSchema.install_manager,
    fieldOpsSchema.rtr_request_date_and_time,
    fieldOpsSchema.rtr_approved_date,
    fieldOpsSchema.roofing_created_date,
    fieldOpsSchema.roofing_scheduled_date,
    fieldOpsSchema.roofing_completed_date,
    fieldOpsSchema.derate_ready_date,
    fieldOpsSchema.derate_scheduled_date,
    fieldOpsSchema.derate_completed_date,
    fieldOpsSchema.derate_tech,
    fieldOpsSchema.mpu_ready_date,
    fieldOpsSchema.mpu_scheduled_date,
    fieldOpsSchema.mpu_tech,
    fieldOpsSchema.battery_ready_date,
    fieldOpsSchema.battery_scheduled_date,
    fieldOpsSchema.battery_complete_date,
    fieldOpsSchema.initial_battery_tech,
    fieldOpsSchema.fin_scheduled_date,
    fieldOpsSchema.technician_assigned,
    fieldOpsSchema.fin_rescheduled_date,
    fieldOpsSchema.fin_created_date,
    fieldOpsSchema.fin_fail_date,
    fieldOpsSchema.fin_pass_date,
    fieldOpsSchema.service_created_date,
    fieldOpsSchema.service_pending_action_date,
    fieldOpsSchema.service_reschedule_count,
    fieldOpsSchema.service_reschedule_date,
    fieldOpsSchema.service_scheduled_date,
    fieldOpsSchema.service_completion_date,
    fieldOpsSchema.mpu_complete_date,
    fieldOpsSchema.fin_pv_redlined_date,
    salMetSchema.survey_2nd_completion_date,
    salMetSchema.pv_install_complete_1_2_date,
    salMetSchema.pv_install_complete_2_3_date
FROM
    (
        SELECT
            unique_id,
            installer,
            customer_last_contacted,
            home_owner,
            office,
            system_size,
            prospect_working_date,
            hours_to_welcome_call,
            first_5_days_date,
            site_survey_scheduled_date,
            site_survey_rescheduled_date,
            site_survey_completed_date,
            cad_rejection_date,
            peee_rejection_date,
            cad_requested_date,
            cad_designer,
            cad_ready,
            cad_complete_date,
            cad_redline,
            cad_revision_requested_date,
            cad_revisions_completed,
            abcad_ready,
            abcad_completed,
            abcad_revised,
            abcad_revisions_completed,
            cad_review_date,
            cad_reviewer,
            permit_redlined,
            peee_submitted_date,
            ab_permit_redlined,
            peee_complete_date,
            peee_redline_date,
            stamp_provider,
            ahj,
            permit_created,
            permit_submitted_date,
            permit_expected_approval_date,
            permitting_specialist,
            permit_re_submitted_date,
            permit_approved_date,
            fire_permit_created_date,
            fire_permit_submitted_date,
            fire_permit_approved_date,
            battery_permit_created_date,
            battery_permit_submitted_date,
            battery_permit_approved_date,
            electrical_permit_created_date,
            electrical_permit_submitted_date,
            electrical_permit_approved_date,
            pv_redlined_date,
            permit_turnaround_time,
            ic_created_date,
            ic_submitted_date,
            ic_expected_approval_date,
            utility_specialist,
            utility_company,
            ic_re_submitted_date,
            ic_approved_date,
            ic_rejection_date,
            canceled_date,
            pv_install_created_date,
            pv_install_completed_date,
            electrical_submitted_date,
            electrical_approved_date,
            pto_created_date,
            pto_submitted_date,
            pto_fail_date,
            pto_date,
            inverter_part_number,
            module
        FROM
            internal_ops_metrics_schema
        WHERE
            unique_id IS NOT NULL
            AND unique_id <> ''
    ) intOpsMetSchema
    JOIN sales_metrics_schema salMetSchema ON intOpsMetSchema.unique_id = salMetSchema.unique_id
    JOIN field_ops_metrics_schema fieldOpsSchema ON intOpsMetSchema.unique_id = fieldOpsSchema.unique_id;

CREATE VIEW ops_analysis_timelines_view AS
SELECT
    intOpsMetSchema.unique_id,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.ntp_date - intOpsMetSchema.site_survey_completed_date)) / 86400.0, 2)) AS survey_to_ntp,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.cancelled_date - intOpsMetSchema.site_survey_completed_date)) / 86400.0, 2)) AS survey_to_cancel,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.pv_install_completed_date - intOpsMetSchema.site_survey_completed_date)) / 86400.0, 2)) AS survey_to_install,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.pto_date - intOpsMetSchema.site_survey_completed_date)) / 86400.0, 2)) AS survey_to_pto,
    ABS(ROUND(EXTRACT(epoch FROM (intOpsMetSchema.site_survey_completed_date - intOpsMetSchema.site_survey_scheduled_date)) / 86400.0, 2)) AS survey_scheduled_to_survey_completed,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.contract_date - intOpsMetSchema.site_survey_completed_date)) / 86400.0, 2)) AS sales_to_survey,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.ntp_date - salMetSchema.contract_date)) / 86400.0, 2)) AS sales_to_ntp,
    ABS(ROUND(EXTRACT(epoch FROM (intOpsMetSchema.cad_complete_date - salMetSchema.contract_date)) / 86400.0, 2)) AS sale_to_cad_completed,
    ABS(ROUND(EXTRACT(epoch FROM (intOpsMetSchema.ic_submitted_date - salMetSchema.contract_date)) / 86400.0, 2)) AS sale_to_ic_submission,
    ABS(ROUND(EXTRACT(epoch FROM (intOpsMetSchema.permit_submitted_date - salMetSchema.contract_date)) / 86400.0, 2)) AS sale_to_permit_submission,
    ABS(ROUND(EXTRACT(epoch FROM (intOpsMetSchema.ic_approved_date - salMetSchema.contract_date)) / 86400.0, 2)) AS sale_to_ic_approved,
    ABS(ROUND(EXTRACT(epoch FROM (intOpsMetSchema.permit_approved_date - salMetSchema.contract_date)) / 86400.0, 2)) AS sale_to_permit_approved,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.pv_install_completed_date - salMetSchema.contract_date)) / 86400.0, 2)) AS sales_to_install,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.cancelled_date - salMetSchema.contract_date)) / 86400.0, 2)) AS sales_to_cancel,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.pto_date - salMetSchema.contract_date)) / 86400.0, 2)) AS sales_to_pto,
    ABS(ROUND(EXTRACT(epoch FROM (intOpsMetSchema.cad_complete_date - intOpsMetSchema.cad_requested_date)) / 86400.0, 2)) AS cad_requested_to_cad_completed,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.permit_submitted_date - intOpsMetSchema.cad_requested_date)) / 86400.0, 2)) AS cad_complete_to_permit_submitted,
    ABS(ROUND(EXTRACT(epoch FROM (intOpsMetSchema.electrical_permit_approved_date - intOpsMetSchema.cad_requested_date)) / 86400.0, 2)) AS cad_completed_to_electrical_permit_approved,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.cancelled_date - salMetSchema.ntp_date)) / 86400.0, 2)) AS ntp_to_cancel,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.pv_install_completed_date - salMetSchema.ntp_date)) / 86400.0, 2)) AS ntp_to_install,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.pto_date - salMetSchema.ntp_date)) / 86400.0, 2)) AS ntp_to_pto,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.pv_install_completed_date - intOpsMetSchema.permit_approved_date)) / 86400.0, 2)) AS pv_permit_approved_to_install_complete,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.cancelled_date - salMetSchema.pv_install_completed_date)) / 86400.0, 2)) AS install_to_cancel,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.pto_date - salMetSchema.pv_install_completed_date)) / 86400.0, 2)) AS install_to_pto,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.pv_install_completed_date - fieldOpsSchema.pv_install_scheduled_date)) / 86400.0, 2)) AS install_scheduled_to_install_complete,
    ABS(ROUND(EXTRACT(epoch FROM (fieldOpsSchema.fin_pass_date - salMetSchema.pv_install_completed_date)) / 86400.0, 2)) AS install_to_fin,
    ABS(ROUND(EXTRACT(epoch FROM (fieldOpsSchema.fin_scheduled_date - salMetSchema.pv_install_completed_date)) / 86400.0, 2)) AS install_to_fin_submitted,
    ABS(ROUND(EXTRACT(epoch FROM (intOpsMetSchema.pto_submitted_date - salMetSchema.pv_install_completed_date)) / 86400.0, 2)) AS install_to_pto_submitted,
    ABS(ROUND(EXTRACT(epoch FROM (salMetSchema.pto_date - fieldOpsSchema.rtr_approved_date)) / 86400.0, 2)) AS rtr_pass_pto_pass,
    ABS(ROUND(EXTRACT(epoch FROM (fieldOpsSchema.fin_fail_date - fieldOpsSchema.rtr_approved_date)) / 86400.0, 2)) AS rtr_pass_fin_fail,
    ABS(ROUND(EXTRACT(epoch FROM (intOpsMetSchema.pto_fail_date - fieldOpsSchema.rtr_approved_date)) / 86400.0, 2)) AS rtr_pass_pto_fail,
    ABS(ROUND(EXTRACT(epoch FROM (fieldOpsSchema.rtr_approved_date - fieldOpsSchema.rtr_request_date_and_time)) / 86400.0, 2)) AS rtr_speed,
    ABS(ROUND(EXTRACT(epoch FROM (fieldOpsSchema.service_completion_date - fieldOpsSchema.service_created_date)) / 86400.0, 2)) AS service_open_to_service_completed,
    ABS(ROUND(EXTRACT(epoch FROM (fieldOpsSchema.mpu_complete_date - intOpsMetSchema.cad_complete_date)) / 86400.0, 2)) AS cad_to_mpu_completed,
    ABS(ROUND(EXTRACT(epoch FROM (fieldOpsSchema.mpu_complete_date - fieldOpsSchema.mpu_scheduled_date)) / 86400.0, 2)) AS mpu_scheduled_to_mpu_completed,
    ABS(ROUND(EXTRACT(epoch FROM (fieldOpsSchema.derate_completed_date - intOpsMetSchema.cad_complete_date)) / 86400.0, 2)) AS cad_completed_to_derate_completed,
    ABS(ROUND(EXTRACT(epoch FROM (fieldOpsSchema.derate_completed_date - fieldOpsSchema.derate_completed_date)) / 86400.0, 2)) AS derate_scheduled_to_derate_completed,
    ABS(ROUND(EXTRACT(epoch FROM (fieldOpsSchema.battery_complete_date - fieldOpsSchema.battery_scheduled_date)) / 86400.0, 2)) AS battery_scheduled_to_battery_completed
    FROM
    (
        SELECT
            unique_id,
            site_survey_scheduled_date,
            site_survey_completed_date,
			cad_complete_date,
			ic_submitted_date,
			permit_submitted_date,
			ic_approved_date,
			permit_approved_date,
			cad_requested_date,
			pto_fail_date,
            electrical_permit_approved_date,
            pto_submitted_date
        FROM
            internal_ops_metrics_schema
        WHERE
            unique_id IS NOT NULL
            AND unique_id <> ''
    ) intOpsMetSchema
JOIN sales_metrics_schema salMetSchema ON intOpsMetSchema.unique_id = salMetSchema.unique_id
JOIN field_ops_metrics_schema fieldOpsSchema ON intOpsMetSchema.unique_id = fieldOpsSchema.unique_id;

/***************************** SETTINGS DB TABLE START  ************************************************/
/*Table to store the teams information for appointment setters*/
CREATE TABLE teams (
    team_id serial NOT NULL,
    team_name character varying UNIQUE,
    PRIMARY KEY (team_id)
);

/*Table to store the appointment setters on  boarding information*/
CREATE TABLE appointment_setters (
    setters_id serial NOT NULL,
    team_id INT,
    first_name character varying,
    last_name character varying,
    pay_rate  double precision,
    start_date character varying NOT NULL,
    end_date character varying,
    description character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY (setters_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

CREATE TABLE states (
    state_id SERIAL NOT NULL,
    abbr character varying(2),
    name character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY (state_id)
);

CREATE TABLE zipcodes (
    id serial NOT NULL,
    zipcode character varying,
    city character varying,
    state_id INT,
    lat DOUBLE PRECISION,
    lon DOUBLE PRECISION,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    PRIMARY KEY (id)
);

CREATE TABLE partners (
    partner_id serial NOT NULL,
    partner_name character varying,
    description character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY (partner_id)
);

CREATE TABLE sale_type (
    id serial NOT NULL,
    type_name character varying,
    description character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY (id)
);

CREATE TABLE project_status (
    id serial NOT NULL,
    status character varying,
    description character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY (id)
);

CREATE TABLE rep_type (
    id serial NOT NULL,
    rep_type character varying NOT NULL,
    description character varying,
    PRIMARY KEY (id)
);

CREATE TABLE commission_rates (
    id serial NOT NULL,
    partner_id INT,
    installer_id INT,
    state_id INT,
    sale_type_id INT,
    sale_price double precision,
    rep_type INT,
    rl double precision,
    rate double precision,
    start_date character varying NOT NULL,
    end_date character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    FOREIGN KEY (partner_id) REFERENCES partners(partner_id),
    FOREIGN KEY (installer_id) REFERENCES partners(partner_id),
    FOREIGN KEY (sale_type_id) REFERENCES sale_type(id),
    FOREIGN KEY (rep_type) REFERENCES rep_type(id),

    PRIMARY KEY (id)
);

/* Tables for User Authentication */
CREATE TABLE  IF NOT EXISTS user_roles (
    role_id SERIAL,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (role_id)
);

CREATE TABLE IF NOT EXISTS user_details(
    user_id SERIAL,
    name VARCHAR(255) NOT NULL,
    user_code VARCHAR(255),
    mobile_number VARCHAR(20) NOT NULL UNIQUE,
    email_id VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    password_change_required BOOLEAN,
    reporting_manager INT,
    role_id INT,
    user_status VARCHAR(255) NOT NULL,
    user_designation VARCHAR(255),
    description VARCHAR(255),
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (reporting_manager) REFERENCES user_details(user_id),
    FOREIGN KEY (role_id) REFERENCES user_roles(role_id),
	PRIMARY KEY (user_id)
);

CREATE TABLE dealer_override (
    id serial NOT NULL,
    sub_dealer character varying,
    dealer_id INT,
    pay_rate character varying,
    start_date character varying NOT NULL,
    end_date character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (dealer_id) REFERENCES user_details(user_id),
    PRIMARY KEY (id)
);
CREATE TABLE source (
    id serial NOT NULL,
    name character varying,
    description character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY (id)
);

CREATE TABLE marketing_fees (
    id serial NOT NULL,
    source_id INT,
    dba character varying,
    state_id INT,
    fee_rate character varying,
    chg_dlr integer,
    pay_src integer,
    start_date character varying NOT NULL,
    end_date character varying,
    description character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    FOREIGN KEY (source_id) REFERENCES source(id),
    PRIMARY KEY (id)
);

CREATE TABLE v_adders (
    id serial NOT NULL,
    adder_name character varying,
    adder_type character varying,
    price_type character varying,
    price_amount character varying,
    active integer,
    description character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY (id)
);

CREATE TABLE loan_type (
    id serial NOT NULL,
    product_code  character varying,
    active integer,
    adder integer,
    description character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY (id)
);


CREATE TABLE tier (
    id serial NOT NULL,
    tier_name character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY (id)
);

CREATE TABLE dealer_tier (
    id serial NOT NULL,
    dealer_id INT,
    tier_id INT,
    start_date character varying NOT NULL,
    end_date character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (tier_id) REFERENCES tier(id),
    FOREIGN KEY (dealer_id) REFERENCES user_details(user_id),
    PRIMARY KEY (id)
);

CREATE TABLE tier_loan_fee (
    id serial NOT NULL,
    dealer_tier INT,
    installer_id INT,
    state_id INT,
    finance_type INT,
    owe_cost character varying,
    dlr_mu character varying,
    dlr_cost character varying,
    start_date character varying NOT NULL,
    end_date character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (dealer_tier) REFERENCES tier(id),
    FOREIGN KEY (installer_id) REFERENCES partners(partner_id),
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    FOREIGN KEY (finance_type) REFERENCES loan_type(id),

    PRIMARY KEY (id)
);

CREATE TABLE payment_schedule (
    id serial NOT NULL,
    rep_id INT,
    partner_id INT,
    installer_id INT,
    sale_type_id INT, 
    state_id INT,
    rl character varying,
    draw character varying,
    draw_max character varying,
    rep_draw character varying,
    rep_draw_max character varying,
    rep_pay character varying,
    start_date character varying NOT NULL,
    end_date character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    FOREIGN KEY (sale_type_id) REFERENCES sale_type(id),
    FOREIGN KEY (installer_id) REFERENCES partners(partner_id),
    FOREIGN KEY (partner_id) REFERENCES partners(partner_id),
    FOREIGN KEY (rep_id) REFERENCES user_details(user_id),
    PRIMARY KEY (id)
);

CREATE TABLE timeline_sla (
    id serial NOT NULL,
    type_m2m  character varying,
    state_id INT,
    days integer,
    start_date character varying NOT NULL,
    end_date character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    PRIMARY KEY (id)
);

CREATE TABLE dealer_pay_export (
    id serial NOT NULL,
    dealer INT,
    partner INT,
    installer INT,
    source INT,
    sale_type_id INT,
    loan_type INT,
    unique_id character varying,
    home_owner	character varying,
    street_address character varying,
    city INT,
    state INT,
    zipcode INT,
    email character varying,
    phone_number character varying,
    rep_1 INT,
    rep_2 INT,
    appt_setter	INT,
    sys_size DOUBLE PRECISION,
    kwh	 DOUBLE PRECISION,
    contract DOUBLE PRECISION,
    epc DOUBLE PRECISION,
    created_date character varying,
    contract_date character varying,
    site_survey_date character varying,
    ntp_date character varying,
    perm_sub_date character varying,	
    perm_app_date character varying,	
    ic_sub_date character varying,	
    ic_app_date character varying,	
    proj_status_crm INT,
    cancel_date	character varying,
    pv_install_date	character varying,
    elec_Install_date character varying,
    fin_date character varying,
    pto_date character varying,
    small_system_size VARCHAR(20),
    FOREIGN KEY (dealer) REFERENCES user_details(user_id),
    FOREIGN KEY (partner) REFERENCES partners(partner_id),
    FOREIGN KEY (installer) REFERENCES partners(partner_id),
    FOREIGN KEY (source) REFERENCES source(id),
    FOREIGN KEY (sale_type_id) REFERENCES sale_type(id),
    FOREIGN KEY (loan_type) REFERENCES loan_type(id),
    FOREIGN KEY (state) REFERENCES states(state_id),
    FOREIGN KEY (zipcode) REFERENCES zipcodes(id),
    FOREIGN KEY (rep_1) REFERENCES user_details(user_id),
    FOREIGN KEY (rep_2) REFERENCES user_details(user_id),
    FOREIGN KEY (appt_setter) REFERENCES appointment_setters(setters_id),
    FOREIGN KEY (proj_status_crm) REFERENCES  project_status(id),
    PRIMARY KEY (id)
);

CREATE TABLE adder_type (
    id serial NOT NULL,
    adder_type character varying,
    PRIMARY KEY (id)
);

CREATE TABLE rebate_type (
    id serial NOT NULL,
    rebate_type character varying,
    PRIMARY KEY (id)
);


CREATE TABLE rebate_items (
    id serial NOT NULL,
    item character varying,
    PRIMARY KEY (id)
);


CREATE TABLE sale_adders (
    id serial NOT NULL,
    dealer_pay_export_id INT,
    date character varying,
    adder_type INT,
    gc character varying,
    extact_amt DOUBLE PRECISION,
    per_kw_amt DOUBLE PRECISION,
    rep_percent integer,
    description character varying,
    FOREIGN KEY (dealer_pay_export_id) REFERENCES  dealer_pay_export(id),
    FOREIGN KEY (adder_type) REFERENCES  adder_type(id),
    PRIMARY KEY (id)
);


CREATE TABLE customer_rebates (
	id serial NOT NULL,
	dealer_pay_export_id INT,
	date character varying,
	type INT,	
	item_id INT,	 
	amount  double precision,	
	rep_percent  integer,
	description character varying,
	FOREIGN KEY (dealer_pay_export_id) REFERENCES  dealer_pay_export(id),
	FOREIGN KEY (item_id) REFERENCES  rebate_items(id),
    PRIMARY KEY (id)
);

CREATE TABLE referrer_details (
    referrer_id character varying NOT NULL,
    referrer_name character varying,
    street_address character varying,
    city INT,
    state INT,
    zipcode INT,
    email character varying,
    phone_num character varying,
    entity_type character varying,
    account_type character varying,
    routing_num character varying,
    account_num character varying,
    FOREIGN KEY (zipcode) REFERENCES zipcodes(id),
    FOREIGN KEY (state) REFERENCES states(state_id),
    PRIMARY KEY (referrer_id)
);


CREATE TABLE referral_bonus (
	id serial NOT NULL,
	dealer_pay_export_id INT,
	referrer_id character varying,
	date character varying,	 
	amount character varying,	
	rep_percent  integer,
	description character varying,	
	FOREIGN KEY (dealer_pay_export_id) REFERENCES  dealer_pay_export(id),
    FOREIGN KEY (referrer_id) REFERENCES  referrer_details(referrer_id),
	PRIMARY KEY (id)
);


/**********************************DEALER PAY SCHEMA START **************************************/

CREATE TABLE
    IF NOT EXISTS webhook_info (
        home_owner	text,
        current_status text,
        status_date text,
        unique_id  text,
        dealer   text,
        dba  text,
        type1  text,
        today  text,d
        amount  text,
        type2  text,
        sys_size  text,
        contract_value  text,
        loan_fee  text,
        other_adders  text,
        epc  text,
        net_epc   text,
        rl  text,
        credit   text,
        rep1  text,
        rep2  text,
        rep_pay  text,
        net_rev  text,
        draw_amt  text,
        amt_paid  text,
        balance  text,
        st  text,
        contract_date  text
);

CREATE TABLE   
    IF NOT EXISTS dlr_pay_calc(  
    dealer   text,
    partner   text,
    instl   text,
    source   text,
    type   text, 
    loan_type   text, 
    unique_id   text, 
    home_owner   text, 
    street_address      text,
    city   text,  
    st      text,
    zip      text,
    rep_1      text,
    rep_2      text,
    appt_setter      text,
    sys_size      text,
    kwh      text,
    contract1      text,
    epc      text,
    created      text,
    wc      text,
    pp      text,
    ntp      text,
    perm_sub      text,
    perm_app      text,
    ic_sub      text,
    ic_app      text,
    cancel      text,
    inst_sys      text,
    inst_elec      text,
    fca      text,
    pto      text,
    status1      text,
    status_date      text,
    contract2      text,
    epc_calc      text,
    dealer      text,
    dealer_dba      text,
    rl_1      text,
    credit      text,
    rep_pay      text,
    payrate_semi      text,
    addr      text,
    expense      text,
    auto_addr      text,
    loan_fee      text,
    rebate      text,
    referral      text,
    adder_total      text,
    adder_lf      text,
    epc      text,
    net_epc      text,
    adder_per_kw      text,
    pay_rate_sub_total      text,
    comm_total      text,
    status_check      text,
    dealer_repayment_bonus      text,
    parent_dlr      text,
    pay_rate      text,
    dealer_dba      text,
    ovrd_total      text,
    dlr_draw      text,
    dlr_draw_max      text,
    r1_draw_amt      text,
    r1_draw_paid      text,
    amt_check      text,
    r1_comm_paid      text,
    r1_balance      text,
    ovrd_paid      text,
    ovrd_balance      text,
    status2      text,
    status_date      text,
    rep_count      text,
    per_rep_sales      text,
    per_rep_kw      text,
    contract_calc      text,
    epc_calc      text,
    loan_fee      text,
    rep_1_team      text,
    rep_2_team      text,
    team_count      text,
    per_team_sales      text,
    per_team_kw      text,
    r1_name      text,
    rep_1_dba      text,
    pay_scale      text,
    position      text,
    rl_2      text,
    rate      text,
    value1      text,
    r1_incentive      text,
    r1_credit      text,
    payrate_semi      text,
    addr_resp      text,
    r1_addr      text,
    r1_auto_addr      text,
    r1_loan_fee      text,
    r1_rebate      text,
    r1_referral      text,
    r1_rr      text,
    r1_adder_total      text,
    r1_adder_per_kw      text,
    r1_pay_rate_sub_total      text,
    net_epc      text,
    r1_min_max_correct      text,
    r1_comm_total      text,
    r1_comm_status_check      text,
    r2_name      text,
    rep_2_dba      text,
    pay_scale      text,
    position      text,
    rl_3      text,
    rate      text,
    value2      text,
    r2_incentive      text,
    r2_credit      text,
    payrate_semi      text,
    addr_resp      text,
    r2_addr      text,
    r2_auto_addr      text,
    r2_loan_fee      text,
    r2_rebate      text,
    r2_referral      text,
    r2_rr      text,
    r2_adder_total      text,
    r2_adder_per_kw      text,
    r2_pay_rate_sub_total      text,
    net_epc      text,
    r2_min_max_correct      text,
    r2_comm_total      text,
    r2_comm_status_check      text
);

/**********************************DEALER PAY SCHEMA END **************************************/


/* Add a default Admin User to Login tables */
/* Default Admin Password is 1234 for Development purpose */
-- Insert default role 'Admin' into user_roles table
INSERT INTO user_roles (role_name) VALUES ('Admin');
INSERT INTO user_details (name, user_code, mobile_number, email_id, password, password_change_required, reporting_manager, role_id, user_status, user_designation, description) VALUES ('Shushank Sharma', 'OWE001', '0987654321', 'shushank22@gmail.com', '$2a$10$5DPnnf5GqDE1dI8L/fM79OsY7XjzmLbw3rkSVONPz.92CqHUkXYHC', false, NULL, 1, 'Active', 'CTO', 'Chief Technical Officer');
INSERT INTO user_details (name, user_code, mobile_number, email_id, password, password_change_required, reporting_manager, role_id, user_status, user_designation, description) VALUES ('Jaitunjai Singh', 'OWE002', '0987654322', 'Jai22@gmail.com', '$2a$10$5DPnnf5GqDE1dI8L/fM79OsY7XjzmLbw3rkSVONPz.92CqHUkXYHC', false, 1, 1, 'Active', 'Software Engineer', 'SE');
INSERT INTO user_details (name, user_code, mobile_number, email_id, password, password_change_required, reporting_manager, role_id, user_status, user_designation, description) VALUES ('M Asif', 'OWE003', '0987654323', 'asif22@gmail.com', '$2a$10$5DPnnf5GqDE1dI8L/fM79OsY7XjzmLbw3rkSVONPz.92CqHUkXYHC', false, 2, 1, 'Active', 'CEO', 'Chief Exec Officer');
INSERT INTO partners (partner_name,description) VALUES ('PartnerABC','Example Partner Description');
INSERT INTO tier (tier_name) VALUES ('TierName123');
INSERT INTO loan_type (product_code,active,adder,description) VALUES ('P123',1,10,'Example Loan Type Description');

/******************************************************************************************/

/* Insert Default Data in all the rquried tables */
\copy rebate_items(item) FROM '/docker-entrypoint-initdb.d/rebate_items.csv' DELIMITER ',' CSV;
\copy rebate_type(rebate_type) FROM '/docker-entrypoint-initdb.d/rebate_type.csv' DELIMITER ',' CSV;
\copy adder_type(adder_type) FROM '/docker-entrypoint-initdb.d/adder_type.csv' DELIMITER ',' CSV;
\copy states(abbr,name) FROM '/docker-entrypoint-initdb.d/states.csv' DELIMITER ',' CSV;
\copy project_status(status) FROM '/docker-entrypoint-initdb.d/project_status.csv' DELIMITER ',' CSV;
\copy teams(team_name) FROM '/docker-entrypoint-initdb.d/teams.csv' DELIMITER ',' CSV;
\copy rep_type(rep_type) FROM '/docker-entrypoint-initdb.d/rep_type.csv' DELIMITER ',' CSV;
\copy sale_type(type_name) FROM '/docker-entrypoint-initdb.d/sale_type.csv' DELIMITER ',' CSV;
\copy source(name,description) FROM '/docker-entrypoint-initdb.d/source.csv' DELIMITER ',' CSV;
\copy partners(partner_name) FROM '/docker-entrypoint-initdb.d/partners.csv' DELIMITER ',' CSV;
\copy timeline_sla(type_m2m,state_id,days,start_date) FROM '/docker-entrypoint-initdb.d/timeline_sla.csv' DELIMITER ',' CSV;
\copy tier(tier_name) FROM '/docker-entrypoint-initdb.d/tier.csv' DELIMITER ',' CSV;
\copy appointment_setters(team_id, first_name, last_name, pay_rate, start_date, end_date) FROM '/docker-entrypoint-initdb.d/appointment_setters.csv' DELIMITER ',' CSV;

/******************************SETTINGS DB TABLE END  ***********************************************/


/******************************* Adding All Stored Procedures ***********************************/
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewUser.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewTeam.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateAptSetter.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcSmallSysSizeCalc.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCommisionTypeCalc.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateDealerPayExport.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewCommission.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewDealer.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewMarketingFees.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewVAdders.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewSaleType.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewTierLoanFee.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewDealerTier.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewPaymentSchedule.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewTimelineSla.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewPartner.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewState.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewLoanType.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateCommission.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateDealer.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateMarketingFee.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateVAdders.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateSaleType.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateTierLoanFee.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateDealerTier.sql'; 
\i '/docker-entrypoint-initdb.d/DB_ProcUpdatePaymentSchedule.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateTimelineSla.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateLoanType.sql';