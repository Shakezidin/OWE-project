CREATE TABLE rep_pay_cal_standard(
    status varchar,
    rep_1 varchar,
    dealer varchar,
    source varchar,
    unique_id varchar,
    system_size float,
    partner varchar,
    installer varchar,
    loan_type varchar,
    state varchar,
    wc date,
    contract_total float,
    epc float,
    home_owner varchar,
    rep_2 varchar,
    pto date,
    inst_sys date,
    cancel date,
    ntp date,
    perm_sub date,
    shaky boolean,
    types varchar,
    kwh float,
    appt_setter varchar,
    status_date date,
    per_team_kw float,
    per_rep_kw float,
    contract_calc float,
    epc_calc float,
    rep_draw_percentage float,
    rep_draw_max float,
    rep_pay varchar,
    pay_rate float,
    loan_fee float,
    rep_1_net_epc float,
    rep_1_referral float,
    rep_1_rebate float,
    rep_1_dba varchar,
    rep_1_credit float,
    rep_1_addr float,
    rep_1_pay_scale varchar,
    rep_1_position varchar,
    rep_1_rl float,
    rep_1_rate float,
    rep_1_adjustment float,
    rep_1_min_rate float,
    rep_1_max_rate float,
    rep_1_rr float,
    rep_1_incentive float,
    rep_1_pay_rate_semi float,
    rep_1_auto_adder float,
    rep_1_loan_fee float,
    rep_1_adder_total float,
    rep_1_adder_per_kw float,
    rep_1_pay_rate_sub_total float,
    rep_1_min_or_max float,
    rep_1_comm_total float,
    rep_1_comm_status_check float,
    rep_1_draw_amount float,
    rep_1_draw_paid float,
    rep_1_comm_paid float,
    rep_1_balance float,
    appt_set_dba varchar,
    appt_set_total float,
    appt_set_status_check float,
    appt_amt float,
    appt_paid float,
    appt_balance float,
    rep_2_referral float,
    rep_2_rebate float,
    rep_2_net_epc float,
    rep_2_dba varchar,
    rep_2_credit float,
    rep_2_addr float,
    rep_2_pay_scale varchar,
    rep_2_position varchar,
    rep_2_rl float,
    rep_2_rate float,
    rep_2_adjustment float,
    rep_2_min_rate float,
    rep_2_max_rate float,
    rep_2_rr float,
    rep_2_incentive float,
    rep_2_pay_rate_semi float,
    rep_2_auto_adder float,
    rep_2_loan_fee float,
    rep_2_adder_total float,
    rep_2_adder_per_kw float,
    rep_2_pay_rate_sub_total float,
    rep_2_min_or_max float,
    rep_2_comm_total float,
    rep_2_comm_status_check float,
    rep_2_draw_amount float,
    rep_2_draw_paid float,
    rep_2_comm_paid float,
    rep_2_balance float,
    rep_1_team varchar,
    rep_2_team varchar,
    team_count float,
    ap_oth_paid float,
    ap_oth_balance float,
    ap_oth_date date,
    ap_oth_payee varchar,
    ap_pda_rc_amnt float,
    ap_pda_amnt float,
    ap_pda_paid_amnt float,
    ap_pda_claw_amnt float,
    ap_pda_paid_balance float,
    ap_pda_dba varchar,
    ap_pda_date date,
    ap_pda_payee varchar,
    ap_adv_rc_amnt float,
    ap_adv_amnt float,
    ap_adv_paid_amnt float,
    ap_adv_paid_balance float,
    ap_adv_dba varchar,
    ap_adv_date date,
    ap_adv_payee varchar,
    ap_ded_paid_amnt float,
    ap_ded_balance float,
    ap_ded_date date,
    ap_ded_payee varchar,
    commission_model varchar,
    pr_r1_d_type varchar,
    pr_r1_d_today date,
    pr_r1_d_status varchar,
    pr_r1_f_type varchar,
    pr_r1_f_today date,
    pr_r1_f_status varchar,
    pr_r1_b_type varchar,
    pr_r1_b_today date,
    pr_r1_b_status varchar,
    pr_r2_d_type varchar,
    pr_r2_d_today date,
    pr_r2_d_status varchar,
    pr_r2_f_type varchar,
    pr_r2_f_today date,
    pr_r2_f_status varchar,
    pr_r2_b_type varchar,
    pr_r2_b_today date,
    pr_r2_b_status varchar,
    pr_appt_type varchar,
    pr_appt_today date,
    pr_appt_status varchar,
    pr_oth_type varchar,
    pr_oth_today date,
    pr_oth_status varchar,
    pr_pda_type varchar,
    pr_pda_today date,
    pr_pda_status varchar,
    pr_adv_type varchar,
    pr_adv_today date,
    pr_adv_status varchar,
    pr_ded_type varchar,
    pr_ded_today date,
    pr_ded_status varchar,
    AP_OTH varchar,
    AP_PDA varchar,
    AP_ADV varchar,
    AP_DED varchar,
    REP_COMM varchar,
    REP_BONUS varchar
);
 
 
CREATE TABLE rep_pay_cal_ovrrd_standard(
    status varchar,
    rep_1 varchar,
    dealer varchar,
    source varchar,
    unique_id varchar,
    system_size float,
    partner varchar,
    installer varchar,
    loan_type varchar,
    state varchar,
    wc date,
    contract_total float,
    epc float,
    home_owner varchar,
    rep_2 varchar,
    pto date,
    inst_sys date,
    cancel date,
    ntp date,
    perm_sub date,
    shaky boolean,
    types varchar,
    kwh float,
    appt_setter varchar,
    status_date date,
    commission_model varchar,
    r1_sl_name varchar,
    r1_sl_rate float,
    r1_sl_dba varchar,
    r1_sl_comm float,
    r1_sl_paid float,
    r1_sl_bal float,
    r1_dm_name varchar,
    r1_dm_rate float,
    r1_dm_dba varchar,
    r1_dm_comm float,
    r1_dm_paid float,
    r1_dm_bal float,
    r1_dir_name varchar,
    r1_dir_rate float,
    r1_dir_dba varchar,
    r1_dir_comm float,
    r1_dir_paid float,
    r1_dir_bal float,
    r2_sl_name varchar,
    r2_sl_rate float,
    r2_sl_dba varchar,
    r2_sl_comm float,
    r2_sl_paid float,
    r2_sl_bal float,
    r2_dm_name varchar,
    r2_dm_rate float,
    r2_dm_dba varchar,
    r2_dm_comm float,
    r2_dm_paid float,
    r2_dm_bal float,
    r2_dir_name varchar,
    r2_dir_rate float,
    r2_dir_dba varchar,
    r2_dir_comm float,
    r2_dir_paid float,
    r2_dir_bal float,
    pr_r1_sl_type varchar,
    pr_r1_sl_today date,
    pr_r1_sl_status varchar,
    pr_r1_dm_type varchar,
    pr_r1_dm_today date,
    pr_r1_dm_status varchar,
    pr_r1_dir_type varchar,
    pr_r1_dir_today date,
    pr_r1_dir_status varchar,
    pr_r2_sl_type varchar,
    pr_r2_sl_today date,
    pr_r2_sl_status varchar,
    pr_r2_dm_type varchar,
    pr_r2_dm_today date,
    pr_r2_dm_status varchar,
    pr_r2_dir_type varchar,
    pr_r2_dir_today date,
    pr_r2_dir_status varchar,
    LEADER_OVRD varchar
);
 
 
CREATE VIEW pr_r1_d AS
SELECT
    rep_pay_cal_standard.dealer as dealer,
    rep_pay_cal_standard.home_owner as home_owner,
    rep_pay_cal_standard.unique_id as unique_id,
    rep_pay_cal_standard.rep_1 as rep_1,
    rep_pay_cal_standard.rep_1_dba as rep_1_dba,
    rep_pay_cal_standard.status as status,
    rep_pay_cal_standard.status_date as status_date,
    rep_pay_cal_standard.rep_1_comm_paid as rep_1_comm_paid,
    rep_pay_cal_standard.rep_1_balance as rep_1_balance,
    rep_pay_cal_standard.system_size as system_size,
    rep_pay_cal_standard.contract_total as contract_total,
    rep_pay_cal_standard.loan_fee as loan_fee,
    rep_pay_cal_standard.epc as epc,
    rep_pay_cal_standard.rep_1_addr as rep_1_addr,
    rep_pay_cal_standard.rep_1_rr as rep_1_rr,
    rep_pay_cal_standard.rep_1_position as rep_1_position,
    rep_pay_cal_standard.rep_1_net_epc as rep_1_net_epc,
    rep_pay_cal_standard.rep_1_credit as rep_1_credit,
    rep_pay_cal_standard.rep_2 as rep_2,
    rep_pay_cal_standard.rep_1_comm_status_check as rep_1_comm_status_check,
    rep_pay_cal_standard.rep_1_draw_amount as rep_1_draw_amount,
    rep_pay_cal_standard.loan_type as loan_type,
    rep_pay_cal_standard.state as state,
    rep_pay_cal_standard.wc as wc,
    rep_pay_cal_standard.commission_model AS commission_model,
    rep_pay_cal_standard.pr_r1_d_type AS pr_r1_d_type,
    rep_pay_cal_standard.pr_r1_d_today AS pr_r1_d_today,
    rep_pay_cal_standard.pr_r1_d_status AS pr_r1_d_status,
    rep_pay_cal_standard.REP_COMM as sheet_type
