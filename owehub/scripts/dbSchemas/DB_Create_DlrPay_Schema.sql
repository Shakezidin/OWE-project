CREATE TABLE dealer_pay_calc_standard (
    -- Sales data
    dealer TEXT,
    partner TEXT,
    instl TEXT,
    source TEXT,
    loan_type TEXT,
    unique_id TEXT PRIMARY KEY,
    home_owner TEXT,
    street_address TEXT,
    city TEXT,
    st TEXT,
    rep_1 TEXT,
    rep_2 TEXT,
    sys_size FLOAT,
    contract FLOAT,
    epc FLOAT,
    wc DATE,
    ntp DATE,
    perm_sub DATE,
    perm_app DATE,
    ic_sub DATE,
    ic_app DATE,
    cancel DATE,
    inst_sys DATE,
    pto DATE,
    -- Calculated fields
    pay_rate_sub_total FLOAT,
    rl FLOAT,
    credit FLOAT,
    pay_rate_semi FLOAT,
    addr FLOAT,
    expense FLOAT,
    auto_adder FLOAT,
    loan_fee FLOAT,
    rebate FLOAT,
    referral FLOAT,
    parent_dlr text,
    rep_pay FLOAT,
    adder_total FLOAT,
    net_epc FLOAT,
    adder_per_kw FLOAT,
    comm_total FLOAT,
    ovrd_total FLOAT,
    status_check FLOAT,
    contract_$$ FLOAT,
    pay_rate FLOAT,
    dlr_draw_max FLOAT,
    r1_draw_amt FLOAT,
    amt_check FLOAT,
    r1_balance FLOAT,
    ovrd_balance FLOAT,
    ovrd_paid    FLOAT,
    status TEXT,
    status_date DATE,
    rep_count FLOAT,
    per_rep_sales FLOAT,
    per_rep_kw FLOAT,
    contract_calc FLOAT,
    epc_calc FLOAT,
    team_count FLOAT,
    per_team_sales FLOAT,
    per_team_kw FLOAT,
    -- Rep 1 fields
    r1_name TEXT,
    r1_pay_rate_semi FLOAT,
    r1_r_r FLOAT,
    r1_adder_total FLOAT,
    r1_adder_per_kw FLOAT,
    r1_pay_rate_sub_total FLOAT,
    r1_net_epc FLOAT,
    r1_min_max_correct FLOAT,
    r1_comm_total FLOAT,
    r1_comm_status_check FLOAT,
    -- Rep 2 fields
    r2_name TEXT,
    r2_pay_rate_semi FLOAT,
    r2_r_r FLOAT,
    r2_adder_total FLOAT,
    r2_adder_per_kw FLOAT,
    r2_pay_rate_sub_total FLOAT,
    r2_net_epc FLOAT,
    r2_min_max_correct FLOAT,
    r2_comm_total FLOAT,
    r2_comm_status_check FLOAT,
    -- Additional data
    type TEXT,
    zip INT,
    email TEXT,
    appt_setter TEXT,
    kwh FLOAT,
    created DATE,
    pp DATE,
    inst_elec DATE,
    fca DATE,
    rep_1_team TEXT,
    rep_2_team TEXT,
    rate FLOAT,
    adjustment FLOAT,
    min_rate FLOAT,
    max_rate FLOAT,
    r1_incentive FLOAT,
    r1_credit FLOAT,
    payrate_semi FLOAT,
    addr_resp FLOAT,
    r1_addr FLOAT,
    r1_auto_addr FLOAT,
    r1_loan_fee FLOAT,
    r1_rebate FLOAT,
    r1_referral FLOAT,
    rep_2_dba TEXT,
    r2_incentive FLOAT,
    r2_credit FLOAT,
    r2_addr FLOAT,
    r2_auto_addr FLOAT,
    r2_loan_fee FLOAT,
    r2_rebate FLOAT,
    r2_referral FLOAT,
    appt_set_name TEXT,
    appt_set_dba TEXT,
    appt_set_total FLOAT,
    appt_set_status_check FLOAT,
    sales_rep_type TEXT,
    r1_comm_paid FLOAT,
    r1_draw_paid FLOAT
);
 
