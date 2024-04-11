import React, { useState } from "react";
import SidebarItem from "./SidebarItem";
import SidebarItemCollapse from "./SidebarItemCollapse";
import appRoutes from "../../../routes/appRoutes";
import "../layout/layout.css";
import { ICONS } from "../../icons/Icons";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/apiSlice/authSlice/authSlice";
interface Toggleprops {
  toggleOpen: boolean;
  setToggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const Sidebar: React.FC<Toggleprops> = ({ toggleOpen, setToggleOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <div
      className={`side-bar-container ${toggleOpen ? "side-bar-active" : ""}`}
    >
      <div className={`side-bar-logo ${toggleOpen? "side-bar-logo-active" :""}`}>
        <img src={ICONS.sidebarLogo} alt="" />
      {
        toggleOpen?null:  <h3 style={{color:"black"}}>OWE HUB</h3>
      }
      </div>
      <div className={`side-bar-content ${toggleOpen ? "side-bar-content-active" : ""}`}>
        {/* <h3 style={{color:""}}>Commission</h3> */}
        {appRoutes.map((route, index) =>
          route.sidebarProps ? (
            route.child ? (
              <SidebarItemCollapse
                setToggleOpen={setToggleOpen}
                item={route}
                toggleOpen={toggleOpen}
                key={index}
              />
            ) : (
              <SidebarItem
                setToggleOpen={setToggleOpen}
                item={route}
                key={index}
                toggleOpen={toggleOpen}
              />
            )
          ) : null
        )}

        <div className="side-icon-container"     onClick={handleLogout}>
          <img src={ICONS.logoutIcon} className="icon-image" alt="" />
         {
          toggleOpen? null: <div
        
          className="tablink"
          style={{
            color: "black",
          }}
        >
          logout
        </div>
         }
        </div>
      </div>
    </div>
    // <div

    //   style={{
    //     width: sizeConfig.sidebar.width,
    //     flexShrink: 0,
    //     height:"100vh",
    //       // width: sizeConfig.sidebar.width,
    //       boxSizing: "border-box",
    //       borderRight: "0px",
    //       backgroundColor: colorConfig.sidebar.bg,
    //       color: colorConfig.sidebar.color

    //   }}
    // >
    //   <div  >
    //  <div className="">
    //   image
    //  </div>
    //  <div className="">

    //  </div>
    //   </div>
    // </div>
  );
};

export default Sidebar;
