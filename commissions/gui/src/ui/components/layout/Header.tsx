import React from "react";
import logo from "../../../resources/assets/logo.png";
import "./layout.css";
import btnlogo from "../../../resources/assets/appicon.png";
import userImg from "../../../resources/assets/user.png";
import notificationImg from "../../../resources/assets/notification.png";
import searchIcon from "../../../resources/assets/search.png";
import "../layout/layout.css";
import { GoSearch } from "react-icons/go";

import { MdKeyboardArrowDown } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";

interface Toggleprops {
  toggleOpen: boolean;
  setToggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<Toggleprops> = ({ toggleOpen, setToggleOpen }) => {
  const userRole = localStorage.getItem("role");
  const userEmail = localStorage.getItem("emailId");
  return (
    <div className="header-content">
      <div className="header-icon">
        <div className="menu-icon" onClick={() => setToggleOpen(true)}>
          <MdOutlineMenu className="icon" />
        </div>
        <div className="header-logo">
          <img src={logo} alt="" />
        </div>
      </div>
      <div className="search-container">
       <div className="search-icon-img">
        {/* <img src={searchIcon}></img> */}
          <input type="text" name="search" placeholder="Search..." />
          </div>
        <div className="user-container">
          <button className="app-btn">
            <img src={btnlogo} alt="" />
            App
          </button>
          <div className="notification">
            <img src={notificationImg} alt="" />
          </div>
          <div className="user-img-container">
            <div className="user-img">
              <img src={userImg} alt="" />
            </div>
            <div className="user-name">
              <div className="down-arrow">
                <h4>{userEmail}</h4>
                <div className="down-circle">
                  <MdKeyboardArrowDown style={{ fontSize: "1.5rem" }} />
                </div>
              </div>

              <p>{userRole}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
