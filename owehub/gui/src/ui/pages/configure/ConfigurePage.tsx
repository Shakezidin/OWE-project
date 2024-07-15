import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import { RiArrowRightLine } from 'react-icons/ri';
import './ConfigurePage.css';

interface AccordionSection {
  title: string;
  data: { title: string; route: string }[];
  state: [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined;
}

const ConfigurePage: React.FC = () => {
  const cardColors = ['#FAD9CA', '#CDE8FB', '#EDD4EE', '#D0E6E3', '#DDD9F6'];
  const arrowColors = ['#EE824D', '#57B3F1', '#C470C7', '#63ACA3', '#8E81E0'];

  const hoverSwithClass = (color: string) => {
    switch (color) {
      case '#FAD9CA':
        return 'bg-salmon';
      case '#CDE8FB':
        return 'bg-light-blue';
      case '#EDD4EE':
        return 'bg-purple';

      case '#D0E6E3':
        return 'bg-light-green';

      case '#DDD9F6':
        return 'bg-dark-blue';

      default:
        return '';
    }
  };

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
        { title: 'Rep Incent', route: ROUTES.CONFIG_REPINCENT },
        { title: 'Ap Pda', route: ROUTES.CONFIG_APPDA },
        { title: 'Ap Adv', route: ROUTES.CONFIG_APADV },
        { title: 'Ap Ded', route: ROUTES.CONFIG_APDED },
        { title: 'Ap Oth', route: ROUTES.CONFIG_APOTH },
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
        { title: 'Commission Rates', route: ROUTES.CONFIG_COMMISSION_RATE },
        { title: 'Sales Types', route: ROUTES.CONFIG_SALE },
        { title: 'Loan Type', route: ROUTES.CONFIG_LOAN },
        { title: 'DBA', route: ROUTES.CONFIG_DBA },
        { title: 'Rep Credit', route: ROUTES.CONFIG_REPCREDIT },
        { title: 'Rep Status', route: ROUTES.CONFIG_REPSTATUS },
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
                            className={`pay-card ${hoverSwithClass(randomCardColor)}`}
                            style={{
                              backgroundColor: randomCardColor,
                              outline: `1px dotted ${randomArrowColor}`,
                              outlineOffset: '3px',
                            }}
                          >
                            <div className="con-fle">
                              <h1 className="card-heading">{item.title}</h1>
                              <div
                                className="arrow-wrapper"
                                style={{ color: randomArrowColor }}
                              >
                                <span className="view-text">View</span>
                                <RiArrowRightLine className="arrow-right" />
                              </div>
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
