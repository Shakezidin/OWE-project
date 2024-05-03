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
export const newStatusData = [
  {
    name: "Sales",
    number:"1",
    color:"white",
    numColor:"#0493CE",
    bgColor:"#0493CE",
    childStatusData: [
        {
            name: "10 Apr",
            process:"Completed",
            bgColor:"#57B93A",
            color:"white",
            borderColor:"#EBFCE5"
        },
      
    ],
  },
  {
    name: "NTP",
    number:"2",
    color:"white",
    numColor:"#0493CE",
    bgColor:"#0493CE",
    childStatusData: [
        {
            name: "10 Apr",
            process:"Current Stage",
            bgColor:"#0493CE",
            data:"In Progress",
            color:"white",
            borderColor:"#EBFCE5"
          
        },
       
    ],
  },
  {
    name: "Site Survey",
    number:"3",
    bgColor:"#D8D9E0",
    color:"#101828",
   
    numColor:"#101828",
    childStatusData: [
        {
          bgColor:"#E9E9E9",
            name: "ETA 20",
            process:"Scheduled",
            color:"#101828",
            data:"data is not available",
            borderColor:"#A5AAB2"
        },
        {
          bgColor:"#E9E9E9",
            name: "ETA 22",
            process:"Completed",
            color:"#101828",
            data:"data is not available",
            borderColor:"#A5AAB2"
        },
    ],
  },
  {
    name: "Roofing",
    number:"4",
    color:"#101828",
    numColor:"#101828",
    bgColor:"#D8D9E0",
    childStatusData: [
      
    ],
  },
  {
    name: "Electrical",
    number:"5",
    color:"#101828",
   
    numColor:"#101828",
    bgColor:"#D8D9E0",
    childStatusData: [
      
       
    ],
  },
  {
    name: "Permit Submitted",
    number:"6",
    bgColor:"#D8D9E0",
    color:"#101828",
   
    numColor:"#101828",
    childStatusData: [
        {
          bgColor:"#E9E9E9",
            name: "ETA 20",
            color:"#101828",
            process:"Pending",
            borderColor:"#A5AAB2",
            data:"data is not available",
          
        },
        {
          bgColor:"#E9E9E9",
            name: "ETA 22",
            color:"#101828",
            process:"Submitted",
            borderColor:"#A5AAB2",
            data:"data is not available",
          
        },
        {
          bgColor:"#E9E9E9",
            name: "ETA 25",
            color:"#101828",
            data:"data is not available",
            process:"Approved",
            borderColor:"#A5AAB2"
          
        },
       
],
  },
  {
    name: "IC Permit Submitted",
    number:"7",
    color:"#101828",
   
    numColor:"#101828",
    bgColor:"#D8D9E0",
    childStatusData: [

        {
          bgColor:"#E9E9E9",
            name: "ETA 20",
            color:"#101828",
            process:"Pending",
            borderColor:"#A5AAB2",
            data:"data is not available",
          
        },
        {
          bgColor:"#E9E9E9",
            name: "ETA 22",
            color:"#101828",
            process:"Submitted",
            data:"data is not available",
            borderColor:"#A5AAB2"
          
        },
        {
          bgColor:"#E9E9E9",
          color:"#101828",
            name: "ETA 25",
            data:"data is not available",
            process:"Approved",
            borderColor:"#A5AAB2"
          
        },
       
],
  },
  {
    name: "Install",
    bgColor:"#D8D9E0",
    number:"8",
    color:"#101828",
   
    numColor:"#101828",
    childStatusData: [
       
      
       

    ],
  },
  {
    name: "Final Inspection",
    number:"9",
    color:"#101828",
   
    numColor:"#101828",
    bgColor:"#D8D9E0",
    childStatusData: [
        
        {
          bgColor:"#E9E9E9",
            name: "ETA 20",
            color:"#101828",
            process:"Submitted",
            borderColor:"#A5AAB2",
            data:"data is not available",
          
        },
        {
          bgColor:"#E9E9E9",
            name: "ETA 22",
            color:"#101828",
            process:"Approved",
            data:"data is not available",
            borderColor:"#A5AAB2"
          
        },
    

],
  },
  {
    name: "PTO",
    number:"10",
    color:"#101828",
   
    numColor:"#101828",
    bgColor:"#D8D9E0",
    childStatusData: [
        
        {
          bgColor:"#E9E9E9",
            name: "ETA 20",
            process:"Submitted",
            borderColor:"#A5AAB2",
            data:"data is not available",
            color:"#101828",
          
        },
       
        {
          bgColor:"#E9E9E9",
            name: "ETA 22",
            process:"Completed",
            color:"#101828",
            borderColor:"#A5AAB2",
            data:"data is not available",
          
        }

],
  },
];

export const projects = [
  {
    projectName: "Owe Project Installation",
    salesDate: "20 Feb, 2024",
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