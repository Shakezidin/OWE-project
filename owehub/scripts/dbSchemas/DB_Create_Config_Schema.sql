/***************************** SETTINGS DB TABLE START  ************************************************/
/*Table to store the teams information for appointment setters*/



/*Table to store thrae appointment setters on  boarding information*/

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

CREATE TABLE IF NOT EXISTS user_roles (
    role_id SERIAL,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (role_id)
);

CREATE TABLE v_dealer (
    id SERIAL NOT NULL,
    dealer_code character varying,
    dealer_name character varying,
    description character varying,
    dealer_logo character varying,
    bg_colour character varying,
    preferred_name character varying,
    is_active BOOLEAN DEFAULT FALSE, 
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_details(
    user_id SERIAL,
    name VARCHAR(255) NOT NULL,
    db_username VARCHAR(255),
    user_code VARCHAR(255),
    mobile_number VARCHAR(20) NOT NULL UNIQUE,
    email_id VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    password_change_required BOOLEAN,
    reporting_manager INT,
    dealer_owner INT,
    role_id INT,
    user_status VARCHAR(255),
    user_designation VARCHAR(255),
    description VARCHAR(501),
    region VARCHAR(255),
    street_address VARCHAR(255),
    state INT,
    city VARCHAR(50),
    zipcode INT,
    country VARCHAR(50),
    team_id INT,
    tables_permissions jsonb,
    dealer_id INT,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (reporting_manager) REFERENCES user_details(user_id) ON DELETE SET NULL,
    FOREIGN KEY (dealer_owner) REFERENCES v_dealer(id) ON DELETE SET NULL,
    FOREIGN KEY (role_id) REFERENCES user_roles(role_id),
    FOREIGN KEY (state) REFERENCES states(state_id),
    FOREIGN KEY (zipcode) REFERENCES zipcodes(id),
    FOREIGN KEY (dealer_id) REFERENCES v_dealer(id),
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS teams (
    team_id SERIAL NOT NULL,
    team_name VARCHAR(255) NOT NULL UNIQUE,
    dealer_id INT NOT NULL,
    description VARCHAR(255),
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz,
    FOREIGN KEY (dealer_id) REFERENCES v_dealer(id),
    PRIMARY KEY (team_id)
);

CREATE TABLE IF NOT EXISTS team_members (
    team_member_id SERIAL PRIMARY KEY,
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    role_in_team VARCHAR(50) NOT NULL,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz,
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (user_id) REFERENCES user_details(user_id)
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
    is_archived BOOLEAN DEFAULT FALSE,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
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
    product_code character varying,
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
    start_date date,
    end_date date,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (tier_id) REFERENCES tier(id),
    FOREIGN KEY (dealer_id) REFERENCES v_dealer(id),
    PRIMARY KEY (id)
);

CREATE TABLE timeline_sla (
    id serial NOT NULL,
    type_m2m character varying,
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

CREATE TABLE auto_adder (
    id serial NOT NULL,
    unique_id varchar NOT NULL,
    date date,
    type text,
    gc text,
    exact_amount float,
    per_kw_amount float,
    rep_percentage float,
    description_repvisible text,
    notes_no_repvisible text,
    adder_type text,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY(id)
);

CREATE TABLE rebate_data (
    id serial NOT NULL,
    customer_verf text,
    unique_id varchar NOT NULL,
    date date,
    type text,
    item text,
    amount float,
    rep_doll_divby_per float,
    notes text,
    type_rd_mktg text,
    rep_1 INT,
    rep_2 INT,
    sys_size float,
    state_id INT,
    rep_count float,
    per_rep_addr_share float,
    per_rep_def_ovrd float,
    per_rep_ovrd_share float,
    r1_pay_scale text,
    r1_rebate_credit_$ float,
    r1_rebate_credit_perc float,
    r1_addr_resp float,
    r2_pay_scale text,
    r2_rebate_credit_$ float,
    r2_rebate_credit_perc float,
    r2_addr_resp float,
    adder_amount float,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    FOREIGN KEY (rep_1) REFERENCES user_details(user_id),
    FOREIGN KEY (rep_2) REFERENCES user_details(user_id)
);

CREATE TABLE referral_data (
    id serial NOT NULL,
    unique_id varchar NOT NULL,
    new_customer text,
    referrer_serial text,
    referrer_name text,
    amount Float,
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
    r1_referral_credit_$ text,
    r1_referral_credit_perc text,
    r1_addr_resp text,
    r2_pay_scale float,
    r2_referral_credit_$ text,
    r2_referral_credit_perc text,
    r2_addr_resp text,
    adder_amount float,
    start_date character varying,
    end_date character varying,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    FOREIGN KEY (rep_1) REFERENCES user_details(user_id),
    FOREIGN KEY (rep_2) REFERENCES user_details(user_id)
);

CREATE TABLE dealer_repayment_bonus (
    id serial NOT NULL,
    unique_id varchar,
    dealer_id INT,
    partner INT,
    installer INT,
    loan_type INT,
    home_owner varchar,
    sys_size float,
    contract_$$ float,
    shaky_hand BOOLEAN,
    repayment_bonus float,
    remaining_repayment_bonus float,
    FOREIGN KEY (loan_type) REFERENCES loan_type(id),
    FOREIGN KEY (dealer_id) REFERENCES v_dealer(id),
    FOREIGN KEY (partner) REFERENCES partners(partner_id),
    FOREIGN KEY (installer) REFERENCES partners(partner_id),
    is_archived BOOLEAN DEFAULT FALSE,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);

CREATE TABLE dealer_credit (
    id serial NOT NULL,
    unique_id varchar NOT NULL,
    date date,
    exact_amount float,
    per_kw_amount float,
    approved_by text,
    notes text,
    total_amount float,
    sys_size float,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);

CREATE TABLE noncomm_dlrpay (
    id serial NOT NULL,
    unique_id varchar NOT NULL,
    customer text,
    dealer_id INT,
    dealer_dba text,
    exact_amount float,
    approved_by text,
    notes text,
    balance float,
    paid_amount float,
    dba text,
    date DATE NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    commission_model text,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (dealer_id) REFERENCES v_dealer(id)
);

CREATE TABLE dlr_oth(
    id serial NOT NULL,
    unique_id varchar NOT NULL,
    payee text,
    amount float,
    description character varying,
    balance float,
    paid_amount float,
    is_archived BOOLEAN DEFAULT FALSE,
    commission_model text,
    date DATE,
    dba text,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    PRIMARY KEY (id)
);

CREATE TABLE rep_pay_settings (
    id serial NOT NULL,
    name TEXT,
    state_id INT,
    pay_scale INT,
    position TEXT,
    b_e BOOLEAN,
    is_archived BOOLEAN DEFAULT FALSE,
    start_date DATE,
    end_date DATE,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    FOREIGN KEY (pay_scale) REFERENCES rep_type(id),
    PRIMARY KEY (id)
);

CREATE TABLE ar (
    id serial NOT NULL,
    unique_id varchar NOT NULL,
    customer text,
    partner INT,
    date date,
    amount float,
    payment_type text,
    bank text,
    ced date,
    total_paid float,
    state INT,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    FOREIGN KEY (partner) REFERENCES partners(partner_id),
    FOREIGN KEY (state) REFERENCES states(state_id),
    PRIMARY KEY (id)
);

CREATE TABLE dba (
    id serial NOT NULL,
    preferred_name varchar,
    dba varchar,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);