import { ICONS } from "../../icons/Icons";

export const cardData = [
  {
    name: "Sales",
    bgColor: "#F9E7F9",
    iconBgColor: `#800080`,
    color: "#800080",
    icon: ICONS.salesIcon,
  },
  {
    name: "NTP",
    bgColor: "#EAF6FF",
    iconBgColor: `var(--project-icon-color)`,
    icon: ICONS.ntpIcon,
    color: `var(--project-icon-color)`,
  },
  {
    name: "Installed",
    bgColor: `var(--project-card-color-3)`,
    iconBgColor: `var(--project-icon-color-3)`,
    icon: ICONS.installIcon,
    color: `var(--project-icon-color-3)`,
  },
  {
    name: "Cancelled",
    bgColor: `var(--project-card-color-4)`,
    iconBgColor: `var(--project-icon-color-4)`,
    icon: ICONS.cancelIcon,
    color: `var(--project-icon-color-4)`,
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
  },
  {
    ruppes: "$620,450.05",
    para: "Total Cancellation for Periods",
    iconBgColor: "#FFE6E6",
    icon: ICONS.redDoller,
    arrow: ICONS.arrowRed,
    percentColor: "#E92727",
    curveImg: ICONS.curveRed,
  },
  {
    ruppes: "$620,450.05",
    para: "Toatal Installation Periods",
    iconBgColor: "#E8F8EE",
    icon: ICONS.greenDoller,
    percentColor: "#14AD8A",
    curveImg: ICONS.curveGreen,
    arrow: ICONS.arrowGreen,
  },
];

export const newStatusData = [
  {
    name: "Site Survey",
    number:"2",
    childStatusData: [
        {
            name: "ETA 20",
            process:"Inprocess"
          
        },
        {
            name: "ETA 20",
            process:"Submit"
          
        },
        {
            name: "ETA 20",
            process:"Approved"
          
        },
        {
            name: "ETA 20",
            process:"Completed"
        },
    ],
  },
  {
    name: "Permit Submitted",
    number:"3",
    childStatusData: [
        {
            name: "ETA 20",
            process:"Inprocess"
          
        },
        {
            name: "ETA 20",
            process:"Submit"
          
        },
        {
            name: "ETA 20",
            process:"Approved"
          
        },
        {
            name: "ETA 20",
            process:"Completed"
        },
],
  },
  {
    name: "Install Ready",
    number:"4",
    childStatusData: [
        {
            name: "ETA 20",
            process:"Inprocess"
          
        },
        {
            name: "ETA 20",
            process:"Installed Ready"
          
        },
        {
            name: "ETA 20",
            process:"Install Completed"
          
        },
      
       

    ],
  },
  {
    name: "PTO",
    number:"5",
    childStatusData: [
        
        {
            name: "ETA 20",
            process:"Inprocess"
          
        },
        {
            name: "ETA 20",
            process:"Submited"
          
        },
        {
            name: "ETA 20",
            process:"Completed"
          
        }

],
  },
];
