
import { RouteType } from "./config";
import { MdOutlineDashboard,MdOutlineSettings } from "react-icons/md";
import { DashboardPage } from "../ui/pages/dashboard/DashboardPage";
import Configuration from "../ui/pages/configure/Configuration";
import CommissionRate from "../ui/pages/configure/commissionRate/CommissionRate";
import CommonConfigure from "../ui/pages/configure/commonConfigure/CommonConfigure";
import MarketingFees from "../ui/pages/configure/marketingFees/MarketingFees";
import DealerOverRides from "../ui/pages/configure/dealerOverrides/DealerOverRides";
import RepPayScale from "../ui/pages/configure/repPayScale/RepPayScale";
import PaymentSchedule from "../ui/pages/configure/paymentValidation/PaymentSchedule";
import TierLoanFee from "../ui/pages/configure/tierLoanfee/TierLoanFee";
import TimeLine from "../ui/pages/configure/timeline/TimeLine";
import DealerTier from "../ui/pages/configure/dealerTier/DealerTier";
import AdderValidation from "../ui/pages/configure/adderValidation/AdderValidation";
import PaymentValidation from "../ui/pages/configure/paymentValidation/PaymentValidation";
import DealeronBoarding from "../ui/pages/configure/dealeronBoarding/DealeronBoarding";
import AppointmentSetters from "../ui/pages/configure/appointmentSetters/AppointmentSetters";
import SaleType from "../ui/pages/configure/saleType/SaleType";
import LoanType from "../ui/pages/configure/loanType/LoanType";
import Onboarding from "../ui/pages/onboarding/Onboarding";
import UserOnboarding from "../ui/pages/onboarding/useronboarding/UserOnboarding";
import Project from "../ui/pages/project/Project";
import Report from "../ui/pages/report/Report";
import DatabaseController from "../ui/pages/databaseController/DatabaseController";
import { ICONS } from "../ui/icons/Icons";
import AccountSettings from "../ui/pages/accountSettings/AccountSettings";
const appRoutes: RouteType[] = [
 
  {
    path: "/dashboard",
    element: <DashboardPage/>,
    state: "dashboard",
    sidebarProps: {
      displayText: "Dashboard",
      icon:<img src={ICONS.dashboardIcon} className="icon-image" alt=""/>
    },
  },
  {
    path: "/configuration",
    element: <Configuration/>,
    state: "configuration",
    sidebarProps: {
      displayText: "Configuration",
      icon:<img src={ICONS.confige} className="icon-image" alt=""/>
    },
    child:[
      {
        path:"/configuration/commission_rate",
        element:<CommissionRate/>,
        state:"configuration.commission_rate",
        sidebarProps:{
          displayText:"Commission Rate"
        }
      },
      {
        path:"/configuration/dealer_override",
        element:<DealerOverRides/>,
        state:"configuration.dealer_override",
        sidebarProps:{
          displayText:"Dealer OverRides"
        }
      },
      {
        path:"/configuration/marketing_fees",
        element:<MarketingFees/>,
        state:"configuration.marketing_fees",
        sidebarProps:{
          displayText:"Marketing Fees"
        }
      },
      {
        path:"/configuration/adder_validation",
        element:<AdderValidation/>,
        state:"configuration.adder_validation",
        sidebarProps:{
          displayText:"Adder Validation"
        }
      },
      {
        path:"/configuration/sale_type",
        element:<SaleType/>,
        state:"configuration.sale_type",
        sidebarProps:{
          displayText:"Sales Type"
        }
      },
      // {
      //   path:"/dashboard/configuration/common_configuration",
      //   element:<CommonConfigure/>,
      //   state:"configuration.common_configuration",
      //   sidebarProps:{
      //     displayText:"Common Configuration"
      //   }
      // },
      // {
      //   path:"/dashboard/configuration/rep_pay_scale",
      //   element:<RepPayScale/>,
      //   state:"configuration.rep_pay_scale",
      //   sidebarProps:{
      //     displayText:"Rep Pay Scale"
      //   }
      // },
      {
        path:"/configuration/tier_loan_fee",
        element:<TierLoanFee/>,
        state:"configuration.tier_loan_fee",
        sidebarProps:{
          displayText:"Tier Loan fees"
        }
      },
      {
        path:"/configuration/dealer_tier",
        element:<DealerTier/>,
        state:"configuration.dealer_tier",
        sidebarProps:{
          displayText:"Dealer Tier"
        }
      },
      {
        path:"/configuration/payment_schedule",
        element:<PaymentSchedule/>,
        state:"configuration.payment_schedule",
        sidebarProps:{
          displayText:"Pay Schedule"
        }
      },
    
      {
        path:"/configuration/timeLine",
        element:<TimeLine/>,
        state:"configuration.timeLine",
        sidebarProps:{
          displayText:"TimeLine SLA"
        }
      },
    
     
      // {
      //   path:"/dashboard/configuration/payment_validation",
      //   element:<PaymentValidation/>,
      //   state:"configuration.payment_validation",
      //   sidebarProps:{
      //     displayText:"Partner Validation"
      //   }
      // },
      // {
      //   path:"/dashboard/configuration/dealer_on_boarding",
      //   element:<DealeronBoarding/>,
      //   state:"configuration.dealer_on_boarding",
      //   sidebarProps:{
      //     displayText:"User Onboarding"
      //   }
      // },

      // {
      //   path:"/dashboard/configuration/appointment_setters",
      //   element:<AppointmentSetters/>,
      //   state:"configuration.appointment_setters",
      //   sidebarProps:{
      //     displayText:"Appointment Setters"
      //   }
      // },
    
      {
        path:"/configuration/loan_type",
        element:<LoanType/>,
        state:"configuration.loan_type",
        sidebarProps:{
          displayText:"Loan Type"
        }
      },
      

    ]
  },
 
  {
    path: "/project",
    element: <Project/>,
    state: "project",
    sidebarProps: {
      displayText: "Project",
      icon:<img src={ICONS.projectIcon} className="icon-image" alt=""/>
    },
   
  },
  {
    path: "/report",
    element: <Report/>,
    state: "report",
    sidebarProps: {
      displayText: "Report",
      icon:<img src={ICONS.reportIcon} className="icon-image" alt=""/>
    },
  },
  {
    path: "/databasecontroller",
    element: <DatabaseController/>,
    state: "databasecontroller",
    sidebarProps: {
      displayText: "DatabaseController",
      icon:<img src={ICONS.dbIcon} className="icon-image" alt=""/>
    },
  },
  {
    path: "/usermanagement",
    element: <DatabaseController/>,
    state: "usermanagement",
    sidebarProps: {
      displayText: "UserManagement",
      icon:<img src={ICONS.umIcon} className="icon-image" alt="" />
    },
  },
  {
    path: "/control",
    element: <DatabaseController/>,
    state: "control",
    sidebarProps: {
      displayText: "Control/Support",
      icon:<img src={ICONS.supportIcon} className="icon-image" alt=""/>
    },
  },
  {
    path: "/myaccount",
    element: <AccountSettings/>,
    state: "myaccount",
    sidebarProps: {
      displayText: "My Account",
      icon:<img src={ICONS.myAccountIcon} className="icon-image" alt=""/>
    },
  },
  {
    path: "/",
    element: <DatabaseController/>,
    state: "logout",
    sidebarProps: {
      displayText: "Logout",
      icon:<img src={ICONS.logoutIcon} className="icon-image" alt=""/>
    },
  },
];

export default appRoutes;