-- CREATE VIEW pr_dlr_d_standard AS
-- SELECT
--     dealer_pay_calc_standard.home_owner AS home_owner,
--     dealer_pay_calc_standard.status AS current_status,
--     dealer_pay_calc_standard.status_date AS status_date,    --not required
--     dealer_pay_calc_standard.unique_id AS unique_id,
--     dealer_pay_calc_standard.dealer AS dealer,
--     dealer_pay_calc_standard.r1_draw_amt AS amount,
--     dealer_pay_calc_standard.loan_type AS type,
--     dealer_pay_calc_standard.sys_size AS sys_size,
--     dealer_pay_calc_standard.contract_$$ AS contract_$$,
--     dealer_pay_calc_standard.loan_fee AS loan_fee,
--     dealer_pay_calc_standard.adder_total AS other_adders,
--     dealer_pay_calc_standard.epc AS epc,
--     dealer_pay_calc_standard.net_epc AS net_epc,
--     dealer_pay_calc_standard.rl AS rl,
--     dealer_pay_calc_standard.credit AS credit,
--     dealer_pay_calc_standard.rep_1 AS rep_1,
--     dealer_pay_calc_standard.rep_2 AS rep_2,
--     dealer_pay_calc_standard.rep_pay AS rep_pay,
--     dealer_pay_calc_standard.status_check AS net_rev,
--     dealer_pay_calc_standard.r1_draw_amt AS draw_amt,
--     dealer_pay_calc_standard.r1_comm_paid AS amt_paid,
--     dealer_pay_calc_standard.r1_balance AS balance,
--     dealer_pay_calc_standard.st AS st,
--     dealer_pay_calc_standard.wc AS contract_date
-- FROM
--     dealer_pay_calc_standard
-- WHERE
-- (
--     dealer_pay_calc_standard.wc > '2019-04-01'  AND
--     dealer_pay_calc_standard.dealer <> 'House'  AND
--     dealer_pay_calc_standard.r1_balance <> 0    AND
--     dealer_pay_calc_standard.r1_draw_paid <> 0  AND
--     dealer_pay_calc_standard.ntp IS NOT NULL    AND
--     dealer_pay_calc_standard.inst_sys IS NOT NULL
-- );

-- CREATE VIEW pr_dlr_f_standard AS
-- SELECT
--     dealer_pay_calc_standard.home_owner AS home_owner,
--     dealer_pay_calc_standard.status AS current_status,
--     dealer_pay_calc_standard.status_date AS status_date,    --not required
--     dealer_pay_calc_standard.unique_id AS unique_id,
--     dealer_pay_calc_standard.dealer AS dealer,
--     dealer_pay_calc_standard.r1_balance AS amount,
--     dealer_pay_calc_standard.loan_type AS type,
--     dealer_pay_calc_standard.sys_size AS sys_size,
--     dealer_pay_calc_standard.contract_$$ AS contract_$$,
--     dealer_pay_calc_standard.loan_fee AS loan_fee,
--     dealer_pay_calc_standard.adder_total AS other_adders,
--     dealer_pay_calc_standard.epc AS epc,
--     dealer_pay_calc_standard.net_epc AS net_epc,
--     dealer_pay_calc_standard.rl AS rl,
--     dealer_pay_calc_standard.credit AS credit,
--     dealer_pay_calc_standard.rep_1 AS rep_1,
--     dealer_pay_calc_standard.rep_2 AS rep_2,
--     dealer_pay_calc_standard.rep_pay AS rep_pay,
--     dealer_pay_calc_standard.status_check AS net_rev,
--     dealer_pay_calc_standard.r1_draw_amt AS draw_amt,
--     dealer_pay_calc_standard.r1_comm_paid AS amt_paid,
--     dealer_pay_calc_standard.r1_balance AS balance,
--     dealer_pay_calc_standard.st AS st,
--     dealer_pay_calc_standard.wc AS contract_date
-- FROM
--     dealer_pay_calc_standard
-- WHERE
-- (
--     dealer_pay_calc_standard.wc > '2019-04-01'      AND
--     dealer_pay_calc_standard.dealer <> 'House'      AND
--     dealer_pay_calc_standard.r1_balance <> 0        AND
--     (
--         -- The hand sign is marked AS true if the project status of a project equals Hold or Jeopardy.
--         (
--             dealer_pay_calc_standard.status = 'Hold' OR
--             dealer_pay_calc_standard.status = 'Jeopardy'
--         )                                           OR
--         dealer_pay_calc_standard.cancel IS NOT NULL OR
--         (
--             dealer_pay_calc_standard.inst_sys IS NOT NULL AND
--             dealer_pay_calc_standard.ntp IS NOT NULL
--         )
--     )
-- );

