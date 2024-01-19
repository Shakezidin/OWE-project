
drop database IF EXISTS owe_db WITH (FORCE);

/* create databases */
create database owe_db;

\c owe_db;

/* Tables for User Authentication */
CREATE TABLE  IF NOT EXISTS user_roles (
    role_id SERIAL,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (role_id)
);

CREATE TABLE IF NOT EXISTS user_auth(
    user_id SERIAL,
    email_id VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    passwordChangeRequired BOOLEAN,
    role_id INT,
    PRIMARY KEY (user_id),
    FOREIGN KEY (role_id) REFERENCES user_roles(role_id)
);

/***************************** SETTINGS DB TABLE START  ************************************************/
/*Table to store the teams information for appointment setters*/
CREATE TABLE teams (
    team_id serial NOT NULL,
    team_name character varying,
    PRIMARY KEY (team_id)
);

/*Table to store the appointment setters on  boarding information*/
CREATE TABLE appointment_setters (
    setters_id serial NOT NULL,
    team_id INT,
    first_name character varying,
    last_name character varying,
    pay_rate  character varying,
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
    PRIMARY KEY (id)
);

CREATE TABLE commission_rates (
    id serial NOT NULL,
    partner_id INT,
    installer_id INT,
    state_id INT,
    sale_type_id INT,
    sale_price character varying,
    rep_type INT,
    rl character varying,
    rate character varying,
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

CREATE TABLE v_dealer (
    id serial NOT NULL,
    dealer_code character varying,
    dealer_name character varying,
    description character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY (id)
);

CREATE TABLE v_reps (
    id serial NOT NULL,
    rep_code character varying,
    rep_fname character varying NOT NULL,
    rep_lname character varying NOT NULL,
    asssigned_dealer INT,
    rep_status character varying NOT NULL,
    description character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (asssigned_dealer) REFERENCES v_dealer(id),
    PRIMARY KEY (id)
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
    FOREIGN KEY (dealer_id) REFERENCES v_dealer(id),
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
    FOREIGN KEY (dealer_id) REFERENCES v_dealer(id),
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
    rep_name INT,
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
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    FOREIGN KEY (sale_type_id) REFERENCES sale_type(id),
    FOREIGN KEY (installer_id) REFERENCES partners(partner_id),
    FOREIGN KEY (partner_id) REFERENCES partners(partner_id),
    FOREIGN KEY (rep_name) REFERENCES v_reps(id),
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

CREATE TABLE sale_info (
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
    sys_size character varying,
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
    FOREIGN KEY (dealer) REFERENCES v_dealer(id),
    FOREIGN KEY (partner) REFERENCES partners(partner_id),
    FOREIGN KEY (installer) REFERENCES partners(partner_id),
    FOREIGN KEY (source) REFERENCES source(id),
    FOREIGN KEY (sale_type_id) REFERENCES sale_type(id),
    FOREIGN KEY (loan_type) REFERENCES loan_type(id),
    FOREIGN KEY (state) REFERENCES states(state_id),
    FOREIGN KEY (zipcode) REFERENCES zipcodes(id),
    FOREIGN KEY (rep_1) REFERENCES v_reps(id),
    FOREIGN KEY (rep_2) REFERENCES v_reps(id),
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
    sale_info_id INT,
    date character varying,
    adder_type INT,
    gc character varying,
    extact_amt DOUBLE PRECISION,
    per_kw_amt DOUBLE PRECISION,
    rep_percent integer,
    description character varying,
    FOREIGN KEY (sale_info_id) REFERENCES  sale_info(id),
    FOREIGN KEY (adder_type) REFERENCES  adder_type(id),
    PRIMARY KEY (id)
);


CREATE TABLE customer_rebates (
	id serial NOT NULL,
	sale_info_id INT,
	date character varying,
	type INT,	
	item character varying,	 
	amount  double precision,	
	rep_percent  integer,
	description character varying,
	FOREIGN KEY (sale_info_id) REFERENCES  sale_info(id),
	FOREIGN KEY (item) REFERENCES  rebate_items(id),
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
	sale_info_id INT,
	referrer_id INT,
	date character varying,	 
	amount character varying,	
	rep_percent  integer,
	description character varying,	
	FOREIGN KEY (sale_info_id) REFERENCES  sale_info(id),
    FOREIGN KEY (referrer_id) REFERENCES  referrer_details(referrer_id),
	PRIMARY KEY (id)
);

/* Add a default Admin User to Login tables */
INSERT INTO user_roles	( role_name) VALUES ( 'admin' );
INSERT INTO "public".user_auth ( email_id, "password", passwordChangeRequired, role_id)
VALUES ( 'admin@test.com', '$2a$10$5DPnnf5GqDE1dI8L/fM79OsY7XjzmLbw3rkSVONPz.92CqHUkXYHC', true, 1 );
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
\copy v_dealer(dealer_name,description) FROM '/docker-entrypoint-initdb.d/v_dealer.csv' DELIMITER ',' CSV;
\copy partners(partner_name) FROM '/docker-entrypoint-initdb.d/partners.csv' DELIMITER ',' CSV;
\copy timeline_sla(type_m2m,state_id,days,start_date) FROM '/docker-entrypoint-initdb.d/timeline_sla.csv' DELIMITER ',' CSV;
\copy v_reps(rep_code,rep_fname,rep_lname,asssigned_dealer,rep_status,description) FROM '/docker-entrypoint-initdb.d/v_reps.csv' DELIMITER ',' CSV;
\copy tier(tier_name) FROM '/docker-entrypoint-initdb.d/tier.csv' DELIMITER ',' CSV;
\copy appointment_setters(setters_id, team_id, first_name, last_name, pay_rate, start_date, end_date) FROM '/docker-entrypoint-initdb.d/appointment_setters.csv' DELIMITER ',' CSV;

/******************************SETTINGS DB TABLE END  ***********************************************/