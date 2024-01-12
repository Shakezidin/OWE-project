
drop database IF EXISTS owe_db WITH (FORCE);

/* create databases */
create database owe_db;

\c owe_db;

/* Tables for User Authentication */
CREATE TABLE  IF NOT EXISTS user_roles (
    id SERIAL,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_auth(
    id SERIAL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    passwordChangeRequired BOOLEAN,
    role_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES user_roles(id)
);

/* Add a default Admin User to Login tables */
INSERT INTO user_roles	( role_name) VALUES ( 'admin' );
INSERT INTO "public".user_auth ( username, "password", passwordChangeRequired, role_id)
VALUES ( 'admin', '$2b$12$zpapHEPyTLgXISSYRCCqTeQYxQaYpeRybDHEx1zJSZlBx0dT./9sG', true, 1 );
/******************************************************************************************/
