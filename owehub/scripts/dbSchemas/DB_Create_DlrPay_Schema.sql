CREATE TABLE dlr_pay_pr_data(
    Home_Owne  Text,
    Current_Status Text,
    Status_Date  Date,
    Unique_ID  Text PRIMARY KEY,
    Dealer Text,
    DBA  TExt,
    Payment_Type Text,
    Finace_Type Text,
    Today  Date,
    Amount  FLOAT,
    Sys_Size  FLOAT,
    Contract_Value FLOAT,
    Loan_Fee FLOAT,
    Other_Adders FLOAT,
    EPC FLOAT,
    Net_EPC FLOAT,
    RL FLOAT,
    Credit FLOAT,
    Rep1  Text,
    Rep2  Text,
    Rep_Pay  FLOAT,
    Net_Rev  FLOAT,
    Draw_Amt  FLOAT,
    Amt_Paid  FLOAT,
    Balance FLOAT,
    ST  Text,
    Contract_Date Date
);

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
    parent_dlr FLOAT,
    rep_pay FLOAT,
    adder_total FLOAT,
    net_epc FLOAT,
    adder_per_kw FLOAT,
    comm_total FLOAT,
    ovrd_total FLOAT,
    status_check FLOAT,
    pay_rate FLOAT,
    dlr_draw_max FLOAT,
    r1_draw_amt FLOAT,
    amt_check FLOAT,
    r1_balance FLOAT,
    ovrd_balance FLOAT,
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
    r1_comm_paid FLOAT
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
--     dealer_pay_calc_standard.contract_calc AS contract_calc,
--     dealer_pay_calc_standard.loan_fee AS loan_fee,              --TODO
--     dealer_pay_calc_standard.adder_total AS other_adders,
--     dealer_pay_calc_standard.epc AS epc,
--     dealer_pay_calc_standard.net_epc AS net_epc,
--     dealer_pay_calc_standard.rl AS rl,
--     dealer_pay_calc_standard.credit AS credit,                  --Done Later By Shushank
--     dealer_pay_calc_standard.rep_1 AS rep_1,
--     dealer_pay_calc_standard.rep_2 AS rep_2,
--     dealer_pay_calc_standard.rep_pay AS rep_pay,
--     dealer_pay_calc_standard.status_check AS net_rev,
--     dealer_pay_calc_standard.r1_draw_amt AS draw_amt,
--     dealer_pay_calc_standard.r1_comm_paid AS amt_paid,          --TODO
--     dealer_pay_calc_standard.r1_balance AS balance,
--     dealer_pay_calc_standard.st AS st,
--     dealer_pay_calc_standard.wc AS contract_date
-- FROM
--     dealer_pay_calc_standard
-- WHERE
-- (
--     dealer_pay_calc_standard.wc > '2019-04-01'    AND
--     dealer_pay_calc_standard.dealer <> 'House'  AND
--     dealer_pay_calc_standard.r1_balance <> 0    AND
--     dealer_pay_calc_standard.r1_draw_paid <> 0  AND
--     dealer_pay_calc_standard.ntp <> ''          AND
--     dealer_pay_calc_standard.inst_sys <> ''
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
--     dealer_pay_calc_standard.contract_calc AS contract_calc,
--     dealer_pay_calc_standard.loan_fee AS loan_fee,              --TODO
--     dealer_pay_calc_standard.adder_total AS other_adders,
--     dealer_pay_calc_standard.epc AS epc,
--     dealer_pay_calc_standard.net_epc AS net_epc,
--     dealer_pay_calc_standard.rl AS rl,
--     dealer_pay_calc_standard.credit AS credit,                  --Later done by Shushank
--     dealer_pay_calc_standard.rep_1 AS rep_1,
--     dealer_pay_calc_standard.rep_2 AS rep_2,
--     dealer_pay_calc_standard.rep_pay AS rep_pay,
--     dealer_pay_calc_standard.status_check AS net_rev,
--     dealer_pay_calc_standard.r1_draw_amt AS draw_amt,
--     dealer_pay_calc_standard.r1_comm_paid AS amt_paid,          --TODO
--     dealer_pay_calc_standard.r1_balance AS balance,
--     dealer_pay_calc_standard.st AS st,
--     dealer_pay_calc_standard.wc AS contract_date
-- FROM
--     dealer_pay_calc_standard
-- WHERE
-- (
--     dealer_pay_calc_standard.wc > '2019-04-01'    AND
--     dealer_pay_calc_standard.dealer <> 'House'  AND
--     dealer_pay_calc_standard.r1_balance <> 0    AND
--     (
--         --HandSign = TRUE                             OR            --TODO
--         dealer_pay_calc_standard.cancel <> ''       OR
--         (
--             dealer_pay_calc_standard.inst_sys <> ''          AND
--             dealer_pay_calc_standard.ntp <> ''
--         )
--     )
-- );

-- CREATE VIEW pr_dlr_or_standard AS
-- SELECT
--     --dealer_pay_calc_standard.dealer_dba AS dealer_dba,    --TODO
--     dealer_pay_calc_standard.status AS current_status,
--     dealer_pay_calc_standard.status_date AS status_date,    --not required
--     dealer_pay_calc_standard.unique_id AS unique_id,
--     dealer_pay_calc_standard.parent_dlr AS dealer_code,
--     dealer_pay_calc_standard.ovrd_balance AS amount,
--     dealer_pay_calc_standard.loan_type AS type,
--     dealer_pay_calc_standard.sys_size AS sys_size,
--     dealer_pay_calc_standard.contract_calc AS contract_calc,
--     dealer_pay_calc_standard.loan_fee AS loan_fee,              --TODO
--     dealer_pay_calc_standard.adder_total AS other_adders,
--     dealer_pay_calc_standard.epc AS epc,
--     dealer_pay_calc_standard.net_epc AS net_epc,
--     dealer_pay_calc_standard.rl AS rl,
--     dealer_pay_calc_standard.credit AS credit,                  --Later done by Shushank
--     dealer_pay_calc_standard.rep_1 AS rep_1,
--     dealer_pay_calc_standard.rep_2 AS rep_2,
--     dealer_pay_calc_standard.rep_pay AS rep_pay,
--     dealer_pay_calc_standard.status_check AS net_rev,
--     dealer_pay_calc_standard.r1_draw_amt AS draw_amt,
--     dealer_pay_calc_standard.ovrd_paid AS amt_paid,             --TODO
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
--         dealer_pay_calc_standard.inst_sys <> ''     AND
--         dealer_pay_calc_standard.ntp <> ''
--     )
-- );

