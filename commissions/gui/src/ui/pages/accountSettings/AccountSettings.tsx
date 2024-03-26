import React from "react";

import "./AccountSettings.css";
import userImg from "../../../resources/assets/user.png";
import editicon from "../../../resources/assets/edit-line.png";
import accountIcon from "../../../resources/assets/settings-line.png";

const AccountSettings = () => {
  return (
    <>
      <div className="titlehed">
        <span>
          <img src={accountIcon} alt="" />
        </span>
        Account Setting
      </div>
      <div className="TabsContainer">
    
      </div>
    </>
  );
};

export default AccountSettings;
