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

CREATE TABLE dlr_pay_calc(
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
    R1_Net_Epc      Float,
    R1_Min_Max_Correct      float,
    R1_Comm_Total      float,
    R1_Comm_Status_Check   Float,
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

CREATE TABLE ap_calc_dealer_pay_calc ( 
    -- this is from sales data
    dealer text,
    partner text,
    instl text,
    source text,
    loan_type text,
    unique_id text primary key,
    home_owner text,
    street_address text,
    city text,
    st text,
    rep_1 text,
    rep_2 text,
    sys_size float,
    contract float,
    epc float,
    wc date,
    ntp date,
    perm_sub date,
    perm_app date,
    ic_sub date,
    ic_app date,
    cancel date,
    inst_sys date,
    pto date,

    -- calculated fields
    rep_pay float,
    adder_total float,
    net_epc   float,
    adder_per_kw float,
    comm_total float,
    ovrd_total float,
    status_check float,
    pay_rate float64,
    dlr_draw_max float,
    r1_draw_amt float,
    amt_check float,
    r1_balance float,
    ovrd_balance float,
    status   text,
    status_date   date,
    rep_count   float,
    per_rep_sales   float,
    per_rep_kw   float,
    contract_calc   float,
    epc_calc   float,
    team_count   float,
    per_team_sales   float,
    per_team_kw   float,
    r1_name text,
    r1_pay_rate_semi float64,
    r1_r_r   float,
    r1_adder_total   float,
    r1_adder_per_kw   float,
    r1_pay_rate_sub_total   float,
    r1_net_epc float,
    r1_min_max_correct   float,
    r1_comm_total   float,
    r1_comm_status_check   float,

    r2_name   text,
    r2_pay_rate_semi float64,
    r2_r_r   float,
    r2_adder_total   float,
    r2_adder_per_kw   float,
    r2_pay_rate_sub_total   float,
    r2_net_epc float,
    r2_min_max_correct   float,
    r2_comm_total   float,
    r2_comm_status_check   float,
    

--  we need to sort where the following data comes from
    type text,
    zip int,
    email text,
    appt_setter text,
    kwh float,
    created date,
    pp date,
    inst_elec date,
    fca date,
    loan_fee   float,
    rep_1_team   text,
    rep_2_team   text,
    rate   float,
    adjustment   float,
    pay_rate_sub_total float,
    min_rate   float,
    max_rate   float,
    r1_incentive   float,
    r1_credit   float,
    payrate_semi   float,
    addr_resp   float,
    r1_addr   float,
    r1_auto_addr   float,
    r1_loan_fee   float,
    r1_rebate   float,
    r1_referral   float,
    rep_2_dba   text,
    r2_incentive   float,
    r2_credit   float,
    r2_addr   float,
    r2_auto_addr   float,
    r2_loan_fee   float,
    r2_rebate   float,
    r2_referral   float,
    appt_set_name   text,
    appt_set_dba   text,
    pay_rate   float,
    appt_set_total   float,
    appt_set_status_check   float,
    sales_rep_type   text
);

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