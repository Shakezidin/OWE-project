import React from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../resources/assets/cross_button.svg";

import Input from "../../components/text_input/Input";

import DropdownButton from "../../components/dropdown/DropdownButton";
import { ActionButton } from "../../components/button/ActionButton";

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
                  <DropdownButton
                    id="selectField1"
                    label="Role"
                    value={""}
                    options={[
                      "Select Role",
                      "Dealer Owner",
                      "Regional Manger",
                      "Sales Manager",
                      "Sales Representative",
                      "Admin",
                    ]}
                    onChange={handleFormChange}
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
                  <DropdownButton
                    id="selectField1"
                    label="Dealer Owner"
                    value={""}
                    options={["Select Owner", "Owner One", "Owner Two"]}
                    onChange={handleFormChange}
                  />
                </div>
              </div>
            </div>

            <div className="textarea">
              <label>Description</label>
              <textarea placeholder="Implementing solar system commission "></textarea>
            </div>

            <div className="createUserActionButton">
              <ActionButton
                title={"Cancel"}
                onClick={() => {}}
                type={"button"}
              />
              <ActionButton title={"Save"} onClick={() => {}} type={"button"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOnboardCreation;
