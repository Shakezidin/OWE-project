import { ICONS } from '../../icons/Icons';

// export const cardData = [
//   {
//     name: 'NTP',
//     bgColor: `var(--orange-color)`,
//     iconBgColor: `var(--white-color)`,
//     icon: ICONS.ntp_per,
//     color: `var(--white-color)`,
//     type: 'ntp_date',
//   },
//   {
//     name: 'Cancelled',
//     bgColor: `var(--purpink-color)`,
//     iconBgColor: `var(--white-color)`,
//     icon: ICONS.cancelled_per,
//     color: `var(--white-color)`,
//     type: 'cancelled_date',
//   },
//   {
//     name: 'Installed',
//     bgColor: `var(--secondary-color)`,
//     iconBgColor: `var(--white-color)`,
//     icon: ICONS.installed_per,
//     color: `var(--white-color)`,
//     type: 'pv_install_completed_date',
//   },
//   {
//     name: 'Total Sales',
//     bgColor: `var(--teritary-color)`,
//     iconBgColor: `#fff`,
//     color: '#fff',
//     icon: ICONS.sales_per,
//     type: 'contract_date',
//     key: '',
//   },
// ];

export const cardData = [
  {
    name: 'Total Sales',
    bgColor: `var(--teritary-color)`,
    iconBgColor: `#fff`,
    color: '#fff',
    icon: ICONS.sales_per,
    type: 'contract_date',
    key: '',
  },
  {
    name: 'NTP',
    bgColor: `var(--orange-color)`,
    iconBgColor: `var(--white-color)`,
    icon: ICONS.ntp_per,
    color: `var(--white-color)`,
    type: 'ntp_date',
  },
  {
    name: 'Installed',
    bgColor: `var(--secondary-color)`,
    iconBgColor: `var(--white-color)`,
    icon: ICONS.installed_per,
    color: `var(--white-color)`,
    type: 'pv_install_completed_date',
  },
  {
    name: 'Cancelled',
    bgColor: `var(--purpink-color)`,
    iconBgColor: `var(--white-color)`,
    icon: ICONS.cancelled_per,
    color: `var(--white-color)`,
    type: 'cancelled_date',
  },
];

export const projectDashData = [
  {
    ruppes: '$620,450.05',
    para: 'All Sales',
    percentColor: '#8E81E0',
    key: 'SalesPeriod',
    percent: 80,
  },
  {
    ruppes: '$620,450.05',
    para: 'Total Cancellation',
    iconBgColor: '#FFE6E6',
    percentColor: '#C470C7',
    key: 'cancellation_period',
    percent: 30,
  },
  {
    ruppes: '$620,450.05',
    para: 'Total Installation',
    percentColor: '#63ACA3',
    key: 'installation_period',
    percent: 50,
  },
];
export const projectStatusHeadData = [
  {
    name: 'State',
    para: 'Arizona',
    viewButton: false,
    bgColor: '#57B3F1',
    key: 'state',
  },
  {
    name: 'Adder',
    para: '$65,000',
    bgColor: '#EE824D',
    viewButton: true,
    key: 'adders_total',
  },
  {
    name: 'AHJ',
    para: 'NA',
    viewButton: false,
    bgColor: '#63ACA3',
    key: 'ajh',
  },
  {
    name: 'EPC',
    para: 'NA',
    viewButton: false,
    bgColor: '#C470C7',
    key: 'epc',
  },
  {
    name: 'Sys Size',
    para: 'NA',
    viewButton: false,
    bgColor: '#6761DA',
    key: 'system_size',
  },
  {
    name: 'Contract Amount',
    para: 'NA',
    viewButton: false,
    bgColor: '#63ACA3',
    key: 'contract_amount',
  },
  {
    name: 'Finance Partner',
    para: 'NA',
    viewButton: false,
    bgColor: '#57B3F1',
    key: 'finance_partner',
  },
  {
    name: 'Net EPC',
    para: 'NA',
    viewButton: false,
    bgColor: '#EE824D',
    key: 'net_epc',
  },
];
export const projects = [
  {
    projectName: 'Owe Project Installation',
    salesDate: '20 Feb,',
    salesYear: '2024',
    notchStrips: [
      { name: 'Site Survey', date: null },
      { name: 'Permit Submitted', date: null },
      { name: 'Install Ready', date: null },
      { name: 'Install Completed', date: null },
      { name: 'PTO', date: null },
    ],
    overallProgress: 20,
  },
  {
    projectName: 'Owe Project Installation',
    salesDate: 'Completed',
    notchStrips: [
      { name: 'Site Survey', date: null },
      { name: 'Permit Submitted', date: null },
      { name: 'Install Ready', date: null },
      { name: 'Install Completed', date: null },
      { name: 'PTO', date: null },
    ],
    overallProgress: 28,
  },
];
