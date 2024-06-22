
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
	epcCalc float,
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
	r1_sl_name varchar,
	r1_sl_dba varchar,
	r1_sl_balance float,
	r1_sl_paid float,
	r1_dm_name varchar,
	r1_dm_dba varchar,
	r1_dm_bal float,
	r1_dm_paid float,
	team_count float,
	ap_oth_paid float,
	ap_oth_balance float,
	ap_pda_rc_amnt float,
	ap_pda_amnt float,
	ap_pda_paid_amnt float,
	ap_pda_claw_amnt float,
	ap_pda_paid_balance float,
	ap_pda_dba varchar,
	ap_adv_rc_amt float,
	ap_adv_amnt float,
	ap_adv_paid amnt float,
	ap_adv_paid_balance float,
	ap_adv_dba varchar,
	ap_ded_paid_amnt float,
	ap_ded_balance float
	commission_model TEXT
	
);

CREATE VIEW pr_r1_d AS
SELECT
    rep_pay_cal_standard.home_owner,
		rep_pay_cal_standard.status,
		rep_pay_cal_standard.status_date,
		rep_pay_cal_standard.dealer,
		rep_pay_cal_standard.unique_id,
		rep_pay_cal_standard.contract_total,
		rep_pay_cal_standard.rep_1_dba,
		rep_pay_cal_standard.rep_1_draw_amount,
		rep_pay_cal_standard.rep_1_comm_paid,
		rep_pay_cal_standard.rep_1_balance,
		rep_pay_cal_standard.sys_size,
		rep_pay_cal_standard.loan_fee,
		rep_pay_cal_standard.epc,
		rep_pay_cal_standard.rep_1_addr,
		rep_pay_cal_standard.rep_1_rr,
		rep_pay_cal_standard.rep_1_net_epc,
		rep_pay_cal_standard.rep_1_credit,
		rep_pay_cal_standard.rep_2,
		rep_pay_cal_standard.r1_comm_status_check,
		rep_pay_cal_standard.loan_type,
		rep_pay_cal_standard.wc,
		rep_pay_cal_standard.state,
    rep_pay_cal_standard.commission_model AS commission_model
FROM
    rep_pay_cal_standard
WHERE
(
    dealer_pay_calc_standard.wc > '2018-12-31'  AND
    dealer_pay_calc_standard.rep_pay = 'YES'  AND
    dealer_pay_calc_standard.rep_1_balance <> 0    AND
    dealer_pay_calc_standard.rep_1_draw_paid = 0  AND
    dealer_pay_calc_standard.ntp IS NOT NULL    AND
    dealer_pay_calc_standard.inst_sys IS NOT NULL
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
	 rep_pay_cal_standard.sys_size AS sys_size,
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
	 rep_pay_cal_standard.commission_model AS commission_model
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
            dealer_pay_calc_standard.rep_pay = 'YES'
        )
    )
);

--* ==========================

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
	 rep_pay_cal_standard.commission_model AS commission_model
FROM
    rep_pay_cal_standard
WHERE
(
	rep_pay_cal_standard.wc > '2018-12-31'  AND
	rep_pay_cal_standard.rep_2_rate <> 0 AND
	rep_pay_cal_standard.inst_sys IS NOT NULL
);

--* ==========================

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
	rep_pay_cal_standard.sys_size as sys_size,
	rep_pay_cal_standard.loan_fee as loan_fee.
	rep_pay_cal_standard.epc as epc,
	rep_pay_cal_standard.rep_2_addr as rep_2_addr,
	rep_pay_cal_standard.rep_2_rr as rep_2_rr,
	rep_pay_cal_standard.rep_2_position as rep_2_position,
	rep_pay_cal_standard.rep_2_net_epc as rep_2_net_epc,
	rep_pay_cal_standard.rep_2_credit as rep_2_credit,
	rep_pay_cal_standard.rep_2_comm_status_check as rep_2_comm_status_check,
	rep_pay_cal_standard.rep_1_ as rep_1,
	rep_pay_cal_standard.loan_type as loan_type,
	rep_pay_cal_standard.wc as wc,
	rep_pay_cal_standard.state as state,
	 rep_pay_cal_standard.commission_model AS commission_model
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

