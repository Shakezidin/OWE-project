import React, { useState } from 'react';
import Select from 'react-select';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
}

const CustomSelect: React.FC<SelectProps> = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle option change
  const handleChange = (selectedOption: any) => {
    onChange(selectedOption.value);
    setIsOpen(false); // Close the dropdown when an option is selected
  };

  // Inline styles
  const containerStyles = {
    marginBottom: '15px',
  };

  const labelStyles = {
    marginBottom: '5px',
    fontSize:'12px',
    fontWeight:'400',
    lineHeight:'18px',
    color:'#565656'
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      border: 'none',
      borderRadius: '50px',
      padding: '0px 4px',
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: '18px',
      fontFamily: 'Poppins',
      minHeight: '36px',
      boxShadow: 'none',
      backgroundColor: '#F5F5FD',
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: '#333',
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
      color: '#3E3E3E',
    }),
    menu: (provided: any) => ({
      ...provided,
      width: '100%',
      marginTop: '3px',
    //   border: '1px solid #000000',
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
    placeholder: (provided: any) => ({
      ...provided,
      color: '#888',
      padding: '0px 4px',
    }),
  };
  

  return (
    <div style={containerStyles}>
      <label htmlFor={label} style={labelStyles}>
        {label}
      </label>
      <Select
        id={label}
        value={options.find((option) => option.value === value)}
        onChange={handleChange}
        options={options}
        styles={customStyles}
        onFocus={() => setIsOpen(true)} // Open when focused
        onBlur={() => setIsOpen(false)} // Close when blurred
      />
    </div>
  );
};

export default CustomSelect;
