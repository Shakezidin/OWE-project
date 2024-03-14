
import { RouteType } from "./config";
import { MdOutlineDashboard,MdOutlineSettings } from "react-icons/md";
import { DashboardPage } from "../ui/pages/dashboard/DashboardPage";
import Configuration from "../ui/pages/configure/Configuration";
import CommissionRate from "../ui/pages/configure/commissionRate/CommissionRate";
import CommonConfigure from "../ui/pages/configure/commonConfigure/CommonConfigure";
import MarketingFees from "../ui/pages/configure/marketingFees/MarketingFees";
import DealerOverRides from "../ui/pages/configure/dealerOverrides/DealerOverRides";
const appRoutes: RouteType[] = [
 
 
  {
    path: "/dashboard",
    element: <DashboardPage/>,
    state: "dashboard",
    sidebarProps: {
      displayText: "Dashboard",
      icon: <MdOutlineDashboard style={{fontSize:"1.4rem",color:"white"}} />
    },
  },
  {
    path: "/dashboard/configuration",
    element: <Configuration/>,
    state: "configuration",
    sidebarProps: {
      displayText: "Configuration",
      icon:<MdOutlineSettings style={{fontSize:"1.4rem",color:"white"}}/>
    },
    child:[
      {
        path:"/dashboard/configuration/commission_rate",
        element:<CommissionRate/>,
        state:"dashboard.configuration.commission_rate",
        sidebarProps:{
          displayText:"Commission Rate"
        }
      },
      {
        path:"/dashboard/configuration/dealer_override",
        element:<DealerOverRides/>,
        state:"dashboard.configuration.dealer_override",
        sidebarProps:{
          displayText:"Dealer OverRides"
        }
      },
      {
        path:"/dashboard/configuration/marketing_fees",
        element:<MarketingFees/>,
        state:"configuration.marketing_fees",
        sidebarProps:{
          displayText:"Marketing Fees"
        }
      },
      {
        path:"/dashboard/configuration/common_configuration",
        element:<CommonConfigure/>,
        state:"configuration.common_configuration",
        sidebarProps:{
          displayText:"Common Configuration"
        }
      }
    ]
  },
 

];

export default appRoutes;