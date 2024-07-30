import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes/routes';
import { RiArrowRightLine } from 'react-icons/ri';
import './dashboard.css';
import { ICONS } from '../../icons/Icons';
import NewTeam from './NewMember/NewTeam';
import { getTeams } from '../../../redux/apiActions/teamManagement/teamManagement';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import Select from 'react-select';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../infrastructure/web_api/api_client/EndPoints';
import { dealerOption } from '../../../core/models/data_models/SelectDataModel';
import ArDropdownWithCheckboxes from '../ar/ardashboard/Dropdown';
import DropWithCheck from '../../components/dropwithcheck/dropwithcheck';

interface AccordionSection {
  data: any;
  state: any;
}
interface Option {
  value: string;
  label: string;
}

const TeamManagement: React.FC = () => {
  const cardColors = ['#EE824D', '#57B3F1', '#C470C7', '#63ACA3', '#8E81E0'];
  const arrowColors = ['#EE824D', '#57B3F1', '#C470C7', '#63ACA3', '#8E81E0'];
  const [refetch, setRefetch] = useState(1);
  const [newFormData, setNewFormData] = useState<any>([]);
  const [dealer, setDealer] = useState<{ [key: string]: any }>({});
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [isAnyCheckboxChecked, setIsAnyCheckboxChecked] = useState(false);

  const getnewformData = async () => {
    const tableData = {
      tableNames: ['dealer'],
    };
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setDealer((prev) => ({ ...prev, ...res.data }));
  };
  useEffect(() => {
    getnewformData();
  }, []);

  useEffect(() => {
    if (dealer) {
      setNewFormData((prev: any) => ({ ...prev, ...dealer }));
    }
  }, [dealer]);

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

  const { isSuccess, isFormSubmitting, teams } = useAppSelector(
    (state) => state.teamManagmentSlice
  );

  const accordionSections: AccordionSection[] = [
    {

      data: teams,
      state: useState<boolean>(true),
    },
  ];

  const [open2, setOpen2] = useState<boolean>(false);

  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => {
    setOpen2(false);
  };


  const dummyOptions = [
    { label: 'All', value: 'All', key: 'all' },
    { label: 'Option 1', value: 'option1', key: 'key1' },
    { label: 'Option 2', value: 'option2', key: 'key2' },
    { label: 'Option 3', value: 'option3', key: 'key3' },
    { label: 'Option 4', value: 'option4', key: 'key4' },
  ];




  let prevColorIndex = -1;

  // const handleRedirect = (id: number) => {
  //   history.push(`/team/${id}`);
  // };
  console.log(teams, 'teMS');
  console.log(accordionSections, 'acjkbf');

  const handleChange = (selectedOption: any) => {
    setSelectedDealer(selectedOption);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setIsAnyCheckboxChecked(true);
    } else {
      const anyOtherChecked = document.querySelectorAll('.team-checkbox:checked').length > 0;
      setIsAnyCheckboxChecked(anyOtherChecked);
    }
  }

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
            {accordionSections.map(({ data, state }, index) => {
              if (!state) return null;
              const [isOpen, setIsOpen] = state;
              return (
                <div
                  key={index}
                // className={`${title.toLowerCase()} ${isOpen ? 'open' : ''}`}
                >
                  <div className='teamdash-header'>
                    <h1>Total Teams: {teams?.length}</h1>
                    <div className='dash-newteam'>
                      {/* <button className='delete' onClick={handleOpen2}>Remove Team</button> */}
                      {isAnyCheckboxChecked && (
                        <button className='delete' >Remove Team</button>
                      )}
                      <button className='create' onClick={handleOpen2}>+ Create New Team</button>

                      <DropWithCheck options={dummyOptions} />
                    </div>
                  </div>
                  <div className={`team-cards ${isOpen ? 'open' : ''}`}>


                    {data.map((item: any, index: any) => {
                      let randomColorIndex;
                      let randomCardColor;
                      let randomArrowColor;

                      do {
                        randomColorIndex = Math.floor(
                          Math.random() * cardColors.length
                        );
                        randomCardColor = cardColors[randomColorIndex];
                        randomArrowColor = arrowColors[randomColorIndex];
                      } while (
                        index > 0 &&
                        randomColorIndex === prevColorIndex
                      );

                      // Update the previous color index
                      prevColorIndex = randomColorIndex;

                      return (
                        <div key={index}>
                          <div className="team-pay-card-wrapper" style={{ display: 'flex', alignItems: 'center' }}>

                            <Link
                              to={item.route}
                              className="team-pay-card"
                              style={{ backgroundColor: randomCardColor, flexGrow: 1 }}
                            >
                              <div className='team-checkbox-wrapper'>

                                <div className="team-name-tooltip">
                                  <h1 className="team-card-heading">{item.team_name}</h1>
                                </div>
                                <input
                                  type="checkbox"
                                  className="team-checkbox"
                                  onChange={handleCheckboxChange}
                                  onClick={(e: React.MouseEvent<HTMLInputElement>) => e.stopPropagation()}
                                />
                              </div>
                              <div className="team-con-fle">
                                <div className="teamp-group">
                                  <img src={ICONS.teamgroup} alt="" />
                                  <h4>{item.team_strength} members</h4>
                                </div>
                                <Link
                                  to={`/team-management/${item.team_id}?team-manager=${item.manager_id}&team-name=${item.team_name}`}
                                  onClick={(e) => e.stopPropagation()} // Prevent triggering outer Link when clicking inner Link
                                >
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
