
CREATE TABLE sales_ar_calc (
    serial_num text,
    dealer text,
    partner text,
    instl text,
    source text,
    type text,
    loan_type text,
    unique_id text,
    home_owner text,
    street_address text,
    city text,
    st text,
    zip text,
    email text,
    rep_1 text,
    rep_2 text,
    appt_setter text,
    sys_size text,
    kwh text,
    contract text,
    epc text,
    created text,
    wc date,
    pp text,
    ntp text,
    perm_sub text,
    perm_app text,
    ic_sub text,
    ic_app text,
    cancel text,
    inst_sys text,
    inst_elec text,
    fca text,
    pto text,
    status text,
    status_date text,
    rep_count text,
    per_rep_sales text,
    per_rep_kw text,
    red_line text,
    calc_date text,
    permit_max text,
    contract_calc text,
    epc_calc text,
    owe_ar text,
    gross_rev text,
    addr_ptr text,
    addr_auto text,
    loan_fee text,
    adjustment text,
    reconcile text,
    net_rev text,
    permit_pay text,
    install_pay text,
    pto_pay text,
    total_paid text,
    current_due text,
    balance FLOAT,
    dlr_rl text,
    dlr_tier text,
    dlr_mu text,
    dlr_mu_rpw text,
    owe_rl text,
    owe_rev text,
    owe_cost text,
    kw_profit text
);

CREATE VIEW ar_data AS
SELECT *
FROM (
    SELECT
        sales_ar_calc.Partner AS Partner,
        sales_ar_calc.instl AS instl,
        sales_ar_calc.type AS type,
        sales_ar_calc.unique_id AS unique_id,
        sales_ar_calc.home_owner AS home_owner,
        sales_ar_calc.street_address AS street_address,
        sales_ar_calc.city AS city,
        sales_ar_calc.st AS st,
        sales_ar_calc.zip AS zip,
        sales_ar_calc.sys_size AS sys_size,
        sales_ar_calc.wc AS wc,
        sales_ar_calc.inst_sys AS inst_sys,
        sales_ar_calc.status AS status,
        sales_ar_calc.status_date AS status_date,
        sales_ar_calc.contract_calc AS contract_calc,
        sales_ar_calc.owe_ar AS owe_ar,
        sales_ar_calc.total_paid AS total_paid,
        sales_ar_calc.current_due AS current_due,
        sales_ar_calc.balance AS balance
    FROM
        sales_ar_calc
    WHERE
        (sales_ar_calc.balance > 0.01 OR sales_ar_calc.balance < -0.01)/* AND sales_ar_calc.wc > 43465*/
) AS subquery
ORDER BY status_date DESC;

/*

CREATE TABLE ar_data (
    partner text,
    installer text,
    type text,
    service text,
    home Owner text,
    address text,
    city text,
    state text,
    zip text,
    kw text,
    contract_date date,
    install_date date,
    current Status text,
    status_date date,
    contract text,
    owe_ar text,
    amt_paid text,
    current_due text,
    est_pipeline text
);

CREATE TABLE sales_ar_calc (
    serial_num text,
    dealer text,
    partner text,
    instl text,
    source text,
    type text,
    loan_type text,
    unique_id text,
    home_owner text,
    street_address text,
    city text,
    st text,
    zip text,
    email text,
    rep_1 text,
    rep_2 text,
    appt_setter text,
    sys_size text,
    kwh text,
    contract text,
    epc text,
    created text,
    wc text,
    pp text,
    ntp text,
    perm_sub text,
    perm_app text,
    ic_sub text,
    ic_app text,
    cancel text,
    inst_sys text,
    inst_elec text,
    fca text,
    pto text,
    status text,
    status_date text,
    rep_count text,
    per_rep_sales text,
    per_rep_kw text,
    red_line text,
    calc_date text,
    permit_pay text,
    permit_max text,
    install_pay text,
    pto_pay text,
    contract_calc text,
    epc_calc text,
    owe_ar text,
    gross_rev text,
    addr - ptr text,
    addr - auto text,
    loan_fee text,
    adjustment text,
    reconcile text,
    net_rev text,
    permit_pay text,
    install_pay text,
    pto_pay text,
    total_paid text,
    current_due text,
    balance text,
    dlr_rl text,
    dlr_tier text,
    dlr_mu text,
    dlr_mu_rpw text,
    owe_rl text,
    owe_rev text,
    owe_cost text,
    kw_profit text
);

CREATE TABLE ar_calc (
    dealer text,
    partner text,
    install text,
    source text,
    type text,
    loan_type text,
    unique_id text,
    home_owner text,
    street_address text,
    city text,
    st text,
    zip text,
    email text,
    rep_1 text,
    rep_2 text,
    appt_setter text,
    sys_size text,
    kwh text,
    contract text,
    epc text,
    created text,
    wc text,
    pp text,
    ntp text,
    perm_sub text,
    perm_app text,
    ic_sub text,
    ic_app text,
    cancel text,
    inst_sys text,
    inst_elec text,
    fca text,
    pto text,
    status text,
    status_date text,
    rep_count text,
    per_rep_sales text,
    per_rep_kw text,
    red_line text,
    calc_date text,
    permit_pay_m1 text,
    permit_max text,
    install_pay_m2 text,
    pto_pay_m3 text,
    contract_calc text,
    epc_calc text,
    owe_ar text,
    gross_rev text,
    addr - ptr text,
    addr - auto text,
    loan_fee text,
    adjust text,
    reconcile text,
    net_rev text,
    permit_pay text,
    install_pay text,
    pto_pay text,
    total_paid text,
    current_due text,
    balance text,
    dlr_rl text,
    dlr_tier text,
    dlr_mu text,
    dlr_mu_rpw text,
    owe_rl text,
    owe_rev text,
    owe_cost text,
    kw_profit text,
    total_profit text,
    fake_install text,
    epc_contract text,
    total_paid text
);

*/