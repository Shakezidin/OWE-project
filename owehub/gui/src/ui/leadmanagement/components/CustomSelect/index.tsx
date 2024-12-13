import React from 'react';
import Select, { SingleValue, ActionMeta } from 'react-select';

interface CustomSelectProps<T> {
  value: T | null;
  onChange: (newValue: T | null) => void;
  options: T[];
  isVisible?: boolean;
  placeholder?: string;
  isDisabled?: boolean;
  width?: string;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string;
}

const CustomSelect = <T,>({
  value,
  onChange,
  options,
  isVisible,
  placeholder,
  isDisabled = false,
  width = '140px',
  getOptionLabel = (option: any) => option.label || option.name || '',
  getOptionValue = (option: any) => option.id?.toString() || option.value || ''
}: CustomSelectProps<T>) => {
  const customStyles = {
    control: (baseStyles: any, state: any) => ({
      ...baseStyles,
      marginTop: '2px',
      borderRadius: '8px',
      outline: 'none',
      color: '#3E3E3E',
      width: width,
      height: '36px',
      fontSize: '12px',
      border: '1.2px solid black',
      fontWeight: '500',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      alignContent: 'center',
      backgroundColor: isDisabled ? '#f5f5f5' : '#ffffff',
      boxShadow: 'none',
      opacity: isDisabled ? 0.6 : 1,
      '@media only screen and (max-width: 767px)': {
        height: '30px !important',
        width: 'fit-content',
        border: '1px solid ',
      },
      '&:focus-within': {
        borderColor: '#377CF6',
        boxShadow: '0 0 0 0.3px #377CF6',
        caretColor: '#3E3E3E',
        '& [class*="singleValue"]': {
          color: '#377CF6',
        },
        '& [class*="Svg"]': {
          color: '#377CF6',
        },
        '& [class*="placeholder"]': {
          color: '#377CF6',
        },
        '& [class*="indicatorContainer"]': {
          color: '#377CF6',
        }
      },
      '&:hover': {
        borderColor: isDisabled ? 'black' : '#377CF6',
        boxShadow: isDisabled ? 'none' : '0 0 0 0.3px #377CF6',
        '& [class*="singleValue"]': {
          color: '#377CF6',
        },
        '& [class*="Svg"]': {
          color: '#377CF6',
        },
        '& [class*="placeholder"]': {
          color: '#377CF6',
        },
        '& [class*="indicatorContainer"]': {
          color: '#377CF6',
        }
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
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'none',
      transition: 'transform 0.3s ease',
      color: '#3E3E3E',

      '&:hover': {
        color: isDisabled ? '#3E3E3E' : '#377CF6',
      },
    }),
    option: (baseStyles: any, state: any) => ({
      ...baseStyles,
      fontSize: '13px',
      color: '#3E3E3E',
      backgroundColor: state.isSelected ? '#ddebff' : '#ffffff',
      '&:hover': {
        backgroundColor: '#ddebff',
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
      width: width,
      border: '0.7px solid black',
      marginTop: '3px',
      zIndex: 1000,
    }),
    menuList: (base: any) => ({
      ...base,
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
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Select
      value={value}
      onChange={(newValue) => onChange(newValue as T)}
      options={options}
      styles={customStyles}
      placeholder={placeholder}
      isDisabled={isDisabled}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
    />
  );
};

export default CustomSelect;