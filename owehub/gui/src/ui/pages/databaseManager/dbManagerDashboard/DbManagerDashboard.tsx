import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import './dbManagerDash.css';
import { BiChevronDown } from 'react-icons/bi';
import DashBarLineChart from '../../databaseManager/dbManagerDashboard/DashBarLineChart';
import PieChartWithPaddingAngle from './PieChartWithPaddingAngle';
import { useNavigate } from 'react-router-dom';
import Boxes from './Boxes';
import Select from 'react-select';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchActive } from '../../../../redux/apiSlice/configSlice/config_get_slice/activeSlice';
import moment from 'moment';
import Loading from '../../../components/loader/Loading';

const DbManagerDashboard = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState('');

  const { start_time, loading } = useAppSelector((state) => state.active);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchActive());
  }, []);

  // Function to handle dropdown selection change
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    if (
      selectedValue === 'Today' ||
      selectedValue === 'This Week' ||
      selectedValue === 'All'
    ) {
      navigate(`/userManagement`);
    }
  };

  const data = [
    {
      name: 'Group A',
      value: 200,
      Historical_Records: 100,
      Total_Records: 150,
    },
    {
      name: 'Group B',
      value: 500,
      Historical_Records: 250,
      Total_Records: 300,
    },
  ];
  const data1 = [
    { name: 'Group A', value: 50, Historical_Records: 100, Total_Records: 130 },
    {
      name: 'Group B',
      value: 200,
      Historical_Records: 200,
      Total_Records: 340,
    },
  ];
  const data2 = [
    {
      name: 'Group A',
      value: 100,
      Historical_Records: 100,
      Total_Records: 150,
    },
    {
      name: 'Group B',
      value: 300,
      Historical_Records: 250,
      Total_Records: 300,
    },
  ];
  const options = [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This week' },
    { value: 'all', label: 'All' },
  ];
  const options1 = [
    { value: 'today', label: 'Table1 Data' },
    { value: 'this_week', label: 'Table2 Data' },
    { value: 'all', label: 'Table3 Data' },
  ];

  if (loading) {
    return (
      <div className="loader-container">
        <Loading />
      </div>
    );
  }
  return (
    <>
      <div className="common">
        <Breadcrumb
          head="DB Manager"
          linkPara="DB Manager"
          linkparaSecond="Dashboard"
          route={''}
        />
      </div>

      <div className="Db-manager-container">
        <div className="runner-section">
          <h3>DB Status</h3>
          <p>Application {!start_time && 'Not'} Running</p>
          <div className="active-button">
            <div className="active-since-section">
              {!start_time ? (
                <button type="button" style={{ background: '#CA0B00' }}>
                  Inactive
                </button>
              ) : (
                <button type="button">Active</button>
              )}
            </div>

            {start_time && (
              <div className="since-section">
                <h3>Active Since</h3>
                <p>{moment(start_time).format('MM/DD/YYYY hh:mm A')}</p>
              </div>
            )}
          </div>
        </div>
        <div className="DashBarchart-section">
          <DashBarLineChart />
          <div className="identity1">
            <Boxes color="#FB7955" /> <p>Historical Records</p>
            <Boxes color="#0088FE" /> <p>Total Records</p>
          </div>
        </div>
      </div>

      <div className="webhook-container">
        <div className="status-section">
          <p>Webhooks Status</p>

          <Select
            options={options1}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                marginTop: 'px',
                borderRadius: '8px',
                outline: 'none',
                color: 'black',
                width: '212px',
                height: '36px',
                fontSize: '12px',
                border: '1px solid #d0d5dd',
                fontWeight: '500',
                cursor: 'pointer',
              }),
              indicatorSeparator: () => ({
                display: 'none', // Hide the indicator separator
              }),
              option: (baseStyles) => ({
                ...baseStyles,
                fontSize: '13px',
                cursor: 'pointer',
              }),
            }}
          />
        </div>

        <div className="container-graph">
          <div className="create-container">
            <div className="Create-section">
              <p>Create Webhooks</p>

              <Select
                options={options}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    marginTop: 'px',
                    borderRadius: '8px',
                    outline: 'none',
                    color: 'black',
                    width: '120px',
                    fontSize: '12px',
                    border: '1px solid #d0d5dd',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }),
                  indicatorSeparator: () => ({
                    display: 'none', // Hide the indicator separator
                  }),
                  option: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }),
                }}
              />
            </div>
            <div className="PieBarchart-section">
              <div className="PieChart-container">
                <PieChartWithPaddingAngle data={data} />
              </div>
            </div>

            <div className="identity">
              <Boxes color="#FB7955" /> <p>30% Fail</p>
              <Boxes color="#0088FE" /> <p>70% Pass</p>
            </div>
          </div>

          <div className="create-container">
            <div className="Create-section">
              <p>Update Webhooks</p>

              <Select
                options={options}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    marginTop: 'px',
                    borderRadius: '8px',
                    outline: 'none',
                    color: 'black',
                    width: '120px',
                    fontSize: '12px',
                    border: '1px solid #d0d5dd',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }),
                  indicatorSeparator: () => ({
                    display: 'none', // Hide the indicator separator
                  }),
                  option: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }),
                }}
              />
            </div>
            <div className="PieBarchart-section">
              <div className="PieChart-container">
                <PieChartWithPaddingAngle data={data1} />
              </div>
            </div>
            <div className="identity">
              <Boxes color="#FB7955" /> <p>30% Fail</p>
              <Boxes color="#0088FE" /> <p>70% Pass</p>
            </div>
          </div>

          <div className="create-container">
            <div className="Create-section">
              <p>Delete Webhooks</p>

              <Select
                options={options}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    marginTop: 'px',
                    borderRadius: '8px',
                    outline: 'none',
                    color: 'black',
                    width: '120px',
                    fontSize: '12px',
                    border: '1px solid #d0d5dd',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }),
                  indicatorSeparator: () => ({
                    display: 'none', // Hide the indicator separator
                  }),
                  option: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }),
                }}
              />
            </div>
            <div className="PieBarchart-section">
              <div className="PieChart-container">
                <PieChartWithPaddingAngle data={data2} />
              </div>
            </div>
            <div className="identity">
              <Boxes color="#FB7955" /> <p>30% Fail</p>
              <Boxes color="#0088FE" /> <p>70% Pass</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DbManagerDashboard;
