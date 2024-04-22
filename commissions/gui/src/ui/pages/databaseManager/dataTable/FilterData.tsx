import React from "react";
import { IoAddSharp } from "react-icons/io5";
import Select from "react-select";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { ICONS } from "../../../icons/Icons";

interface FilterDataProps {
  handleClose: () => void;
}

// Filter component
const FilterData: React.FC<FilterDataProps> = ({ handleClose }) => {
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
                onClick={handleClose}
              >
                <IoAddSharp /> Add New
              </button>
            </div>
          </div>
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel">Column Name</label>
                  <div className="">
                    <Select
                      options={[{ value: "Select", label: "Select" }]}
                      isSearchable
                      value={null}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          marginTop: "4.5px",
                          borderRadius: "8px",
                          outline: "none",
                          height: "2.8rem",
                          border: "1px solid #d0d5dd",
                          overflowY: "auto",
                        }),
                      }}
                    />
                  </div>
                </div>
                <div className="create-input-field">
                  <label className="inputLabel">Operation</label>
                  {/* OperationSelect component goes here */}
                </div>
                <div className="create-input-field">
                  {/* <Input
                    type="text"
                    label="Data"
                    name="Data"
                    placeholder="Enter"
                  /> */}

                  {/* Error message for data input goes here */}
                </div>
                <div className="cross-btn">
                  <img src={ICONS.cross} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="createUserActionButton">
            <div className="" style={{ gap: "2rem", display: "flex" }}>
              <ActionButton title={"Apply"} type="submit" onClick={() => {}} />
              <ActionButton title={"cancel"} type="reset" onClick={handleClose} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterData;
