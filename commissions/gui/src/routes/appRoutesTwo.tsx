import colorConfig from "../config/colorConfig";
import { ICONS } from "../ui/icons/Icons";
import { ROUTES } from "./routes";
import { CiWallet } from "react-icons/ci";
import { BiSupport } from "react-icons/bi";
import { RiUserSettingsLine } from "react-icons/ri";
import { GoProjectRoadmap } from "react-icons/go";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { BsDatabaseGear } from "react-icons/bs";
import { MdOutlinePayment } from "react-icons/md";
import { FiServer } from "react-icons/fi";
import { FcDataConfiguration } from "react-icons/fc";
import { GrDocumentConfig } from "react-icons/gr";
import { RiFileList3Line } from "react-icons/ri";

const appRoutesTwo = [
  {
    commission: [
      {
        path:  ROUTES.COMMISSION_DASHBOARD,
        sidebarProps: {
          displayText: "Dealer Pay",
          icon: <MdOutlinePayment size={20} style={{marginLeft: "5px"}}  className="hover-icon"/>
          // icon: (
          //   <img
          //     src={ICONS.dealerpayIcon}
          //     className="icon-image"
          //     alt=""
          //     style={{
          //       height: "18px",
          //       width: "18px",
          //       marginLeft: "2px",
          //       marginRight: "2px",
          //     }}
          //   />
          // ),
        },
      },
    ],
  },

  {
    repay: [
      {
        path: "#",
        sidebarProps: {
          displayText: "Rep. Pay",
          icon:<CiWallet size={20}  style={{marginLeft: "5px"}}  className="hover-icon"/>
        },
      },
    ],
  },

  {
    ar: [
      {
        path: "#",
        sidebarProps: {
          displayText: "AR",
          icon: <FiServer size={18}  style={{marginLeft: "5px"}}   className="hover-icon"/>
          // icon: (
          //   <img
          //     src={ICONS.dash}
          //     alt=""
          //     className="children-icon-image"
          //     style={{ marginLeft: "2px", marginRight: "2px" }}
          //   />
          // ),
        },
      },
    ],
  },

  {
    db: [
      {
        path: "#",
        sidebarProps: {
          displayText: "DB Manager",
          icon: 
          <BsDatabaseGear size={20} style={{marginLeft: "3px"}} color="black"/>,
        },
        child: [
          {
            path: ROUTES.DB_MANAGER_DASHBOARD,
            sidebarProps: {
              displayText: "Dashboard",
              icon: (
                <div
                  
                   
                ></div>
              ),
            },
          },
          {
            path: ROUTES.DB_MANAGER_DATA_TABLE,
            sidebarProps: {
              displayText: "Data",
              icon: (
                <div
                  
                  style={{
                    backgroundColor: colorConfig.childrenicon,
                  }}
                ></div>
              ),
            },
          },
          {
            path: ROUTES.DB_MANAGER_USER_ACTIVITY,
            sidebarProps: {
              displayText: "User Activity",
              icon: (
                <div
                 
                  style={{
                    backgroundColor: colorConfig.childrenicon,
                  }}
                ></div>
              ),
            },
          },
        ],
      },
    ],
  },

  {
    project: [
      {
        path: "##",
        sidebarProps: {
          displayText: "Project Tracking",
          icon:  <RiFileList3Line size={20} style={{marginLeft: "3px"}} color="black"/>
        },
        child: [
          {
            path: ROUTES.PROJECT_PERFORMANCE,
            sidebarProps: {
              displayText: "Performance",
              icon: (
                <div
                 
                ></div>
              ),
            },
          },
          {
            path: ROUTES.PROJECT_STATUS,
            sidebarProps: {
              displayText: "Project Detail",
              icon: (
                <div
                 
                   
                ></div>
              ),
            },
          },
        ],
      },
    ],
  },

  {
    other: [
      {
        path:ROUTES.USER_MANAEMENT,

        sidebarProps: {
          displayText: "User Management",
          icon:<RiUserSettingsLine size={20}  style={{flexShrink: "0",}}/>
        },
      },
      {
        path: ROUTES.CONFIG_PAGE,
        sidebarProps: {
          displayText: "Configure",
          icon: <GrDocumentConfig size={18}  style={{flexShrink: "0"}} /> 
        },
      
      },

      {
        path:  ROUTES.TECHNICAL_SUPPORT,

        sidebarProps: {
          displayText: "Technical Support",
          icon: <BiSupport size={20}   style={{flexShrink: "0"}}/>,
        },
      },
    ],
  },
];

// const newArr =[
//   {
//     path:"",
//     label:"Dealer Pay",
//     children:[{name:"Comission",icon:"",path:""}],
//     icon:"",
//     hasChildren:true,
//   }
// ]

export default appRoutesTwo;
