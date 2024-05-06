import React from "react";
import { ActionButton } from "../../components/button/ActionButton";
import Input from "../../components/text_input/Input";
import "./AccountSettings.css";

const ResetPasswordAccount = () => {
  return (
    <>
      <div className="" style={{ flex: "1", padding: "1rem" }}>
        <div className="">
          <p>Settings</p>
        </div>


        <div className="Personal-container">
          <div className="create-input-container" style={{gap: "1.8%"}}>
            <div className="create-input-field-profile-password">
              <Input
                type={"text"}
                label="Current Password"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => { }}
              />
            </div>
            <div className="create-input-field-profile-password">
              <Input
                type={"text"}
                label="New Password"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => { }}
              />
            </div>
            <div className="create-input-field-profile-password">
              <Input
                type={"text"}
                label="Confirm Password"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => { }}
              />
            </div>
          </div>

          <div className="reset-Update">
            <ActionButton title={"Update"} type="submit" onClick={() => { }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordAccount;
