import React from "react";
import "./AccountSettings.css";
import { ICONS } from "../../icons/Icons";

const AccountSettings = () => {
  return (
    <>
      <div className="titlehed">
        <span>
          <img src={ICONS.SETTING_LINE} alt="" />
        </span>
        Account Setting
      </div>
      <div className="TabsContainer"></div>
    </>
  );
};

export default AccountSettings;
