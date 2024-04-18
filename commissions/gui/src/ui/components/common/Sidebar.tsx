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
import React, { useEffect, useRef, useState } from "react";
import appRoutesTwo from "../../../routes/appRoutesTwo";
import "../common/sidebar.css";
import { ICONS } from "../../icons/Icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdKeyboardArrowUp,
} from "react-icons/md";
import colorConfig from "../../../config/colorConfig";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/apiSlice/authSlice/authSlice";
interface Toggleprops {
  toggleOpen: boolean;
  setToggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarChange: React.Dispatch<React.SetStateAction<number>>;
  sidebarChange: number;
}
const Sidebar: React.FC<Toggleprops> = ({
  toggleOpen,
  setToggleOpen,
  setSidebarChange,
  sidebarChange,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [cords, setCords] = useState({ left: 0, top: 0, opacity: 0, text: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const timeOut = useRef<NodeJS.Timeout | null>(null)
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const handleMouseover = (
    e: React.MouseEvent<HTMLAnchorElement | MouseEvent>
    , name: string) => {
    const elm = e.target as HTMLAnchorElement;
    if (timeOut.current) {
      clearTimeout(timeOut.current)
    }
    if (elm.classList.contains("side-icon-container")) {
      const co = elm.getBoundingClientRect();
      setCords({ top: co.top, left: co.width + co.left, opacity: 1, text: name });
    }

  };

  const handleopen = () => {
    if(toggleOpen){
     
      setToggleOpen(!toggleOpen)
      setOpen(!open)
    } else {
      setOpen(!open)
    }
  }

  return (
    <div
      style={{ position: "relative", zIndex: "20" }}
      className={`side-bar-container ${toggleOpen ? "side-bar-active" : ""}`}
    >
      <div
        className={`side-bar-logo ${toggleOpen ? "side-bar-logo-active" : ""}`}
      >
        <img src={ICONS.sidebarLogo} alt="" />
        {toggleOpen ? null : <h3 style={{ color: "black" }}>OWE HUB</h3>}
      </div>
      <div
        className={`side-bar-content ${toggleOpen ? "side-bar-content-active" : ""
          }`}
      >
        <div className="heading-container">
          <div
            className={`icon-shape ${toggleOpen ? "icon-shape-active" : ""}`}
            onClick={() => setToggleOpen(!toggleOpen)}
          >
            {toggleOpen ? (
              <MdKeyboardArrowRight
                style={{ fontSize: "1.2rem", color: "black" }}
              />
            ) : (
              <img src={ICONS.menuIcon} alt="" />
            )}
          </div>
        </div>
        {appRoutesTwo.map((el, i) => (
          <div className="" key={i}>
            {toggleOpen ? null : <p className="heading">{el.name}</p>}
            {el.commission?.map((item, index) => (
              <div key={index}>
                {item.child ? (
                  <>
                    <Link
                      to={item.path}
                      style={{
                        paddingLeft: toggleOpen ? ".8rem" : "",
                        cursor: "pointer",
                      }}
                      className={`side-accordian`}
                      onClick={handleopen}
                    >
                      <div className={`side-icon-container-1`}>
                        {item.sidebarProps.icon && item.sidebarProps.icon}
                        {toggleOpen ? null : (
                          <p
                            className={`tablink`}
                            style={{ color: open ? "#0069A3" : "#101828" }}
                          >
                            {item.sidebarProps.displayText}
                          </p>
                        )}
                      </div>
                      {open ? (
                        <MdKeyboardArrowUp
                          style={{
                            fontSize: "1.5rem",
                            color: colorConfig.sidebar.activeBg,
                          }}
                        />
                      ) : (
                        <MdKeyboardArrowDown
                          style={{ fontSize: "1.5rem", color: "black" }}
                        />
                      )}
                    </Link>
                    {open && (
                      <div className={`side-accordian-item`}>
                        {item?.child?.map((accr, ele) => (
                          <Link
                            key={ele}
                            to={accr?.path}
                            style={{ paddingLeft: toggleOpen ? ".8rem" : "" }}
                            className={`side-icon-container ${location.pathname === accr.path
                              ? "active-link-bg"
                              : ""
                              }`}
                          >
                            {accr.sidebarProps.icon && accr.sidebarProps.icon}
                            {toggleOpen ? null : (
                              <p className={`tablink`}>
                                {accr.sidebarProps?.displayText}
                              </p>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="">
                    <Link
                      to={item.path}
                      style={{ paddingLeft: toggleOpen ? ".8rem" : "", position: "relative", zIndex: 5 }}
                      className={`side-icon-container ${location.pathname === item.path ? "active-link-bg" : ""
                        }`}
                    >
                      {item.sidebarProps.icon && item.sidebarProps.icon}
                      {toggleOpen ? null : (
                        <p className={`tablink`}>
                          {item.sidebarProps.displayText}
                        </p>
                      )}
                    </Link>
                  </div>
                )}
              </div>
            ))}
            <div className="" style={{ marginTop: toggleOpen ? 0 : ".8rem" }}>
              {el.other?.map((oth, index) => (
                <Link
                  key={index}
                  style={{ paddingLeft: toggleOpen ? ".8rem" : "" }}
                  to={oth.path}
                  onMouseEnter={(e) => toggleOpen && handleMouseover(e, oth.sidebarProps.displayText)}
                  onMouseLeave={() => {
                    timeOut.current = setTimeout(() => {
                      setCords(prev => ({ ...prev, opacity: 0 }))
                    }, 500)
                  }}
                  className={`side-icon-container ${location.pathname === oth.path ? "active-link-bg" : ""
                    }`}
                >
                  {oth.sidebarProps.icon && oth.sidebarProps.icon}
                  {toggleOpen ? null : (
                    <p className={`tablink`}>{oth.sidebarProps.displayText}</p>
                  )}


                  <div
                    className="tip"
                    style={{
                      backgroundColor: "#ddf3ff",
                      position: "fixed",
                      top: cords.top,
                      left: cords.left,
                      opacity: cords.opacity,
                      padding: "4px 1rem",
                    }}
                  >
                    {cords.text}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}


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
  );
};

export default Sidebar;
