// import React, { useState } from "react";
// import SidebarItem from "./SidebarItem";
// import SidebarItemCollapse from "./SidebarItemCollapse";
// import appRoutes from "../../../routes/appRoutes";

// import { ICONS } from "../../icons/Icons";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { logout } from "../../../redux/apiSlice/authSlice/authSlice";
// import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
// interface Toggleprops {
//   toggleOpen: boolean;
//   setToggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   setSidebarChange: React.Dispatch<React.SetStateAction<number>>,
//   sidebarChange:number
// }
// const Sidebar: React.FC<Toggleprops> = ({ toggleOpen, setToggleOpen,setSidebarChange,sidebarChange }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
//   };
//   return (
//     <div
//       className={`side-bar-container ${toggleOpen ? "side-bar-active" : ""}`}
//     >
//       <div className={`side-bar-logo ${toggleOpen? "side-bar-logo-active" :""}`}>
//         <img src={ICONS.sidebarLogo} alt="" />
//       {
//         toggleOpen?null:  <h3 style={{color:"black"}}>OWE HUB</h3>
//       }
//       </div>
//       <div className={`side-bar-content ${toggleOpen ? "side-bar-content-active" : ""}`}>
//       <div className="heading-container">
//       <div className={`icon-shape ${toggleOpen?"icon-shape-active":""}`}  onClick={() => setToggleOpen(!toggleOpen)}>

//     {
//       toggleOpen?  <MdKeyboardArrowRight style={{fontSize:"1.2rem",color:"black"}} />: <img src={ICONS.menuIcon} alt="" />
//     }
//       </div>


//       </div>
//       {
//         toggleOpen?null:<p className="heading">Commissions</p>
//       }
//         {appRoutes.map((route, index) =>
//           route.sidebarProps ? (
//             route.child ? (
//               <SidebarItemCollapse
//                 setToggleOpen={setToggleOpen}
//                 item={route}
//                 toggleOpen={toggleOpen}
//                 key={index}
//               />
//             ) : (
//               <SidebarItem
//                 setToggleOpen={setToggleOpen}
//                 item={route}
//                 key={index}
//                 toggleOpen={toggleOpen}
//               />
//             )
//           ) : null
//         )}

//         <div className="side-icon-container" onClick={handleLogout}>
//           <img src={ICONS.logoutIcon} className="icon-image" alt="" />
//          {
//           toggleOpen? null: <div

//           className="tablink"
//           style={{
//             color: "black",
//           }}
//         >
//           logout
//         </div>
//          }
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
import React, { useState } from 'react'
import appRoutesTwo from '../../../routes/appRoutesTwo'
import "../common/sidebar.css";
import { ICONS } from '../../icons/Icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdKeyboardArrowDown, MdKeyboardArrowRight, MdKeyboardArrowUp } from 'react-icons/md';
import colorConfig from '../../../config/colorConfig';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/apiSlice/authSlice/authSlice';
interface Toggleprops {
  toggleOpen: boolean;
  setToggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarChange: React.Dispatch<React.SetStateAction<number>>,
  sidebarChange: number
}
const Sidebar: React.FC<Toggleprops> = ({ toggleOpen, setToggleOpen, setSidebarChange, sidebarChange }) => {
  const [open, setOpen] = useState<boolean>(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <div className={`side-bar-container ${toggleOpen ? "side-bar-active" : ""}`}>
      <div className={`side-bar-logo ${toggleOpen ? "side-bar-logo-active" : ""}`}>
        <img src={ICONS.sidebarLogo} alt="" />
        {
          toggleOpen ? null : <h3 style={{ color: "black" }}>OWE HUB</h3>
        }
      </div>
      <div className={`side-bar-content ${toggleOpen ? "side-bar-content-active" : ""}`}>
        <div className="heading-container">
          <div className={`icon-shape ${toggleOpen ? "icon-shape-active" : ""}`} onClick={() => setToggleOpen(!toggleOpen)}>
            {
              toggleOpen ? <MdKeyboardArrowRight style={{ fontSize: "1.2rem", color: "black" }} /> : <img src={ICONS.menuIcon} alt="" />
            }
          </div>
        </div>
        {
          appRoutesTwo.map((el, i) => (
            <div className="" key={i}>
              {
                toggleOpen ? null : <p className="heading">{el.name}</p>
              }
              {
                el.commission?.map((item, index) => (
                  <div key={index} >
                    {
                      item.child ? (<>
                        <Link to={item.path}
                          style={{paddingLeft:toggleOpen?".8rem":"",cursor:"pointer"}}
                         className={`side-accordian`} onClick={() => setOpen(!open)}>
                          <div className={`side-icon-container-1`}>
                            {item.sidebarProps.icon && item.sidebarProps.icon}
                          {
                            toggleOpen?null:  <p className={`tablink`} style={{ color: open ? "#0069A3" : "#101828" }}>
                            {item.sidebarProps.displayText}
                          </p>
                          }
                          </div>
                          {
                            open ? <MdKeyboardArrowUp style={{ fontSize: "1.5rem", color: colorConfig.sidebar.activeBg }} /> : <MdKeyboardArrowDown style={{ fontSize: "1.5rem", color: "black" }} />
                          }

                        </Link>
                        {
                          open && <div className={`side-accordian-item`} >
                            {
                              item?.child?.map((accr, ele) => (
                                <Link
                                  key={ele}
                                  to={accr?.path}
                                  style={{paddingLeft:toggleOpen?".8rem":""}}
                                  className={`side-icon-container ${location.pathname === accr.path ? "active-link-bg" : ""}`}>

                                  {accr.sidebarProps.icon && accr.sidebarProps.icon}
                                {
                                  toggleOpen?null:  <p className={`tablink`}>
                                  {accr.sidebarProps?.displayText}
                                </p>
                                }
                                </Link>
                              ))
                            }
                          </div>
                        }
                      </>

                      )
                        :
                        <div className="">
                          <Link
                            to={item.path}
                            style={{paddingLeft:toggleOpen?".8rem":""}}
                            className={`side-icon-container ${location.pathname === item.path ? "active-link-bg" : ""}`}
                          >
                            {item.sidebarProps.icon && item.sidebarProps.icon}
                          {
                            toggleOpen?null:  <p className={`tablink`}>
                            {item.sidebarProps.displayText}
                          </p>
                          }
                          </Link>
                        </div>
                    }
                  </div>
                ))
              }
              <div className="" style={{marginTop:toggleOpen?0:".8rem"}}>
                {
                  el.other?.map((oth, index) => (
                    <Link
                      key={index}
                      style={{paddingLeft:toggleOpen?".8rem":""}}
                      to={oth.path}
                      className={`side-icon-container ${location.pathname === oth.path ? "active-link-bg" : ""}`}
                    >
                    {oth.sidebarProps.icon && oth.sidebarProps.icon}{toggleOpen? null:<p className={`tablink`}>{oth.sidebarProps.displayText}</p>
}
                    </Link>
                  ))
                }
              </div>
            </div>
          ))
        }
        {/* <div className="side-icon-container"
          style={{paddingLeft:toggleOpen?".8rem":""}}
         onClick={handleLogout} >
          <img src={ICONS.logoutIcon} className="icon-image" alt="" />
          {
            toggleOpen ? null : <div
              className="tablink"
              style={{
                color: "black",
              }}
            >
              logout
            </div>
          }

        </div> */}
      </div>


    </div>
  )
}

export default Sidebar