FROM
    rep_pay_cal_standard
WHERE
(
    rep_pay_cal_standard.wc > '2018-12-31'  AND
    rep_pay_cal_standard.rep_pay = 'YES'  AND
    rep_pay_cal_standard.rep_1_balance <> 0    AND
    rep_pay_cal_standard.rep_1_draw_paid = 0  AND
    rep_pay_cal_standard.ntp IS NOT NULL    AND
    rep_pay_cal_standard.inst_sys IS NULL
);
 
CREATE VIEW pr_r1_f AS
SELECT
    rep_pay_cal_standard.dealer AS dealer,
    rep_pay_cal_standard.home_owner AS home_owner,
    rep_pay_cal_standard.unique_id AS unique_id,
    rep_pay_cal_standard.rep_1 AS rep_1,
    rep_pay_cal_standard.rep_1_dba AS rep_1_dba,
    rep_pay_cal_standard.status AS status,
    rep_pay_cal_standard.status_date AS status_date,
    rep_pay_cal_standard.rep_1_balance AS rep_1_balance,
    rep_pay_cal_standard.rep_1_comm_paid AS rep_1_comm_paid,
    rep_pay_cal_standard.system_size AS system_size,
    rep_pay_cal_standard.contract_total AS contract_total,
    rep_pay_cal_standard.loan_fee AS loan_fee,
    rep_pay_cal_standard.epc AS epc,
    rep_pay_cal_standard.rep_1_addr AS rep_1_addr,
    rep_pay_cal_standard.rep_1_rr AS rep_1_rr,
    rep_pay_cal_standard.rep_1_position AS rep_1_position,
    rep_pay_cal_standard.rep_1_net_epc AS rep_1_net_epc,
    rep_pay_cal_standard.rep_1_credit AS rep_1_credit,
    rep_pay_cal_standard.rep_2 AS rep_2,
    rep_pay_cal_standard.rep_1_comm_status_check AS rep_1_comm_status_check,
    rep_pay_cal_standard.rep_1_draw_amount AS rep_1_draw_amount,
    rep_pay_cal_standard.loan_type AS loan_type,
    rep_pay_cal_standard.state AS state,
    rep_pay_cal_standard.wc AS wc,
    rep_pay_cal_standard.commission_model AS commission_model,
    rep_pay_cal_standard.pr_r1_f_type AS pr_r1_f_type,
    rep_pay_cal_standard.pr_r1_f_today AS pr_r1_f_today,
    rep_pay_cal_standard.pr_r1_f_status AS pr_r1_f_status,
    rep_pay_cal_standard.REP_COMM as sheet_type
