
import colorConfig from "../config/colorConfig";
import { ICONS } from "../ui/icons/Icons";
import { routes } from "./routes";
const appRoutesTwo = [
    {
        name: "Commission",
        commission: [
            {
                path: routes.commissiondash,
                sidebarProps: {
                    displayText: "Dashboard",
                    icon: <img src={ICONS.dash} className="icon-image" alt="" />,
                },
            },
            {
                sidebarProps: {
                    displayText: "Configure",
                    icon: <img src={ICONS.config} className="icon-image" alt="" />,
                },
                child: [
                    {
                        path: routes.commissionrate,
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
                        path: routes.dealerOverRoutes,


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
                        path: routes.marketingRoutes,


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
                        path: routes.adderRoutes,
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
                        path: routes.saleRoutes,
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
                        path: routes.tierLoanFeeRoutes,
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
                        path: routes.dealerTierRoutes,
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
                        path: routes.paymentSchRoutes,
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
                        path: routes.timelineRoutes,

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
                        path: routes.loanRoutes,

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
                        path: routes.autoadderRoutes,

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
                        path: routes.loanFeeRoutes,
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
                        path: routes.rebetDataRoutes,

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
                        path: routes.referalDataRoutes,

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
                        path: routes.dealerCreditRoutes,

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
                        path: routes.nonCommRoutes,

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
                        path: routes.dlrOthRoutes,

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
                path: routes.reportRoutes,
                sidebarProps: {
                    displayText: "Report",
                    icon: <img src={ICONS.reportIcon} className="icon-image" alt="" />,
                },
            },
        ]
    },
    {
        name: "Other",
        other: [


            {
                path: routes.projectRoutes,

                sidebarProps: {
                    displayText: "Project Tracker",
                    icon: <img src={ICONS.trackerIcon} className="icon-image" alt="" />,
                },
            },
            {
                path: routes.dbDashRoutes,
                sidebarProps: {
                    displayText: "DB Dashboard",
                    icon:<img src={ICONS.dash} className="icon-image" alt="" />,
                },
            },
            {
                path: routes.dataTableRoutes,
                sidebarProps: {
                    displayText: "Data",
                    icon: <img src={ICONS.reportIcon} className="icon-image" alt="" />,
                },
            },
            {
                path: routes.userActivityRoutes,
                sidebarProps: {
                    displayText: "UserActivity",
                    icon: <img src={ICONS.activityIcon} className="icon-image" alt="" />,
                },
            },
            {
                path: routes.usermgtRoutes,

                sidebarProps: {
                    displayText: "User Management",
                    icon: <img src={ICONS.userMan} className="icon-image" alt="" />,
                },
            },
            {
                path: routes.technicalSupportRoutes,

                sidebarProps: {
                    displayText: "Technical Support",
                    icon: <img src={ICONS.techIcon} className="icon-image" alt="" />,
                },
            },
            {
                path: routes.accountSettingRoutes,

                sidebarProps: {
                    displayText: "My Account",
                    icon: <img src={ICONS.accountIcon} className="icon-image" alt="" />,
                },
            },
        ]
    }


];

export default appRoutesTwo;
