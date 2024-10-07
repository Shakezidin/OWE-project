drop database IF EXISTS owe_db WITH (FORCE);

/* create databases */
create database owe_db;

\c owe_db;

-- \i '/docker-entrypoint-initdb.d/DB_Create_OWEDB_Schema.sql';
\i '/docker-entrypoint-initdb.d/DB_Create_Config_Schema.sql';

/* Battery Backup Calcuator Schema */
\i '/docker-entrypoint-initdb.d/DB_Create_Battery_BackupCalc_Schema.sql'

/* Add a default Admin User to Login tables */
/* Default Admin Password is 1234 for Development purpose */
-- Insert default role 'Admin' into user_roles table
INSERT INTO user_roles (role_name) VALUES ('Admin');
INSERT INTO user_roles (role_name) VALUES ('Dealer Owner');
INSERT INTO user_roles (role_name) VALUES ('SubDealer Owner');
INSERT INTO user_roles (role_name) VALUES ('Partner');
INSERT INTO user_roles (role_name) VALUES ('Regional Manager');
INSERT INTO user_roles (role_name) VALUES ('Sales Manager');
INSERT INTO user_roles (role_name) VALUES ('Sale Representative');
INSERT INTO user_roles (role_name) VALUES ('Appointment Setter');
INSERT INTO user_roles (role_name) VALUES ('Finance Admin');
INSERT INTO user_roles (role_name) VALUES ('DB User');
INSERT INTO user_roles (role_name) VALUES ('Account Manager');
INSERT INTO user_roles (role_name) VALUES ('Account Executive');
/* INSERT INTO user_details (name, user_code, mobile_number, email_id, password, password_change_required, reporting_manager, role_id, user_status, user_designation, description) VALUES ('Shushank Sharma', 'OWE001', '0987654321', 'shushank22@gmail.com', '$2a$10$5DPnnf5GqDE1dI8L/fM79OsY7XjzmLbw3rkSVONPz.92CqHUkXYHC', false, NULL, 1, 'Active', 'Software Engineer', 'SE');
INSERT INTO user_details (name, user_code, mobile_number, email_id, password, password_change_required, reporting_manager, role_id, user_status, user_designation, description) VALUES ('Jaitunjai Singh', 'OWE002', '0987654322', 'Jai22@gmail.com', '$2a$10$5DPnnf5GqDE1dI8L/fM79OsY7XjzmLbw3rkSVONPz.92CqHUkXYHC', false, 1, 1, 'Active', 'Software Engineer', 'SE');
INSERT INTO user_details (name, user_code, mobile_number, email_id, password, password_change_required, reporting_manager, role_id, user_status, user_designation, description) VALUES ('M Asif', 'OWE003', '0987654323', 'asif22@gmail.com', '$2a$10$5DPnnf5GqDE1dI8L/fM79OsY7XjzmLbw3rkSVONPz.92CqHUkXYHC', false, 2, 1, 'Active', 'Software Engineer', 'SE');
*/
\copy v_dealer (dealer_code,dealer_name) FROM '/docker-entrypoint-initdb.d/vdealer.csv' DELIMITER ',' CSV;
\copy user_details (name,user_code,mobile_number,email_id,password,password_change_required,reporting_manager,dealer_id,role_id,user_status,user_designation,description,region,street_address,state,city,zipcode,country,tables_permissions,created_at,updated_at) FROM '/docker-entrypoint-initdb.d/user_details.csv' DELIMITER ',' CSV;

/******************************************************************************************/

/* Insert Default Data in all the rquried tables */
\copy states(abbr,name) FROM '/docker-entrypoint-initdb.d/states.csv' DELIMITER ',' CSV;
\copy partners(partner_name) FROM '/docker-entrypoint-initdb.d/partners.csv' DELIMITER ',' CSV;
\copy ar(unique_id,date,amount) FROM '/docker-entrypoint-initdb.d/ar.csv' DELIMITER ',' CSV;
/******************************SETTINGS DB TABLE END  ***********************************************/


/******************************* Adding All Stored Procedures ***********************************/
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewUser.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewTeam.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewPartner.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewState.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateUser.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateProfile.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateVDealer.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateVDealer.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateVDealerArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewTeam.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRepTeam.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcDeleteTeamMember.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateTeamName.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcDeleteTeams.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcAddTeamMember.sql';


/* Battery Backup Calcuator Schema */
\i '/docker-entrypoint-initdb.d/DB_ProcBatteryBackupCalc_CreateProspect.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcBatteryBackupCalc_CreateProspectLoad.sql';

/* Scheduling Schema */
\i '/docker-entrypoint-initdb.d/DB_ProcCreateSchedulingProject.sql';