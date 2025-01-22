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
      padding: '3px 6px',
      fontSize: '12px',
      fontWeight:'500',
      lineHeight:'18px',
      fontFamily:'poppins',
      minHeight: '36px',
      boxShadow: 'none',
      backgroundColor:'#F5F5FD'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: '#333',
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      display: 'none',
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '4px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '5px 0',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#4CAF50' : 'transparent',
      color: state.isSelected ? '#fff' : '#333',
      padding: '8px 12px',
      cursor: 'pointer',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#333',
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#888',
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
