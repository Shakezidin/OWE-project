import { RouteType } from "./config";
import { DashboardPage } from "../ui/pages/dashboard/DashboardPage";
import Configuration from "../ui/pages/configure/Configuration";
import CommissionRate from "../ui/pages/configure/commissionRate/CommissionRate";
import MarketingFees from "../ui/pages/configure/marketingFees/MarketingFees";
import DealerOverRides from "../ui/pages/configure/dealerOverrides/DealerOverRides";
import PaymentSchedule from "../ui/pages/configure/paymentValidation/PaymentSchedule";
import TierLoanFee from "../ui/pages/configure/tierLoanfee/TierLoanFee";
import TimeLine from "../ui/pages/configure/timeline/TimeLine";
import DealerTier from "../ui/pages/configure/dealerTier/DealerTier";
import AdderValidation from "../ui/pages/configure/adderValidation/AdderValidation";
import SaleType from "../ui/pages/configure/saleType/SaleType";
import LoanType from "../ui/pages/configure/loanType/LoanType";
import Project from "../ui/pages/project/Project";
import Report from "../ui/pages/report/Report";
import DatabaseController from "../ui/pages/databaseController/DatabaseController";
import { ICONS } from "../ui/icons/Icons";
import AccountSettings from "../ui/pages/accountSettings/AccountSettings";
import colorConfig from "../config/colorConfig";
import UserManamement from "../ui/pages/userManagement/UserManagement";
const appRoutes: RouteType[] = [
  {
    path: "/dashboard",
    element: <DashboardPage />,
    state: "dashboard",
    sidebarProps: {
      displayText: "Dashboard",
      icon: <img src={ICONS.dash} className="icon-image" alt="" />,
    },
  },
  {
    path: "/dashboard/configuration",
    element: <Configuration />,
    state: "configuration",
    sidebarProps: {
      displayText: "Configuration",
      icon: <img src="" className="icon-image" alt="" />,
    },
    child: [
      {
        path: "/dashboard/configuration/commission_rate",
        element: <CommissionRate />,
        state: "configuration.commission_rate",
        sidebarProps: {
          displayText: "Commission Rate",
          icon: (
            <div
              className="ellipse"
              style={{ backgroundColor: colorConfig.commissionColor }}
            ></div>
          ),
        },
      },
      {
        path: "/dashboard/configuration/dealer_override",
        element: <DealerOverRides />,
        state: "configuration.dealer_override",
        sidebarProps: {
          displayText: "Dealer OverRides",
          icon: (
            <div
              className="ellipse"
              style={{ backgroundColor: colorConfig.commissionColor }}
            ></div>
          ),
        },
      },
      {
        path: "/dashboard/configuration/marketing_fees",
        element: <MarketingFees />,
        state: "configuration.marketing_fees",
        sidebarProps: {
          displayText: "Marketing Fees",
          icon: (
            <div
              className="ellipse"
              style={{ backgroundColor: colorConfig.marketColor }}
            ></div>
          ),
        },
      },
      {
        path: "/dashboard/configuration/adder_validation",
        element: <AdderValidation />,
        state: "configuration.adder_validation",
        sidebarProps: {
          displayText: "Adder",
          icon: (
            <div
              className="ellipse"
              style={{ backgroundColor: colorConfig.adderColor }}
            ></div>
          ),
        },
      },
      {
        path: "/dashboard/configuration/sale_type",
        element: <SaleType />,
        state: "configuration.sale_type",
        sidebarProps: {
          displayText: "Sales Type",
          icon: (
            <div
              className="ellipse"
              style={{ backgroundColor: colorConfig.salesColor }}
            ></div>
          ),
        },
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
        path: "/dashboard/configuration/tier_loan_fee",
        element: <TierLoanFee />,
        state: "configuration.tier_loan_fee",
        sidebarProps: {
          displayText: "Tier Loan fees",
          icon: (
            <div
              className="ellipse"
              style={{ backgroundColor: colorConfig.tierColor }}
            ></div>
          ),
        },
      },
      {
        path: "/dashboard/configuration/dealer_tier",
        element: <DealerTier />,
        state: "configuration.dealer_tier",
        sidebarProps: {
          displayText: "Dealer Tier",
          icon: (
            <div
              className="ellipse"
              style={{ backgroundColor: colorConfig.dealerTierColor }}
            ></div>
          ),
        },
      },
      {
        path: "/dashboard/configuration/payment_schedule",
        element: <PaymentSchedule />,
        state: "configuration.payment_schedule",
        sidebarProps: {
          displayText: "Pay Schedule",
          icon: (
            <div
              className="ellipse"
              style={{ backgroundColor: colorConfig.payColor }}
            ></div>
          ),
        },
      },

      {
        path: "/dashboard/configuration/timeLine",
        element: <TimeLine />,
        state: "configuration.timeLine",
        sidebarProps: {
          displayText: "TimeLine SLA",
          icon: (
            <div
              className="ellipse"
              style={{ backgroundColor: colorConfig.timeLineColor }}
            ></div>
          ),
        },
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
        path: "/dashboard/configuration/loan_type",
        element: <LoanType />,
        state: "configuration.loan_type",
        sidebarProps: {
          displayText: "Loan Type",
          icon: (
            <div
              className="ellipse"
              style={{ backgroundColor: colorConfig.loanTypeColor }}
            ></div>
          ),
        },
      },
    ],
  },

  // {
  //   path: "/dashboard/project",
  //   element: <Project />,
  //   state: "project",
  //   sidebarProps: {
  //     displayText: "Project",
  //     icon: <img src={ICONS.projectIcon} className="icon-image" alt="" />,
  //   },
  // },
  {
    path: "/dashboard/report",
    element: <Report />,
    state: "report",
    sidebarProps: {
      displayText: "Data",
      icon: <img src={ICONS.config} className="icon-image" alt="" />,
    },
  },
  {
    path: "/dashboard/report",
    element: <Report />,
    state: "report",
    sidebarProps: {
      displayText: "User Activity",
      icon: <img src={ICONS.activityIcon} className="icon-image" alt="" />,
    },
  },
  {
    path: "/dashboard/databasecontroller",
    element: <DatabaseController />,
    state: "databasecontroller",
    sidebarProps: {
      displayText: "Project Tracker",
      icon: <img src={ICONS.trackerIcon} className="icon-image" alt="" />,
    },
  },
  {
    path: "/dashboard/usermanagement",
    element: <UserManamement />,
    state: "usermanagement",
    sidebarProps: {
      displayText: "User Management",
      icon: <img src={ICONS.userMan} className="icon-image" alt="" />,
    },
  },
  {
    path: "/dashboard/control",
    element: <DatabaseController />,
    state: "control",
    sidebarProps: {
      displayText: "Technical Support",
      icon: <img src={ICONS.techIcon} className="icon-image" alt="" />,
    },
  },
  {
    path: "/dashboard/myaccount",
    element: <AccountSettings />,
    state: "myaccount",
    sidebarProps: {
      displayText: "My Account",
      icon: <img src={ICONS.accountIcon} className="icon-image" alt="" />,
    },
  },
];

export default appRoutes;
