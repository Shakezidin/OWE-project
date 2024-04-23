import colorConfig from "../config/colorConfig";
import { ICONS } from "../ui/icons/Icons";
import { ROUTES } from "./routes";
const appRoutesTwo = [
  {
    commission: [
      {
        path: ROUTES.commissiondash,
        sidebarProps: {
          displayText: "Dealer Pay",
          icon: (
            <img
              src={ICONS.dealerpayIcon}
              className="icon-image"
              alt=""
              style={{
                height: "18px",
                width: "18px",
                marginLeft: "2px",
                marginRight: "2px",
              }}
            />
          ),
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
          icon: (
            <img
              src={ICONS.repayIcon}
              alt=""
              className="icon-image"
              style={{ marginLeft: "2px", marginRight: "2px" }}
            />
          ),
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
          icon: (
            <img
              src={ICONS.dash}
              alt=""
              className="children-icon-image"
              style={{ marginLeft: "2px", marginRight: "2px" }}
            />
          ),
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
          icon: <img src={ICONS.dbmanagerIcon} alt="" className="icon-image" />,
        },
        child: [
          {
            path: ROUTES.dbDashRoutes,
            sidebarProps: {
              displayText: "Dashboard",
              icon: (
                <div
                  className="ellipse"
                  style={{
                    backgroundColor: colorConfig.childrenicon,
                  }}
                ></div>
              ),
            },
          },
          {
            path: ROUTES.dataTableRoutes,
            sidebarProps: {
              displayText: "Data",
              icon: (
                <div
                  className="ellipse"
                  style={{
                    backgroundColor: colorConfig.childrenicon,
                  }}
                ></div>
              ),
            },
          },
          {
            path: ROUTES.userActivityRoutes,
            sidebarProps: {
              displayText: "User Activity",
              icon: (
                <div
                  className="ellipse"
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
          icon: (
            <img
              src={ICONS.projectrackingIcon}
              className="icon-image"
              alt=""
              style={{ height: "20px", width: "20px" }}
            />
          ),
        },
        child: [
          {
            path: "#",
            sidebarProps: {
              displayText: "Performance",
              icon: (
                <div
                  className="ellipse"
                  style={{
                    backgroundColor: colorConfig.childrenicon,
                  }}
                ></div>
              ),
            },
          },
          {
            path: ROUTES.projectRoutes,
            sidebarProps: {
              displayText: "Project Detail",
              icon: (
                <div
                  className="ellipse"
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
    other: [
      {
        path: ROUTES.usermgtRoutes,

        sidebarProps: {
          displayText: "User Management",
          icon: <img src={ICONS.userMan} className="icon-image" alt="" />,
        },
      },
      {
        path: "#",
        sidebarProps: {
          displayText: "Configure",
          icon: (
            <img
              src={ICONS.config}
              alt=""
              style={{ height: "16px", width: "16px" }}
            />
          ),
        },
        child: [
          {
            path: ROUTES.commissionrate,
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
            path: ROUTES.dealerOverRoutes,
            sidebarProps: {
              displayText: "Dealer OverRides",
              icon: (
                <div
                  className="ellipse"
                  style={{ backgroundColor: colorConfig.dealerColor }}
                ></div>
              ),
            },
          },
          {
            path: ROUTES.marketingRoutes,

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
            path: ROUTES.adderRoutes,
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
            path: ROUTES.saleRoutes,
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

          {
            path: ROUTES.tierLoanFeeRoutes,
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
            path: ROUTES.dealerTierRoutes,
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
            path: ROUTES.paymentSchRoutes,
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
            path: ROUTES.timelineRoutes,

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

          {
            path: ROUTES.loanRoutes,

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
          {
            path: ROUTES.autoadderRoutes,

            sidebarProps: {
              displayText: "Auto Adder",
              icon: (
                <div
                  className="ellipse"
                  style={{ backgroundColor: colorConfig.marketColor }}
                ></div>
              ),
            },
          },
          {
            path: ROUTES.loanFeeRoutes,
            sidebarProps: {
              displayText: "Loan Fee Addr",
              icon: (
                <div
                  className="ellipse"
                  style={{ backgroundColor: colorConfig.loanTypeColor }}
                ></div>
              ),
            },
          },
          {
            path: ROUTES.rebetDataRoutes,

            sidebarProps: {
              displayText: "Rebate Data",
              icon: (
                <div
                  className="ellipse"
                  style={{ backgroundColor: colorConfig.dealerColor }}
                ></div>
              ),
            },
          },
          {
            path: ROUTES.referalDataRoutes,

            sidebarProps: {
              displayText: "Referal Data",
              icon: (
                <div
                  className="ellipse"
                  style={{ backgroundColor: colorConfig.commissionColor }}
                ></div>
              ),
            },
          },
          {
            path: ROUTES.dealerCreditRoutes,

            sidebarProps: {
              displayText: "Dealer Credit",
              icon: (
                <div
                  className="ellipse"
                  style={{ backgroundColor: colorConfig.adderColor }}
                ></div>
              ),
            },
          },
          {
            path: ROUTES.nonCommRoutes,

            sidebarProps: {
              displayText: "NonComm(DLRPay)",
              icon: (
                <div
                  className="ellipse"
                  style={{ backgroundColor: colorConfig.payColor }}
                ></div>
              ),
            },
          },
          {
            path: ROUTES.dlrOthRoutes,

            sidebarProps: {
              displayText: "DLR-OTH(DLRPay)",
              icon: (
                <div
                  className="ellipse"
                  style={{ backgroundColor: colorConfig.dealerTierColor }}
                ></div>
              ),
            },
          },
          //       - AutoAdder
          // LoanFeeAddr
          // Rebate Data
          // Referal Data
          // dealer credit
          // non-comm (DLR PAY)
          // DLR-OTH (DLR PAY)
        ],
      },

      {
        path: ROUTES.technicalSupportRoutes,

        sidebarProps: {
          displayText: "Technical Support",
          icon: (
            <img src={ICONS.techIcon} className="children-icon-image" alt="" />
          ),
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