FROM
    rep_pay_cal_standard
WHERE
(
    rep_pay_cal_standard.wc > '2018-12-31'  AND
        rep_pay_cal_standard.ntp IS NOT NULL    AND
        rep_pay_cal_standard.rep_1_balance <> 0    AND
     (
        (
            rep_pay_cal_standard.status = 'Hold' OR
            rep_pay_cal_standard.status = 'Jeopardy'
        )                                           OR
        rep_pay_cal_standard.cancel IS NOT NULL OR
        (
            rep_pay_cal_standard.inst_sys IS NOT NULL AND
            rep_pay_cal_standard.rep_pay = 'YES'
        )
    )
);
 
CREATE VIEW pr_r1_b AS
SELECT
    rep_pay_cal_standard.dealer AS dealer,
    rep_pay_cal_standard.home_owner AS home_owner,
    rep_pay_cal_standard.unique_id AS unique_id,
    rep_pay_cal_standard.rep_1 AS rep_1,
    rep_pay_cal_standard.per_team_kw AS per_team_kw,
    rep_pay_cal_standard.state AS status,
    rep_pay_cal_standard.status_date AS status_date,
    rep_pay_cal_standard.rep_1_rl AS rep_2_rl,
    rep_pay_cal_standard.rep_1_rate AS rep_2_rate,
    rep_pay_cal_standard.wc AS wc,
    rep_pay_cal_standard.state AS state,
    rep_pay_cal_standard.commission_model AS commission_model,
    rep_pay_cal_standard.pr_r1_b_type AS pr_r1_b_type,
    rep_pay_cal_standard.pr_r1_b_today AS pr_r1_b_today,
    rep_pay_cal_standard.pr_r1_b_status AS pr_r1_b_status,
    rep_pay_cal_standard.REP_BONUS as sheet_type
FROM
    rep_pay_cal_standard
WHERE
(
    rep_pay_cal_standard.wc > '2018-12-31'  AND
    rep_pay_cal_standard.rep_2_rate <> 0 AND
    rep_pay_cal_standard.inst_sys IS NOT NULL
);
 
CREATE VIEW pr_r2_d AS
SELECT
    rep_pay_cal_standard.dealer as dealer,
    rep_pay_cal_standard.home_owner as home_owner,
    rep_pay_cal_standard.unique_id as unique_id,
    rep_pay_cal_standard.rep_2 as rep_2,
    rep_pay_cal_standard.rep_2_dba as rep_2_dba,
    rep_pay_cal_standard.status as status,
    rep_pay_cal_standard.status_date as status_date,
    rep_pay_cal_standard.rep_2_draw_amount as rep_2_draw_amount,
    rep_pay_cal_standard.rep_2_comm_paid as rep_2_comm_paid,
    rep_pay_cal_standard.rep_2_balance as rep_2_balance,
    rep_pay_cal_standard.contract_total as contract_total,
    rep_pay_cal_standard.system_size as system_size,
    rep_pay_cal_standard.loan_fee as loan_fee,
    rep_pay_cal_standard.epc as epc,
    rep_pay_cal_standard.rep_2_addr as rep_2_addr,
    rep_pay_cal_standard.rep_2_rr as rep_2_rr,
    rep_pay_cal_standard.rep_2_position as rep_2_position,
    rep_pay_cal_standard.rep_2_net_epc as rep_2_net_epc,
    rep_pay_cal_standard.rep_2_credit as rep_2_credit,
    rep_pay_cal_standard.rep_2_comm_status_check as rep_2_comm_status_check,
    rep_pay_cal_standard.rep_1 as rep_1,
    rep_pay_cal_standard.loan_type as loan_type,
    rep_pay_cal_standard.wc as wc,
    rep_pay_cal_standard.state as state,
    rep_pay_cal_standard.commission_model AS commission_model,
    rep_pay_cal_standard.pr_r2_d_type AS pr_r2_d_type,
    rep_pay_cal_standard.pr_r2_d_today AS pr_r2_d_today,
    rep_pay_cal_standard.pr_r2_d_status AS pr_r2_d_status,
    rep_pay_cal_standard.REP_COMM as sheet_type
FROM
    rep_pay_cal_standard
WHERE
(
    rep_pay_cal_standard.wc > '2018-12-31'  AND
    rep_pay_cal_standard.rep_2_balance <> 0  AND
    rep_pay_cal_standard.rep_2_draw_paid = 0  AND
    rep_pay_cal_standard.ntp IS NOT NULL    AND
    rep_pay_cal_standard.inst_sys IS NULL    AND
    rep_pay_cal_standard.rep_pay = 'YES'
);
 
CREATE VIEW pr_r2_f AS
SELECT
    rep_pay_cal_standard.dealer as dealer,
    rep_pay_cal_standard.home_owner as home_owner,
    rep_pay_cal_standard.unique_id as unique_id,
    rep_pay_cal_standard.rep_2 as rep_2,
    rep_pay_cal_standard.rep_2_dba as rep_2_dba,
    rep_pay_cal_standard.status as status,
    rep_pay_cal_standard.status_date as status_date,
    rep_pay_cal_standard.rep_2_balance as rep_2_balance,
    rep_pay_cal_standard.rep_2_comm_paid as rep_2_comm_paid,
    rep_pay_cal_standard.system_size as system_size,
    rep_pay_cal_standard.contract_total as contract_total,
    rep_pay_cal_standard.loan_fee as loan_fee,
    rep_pay_cal_standard.epc as epc,
    rep_pay_cal_standard.rep_2_addr as rep_2_addr,
    rep_pay_cal_standard.rep_2_rr as rep_2_rr,
    rep_pay_cal_standard.rep_2_net_epc as rep_2_net_epc,
    rep_pay_cal_standard.rep_2_position as rep_2_position,
    rep_pay_cal_standard.rep_2_credit as rep_2_credit,
    rep_pay_cal_standard.rep_1 as rep_1,
    rep_pay_cal_standard.rep_2_draw_amount as rep_2_draw_amount,
    rep_pay_cal_standard.loan_type as loan_type,
    rep_pay_cal_standard.wc as wc,
    rep_pay_cal_standard.state as state,
    rep_pay_cal_standard.commission_model AS commission_model,
    rep_pay_cal_standard.pr_r2_f_type AS pr_r2_f_type,
    rep_pay_cal_standard.pr_r2_f_today AS pr_r2_f_today,
    rep_pay_cal_standard.pr_r2_f_status AS pr_r2_f_status,
    rep_pay_cal_standard.REP_COMM as sheet_type
