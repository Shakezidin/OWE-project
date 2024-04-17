import React from "react";
import "./AccountSettings.css";
import { ICONS } from "../../icons/Icons";

const AccountSettings = () => {
  return (
    <>
      <div className="">
        <div className="account-container">
          <div className="titlehed">
            <img src={ICONS.SETTING_LINE} alt="" />
          </div>
          <div className="">
            <p> Account Setting</p>
          </div>
        </div>
      </div>
      <div className="profile-section">
        <div className="profile-sec-button">
          <button type="button" style={{ background: "#E9F0FF" }}>
            My Profile
          </button>
          <br />
          <button type="button">Reset Password</button>
          <br />
          <button type="button">Logout</button>
        </div>
        <div className="vertical"></div>

        <div className="myProf-section">
          <p>My Profile</p>

          <div className="" >
            <div className="admin-section">
              <div className="">
                <img src={ICONS.userPic} alt="" />
              </div>
              <div className="" style={{ display: "flex", gap: "30rem", alignContent: "center" }}>
                <div className="caleb-section">
                  <h3>Caleb Antonucci</h3>
                  <p>Admin</p>
                </div>

                <div className="edit-section">
                  <img src={ICONS.editIcon} alt="" />
                  <p>Edit</p>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <h1>Deepak</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSettings;
