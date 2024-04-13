// FilterRow.tsx
import React from "react";
import Select from "react-select";
import Input from "../../../components/text_input/Input";

import { ICONS } from "../../../icons/Icons";
import { Column, FilterModel, Option, getInputType } from "../../../../core/models/data_models/FilterSelectModel";
import OperationSelect from "./OperationSelect";

const FilterRow: React.FC<{
  index: number;
  options: Option[];
  columns: Column[];
  filter: FilterModel;
  onChange: (index: number, field: keyof FilterModel, value: string) => void;
  onRemove: (index: number) => void;
  errors: Record<string, string>;
}> = ({ index, options, filter, onChange, onRemove, errors,columns }) => {
  return (
    <div className="create-input-container">
      <div className="create-input-field">
        <label className="inputLabel">Column Name</label>
        <div className="">
          <Select
            options={[{ value: 'Select', label: 'Select' }, ...options]}
            isSearchable
            value={options.find(option => option.value === filter.Column) || null}
            onChange={(selectedOption: any) => {
              onChange(index, 'Column', selectedOption.value);
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
        </div>
      </div>
      <div className="create-input-field">
        <label className="inputLabel">Operation</label>
        <OperationSelect
          options={options}
          columnType={columns.find(option => option.name === filter.Column)?.type || ''}
          value={filter.Operation}
          onChange={(value) => onChange(index, 'Operation', value)}
          errors={errors}
          index={index}
        />
      </div>
      <div className="create-input-field">
        <Input
          type={getInputType(filter.Column)}
          label="Data"
          name="Data"
          value={filter.Data}
          onChange={(e) => onChange(index, 'Data', e.target.value)}
          placeholder="Enter"
        />
        {errors[`data${index}`] && <span style={{ color: "red", fontSize: "12px" }}>{errors[`data${index}`]}</span>}
      </div>
      <div className="cross-btn" onClick={() => onRemove(index)}>
        <img src={ICONS.cross} alt="" />
      </div>
    </div>
  );
};

export default FilterRow;