FROM
    rep_pay_cal_standard
WHERE(
    rep_pay_cal_standard.wc > '2018-12-31' AND
    rep_pay_cal_standard.ntp IS NOT NULL AND
    rep_pay_cal_standard.rep_2_balance != 0 AND
    (
        rep_pay_cal_standard.status = 'Hold' OR
        rep_pay_cal_standard.status = 'Jeopardy' OR
        rep_pay_cal_standard.cancel IS NOT NULL OR
        rep_pay_cal_standard.inst_sys IS NOT NULL
    ) AND
    rep_pay_cal_standard.rep_pay = 'YES'
);
 
 
 
CREATE VIEW pr_r2_b AS
SELECT
    rep_pay_cal_standard.dealer AS dealer,
    rep_pay_cal_standard.home_owner AS home_owner,
    rep_pay_cal_standard.unique_id AS unique_id,
    rep_pay_cal_standard.rep_2 AS rep_2,
    rep_pay_cal_standard.rep_1_loan_fee as rep_1_loan_fee,
    rep_pay_cal_standard.status as status,
    rep_pay_cal_standard.status_date as status_date,
    rep_pay_cal_standard.rep_2_min_rate as rep_2_min_rate,
    rep_pay_cal_standard.rep_2_max_rate as rep_2_max_rate,
    rep_pay_cal_standard.wc AS wc,
    rep_pay_cal_standard.state AS state,
    rep_pay_cal_standard.commission_model AS commission_model,
    rep_pay_cal_standard.pr_r2_b_type AS pr_r2_b_type,
    rep_pay_cal_standard.pr_r2_b_today AS pr_r2_b_today,
    rep_pay_cal_standard.pr_r2_b_status AS pr_r2_b_status,
    rep_pay_cal_standard.REP_BONUS as sheet_type
FROM
    rep_pay_cal_standard
WHERE
(
    rep_pay_cal_standard.wc > '2018-12-31'  AND
    rep_pay_cal_standard.rep_2_max_rate <> 0 AND
    rep_pay_cal_standard.inst_sys IS NOT NULL
);
 
CREATE VIEW pr_r1_sl AS
SELECT
    rep_pay_cal_ovrrd_standard.dealer AS dealer,
    rep_pay_cal_ovrrd_standard.home_owner AS home_owner,
    rep_pay_cal_ovrrd_standard.unique_id AS unique_id,
    rep_pay_cal_ovrrd_standard.r1_sl_name as r1_sl_name,
    rep_pay_cal_ovrrd_standard.r1_sl_dba as r1_sl_dba,
    rep_pay_cal_ovrrd_standard.status as status,
    rep_pay_cal_ovrrd_standard.status_date as status_date,
    rep_pay_cal_ovrrd_standard.r1_sl_bal as r1_sl_balance,
    rep_pay_cal_ovrrd_standard.r1_sl_paid as r1_sl_paid,
    rep_pay_cal_ovrrd_standard.system_size as system_size,
    rep_pay_cal_ovrrd_standard.commission_model AS commission_model,
    rep_pay_cal_ovrrd_standard.pr_r1_sl_type AS pr_r1_sl_type,
    rep_pay_cal_ovrrd_standard.pr_r1_sl_today AS pr_r1_sl_today,
    rep_pay_cal_ovrrd_standard.pr_r1_sl_status AS pr_r1_sl_status,
    rep_pay_cal_ovrrd_standard.LEADER_OVRD AS sheet_type
FROM
    rep_pay_cal_ovrrd_standard
WHERE
(
    rep_pay_cal_ovrrd_standard.wc > '2013-01-01'  AND
    rep_pay_cal_ovrrd_standard.r1_sl_bal <> 0 AND
    rep_pay_cal_ovrrd_standard.inst_sys IS NOT NULL
);
 
CREATE VIEW pr_r1_dm AS
SELECT
    rep_pay_cal_ovrrd_standard.dealer AS dealer,
    rep_pay_cal_ovrrd_standard.home_owner AS home_owner,
    rep_pay_cal_ovrrd_standard.unique_id AS unique_id,
    rep_pay_cal_ovrrd_standard.status as status,
    rep_pay_cal_ovrrd_standard.status_date as status_date,
    rep_pay_cal_ovrrd_standard.r1_dm_name as r1_dm_name,
    rep_pay_cal_ovrrd_standard.r1_dm_dba as r1_dm_dba,
    rep_pay_cal_ovrrd_standard.r1_dm_bal as r1_dm_balance,
    rep_pay_cal_ovrrd_standard.r1_dm_paid as r1_dm_paid,
    rep_pay_cal_ovrrd_standard.system_size as system_size,
    rep_pay_cal_ovrrd_standard.commission_model AS commission_model,
    rep_pay_cal_ovrrd_standard.pr_r1_dm_type AS pr_r1_dm_type,
    rep_pay_cal_ovrrd_standard.pr_r1_dm_today AS pr_r1_dm_today,
    rep_pay_cal_ovrrd_standard.pr_r1_dm_status AS pr_r1_dm_status,
    rep_pay_cal_ovrrd_standard.LEADER_OVRD AS sheet_type
FROM
    rep_pay_cal_ovrrd_standard
WHERE
(
    rep_pay_cal_ovrrd_standard.wc > '2013-01-01'  AND
    rep_pay_cal_ovrrd_standard.r1_dm_bal <> 0 AND
    rep_pay_cal_ovrrd_standard.inst_sys IS NOT NULL
);
 
