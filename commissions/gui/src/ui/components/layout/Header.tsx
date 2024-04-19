import React, { useState, useEffect } from "react";
import "./layout.css";
import "../layout/layout.css";
import { GoSearch } from "react-icons/go";
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";
import { ICONS } from "../../icons/Icons";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from "../../../redux/apiSlice/authSlice/authSlice";
import { routes } from "../../../routes/routes";

interface Toggleprops {
  toggleOpen: boolean;
  setToggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarChange: React.Dispatch<React.SetStateAction<number>>,
  sidebarChange: number
}

const Header: React.FC<Toggleprops> = ({ toggleOpen, setToggleOpen, setSidebarChange, sidebarChange }) => {
  const [name, setName] = useState<String>();
  const userRole = localStorage.getItem("role");
  const userEmail = localStorage.getItem("email");
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openIcon, setOPenIcon] = useState<boolean>(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  useEffect(() => {
    if (userEmail) {
      var firstLetter = userEmail.charAt(0).toUpperCase();
      setName(firstLetter); // Set the first letter as the name
    }
  }, [userEmail]);
  return (
    <div className="header-content">
      <div className="header-icon">

        <div className="header-logo">
          <img src={ICONS.LOGO} alt="" />
        </div>
      </div>
      <div className="search-container">
        <div className="user-container">
          {/* <button className="app-btn" onClick={() => setOpenModal(!openModal)}>
            {
              openModal ? <img src={ICONS.groupActiveIcon} alt="" /> : <img src={ICONS.groupIcon} alt="" />
            }
          </button> */}
          {/* {
            openModal && (<div className="header-modal">
              <div className="select-head">
                <p>Select Option</p>
              </div>
              <div className="image-box-container" >
                <div className="image-icon" style={{ backgroundColor: "#DDF3FF" }}>
                  <img src={ICONS.commIconHead} alt="" />
                </div>
                <p className="" >
                  Commission
                </p>
              </div>
              <div className="image-box-container" onClick={() => setSidebarChange(1)}>
                <div className="image-icon" style={{ backgroundColor: "#FFE6E6" }}>
                  <img src={ICONS.dbIconManag} alt="" />
                </div>
                <p className="">
                  Database Manger
                </p>
              </div>
              <div className="image-box-container">
                <div className="image-icon" style={{ backgroundColor: "#DDDFFF" }}>
                  <img src={ICONS.projIcon} alt="" />
                </div>
                <p className="">
                  Project Manager
                </p>
              </div>
              <div className="image-box-container">
                <div className="image-icon" style={{ backgroundColor: "#DDF3FF" }}>
                  <img src={ICONS.teamManag} alt="" />
                </div>
                <p className="">
                  Team Management
                </p>
              </div>
            </div>
            )
          } */}
          <div className="notification">
            <img src={ICONS.NOTIFICATION} alt="" />
          </div>
          <div className="user-img-container">
          <div className="user-img">
              <span>{name}</span>
            </div>
            <div className="user-name">
              <div className="down-arrow">
                <h4>{userEmail}</h4>
                <p>{userRole}</p>
              </div>

              <div className="">
                <div className="down-circle" onClick={() => setOPenIcon(!openIcon)}>

                  {
                    openIcon ? <img src={ICONS.upperIcon} alt="" /> : <MdKeyboardArrowDown style={{ fontSize: "1.5rem" }} />
                  }
                  {
                    openIcon && (<div className="header-modal-1">

                      <div className="image-box-container" onClick={()=> navigate(routes.accountSettingRoutes)}>
                        <div className="image-icon">
                          <img src={ICONS.commIconHead} alt="" />
                        </div>
                        <p className="" style={{fontSize:"12px", fontWeight: "500" }} >
                          My Account
                        </p>
                      </div>

                      <div className="image-box-container "
                        // style={{ paddingLeft: toggleOpen ? ".8rem" : "" }}
                        onClick={handleLogout} >
                        <div className="image-icon">
                        <img src={ICONS.logoutIconLeft}  alt="" />
                        </div>
                        {
                          toggleOpen ? null : <div
                            className="tablink"
                            style={{
                              // color: "black",
                            }}
                          >
                           <p style={{fontSize:"12px",fontWeight: "500"}}>Logout</p> 
                          </div>
                        }

                      </div>
                    </div>
                    )
                  }

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
