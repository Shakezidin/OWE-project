import React from 'react';
import {
  getOperationsForColumnType,
  getOperationsForPipelineColumnType,
  optionOperation,
} from '../../../core/models/data_models/FilterSelectModel';
import SelectOption from '../selectOption/SelectOption';

const OperationSelect: React.FC<{
  options: optionOperation[];
  columnType: string;
  value: string;
  onChange: (value: string) => void;
  errors: Record<string, string>;
  index: number;
  isNew?: boolean;
}> = ({isNew, options, columnType, value, onChange, errors, index }) => {
  const operations = isNew ? getOperationsForPipelineColumnType(columnType) : getOperationsForColumnType(columnType);

  return (
    <div className="">
      <SelectOption
        options={operations}
        value={operations.find((el) => el.value === value)}
        onChange={(selectedOption: any) => {
          onChange(selectedOption.value);
        }}
      />
      {errors[`operation${index}`] && (
        <span style={{ color: 'red', fontSize: '12px' }}>
          {errors[`operation${index}`]}
        </span>
      )}
    </div>
  );
};

export default OperationSelect;
