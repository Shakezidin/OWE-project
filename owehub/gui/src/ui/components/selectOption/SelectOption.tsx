// SelectComponent.tsx
import React, { useEffect, useRef } from 'react';
import Select, { CSSObjectWithLabel } from 'react-select';
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
}) => {
  const scrollRef = useRef(null);
  useEffect(() => {
    console.log(scrollRef.current, 'select');
  }, [scrollRef]);
  return (
    <div className="select-container">
      {/* {label && <label className="inputLabel">{label}</label>} */}
      <Select
        options={options}
        isSearchable
        // className='dropdown'
        onChange={onChange}
        placeholder="Select"
        ref={scrollRef}
        value={value ? value : { label: 'Select', value: 'Select' }}
        isDisabled={disabled}
        styles={{
          control: (baseStyles, state: any) => ({
            ...baseStyles,
            marginTop: '25px',
            borderRadius: '8px',
            outline: 'none',
            fontSize: '13px',
            height: '2.25rem',
            border: '1px solid #d0d5dd',
            cursor: 'pointer',
            ...controlStyles,
          }),

          indicatorSeparator: () => ({
            display: 'none',
          }),
          option: (baseStyles, state) => ({
            ...baseStyles,
            fontSize: '13px',
            cursor: 'pointer',
            background: state.isSelected ? '#377CF6' : '#fff',
          }),
          menu: (base) => ({
            ...base,
            zIndex: 999,
            ...menuStyles,
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
