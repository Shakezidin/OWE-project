-- 001_create_sales_partner_dbhub_schema.sql

-- Up Migration: Create Table
CREATE TABLE IF NOT EXISTS sales_partner_dbhub_schema (
    item_id bigint unique,
    podio_link TEXT,
    label TEXT,
    sales_partner_name TEXT,
    data_entry_dealer_id TEXT,
    leaderboard_name TEXT,
    creation_date TIMESTAMP,
    days_to_first_sale TEXT,
    days_to_first_pv_install_complete TEXT,
    partner_id TEXT,
    partner_tier TEXT,
    partner_type TEXT,
    partner_status TEXT,
    partner_notes TEXT,
    monthly_install_volume TEXT,
    selling_market_s TEXT,
    puma2 TEXT,
    account_manager2 TEXT,
    account_executive TEXT,
    project_manager TEXT,
    project_coordinator_s TEXT,
    redline TEXT,
    redline_amount TEXT,
    adder_responsibility TEXT,
    adder_responsibility_breakdown TEXT,
    adders TEXT,
    retention_opt_out_option TEXT,
    happiness TEXT,
    send_stage_updates TEXT,
    cc_on_hold_jeopardy_emails_comma_separated TEXT,
    recruiter TEXT,
    source TEXT,
    source_new TEXT,
    on_boarding_checklist TEXT,
    partner_recruiter_updated TEXT,
    sales_ai_access TEXT,
    show_rebate_amount_field TEXT,
    ct_included TEXT,
    owner_s TEXT,
    point_s_of_contact TEXT,
    onboarding_manager TEXT,
    account_manager TEXT,
    reps TEXT,
    share_customers_with TEXT,
    puma TEXT,
    puma_x_round_robin TEXT,
    tier TEXT,
    zooli_json TEXT,
    documents_stauts TEXT,
    pay_details_update TEXT,
    terminated_date TIMESTAMP,
    docusign_nda_envelope_id TEXT,
    docusign_msa_envelope_id TEXT,
    cancel_jeopardy_hold_custom_messaging TEXT,
    no_longer_in_cancel_jeopardy_hold_custom_messaging TEXT,
    last_deal_sold TIMESTAMP,
    days_since_last_deal TEXT,
    inactvity_band TEXT,
    account_executive_name TEXT,
    total_kw_install TEXT,
    json_webhook_header TEXT,
    json_webhook TEXT,
    hook_site TEXT,
    dealer_db_zooli_json TEXT,
    dealer_pid_h TEXT,
    today TEXT
);


