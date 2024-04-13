// FilterCommission.tsx
import React, { useState } from "react";
import Select from "react-select";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import CustomAlert from "./CustomAlert";

import FilterRow from "./FilterRow";
import OperationSelect from "./OperationSelect";
import { ICONS } from "../../../icons/Icons";
import { Column, FilterModel, Option } from "../../../../core/models/data_models/FilterSelectModel";
import { IoAddSharp } from "react-icons/io5";


interface TableProps {
  handleClose: () => void;
  columns: Column[];
  page_number: number;
  page_size: number;
}



const FilterCommission: React.FC<TableProps> = ({ handleClose, columns, page_number, page_size }) => {
  const [filters, setFilters] = useState<FilterModel[]>([{ Column: "", Operation: "", Data: "" }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const options: Option[] = columns.map((column) => ({ value: column.name, label: column.displayName }));

  const handleAddRow = () => {
    setFilters([...filters, { Column: '', Operation: '', Data: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    setFilters(filters.filter((_, idx) => idx !== index));
  };

  const handleChange = (index: number, field: keyof FilterModel, value: string) => {
    const newRules = [...filters];
    newRules[index][field] = value;
    setFilters(newRules);
    setErrors({ ...errors, [`${field}${index}`]: '' });
  };

  const applyFilter = async () => {
    setErrors({});
    if (filters.some((filter) => !filter.Column || filter.Column === 'Select')) {
      console.log("Column not selected or 'Select' chosen. Skipping validation and API call.");
      return;
    }

    const newErrors: Record<string, string> = {};
    filters.forEach((filter, index) => {
      if (!filter.Operation) {
        newErrors[`operation${index}`] = `Please provide Operation`;
      }
      if (!filter.Data) {
        newErrors[`data${index}`] = `Please provide Data`;
      }
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const formattedFilters = filters.map(filter => ({ ...filter, Data: filter.Data.trim() }));
      console.log(formattedFilters)
      const req = {
        page_number: page_number,
        page_size: page_size,
        filters: formattedFilters
      };
      // dispatch(fetchCommissions(req)); // Assuming this is the API call
    }
  };

  return (
    <div className="transparent-model">
      <div className="filter-modal">
        <div className="createUserContainer">
          <div className="filter-section">
            <h3 className="createProfileText">Filter</h3>
            <div className="iconsSection2">
              <button
                type="button"
                style={{
                  color: "black",
                  border: "1px solid #ACACAC",
                }}
                onClick={handleAddRow}
              >
                <IoAddSharp /> Add New
              </button>
            </div>
          </div>
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              {filters?.map((filter, index) => (
                <FilterRow
                  key={index}
                  index={index}
                  options={options}
                  filter={filter}
                  onChange={handleChange}
                  onRemove={handleRemoveRow}
                  errors={errors}
                  columns={columns}
                />
              ))}
            </div>
          </div>
          <div className="createUserActionButton" >
            <div className="" style={{ gap: "2rem", display: "flex", marginTop: "14rem" }}>
              <ActionButton title="Apply" type="submit" onClick={applyFilter} />
              <ActionButton title="Cancel" type="reset" onClick={handleClose} />
            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default FilterCommission;