-- CREATE VIEW pr_dlr_or_standard AS
-- SELECT
--     -- TODO First column should be Dealer DBA later now using dealer here
--     dealer_pay_calc_standard.dealer AS dealer_dba,
--     dealer_pay_calc_standard.status AS current_status,
--     dealer_pay_calc_standard.status_date AS status_date,    --not required
--     dealer_pay_calc_standard.unique_id AS unique_id,
--     dealer_pay_calc_standard.parent_dlr AS dealer_code,
--     dealer_pay_calc_standard.ovrd_balance AS amount,
--     dealer_pay_calc_standard.loan_type AS type,
--     dealer_pay_calc_standard.sys_size AS sys_size,
--     dealer_pay_calc_standard.contract_$$ AS contract_$$,
--     dealer_pay_calc_standard.loan_fee AS loan_fee,
--     dealer_pay_calc_standard.adder_total AS other_adders,
--     dealer_pay_calc_standard.epc AS epc,
--     dealer_pay_calc_standard.net_epc AS net_epc,
--     dealer_pay_calc_standard.rl AS rl,
--     dealer_pay_calc_standard.credit AS credit,
--     dealer_pay_calc_standard.rep_1 AS rep_1,
--     dealer_pay_calc_standard.rep_2 AS rep_2,
--     dealer_pay_calc_standard.rep_pay AS rep_pay,
--     dealer_pay_calc_standard.status_check AS net_rev,
--     dealer_pay_calc_standard.r1_draw_amt AS draw_amt,
--     dealer_pay_calc_standard.ovrd_paid AS amt_paid,
--     dealer_pay_calc_standard.ovrd_balance AS balance,
--     dealer_pay_calc_standard.st AS st,
--     dealer_pay_calc_standard.wc AS contract_date
-- FROM
--     dealer_pay_calc_standard
-- WHERE
-- (
--     dealer_pay_calc_standard.wc > '2019-04-01'      AND
--     dealer_pay_calc_standard.dealer <> 'House'      AND
--     dealer_pay_calc_standard.ovrd_balance <> 0      AND
--     (
--         dealer_pay_calc_standard.inst_sys IS NOT NULL     AND
--         dealer_pay_calc_standard.ntp IS NOT NULL
--     )
-- );