CREATE TABLE ap_calc_dealer_80_20_pay_calc (
	        Dealer   text,
		Partner   text,
	        Instl   text,
		Source   text,
		Type   text,
		Loan_Type   text,
		Unique_ID   text Primary Key,
		Home_Owner   text,
		Street_Address   text,
		City   text,
		ST   text,
		ZIP   INT,
		Rep_1   text,
		Rep_2   text,
		Appt_Setter   text,
		Sys_Size   Float,
		KWH   Float,
		Contract   Float,
		EPC  Float,
		Created   Date,
		WC   Date,
		PP   Date,
		NTP    Date,
		Perm_Sub   Date,
		Perm_App   Date,
		IC_Sub   Date,
		IC_App   Date,
		Cancel    Date,
		Inst_Sys_   Date,
		Inst_Elec   Date,
		FCA   Date,
		PTO   Date,
		Status   Text,
		Status_Date   Date,
		Epc_Calc   Float,
		Dealer_DBA   text,
		Credit   Float,
		Rep_Pay   Float,
		Base_Cost   Float,
		Addr    Float ,
		Expense   Float,
		Auto_Addr   Float,
		Loan_Fee   Float,
		Rebate   Float,
		Referral   Float,
		Adder_Total   Float,
		Adder_LF   Float,
		Net_EPC   Float,
		Adder_Per_KW   Float,
		Pay_Rate_Sub_Total   Float,
		Comm_Total   Float,
		Status_Check   Float,
		Dealer_Ovrd   Float,
		Ovrd_Total   Float,
		Twenty_Percent_Dollars   Float,
		twenty_Percent_PPW   Float
);
 
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
--     dealer_pay_calc_standard.contract_calc AS contract_calc,
--     dealer_pay_calc_standard.loan_fee AS loan_fee,              --TODO
--     dealer_pay_calc_standard.adder_total AS other_adders,
--     dealer_pay_calc_standard.epc AS epc,
--     dealer_pay_calc_standard.net_epc AS net_epc,
--     dealer_pay_calc_standard.rl AS rl,
--     dealer_pay_calc_standard.credit AS credit,                  --Later done by Shushank
--     dealer_pay_calc_standard.rep_1 AS rep_1,
--     dealer_pay_calc_standard.rep_2 AS rep_2,
--     dealer_pay_calc_standard.rep_pay AS rep_pay,
--     dealer_pay_calc_standard.status_check AS net_rev,
--     dealer_pay_calc_standard.r1_draw_amt AS draw_amt,
--     dealer_pay_calc_standard.r1_comm_paid AS amt_paid,          --TODO
--     dealer_pay_calc_standard.r1_balance AS balance,
--     dealer_pay_calc_standard.st AS st,
--     dealer_pay_calc_standard.wc AS contract_date
-- FROM
--     dealer_pay_calc_standard
-- WHERE
-- (
--     dealer_pay_calc_standard.wc > '2019-04-01'    AND
--     dealer_pay_calc_standard.dealer <> 'House'  AND
--     dealer_pay_calc_standard.r1_balance <> 0    AND
--     (
--         --HandSign = TRUE                             OR            --TODO
--         dealer_pay_calc_standard.cancel <> ''       OR
--         (
--             dealer_pay_calc_standard.inst_sys <> ''          AND
--             dealer_pay_calc_standard.ntp <> ''
--         )
--     )
-- );
 
