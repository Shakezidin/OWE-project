
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
