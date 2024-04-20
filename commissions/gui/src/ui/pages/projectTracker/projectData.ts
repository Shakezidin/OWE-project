import { ICONS } from "../../icons/Icons";

export const cardData=[
{
    name:"Sales",
    bgColor:`var(--project-card-color-1)`,
    iconBgColor:`var(--project-icon-color)`,
    icon:ICONS.salesIcon,
},
{
    name:"NTP",
    bgColor:`var(--project-card-color-2)`,
    iconBgColor:`var(--project-icon-color-2)`,
    icon:ICONS.ntpIcon,
},
{
    name:"Installed",
    bgColor:`var(--project-card-color-3)`,
    iconBgColor:`var(--project-icon-color-3)`,
    icon:ICONS.installIcon,
},
{
    name:"Cancelled",
    bgColor:`var(--project-card-color-4)`,
    iconBgColor:`var(--project-icon-color-4)`,
    icon:ICONS.cancelIcon,
}
]
export const projectDashData=[
    {
        ruppes:"$620,450.05",
        para:"Total Sales for Periods",
        iconBgColor:"#E8F8EE",
        icon:ICONS.greenDoller,
        percentColor:"#14AD8A",
        curveImg:ICONS.curveGreen,
        arrow:ICONS.arrowGreen,
       
    },
    {
        ruppes:"$620,450.05",
        para:"Total Cancellation for Periods",
        iconBgColor:"#FFE6E6",
        icon:ICONS.redDoller,
        arrow:ICONS.arrowRed,
        percentColor:"#E92727",
        curveImg:ICONS.curveRed
       
    },
    {
        ruppes:"$620,450.05",
        para:"Team Performance",
        iconBgColor:"#E8F8EE",
        icon:ICONS.greenDoller,
        percentColor:"#14AD8A",
        curveImg:ICONS.curveGreen,
        arrow:ICONS.arrowGreen,
       
    }
   
]

export const statusDataRow=[
    {
    title:"Owe App Installation",
    statusData:[
        {
            name:"Sales",
            bgImg:ICONS.firstRect,
            queruIcon:ICONS.activeQueryIcon,
            date:"20 Feb 2024",
            width:"140px",
            isProgress:false,
            color:"white"
    
        },
        {
            name:"Site Survey",
            queruIcon:ICONS.queryIcon,
            bgImg:ICONS.secondRec,
            date:"Date not available",
            width:"140px",
            isProgress:false,
        },
        {
            name:"Permit Submitted",
            queruIcon:ICONS.queryIcon,
            bgImg:ICONS.secondRec,
            date:"Date not available",
            width:"180px",
            isProgress:false,
        },
        {
            name:"Install Ready",
            queruIcon:ICONS.queryIcon,
            bgImg:ICONS.secondRec,
            date:"Date not available",
            width:"140px",
            isProgress:false,
        },
        {
            name:"Install Completed",
            queruIcon:ICONS.queryIcon,
            bgImg:ICONS.secondRec,
            width:"180px",
            date:"Date not available",
            isProgress:false,
        },
        {
            name:"PTO",
            queruIcon:ICONS.queryIcon,
            bgImg:ICONS.fiveRec,
            date:"Date not available",
            width:"127px",
            isProgress:false,
        },
       
        {
            name:"20%",
            isProgress:true,
            queruIcon:ICONS.percent,
            bgImg:ICONS.progressIcon,
            date:"Overall Progress",
            width:"140px",
        },
    
    ]
    },
    {
        title:"Owe App Installation",
        statusData:[
            {
                name:"Sales",
                bgImg:ICONS.greenRect,
                queruIcon:ICONS.activeQueryIcon,
                date:"20 Feb 2024",
                width:"140px",
                isProgress:false,
                color:"white"
        
            },
            {
                name:"Site Survey",
                queruIcon:ICONS.activeQueryIcon,
                bgImg:ICONS.blueRect,
                date:"Date not available",
                width:"140px",
                isProgress:false,
                color:"white"
            },
            {
                name:"Permit Submitted",
                queruIcon:ICONS.queryIcon,
                bgImg:ICONS.secondRec,
                date:"Date not available",
                width:"180px",
                isProgress:false,
            },
            {
                name:"Install Ready",
                queruIcon:ICONS.queryIcon,
                bgImg:ICONS.secondRec,
                date:"Date not available",
                width:"140px",
                isProgress:false,
            },
            {
                name:"Install Completed",
                queruIcon:ICONS.queryIcon,
                bgImg:ICONS.secondRec,
                width:"180px",
                date:"Date not available",
                isProgress:false,
            },
            {
                name:"PTO",
                queruIcon:ICONS.queryIcon,
                bgImg:ICONS.fiveRec,
                date:"Date not available",
                width:"127px",
                isProgress:false,
            },
           
            {
                name:"20%",
                isProgress:true,
                queruIcon:ICONS.percent,
                bgImg:ICONS.progressIcon,
                date:"Overall Progress",
                width:"140px",
            },
        
        ]
        },

]