// SelectComponent.tsx
import React, { useEffect, useRef } from 'react';
import Select from 'react-select';
import "./dropd.css"
interface Option {
  value: string;
  label: string;
}


interface Props {
  options: Option[];
  value: Option | undefined;
  onChange: (newValue: Option | null) => void;
}

const Drop: React.FC<Props> = ({ options, value, onChange }) => {
  const scrollRef = useRef(null)
  useEffect(()=>{
console.log(scrollRef.current,"select");

  },[scrollRef])
  return (
   <div className="drop-container">
     <Select
      options={options}
      isSearchable
      className='dropdown'
      onChange={onChange}
      placeholder="Select"
      ref={scrollRef}
      value={value ? value: {label:'Select',value:'Select'} }
      styles={{
        control: (baseStyles, state) => ({
            ...baseStyles,
            fontSize: "13px",
            fontWeight: "500",
            borderRadius: ".40rem",
            border: "none",
            outline: "none",
            width: "6rem",
            minHeight: "unset",
            height: "30px",
            alignContent: "center",
            backgroundColor: "#ECECEC",
          }),
          indicatorSeparator: () => ({
            display: "none",
          }),
          option: (baseStyles) => ({
            ...baseStyles,
            fontSize: "13px",
          }),
      }}
    />
   </div>
  );
};

export default Drop;
