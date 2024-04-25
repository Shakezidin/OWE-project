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
    is_archived BOOLEAN DEFAULT FALSE,
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
    is_archived BOOLEAN DEFAULT FALSE,
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

CREATE TABLE dealer_override (
    id serial NOT NULL,
    sub_dealer character varying,
    dealer_id INT,
    pay_rate character varying,
    start_date character varying NOT NULL,
    end_date character varying,
    is_archived BOOLEAN DEFAULT FALSE,
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
    is_archived BOOLEAN DEFAULT FALSE,
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
    is_archived BOOLEAN DEFAULT FALSE,
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
    is_archived BOOLEAN DEFAULT FALSE,
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
    is_archived BOOLEAN DEFAULT FALSE,
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
    is_archived BOOLEAN DEFAULT FALSE,
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
    is_archived BOOLEAN DEFAULT FALSE,
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
    is_archived BOOLEAN DEFAULT FALSE,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
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

/*Temp: TODO Check*/
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

CREATE TABLE auto_adder (
    id serial NOT NULL,
    unique_id varchar NOT NULL UNIQUE,
    type_aa_mktg text,
    gc text,
    exact_amount text,
    per_kw_amount float,
    rep_doll_divby_per float,
    description_rep_visible text,
    notes_not_rep_visible text,
    type text,
    rep_1 INT,
    rep_2 INT,
    sys_size float,
    state_id INT,
    rep_count float,
    per_rep_addr_share float,
    per_rep_ovrd_share float,
    r1_pay_scale float,
    rep_1_def_resp text,
    r1_addr_resp text,
    r2_pay_scale float,
    rep_2_def_resp text,
    r2_addr_resp text,
    contract_amount float,
    project_base_cost float,
    crt_addr float,
    r1_loan_fee float,
    r1_rebate float,
    r1_referral float,
    r1_r_plus_r float,
    total_comm float,
    start_date character varying NOT NULL,
    end_date character varying,   
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    FOREIGN KEY (rep_1) REFERENCES user_details(user_id),
    FOREIGN KEY (rep_2) REFERENCES user_details(user_id)
);

CREATE TABLE loan_fee_adder (
    id serial NOT NULL,
    unique_id varchar NOT NULL UNIQUE,
	type_mktg text,
	dealer_id INT,
	installer_id INT,
    state_id INT,
	contract_dol_dol  float,
	dealer_tier INT,
	owe_cost  float,
	addr_amount  float,
    per_kw_amount float,
    rep_doll_divby_per float,
    description_rep_visible text,
    notes_not_rep_visible text,
    type text,
    rep_1 INT,
    rep_2 INT,
    sys_size float,
    rep_count float,
    per_rep_addr_share float,
    per_rep_ovrd_share float,
    r1_pay_scale float,
    rep_1_def_resp text,
    r1_addr_resp text,
    r2_pay_scale float,
    rep_2_def_resp text,
    r2_addr_resp text,
    start_date character varying NOT NULL,
    end_date character varying,   
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    FOREIGN KEY (rep_1) REFERENCES user_details(user_id),
    FOREIGN KEY (rep_2) REFERENCES user_details(user_id),
	FOREIGN KEY (dealer_id) REFERENCES user_details(user_id),
	FOREIGN KEY (installer_id) REFERENCES partners(partner_id),
	FOREIGN KEY (dealer_tier) REFERENCES tier(id)
	);

CREATE TABLE rebate_data (
    id serial NOT NULL,
    unique_id varchar NOT NULL UNIQUE,
    customer_verf text,
    type_rd_mktg text,
    item text,
    amount text,
    rep_doll_divby_per float,
    notes text,
    type text,
    rep_1 INT,
    rep_2 INT,
    sys_size float,
    rep_count float,
	state_id INT,
	per_rep_addr_share float,
    per_rep_ovrd_share float,
    r1_pay_scale float,
    rep_1_def_resp text,
    r1_addr_resp text,
    r2_pay_scale float,
    per_rep_def_ovrd text,
    r1_rebate_credit_$ text,
    r1_rebate_credit_perc text,
    r2_rebate_credit_$ text,
    r2_rebate_credit_perc text,
    start_date character varying NOT NULL,
    end_date character varying,   
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    FOREIGN KEY (rep_1) REFERENCES user_details(user_id),
    FOREIGN KEY (rep_2) REFERENCES user_details(user_id)
);

