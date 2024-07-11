import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import { RiArrowRightLine } from 'react-icons/ri';
import './dashboard.css';
import { ICONS } from '../../icons/Icons';
import NewTeam from './NewMember/NewTeam';

interface AccordionSection {
  title: string;
  data: { title: string;size: number; route: string }[];
  state: [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined;
}

const TeamManagement: React.FC = () => {
  const cardColors = ['#EE824D', '#57B3F1', '#C470C7', '#63ACA3', '#8E81E0'];
  const arrowColors = ['#EE824D', '#57B3F1', '#C470C7', '#63ACA3', '#8E81E0'];




  const accordionSections: AccordionSection[] = [
    {
      title: '',
      data: [
        { title: 'Bizon',size: 27, route: ROUTES.TEAM_MANAGEMENT_TABLE },
        // { title: "Adders", route: ROUTES.CONFIG_ADDER },
        { title: 'Pirates',size: 74, route: ROUTES.TEAM_MANAGEMENT_TABLE },
        // { title: "Loan Fee Addr", route: ROUTES.CONFIG_LOAN_FEE },
        { title: 'UNTD',size: 65, route: ROUTES.TEAM_MANAGEMENT_TABLE },
        { title: 'Propector',size: 36, route: ROUTES.TEAM_MANAGEMENT_TABLE },
        { title: 'Morgan',size: 89, route: ROUTES.TEAM_MANAGEMENT_TABLE },
        { title: 'Prime',size: 113, route: ROUTES.TEAM_MANAGEMENT_TABLE },
        { title: 'Light Work',size: 78, route: ROUTES.TEAM_MANAGEMENT_TABLE },
      ],
      state: useState<boolean>(true),
    },
  ];

  const [open2, setOpen2] = useState<boolean>(false);

  
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => {
    setOpen2(false);
  };

  const onSubmitCreateTeam = () => {
    console.log("")
  }

  let prevColorIndex = -1;

  return (
    <>
    {open2 && (
        <NewTeam
          handleClose2={handleClose2}
          onSubmitCreateUser={onSubmitCreateTeam}
        />
      )}
      <div className="team-container">
        <div className="team-main">
          <div className="team-main-section">
            {accordionSections.map(({ title, data, state }, index) => {
              if (!state) return null;
              const [isOpen, setIsOpen] = state;
              return (
                <div
                  key={index}
                  className={`${title.toLowerCase()} ${isOpen ? 'open' : ''}`}
                >
                  <div className={`team-cards ${isOpen ? 'open' : ''}`}>





                    <div onClick={handleOpen2}>
                      <Link
                        to=""
                        className="create-new-card"
                      >
                        <div className="team-cust-file">
                          <div className="team-cust-group">
                            <img src={ICONS.addicon} alt="" />
                            <h4>Create new team</h4>
                          </div>
                        </div>
                      </Link>
                    </div>

                    
                   {data.map((item, index) => {
                      let randomColorIndex;
                      let randomCardColor;
                      let randomArrowColor;

                      do {
                        randomColorIndex = Math.floor(Math.random() * cardColors.length);
                        randomCardColor = cardColors[randomColorIndex];
                        randomArrowColor = arrowColors[randomColorIndex];
                      } while (index > 0 && randomColorIndex === prevColorIndex);

                      // Update the previous color index
                      prevColorIndex = randomColorIndex;

                      return (
                        <div key={index}>
                          <Link
                            to={item.route}
                            className="team-pay-card"
                            style={{ backgroundColor: randomCardColor }}
                          >
                            <h1 className="team-card-heading">{item.title}</h1>
                            <div className="team-con-fle">
                              <div className="teamp-group">
                                <img src={ICONS.teamgroup} alt="" />
                                <h4>{item.size} members</h4>
                              </div>
                              <div
                                className="team-arrow-wrapper"
                                style={{ color: randomArrowColor }}
                              >
                                <span className="view-text">View</span>
                                <RiArrowRightLine className="team-arrow-right" />
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

export default TeamManagement;
