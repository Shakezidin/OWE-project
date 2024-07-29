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
import Select from 'react-select';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../infrastructure/web_api/api_client/EndPoints';
import { dealerOption } from '../../../core/models/data_models/SelectDataModel';

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




  let prevColorIndex = -1;

  // const handleRedirect = (id: number) => {
  //   history.push(`/team/${id}`);
  // };
  console.log(teams, 'teMS');
  console.log(accordionSections, 'acjkbf');

  const handleChange = (selectedOption: any) => {
    setSelectedDealer(selectedOption);
  };


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
                      <button onClick={handleOpen2}>+ Create New Team</button>
                      <Select
                        options={dealerOption(newFormData)}
                        onChange={handleChange}
                        value={selectedDealer}
                        styles={{
                          control: (baseStyles, state) => ({
                            ...baseStyles,
                            borderRadius: '8px',
                            outline: 'none',
                            color: '#101828',
                            width: '200px',
                            height: '36px',
                            fontSize: '12px',
                            border: '1px solid #d0d5dd',
                            fontWeight: '500',
                            cursor: 'pointer',
                            alignContent: 'center',
                            backgroundColor: '#ffffff',
                            boxShadow: 'none',
                            marginRight: '18px'
                          }),
                          placeholder: (baseStyles) => ({
                            ...baseStyles,
                            color: '#292929', // Change the placeholder color here
                          }),
                          indicatorSeparator: () => ({
                            display: 'none',
                          }),
                          dropdownIndicator: (baseStyles, state) => ({
                            ...baseStyles,
                            color: '#292929',
                            '&:hover': {
                              color: '#292929',
                            },
                          }),
                          option: (baseStyles, state) => ({
                            ...baseStyles,
                            fontSize: '13px',
                            color: state.isSelected ? '#ffffff' : '#000000',
                            backgroundColor: state.isSelected ? '#377CF6' : '#ffffff',
                            '&:hover': {
                              backgroundColor: state.isSelected ? '#0493CE' : '#DDEBFF',
                            },
                            cursor: 'pointer',
                          }),
                          singleValue: (baseStyles, state) => ({
                            ...baseStyles,
                            color: '#292929',
                          }),
                          menu: (baseStyles) => ({
                            ...baseStyles,
                            width: '212px',
                          }),
                        }}
                      />
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
                          <Link
                            to={item.route}
                            className="team-pay-card"
                            style={{ backgroundColor: randomCardColor }}
                          >
                            <h1 className="team-card-heading">
                              {item.team_name}
                            </h1>
                            <div className="team-con-fle">
                              <div className="teamp-group">
                                <img src={ICONS.teamgroup} alt="" />
                                <h4>{item.team_strength} members</h4>
                              </div>
                              <Link
                                to={`/team-management/${item.team_id}?team-manager=${item.manager_id}&team-name=${item.team_name}`}
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
