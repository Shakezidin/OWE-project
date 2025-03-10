export default [
  {
    name: 'unique_id',
    displayName: 'Unique ID',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'home_owner',
    displayName: 'Home Owner',
    type: 'string',
    isCheckbox: false,
    filter: 'customer_name'
  },
  {
    name: 'project_status',
    displayName: 'Project Status',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'finance_company',
    displayName: 'Financer',
    type: 'string',
    isCheckbox: false,
  },

  {
    name: 'type',
    displayName: 'Type',
    type: 'string',
    isCheckbox: false,
    isNotFilter: true
  },
  {
    name: 'loan_type',
    displayName: 'Loan Type',
    type: 'string',
    isCheckbox: false,
    filter: 'finance_type'
  },
  {
    name: 'street_address',
    displayName: 'Street Address',
    type: 'string',
    isCheckbox: false,
    filter: 'address'
  },

  {
    name: 'state',
    displayName: 'State',
    type: 'string',
    isCheckbox: false,
  },

  {
    name: 'email',
    displayName: 'Email',
    type: 'string',
    isCheckbox: false,
    filter: 'email_address'
  },
  {
    name: 'phone_number',
    displayName: 'Phone Number',
    type: 'string',
    isCheckbox: false,
  },

  {
    name: 'partner_dealer',
    displayName: 'Partner',
    type: 'string',
    isCheckbox: false,
    filter: 'dealer'
  },
  {
    name: 'rep_1',
    displayName: 'Sales Rep1',
    type: 'string',
    isCheckbox: false,
    filter: 'primary_sales_rep'
  },
  {
    name: 'rep_2',
    displayName: 'Sales Rep2',
    type: 'string',
    isCheckbox: false,
    filter: 'secondary_sales_rep'
  },
  {
    name: 'setter',
    displayName: 'Setter',
    type: 'string',
    isCheckbox: false,

  },
  {
    name: 'system_size',
    displayName: 'Sys. Size',
    type: 'number',
    isCheckbox: false,
    filter: 'contracted_system_size'
  },
  {
    name: 'contract_amount',
    displayName: 'Contract $$',
    type: 'string',
    isCheckbox: false,
    filter: 'total_system_cost'
  },

  {
    name: 'contract_date',
    displayName: 'Contract ✓',
    type: 'date',
    isCheckbox: false,
    filter: 'sale_date'
  },
  {
    name: 'survey_final_completion_date',
    displayName: 'Site Survey',
    type: 'date',
    isCheckbox: false,
    isNotFilter: true
  },
  {
    name: 'ntp_complete_date',
    displayName: 'NTP',
    type: 'date',
    isCheckbox: false,
  },
  {
    name: 'permit_submit_date',
    displayName: 'Perm Submit',
    type: 'date',
    isCheckbox: false,
    filter: 'pv_submitted'
  },
  {
    name: 'permit_approval_date',
    displayName: 'Perm App',
    type: 'date',
    isCheckbox: false,
    filter: 'pv_approved'
  },
  {
    name: 'ic_submit_date',
    displayName: 'IC Sub',
    type: 'date',
    isCheckbox: false,
    filter: 'ic_submitted_date'
  },
  {
    name: 'ic_approval_date',
    displayName: 'IC APP',
    type: 'date',
    isCheckbox: false,
    filter: 'ic_approved_date'
  },

  {
    name: 'cancel_date',
    displayName: 'Cancel Date',
    type: 'date',
    isCheckbox: false,
  },
  {
    name: 'pv_install_date',
    displayName: 'Pv Install Date',
    type: 'date',
    isCheckbox: false,
    filter: 'pv_completion_date'
  },
  {
    name: 'pto_date',
    displayName: 'PTO Date',
    type: 'date',
    isCheckbox: false,
    filter: 'pto_granted'
  },

  {
    name: 'fin_complete_date',
    displayName: 'Fin Date',
    type: 'date',
    isCheckbox: false,
    filter: 'pv_fin_date'
  },
  {
    name: 'jeopardy_date',
    displayName: 'Jeopardy',
    type: 'boolean',
    isCheckbox: false,
  },
  {
    name: 'project_age',
    displayName: 'Project Age',
    type: 'number',
    isCheckbox: false,
    // isNotFilter: true
  },

  {
    name: 'days_pending_ntp',
    displayName: 'Days Pending NTP',
    type: 'number',
    isCheckbox: false,
    // isNotFilter: true
  },
  {
    name: 'days_pending_permits',
    displayName: 'Days Pending Permits',
    type: 'number',
    isCheckbox: false,
    // isNotFilter: true
  },
  {
    name: 'days_pending_install',
    displayName: 'Days Pending Install',
    type: 'number',
    isCheckbox: false,

  },
  {
    name: 'days_pending_pto',
    displayName: 'Days Pending PTO',
    type: 'number',
    isCheckbox: false,

  },


];