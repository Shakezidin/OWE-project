
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

/* Add a default Admin User to Login tables */
INSERT INTO user_roles	( role_name) VALUES ( 'admin' );
INSERT INTO "public".user_auth ( email_id, "password", passwordChangeRequired, role_id)
VALUES ( 'admin@test.com', '$2a$10$5DPnnf5GqDE1dI8L/fM79OsY7XjzmLbw3rkSVONPz.92CqHUkXYHC', true, 1 );
/******************************************************************************************/



/***************************** SETTINGS DB TABLE START  ************************************************/
/*Table to store the teams information for appointment setters*/
CREATE TABLE teams_settters (
        team_id serial NOT NULL,
        team_name character varying,
        PRIMARY KEY (team_id)
);

/*Table to store the appointment setters oon  boarding information*/
CREATE TABLE appointment_setters (
    setters_id serial NOT NULL,
    team_id INT,
    first_name character varying,
    last_name character varying,
    pay_rate  character varying,
    start_date character varying NOT NULL,
    end_date character varying,
    description character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    PRIMARY KEY (setters_id),
    FOREIGN KEY (team_id) REFERENCES teams_settters(team_id)
);

CREATE TABLE states (
    state_id bigint NOT NULL,
    abbr character varying(2),
    name character varying,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    PRIMARY KEY (state_id)
);

CREATE TABLE zipcodes (
    id bigint NOT NULL,
    zipcode character varying,
    city character varying,
    state_id INT,
    lat numeric(15,10),
    lon numeric(15,10),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    FOREIGN KEY (state_id) REFERENCES states(state_id)
    PRIMARY KEY (id)
);

CREATE TABLE partners (
    partner_id serial NOT NULL,
    partner_name character varying,
    description character varying,
    PRIMARY KEY (partner_id)
);

CREATE TABLE sale_type (
    id serial NOT NULL,
    name character varying,
    description character varying,
    PRIMARY KEY (id)
);

CREATE TABLE commission_rates (
    id serial NOT NULL,
    partner_id INT,
    installer_id INT,
    state_id INT,
    sale_type_id INT,
    sale_price character varying,
    rep_type character varying,
    rl character varying,
    rate character varying,
    start_date character varying NOT NULL,
    end_date character varying,
    FOREIGN KEY (state_id) REFERENCES states(state_id),
    FOREIGN KEY (partner_id) REFERENCES partners(partner_id),
    FOREIGN KEY (installer_id) REFERENCES partners(partner_id),
    FOREIGN KEY (sale_type_id) REFERENCES sale_type(id),
    PRIMARY KEY (id)
);





/******************************SETTINGS DB TABLE END  ***********************************************/