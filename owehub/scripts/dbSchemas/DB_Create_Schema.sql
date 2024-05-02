drop database IF EXISTS owe_db WITH (FORCE);

/* create databases */
create database owe_db;

\c owe_db;

\i '/docker-entrypoint-initdb.d/DB_Create_OWEDB_Schema.sql';
\i '/docker-entrypoint-initdb.d/DB_Create_Config_Schema.sql';
\i '/docker-entrypoint-initdb.d/DB_Create_DlrPay_Schema.sql';
\i '/docker-entrypoint-initdb.d/DB_Create_AR_Schema.sql';
\i '/docker-entrypoint-initdb.d/DB_Create_RepPay_Schema.sql';

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
INSERT INTO user_details (name, user_code, mobile_number, email_id, password, password_change_required, reporting_manager, role_id, user_status, user_designation, description) VALUES ('Shushank Sharma', 'OWE001', '0987654321', 'shushank22@gmail.com', '$2a$10$5DPnnf5GqDE1dI8L/fM79OsY7XjzmLbw3rkSVONPz.92CqHUkXYHC', false, NULL, 1, 'Active', 'Software Engineer', 'SE');
INSERT INTO user_details (name, user_code, mobile_number, email_id, password, password_change_required, reporting_manager, role_id, user_status, user_designation, description) VALUES ('Jaitunjai Singh', 'OWE002', '0987654322', 'Jai22@gmail.com', '$2a$10$5DPnnf5GqDE1dI8L/fM79OsY7XjzmLbw3rkSVONPz.92CqHUkXYHC', false, 1, 1, 'Active', 'Software Engineer', 'SE');
INSERT INTO user_details (name, user_code, mobile_number, email_id, password, password_change_required, reporting_manager, role_id, user_status, user_designation, description) VALUES ('M Asif', 'OWE003', '0987654323', 'asif22@gmail.com', '$2a$10$5DPnnf5GqDE1dI8L/fM79OsY7XjzmLbw3rkSVONPz.92CqHUkXYHC', false, 2, 1, 'Active', 'Software Engineer', 'SE');
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
\copy commission_rates(partner_id, installer_id, state_id, sale_type_id, sale_price, rep_type, is_archived, rl, rate, start_date, end_date) FROM '/docker-entrypoint-initdb.d/commission_rates.csv' DELIMITER ',' CSV;
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
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewPaymentSchedule.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewTimelineSla.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewPartner.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewState.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewLoanType.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateCommission.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateDealer.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateMarketingFee.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateVAdders.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateSaleType.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateTierLoanFee.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateDealerTier.sql'; 
\i '/docker-entrypoint-initdb.d/DB_ProcUpdatePaymentSchedule.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateTimelineSla.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateLoanType.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateCommissionArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateDealerArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateMarketingFeesArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateVAddersArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateSaleTypeArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateTierLoanFeeArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateDealerTierArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdatePaymentScheduleArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateTimelineSlaArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateLoanTypeArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateUser.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewAutoAdder.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewRebateData.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRebateData.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRebateDataArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewLoanFeeAdder.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateLoanFeeAdder.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateLoanFeeAdderArchive.sql';
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
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewAdjustments.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateAdjustmentsArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewArSchedule.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArScheduleArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewInstallCost.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateInstallCostArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewRateAdjustments.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRateAdjustmentsArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewLeaderOverride.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateLeaderOverrideArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewAdderResponsibility.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateAdderResponsibility.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateAdderResponsibilityArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewAdderCredit.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateAdderCredit.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateAdderCreditArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewLoanFee.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateLoanFee.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateLoanFeeArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewReconcile.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateReconcileArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateLeaderOverride.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateInstallCost.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateAdjustments.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRateAdjustments.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArSchedule.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateReconcile.sql';