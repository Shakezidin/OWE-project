import React, { useEffect, useRef, useState } from "react";
import appRoutesTwo from "../../../routes/appRoutesTwo";
import "../common/sidebar.css";
import { ICONS } from "../../icons/Icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlinePayment } from "react-icons/md";
import { CiWallet } from "react-icons/ci";
import { FiLayers } from "react-icons/fi";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdKeyboardArrowUp,
} from "react-icons/md";
import colorConfig from "../../../config/colorConfig";
import { BiSupport } from "react-icons/bi";
import { RiUserSettingsLine } from "react-icons/ri";
import { GoProjectRoadmap } from "react-icons/go";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { BsDatabaseGear } from "react-icons/bs";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { LuWallet } from "react-icons/lu";

 
import { FiServer } from "react-icons/fi";
import { logout } from "../../../redux/apiSlice/authSlice/authSlice";
interface Child {
  path: string;
  sidebarProps: {
    displayText: string;
    icon: React.JSX.Element;
  };
}
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
  const [repay, setRepay] = useState<boolean>(false);
  const [db, setDb] = useState<boolean>(false);
  const [project, setProject] = useState<boolean>(false);

  const [cords, setCords] = useState<{
    left: number;
    top: number;
    opacity: number;
    text: string;
    child: Child[];
    id?:number
  }>({ left: 0, top: 0, opacity: 0, text: "", child: [] , id:-1});
  const [configure, setConfigure] = useState<boolean>(false);

  const location = useLocation();
  const timeOut = useRef<NodeJS.Timeout | null>(null);

  const handleMouseover = (
    e: React.MouseEvent<HTMLAnchorElement | MouseEvent>,
    name: string,
    child: Child[],
    id?:number
  ) => {
    const elm = e.target as HTMLAnchorElement;
    console.log("working", elm);

    if (timeOut.current) {
      clearTimeout(timeOut.current);
    }
    if (
      elm.classList.contains("side-icon-container") ||
      elm.classList.contains("side-accordian") ||
      elm.classList.contains("side-icon-container-1")
    ) {
      const co = elm.getBoundingClientRect();
      setCords({
        top: co.top,
        left: co.width + co.left,
        opacity: 1,
        text: name,
        child,
        id
      });
    }
    
  };

 

  useEffect(() => {
  if(toggleOpen) {
    setDb(false);
    setProject(false);
    setConfigure(false);
  }
  },[toggleOpen])
  return (
    <div
      style={{ zIndex: "20" }}
      className={`side-bar-container ${toggleOpen ? "side-bar-active" : ""}`}
    >
      <div
        className={`side-bar-logo ${toggleOpen ? "side-bar-logo-active" : ""}`}
        style={{ paddingBottom: !toggleOpen ? "" : "16.5px" }}
      >
        <img
          src={ICONS.sidebarLogo}
          alt=""
          style={{
            marginLeft: !toggleOpen ? "" : "5px",
            marginTop: !toggleOpen ? "" : "-6px",
          }}
        />
        {toggleOpen ? null : <h3 style={{ color: "black" }}>OWE HUB</h3>}
      </div>
      <div
        className={`side-bar-content ${
          toggleOpen ? "side-bar-content-active" : ""
        }`}
      >
        <div className="heading-container">
          {!toggleOpen && (
            <div
              className={`icon-shape ${toggleOpen ? "icon-shape-active" : ""}`}
              onClick={() => setToggleOpen(!toggleOpen)}
              style={{ position: "absolute", top: "10px" }}
            >
              {toggleOpen ? (
                <MdKeyboardArrowRight
                color="black"

                />
              ) : (
                <MdKeyboardArrowLeft  style={{ fontSize: "1.2rem", color: "black" }}/>
              )}
            </div>
          )}
        </div>
        {appRoutesTwo.map((el, i) => (
          <div className="" key={i}>
            <div className="" style={{ marginTop: toggleOpen ? 0 : ".4rem" }}>
              {el.commission?.map((oth, index) => (
                <Link
                  key={index}
                  style={{ paddingLeft: toggleOpen ? ".8rem" : "" }}
                  to={oth.path}
                  onMouseEnter={(e) =>
                    toggleOpen &&
                    handleMouseover(e, oth.sidebarProps.displayText, [], 1 )
                  }
                  onMouseLeave={() => {
                    timeOut.current = setTimeout(() => {
                      setCords((prev) => ({ ...prev, opacity: 0,id:-1 }));
                    }, 500);
                  }}
                  className={`side-icon-container ${
                    location.pathname === oth.path ? "active-link-bg" : ""
                  }`}
                >
                <MdOutlinePayment size={20} style={{marginLeft: "5px", flexShrink:"0"}}  className={location.pathname === oth.path ? "sidebaricon" : "sidebariconn"} />
                  {toggleOpen ? null : (
                    <Link to={oth.path}>
                      {" "}
                      <p className={location.pathname === oth.path ? "tablink" : "tablinkk"}>
                        {oth.sidebarProps.displayText}
                      </p>
                    </Link>
                  )}

                  <div
                    className="tip"
                    style={{
                      backgroundColor: "#fff",
                      position: "fixed",
                      top: cords.top,
                      left: cords.left,
                      display: cords.opacity && cords.id===1 ? "block" : "none",
                      maxHeight: "300px",
                      minWidth: "150px",
                      overflowY: "scroll",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      borderLeft: "1px solid #D9D9D9",
                      color: "#092D04",
                    }}
                  >
                    <Link
                    to ="#"
                      className=""
                      style={{
                        display: "block",
                        background: "#E1F5EA",
                        padding: "11px 12px",
                        color: "#23B364",
                        width: "100%",
                        fontWeight: "500",
                        borderBottom: "1px solid #E8E8E8",
                        fontSize: "13px",
                        borderRight:"3px solid #23B364"
                      }}
                    >
                      {" "}
                      {cords.text}
                    </Link>

                    {/* {cords.child.map((ch, ind) => {
                      return (
                        <Link
                          to={ch.path}
                          key={ind}
                          style={{
                            display: "block",
                            marginBlock: "6px",
                            color: "black",
                            padding: "6px 12px",
                            width: "100%",
                            fontSize: "12px",
                          }}
                        >
                          {" "}
                          {ch.sidebarProps.displayText}{" "}
                        </Link>
                      );
                    })} */}
                  </div>
                </Link>
              ))}
            </div>

            <div className="" style={{ marginTop: toggleOpen ? 0 : ".4rem" }}>
              {el.repay?.map((oth, index) => (
                <Link
                  key={index}
                  style={{ paddingLeft: toggleOpen ? ".8rem" : "" }}
                  to={oth.path}
                  onMouseEnter={(e) =>
                    toggleOpen &&
                    handleMouseover(e, oth.sidebarProps.displayText, [], 2)
                  }
                  onMouseLeave={() => {
                    timeOut.current = setTimeout(() => {
                      setCords((prev) => ({ ...prev, opacity: 0,  id:-1 }));
                    }, 500);
                  }}
                  className={`side-icon-container ${
                    location.pathname === oth.path ? "active-link-bg" : ""
                  }`}
                >
                  <LuWallet size={20}  style={{marginLeft: "5px", flexShrink:"0"}}  className={location.pathname === oth.path ? "sidebaricon" : "sidebariconn"} />
                  
                  {/* {oth.sidebarProps.icon && oth.sidebarProps.icon} */}
                  {!toggleOpen && (
                    <p className={location.pathname === oth.path ? "tablink" : "tablinkk"}>
                     {oth.sidebarProps.displayText}
                     </p>
                      )}

                  <div
                    className="tip"
                    style={{
                      backgroundColor: "#fff",
                      position: "fixed",
                      top: cords.top,
                      left: cords.left,
                      display: cords.opacity && cords.id===2 ? "block" : "none",

                      maxHeight: "300px",
                      minWidth: "150px",
                      overflowY: "scroll",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      borderLeft: "1px solid #D9D9D9",

                      color: "black",
                    }}
                  >
                   <Link
                    to ="#"
                      className=""
                      style={{
                        display: "block",
                        background: "#E1F5EA",
                        padding: "11px 12px",
                        color: "#23B364",
                        width: "100%",
                        fontWeight: "500",
                        borderBottom: "1px solid #E8E8E8",
                        fontSize: "13px",
                        borderRight:"3px solid #23B364"
                      }}
                    >
                      {" "}
                      {cords.text}
                    </Link>

                    {/* {cords.child.map((ch, ind) => {
                      return (
                        <span
                          key={ind}
                          style={{
                            display: "block",
                            marginBlock: "6px",
                            color: "black",
                            padding: "6px 12px",
                            width: "100%",
                            fontSize: "12px",
                          }}
                        >
                          {" "}
                          {ch.sidebarProps.displayText}{" "}
                        </span>
                      );
                    })} */}
                  </div>
                </Link>
              ))}
            </div>

            <div className="" style={{ marginTop: toggleOpen ? 0 : ".2rem" }}>
              {el.ar?.map((oth, index) => (
                <Link
                  key={index}
                  style={{ paddingLeft: toggleOpen ? ".8rem" : "" }}
                  to={oth.path}
                  onMouseEnter={(e) =>
                    toggleOpen &&
                    handleMouseover(e, oth.sidebarProps.displayText, [], 3)
                  }
                  onMouseLeave={() => {
                    timeOut.current = setTimeout(() => {
                      setCords((prev) => ({ ...prev, opacity: 0, id:-1 }));
                    }, 500);
                  }}
                  className={`side-icon-container ${
                    location.pathname === oth.path ? "active-link-bg" : ""
                  }`}
                >
                   <FiLayers   size={20}  style={{marginLeft: "5px", flexShrink:"0"}}  className={location.pathname === oth.path ? "sidebaricon" : "sidebariconn"}/> 
                  {toggleOpen ? null : (
                    <p  className={location.pathname === oth.path ? "tablink" : "tablinkk"}>{oth.sidebarProps.displayText}</p>
                  )}
                  <div
                    className="tip"
                    style={{
                      backgroundColor: "#fff",
                      position: "fixed",
                      top: cords.top,
                      left: cords.left,
                      display: cords.opacity  && cords.id===3? "block" : "none",

                      maxHeight: "300px",
                      minWidth: "150px",
                      overflowY: "scroll",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      borderLeft: "1px solid #D9D9D9",

                      color: "black",
                    }}
                  >
                     <Link
                    to ="#"
                      className=""
                      style={{
                        display: "block",
                        background: "#E1F5EA",
                        padding: "11px 12px",
                        color: "#23B364",
                        width: "100%",
                        fontWeight: "500",
                        borderBottom: "1px solid #E8E8E8",
                        fontSize: "13px",
                        borderRight:"3px solid #23B364"
                      }}
                    >
                      {" "}
                      {cords.text}
                    </Link>

                    {/* {cords.child.map((ch, ind) => {
                      return (
                        <span
                          key={ind}
                          style={{
                            display: "block",
                            marginBlock: "6px",
                            color: "black",
                            padding: "6px 12px",
                            width: "100%",
                            fontSize: "12px",
                          }}
                        >
                          {" "}
                          {ch.sidebarProps.displayText}{" "}
                        </span>
                      );
                    })} */}
                  </div>
                </Link>
              ))}
            </div>

            {el.db?.map((item, index) => (
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
                   
                      onClick={() => {
                        if (!toggleOpen) {
                          setDb(!db);
                        }
                      }}
                      onMouseEnter={(e) =>
                        toggleOpen &&
                        handleMouseover(
                          e,
                          item.sidebarProps.displayText,
                          item.child,
                          4
                        )
                      }
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0 ,id:-1}));
                        }, 500);
                      }}
                    >
                      <div className={`side-icon-container-1`}>
                      <div>  {item.sidebarProps.icon && item.sidebarProps.icon}</div>
                        {toggleOpen ? null : (
                          <p
                            className={`tablinkk`}
                            style={{ color: repay ? "#0069A3" : "#101828" }}
                          >
                            {item.sidebarProps.displayText}
                          </p>
                        )}
                      </div>

                      <div
                        className="tip"
                        style={{
                          backgroundColor: "#fff",
                          position: "fixed",
                          top: cords.top,
                          left: cords.left,
                          display: cords.opacity && cords.id===4 ? "block" : "none",
                          maxHeight: "300px",
                          minWidth: "150px",
                          overflowY: "scroll",
                          borderTopLeftRadius: "4px",
                          borderTopRightRadius: "4px",
                          borderLeft: "1px solid #D9D9D9",

                          color: "black",
                        }}
                      >
                        <Link
                       to ="#"
                      className=""
                      style={{
                        display: "block",
                        background: "#E1F5EA",
                        padding: "13.5px 12px",
                        color: "#23B364",
                        width: "100%",
                        fontWeight: "500",
                        borderBottom: "1px solid #E8E8E8",
                        fontSize: "13px",
                        borderRight:"3px solid #23B364"
                     
                      }}
                    >
                      {" "}
                      {cords.text}
                    </Link>

                        {cords.child.map((ch, ind) => {
                          return (
                            <Link
                              to={ch.path}
                              key={ind}
                              style={{
                                display: "block",
                                marginBlock: "6px",
                                color: "black",
                                padding: "6px 12px",
                                width: "100%",
                                fontSize: "12px",
                                marginLeft: '10px'
                              }}
                              className="hover-children"
                            >
                              {" "}
                              {ch.sidebarProps.displayText}{" "}
                            </Link>
                          );
                        })}
                      </div>
                      {db ? (
                        <MdKeyboardArrowUp
                          style={{
                            fontSize: "1.5rem",
                            color:"black"
                          }}
                        />
                      ) : (
                        <MdKeyboardArrowDown
                          style={{ fontSize: "1.5rem", color: "black" }}
                        />
                      )}
                    </Link>
                    {db && (
                      <div className={`side-accordian-item`}>
                        {item?.child?.map((accr, ele) => (
                          <Link
                            key={ele}
                            to={accr?.path}
                            style={{ paddingLeft: toggleOpen ? ".8rem" : "" }}
                            className={`side-icon-container ${
                              location.pathname === accr.path
                                ? "active-link-bg"
                                : ""
                            }`}
                            
                          >
                              <div  className={location.pathname === accr.path ? "ellipseee" : "ellipsee"} >{accr.sidebarProps.icon}</div> 
                            {toggleOpen ? null : (
                              <p  className={location.pathname === accr.path ? "tablink" : "tablinkk"}>
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
                      style={{
                        paddingLeft: toggleOpen ? ".8rem" : "",
                        position: "relative",
                        zIndex: 5,
                      }}
                      className={`side-icon-container ${
                        location.pathname === item.path ? "active-link-bg" : ""
                      }`}
                    >
                       <BsDatabaseGear size={20} style={{marginLeft: "3px", flexShrink:"0"}} color="black"/>
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

            {el.project?.map((item, index) => (
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
                      onClick={() => {
                        if (!toggleOpen) {
                          setProject(!project);
                        }
                      }}
                      onMouseEnter={(e) =>
                        toggleOpen &&
                        handleMouseover(
                          e,
                          item.sidebarProps.displayText,
                          item.child,
                          5
                        )
                      }
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0 , id:-1}));
                        }, 500);
                      }}
                    >
                      <div
                        className="tip"
                        style={{
                          backgroundColor: "#fff",
                          position: "fixed",
                          top: cords.top,
                          left: cords.left,
                          display: cords.opacity && cords.id=== 5? "block" : "none",

                          maxHeight: "300px",
                          minWidth: "150px",
                          overflowY: "scroll",
                          borderTopLeftRadius: "4px",
                          borderTopRightRadius: "4px",
                          borderLeft: "1px solid #D9D9D9",

                          color: "black",
                        }}
                      >
                        <Link
                    to ="#"
                      className=""
                      style={{
                        display: "block",
                        background: "#E1F5EA",
                        padding: "13.5px 12px",
                        color: "#23B364",
                        width: "100%",
                        fontWeight: "500",
                        borderBottom: "1px solid #E8E8E8",
                        fontSize: "13px",
                        borderRight:"3px solid #23B364"
                      }}
                    >
                      {" "}
                      {cords.text}
                    </Link>

                        {cords.child.map((ch, ind) => {
                          return (
                            <Link
                              to={ch.path}
                              key={ind}
                              style={{
                                display: "block",
                                marginBlock: "6px",
                                color: "black",
                                padding: "6px 12px",
                                width: "100%",
                                fontSize: "13px",
                                marginLeft: '10px'
                              }}
                              className="hover-children"
                            >
                              {" "}
                              {ch.sidebarProps.displayText}{" "}
                            </Link>
                          );
                        })}
                      </div>
                      <div className={`side-icon-container-1`}>
                       <div  > {item.sidebarProps.icon && item.sidebarProps.icon}</div>
                        {toggleOpen ? null : (
                          <p
                          className={location.pathname === item.path ? "tablink" : "tablinkk"}
                            style={{ color: project ? "#0069A3" : "#101828" }}
                          >
                            {item.sidebarProps.displayText}
                          </p>
                        )}
                      </div>             
                      {project ? (
                        <MdKeyboardArrowUp
                          style={{
                            fontSize: "1.5rem",
                            color: "black",
                          }}
                        />
                      ) : (
                        <MdKeyboardArrowDown
                          style={{ fontSize: "1.5rem", color: "black" }}
                        />
                      )}
                    </Link>
                    {project && (
                      <div className={`side-accordian-item`}>
                        {item?.child?.map((accr, ele) => (
                          <Link
                            key={ele}
                            to={accr?.path}
                            style={{ paddingLeft: toggleOpen ? ".8rem" : "" }}
                            className={`side-icon-container ${
                              location.pathname === accr.path
                                ? "active-link-bg"
                                : ""
                            }`}
                          >
                          
                      <div className={`side-icon-container-1`}>
                      <div className={location.pathname === accr.path ? "ellipseee" : "ellipsee"} >  {accr.sidebarProps.icon && accr.sidebarProps.icon}</div>
                        {toggleOpen ? null : (
                          <p
                          className={location.pathname === accr.path ? "tablink" : "tablinkk"}
                            style={{ color: project ? "#0069A3" : "#101828" }}
                          >
                            {accr.sidebarProps.displayText}
                          </p>
                        )}
                      </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    className="tip"
                    style={{
                      backgroundColor: "#fff",
                      position: "fixed",
                      top: cords.top,
                      left: cords.left,
                      display: cords.opacity && cords.id===5 ? "block" : "none",

                      maxHeight: "300px",
                      minWidth: "150px",
                      overflowY: "scroll",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      borderLeft: "1px solid #D9D9D9",

                      color: "black",
                    }}
                  >

                    <Link
                    to ="#"
                      className=""
                      style={{
                        display: "block",
                        background: "#E1F5EA",
                        padding: "11px 12px",
                        color: "#23B364",
                        width: "100%",
                        fontWeight: "500",
                        borderBottom: "1px solid #E8E8E8",
                        fontSize: "13px",
                        borderRight:"4px solid #23B364"
                      }}
                    >
                      {" "}
                      <GoProjectRoadmap size={20} style={{marginLeft: "3px", flexShrink:"0"}} color="black"/>
                      {cords.text}
                    </Link>
                   

                    {cords.child.map((ch, ind) => {
                      return (
                        <Link
                          key={ind}
                          style={{
                            display: "block",
                            marginBlock: "6px",
                            color: "black",
                            padding: "6px 12px",
                            width: "100%",
                            fontSize: "12px",
                            marginLeft: '10px'
                          }}
                          to={ch.path}
                          className="hover-children"
                        >
                          {" "}
                          {ch.sidebarProps.displayText}{" "}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {el.other?.map((item, index) => (
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
                      onClick={() => {
                        if (!toggleOpen) {
                          setConfigure(!configure);
                        }
                      }}
                      onMouseEnter={(e) =>
                        toggleOpen &&
                        handleMouseover(
                          e,
                          item.sidebarProps.displayText,
                          item.child,
                          6
                        )
                      }
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0, id:-1 }));
                        }, 500);
                      }}
                    >
                      <div className={`side-icon-container-1`}>
                    <div className={location.pathname === item.path ? "sidebaricon" : "sidebariconn"}>{item.sidebarProps.icon && item.sidebarProps.icon}</div>
                        {toggleOpen ? null : (
                          <p
                          className={location.pathname === item.path ? "tablink" : "tablinkk"}
                             
                          >
                            {item.sidebarProps.displayText}
                          </p>
                        )}
                      </div>
                      <div
                        className="tip"
                        style={{
                          backgroundColor: "#fff",
                          position: "fixed",
                          top: cords.top,
                          left: cords.left,
                          display: cords.opacity  && cords.id===6 ? "block" : "none",

                          maxHeight: "300px",
                          minWidth: "150px",
                          overflowY: "scroll",
                          borderTopLeftRadius: "4px",
                          borderTopRightRadius: "4px",
                          borderLeft: "1px solid #D9D9D9",

                          color: "black",
                        }}
                      >
                        <Link
                        to ="#"
                          className=""
                          style={{
                            display: "block",
                            background: "#E1F5EA",
                            padding: "13px 12px",
                            color: "#23B364",
                            width: "100%",
                            fontWeight: "500",
                            borderBottom: "1px solid #E8E8E8",
                            fontSize: "13px",
                            borderRight:"3px solid #23B364"
                          }}
                        >
                          {" "}
                          {cords.text}
                        </Link>

                        {cords.child.map((ch, ind) => {
                          return (
                            <Link
                              key={ind}
                              style={{
                                display: "block",
                                marginBlock: "6px",
                                marginLeft:"10px",
                                color: "black",
                                padding: "6px 12px",
                                width: "100%",
                                fontSize: "12px",
                              }}
                              to={ch.path}
                              className="hover-children"
                            >
                              {" "}
                              {ch.sidebarProps.displayText}{" "}
                            </Link>
                          );
                        })}
                      </div>
                      {configure ? (
                        <MdKeyboardArrowUp
                          style={{
                            fontSize: "1.5rem",
                            color: "black",
                          }}
                        />
                      ) : (
                        <MdKeyboardArrowDown
                          style={{ fontSize: "1.5rem", color: "black" }}
                        />
                      )}
                    </Link>
                    {configure && (
                      <div className={`side-accordian-item`}>
                        {item?.child?.map((accr, ele) => (
                          <Link
                            key={ele}
                            to={accr?.path}
                            style={{ paddingLeft: toggleOpen ? ".8rem" : "" }}
                            className={`side-icon-container ${
                              location.pathname === accr.path
                                ? "active-link-bg"
                                : ""
                            }`}
                            onMouseEnter={(e) =>
                              toggleOpen &&
                              handleMouseover(
                                e,
                                accr.sidebarProps?.displayText,
                                item.child,
                                7
                              )
                            }
                            onMouseLeave={() => {
                              timeOut.current = setTimeout(() => {
                                setCords((prev) => ({ ...prev, opacity: 0, id:-1 }));
                              }, 500);
                            }}
                          >
                            <div className={location.pathname === accr.path ? "sidebaricon" : "sidebariconn"}>{accr.sidebarProps.icon && accr.sidebarProps.icon}</div>
                            {toggleOpen ? null : (
                              <p  className={location.pathname === accr.path ? "tablink" : "tablinkk"}>
                                {accr.sidebarProps?.displayText}  
                              </p>
                            )}
                            <div
                              className="tip"
                              style={{
                                backgroundColor: "#fff",
                                position: "fixed",
                                top: cords.top,
                                left: cords.left,
                                display: cords.opacity && cords.id==7? "block" : "none",

                                maxHeight: "300px",
                                minWidth: "150px",
                                overflowY: "scroll",
                                borderTopLeftRadius: "4px",
                                borderTopRightRadius: "4px",
                                borderLeft: "1px solid #D9D9D9",

                                color: "black",
                              }}
                            >
                              <Link
                              to="#"
                                className=""
                                style={{
                                  display: "block",
                                  background: "#E1F5EA",
                                  padding: "11px 12px",
                                  color: "#23B364",
                                  width: "100%",
                                  fontWeight: "500",
                                  borderBottom: "1px solid #E8E8E8",
                                  fontSize: "13px",
                                  borderRight:"3px solid #23B364"
                                }}
                              >
                                {" "}
                                {cords.text}
                              </Link>

                              {cords.child.map((ch, ind) => {
                                return (
                                  <Link
                                    to={ch.path}
                                    key={ind}
                                    style={{
                                      display: "block",
                                      marginBlock: "6px",
                                      color: "black",
                                      padding: "6px 12px",
                                      width: "100%",
                                      fontSize: "12px",
                                    }}
                                    className="hover-children"
                                  >
                                    {" "}
                                    {ch.sidebarProps.displayText}{" "}
                                  </Link>
                                );
                              })}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="">
                    <Link
                      to={item.path}
                      style={{
                        paddingLeft: toggleOpen ? ".8rem" : "",
                        position: "relative",
                        zIndex: 5,
                      }}
                      onMouseEnter={(e) =>
                        toggleOpen &&
                        handleMouseover(
                          e,
                          item.sidebarProps.displayText,
                          item.child || [],
                          index+8
                        )
                      }
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0 , id:-1}));
                        }, 500);
                      }}
                      className={`side-icon-container ${
                        location.pathname === item.path ? "active-link-bg" : ""
                      }`}
                    >
                    <div className={location.pathname === item.path ? "sidebaricon" : "sidebariconn"}> {item.sidebarProps.icon && item.sidebarProps.icon}</div> 
                      {toggleOpen ? null : (
                        <p  className={location.pathname === item.path ? "tablink" : "tablinkk"}>
                          {item.sidebarProps.displayText}
                        </p>
                      )}
                      <div
                        className="tip"
                        style={{
                          backgroundColor: "#fff",
                          position: "fixed",
                          top: cords.top,
                          left: cords.left,
                          display: cords.opacity && cords.id=== index+8? "block" : "none",

                          maxHeight: "300px",
                          minWidth: "150px",
                          overflowY: "scroll",
                          borderTopLeftRadius: "4px",
                          borderTopRightRadius: "4px",
                          borderLeft: "1px solid #D9D9D9",

                          color: "black",
                        }}
                      >
                        <Link
                        to ="#"
                          className=""
                          style={{
                            display: "block",
                            background: "#E1F5EA",
                            padding: "13.5px 12px",
                            color: "#23B364",
                            width: "100%",
                            fontWeight: "500",
                            borderBottom: "1px solid #E8E8E8",
                            fontSize: "13px",
                            borderRight:"3px solid #23B364"
                          }}
                        >
                          {" "}
                          {cords.text}
                        </Link>

                        {cords.child.map((ch, ind) => {
                          return (
                            <Link
                              to={ch.path}
                              key={ind}
                              style={{
                                display: "block",
                                marginBlock: "6px",

                                color: "black",
                                padding: "6px 12px",
                                width: "100%",
                                fontSize: "12px",
                              }}
                              className="hover-children"
                            >
                              {" "}
                              {ch.sidebarProps.displayText}{" "}
                            </Link>
                          );
                        })}
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

