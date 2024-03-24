
drop database IF EXISTS owe_db WITH (FORCE);

/* create databases */
create database owe_db;

\c owe_db;

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

/* Tables for User Authentication */
CREATE TABLE  IF NOT EXISTS user_roles (
    role_id SERIAL,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (role_id)
);

CREATE TABLE IF NOT EXISTS user_details(
    user_id SERIAL,
    name VARCHAR(255) NOT NULL,
    user_code VARCHAR(255),
    mobile_number VARCHAR(20) NOT NULL UNIQUE,
    email_id VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    password_change_required BOOLEAN,
    reporting_manager INT,
    role_id INT,
    user_status VARCHAR(255) NOT NULL,
    user_designation VARCHAR(255),
    description VARCHAR(255),
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (reporting_manager) REFERENCES user_details(user_id),
    FOREIGN KEY (role_id) REFERENCES user_roles(role_id),
	PRIMARY KEY (user_id)
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
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    PRIMARY KEY (id)
);

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

/* Add a default Admin User to Login tables */
/* Default Admin Password is 1234 for Development purpose */
-- Insert default role 'Admin' into user_roles table
INSERT INTO user_roles (role_name) VALUES ('Admin');
INSERT INTO user_details (name, user_code, mobile_number, email_id, password, password_change_required, reporting_manager, role_id, user_status, user_designation, description) VALUES ('Shushank Sharma', 'OWE001', '0987654321', 'shushank22@gmail.com', '$2a$10$5DPnnf5GqDE1dI8L/fM79OsY7XjzmLbw3rkSVONPz.92CqHUkXYHC', false, NULL, 1, 'Active', 'CTO', 'Chief Technical Officer');
INSERT INTO user_details (name, user_code, mobile_number, email_id, password, password_change_required, reporting_manager, role_id, user_status, user_designation, description) VALUES ('Jaitunjai Singh', 'OWE002', '0987654322', 'Jai22@gmail.com', '$2a$10$5DPnnf5GqDE1dI8L/fM79OsY7XjzmLbw3rkSVONPz.92CqHUkXYHC', false, 1, 1, 'Active', 'Software Engineer', 'SE');
INSERT INTO user_details (name, user_code, mobile_number, email_id, password, password_change_required, reporting_manager, role_id, user_status, user_designation, description) VALUES ('M Asif', 'OWE003', '0987654323', 'asif22@gmail.com', '$2a$10$5DPnnf5GqDE1dI8L/fM79OsY7XjzmLbw3rkSVONPz.92CqHUkXYHC', false, 2, 1, 'Active', 'CEO', 'Chief Exec Officer');
INSERT INTO partners (partner_name,description) VALUES ('PartnerABC','Example Partner Description');
INSERT INTO tier (tier_name) VALUES ('TierName123');
INSERT INTO loan_type (product_code,active,adder,description) VALUES ('P123',1,10,'Example Loan Type Description');

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
\copy partners(partner_name) FROM '/docker-entrypoint-initdb.d/partners.csv' DELIMITER ',' CSV;
\copy timeline_sla(type_m2m,state_id,days,start_date) FROM '/docker-entrypoint-initdb.d/timeline_sla.csv' DELIMITER ',' CSV;
\copy tier(tier_name) FROM '/docker-entrypoint-initdb.d/tier.csv' DELIMITER ',' CSV;
\copy appointment_setters(team_id, first_name, last_name, pay_rate, start_date, end_date) FROM '/docker-entrypoint-initdb.d/appointment_setters.csv' DELIMITER ',' CSV;

/******************************SETTINGS DB TABLE END  ***********************************************/


/******************************* Adding All Stored Procedures ***********************************/
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewUser.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewTeam.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateAptSetter.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcSmallSysSizeCalc.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCommisionTypeCalc.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateDealerPayExport.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewCommission.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewDealer.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewMarketingFees.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewVAdders.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewSaleType.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewTierLoanFee.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewDealerTier.sql';