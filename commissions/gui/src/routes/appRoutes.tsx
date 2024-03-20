
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
      },
      {
        path:"/dashboard/configuration/rep_pay_scale",
        element:<RepPayScale/>,
        state:"configuration.rep_pay_scale",
        sidebarProps:{
          displayText:"Rep Pay Scale"
        }
      },
      {
        path:"/dashboard/configuration/payment_schedule",
        element:<PaymentSchedule/>,
        state:"configuration.payment_schedule",
        sidebarProps:{
          displayText:"Payment Schedule"
        }
      },
      {
        path:"/dashboard/configuration/tier_loan_fee",
        element:<TierLoanFee/>,
        state:"configuration.tier_loan_fee",
        sidebarProps:{
          displayText:"Tier Loan fee"
        }
      },
      {
        path:"/dashboard/configuration/timeLine",
        element:<TimeLine/>,
        state:"configuration.timeLine",
        sidebarProps:{
          displayText:"TimeLine"
        }
      },
      {
        path:"/dashboard/configuration/dealer_tier",
        element:<DealerTier/>,
        state:"configuration.dealer_tier",
        sidebarProps:{
          displayText:"Dealer Tier"
        }
      },
      {
        path:"/dashboard/configuration/adder_validation",
        element:<AdderValidation/>,
        state:"configuration.adder_validation",
        sidebarProps:{
          displayText:"Adder Validation"
        }
      },
      {
        path:"/dashboard/configuration/payment_validation",
        element:<PaymentValidation/>,
        state:"configuration.payment_validation",
        sidebarProps:{
          displayText:"Partner Validation"
        }
      },
      {
        path:"/dashboard/configuration/dealer_on_boarding",
        element:<DealeronBoarding/>,
        state:"configuration.dealer_on_boarding",
        sidebarProps:{
          displayText:"User Onboarding"
        }
      },

      {
        path:"/dashboard/configuration/appointment_setters",
        element:<AppointmentSetters/>,
        state:"configuration.appointment_setters",
        sidebarProps:{
          displayText:"Appointment Setters"
        }
      },
      {
        path:"/dashboard/configuration/sale_type",
        element:<SaleType/>,
        state:"configuration.sale_type",
        sidebarProps:{
          displayText:"Sale Type"
        }
      },
      {
        path:"/dashboard/configuration/loan_type",
        element:<LoanType/>,
        state:"configuration.loan_type",
        sidebarProps:{
          displayText:"Loan Type"
        }
      },
      

    ]
  },
 

];

export default appRoutes;