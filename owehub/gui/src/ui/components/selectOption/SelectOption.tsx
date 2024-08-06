// SelectComponent.tsx
import React, { useEffect, useRef } from 'react';
import Select, { CSSObjectWithLabel, MenuPosition } from 'react-select';
import './drop.css';
interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  value: Option | undefined;
  onChange: (newValue: Option | null) => void;
  menuListStyles?: CSSObjectWithLabel;
  disabled?: boolean;
  controlStyles?: CSSObjectWithLabel;
  singleValueStyles?: CSSObjectWithLabel;
  valueContainerStyles?: CSSObjectWithLabel;
  menuStyles?: CSSObjectWithLabel;
  dropdownIndicatorStyles?: CSSObjectWithLabel;
  marginTop?: string | number;
  labelColor?: string;
  width?: string; // Add width prop
  placeholder?: string; // Add placeholder prop
  menuWidth?: string;
  menuPosition?: MenuPosition | undefined;
  enableHoverEffect?: boolean;

}


const SelectOption: React.FC<Props> = ({
  options,
  value,
  onChange,
  menuListStyles = {},
  disabled = false,
  controlStyles = {},
  singleValueStyles = {},
  valueContainerStyles = {},
  menuStyles = {},
  dropdownIndicatorStyles = {},
  marginTop = '25px',
  width,
  labelColor,
  placeholder,
  menuWidth,
  menuPosition = "fixed",
  enableHoverEffect = true,
}) => {
  const scrollRef = useRef(null);

  return (
    <div className="select-container">
      {/* {label && <label className="inputLabel">{label}</label>} */}
      <Select
        options={options}
        isSearchable
        menuPosition={menuPosition}
        onChange={onChange}
        placeholder={placeholder || 'Select'} // Pass the placeholder prop here
        ref={scrollRef}
        value={value || { label: placeholder || 'Select', value: '' }}
        isDisabled={disabled}
        styles={{
          control: (baseStyles, state: any) => ({
            ...baseStyles,
            marginTop: marginTop,
            borderRadius: '8px',
            outline: 'none',
            fontSize: '13px',
            height: '2.25rem',
            border: '1px solid #d0d5dd',
            cursor: 'pointer',
            boxShadow: 'none',
            width: width || baseStyles.width,
            ...controlStyles,
            transition: 'border-color 0.3s ease', // Modify this line
            '&:hover': enableHoverEffect ? {
              border: '2px solid #0493ce'
            } : {},
          }),
          indicatorSeparator: () => ({
            display: 'none',
          }),
          option: (baseStyles, state) => ({
            ...baseStyles,
            fontSize: '13px',
            cursor: 'pointer',
            background: state.isSelected ? '#377CF6' : '#fff',
            color: labelColor || baseStyles.color,
            '&:hover': {
              background: state.isSelected ? '#377CF6' : '#DDEBFF',
            },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 99,
            ...menuStyles,
            width: menuWidth || base.width,
          }),
          menuList: (base) => ({
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
            ...menuListStyles,
          }),
          singleValue: (base, state) => ({
            ...base,
            color: value ? undefined : '#8b8484',
            ...singleValueStyles,
          }),
          valueContainer: (base) => ({
            ...base,
            ...valueContainerStyles,
          }),
          dropdownIndicator: (base) => ({
            ...base,
            ...dropdownIndicatorStyles,
          }),
          placeholder: (base) => ({
            ...base,
            color: '#8b8484',
          }),
        }}
      />
    </div>
  );
};

export default SelectOption;
