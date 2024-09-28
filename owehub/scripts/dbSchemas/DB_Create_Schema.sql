drop database IF EXISTS owe_db WITH (FORCE);

/* create databases */
create database owe_db;

\c owe_db;

-- \i '/docker-entrypoint-initdb.d/DB_Create_OWEDB_Schema.sql';
\i '/docker-entrypoint-initdb.d/DB_Create_Config_Schema.sql';
\i '/docker-entrypoint-initdb.d/DB_Create_DlrPay_Schema.sql';
\i '/docker-entrypoint-initdb.d/DB_Create_AR_Schema.sql';
\i '/docker-entrypoint-initdb.d/DB_Create_RepPay_Schema.sql';

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
-- INSERT INTO partners (partner_name,description) VALUES ('PartnerABC','Example Partner Description');
-- INSERT INTO tier (tier_name) VALUES ('TierName123');
-- INSERT INTO loan_type (product_code,active,adder,description) VALUES ('P123',1,10,'Example Loan Type Description');

/******************************************************************************************/

/* Insert Default Data in all the rquried tables */
\copy rebate_items(item) FROM '/docker-entrypoint-initdb.d/rebate_items.csv' DELIMITER ',' CSV;
\copy rebate_type(rebate_type) FROM '/docker-entrypoint-initdb.d/rebate_type.csv' DELIMITER ',' CSV;
\copy adder_type(adder_type) FROM '/docker-entrypoint-initdb.d/adder_type.csv' DELIMITER ',' CSV;
\copy states(abbr,name) FROM '/docker-entrypoint-initdb.d/states.csv' DELIMITER ',' CSV;
\copy project_status(status) FROM '/docker-entrypoint-initdb.d/project_status.csv' DELIMITER ',' CSV;
-- \copy teams(team_name) FROM '/docker-entrypoint-initdb.d/teams.csv' DELIMITER ',' CSV;
\copy rep_type(rep_type) FROM '/docker-entrypoint-initdb.d/rep_type.csv' DELIMITER ',' CSV;
\copy sale_type(type_name) FROM '/docker-entrypoint-initdb.d/sale_type.csv' DELIMITER ',' CSV;
\copy source(name,description) FROM '/docker-entrypoint-initdb.d/source.csv' DELIMITER ',' CSV;
\copy partners(partner_name) FROM '/docker-entrypoint-initdb.d/partners.csv' DELIMITER ',' CSV;
\copy timeline_sla(type_m2m,state_id,days,start_date) FROM '/docker-entrypoint-initdb.d/timeline_sla.csv' DELIMITER ',' CSV;
\copy tier(tier_name) FROM '/docker-entrypoint-initdb.d/tier.csv' DELIMITER ',' CSV;
\copy loan_type (product_code,description,active,adder) FROM '/docker-entrypoint-initdb.d/loan_type.csv' DELIMITER ',' CSV;
\copy dealer_tier(dealer_id,tier_id,start_date,end_date) FROM '/docker-entrypoint-initdb.d/dealer_tier1.csv' DELIMITER ',' CSV;
\copy ar(unique_id,date,amount) FROM '/docker-entrypoint-initdb.d/ar.csv' DELIMITER ',' CSV;
\copy referral_data(unique_id,new_customer,referrer_serial,referrer_name,amount,rep_doll_divby_per,notes,type,sys_size,state_id,adder_amount,start_date,end_date) FROM '/docker-entrypoint-initdb.d/referral_data.csv' DELIMITER ',' CSV;
\copy rebate_data(unique_id,rep_doll_divby_per,amount,type,date) FROM '/docker-entrypoint-initdb.d/rebate_data.csv' DELIMITER ',' CSV;
\copy dealer_credit(unique_id,date,exact_amount,per_kw_amount,approved_by,notes,total_amount,sys_size) FROM '/docker-entrypoint-initdb.d/dealer_credit.csv' DELIMITER '^' CSV;
\copy dealer_repayment_bonus(unique_id,home_owner,sys_size,contract_$$,shaky_hand,repayment_bonus,remaining_repayment_bonus) FROM '/docker-entrypoint-initdb.d/dealer_repayment_bonus.csv' DELIMITER ',' CSV;
\copy auto_adder(rep_percentage,unique_id) FROM '/docker-entrypoint-initdb.d/auto_adder.csv' DELIMITER ',' CSV;
\copy dba(preferred_name,dba) FROM '/docker-entrypoint-initdb.d/dba.csv' DELIMITER ',' CSV;
\copy rep_pay_settings(name,state_id,pay_scale,position,b_e,start_date,end_Date) FROM '/docker-entrypoint-initdb.d/rep_pay_settings.csv' DELIMITER ',' CSV;
\copy noncomm_dlrpay(unique_id,date,exact_amount,approved_by,notes) FROM '/docker-entrypoint-initdb.d/non_comm.csv' DELIMITER ',' CSV;
\copy dlr_oth(unique_id,payee,amount,date,description,balance,paid_amount,dba) FROM '/docker-entrypoint-initdb.d/dlr_oth.csv' DELIMITER ',' CSV;

/******************************SETTINGS DB TABLE END  ***********************************************/


/******************************* Adding All Stored Procedures ***********************************/
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewUser.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewTeam.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcSmallSysSizeCalc.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCommisionTypeCalc.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewCommission.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewVAdders.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewSaleType.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewDealerTier.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewTimelineSla.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewPartner.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewState.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewLoanType.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateCommission.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateVAdders.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateSaleType.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateDealerTier.sql'; 
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateTimelineSla.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateLoanType.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateCommissionArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateVAddersArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateSaleTypeArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateDealerTierArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdatePaymentScheduleArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateTimelineSlaArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateLoanTypeArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateUser.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewAutoAdder.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewRebateData.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRebateData.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRebateDataArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewReferralData.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewDealerCredit.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewNonCommDlrPay.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateDealerCredit.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateDealerCreditArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateReferralData.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateReferralDataArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateNonCommDlrPay.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateNonCommDlrPayArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewDlrOth.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateDlrOth.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateDlrOthArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewRepPaySettings.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRepPaySettings.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRepPaySettingsArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewArImport.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArImport.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArImportArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewAR.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateAR.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateARArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateProfile.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateVDealer.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateVDealer.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateVDealerArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewDba.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateDba.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArchiveApPda.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewTeam.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRepTeam.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcDeleteTeamMember.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateTeamName.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcDeleteTeams.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcAddTeamMember.sql';


/* Battery Backup Calcuator Schema */
\i '/docker-entrypoint-initdb.d/DB_ProcBatteryBackupCalc_CreateProspect.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcBatteryBackupCalc_CreateProspectLoad.sql';
