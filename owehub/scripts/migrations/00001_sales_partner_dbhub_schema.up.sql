-- 001_create_sales_partner_dbhub_schema.sql

-- Up Migration: Create Table
CREATE TABLE IF NOT EXISTS sales_partner_dbhub_schema (
    item_id bigint unique,
    podio_link TEXT,
    item_created_on TIMESTAMP,
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

-- COPY sales_partner_dbhub_schema(item_id, podio_link, item_created_on, label, sales_partner_name, data_entry_dealer_id, leaderboard_name, creation_date, 
-- 	days_to_first_sale, days_to_first_pv_install_complete, partner_id, partner_tier, partner_type, partner_status, partner_notes, 
-- 	monthly_install_volume, selling_market_s, puma2, account_manager2, account_executive, project_manager, project_coordinator_s, 
-- 	redline, redline_amount, adder_responsibility, adder_responsibility_breakdown, adders, retention_opt_out_option, happiness, 
-- 	send_stage_updates, cc_on_hold_jeopardy_emails_comma_separated, recruiter, "source", source_new, on_boarding_checklist, partner_recruiter_updated, 
-- 	sales_ai_access, show_rebate_amount_field, ct_included, owner_s, point_s_of_contact, onboarding_manager, account_manager, 
-- 	reps, share_customers_with, puma, puma_x_round_robin, tier, zooli_json, documents_stauts, pay_details_update, terminated_date, 
-- 	docusign_nda_envelope_id, docusign_msa_envelope_id, cancel_jeopardy_hold_custom_messaging, no_longer_in_cancel_jeopardy_hold_custom_messaging, 
-- 	last_deal_sold, days_since_last_deal, inactvity_band, account_executive_name, total_kw_install, json_webhook_header, json_webhook, 
-- 	hook_site, dealer_db_zooli_json, dealer_pid_h, today) FROM '/docker-entrypoint-initdb.d/sales_partner_dbhub_schema.csv' DELIMITER ',' CSV;