CREATE VIEW pr_r1_dir AS
SELECT
    rep_pay_cal_ovrrd_standard.dealer AS dealer,
    rep_pay_cal_ovrrd_standard.home_owner AS home_owner,
    rep_pay_cal_ovrrd_standard.unique_id AS unique_id,
    rep_pay_cal_ovrrd_standard.status as status,
    rep_pay_cal_ovrrd_standard.status_date as status_date,
    rep_pay_cal_ovrrd_standard.r1_dir_name as r1_dir_name,
    rep_pay_cal_ovrrd_standard.r1_dir_dba as r1_dir_dba,
    rep_pay_cal_ovrrd_standard.r1_dir_bal as r1_dir_balance,
    rep_pay_cal_ovrrd_standard.r1_dir_paid as r1_dir_paid,
    rep_pay_cal_ovrrd_standard.system_size as system_size,
    rep_pay_cal_ovrrd_standard.commission_model AS commission_model,
    rep_pay_cal_ovrrd_standard.pr_r1_dir_type AS pr_r1_dir_type,
    rep_pay_cal_ovrrd_standard.pr_r1_dir_today AS pr_r1_dir_today,
    rep_pay_cal_ovrrd_standard.pr_r1_dir_status AS pr_r1_dir_status,
    rep_pay_cal_ovrrd_standard.LEADER_OVRD AS sheet_type
FROM
    rep_pay_cal_ovrrd_standard
WHERE
(
    rep_pay_cal_ovrrd_standard.wc > '2013-01-01'  AND
    rep_pay_cal_ovrrd_standard.r1_dir_bal <> 0 AND
    rep_pay_cal_ovrrd_standard.inst_sys IS NOT NULL
);
 
CREATE VIEW pr_r2_sl AS
SELECT
    rep_pay_cal_ovrrd_standard.dealer AS dealer,
    rep_pay_cal_ovrrd_standard.home_owner AS home_owner,
    rep_pay_cal_ovrrd_standard.unique_id AS unique_id,
    rep_pay_cal_ovrrd_standard.r2_sl_name as r2_sl_name,
    rep_pay_cal_ovrrd_standard.r2_sl_dba as r2_sl_dba,
    rep_pay_cal_ovrrd_standard.status as status,
    rep_pay_cal_ovrrd_standard.status_date as status_date,
    rep_pay_cal_ovrrd_standard.r2_sl_bal as r2_sl_balance,
    rep_pay_cal_ovrrd_standard.r2_sl_paid as r2_sl_paid,
    rep_pay_cal_ovrrd_standard.system_size as system_size,
    rep_pay_cal_ovrrd_standard.commission_model AS commission_model,
    rep_pay_cal_ovrrd_standard.pr_r2_sl_type AS pr_r2_sl_type,
    rep_pay_cal_ovrrd_standard.pr_r2_sl_today AS pr_r2_sl_today,
    rep_pay_cal_ovrrd_standard.pr_r2_sl_status AS pr_r2_sl_status,
    rep_pay_cal_ovrrd_standard.LEADER_OVRD AS sheet_type
FROM
    rep_pay_cal_ovrrd_standard
WHERE
(
    rep_pay_cal_ovrrd_standard.wc > '2013-01-01'  AND
    rep_pay_cal_ovrrd_standard.r2_sl_bal <> 0 AND
    rep_pay_cal_ovrrd_standard.inst_sys IS NOT NULL
);
 
CREATE VIEW pr_r2_dm AS
SELECT
    rep_pay_cal_ovrrd_standard.dealer AS dealer,
    rep_pay_cal_ovrrd_standard.home_owner AS home_owner,
    rep_pay_cal_ovrrd_standard.unique_id AS unique_id,
    rep_pay_cal_ovrrd_standard.status as status,
    rep_pay_cal_ovrrd_standard.status_date as status_date,
    rep_pay_cal_ovrrd_standard.r2_dm_name as r2_dm_name,
    rep_pay_cal_ovrrd_standard.r2_dm_dba as r2_dm_dba,
    rep_pay_cal_ovrrd_standard.r2_dm_bal as r2_dm_balance,
    rep_pay_cal_ovrrd_standard.r2_dm_paid as r2_dm_paid,
    rep_pay_cal_ovrrd_standard.system_size as system_size,
    rep_pay_cal_ovrrd_standard.commission_model AS commission_model,
    rep_pay_cal_ovrrd_standard.pr_r2_dm_type AS pr_r2_dm_type,
    rep_pay_cal_ovrrd_standard.pr_r2_dm_today AS pr_r2_dm_today,
    rep_pay_cal_ovrrd_standard.pr_r2_dm_status AS pr_r2_dm_status,
    rep_pay_cal_ovrrd_standard.LEADER_OVRD AS sheet_type
FROM
    rep_pay_cal_ovrrd_standard
WHERE
(
    rep_pay_cal_ovrrd_standard.wc > '2013-01-01'  AND
    rep_pay_cal_ovrrd_standard.r2_dm_bal <> 0 AND
    rep_pay_cal_ovrrd_standard.inst_sys IS NOT NULL
);
 
CREATE VIEW pr_r2_dir AS
SELECT
    rep_pay_cal_ovrrd_standard.dealer AS dealer,
    rep_pay_cal_ovrrd_standard.home_owner AS home_owner,
    rep_pay_cal_ovrrd_standard.unique_id AS unique_id,
    rep_pay_cal_ovrrd_standard.status as status,
    rep_pay_cal_ovrrd_standard.status_date as status_date,
    rep_pay_cal_ovrrd_standard.r2_dir_name as r2_dir_name,
    rep_pay_cal_ovrrd_standard.r2_dir_dba as r2_dir_dba,
    rep_pay_cal_ovrrd_standard.r2_dir_bal as r2_dir_balance,
    rep_pay_cal_ovrrd_standard.r2_dir_paid as r2_dir_paid,
    rep_pay_cal_ovrrd_standard.system_size as system_size,
    rep_pay_cal_ovrrd_standard.commission_model AS commission_model,
    rep_pay_cal_ovrrd_standard.pr_r2_dir_type AS pr_r2_dir_type,
    rep_pay_cal_ovrrd_standard.pr_r2_dir_today AS pr_r2_dir_today,
    rep_pay_cal_ovrrd_standard.pr_r2_dir_status AS pr_r2_dir_status,
    rep_pay_cal_ovrrd_standard.LEADER_OVRD AS sheet_type
    
