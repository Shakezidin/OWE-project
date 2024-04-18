import React from "react";
import { useState } from 'react'
import "./AccountSettings.css";
import { ICONS } from "../../icons/Icons";
import MyProfile from "./MyProfile";
import ResetPassword from "../resetPassword/ResetPassword";
import ResetPasswordAccount from "./ResetPasswordAccount";
import { logout } from "../../../redux/apiSlice/authSlice/authSlice";
import { useAppDispatch } from "../../../redux/hooks";
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleTabClick = (i:number) => {
    setActiveTab(i);
  };
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <>
      <div className="">
        <div className="account-container">
          <div className="titlehed">
            <img src={ICONS.settingIconAcc} alt="" />
          </div>
          <div className="">
            <p> Account Setting</p>
          </div>
        </div>
      </div>
      <div className="profile-section">
     
        <div className="tab-links">
          <button onClick={() => handleTabClick(0)} className={`tab ${activeTab===0?"active-profile":""}`}>My Profile</button>
          <button onClick={() => handleTabClick(1)} className={`tab ${activeTab===1?"active-profile":""}`}>Reset Password</button>
          <button onClick={handleLogout} className="tab">Logout</button>
        </div>
        <div className="vertical"></div>
        <div className="tab-content">
          {activeTab === 0 && <div><MyProfile /></div>}
          {activeTab === 1 && <div><ResetPasswordAccount /></div>}
  
        </div>

       

        {/* <MyProfile /> */}
        {/* <ResetPasswordAccount /> */}
      </div>
    </>
  );
};

export default AccountSettings;
