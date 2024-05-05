import colorConfig from "../config/colorConfig";
import { ROUTES } from "./routes";
import { CiWallet } from "react-icons/ci";
import { BiSupport } from "react-icons/bi";
import { RiUserSettingsLine } from "react-icons/ri";
import { BsDatabaseGear } from "react-icons/bs";
import { MdOutlinePayment } from "react-icons/md";
import { FiServer } from "react-icons/fi";
import { GrDocumentConfig } from "react-icons/gr";
import { RiFileList3Line } from "react-icons/ri";
import { TYPE_OF_USER } from "../resources/static_data/TypeOfUser";
import { GrDocumentPerformance } from "react-icons/gr";
import { AiOutlineProject } from "react-icons/ai";


const performance = {
  performance: [
    {
      path: ROUTES.PROJECT_PERFORMANCE,
      sidebarProps: {
        displayText: "Performance",
        icon: (
          <GrDocumentPerformance
            size={20}
            style={{ marginLeft: "5px" }}
            className="hover-icon"
          />
        ),
      },
    },
  ],
};


const commissionMenu = {
  commission: [
    {
      path: ROUTES.COMMISSION_DASHBOARD,
      sidebarProps: {
        displayText: "Dealer Pay",
        icon: (
          <MdOutlinePayment
            size={20}
            style={{ marginLeft: "5px" }}
            className="hover-icon"
          />
        ),
      },
    },
  ],
};

const repayMenu = {
  repay: [
    {
      path: ROUTES.REPPAY_DASHBOARD,
      sidebarProps: {
        displayText: "Rep. Pay",
        icon: (
          <CiWallet
            size={20}
            style={{ marginLeft: "5px" }}
            className="hover-icon"
          />
        ),
      },
    },
  ],
};

const arMenu = {
  ar: [
    {
      path: ROUTES.AR_DASHBOARD,
      sidebarProps: {
        displayText: "AR",
        icon: (
          <FiServer
            size={18}
            style={{ marginLeft: "5px" }}
            className="hover-icon"
          />
        ),
      },
    },
  ],
};

const DB = {
  db: [
    {
      path: "#",
      sidebarProps: {
        displayText: "DB Manager",
        icon: (
          <BsDatabaseGear
            size={20}
            style={{ marginLeft: "3px" }}
            color="black"
          />
        ),
      },
      child: [
        {
          path: ROUTES.DB_MANAGER_DASHBOARD,
          sidebarProps: {
            displayText: "Dashboard",
            icon: <></>,
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
};

const project = {
  project: [
    {
      path:  ROUTES.PROJECT_STATUS,
      sidebarProps: {
        displayText: "Project Management",
        icon: (
          <AiOutlineProject
            size={20}
            style={{ marginLeft: "3px" }}
            color="black"
          />
        ),
      },
      
    },
  ],
};

const other = {
  other: [
    {
      path: ROUTES.USER_MANAEMENT,

      sidebarProps: {
        displayText: "User Management",
        icon: <RiUserSettingsLine size={20} style={{ flexShrink: "0" }} />,
      },
    },
    {
      path: ROUTES.CONFIG_PAGE,
      sidebarProps: {
        displayText: "Configure",
        icon: <GrDocumentConfig size={18} style={{ flexShrink: "0" }} />,
      },
    },
  ],
};
const support = {
  support: [
    {
      path: ROUTES.TECHNICAL_SUPPORT,

      sidebarProps: {
        displayText: "Technical Support",
        icon: <BiSupport size={20} style={{ flexShrink: "0" }} />,
      },
    },
  ],
};

export const createSideMenuList = (): any[] => {
  let sideMenu: { [key: string]: any[] }[] = [];
  let role = localStorage.getItem("role");

  if (role === TYPE_OF_USER.ADMIN) {
    sideMenu.push(performance)
    sideMenu.push(commissionMenu);
    sideMenu.push(repayMenu);
    sideMenu.push(arMenu);
    sideMenu.push(DB);
    sideMenu.push(project);
    sideMenu.push(other);
    sideMenu.push(support);
    
  } else {
    if (
      role === TYPE_OF_USER.DEALER_OWNER ||
      role === TYPE_OF_USER.FINANCE_ADMIN
    ) {
      sideMenu.push(performance)
      sideMenu.push(commissionMenu);
      sideMenu.push(repayMenu);
      sideMenu.push(arMenu);
      sideMenu.push(DB);
      sideMenu.push(project);
      sideMenu.push(support);
      
    }else if( role === TYPE_OF_USER.REGIONAL_MANGER || role === TYPE_OF_USER.SALES_REPRESENTATIVE || role === TYPE_OF_USER.SALE_MANAGER ){
      sideMenu.push(performance)
      sideMenu.push(repayMenu);
      sideMenu.push(project);
      sideMenu.push(support);
    }
  }

  return sideMenu;
};