-- CREATE VIEW pr_dlr_or_standard AS
-- SELECT
--     --dealer_pay_calc_standard.dealer_dba AS dealer_dba,    --TODO
--     dealer_pay_calc_standard.status AS current_status,
--     dealer_pay_calc_standard.status_date AS status_date,    --not required
--     dealer_pay_calc_standard.unique_id AS unique_id,
--     dealer_pay_calc_standard.parent_dlr AS dealer_code,
--     dealer_pay_calc_standard.ovrd_balance AS amount,
--     dealer_pay_calc_standard.loan_type AS type,
--     dealer_pay_calc_standard.sys_size AS sys_size,
--     dealer_pay_calc_standard.contract_calc AS contract_calc,
--     dealer_pay_calc_standard.loan_fee AS loan_fee,              --TODO
--     dealer_pay_calc_standard.adder_total AS other_adders,
--     dealer_pay_calc_standard.epc AS epc,
--     dealer_pay_calc_standard.net_epc AS net_epc,
--     dealer_pay_calc_standard.rl AS rl,
--     dealer_pay_calc_standard.credit AS credit,                  --Later done by Shushank
--     dealer_pay_calc_standard.rep_1 AS rep_1,
--     dealer_pay_calc_standard.rep_2 AS rep_2,
--     dealer_pay_calc_standard.rep_pay AS rep_pay,
--     dealer_pay_calc_standard.status_check AS net_rev,
--     dealer_pay_calc_standard.r1_draw_amt AS draw_amt,
--     dealer_pay_calc_standard.ovrd_paid AS amt_paid,             --TODO
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
--         dealer_pay_calc_standard.inst_sys <> ''     AND
--         dealer_pay_calc_standard.ntp <> ''
--     )
-- );
 
-- CREATE TABLE ap_calc_dealer_80_20_pay_calc (
--             Dealer   text,
--         Partner   text,
--             Instl   text,
--         Source   text,
--         Type   text,
--         Loan_Type   text,
--         Unique_ID   text Primary Key,
--         Home_Owner   text,
--         Street_Address   text,
--         City   text,
--         ST   text,
--         ZIP   INT,
--         Rep_1   text,
--         Rep_2   text,
--         Appt_Setter   text,
--         Sys_Size   Float,
--         KWH   Float,
--         Contract   Float,
--         EPC  Float,
--         Created   Date,
--         WC   Date,
--         PP   Date,
--         NTP    Date,
--         Perm_Sub   Date,
--         Perm_App   Date,
--         IC_Sub   Date,
--         IC_App   Date,
--         Cancel    Date,
--         Inst_Sys_   Date,
--         Inst_Elec   Date,
--         FCA   Date,
--         PTO   Date,
--         Status   Text,
--         Status_Date   Date,
--         Epc_Calc   Float,
--         Dealer_DBA   text,
--         Credit   Float,
--         Rep_Pay   Float,
--         Base_Cost   Float,
--         Addr    Float ,
--         Expense   Float,
--         Auto_Addr   Float,
--         Loan_Fee   Float,
--         Rebate   Float,
--         Referral   Float,
--         Adder_Total   Float,
--         Adder_LF   Float,
--         Net_EPC   Float,
--         Adder_Per_KW   Float,
--         Pay_Rate_Sub_Total   Float,
--         Comm_Total   Float,
--         Status_Check   Float,
--         Dealer_Ovrd   Float,
--         Ovrd_Total   Float,
--         Twenty_Percent_Dollars   Float,
--         twenty_Percent_PPW   Float
-- );
 