-- CREATE VIEW dlr_pay_pr_data AS
--     SELECT
--         home_owner AS home_owner,
--         current_status AS current_status,
--         status_date AS status_date,
--         unique_id AS unique_id,
--         dealer AS dealer,
--         amount AS amount,
--         type AS type,
--         sys_size AS sys_size,
--         contract_$$ AS contract_$$,
--         loan_fee AS loan_fee,
--         other_adders AS other_adders,
--         epc AS epc,
--         net_epc AS net_epc,
--         rl AS rl,
--         credit AS credit,
--         rep_1 AS rep_1,
--         rep_2 AS rep_2,
--         rep_pay AS rep_pay,
--         net_rev AS net_rev,
--         draw_amt AS draw_amt,
--         amt_paid AS amt_paid,
--         balance AS balance,
--         st AS st,
--         contract_date AS contract_date
--     FROM pr_dlr_d_standard
--     WHERE home_owner IS NOT NULL AND home_owner <> ''
--         UNION ALL
--     SELECT
--         home_owner AS home_owner,
--         current_status AS current_status,
--         status_date AS status_date,
--         unique_id AS unique_id,
--         dealer AS dealer,
--         amount AS amount,
--         type AS type,
--         sys_size AS sys_size,
--         contract_$$ AS contract_$$,
--         loan_fee AS loan_fee,
--         other_adders AS other_adders,
--         epc AS epc,
--         net_epc AS net_epc,
--         rl AS rl,
--         credit AS credit,
--         rep_1 AS rep_1,
--         rep_2 AS rep_2,
--         rep_pay AS rep_pay,
--         net_rev AS net_rev,
--         draw_amt AS draw_amt,
--         amt_paid AS amt_paid,
--         balance AS balance,
--         st AS st,
--         contract_date AS contract_date
--     FROM pr_dlr_f_standard
--     WHERE home_owner IS NOT NULL AND home_owner <> ''
--         UNION ALL
--     SELECT
--         dealer_dba AS home_owner,
--         current_status AS current_status,
--         status_date AS status_date,
--         unique_id AS unique_id,
--         dealer_code AS dealer,
--         amount AS amount,
--         NULL AS type,
--         sys_size AS sys_size,
--         NULL AS contract_$$,
--         NULL AS loan_fee,
--         NULL AS other_adders,
--         NULL AS epc,
--         NULL AS net_epc,
--         NULL AS rl,
--         NULL AS credit,
--         NULL AS rep_1,
--         NULL AS rep_2,
--         NULL AS rep_pay,
--         NULL AS net_rev,
--         NULL AS draw_amt,
--         amt_paid AS amt_paid,
--         balance AS balance,
--         st AS st,
--         contract_date AS contract_date
--     FROM pr_dlr_or_standard
--     WHERE dealer_dba IS NOT NULL AND dealer_dba <> ''
--         UNION ALL
--     SELECT
--         n.customer AS home_owner,
--         NULL AS current_status,
--         n.date AS status_date,
--         n.unique_id AS unique_id,
--         d.dealer_code AS dealer,
--         n.balance AS amount,
--         NULL AS type,
--         NULL AS sys_size,
--         NULL AS contract_$$,
--         NULL AS loan_fee,
--         NULL AS other_adders,
--         NULL AS epc,
--         NULL AS net_epc,
--         NULL AS rl,
--         NULL AS credit,
--         NULL AS rep_1,
--         NULL AS rep_2,
--         NULL AS rep_pay,
--         NULL AS net_rev,
--         NULL AS draw_amt,
--         n.paid_amount AS amt_paid,
--         n.balance AS balance,
--         NULL AS st,
--         NULL AS contract_date
--     FROM noncomm_dlrpay n
--     JOIN v_dealer d ON n.dealer_id = d.id
--     WHERE n.unique_id IS NOT NULL AND n.unique_id <> '' AND n.balance <> 0
--         UNION ALL
--     SELECT
--         NULL AS home_owner,
--         NULL AS current_status,
--         date AS status_date,
--         unique_id AS unique_id,
--         payee AS dealer,
--         balance AS amount,
--         NULL AS type,
--         NULL AS sys_size,
--         NULL AS contract_$$,
--         NULL AS loan_fee,
--         NULL AS other_adders,
--         NULL AS epc,
--         NULL AS net_epc,
--         NULL AS rl,
--         NULL AS credit,
--         NULL AS rep_1,
--         NULL AS rep_2,
--         NULL AS rep_pay,
--         NULL AS net_rev,
--         NULL AS draw_amt,
--         paid_amount AS amt_paid,
--         balance AS balance,
--         NULL AS st,
--         NULL AS contract_date
--     FROM dlr_oth
--     WHERE unique_id IS NOT NULL AND unique_id <> '' AND balance <> 0;
