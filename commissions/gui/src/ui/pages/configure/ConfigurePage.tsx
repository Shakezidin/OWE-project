
import { FaPlus, FaMinus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes/routes";
import { RiArrowRightUpLine } from "react-icons/ri";
import "./ConfigurePage.css";

const ConfigurePage: React.FC = () => {
  const cardColors = ["#E8EFF9", "#F6ECEF", "#E6F8EF", "#FBF6DA", "#EAE6F8"];
  const arrowColors = ["#1963C6", "#D1275A", "#06BA63", "#EBAA04", "#5121FA"];

  const dealerData = [
    { title: "Dealer OverRides", route: ROUTES.CONFIG_DEALER_OVER },
    { title: "Time Line SLA", route: ROUTES.CONFIG_TIMELINE },
    { title: "Rebate Data", route: ROUTES.CONFIG_REBET_DATA },
    { title: "Referal Data", route: ROUTES.CONFIG_REFERAL_DATA },
    { title: "Dealer Credit", route: ROUTES.CONFIG_DEALER_CREDIT },
    { title: "NON-Comm", route: ROUTES.CONFIG_NON_COMM_DLR_PAY },
    { title: "DLR-OTH", route: ROUTES.CONFIG_DLE_OTH_PAY },
  ];

  const repData = [{ title: "Rep Pay"}, { title: "Rate Adjutments"}];

  const AR = [
    { title: "AR" },
    { title: "AR Schedule"},
    { title: "AR Import"},
    { title: "Adjustment"},
    { title: "Reconcile"},
    { title: "Install cost"},
  ];

  const commonData = [
    { title: "Payment Schedule", route: ROUTES.CONFIG_PAYMENT_SCHEDULE},
    { title: "Leader Override"},
    { title: "Appt Setters"},
    { title: "Adder Responsibility"},
    { title: "Adder Credit"},
    { title: "Marketing Fees", route: ROUTES.CONFIG_MARKETING},
    { title: "Loan Fee"},
    { title: "Tier Loan Fee", route: ROUTES.CONFIG_TIER_LOAN_FEE},
    { title: "Dealer Tier", route: ROUTES.CONFIG_DEALER_TIER},
    { title: "Adder Data"},
    { title: "Auto Adder", route: ROUTES.CONFIG_AUTO_ADDER},
    { title: "Commision Rates", route: ROUTES.CONFIG_COMMISSION_RATE},
    { title: "Sales Types", route: ROUTES.CONFIG_SALE},
    { title: "Loan Type", route: ROUTES.CONFIG_LOAN},
    { title: "Adders", route: ROUTES.CONFIG_ADDER},
    { title: "Loan Fee Addr", route: ROUTES.CONFIG_LOAN_FEE},
  ];

  return (
    <>
      <div className="configure-container">
        <div className="configure-header">
          <div className="configure-name">
            <h3>Configure</h3>
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
                {dealerData.map((dealer, index) => {
                  const colorIndex = index % Math.min(cardColors.length, arrowColors.length);
                  const randomCardColor = cardColors[colorIndex]; 
                  const randomArrowColor = arrowColors[colorIndex];
                  return (
                    <Link to={dealer?.route}
                      className="pay-card"
                      key={index}
                      style={{ backgroundColor: randomCardColor }}
                    >
                        <h4 className="card-heading">{dealer.title}</h4>
                      <div
                        className="arrow-wrapper"
                        style={{ color: randomArrowColor }}
                      >
                        <RiArrowRightUpLine className="arrow-right" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rep-pay">
            <div className="configure-card-title">
              <p className="payer-type">Rep Pay</p>
              <FaMinus className="accordion-icon" />
            </div>
            <div className="configure-cards">
            {repData.map((rep, index) => {
                  const colorIndex = index % Math.min(cardColors.length, arrowColors.length);
                  const randomCardColor = cardColors[colorIndex]; 
                  const randomArrowColor = arrowColors[colorIndex];
                  return (
                    <Link to={"#"}
                      className="pay-card"
                      key={index}
                      style={{ backgroundColor: randomCardColor }}
                    >
                        <h4 className="card-heading">{rep.title}</h4>
                      <div
                        className="arrow-wrapper"
                        style={{ color: randomArrowColor }}
                      >
                        <RiArrowRightUpLine className="arrow-right" />
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>

          <div className="AR">
            <div className="configure-card-title">
              <p className="payer-type">AR</p>
              <FaPlus className="accordion-icon" />
            </div>
            <div className="configure-cards">
            {AR.map((ar, index) => {
                  const colorIndex = index % Math.min(cardColors.length, arrowColors.length);
                  const randomCardColor = cardColors[colorIndex]; 
                  const randomArrowColor = arrowColors[colorIndex];
                  return (
                    <Link to={"#"}
                      className="pay-card"
                      key={index}
                      style={{ backgroundColor: randomCardColor }}
                    >
                        <h4 className="card-heading">{ar.title}</h4>
                      <div
                        className="arrow-wrapper"
                        style={{ color: randomArrowColor }}
                      >
                        <RiArrowRightUpLine className="arrow-right" />
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>

          <div className="common">
            <div className="configure-card-title">
              <p className="payer-type">Common</p>
              <FaMinus className="accordion-icon" />
            </div>
            <div className="configure-cards">
            {commonData.map((common, index) => {
                  const colorIndex = index % Math.min(cardColors.length, arrowColors.length);
                  const randomCardColor = cardColors[colorIndex]; 
                  const randomArrowColor = arrowColors[colorIndex];
                  return (
                    <Link to={"#"}
                      className="pay-card"
                      key={index}
                      style={{ backgroundColor: randomCardColor }}
                    >
                        <h4 className="card-heading">{common.title}</h4>
                      <div
                        className="arrow-wrapper"
                        style={{ color: randomArrowColor }}
                      >
                        <RiArrowRightUpLine className="arrow-right" />
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfigurePage;