FROM
    rep_pay_cal_ovrrd_standard
WHERE
(
    rep_pay_cal_ovrrd_standard.wc > '2013-01-01'  AND
    rep_pay_cal_ovrrd_standard.r2_dir_bal <> 0 AND
    rep_pay_cal_ovrrd_standard.inst_sys IS NOT NULL
);
 
CREATE VIEW pr_appt AS
SELECT
    rep_pay_cal_standard.dealer AS dealer,
    rep_pay_cal_standard.home_owner AS home_owner,
    rep_pay_cal_standard.unique_id AS unique_id,
    rep_pay_cal_standard.appt_setter as appt_setter,
    rep_pay_cal_standard.status as status,
    rep_pay_cal_standard.status_date as status_date,
    rep_pay_cal_standard.appt_set_dba as appt_set_dba,
    rep_pay_cal_standard.appt_balance as appt_balance,
    rep_pay_cal_standard.appt_paid as appt_paid,
    rep_pay_cal_standard.state as state,
    rep_pay_cal_standard.wc as wc,
    rep_pay_cal_standard.commission_model AS commission_model,
    rep_pay_cal_standard.pr_appt_type AS pr_appt_type,
    rep_pay_cal_standard.pr_appt_today AS pr_appt_today,
    rep_pay_cal_standard.pr_appt_status AS pr_appt_status,
    rep_pay_cal_standard.REP_COMM as sheet_type
FROM
    rep_pay_cal_standard
WHERE(
    rep_pay_cal_standard.wc > '2018-12-31' AND
    rep_pay_cal_standard.appt_balance <> 0 AND
    (
        rep_pay_cal_standard.status = 'Hold' OR
        rep_pay_cal_standard.status = 'Jeopardy' OR
        rep_pay_cal_standard.cancel IS NOT NULL OR
        rep_pay_cal_standard.inst_sys IS NOT NULL
    )
);
 
 
CREATE VIEW rep_pay_pr_data AS
  SELECT
        home_owner as home_owner,
        status as current_status,
        status_date as status_date,
        unique_id as unique_id,
        rep_1 as owe_contractor,
        rep_1_dba as DBA,
        pr_r1_d_type as type, --need to calculate
        pr_r1_d_today as Today, --need to calculate
        rep_1_draw_amount as Amount,
        loan_type as finance_type,
        system_size as sys_size,
        contract_total as contract_total,
        loan_fee as loan_fee,
        epc as epc,
        rep_1_addr as adders,
        rep_1_rr as r_r,
        rep_1_position as comm_rate,
        rep_1_net_epc as net_epc,
        rep_1_credit as credit,
        rep_2 as rep_2,
        rep_1_comm_status_check as net_comm,
        rep_1_draw_amount as draw_amt,
        rep_1_comm_paid as amt_paid,
        rep_1_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
        commission_model AS commission_model,
        pr_r1_d_status as rep_status,
        sheet_type as sheet_type
FROM pr_r1_d
UNION ALL
    SELECT
        home_owner as home_owner,
        status as current_status,
        status_date as status_date,
        unique_id as unique_id,
        rep_1 as owe_contractor,
        rep_1_dba as DBA,
        pr_r1_f_type as type, --need to calculate
        pr_r1_f_today as Today, --need to calculate
        rep_1_balance as Amount,
        loan_type as finance_type,
        system_size as sys_size,
        contract_total as contract_total,
        loan_fee as loan_fee,
        epc as epc,
        rep_1_addr as adders,
        rep_1_rr as r_r,
        rep_1_position as comm_rate,
        rep_1_net_epc as net_epc,
        rep_1_credit as credit,
        rep_2 as rep_2,
        rep_1_comm_status_check as net_comm,
        rep_1_draw_amount as draw_amt,
        rep_1_comm_paid as amt_paid,
        rep_1_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_r1_f_status as rep_status,
    sheet_type as sheet_type
FROM pr_r1_f
UNION ALL
    SELECT
        home_owner as home_owner,
        status as current_status,
        status_date as status_date,
        unique_id as unique_id,
        rep_1 as owe_contractor,
        NULL as DBA,
        pr_r1_b_type as type, --need to calculate
        pr_r1_b_today as Today, --need to calculate
        rep_2_rate as Amount,
        NULL as finance_type, --need to calculate type
        NULL as sys_size,
        NULL as contract_total,
        NULL as loan_fee,
        NULL as epc,
        NULL as adders,
        NULL as r_r,
        NULL as comm_rate,
        NULL as net_epc,
        NULL as credit,
        NULL as rep_2,
        NULL as net_comm,
        NULL as draw_amt,
        rep_2_rl as amt_paid,
        rep_2_rate as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_r1_b_status as rep_status,
    sheet_type as sheet_type
FROM pr_r1_b
UNION ALL
SELECT
        home_owner as home_owner,
        status as current_status,
        status_date as status_date,
        unique_id as unique_id,
        rep_2 as owe_contractor,
        rep_2_dba as DBA,
        pr_r2_d_type as type, --need to calculate
        pr_r2_d_today as Today, --need to calculate
        rep_2_draw_amount as Amount,
        loan_type as finance_type,
        system_size as sys_size,
        contract_total as contract_total,
        loan_fee as loan_fee,
        epc as epc,
        rep_2_addr as adders,
        rep_2_rr as r_r,
        rep_2_position as comm_rate,
        rep_2_net_epc as net_epc,
        rep_2_credit as credit,
        rep_1 as rep_1,
        rep_2_comm_status_check as net_comm,
        rep_2_draw_amount as draw_amt,
        rep_2_comm_paid as amt_paid,
        rep_2_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_r2_d_status as rep_status,
    sheet_type as sheet_type
