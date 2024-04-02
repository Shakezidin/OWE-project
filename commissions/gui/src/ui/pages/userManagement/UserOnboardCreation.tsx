import React from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../resources/assets/cross_button.svg";

import Input from "../../components/text_input/Input";

import DropdownButton from "../../components/dropdown/DropdownButton";
import { ActionButton } from "../../components/button/ActionButton";
import Select from 'react-select';
type ButtonProps = {
  handleClose: () => void;
};

const UserOnboardCreation = (props: ButtonProps) => {
  const handleFormChange = () => {};
  return (
    <div className="transparent-model">
      <div className="modal">
        <div className="createUserCrossButton" onClick={props.handleClose}>
          <CROSS_BUTTON />
        </div>
        <div className="createUserContainer">
          <h3 className="createProfileText">Onboarding</h3>
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="First Name"
                    value={""}
                    placeholder={"Enter Name"}
                    onChange={() => {}}
                    name={""}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Last Name"
                    value={""}
                    placeholder={"Enter"}
                    onChange={() => {}}
                    name={""}
                  />
                </div>
                <div className="create-input-field">
                    <label className="inputLabel">Role</label>
                    <Select
                      // options={}
                      isSearchable
                      // onChange={(newValue) => handleChange(newValue, 'partner')}
                      // value={partnerOption(newFormData)?.find((option) => option?.value === createCommission.partner)}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          marginTop: "4.5px",
                          borderRadius: "8px",
                          outline: "none",
                          height: "2.8rem",
                          border: "1px solid #d0d5dd"

                        }),
                      }}
                    />
                  </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Email ID"
                    value={""}
                    placeholder={"email@mymail.com"}
                    onChange={() => {}}
                    name={""}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Phone Number"
                    value={""}
                    placeholder={"Phone Number"}
                    onChange={() => {}}
                    name={""}
                  />
                </div>
                <div className="create-input-field">
                    <label className="inputLabel">Dealer Owner</label>
                    <Select
                      // options={}
                      isSearchable
                      // onChange={(newValue) => handleChange(newValue, 'partner')}
                      // value={partnerOption(newFormData)?.find((option) => option?.value === createCommission.partner)}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          marginTop: "4.5px",
                          borderRadius: "8px",
                          outline: "none",
                          height: "2.8rem",
                          border: "1px solid #d0d5dd"

                        }),
                      }}
                    />
                  </div>
              </div>
              <div className="create-input-field-note">
                                    <label htmlFor="" className="inputLabel">Description</label> <br />
                                   <textarea name="description" id="" rows={3}
                                  // onChange={(e) => handlemarketingInputChange(e)}
                                    // value={createMarketing.description}
                                     placeholder="Type"></textarea>
                                </div>
            </div>

            <div className="createUserActionButton">
              <ActionButton
                title={"Cancel"}
                
                onClick={() => {}}
                type={"button"}
              />
              <ActionButton  title={"Save"} onClick={() => {}} type={"button"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOnboardCreation;
