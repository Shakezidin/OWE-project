import { ICONS } from "../../icons/Icons";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import { TfiArrowCircleRight } from "react-icons/tfi";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routes";
import "./ConfigurePage.css";

const ConfigurePage: React.FC = () => {
  const dealerData = [
    { title: "Commision Rate", route: ROUTES.CONFIG_COMMISSION_RATE },
    { title: "Dealer OverRides", route: ROUTES.CONFIG_DEALER_OVER },
    { title: "Marketing Fees", route: ROUTES.CONFIG_MARKETING },
    { title: "Adder Validation", route: ROUTES.CONFIG_ADDER },
    { title: "Sales Types", route: ROUTES.CONFIG_SALE },
    { title: "Tier Loan Fee", route: ROUTES.CONFIG_TIER_LOAN_FEE },
    { title: "Dealer OverRides", route: ROUTES.CONFIG_DEALER_OVER },
    { title: "Payment Scheduler", route: ROUTES.CONFIG_PAYMENT_SCHEDULE },
  ];

  const commonData = [
    { title: "Time Line SLA", route: ROUTES.CONFIG_TIMELINE },
    { title: "Loan Type", route: ROUTES.CONFIG_LOAN },
    { title: "Auto Adder", route: ROUTES.CONFIG_AUTO_ADDER },
    { title: "Loan Fee Addr", route: ROUTES.CONFIG_LOAN_FEE },
    { title: "Rebate Data", route: ROUTES.CONFIG_REBET_DATA },
    { title: "Referal Data", route: ROUTES.CONFIG_REFERAL_DATA },
    { title: "Dealer Credit", route: ROUTES.CONFIG_DEALER_CREDIT },
    { title: "NON-Comm", route: ROUTES.CONFIG_NON_COMM_DLR_PAY },
    { title: "DLR-OTH", route: ROUTES.CONFIG_DLE_OTH_PAY },
  ];

  return (
    <>
      <div className="configure-container">
        <div className="configure-header">
          <div className="configure-name">
            <h3>Configure</h3>
            <Breadcrumb
              head="Configure"
              linkPara="Commissions"
              linkparaSecond="Configure"
            />
          </div>
          <div className="iconsSection-filter">
            <button type="button">
              <img src={ICONS.FILTER} alt="" />
            </button>
          </div>
        </div>

        <div className="configure-main">
          <div className="configure-main-section">
            <div className="dealer-pay">
              <div className="configure-card-title">
                <p className="payer-type">Dealer Pay</p>
                <FaPlus className="accordion-icon" />
              </div>
              <div className="configure-cards">
                {dealerData.map((dealer, index) => (
                  <div className="pay-card" key={index}>
                    {dealer.route ? (
                      <Link to={dealer.route}><p>{dealer.title}</p></Link>
                    ) : (
                      <p>{dealer.title}</p>
                    )}
                    <TfiArrowCircleRight />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="common">
            <div className="configure-card-title">
              <p className="payer-type">Common</p>
              <FaMinus className="accordion-icon" />
            </div>
            <div className="configure-cards">
              {commonData.map((common, index) => (
                <div className="pay-card" key={index}>
                  {common.route ? (
                    <Link to={common.route}><p>{common.title}</p></Link>
                  ) : (
                    <p>{common.title}</p>
                  )}
                  <TfiArrowCircleRight />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfigurePage;