FROM pr_r2_d
UNION ALL
    SELECT
        home_owner as home_owner,
        status as current_status,
        status_date as status_date,
        unique_id as unique_id,
        rep_2 as owe_contractor,
        rep_2_dba as DBA,
        pr_r2_f_type as type, --need to calculate
        pr_r2_f_today as Today, --need to calculate
        rep_2_balance as Amount,
        loan_type as finance_type,
        system_size as sys_size,
        contract_total as contract_total,
        loan_fee as loan_fee,
        epc as epc,
        rep_2_addr as adders,
        rep_2_rr as r_r,
        rep_2_position as comm_rate,
        rep_2_net_epc as net_epc,
        rep_2_credit as credit,
        rep_1 as rep_1,
        NULL as net_comm,
        rep_2_draw_amount as draw_amt,
        rep_2_comm_paid as amt_paid,
        rep_2_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_r2_f_status as rep_status,
    sheet_type as sheet_type
FROM pr_r2_f
UNION ALL
    SELECT
        home_owner as home_owner,
        status as current_status,
        status_date as status_date,
        unique_id as unique_id,
        rep_2 as owe_contractor,
        NULL as DBA,
        pr_r2_b_type as type, --need to calculate
        pr_r2_b_today as Today, --need to calculate
        rep_2_max_rate as Amount,
        NULL as finance_type,--need to calculate type
        NULL as sys_size,
        NULL as contract_total,
        NULL as loan_fee,
        NULL as epc,
        NULL as adders,
        NULL as r_r,
        NULL as comm_rate,
        NULL as net_epc,
        NULL as credit,
        NULL as rep_2,
        NULL as net_comm,
        NULL as draw_amt,
        rep_2_min_rate as amt_paid,
        rep_2_max_rate as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_r2_b_status as rep_status,
    sheet_type as sheet_type
FROM pr_r2_b
UNION ALL
    SELECT
        home_owner as home_owner,
        status as current_status,
        status_date as status_date,
        unique_id as unique_id,
        r1_sl_name as owe_contractor,
        r1_sl_dba as DBA,
        pr_r1_sl_type as type, --need to calculate
        pr_r1_sl_today as Today, --need to calculate
        r1_sl_balance as Amount,
        NULL as finance_type,--need to calculate type
        system_size as sys_size,
        NULL as contract_total,
        NULL as loan_fee,
        NULL as epc,
        NULL as adders, -- here
        NULL as r_r,
        NULL as comm_rate,
        NULL as net_epc,
        NULL as credit,
        NULL as rep_2,
        NULL as net_comm,
        NULL as draw_amt,
        r1_sl_paid as amt_paid,
        r1_sl_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_r1_sl_status as rep_status,
    sheet_type as sheet_type
FROM pr_r1_sl
UNION ALL
    SELECT
        home_owner as home_owner,
        status as current_status,
        status_date as status_date,
        unique_id as unique_id,
        r2_sl_name as owe_contractor,
        r2_sl_dba as DBA,
        pr_r2_sl_type as type, --need to calculate
        pr_r2_sl_today as Today, --need to calculate
        r2_sl_balance as Amount,
        NULL as finance_type,--need to calculate type
        system_size as sys_size,
        NULL as contract_total,
        NULL as loan_fee,
        NULL as epc,
        NULL as adders, -- here
        NULL as r_r,
        NULL as comm_rate,
        NULL as net_epc,
        NULL as credit,
        NULL as rep_2,
        NULL as net_comm,
        NULL as draw_amt,
        r2_sl_paid as amt_paid,
        r2_sl_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_r2_sl_status as rep_status,
    sheet_type as sheet_type
FROM pr_r2_sl
UNION ALL
    SELECT
        home_owner as home_owner,
        status as current_status,
        status_date as status_date,
        unique_id as unique_id,
        r1_dm_name as owe_contractor,
        r1_dm_dba as DBA,
        pr_r1_dm_type as type, --need to calculate
        pr_r1_dm_today as Today, --need to calculate
        r1_dm_balance as Amount,
        NULL as finance_type,--need to calculate type
        system_size as sys_size,
        NULL as contract_total,
        NULL as loan_fee,
        NULL as epc,
        NULL as adders, -- here
        NULL as r_r,
        NULL as comm_rate,
        NULL as net_epc,
        NULL as credit,
        NULL as rep_2,
        NULL as net_comm,
        NULL as draw_amt,
        r1_dm_paid as amt_paid,
        r1_dm_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_r1_dm_status as rep_status,
    sheet_type as sheet_type
FROM pr_r1_dm
UNION ALL
    SELECT
        home_owner as home_owner,
        status as current_status,
        status_date as status_date,
        unique_id as unique_id,
        r2_dm_name as owe_contractor,
        r2_dm_dba as DBA,
        pr_r2_dm_type as type, --need to calculate
        pr_r2_dm_today as Today, --need to calculate
        r2_dm_balance as Amount,
        NULL as finance_type,--need to calculate type
        system_size as sys_size,
        NULL as contract_total,
        NULL as loan_fee,
        NULL as epc,
        NULL as adders, -- here
        NULL as r_r,
        NULL as comm_rate,
        NULL as net_epc,
        NULL as credit,
        NULL as rep_2,
        NULL as net_comm,
        NULL as draw_amt,
        r2_dm_paid as amt_paid,
        r2_dm_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_r2_dm_status as rep_status,
    sheet_type as sheet_type
FROM pr_r2_dm
UNION ALL
    SELECT
        home_owner as home_owner,
        status as current_status,
        status_date as status_date,
        unique_id as unique_id,
        r1_dir_name as owe_contractor,
        r1_dir_dba as DBA,
        pr_r1_dir_type as type, --need to calculate
        pr_r1_dir_today as Today, --need to calculate
        r1_dir_balance as Amount,
        NULL as finance_type,--need to calculate type
        system_size as sys_size,
        NULL as contract_total,
        NULL as loan_fee,
        NULL as epc,
        NULL as adders, -- here
        NULL as r_r,
        NULL as comm_rate,
        NULL as net_epc,
        NULL as credit,
        NULL as rep_2,
        NULL as net_comm,
        NULL as draw_amt,
        r1_dir_paid as amt_paid,
        r1_dir_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_r1_dir_status as rep_status,
    sheet_type as sheet_type
