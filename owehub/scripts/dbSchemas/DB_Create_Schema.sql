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
-- \copy user_details (name,user_code,mobile_number,email_id,password,password_change_required,reporting_manager,dealer_id,role_id,user_status,user_designation,description,region,street_address,state,city,zipcode,country,tables_permissions,created_at,updated_at) FROM '/docker-entrypoint-initdb.d/user_details.csv' DELIMITER ',' CSV;
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
\copy commission_rates(partner_id, installer_id,sale_type_id, state_id, rl, rate, rep_type, sale_price, start_date, end_date) FROM '/docker-entrypoint-initdb.d/commission_rates.csv' DELIMITER ',' CSV;
-- \copy appointment_setters(team_id, first_name, last_name, pay_rate, start_date, end_date) FROM '/docker-entrypoint-initdb.d/appointment_setters.csv' DELIMITER ',' CSV;
\copy loan_type (product_code,description,active,adder) FROM '/docker-entrypoint-initdb.d/loan_type.csv' DELIMITER ',' CSV;
\copy dealer_override(sub_dealer,dealer_id,pay_rate,start_date,end_date,state) FROM '/docker-entrypoint-initdb.d/dealer_override.csv' DELIMITER ',' CSV;
\copy dealer_tier(dealer_id,tier_id,start_date,end_date) FROM '/docker-entrypoint-initdb.d/dealer_tier1.csv' DELIMITER ',' CSV;
\copy loan_fee(dealer_id,installer,loan_type,state_id,owe_cost,dlr_mu,dlr_cost,start_date,end_date) FROM '/docker-entrypoint-initdb.d/loan_fee1.csv' DELIMITER ',' CSV;
\copy tier_loan_fee(dealer_tier,installer_id,loan_type,state_id,owe_cost,dlr_mu,dlr_cost,start_date,end_date) FROM '/docker-entrypoint-initdb.d/tier_loan_fee1.csv' DELIMITER ',' CSV;
\copy adjustments(unique_id,customer,partner,installer,state,sys_size,bl,epc,date,amount,notes) FROM '/docker-entrypoint-initdb.d/adjustments.csv' DELIMITER ',' CSV;
\copy ar(unique_id,date,amount) FROM '/docker-entrypoint-initdb.d/ar.csv' DELIMITER ',' CSV;
\copy ar_schedule(partner,installer,sale_type_id,state_id,red_line,calc_date,permit_pay,permit_max,install_pay,pto_pay,start_date,end_date) FROM '/docker-entrypoint-initdb.d/ar_schedule.csv' DELIMITER ',' CSV;
\copy install_cost(cost,start_date,end_date) FROM '/docker-entrypoint-initdb.d/install_cost.csv' DELIMITER ',' CSV;
\copy reconcile(unique_id,start_date,amount,notes) FROM '/docker-entrypoint-initdb.d/reconcile.csv' DELIMITER ',' CSV;
\copy adder_data(unique_id,date,gc,exact_amount,per_kw_amt,rep_percent) FROM '/docker-entrypoint-initdb.d/adder_data.csv' DELIMITER ',' CSV;
\copy referral_data(unique_id,new_customer,referrer_serial,referrer_name,amount,rep_doll_divby_per,notes,type,sys_size,state_id,adder_amount,start_date,end_date) FROM '/docker-entrypoint-initdb.d/referral_data.csv' DELIMITER ',' CSV;
\copy rebate_data(unique_id,rep_doll_divby_per,amount,type,date) FROM '/docker-entrypoint-initdb.d/rebate_data.csv' DELIMITER ',' CSV;
\copy dealer_credit(unique_id,date,exact_amount,per_kw_amount,approved_by,notes,total_amount,sys_size) FROM '/docker-entrypoint-initdb.d/dealer_credit.csv' DELIMITER '^' CSV;
\copy ap_rep(unique_id,rep,type,amount) FROM '/docker-entrypoint-initdb.d/ap_rep.csv' DELIMITER ',' CSV;
\copy payment_schedule(dealer_id,partner_id,installer_id,sale_type_id,state_id,rl,draw,draw_max,rep_draw,rep_draw_max,rep_pay,start_date,end_date) FROM '/docker-entrypoint-initdb.d/pay_schedule.csv' DELIMITER ',' CSV;
\copy ap_dealer(unique_id,dealer_id,dba,type,date,amount,method,transaction,notes) FROM '/docker-entrypoint-initdb.d/ap_dealer.csv' DELIMITER '^' CSV;
\copy dealer_repayment_bonus(unique_id,home_owner,sys_size,contract_$$,shaky_hand,repayment_bonus,remaining_repayment_bonus) FROM '/docker-entrypoint-initdb.d/dealer_repayment_bonus.csv' DELIMITER ',' CSV;
\copy auto_adder(rep_percentage,unique_id) FROM '/docker-entrypoint-initdb.d/auto_adder.csv' DELIMITER ',' CSV;
\copy dba(preferred_name,dba) FROM '/docker-entrypoint-initdb.d/dba.csv' DELIMITER ',' CSV;
\copy loan_fee_adder(unique_id,per_kw_amount,rep_doll_divby_per,type,contract_dol_dol,date) FROM '/docker-entrypoint-initdb.d/loan_fee_adder.csv' DELIMITER ',' CSV;
\copy rate_adjustments(pay_scale,position,adjustment,min_rate,max_rate) FROM '/docker-entrypoint-initdb.d/rate_adjustments.csv' DELIMITER ',' CSV;
\copy rep_credit(unique_id,per_rep_amt,exact_amt) FROM '/docker-entrypoint-initdb.d/rep_credit.csv' DELIMITER ',' CSV;
\copy rep_incent(name,month,doll_div_kw) FROM '/docker-entrypoint-initdb.d/rep_incent.csv' DELIMITER '^' CSV;
\copy rep_pay_settings(name,state_id,pay_scale,position,b_e,start_date,end_Date) FROM '/docker-entrypoint-initdb.d/rep_pay_settings.csv' DELIMITER ',' CSV;
\copy adder_credit(pay_scale,type,max_rate,min_rate) FROM '/docker-entrypoint-initdb.d/adder_credit.csv' DELIMITER ',' CSV;
\copy ap_oth(unique_id,payee,amount,date) FROM '/docker-entrypoint-initdb.d/ap_oth.csv' DELIMITER ',' CSV;
\copy ap_pda(unique_id,payee,amount_ovrd,date) FROM '/docker-entrypoint-initdb.d/ap_pda.csv' DELIMITER ',' CSV;
\copy ap_ded(unique_id,payee,amount,date) FROM '/docker-entrypoint-initdb.d/ap_ded.csv' DELIMITER ',' CSV;
\copy ap_adv(unique_id,payee,amount_ovrd,date) FROM '/docker-entrypoint-initdb.d/ap_adv.csv' DELIMITER ',' CSV;
\copy dealer_owners(dealer_owner,role,blank) FROM '/docker-entrypoint-initdb.d/dealer_owners.csv' DELIMITER ',' CSV;
\copy rep_status(name,status) FROM '/docker-entrypoint-initdb.d/rep_status.csv' DELIMITER ',' CSV;
\copy marketing_fees(source_id,dba,state_id,fee_rate,chg_dlr,pay_src,description,start_date,end_date) FROM '/docker-entrypoint-initdb.d/marketing_fees.csv' DELIMITER ',' CSV;
\copy adder_responsibility(pay_scale,percentage) FROM '/docker-entrypoint-initdb.d/adder_responsibility.csv' DELIMITER ',' CSV;
\copy noncomm_dlrpay(unique_id,date,exact_amount,approved_by,notes) FROM '/docker-entrypoint-initdb.d/non_comm.csv' DELIMITER ',' CSV;
\copy dlr_oth(unique_id,payee,amount,date,description,balance,paid_amount,dba) FROM '/docker-entrypoint-initdb.d/dlr_oth.csv' DELIMITER ',' CSV;
-- \copy appt_setters(name,team_id,pay_rate,start_date,end_date) FROM '/docker-entrypoint-initdb.d/appt_setters.csv' DELIMITER ',' CSV;
-- \copy leader_override(team_id,leader_name,type,term,qual,sales_q,team_kw_q,pay_rate,start_date,end_date) FROM '/docker-entrypoint-initdb.d/leader_override.csv' DELIMITER ',' CSV;

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
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewApptSetters.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateApptSetters.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateApptSettersArchive.sql';
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
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewArImport.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArImport.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArImportArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewAR.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateAR.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateARArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewReconcile.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateReconcileArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateLeaderOverride.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateInstallCost.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateAdjustments.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRateAdjustments.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArSchedule.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateReconcile.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewAdderData.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateAdderData.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateAdderDataArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewApRep.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateApRepArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateApRep.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateProfile.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateVDealer.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateVDealer.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateVDealerArchive.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewApDed.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewApOth.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewApPda.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewApAdv.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewRepCredit.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewRepIncent.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewRepStatus.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewDba.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateApAdv.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateApDed.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateApOth.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateApPda.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateDba.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRepCredit.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRepIncent.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRepStatus.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArchiveApAdv.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArchiveApDed.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArchiveApOth.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArchiveApPda.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArchiveRepCredit.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArchiveRepIncent.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArchiveRepStatus.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateArchiveDba.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcCreateNewTeam.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateRepTeam.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcDeleteTeamMember.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcUpdateTeamName.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcDeleteTeams.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcAddTeamMember.sql';


/* Battery Backup Calcuator Schema */
\i '/docker-entrypoint-initdb.d/DB_ProcBatteryBackupCalc_CreateProspect.sql';
\i '/docker-entrypoint-initdb.d/DB_ProcBatteryBackupCalc_CreateProspectLoad.sql';
