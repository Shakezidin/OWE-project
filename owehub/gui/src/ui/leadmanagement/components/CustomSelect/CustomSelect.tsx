import React from 'react';
import Select, { SingleValue, ActionMeta } from 'react-select';
import { DateRangeWithLabel } from '../../LeadManagementDashboard';

interface CustomSelectProps {
  value: DateRangeWithLabel | null;
  onChange: (newValue: SingleValue<DateRangeWithLabel>, actionMeta: ActionMeta<DateRangeWithLabel>) => void;
  options: DateRangeWithLabel[];
  isToggledX: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options, isToggledX }) => {
  const customStyles = {
    control: (baseStyles: any, state: any) => ({
      ...baseStyles,
      marginTop: 'px',
      borderRadius: '8px',
      outline: 'none',
      color: '#3E3E3E',
      width: '140px',
      height: '36px',
      fontSize: '12px',
      border: '1.2px solid black',
      fontWeight: '500',
      cursor: 'pointer',
      alignContent: 'center',
      backgroundColor: '#fffff',
      boxShadow: 'none',
      '@media only screen and (max-width: 767px)': {
        height: '30px !important',
        width: 'fit-content',
        border: '1px solid ',
      },
      '&:focus-within': {
        borderColor: '#377CF6',
        boxShadow: '0 0 0 0.3px #377CF6',
        caretColor: '#3E3E3E',
        '& .css-kofgz1-singleValue': {
          color: '#377CF6',
        },
        '& .css-tj5bde-Svg': {
          color: state.menuIsOpen ? '#377CF6' : "#000",
        },
      },
      '&:hover': {
        borderColor: '#377CF6',
        boxShadow: '0 0 0 0.3px #377CF6',
        '& .css-kofgz1-singleValue': {
          color: '#377CF6',
        },
        '& .css-tj5bde-Svg': {
          color: '#377CF6',
        },
      },
    }),
    placeholder: (baseStyles: any) => ({
      ...baseStyles,
      color: '#3E3E3E',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (baseStyles: any, state: any) => ({
      ...baseStyles,
      transform: state.isFocused ? 'rotate(180deg)' : 'none',
      transition: 'transform 0.3s ease',
      color: '#3E3E3E',
      '&:hover': {
        color: '#3E3E3E',
      },
    }),
    option: (baseStyles: any, state: any) => ({
      ...baseStyles,
      fontSize: '13px',
      color: '#3E3E3E',
      backgroundColor: state.isSelected ? '#fffff' : '#fffff',
      '&:hover': {
        backgroundColor: state.isSelected ? '#ddebff' : '#ddebff',
      },
      cursor: 'pointer',
      fontWeight: "400",
    }),
    singleValue: (baseStyles: any) => ({
      ...baseStyles,
      color: '#3E3E3E',
    }),
    menu: (baseStyles: any) => ({
      ...baseStyles,
      width: '140px',
      border: '0.7px solid black',
      marginTop: '3px',
    }),
  };

  if (!isToggledX) {
    return null;
  }

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      styles={customStyles}
    />
  );
};

export default CustomSelect;