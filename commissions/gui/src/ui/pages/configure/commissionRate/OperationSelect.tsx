// OperationSelect.tsx
import React from "react";
import Select from "react-select";
import { Option, getOperationsForColumnType } from "../../../../core/models/data_models/FilterSelectModel";


const OperationSelect: React.FC<{
  options: Option[];
  columnType: string;
  value: string;
  onChange: (value: string) => void;
  errors: Record<string, string>;
  index: number;
}> = ({ options, columnType, value, onChange, errors, index }) => {
    
  const operations = getOperationsForColumnType(columnType);
  const getLabelForOperation = (value: string) => {
    switch (value) {
      case 'eqs':
        return 'Equals';
      case 'stw':
        return 'Start With';
      case 'edw':
        return 'End With';
      case 'cont':
        return 'Contains';
      case 'grt':
        return 'Greater Than';
      case 'grteqs':
        return 'Greater Than Equals To';
      case 'lst':
        return 'Less Than';
      case 'lsteqs':
        return 'Less Than Equals To';
      default:
        return value;
    }
  };
  return (
    <div className="">
      <Select
         options={operations.map(operation => ({ value: operation.value, label: getLabelForOperation(operation.value) }))}
         value={{ value, label: getLabelForOperation(value) }}
     
        onChange={(selectedOption: any) => {
          onChange(selectedOption.value);
        }}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            marginTop: "4.5px",
            borderRadius: "8px",
            outline: "none",
            height: "2.8rem",
            border: "1px solid #d0d5dd",
          }),
        }}
      />
      {errors[`operation${index}`] && <span style={{ color: "red", fontSize: "12px" }}>{errors[`operation${index}`]}</span>}
    </div>
  );
};

export default OperationSelect;
