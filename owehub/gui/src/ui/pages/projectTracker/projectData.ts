import { ICONS } from "../../icons/Icons";

export const cardData = [
  {
    name: "Sales",
    bgColor: "#F9E7F9",
    iconBgColor: `#800080`,
    color: "#800080",
    icon: ICONS.salesIcon,
    type:"contract_date"
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
    icon: ICONS.redDoller,
    arrow: ICONS.arrowRed,
    percentColor: "#E92727",
    curveImg: ICONS.redcurveGraph,
    key:"cancellation_period"
    // curveImg: ICONS.curveGreen,
    // arrow: ICONS.arrowGreen,
  },
  {
    ruppes: "$620,450.05",
    para: "Total Installation Periods",
    iconBgColor: "#E8F8EE",
    icon: ICONS.greenDoller,
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

},
{
  name:"Adder",
  para:"$65,000",
  bgColor:"#E9EBFF",
  viewButton:true,
},
{
  name:"AJH",
  para:"NA",
  viewButton:false,
  bgColor:"#E9FFF7",
},
{
  name:"EPC",
  para:"NA",
  viewButton:false,
  bgColor:"#F9E7F9",
},
{
  name:"Sys Size",
  para:"NA",
  viewButton:false,
  bgColor:"#FFE9E9",
},
{
  name:"Contract Amount",
  para:"NA",
  viewButton:false,
  bgColor:"#FFF6E4",
},
{
  name:"Finance Partner",
  para:"NA",
  viewButton:false,
  bgColor:"#E4F1FF",
},
{
  name:"Net EPC",
  para:"NA",
  viewButton:false,
  bgColor:"#FBF6DA",
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