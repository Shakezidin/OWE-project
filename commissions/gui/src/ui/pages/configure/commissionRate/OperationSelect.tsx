// OperationSelect.tsx
import React from "react";
import Select from "react-select";
import { getLabelForOperation, getOperationsForColumnType, optionOperation } from "../../../../core/models/data_models/FilterSelectModel";


const OperationSelect: React.FC<{
  options: optionOperation[];
  columnType: string;
  value: string;
  onChange: (value: string) => void;
  errors: Record<string, string>;
  index: number;
}> = ({ options, columnType, value, onChange, errors, index }) => {
    
  const operations = getOperationsForColumnType(columnType);

  return (
    <div className="">
      <Select
         options={operations}
         value={operations.find(el=>el.value===value)}
     
        onChange={(selectedOption: any) => {
          onChange(selectedOption.value);
        }}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            marginTop: "4.5px",
            borderRadius: "8px",
            outline: "none",
            fontSize:"13px",
            height: "2.25rem",
            border: "1px solid #d0d5dd",
          }),
          indicatorSeparator: () => ({
            display: 'none' // Hide the indicator separator
          }),
        }}
      />
      {errors[`operation${index}`] && <span style={{ color: "red", fontSize: "12px" }}>{errors[`operation${index}`]}</span>}
    </div>
  );
};

export default OperationSelect;
