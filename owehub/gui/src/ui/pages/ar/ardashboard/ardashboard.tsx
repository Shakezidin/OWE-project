import React, { useEffect, useState, useRef } from 'react';
import './ardashboard.css';
import { ICONS } from '../../../icons/Icons';
import {
  comissionValueData,
  payRollData,
} from '../../../../resources/static_data/StaticData';
import FilterModal from '../../../components/FilterModal/FilterModal';
import ArDashBoardTable from './artable';
import ArDropdownWithCheckboxes from './Dropdown';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Select from 'react-select';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { handleChange as filterChange } from '../../../../redux/apiSlice/AR/ArDataSlice';

export const ARDashboardPage: React.FC = () => {
  const [active, setActive] = React.useState<number>(0);
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dispatch = useAppDispatch();
  const filterClose = () => {
    setFilterModal(false);
  };
  const options = [
    { value: 'All', label: 'All', key: 'all' },
    { value: 'Shaky', label: 'Shaky', key: 'shaky' },
    { value: 'Cancel', label: 'Cancel', key: 'cancel' },
    { value: 'QC/Permit/NTP', label: 'QC/Permit/NTP', key: 'permits' },
    { value: 'Install', label: 'Install', key: 'install' },
    { value: 'PTO', label: 'PTO', key: 'pto' },
  ];

  const options1 = [
    { value: 'All', label: 'All' },
    { value: 'Current Due', label: 'Current Due' },
    { value: 'Overpaid', label: 'Overpaid' },
  ];
  const options2 = [
    { value: 'All', label: 'All' },
    { value: 'N/A', label: 'N/A' },
  ];
  const options3 = [
    { value: 'All', label: 'All' },
    { value: 'Partner', label: 'Partner' },
    { value: 'Installer', label: 'Installer' },
    { value: 'Type', label: 'Type' },
    { value: 'Service', label: 'Service' },
    { value: 'Home Owner', label: 'Home Owner' },
    { value: 'Street Address', label: 'Street Address' },
    { value: 'City', label: 'City' },
    { value: 'ST', label: 'State' },
    { value: 'Zip', label: 'Zip' },
    { value: 'KW', label: 'KW' },
    { value: 'Contract Date', label: 'Contract Date' },
    { value: 'Install date', label: 'Install date' },
    { value: 'Current Status', label: 'Current Status' },
    { value: 'Status date', label: 'Status date' },
    { value: 'Contract', label: 'Contract' },
    { value: 'AR Total', label: 'AR Total' },
    { value: 'Amt paid', label: 'Amt paid' },
    { value: 'Current Due', label: 'Current Due' },
    { value: 'Est Pipeline', label: 'Est Pipeline' },
    { value: 'Subtotal', label: 'Subtotal' },
  ];

  // used for close date click outside anywhere
  const datePickerRef = useRef<HTMLDivElement>(null);
  const { filters } = useAppSelector((state) => state.ardata);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [selectedOption3, setSelectedOption3] = useState<string>(
    options[0].label
  );
  const handleSelectChange3 = (
    selectedOption3: { value: string; label: string } | null
  ) => {
    setSelectedOption3(selectedOption3 ? selectedOption3.value : '');
  };
  const [selectedOption4, setSelectedOption4] = useState<string>(
    options3[0].label
  );
  const handleSelectChange4 = (
    selectedOption4: { value: string; label: string } | null
  ) => {
    setSelectedOption4(selectedOption4 ? selectedOption4.value : '');
  };
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);

  const handleChange = (name: string, value: string) => {
    dispatch(filterChange({ name, value }));
  };

  return (
    <>
      <div className="ar-Dashboard-section-container">
        <div className='ar-white-back'>
          <div className="ar-Dashboard-container">
            <div className="rep-manage-user">

              <div className="ar-dash-head-input" style={{ width: '157px' }}>
                <div className='rep-drop_label' style={{ backgroundColor: "#63ACA3" }}>
                  <img src={ICONS.report1} alt="" />
                </div>
                <div className='rep-up relative'>
                  <label className="inputLabel" style={{
                    color: '#344054',
                    position: 'absolute',
                    left: '9px',
                    top: '-6px',
                    whiteSpace: 'nowrap'
                  }}>
                    Report Types
                  </label>

                  <Select
                    options={options1}
                    value={{ value: filters.report_type, label: filters.report_type }}
                    onChange={(value) => handleChange('report_type', value?.value!)}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '13px',
                        fontWeight: '500',
                        borderRadius: '.40rem',
                        border: 'none',
                        outline: 'none',
                        width: 'fit-content',
                        minHeight: 'unset',
                        height: '8px',
                        alignContent: 'center',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        boxShadow: 'none',
                        marginTop: '18px'
                      }),
                      placeholder: (baseStyles) => ({
                        ...baseStyles,
                        color: '#0493CE', // Change the placeholder color here
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
                        marginLeft: '-18px'
                      }),
                      option: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '13px',
                        color: state.isSelected ? '#ffffff' : '#000000',
                        backgroundColor: state.isSelected ? '#377CF6' : '#ffffff',
                        '&:hover': {
                          backgroundColor: state.isSelected ? '#377CF6' : '#DDEBFF',
                        },
                      }),
                      singleValue: (baseStyles, state) => ({
                        ...baseStyles,
                        color: '#292929',
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        width: '7rem',
                        zIndex: 999,
                        marginLeft: '-31px'
                      }),
                      menuList: (base) => ({
                        ...base,
                        '&::-webkit-scrollbar': {
                          scrollbarWidth: 'thin',
                          display: 'block',
                          scrollbarColor: 'rgb(173, 173, 173) #fff',
                          width: 8,
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: 'rgb(173, 173, 173)',
                          borderRadius: '30px',
                        },
                      }),
                    }}
                  />
                </div>
              </div>

              <div className="ar-dash-head-input" style={{ width: "134px" }}>
                <div className='rep-drop_label' style={{ backgroundColor: "#C470C7" }}>
                  <img src={ICONS.user} alt="" />
                </div>
                <div className='rep-up relative'>
                  <label className="inputLabel" style={{
                    color: '#344054',
                    position: 'absolute',
                    left: '8px',
                    top: '-6px',
                    whiteSpace: 'nowrap'
                  }}>
                    Sales Partner
                  </label>
                  <Select
                    options={options2}
                    value={{ value: filters.sale_partner, label: filters.sale_partner }}
                    onChange={(value) =>
                      handleChange('sale_partner', value?.value!)
                    }
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '13px',
                        fontWeight: '500',
                        borderRadius: '.40rem',
                        border: 'none',
                        outline: 'none',
                        width: 'fit-content',
                        minHeight: 'unset',
                        height: '8px',
                        alignContent: 'center',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        marginRight: '11px',
                        boxShadow: 'none',
                        marginBottom: '2px',
                        marginTop: '18px'
                      }),
                      placeholder: (baseStyles) => ({
                        ...baseStyles,
                        color: '#0493CE', // Change the placeholder color here
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
                        marginLeft: '-18px'
                      }),
                      option: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '13px',
                        color: state.isSelected ? '#ffffff' : '#000000',
                        backgroundColor: state.isSelected ? '#377CF6' : '#ffffff',
                        '&:hover': {
                          backgroundColor: state.isSelected ? '#377CF6' : '#DDEBFF',
                        },
                      }),
                      singleValue: (baseStyles, state) => ({
                        ...baseStyles,
                        color: '#292929',
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        width: '6rem',
                        marginLeft: '-31px',
                        zIndex: 999,
                      }),
                      menuList: (base) => ({
                        ...base,
                        '&::-webkit-scrollbar': {
                          scrollbarWidth: 'thin',
                          display: 'block',
                          scrollbarColor: 'rgb(173, 173, 173) #fff',
                          width: 8,
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: 'rgb(173, 173, 173)',
                          borderRadius: '30px',
                        },
                      }),
                    }}
                  />
                </div>
              </div>

              <div className="ar-dash-head-input" style={{ width: "115px" }}>
                <div className='rep-drop_label' style={{ backgroundColor: "#8E81E0" }}>
                  <img src={ICONS.vector} alt="" />
                </div>
                <div className='rep-up'>
                  <label className="inputLabel" style={{ color: '#344054', marginLeft: '8px' }}>
                    Includes
                  </label>
                  <ArDropdownWithCheckboxes options={options} />
                </div>
              </div>

              <div className="ar-dash-head-input">
                <div className='rep-drop_label' style={{ backgroundColor: "#EE824D" }}>
                  <img src={ICONS.element} alt="" />
                </div>
                <div className='rep-up relative'>
                  <label className="inputLabel" style={{
                    color: '#344054',
                    position: 'absolute',
                    left: '9px',
                    top: '-6px',
                    whiteSpace: 'nowrap'
                  }}>
                    Elements
                  </label>
                  <Select
                    options={options3}
                    value={{ value: filters.sort_by, label: filters.sort_by }}
                    onChange={(value) => handleChange('sort_by', value?.value!)}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '13px',
                        fontWeight: '500',
                        borderRadius: '.40rem',
                        border: 'none',
                        outline: 'none',
                        width: 'fit-content',
                        minHeight: 'unset',
                        height: '8px',
                        alignContent: 'center',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        boxShadow: 'none',
                        marginBottom: '2px',
                        marginTop: '18px'
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
                        marginLeft: '-18px'
                      }),
                      option: (baseStyles, state) => ({
                        ...baseStyles,
                        fontSize: '13px',
                        color: state.isSelected ? '#ffffff' : '#000000',
                        backgroundColor: state.isSelected ? '#377CF6' : '#ffffff',
                        '&:hover': {
                          backgroundColor: state.isSelected ? '#377CF6' : '#DDEBFF',
                        },
                      }),
                      singleValue: (baseStyles, state) => ({
                        ...baseStyles,
                        color: '#292929',
                      }),
                      menu: (baseStyles) => ({
                        ...baseStyles,
                        width: '8rem',
                        // height: 'auto',
                        // overflowY: 'auto',
                        zIndex: 999,
                        marginLeft: '-32px'
                      }),
                      menuList: (base) => ({
                        ...base,
                        '&::-webkit-scrollbar': {
                          scrollbarWidth: 'thin',
                          display: 'block',
                          scrollbarColor: 'rgb(173, 173, 173) #fff',
                          width: 8,
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: 'rgb(173, 173, 173)',
                          borderRadius: '30px',
                        },
                      }),
                    }}
                  />
                </div>
              </div>


            </div>

            <div className="dashboard-payroll">

              <div className="Line-container">
                <div className="ar-line-graph">
                  <div
                    className={`rep-filter-line ${active === 0 ? 'rep-active-filter-line' : ''
                      }`}
                    onClick={() => setActive(0)}
                  >
                    {active === 0 ? (
                      <img src={ICONS.dashActive} alt="" />
                    ) : (
                      <img src={ICONS.dashActive} alt="" />
                    )}
                  </div>
                  <div
                    className={`filter-disable ${active === 1 ? 'rep-active-filter-line' : ''
                      }`}
                    // onClick={() => setActive(1)}
                    style={{ backgroundColor: '#377CF6' }}
                  >
                    {active === 1 ? (
                      <img src={ICONS.viewActive} alt="" />
                    ) : (
                      <img src={ICONS.viewActive} alt="" />
                    )}
                  </div>
                  <div
                    className="rep-filter-line"
                    onClick={() => setFilterModal(true)}
                    style={{ backgroundColor: '#377CF6' }}
                  >
                    <img src={ICONS.fil_white} alt="" style={{ height: '15px', width: '15px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {filterModal && (
          <FilterModal
            handleClose={filterClose}
            columns={[]}
            page_number={1}
            page_size={10}
            fetchFunction={() => { }}
          />
        )}
        <div className="" style={{ marginTop: '20px' }}>
          {active === 0 && <ArDashBoardTable />}
        </div>
      </div>
    </>
  );
};

