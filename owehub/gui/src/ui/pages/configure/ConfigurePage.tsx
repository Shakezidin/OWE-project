import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import { RiArrowRightUpLine } from 'react-icons/ri';
import './ConfigurePage.css';

interface AccordionSection {
  title: string;
  data: { title: string; route: string }[];
  state: [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined;
}

const ConfigurePage: React.FC = () => {
  const cardColors = ['#E8EFF9', '#F6ECEF', '#E6F8EF', '#FBF6DA', '#EAE6F8'];
  const arrowColors = ['#1963C6', '#D1275A', '#06BA63', '#EBAA04', '#5121FA'];

  const accordionSections: AccordionSection[] = [
    {
      title: 'Dealer Pay',
      data: [
        { title: 'Dealer OverRides', route: ROUTES.CONFIG_DEALER_OVER },
        // { title: "Adders", route: ROUTES.CONFIG_ADDER },
        { title: 'Time Line SLA', route: ROUTES.CONFIG_TIMELINE },
        // { title: "Loan Fee Addr", route: ROUTES.CONFIG_LOAN_FEE },
        { title: 'Rebate Data', route: ROUTES.CONFIG_REBET_DATA },
        { title: 'Referal Data', route: ROUTES.CONFIG_REFERAL_DATA },
        { title: 'Dealer Credit', route: ROUTES.CONFIG_DEALER_CREDIT },
        { title: 'NON-Comm', route: ROUTES.CONFIG_NON_COMM_DLR_PAY },
        { title: 'DLR-OTH', route: ROUTES.CONFIG_DLE_OTH_PAY },
      ],
      state: useState<boolean>(true),
    },
    {
      title: 'Rep Pay',
      data: [
        { title: 'Rep Pay', route: ROUTES.CONFIG_REP_PAY_SETTINGS },
        { title: 'Rate Adjustments', route: ROUTES.CONFIG_RATE_ADJUSTMENTS },
      ],
      state: useState<boolean>(true),
    },
    {
      title: 'AR',
      data: [
        { title: 'AR', route: ROUTES.CONFIG_AR },
        { title: 'AR Schedule', route: ROUTES.CONFIG_AR_SCHEDULE },
        { title: 'Adjustment', route: ROUTES.CONFIG_ADJUSTMENTS },
        { title: 'Reconcile', route: ROUTES.CONFIG_RECONCILE },
        { title: 'Install cost', route: ROUTES.CONFIG_INSTALL_COST },
      ],
      state: useState<boolean>(true),
    },
    {
      title: 'Common',
      data: [
        { title: 'Payment Schedule', route: ROUTES.CONFIG_PAYMENT_SCHEDULE },
        { title: 'Leader Override', route: ROUTES.CONFIG_LEADER_OVERRIDE },
        { title: 'Appt Setters', route: ROUTES.CONFIG_APPSETTERS },
        {
          title: 'Adder Responsibility',
          route: ROUTES.CONFIG_ADDER_RESPONSIBILITY,
        },
        {
          title: 'AP Rep',
          route: ROUTES.CONFIG_APREP,
        },
        { title: 'Adder Credit', route: ROUTES.CONFIG_ADDER_CREDITS },
        { title: 'Marketing Fees', route: ROUTES.CONFIG_MARKETING },
        { title: 'Loan Fee', route: ROUTES.CONFIG_LOAN_FEES },
        { title: 'Tier Loan Fee', route: ROUTES.CONFIG_TIER_LOAN_FEE },
        { title: 'Dealer Tier', route: ROUTES.CONFIG_DEALER_TIER },
        { title: 'Adder Data', route: ROUTES.CONFIG_ADDERDATA },
        // { title: "Auto Adder", route: ROUTES.CONFIG_AUTO_ADDER },
        { title: 'Commision Rates', route: ROUTES.CONFIG_COMMISSION_RATE },
        { title: 'Sales Types', route: ROUTES.CONFIG_SALE },
        { title: 'Loan Type', route: ROUTES.CONFIG_LOAN },
      ],
      state: useState<boolean>(true),
    },
  ];

  const toggleAccordion =
    (setState: React.Dispatch<React.SetStateAction<boolean>>) => () => {
      setState((prevState: boolean) => !prevState);
    };

  return (
    <>
      <div className="configure-container">
        <div className="configure-header">
          <h3>Configure</h3>
        </div>
        <div className="configure-main">
          <div className="configure-main-section">
            {accordionSections.map(({ title, data, state }, index) => {
              if (!state) return null;
              const [isOpen, setIsOpen] = state;
              return (
                <div
                  key={index}
                  className={`${title.toLowerCase()} ${isOpen ? 'open' : ''}`}
                >
                  <div
                    className="configure-card-title"
                    onClick={toggleAccordion(setIsOpen)}
                  >
                    <p className="payer-type">{title}</p>
                    <div className="accordion-icon-container">
                      {isOpen ? (
                        <FaMinus className="accordion-icon" />
                      ) : (
                        <FaPlus className="accordion-icon" />
                      )}
                    </div>
                  </div>
                  <div className={`configure-cards ${isOpen ? 'open' : ''}`}>
                    {data.map((item, index) => {
                      const colorIndex =
                        index % Math.min(cardColors.length, arrowColors.length);
                      const randomCardColor = cardColors[colorIndex];
                      const randomArrowColor = arrowColors[colorIndex];
                      return (
                        <div key={index}>
                          <Link
                            to={item.route}
                            className="pay-card"
                            style={{ backgroundColor: randomCardColor }}
                          >
                            <h4 className="card-heading">{item.title}</h4>
                            <div
                              className="arrow-wrapper"
                              style={{ color: randomArrowColor }}
                            >
                              <RiArrowRightUpLine className="arrow-right" />
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfigurePage;
