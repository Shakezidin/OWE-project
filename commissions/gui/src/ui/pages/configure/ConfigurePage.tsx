import { ICONS } from "../../icons/Icons";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import { TfiArrowCircleRight } from "react-icons/tfi";
import { FaPlus, FaMinus } from "react-icons/fa6";
import "./ConfigurePage.css";

const ConfigurePage: React.FC = () => {
  const dealerData = [
    { title: "Commision Rate" },
    { title: "Dealer OverRides" },
    { title: "Marketing Fees" },
    { title: "Adder Validation" },
    { title: "Sales Types" },
    { title: "Tier Loan Fee" },
    { title: "Dealer OverRides" },
    { title: "Payment Scheduler" },
    { title: "Time Line SLA " },
    { title: "Loan Type" },
    { title: "Auto Adder" },
    { title: "Loan Fee Addr" },
    { title: "Rebate Data" },
    { title: "Referal Data" },
    { title: "Dealer Credit" },
    { title: "NON-Comm" },
    { title: "DLR-OTH" },
  ];
  const commonData = [
    { title: "Commision Rate" },
    { title: "Dealer OverRides" },
    { title: "Marketing Fees" },
    { title: "Adder Validation" },
    { title: "Sales Types" },
    { title: "Tier Loan Fee" },
    { title: "Dealer OverRides" },
    { title: "Dealer OverRides" },
    { title: "Auto Addr" },
    { title: "Adder Validation" },
    { title: "Tier Loan Fee" },
    { title: "Dealer OverRides" },
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
                {
                  dealerData.map((dealer, index) => (
                    <div className="pay-card" key={index}>
                      <p>{dealer.title}</p>
                      <TfiArrowCircleRight />
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          <div className="common">
            <div className="configure-card-title">
              <p className="payer-type">Common</p>
              <FaMinus className="accordion-icon" />
            </div>
            <div className="configure-cards">
              {
                commonData.map((common, index) => (
                  <div className="pay-card" key={index}>
                     <p>{common.title}</p>
                      <TfiArrowCircleRight />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ConfigurePage;