FROM pr_r1_dir
UNION ALL
    SELECT
        home_owner as home_owner,
        status as current_status,
        status_date as status_date,
        unique_id as unique_id,
        r2_dir_name as owe_contractor,
        r2_dir_dba as DBA,
        pr_r2_dir_type as type, --need to calculate
        pr_r2_dir_today as Today, --need to calculate
        r2_dir_balance as Amount,
        NULL as finance_type,--need to calculate type
        system_size as sys_size,
        NULL as contract_total,
        NULL as loan_fee,
        NULL as epc,
        NULL as adders, -- here
        NULL as r_r,
        NULL as comm_rate,
        NULL as net_epc,
        NULL as credit,
        NULL as rep_2,
        NULL as net_comm,
        NULL as draw_amt,
        r2_dir_paid as amt_paid,
        r2_dir_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_r2_dir_status as rep_status,
    sheet_type as sheet_type
FROM pr_r2_dir
UNION ALL
    SELECT
        home_owner as home_owner,
        status as current_status,
        status_date as status_date,
        unique_id as unique_id,
        appt_setter as owe_contractor,
        appt_set_dba as DBA,
        pr_appt_type as type, --need to calculate
        pr_appt_today as Today, --need to calculate
        appt_balance as Amount,
        NULL as finance_type,--need to calculate type
        NULL as sys_size,
        NULL as contract_total,
        NULL as loan_fee,
        NULL as epc,
        NULL as adders, -- here
        NULL as r_r,
        NULL as comm_rate,
        NULL as net_epc,
        NULL as credit,
        NULL as rep_2,
        NULL as net_comm,
        NULL as draw_amt,
        appt_paid as amt_paid,
        appt_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_appt_status as rep_status,
    sheet_type as sheet_type
FROM pr_appt
UNION ALL
    SELECT
        home_owner as home_owner,
        NULL as current_status,
        ap_oth_date as status_date,
        unique_id as unique_id,
        ap_oth_payee as owe_contractor,
        NULL as DBA,
        pr_oth_type as type, --need to calculate
        pr_oth_today as Today, --need to calculate
        ap_oth_balance as Amount,
        NULL as finance_type,--need to calculate type
        NULL as sys_size,
        NULL as contract_total,
        NULL as loan_fee,
        NULL as epc,
        NULL as adders, -- here
        NULL as r_r,
        NULL as comm_rate,
        NULL as net_epc,
        NULL as credit,
        NULL as rep_2,
        NULL as net_comm,
        NULL as draw_amt,
        ap_oth_paid as amt_paid,
        ap_oth_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_oth_status as rep_status,
    AP_OTH as sheet_type
FROM rep_pay_cal_standard -- for ap-oth
UNION ALL
    SELECT
        home_owner as home_owner,
        NULL as current_status,
        ap_ded_date as status_date,
        unique_id as unique_id,
        ap_ded_payee as owe_contractor,
        NULL as DBA,
        pr_ded_type as type, --need to calculate
        pr_ded_today as Today, --need to calculate
        ap_ded_balance as Amount,
        NULL as finance_type,--need to calculate type
        NULL as sys_size,
        NULL as contract_total,
        NULL as loan_fee,
        NULL as epc,
        NULL as adders, -- here
        NULL as r_r,
        NULL as comm_rate,
        NULL as net_epc,
        NULL as credit,
        NULL as rep_2,
        NULL as net_comm,
        NULL as draw_amt,
        ap_ded_paid_amnt as amt_paid,
        ap_ded_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_ded_status as rep_status,
    AP_DED as sheet_type
FROM rep_pay_cal_standard -- for ap-ded
UNION ALL
    SELECT
        home_owner as home_owner,
        NULL as current_status,
        ap_pda_date as status_date,
        unique_id as unique_id,
        ap_pda_payee as owe_contractor,
        ap_pda_dba as DBA,
        pr_pda_type as type, --need to calculate
        pr_pda_today as Today, --need to calculate
        ap_pda_paid_balance as Amount,
        NULL as finance_type,--need to calculate type
        NULL as sys_size,
        NULL as contract_total,
        NULL as loan_fee,
        NULL as epc,
        NULL as adders, -- here
        NULL as r_r,
        NULL as comm_rate,
        NULL as net_epc,
        NULL as credit,
        NULL as rep_2,
        NULL as net_comm,
        NULL as draw_amt,
        ap_pda_paid_amnt as amt_paid,
        ap_pda_paid_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_pda_status as rep_status,
    AP_PDA as sheet_type
FROM rep_pay_cal_standard -- for ap-pda
UNION ALL
    SELECT
        home_owner as home_owner,
        NULL as current_status,
        ap_adv_date as status_date,
        unique_id as unique_id,
        ap_adv_payee as owe_contractor,
        ap_adv_dba as DBA,
        pr_adv_type as type, --need to calculate
        pr_adv_today as Today, --need to calculate
        ap_adv_paid_balance as Amount,
        NULL as finance_type,--need to calculate type
        NULL as sys_size,
        NULL as contract_total,
        NULL as loan_fee,
        NULL as epc,
        NULL as adders, -- here
        NULL as r_r,
        NULL as comm_rate,
        NULL as net_epc,
        NULL as credit,
        NULL as rep_2,
        NULL as net_comm,
        NULL as draw_amt,
        ap_adv_paid_amnt as amt_paid,
        ap_adv_paid_balance as balance,
        dealer as dealer_code,
        NULL as subtotal,
        NULL as max_per_rep,
        NULL as total_per_rep,
    commission_model AS commission_model,
    pr_adv_status as rep_status,
    AP_ADV as sheet_type
FROM rep_pay_cal_standard -- for ap-ADV
 
 
 