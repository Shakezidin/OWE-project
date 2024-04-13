import React, { useState } from "react";
import "./layout.css";
import "../layout/layout.css";
import { GoSearch } from "react-icons/go";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import { ICONS } from "../../icons/Icons";

interface Toggleprops {
  toggleOpen: boolean;
  setToggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<Toggleprops> = ({ toggleOpen, setToggleOpen }) => {
  const userRole = localStorage.getItem("role");
  const userEmail = localStorage.getItem("email");
  const [openModal,setOpenModal] = useState<boolean>(false)
  return (
    <div className="header-content">
      <div className="header-icon">
     
        <div className="header-logo">
          <img src={ICONS.LOGO} alt="" />
        </div>
      </div>
      <div className="search-container">
        <div className="user-container">
          <button className="app-btn" onClick={()=>setOpenModal(!openModal)}>
            <img src={ICONS.groupIcon} alt="" />
          </button>
          {
            openModal&&(<div className="header-modal">
              <div className="select-head">
                <p>Select Option</p>
              </div>
                <div className="image-box-container">
                  <div className="image-icon" style={{backgroundColor:"#DDF3FF"}}>

                  </div>
                  <p className="" >
                    Commission
                  </p>
                </div>
                <div className="image-box-container">
                  <div className="image-icon" style={{backgroundColor:"#FFE6E6"}}>

                  </div>
                  <p className="">
                    Database Manger
                  </p>
                </div>
                <div className="image-box-container">
                  <div className="image-icon" style={{backgroundColor:"#667085"}}></div>
                  <p className="">
                    Project Manager
                  </p>
                </div>
                <div className="image-box-container">
                  <div className="image-icon"  style={{backgroundColor:"#DDF3FF"}}></div>
                  <p className="">
                    Team Management
                  </p>
                </div>
            </div>)
          }
          <div className="notification">
            <img src={ICONS.NOTIFICATION} alt="" />
          </div>
          <div className="user-img-container">
            <div className="user-img">
              <img src={ICONS.USER_IMAGE} alt="" />
            </div>
            <div className="user-name">
              <div className="down-arrow">
                <h4>{userEmail}</h4>
                <p>{userRole}</p>
              </div>
              <div className="down-circle">
                <MdKeyboardArrowDown style={{ fontSize: "1.5rem" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
