import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import { RiArrowRightLine } from 'react-icons/ri';
import './dashboard.css';
import { ICONS } from '../../icons/Icons';
import NewTeam from './NewMember/NewTeam';
import { getTeams } from '../../../redux/apiActions/teamManagement/teamManagement';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

interface AccordionSection {
  
  data: any;
  state:any;
}

const TeamManagement: React.FC = () => {
  const cardColors = ['#EE824D', '#57B3F1', '#C470C7', '#63ACA3', '#8E81E0'];
  const arrowColors = ['#EE824D', '#57B3F1', '#C470C7', '#63ACA3', '#8E81E0'];
  const [refetch, setRefetch] = useState(1);

  const dispatch = useAppDispatch();

  useEffect(() => {
    // const pageNumber = {
    //   page_number: currentPage,
    //   page_size: itemsPerPage,
    //   archived: viewArchived ? true : undefined,
    //   filters,
    // };
    dispatch(getTeams());
  }, [refetch]);


  const { isSuccess, isFormSubmitting,teams } = useAppSelector(
    (state) => state.teamManagmentSlice
  );

  const accordionSections: AccordionSection[] = [
    {
    
      // data: [
      //   { title: 'Bizon',size: 27, route: ROUTES.TEAM_MANAGEMENT_TABLE },
      //   // { title: "Adders", route: ROUTES.CONFIG_ADDER },
      //   { title: 'Pirates',size: 74, route: ROUTES.TEAM_MANAGEMENT_TABLE },
      //   // { title: "Loan Fee Addr", route: ROUTES.CONFIG_LOAN_FEE },
      //   { title: 'UNTD',size: 65, route: ROUTES.TEAM_MANAGEMENT_TABLE },
      //   { title: 'Propector',size: 36, route: ROUTES.TEAM_MANAGEMENT_TABLE },
      //   { title: 'Morgan',size: 89, route: ROUTES.TEAM_MANAGEMENT_TABLE },
      //   { title: 'Prime',size: 113, route: ROUTES.TEAM_MANAGEMENT_TABLE },
      //   { title: 'Light Work',size: 78, route: ROUTES.TEAM_MANAGEMENT_TABLE },
      // ],
      data:teams,
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

  // const handleRedirect = (id: number) => {
  //   history.push(`/team/${id}`);
  // };
  console.log(teams, "teMS")
  console.log(accordionSections, "acjkbf")

  return (
    <>
    {open2 && (
        <NewTeam
          handleClose2={handleClose2}
          setRefetch={setRefetch}
          // onSubmitCreateUser={onSubmitCreateTeam}
        />
      )}
      <div className="team-container">
        <div className="team-main">
          <div className="team-main-section">
            {accordionSections.map(({  data, state }, index) => {
              if (!state) return null;
              const [isOpen, setIsOpen] = state;
              return (
                <div
                  key={index}
                  // className={`${title.toLowerCase()} ${isOpen ? 'open' : ''}`}
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

                    
                   {data.map((item:any, index:any) => {
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
                            <h1 className="team-card-heading">{item.team_name
                            }</h1>
                            <div className="team-con-fle">
                              <div className="teamp-group">
                                <img src={ICONS.teamgroup} alt="" />
                                <h4>{item.team_strength} members</h4>
                              </div>
                              <Link to = {`/team-management/${item.team_id}?team-manager=${item.manager_id}&team-name=${item.team_name}`}>
                              <div
                                className="team-arrow-wrapper"
                                style={{ color: randomArrowColor }}
                              >
                                <span className="view-text">View</span>
                              <RiArrowRightLine className="team-arrow-right" />
                              </div>
                              </Link> 
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
