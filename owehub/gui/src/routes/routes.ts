export const ROUTES = {
  LOGIN: '/login',
  RESETPASSWORD: '/resetPassword',
  OTP: '/otp',
  COMMISSION_DASHBOARD: '/dealer-pay',
  REPPAY_DASHBOARD: '/reppay/dashboard',
  AR_DASHBOARD: '/ar/dashboard',
  TEAM_MANAGEMENT_DASHBOARD: '/teammanagement/dashboard',
  CONFIG_COMMISSION_RATE: '/config/commissionRate',
  CONFIG_DEALER_OVER: '/config/dealerOverrides',
  CONFIG_DEALER_TIER: '/config/dealerTier',
  CONFIG_MARKETING: '/config/marketingFee',
  CONFIG_ADDER: '/config/adderValidation',
  CONFIG_LOAN: '/config/loanType',
  CONFIG_SALE: '/config/salesType',
  CONFIG_TIMELINE: '/config/timelineSla',
  CONFIG_PAYMENT_SCHEDULE: '/config/paymentSchedule',
  CONFIG_TIER_LOAN_FEE: '/config/tierloanFee',
  CONFIG_AUTO_ADDER: '/config/autoAdder',
  CONFIG_LOAN_FEE: '/config/loanFeeAddr',
  CONFIG_REBET_DATA: '/config/rebetData',
  CONFIG_REFERAL_DATA: '/config/referalData',
  CONFIG_DEALER_CREDIT: '/config/dealerCredit',
  CONFIG_NON_COMM_DLR_PAY: '/config/nonCommDlrPay',
  CONFIG_DLE_OTH_PAY: '/config/dlrOthPay',
  CONFIG_PAGE: '/config',
  CONFIG_REP_PAY_SETTINGS: '/config/rep-pay-settings',
  CONFIG_RATE_ADJUSTMENTS: '/config/rate-adjustments',
  CONFIG_AR: '/config/ar',
  CONFIG_AR_SCHEDULE: '/config/ar-schedule',
  CONFIG_INSTALL_COST: '/config/install-cost',
  CONFIG_LEADER_OVERRIDE: '/config/leader-override',
  CONFIG_ADDER_CREDITS: '/config/adder-credits',
  CONFIG_ADDER_RESPONSIBILITY: '/config/adder-responsibility',
  CONFIG_LOAN_FEES: '/config/loan-fees',
  CONFIG_AR_IMPORT: '/config/ar-import',
  CONFIG_ADJUSTMENTS: '/config/adjustments',
  CONFIG_LOAN_FEE_ADDER: '/config/loan-fee-adder',
  CONFIG_RECONCILE: '/config/reconcile',
  CONFIG_APPSETTERS: '/config/app-setter',
  CONFIG_ADDERDATA: '/config/adder-data',
  CONFIG_APREP: '/config/ap-rep',
  CONFIG_DBA: '/config/dba',
  CONFIG_SLACK: '/config/slack',
  CONFIG_REPCREDIT: '/config/repcredit',
  CONFIG_REPSTATUS: '/config/repstatus',
  CONFIG_REPINCENT: '/config/rep-incent',
  CONFIG_APADV: '/config/ap-adv',
  CONFIG_APDED: '/config/ap-ded',
  CONFIG_APOTH: '/config/ap-oth',
  CONFIG_APPDA: '/config/ap-pda',
  CONFIG_APDEALER: '/config/ap-dealer',
  CONFIG_DEALERPAYMENTS: '/config/d-payments',
  CONFIG_FINANCE_SCHEDULE: '/config/finance-schedule',
  CONFIG_SALES_PARTNER_PAY: '/config/sales-partner-commision',
  CONFIG_FINANCE_TYPES: '/config/finance-types',
  TEAM_MANAGEMENT_TABLE: '/teammanagement/dashboard/:id',
  CALENDAR: '/calendar',
  LIBRARY: '/library',
  SS_ONBOARDING: '/config/ss-onboarding',
  REPORTING: '/reporting',
  TOTAL_COUNT: '/reporting/report',
  REPORTING_PRODUCTION: '/reporting/production',
  REPORTING_QUALITY: '/reporting/quality',
  REPORTING_SPEED_OVERALL: '/reporting/speed-overall',
  REPORTING_SALES_TO_INSTALL: '/reporting/sales-install',
  REPORTING_QUALITY_PER_OFFICE: '/reporting/quality-per-office',
  REPORTING_REASON_FOR_INCOMPLETE: '/reporting/reason-for-incomplete',
  COMPLETIONS_PER_OFFICE: '/reporting/completions-per-office',
  COMPLETIONS_PER_TEAM: '/reporting/completions-per-team',
  NO_PTO: '/reporting/no-pto',
  TIMELINES: '/reporting/timelines',
  SITE_COMPLETION: '/reporting/site-completion',
  SITE_TIMELINES: '/reporting/site-timelines',
  SITE_FIRST_COMPLETION: '/reporting/site-first_completion',
  SITE_OUTSIDE_SLA: '/reporting/site-outise-sla',
  INSTALL_TO_FIN: '/reporting/install-to-fin',
  FIRST_TIME_COMPLETIONS: '/reporting/first-time-completion',

  // other routes
  REPORT: '/report',
  DATABASE_CONTROLLER: '/databaseController',
  PROJECT_PERFORMANCE: '/pipeline',
  PROJECT_STATUS: '/project-management',
  USER_MANAEMENT: '/userManagement',
  TECHNICAL_SUPPORT: '/technicalSupport',
  CHAT_BOT: '/chat_bot',
  ACCOUNT_SETTING: '/accountSetting',
  // databse manager routes
  DB_MANAGER_DASHBOARD: '/dbManager/dashboard',
  DB_MANAGER_DATA_TABLE: '/dbManager/dataTable',
  DB_MANAGER_USER_ACTIVITY: '/dbManager/userActivity',
  DB_MANAGER_WEB_HOOKS: '/dbManager/webhooks',
  BATTERY_BACK_UP: '/battery-backup-calulator/:id',
  BATTERY_UI_GENRATOR: '/battery-ui-generator/:id',
  SR_IMAGE_UPLOAD: '/sr-image-upload',
  LEADERBOARD: '/leaderboard',
  NOT_FOUND: '*',
  SCHEDULER: '/scheduler',
  SCHEDULE_DETAIL: '/schedule-detail/:id',
  SALES_REP_SCHEDULER: '/salesrep-schedule',
  ADD_NEW_SALES: '/add-new-salesrep-schedule',
  SCHEDULE_SALES_REP_SURVEY: '/schedule-sales-rep',
  PEINDING_QUEUE: '/pending-actions',
  LEAD_MANAGEMENT: '/leadmng-dashboard',
  LEAD_MANAGEMENT_ARCHIVES: '/leadmng-dashboard/lead-dashboard-archives',
  LEAD_MANAGEMENT_ADD_NEW: '/leadmng-dashboard/leadmgt-addnew',
  LEAD_MANAGEMENT_ADD_NEW_MODAL: '/leadmgt-addnew-model',
  LEAD_MANAGEMENT_HISTORY: '/leadmng-dashboard/leadmng-records',
  LEAD_MANAGEMENT_SUCCESS_MODAl: '/lead-mgmt-success-modal',
  MAP_ADDRESS: '/map-address',
  SALE_RP_CUSTOMER_FORM: '/sale-rep-customer-form',
  FOLDER_DETAIL: '/library/*',
  LIBRARY_RECYCLE_BIN: '/library/recycle-bin',
  CALCULATOR: '/calculator',
  SIGN_DOCUMENT: 'digital-signature-portal',
  AHJ: '/reporting/ahj',
  PERMIT_REDLINE: '/reporting/permit-redline',
  DYNAMIC_REPORT: '/reporting/:id',
  SUMMARY_DASBOARD: '/summary-dashboard',
  DAT_TOOL: '/dat_tool',
  DEALERDATA_PIPELINE: '/pipeline/pipeline_data',
};
