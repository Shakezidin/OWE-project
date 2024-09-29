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