CREATE TABLE E80_20_dlr_pay_calc (  
    Dealer   text,
    Partner   text,
    Instl   text,
    Source   text,
    Type   text,
    Loan_Type   text,
    Unique_ID   text  primary key,
    Home_Owner   text,
    Street_Address      text,
    City   text,  
    ST      text,
    ZIP      int,
    Rep_1      text,
    Rep_2      text,
    Appt_Setter      text,
    Sys_Size      float,
    KWH      float,
    Contract_Value    float,
    EPC    float,
    Created      date,
    WC      date,
    PP    date,
    NTP      date,
    Perm_Sub      date,
    Perm_App      date,
    Ic_Sub      date,
    Ic_App      date,
    Cancel      Date,
    Inst_Sys      date,
    Inst_Elec      date,
   FCA      Date,
    PTO     Date,
    Status     text,
    Status_Date     Date,
    EPC_Calc      float,
    Dealer_Dba     text,
    RL_1      float,
    Credit      float,
    Rep_Pay      float,
    Payrate_Semi      float,
    Addr      float,
    Expense      float,
    Auto_Addr      float,
    Loan_Fee      float,
    Rebate      float,
    Referral      float,
    Adder_Total      float,
    Adder_lf      float,
    Net_Epc      float,
    Adder_Per_KW      float,
    Pay_Rate_Sub_Total      float,
    Comm_Total      float,
    Status_Check      float,
    Dealer_Repayment_Bonus      float,
    Parent_dlr      text,
    Pay_Rate      float,
    Ovrd_Total      float,
    Dlr_Draw      float,
    Dlr_Draw_Max      float,
    R1_Draw_Amt      float,
    R1_Draw_Paid      float,
    Amt_Check      Float,
    R1_Comm_Paid      float,
    R1_Balance      Float,
    Ovrd_Paid      Float,
    Ovrd_Balance      Float,
    Rep_Count      INT,
    Per_Rep_Sales      float,
    Per_Rep_Kw      Float,
    Rep_1_Team      text,
    Rep_2_Team      text,
    Team_Count      INT,
    Per_Team_Sales      Float,
    Per_Team_KW      Float,
    R1_Name      text,
    Rep_1_Dba      text,
    Pay_Scale      Float,
    position    INT,
    RL_2      float,
    R1_Rate      float,
    value1      float,
    R1_Incentive      float,
    R1_Credit      Float,
    R1_Payrate_Semi      Float,
    R1_Addr_Resp      Float,
    R1_Addr      Float,
    R1_Auto_Addr      Float,
    R1_Loan_Fee      Float,
    R1_Rebate      Float,
    R1_Referral      Float,
    R1_RR      Float,
    R1_Adder_Total      Float,
    R1_Adder_Per_Kw      Float,
    R1_Pay_Rate_Sub_Total      Float,
    R1_Net_EPC      Float,
    R1_Min_Max_Correct      float,
    R1_Comm_Total      float,
    R1_Comm_Status_Check      Float,
    R2_name      text,
    Rep_2_Dba      text,
    R2_Pay_Scale      float,
    RL_3      Float,
    R2_Rate      Float,
    Value2     Float,
    R2_Incentive      Float,
    R2_Credit      Float,
   R2_Payrate_semi      float,
    R2_Addr_Resp      Float,
    R2_Addr      Float,
    R2_auto_addr      Float,
    R2_Loan_Fee      Float,
    R2_Rebate      Float,
    R2_Referral      Float,
    R2_RR      Float,
    R2_Adder_Total      Float,
    R2_Adder_Per_KW      Float,
    R2_Pay_Rate_Sub_Total      Float,
    R2_Min_Max_Correct      Float,
    R2_Comm_Total      Float,
    R2_Comm_Status_Check      Float
);
 
CREATE TABLE   E80_20_dlr_pay_pr_data (
        Home_Owne   Text,
        Current_Status Text,
        Status_Date   Date,
        Unique_ID    Text PRIMARY KEY,
        Dealer Text,
        DBA   TExt,
        Payment_Type   Text,
        Finace_Type   Text,
        Today     Date,
        Amount   FLOAT,
        Sys_Size     FLOAT,
        Contract_Value   FLOAT,
        Loan_Fee   FLOAT,
        Other_Adders   FLOAT,
        EPC   FLOAT,
        Net_EPC   FLOAT,
        RL   FLOAT,
        Credit   FLOAT,
        Rep1   Text,
        Rep2   Text,
        Rep_Pay   FLOAT,
        Net_Rev   FLOAT,
        Draw_Amt   FLOAT,
        Amt_Paid   FLOAT,
        Balance FLOAT,
       Max_per_Rep   Float,
      Total_Per_Rep     Float
);