import colorConfig from "../config/colorConfig";
import { ICONS } from "../ui/icons/Icons";
import { ROUTES } from "./routes";
const appRoutesTwo = [
  {
    commission: [
      {
        path: ROUTES.COMMISSION_DASHBOARD,
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
            path: ROUTES.DB_MANAGER_DASHBOARD,
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
            path: ROUTES.DB_MANAGER_DATA_TABLE,
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
            path: ROUTES.DB_MANAGER_USER_ACTIVITY,
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
            path: ROUTES.PROJECT,
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
        path: ROUTES.USER_MANAEMENT,

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
            path: ROUTES.CONFIG_COMMISSION_RATE,
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
            path: ROUTES.CONFIG_DEALER_OVER,
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
            path: ROUTES.CONFIG_MARKETING,

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
            path: ROUTES.CONFIG_ADDER,
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
            path: ROUTES.CONFIG_SALE,
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
            path: ROUTES.CONFIG_TIER_LOAN_FEE,
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
            path: ROUTES.CONFIG_DEALER_TIER,
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
            path: ROUTES.CONFIG_PAYMENT_SCHEDULE,
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
            path: ROUTES.CONFIG_TIMELINE,

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
            path: ROUTES.CONFIG_LOAN,

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
            path: ROUTES.CONFIG_AUTO_ADDER,

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
            path: ROUTES.CONFIG_LOAN_FEE,
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
            path: ROUTES.CONFIG_REBET_DATA,

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
            path: ROUTES.CONFIG_REFERAL_DATA,

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
            path: ROUTES.CONFIG_DEALER_CREDIT,

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
            path: ROUTES.CONFIG_NON_COMM_DLR_PAY,

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
            path: ROUTES.CONFIG_DLE_OTH_PAY,

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
        path: ROUTES.TECHNICAL_SUPPORT,

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

export default appRoutesTwo;
