import { IoAddSharp } from "react-icons/io5";
import Select from "react-select";
import "../../create_profile/CreateUserProfile.css";
// import "../commissionRate/Filter.css";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";

import { useAppDispatch } from "../../../../redux/hooks";
import { fetchCommissions } from "../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice";
import { ICONS } from "../../../icons/Icons";
import CustomAlert from "./CustomAlert";
import {
  getLabelForOperation,
  getOperationsForColumnType,
} from "../../../../core/models/data_models/FilterSelectModel";
import { useState } from "react";
import OperationSelect from "./OperationSelect";
interface Column {
  name: string;
  displayName: string;
  type: string;
}
interface TableProps {
  handleClose: () => void;
  columns: Column[];
  page_number: number;
  page_size: number;
}
interface FilterModel {
  Column: string;
  Operation: string;
  Data: string;
}
interface Option {
  value: string;
  label: string;
}

interface ErrorState {
  [key: string]: string;
}
// Filter component
const FilterCommission: React.FC<TableProps> = ({
  handleClose,
  columns,
  page_number,
  page_size,
}) => {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<FilterModel[]>([
    { Column: "", Operation: "", Data: "" },
  ]);
  const [errors, setErrors] = useState<ErrorState>({});
  const options: Option[] = columns.map((column) => ({
    value: column.name,
    label: column.displayName,
  }));

  const handleAddRow = () => {
    setFilters([...filters, { Column: "", Operation: "", Data: "" }]);
    setErrors({});
  };

  const handleRemoveRow = (index: number) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  };

  const handleChange = (
    index: number,
    field: keyof FilterModel,
    value: any
  ) => {
    const newRules = [...filters];
    newRules[index][field] = value;
    newRules[index].Data = "";
    setFilters(newRules);
  };
  const handleDataChange = (index: number, value: string) => {
    const newFilters = [...filters];
    // Convert ".1" to "0.1" if the column is "rate" or "rate list"
    if (
      newFilters[index].Column === "rate" ||
      newFilters[index].Column === "rl"
    ) {
      value = value.replace(/^(\.)(\d+)/, "0$1$2");
    }
    newFilters[index].Data = value;
    setFilters(newFilters);
  };
  const getInputType = (columnName: string) => {
    if (columnName === "rate" || columnName === "rl") {
      return "number";
    } else if (columnName === "start_date" || columnName === "end_date") {
      return "date";
    } else {
      return "text";
    }
  };

  const resetAllFilter=()=>{
    setFilters([]);
  }

  const applyFilter = async () => {
    setErrors({});
    if (
      filters.some((filter) => !filter.Column || filter.Column === "Select")
    ) {
      console.log(
        "Column not selected or 'Select' chosen. Skipping validation and API call."
      );
      return;
    }
    // Perform validation
    const newErrors: ErrorState = {};

    filters.forEach((filter, index) => {
      if (!filter.Operation) {
        newErrors[`operation${index}`] = `Please provide Operation`;
      }
      if (!filter.Data) {
        newErrors[`data${index}`] = `Please provide Data`;
      }
    });

    // Update state with new errors
    setErrors(newErrors);

    // If no errors, proceed with API call
    if (Object.keys(newErrors).length === 0) {
      const formattedFilters = filters.map((filter) => ({
        Column: filter.Column,
        Operation: filter.Operation,
        Data: filter.Data,
      }));
      console.log(formattedFilters);
      const req = {
        page_number: page_number,
        page_size: page_size,
        filters: formattedFilters,
      };
      dispatch(fetchCommissions(req));
      // handleClose()
    }
  };

  console.log(errors);
  return (
    <div className="transparent-model">
      <div className="modal">
      <div className="filter-section">
          <h3 className="createProfileText">Filter</h3>
          <div className="iconsSection2">
            <button
            
              type="button"
              style={{
                background: "white",
                color: "black",
                border: "1px solid #ACACAC",
              }}
              onClick={handleAddRow}
            >
              <img
                src={ICONS.BlackAddIcon}
                alt=""
                style={{ width: "14px", height: "14px" }}
              />
              Add New
            </button>
          </div>
        </div>
        <div className="modal-content">
          <div className="scroll-content">
          <div className="scroll-flex">
            <div className="createProfileInputView">
              <div className="createProfileTextView">
                {filters?.map((filter, index) => (
                  <div className="create-input-container" key={index}>
                    <div className="create-input-field">
                      <label className="inputLabel">Column Name</label>
                      <div className="">
                        <Select
                          options={[
                            { value: "Select", label: "Select" },
                            ...options,
                          ]}
                          isSearchable
                          value={
                            options.find(
                              (option) => option.value === filter.Column
                            ) || null
                          }
                          onChange={(selectedOption: any) => {
                            handleChange(index, "Column", selectedOption.value);
                            setErrors({ ...errors, [`column${index}`]: "" });
                          }}
                          styles={{
                            control: (baseStyles, state) => ({
                              ...baseStyles,
                              marginTop: "4.5px",
                              borderRadius: "8px",
                              outline: "none",
                              height: "2.25rem",
                              fontSize:"13px",
                              border: "1px solid #d0d5dd",
                              overflowY: "auto",
                            }),
                          }}
                        />
                      </div>
                    </div>
                    <div className="create-input-field">
                      <label className="inputLabel">Operation</label>
                      <OperationSelect
                        options={options}
                        columnType={
                          columns.find(
                            (option) => option.name === filter.Column
                          )?.type || ""
                        }
                        value={filter.Operation}
                        onChange={(value: any) => {
                          handleChange(index, "Operation", value);
                          setErrors({ ...errors, [`operation${index}`]: "" });
                        }}
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
                        onChange={(e) => {
                          handleDataChange(index, e.target.value);
                          setErrors({ ...errors, [`data${index}`]: "" });
                        }}
                        placeholder={"Enter"}
                      />
                      {errors[`data${index}`] && (
                        <span style={{ color: "red", fontSize: "12px" }}>
                          {errors[`data${index}`]}
                        </span>
                      )}
                    </div>
               <div
                  className="cross-btn"
                  onClick={() => handleRemoveRow(index)}
                >
                  <img src={ICONS.cross} alt="" />
                </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="createUserActionButton">
              <div className="" style={{ gap: "2rem", display: "flex" }}>
                <ActionButton
                  title={"Cancel"}
                  type="reset"
                  onClick={handleClose}
                />
                 <ActionButton
                  title={"reset"}
                  type="reset"
                  onClick={resetAllFilter}
                />
                <ActionButton
                  title={"Apply"}
                  type="submit"
                  onClick={() => applyFilter()}
                />
                 <ActionButton
                  title={"Reset"}
                  type="reset"
                  onClick={handleClose}
                />
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    

    </div>
  );
};
export default FilterCommission;
