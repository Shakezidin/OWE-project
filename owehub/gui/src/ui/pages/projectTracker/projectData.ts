import { ICONS } from "../../icons/Icons";

export const cardData = [
  {
    name: "Sales",
    bgColor: "#F9E7F9",
    iconBgColor: `#800080`,
    color: "#800080",
    icon: ICONS.salesIcon,
    type:"contract_date",
    key:""
  },
  {
    name: "NTP",
    bgColor: "#EAF6FF",
    iconBgColor: `var(--project-icon-color)`,
    icon: ICONS.ntpIcon,
    color: `var(--project-icon-color)`,
    type:"ntp_date"
  },
  {
    name: "Installed",
    bgColor: `var(--project-card-color-3)`,
    iconBgColor: `var(--project-icon-color-3)`,
    icon: ICONS.installIcon,
    color: `var(--project-icon-color-3)`,
    type:"pv_install_completed_date"
  },
  {
    name: "Cancelled",
    bgColor: `var(--project-card-color-4)`,
    iconBgColor: `var(--project-icon-color-4)`,
    icon: ICONS.cancelIcon,
    color: `var(--project-icon-color-4)`,
    type:"cancelled_date"
  },
];
export const projectDashData = [
  {
    ruppes: "$620,450.05",
    para: "Total Sales for Periods",
    iconBgColor: "#E8F8EE",
    icon: ICONS.greenDoller,
    percentColor: "#14AD8A",
    curveImg: ICONS.curveGreen,
    arrow: ICONS.arrowGreen,
    key:"SalesPeriod"
  },
  {
    ruppes: "$620,450.05",
    para: "Total Cancellation for Periods",
    iconBgColor: "#FFE6E6",
    // icon: ICONS.redDoller,
    icon: ICONS.per2,
    arrow: ICONS.arrowRed,
    percentColor: "#E92727",
    curveImg: ICONS.redcurveGraph,
    key:"cancellation_period"
    // curveImg: ICONS.curveGreen,
    // arrow: ICONS.arrowGreen,
  },
  {
    ruppes: "$620,450.05",
    para: "Total Installation for Periods",
    iconBgColor: "#E8F8EE",
    // icon: ICONS.greenDoller,
    icon: ICONS.per3,
    percentColor: "#14AD8A",
    curveImg: ICONS.curveGreen,
    arrow: ICONS.arrowGreen,
    key:"installation_period"
  },
];
export const projectStatusHeadData = [
{
  name:"State",
  para:"Arizona",
  viewButton:false,
  bgColor:"#E9F8FF",
  key:"state"
},
{
  name:"Adder",
  para:"$65,000",
  bgColor:"#E9EBFF",
  viewButton:true,
  key:"adder"
},
{
  name:"AJH",
  para:"NA",
  viewButton:false,
  bgColor:"#E9FFF7",
  key:"ajh"
},
{
  name:"EPC",
  para:"NA",
  viewButton:false,
  bgColor:"#F9E7F9",
  key:"epc"
},
{
  name:"Sys Size",
  para:"NA",
  viewButton:false,
  bgColor:"#FFE9E9",
  key:"SystemSize"
},
{
  name:"Contract Amount",
  para:"NA",
  viewButton:false,
  bgColor:"#FFF6E4",
  key:"contract_amount"
},
{
  name:"Finance Partner",
  para:"NA",
  viewButton:false,
  bgColor:"#E4F1FF",
  key:"finance_partner"
},
{
  name:"Net EPC",
  para:"NA",
  viewButton:false,
  bgColor:"#FBF6DA",
  key:"net_epc"
},
]
export const projects = [
  {
    projectName: "Owe Project Installation",
    salesDate: "20 Feb,",
    salesYear: "2024",
    notchStrips: [
      { name: "Site Survey", date: null },
      { name: "Permit Submitted", date: null },
      { name: "Install Ready", date: null },
      { name: "Install Completed", date: null },
      { name: "PTO", date: null },
    ],
    overallProgress: 20,
  },
  {
    projectName: "Owe Project Installation",
    salesDate: "Completed",
    notchStrips: [
      { name: "Site Survey", date: null },
      { name: "Permit Submitted", date: null },
      { name: "Install Ready", date: null },
      { name: "Install Completed", date: null },
      { name: "PTO", date: null },
    ],
    overallProgress: 28,
  },
];