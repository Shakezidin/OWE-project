export default [
    {
      name: 'unique_id',
      displayName: 'Project ID',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'ntp.production',
      displayName: 'Production',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'ntp.finance_NTP',
      displayName: 'Finance NTP',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'ntp.utility_bill',
      displayName: 'Utility Bill',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'ntp.powerclerk',
      displayName: 'Power Clerk',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'contract_date',
      displayName: 'Sold Date',
      type: 'date',
      isCheckbox: false,
      filter: 'sale_date',
    },
    {
      name: 'app_status',
      displayName: 'App Status',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'project_status',
      displayName: 'Project Status',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'rep_1',
      displayName: 'Sales Rep',
      type: 'string',
      isCheckbox: false,
      filter: 'primary_sales_rep',
    },
    {
      name: 'rep_2',
      displayName: 'Setter',
      type: 'string',
      isCheckbox: false,
      filter: 'secondary_sales_rep',
    },
    {
      name: 'loan_type',
      displayName: 'Deal Type',
      type: 'string',
      isCheckbox: false,
      filter: 'finance_type',
    },
    {
      name: 'ntp_complete_date',
      displayName: 'NTP Date',
      type: 'date',
      isCheckbox: false,
    }
  ];
  