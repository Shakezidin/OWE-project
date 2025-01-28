import React, { useState } from 'react';
import { ICONS } from '../../../resources/icons/Icons';
import styles from '../styles/Header.module.css';
import { MdRefresh } from 'react-icons/md';
import Select from 'react-select';
import { ValueContainer } from 'react-select/dist/declarations/src/components/containers';

interface HeaderProps {
  onMenuSelect: (page: string) => void;
  setOpenRefresh: (open: boolean) => void;
}

const Header = ({ onMenuSelect, setOpenRefresh }: HeaderProps) => {
  const [activeMenu, setActiveMenu] = useState<string>('General');
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Menu click handler
  const handleMenuClick = (page: string) => {
    setActiveMenu(page);
    onMenuSelect(page);
  };

  // Handle option change for react-select
  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption); 
    setIsOpen(false);
  };

  // Inline styles
  const containerStyles = {
    marginBottom: '15px',
  };

  const labelStyles = {
    marginBottom: '5px',
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '18px',
    color: '#565656',
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      border: 'none',
      borderRadius: '50px',
      padding: '0px 4px',
      fontWeight:"500",
      fontSize:"14px",
      lineHeight:'21px',
      fontFamily: 'Poppins',
      minHeight: '36px',
      boxShadow: 'none',
      backgroundColor: state.selectProps.menuIsOpen ? '#2A2626' : 'transparent',
      cursor: 'pointer',
      color: state.isFocused || state.selectProps.menuIsOpen ? '#fff' : '#2A2626',
      '&:hover': {
        backgroundColor: 'rgba(42, 38, 38, 0.2)',
        color: '#fff'
      },
    }),
  
    placeholder: (provided: any, state: any) => ({
      ...provided,
      color: state.isFocused || state.selectProps.menuIsOpen ? '#fff' : '#2A2626',
      padding: '0px 4px',
      transition: 'color 0.2s ease',
    }),
  
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      color: state.selectProps.menuIsOpen ? '#fff' : '#2A2626',
      transition: 'color 0.2s ease',
      padding:'0px 4px'

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
      fontWeight:"500",
      fontSize:"14px",
      lineHeight:'21px'
    }),
  
    menu: (provided: any) => ({
      ...provided,
      width: '100%',
      marginTop: '3px',
      borderRadius: '7px',
      padding:'0px 10px',
      fontWeight:"500",
      fontSize:"14px",
      lineHeight:'21px'
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
    valueContainer:(provided:any)=>({
      ...provided,
      padding:'0px 3px',
    }),
  };
  
  
  

  // Options for react-select dropdown
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  return (
    <div className={styles.header}>
      <div>
        <img src={ICONS.logoDesignTool} alt="logo" />
      </div>

      <nav className={styles.menuContainer}>
        <ul className={styles.menuItems}>
          <li
            className={activeMenu === 'General' ? styles.active : ''}
            onClick={() => handleMenuClick('General')}
          >
            General
          </li>
          <li
            className={activeMenu === 'Structural' ? styles.active : ''}
            onClick={() => handleMenuClick('Structural')}
          >
            Structural
          </li>
          <li
            className={activeMenu === 'Adders' ? styles.active : ''}
            onClick={() => handleMenuClick('Adders')}
          >
            Adders
          </li>
          <li
            className={activeMenu === 'Other' ? styles.active : ''}
            onClick={() => handleMenuClick('Other')}
          >
            Other
          </li>
          <li
            className={activeMenu === 'Notes' ? styles.active : ''}
            onClick={() => handleMenuClick('Notes')}
          >
            Notes
          </li>
        </ul>
      </nav>

      <div className={styles.headerLast}>
        
        <div>
        <Select
  value={selectedOption}
  onChange={handleChange}
  options={options}
  styles={customStyles}
  onFocus={() => setIsOpen(true)}
  onBlur={() => setIsOpen(false)}
  placeholder="Revision number"
  classNamePrefix="select"
  isSearchable={false}
/>
        </div>
        <div className={styles.iconContainer} onClick={() => setOpenRefresh(true)}>
          <MdRefresh size={18} />
        </div>
      </div>
    </div>
  );
};

export default Header;