--* ==========================

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
	rep_pay_cal_standard.sys_size as sys_size,
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
	 rep_pay_cal_standard.commission_model AS commission_model
FROM
    rep_pay_cal_standard
WHERE
(
	rep_pay_cal_standard.wc > '2018-12-31'  AND
	rep_pay_cal_standard.ntp IS NOT NULL    AND
	rep_pay_cal_standard.rep_2_balance <> 0      AND
	(
        -- The hand sign is marked AS true if the project status of a project equals Hold or Jeopardy.
        (
            rep_pay_cal_standard.status = 'Hold' OR
            rep_pay_cal_standard.status = 'Jeopardy'
        )                                           OR
        rep_pay_cal_standard.cancel IS NOT NULL OR
        (
            rep_pay_cal_standard.inst_sys IS NOT NULL AND
        ) AND
				rep_pay_cal_standard.rep_pay = 'YES'
    )
);

--* ==========================

CREATE VIEW pr_r2_b AS
SELECT
   rep_pay_cal_standard.dealer AS dealer,
	 rep_pay_cal_standard.home_owner AS home_owner,
	 rep_pay_cal_standard.unique_id AS unique_id,
	 rep_pay_cal_standard.rep_1 AS rep_2,
	 rep_pay_cal_standard.rep_1_loan_fee as rep_1_loan_fee,
	 rep_pay_cal_standard.status as status,
	 rep_pay_cal_standard.status_date as status_date,
	 rep_pay_cal_standard.rep_2_min_rate as rep_2_min_rate,
	 rep_pay_cal_standard.rep_2_max_rate as rep_2_max_rate,
	 rep_pay_cal_standard.wc AS wc,
	 rep_pay_cal_standard.state AS state,
	 rep_pay_cal_standard.commission_model AS commission_model
FROM
    rep_pay_cal_standard
WHERE
(
	rep_pay_cal_standard.wc > '2018-12-31'  AND
	rep_pay_cal_standard.rep_2_max_rate <> 0 AND
	rep_pay_cal_standard.inst_sys IS NOT NULL
);

--* ==========================

CREATE VIEW pr_r1_sl AS
SELECT
	rep_pay_cal_standard.dealer AS dealer,
	rep_pay_cal_standard.home_owner AS home_owner,
	rep_pay_cal_standard.unique_id AS unique_id,
	rep_pay_cal_standard.r1_sl_name as r1_sl_name,
	rep_pay_cal_standard.r1_sl_dba as r1_sl_dba,
	rep_pay_cal_standard.status as status,
	rep_pay_cal_standard.status_date as status_date,
	rep_pay_cal_standard.r1_sl_balance as r1_sl_balance,
	rep_pay_cal_standard.r1_sl_paid as r1_sl_paid,
	rep_pay_cal_standard.sys_size as sys_size,
	rep_pay_cal_standard.commission_model AS commission_model
FROM
    rep_pay_cal_standard
WHERE
(
	rep_pay_cal_standard.wc > '2013-01-01'  AND
	rep_pay_cal_standard.r1_sl_paid <> 0 AND
	rep_pay_cal_standard.inst_sys IS NOT NULL
);

--* ==========================

CREATE VIEW pr_r1_dm AS
SELECT
	rep_pay_cal_standard.dealer AS dealer,
	rep_pay_cal_standard.home_owner AS home_owner,
	rep_pay_cal_standard.unique_id AS unique_id,
	rep_pay_cal_standard.status as status,
	rep_pay_cal_standard.status_date as status_date,
	rep_pay_cal_standard.r1_dm_name as r1_dm_name,
	rep_pay_cal_standard.r1_dm_dba as r1_dm_dba,
	rep_pay_cal_standard.r1_dm_bal as r1_dm_bal,
	rep_pay_cal_standard.r1_dm_bal as r1_dm_paid,
	rep_pay_cal_standard.sys_size as sys_size,
	rep_pay_cal_standard.commission_model AS commission_model
FROM
    rep_pay_cal_standard
WHERE
(
	rep_pay_cal_standard.wc > '2013-01-01'  AND
	rep_pay_cal_standard.r1_dm_bal <> 0 AND
	rep_pay_cal_standard.inst_sys IS NOT NULL
);