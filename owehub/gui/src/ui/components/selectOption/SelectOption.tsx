// SelectComponent.tsx
import React, { useEffect, useRef } from 'react';
import Select from 'react-select';
import "./drop.css"
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
  const scrollRef = useRef(null)
  useEffect(()=>{
console.log(scrollRef.current,"select");

  },[scrollRef])
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
      value={value ? value: {label:'Select',value:'Select'} }
      styles={{
        control: (baseStyles:any, state:any) => ({
          ...baseStyles,
          marginTop: "20px",
          borderRadius: "8px",
          outline: "none",
          fontSize: "13px",
          height: "2.25rem",
          border: "1px solid #d0d5dd",
          cursor: "pointer"
        }),
        indicatorSeparator: () => ({
          display: "none",
        }),
        option: (baseStyles) => ({
          ...baseStyles,
          fontSize: "13px",
        }),
       menu:(base)=>({
        ...base,
        zIndex:999,
        
       }),
       menuList:(base)=>({
        ...base,
        "&::-webkit-scrollbar":{
          "scrollbarWidth":"thin",
          "scrollBehavior": "smooth",
          "display":"block",
          "scrollbarColor":  "rgb(173, 173, 173) #fff",
          width:8
        },
        "&::-webkit-scrollbar-thumb":{
          background:"rgb(173, 173, 173)",
          borderRadius:"30px"
        }
       })
      }}
    />
   </div>
  );
};

export default SelectOption;
