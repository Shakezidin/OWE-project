import React, { useState } from 'react';
import { ICONS } from '../../../resources/icons/Icons';
import styles from '../styles/Header.module.css';
import { MdRefresh } from 'react-icons/md';
import Select, { SingleValue } from 'react-select';
import styles2 from '../styles/ResponsiveHeader.module.css';
import { useOutletContext } from 'react-router-dom';

interface HeaderProps {
  onMenuSelect: (page: string) => void;
  setOpenRefresh: (open: boolean) => void;
}

interface OptionType {
  value: string;
  label: string;
}

const options: OptionType[] = [
  { value: '7090', label: '7090' },
  { value: '7190', label: '7190' },
  { value: '7290', label: '7290' },
  { value: '7390', label: '7390' },
  { value: '7490', label: '7490' },
];

const ResponsiveHeader: React.FC<HeaderProps> = ({
  onMenuSelect,
  setOpenRefresh,
}) => {
  
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(
    options[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const { setActiveMenu } = useOutletContext<{
    setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
  }>();
  const { activeMenu } = useOutletContext<{ activeMenu: string }>();

  // Menu click handler
  const handleMenuClick = (page: string) => {
    setActiveMenu(page);
    onMenuSelect(page);
  };

  // Handle option change for react-select
  const handleChange = (selectedOption: SingleValue<OptionType>) => {
    setSelectedOption(selectedOption);
    setIsOpen(false);
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      border: 'none',
      borderRadius: '50px',
      padding: '0px 4px',
      fontWeight: '500',
      fontSize: '14px',
      lineHeight: '21px',
      fontFamily: 'Poppins',
      minHeight: '36px',
      minWidth: '100px',
      boxShadow: 'none',
      backgroundColor: state.selectProps.menuIsOpen ? '#2A2626' : 'transparent',
      cursor: 'pointer',
      color:
        state.isFocused || state.selectProps.menuIsOpen ? '#fff' : '#2A2626',
      '&:hover': {
        backgroundColor: 'rgba(42, 38, 38, 0.2)',
        color: '#fff',
      },
    }),

    placeholder: (provided: any, state: any) => ({
      ...provided,
      color:
        state.isFocused || state.selectProps.menuIsOpen ? '#fff' : '#2A2626',
      padding: '0px 4px',
      transition: 'color 0.2s ease',
    }),

    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      color: state.selectProps.menuIsOpen ? '#fff' : '#2A2626',
      transition: 'color 0.2s ease',
      padding: '0px 4px',
    }),

    indicatorSeparator: (provided: any) => ({
      ...provided,
      display: 'none',
    }),

    option: (provided: any, state: any) => ({
      ...provided,
      fontSize: '12px',
      cursor: 'pointer',
      background: state.isSelected ? '#377CF6' : '#fff',
      color: provided.color,
      '&:hover': {
        background: state.isSelected ? '#377CF6' : '#DDEBFF',
      },
    }),

    singleValue: (provided: any, state: any) => ({
      ...provided,
      color: state.selectProps.menuIsOpen ? '#fff' : '#2A2626',
      transition: 'color 0.2s ease',
      fontWeight: '500',
      fontSize: '14px',
      lineHeight: '21px',
      marginLeft: '5px',
    }),

    menu: (provided: any) => ({
      ...provided,
      width: '100%',
      marginTop: '3px',
      borderRadius: '7px',
      padding: '0px 10px',
      fontWeight: '500',
      fontSize: '14px',
      lineHeight: '21px',
    }),

    menuList: (provided: any) => ({
      ...provided,
      '&::-webkit-scrollbar': {
        scrollbarWidth: 'thin',
        scrollBehavior: 'smooth',
        display: 'block',
        scrollbarColor: 'rgb(173, 173, 173) #fff',
        width: 8,
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgb(173, 173, 173)',
        borderRadius: '30px',
      },
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0px 3px',
    }),
  };

  return (
    <div className={styles2.header}>
      <nav className={styles.menuContainer}>
        <ul className={styles2.menuItems}>
          {['General', 'Structural', 'Adders', 'Other', 'Notes'].map((menu) => (
            <li
              key={menu}
              className={activeMenu === menu ? styles2.active : ''}
              onClick={() => handleMenuClick(menu)}
            >
              {menu}
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.headerLast}>
        {/* <div className='dropDownAndSelect'>
          <Select
          className={styles2.selectContainer}
            value={selectedOption}
            onChange={handleChange}
            options={options}
            styles={customStyles}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            placeholder="Rev.No:"
            classNamePrefix="select"
            isSearchable={false}
            getOptionLabel={(option) => option.label}
            formatOptionLabel={(option, { context }) =>
              context === 'value' ? `Rev.No: ${option.label}` : option.label
            }
          />
        </div> */}
        
      </div>
    </div>
  );
};

export default ResponsiveHeader;
