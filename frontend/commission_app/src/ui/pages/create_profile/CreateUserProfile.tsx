import React from "react";
import "./CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../resources/assets/Profile_background.svg";
import { ActionButton } from "../../components/button/ActionButton";
import Input from "../../components/text_input/Input";

const CreateUserProfile = () => {
  return (
    <div className="transparent-model">
      <div className="modal">
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
          <div className="createProfileTextView">
            <div style={{ display: "flex", gap: "20px" }}>
              <Input
                type={"text"}
                label="First Name*"
                value={""}
                placeholder={"Enter Email"}
                onChange={() => {}}
              />
              <Input
                type={"text"}
                label="Last Name*"
                value={""}
                placeholder={"Enter Email"}
                onChange={() => {}}
              />
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <Input
                type={"text"}
                label="Email ID*"
                value={""}
                placeholder={"Enter Email"}
                onChange={() => {}}
              />
              <Input
                type={"text"}
                label="Phone Number*"
                value={""}
                placeholder={"Enter Email"}
                onChange={() => {}}
              />
            </div>

            <div style={{ display: "flex", gap: "20px" }}>
              <Input
                type={"text"}
                label="Select Role*"
                value={""}
                placeholder={"Enter Email"}
                onChange={() => {}}
              />
              <Input
                type={"text"}
                label="Assign Dealer*"
                value={""}
                placeholder={"Enter Email"}
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserProfile;
