import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { RiArrowRightLine } from 'react-icons/ri';

interface AccordionSection {
  title: string;
  data: { title: string; route: string; heading?: string }[];
  state: [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined;
}

const Dashboard: React.FC = () => {
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
      title: 'Sales NTP Install',
      data: [{ title: 'Sales NTP Install', route: ROUTES.TOTAL_COUNT }],
      state: useState<boolean>(true),
    },
    {
      title: 'Summary',
      data: [
        { title: 'Production', route: ROUTES.REPORTING_PRODUCTION },
        { title: 'Quality', route: ROUTES.REPORTING_QUALITY },
        {
          heading: 'Speed',
          title: 'Overall',
          route: ROUTES.REPORTING_SPEED_OVERALL,
        },
        {
          heading: 'Speed',
          title: 'Sales to Install',
          route: ROUTES.REPORTING_SALES_TO_INSTALL,
        },
        {
          heading: 'First time completions',
          title: 'Quality per Office',
          route: ROUTES.FIRST_TIME_COMPLETIONS,
        },
        {
          heading: 'First time completions',
          title: 'Reason for Incompletion',
          route: ROUTES.REPORTING_REASON_FOR_INCOMPLETE,
        },
      ],
      state: useState<boolean>(true),
    },
    // {
    //   title: 'PV Install',
    //   data: [
    //     {
    //       heading: 'Install Completions',
    //       title: 'Completions per office',
    //       route: ROUTES.COMPLETIONS_PER_OFFICE,
    //     },
    //     {
    //       heading: 'Install Completions',
    //       title: 'Completions per Team',
    //       route: ROUTES.COMPLETIONS_PER_TEAM,
    //     },
    //     {
    //       heading: 'Install Completions',
    //       title: 'No PTO Granted Date',
    //       route: ROUTES.NO_PTO,
    //     },
    //     { title: 'Timelines', route: ROUTES.TIMELINES },
    //     { title: '1st Time Completions', route: ROUTES.SITE_FIRST_COMPLETION },
    //   ],
    //   state: useState<boolean>(true),
    // },
    // {
    //   title: 'Site Survey',
    //   data: [
    //     { title: 'All Completions', route: ROUTES.SITE_COMPLETION },
    //     { title: 'Timelines', route: ROUTES.SITE_TIMELINES },
    //     { title: '1st Time Completions', route: ROUTES.SITE_FIRST_COMPLETION },
    //     { title: 'Outside SLA', route: ROUTES.SITE_OUTSIDE_SLA },
    //   ],
    //   state: useState<boolean>(true),
    // },
    {
      title: 'CFA Timeline',
      data: [
        { title: 'Install to FIN', route: ROUTES.INSTALL_TO_FIN },
        { title: 'AJH + 15 Days SLA', route: ROUTES.AHJ },
        { title: 'Permit Redline %', route: ROUTES.PERMIT_REDLINE },
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
        {/* <div className="configure-header">
          <Breadcrumb
            head=""
            linkPara="Configure"
            route={''}
            linkparaSecond=""
            marginLeftMobile="12px"
          />
        </div> */}
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
                        <div key={index} className="pay-card-wrapper">
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
                              {item.heading ? (
                                <small>({item.heading})</small>
                              ) : null}
                              <h1 className="reporting-card-heading">
                                {item.title}
                              </h1>
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

export default Dashboard;
