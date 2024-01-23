import React from "react";
import "./CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../resources/assets/Profile_background.svg";
import { ActionButton } from "../../components/button/ActionButton";
import Input from "../../components/text_input/Input";
import { ReactComponent as CROSS_BUTTON } from "../../../resources/assets/cross_button.svg";
import DropdownButton from "../../components/dropdown/DropdownButton";

const CreateUserProfile = () => {
  return (
    <div className="transparent-model">
      <div className="modal">
        <div className="createUserCrossButton">
          <CROSS_BUTTON />
        </div>
        <div className="createUserContainer">
          <span className="createProfileText">Create User Profile</span>
          <span className="createProfileSubText">
            Enter the below detail to create User New Profile
          </span>

          <div className="createProfileInputView">
            <div className="uploadImageView">
              <PROFILE_BACKGROUND />
              <br />
              <button>Upload Photo</button>
            </div>
            <div className="createUserLine"></div>
            <div className="createProfileTextView">
              <div style={{ display: "flex", gap: "20px" }}>
                <Input
                  type={"text"}
                  label="First Name*"
                  value={""}
                  placeholder={"Enter First Name"}
                  onChange={() => {}}
                />
                <Input
                  type={"text"}
                  label="Last Name*"
                  value={""}
                  placeholder={"Enter Last Name"}
                  onChange={() => {}}
                />
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                <Input
                  type={"text"}
                  label="Email ID*"
                  value={""}
                  placeholder={"Enter Email ID"}
                  onChange={() => {}}
                />
                <Input
                  type={"text"}
                  label="Phone Number*"
                  value={""}
                  placeholder={"Enter Phone Number"}
                  onChange={() => {}}
                />
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                <DropdownButton
                  label="Select Role"
                  options={["Option 1", "Option 2", "Option 3"]}
                />
                <DropdownButton
                  label="Assign Dealer"
                  options={["Option 1", "Option 2", "Option 3"]}
                />
              </div>
              <br />
              <div className="createUserActionButton">
                <ActionButton title={"Create"} onClick={() => {}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserProfile;
