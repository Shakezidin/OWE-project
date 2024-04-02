import React, { useEffect, useState } from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";
import { IoAddSharp } from "react-icons/io5";
import Select from "react-select";
import "./Filter.css";
import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";

import { ActionButton } from "../../../components/button/ActionButton";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import {
  installerOption,
  partnerOption,
} from "../../../../core/models/data_models/SelectDataModel";

type ButtonProps = {
  handleClose: () => void;
};

const FilterCommission = (props: ButtonProps) => {
  const handleFormChange = () => {};
  return (
    <div className="transparent-model">
      <div className="modal">
        {/* <div className="createUserCrossButton" onClick={props.handleClose}>
                    <CROSS_BUTTON />

                </div> */}
        <div className="createUserContainer">
          <div className="filter-section">
            <div className="apply">
              <p>Apply Filter</p>
            </div>
            <div className="iconsSection2">
              <button
                type="button"
                style={{
                  // background: "black",
                  color: "black",
                  border: "1px solid #9d9d9d",
                }}
                // onClick={onpressAddNew}
              >
                <IoAddSharp style={{ fontSize: "20px" }} /> Add New
              </button>
            </div>
          </div>
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel">Partner</label>
                  <div className="">
                    <Select
                      // options={partners}
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
                      // value={partners.find(
                      //   (option) => option.value === "Partners"
                      // )}
                    />
                  </div>
                </div>
                <div className="create-input-field">
                  <label className="inputLabel">Installer</label>
                  <div className="">
                    <Select
                      // options={installers}
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
                      // value={installers.find(
                      //   (option) => option.value === "installer"
                      // )}
                    />
                  </div>
                </div>

                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Sales Type"
                    value={""}
                    name=""
                    placeholder={"Sales Type"}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="createUserActionButton" style={{ gap: "2rem" }}>
            <ActionButton title={"Save"} type="submit" onClick={() => {}} />

            <ActionButton
              title={"cancel"}
              type="reset"
              onClick={props.handleClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterCommission;
