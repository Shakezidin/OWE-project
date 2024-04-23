import { IoFilter } from "react-icons/io5";
import { ICONS } from "../../icons/Icons";
import { LuArrowUpRight } from "react-icons/lu";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import "./configure.css";

const ConfigurePage: React.FC = () => {
  return (
    <>
      <div className="configure-container">
        <div className="configure-header">
          <div className="configure-name">
            <h3>Configure</h3>
          </div>
          <div className="spacer"></div>
          <div className="configure-header-icons">
            <IoFilter className="io-filter" />
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
              <p>Dealer Pay</p>
              <div className="configure-cards">
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#FFF1E4" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#FD7C05"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Commission Rate</p>
                </div>
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#ECEFFB" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#294FD4"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Dealer OverRides</p>
                </div>
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#E0F6FF" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#04A5E8"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Marketing Fees</p>
                </div>
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#FFEAEA" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#D81C1C"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Adder validation</p>
                </div>
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#DCEBFF" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#2E7CE2"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Sale Types</p>
                </div>
              </div>
            </div>
            <div className="Rep-pay">
              <p>Rep Pay</p>
              <div className="configure-cards">
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#FFF1E4" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#FD7C05"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Tier Loan Fee</p>
                </div>
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#ECEFFB" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#294FD4"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Dealer Tier</p>
                </div>
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#E0F6FF" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#04A5E8"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Payment Scheduler</p>
                </div>
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#FFEAEA" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#D81C1C"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Time Line SLA</p>
                </div>
              </div>
            </div>
            <div className="common">
              <p>Common</p>
              <div className="configure-cards">
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#FFF1E4" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#FD7C05"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Loan Type</p>
                </div>
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#ECEFFB" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#294FD4"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Auto Adder</p>
                </div>
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#E0F6FF" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#04A5E8"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Loan Fee Addr</p>
                </div>
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#FFEAEA" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#D81C1C"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Rebate Data</p>
                </div>
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#FFEAEA" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#D81C1C"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Referal Data</p>
                </div>
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#FFEAEA" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#D81C1C"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>Dealer Credit</p>
                </div>
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#FFEAEA" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#D81C1C"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>NON-Comm</p>
                </div>
                <div className="pay-card">
                  <div className="pay-img">
                    <div
                      className="pay-card-img"
                      style={{ backgroundColor: "#FFEAEA" }}
                    >
                      <RiMoneyDollarCircleLine
                        color="#D81C1C"
                        className="pay-dollar-img"
                      />
                    </div>
                    <LuArrowUpRight className="pay-card-arrow" />
                  </div>
                  <p>DLR-OTH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ConfigurePage;
