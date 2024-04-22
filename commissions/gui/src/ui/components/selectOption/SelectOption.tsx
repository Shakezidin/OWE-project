// SelectComponent.tsx
import React from 'react';
import Select from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  value: Option | undefined;
  onChange: (newValue: Option | null) => void;
}

const SelectOption: React.FC<Props> = ({ options, value, onChange }) => {
  return (
    <Select
      options={options}
      isSearchable
      onChange={onChange}
      value={value}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          marginTop: "4px",
          borderRadius: "8px",
          outline: "none",
          fontSize: "13px",
          height: "2.2rem",
          border: "1px solid #d0d5dd",
        }),
        indicatorSeparator: () => ({
          display: "none",
        }),
        option: (baseStyles) => ({
          ...baseStyles,
          fontSize: "13px",
        }),
       
        // menu:()=>({
        //   fontSize:"13px"
        // })
      }}
    />
  );
};

export default SelectOption;
