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
  }>({ left: 0, top: 0, opacity: 0, text: "", child: [] });
  const [configure, setConfigure] = useState<boolean>(false);

  const location = useLocation();
  const timeOut = useRef<NodeJS.Timeout | null>(null);

  const handleMouseover = (
    e: React.MouseEvent<HTMLAnchorElement | MouseEvent>,
    name: string,
    child: Child[]
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
      });
    }
    console.log(name, "containse");
  };

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
                  style={{ fontSize: "1.2rem", color: "black" }}
                />
              ) : (
                <img src={ICONS.menuIcon} alt="" />
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
                    handleMouseover(e, oth.sidebarProps.displayText, [])
                  }
                  onMouseLeave={() => {
                    timeOut.current = setTimeout(() => {
                      setCords((prev) => ({ ...prev, opacity: 0 }));
                    }, 500);
                  }}
                  className={`side-icon-container ${
                    location.pathname === oth.path ? "active-link-bg" : ""
                  }`}
                >
                  {oth.sidebarProps.icon && oth.sidebarProps.icon}
                  {toggleOpen ? null : (
                    <Link to={oth.path}>
                      {" "}
                      <p className={`tablink`}>
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
                      display: cords.opacity ? "block" : "none",
                      maxHeight: "300px",
                      minWidth: "150px",
                      overflowY: "scroll",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      borderLeft: "1px solid #D9D9D9",
                      color: "black",
                    }}
                  >
                    <span
                      className=""
                      style={{
                        display: "block",
                        background: "#EFEFEF",
                        padding: "8px 12px",
                        color: "black",
                        width: "100%",
                        fontWeight: "500",
                        borderBottom: "1px solid #E8E8E8",
                        fontSize: "12px",
                      }}
                    >
                      {" "}
                      {cords.text}
                    </span>

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
                    handleMouseover(e, oth.sidebarProps.displayText, [])
                  }
                  onMouseLeave={() => {
                    timeOut.current = setTimeout(() => {
                      setCords((prev) => ({ ...prev, opacity: 0 }));
                    }, 500);
                  }}
                  className={`side-icon-container ${
                    location.pathname === oth.path ? "active-link-bg" : ""
                  }`}
                >
                  {oth.sidebarProps.icon && oth.sidebarProps.icon}
                  {toggleOpen ? null : (
                    <p className={`tablink`}>{oth.sidebarProps.displayText}</p>
                  )}

                  <div
                    className="tip"
                    style={{
                      backgroundColor: "#fff",
                      position: "fixed",
                      top: cords.top,
                      left: cords.left,
                      display: cords.opacity ? "block" : "none",

                      maxHeight: "300px",
                      minWidth: "150px",
                      overflowY: "scroll",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      borderLeft: "1px solid #D9D9D9",

                      color: "black",
                    }}
                  >
                    <span
                      className=""
                      style={{
                        display: "block",
                        background: "#EFEFEF",
                        padding: "8px 12px",
                        color: "black",
                        width: "100%",
                        fontWeight: "500",
                        borderBottom: "1px solid #E8E8E8",
                        fontSize: "12px",
                      }}
                    >
                      {" "}
                      {cords.text}
                    </span>

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
                    handleMouseover(e, oth.sidebarProps.displayText, [])
                  }
                  onMouseLeave={() => {
                    timeOut.current = setTimeout(() => {
                      setCords((prev) => ({ ...prev, opacity: 0 }));
                    }, 500);
                  }}
                  className={`side-icon-container ${
                    location.pathname === oth.path ? "active-link-bg" : ""
                  }`}
                >
                  {oth.sidebarProps.icon && oth.sidebarProps.icon}
                  {toggleOpen ? null : (
                    <p className={`tablink`}>{oth.sidebarProps.displayText}</p>
                  )}
                  <div
                    className="tip"
                    style={{
                      backgroundColor: "#fff",
                      position: "fixed",
                      top: cords.top,
                      left: cords.left,
                      display: cords.opacity ? "block" : "none",

                      maxHeight: "300px",
                      minWidth: "150px",
                      overflowY: "scroll",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      borderLeft: "1px solid #D9D9D9",

                      color: "black",
                    }}
                  >
                    <span
                      className=""
                      style={{
                        display: "block",
                        background: "#EFEFEF",
                        padding: "8px 12px",
                        color: "black",
                        width: "100%",
                        fontWeight: "500",
                        borderBottom: "1px solid #E8E8E8",
                        fontSize: "12px",
                      }}
                    >
                      {" "}
                      {cords.text}
                    </span>

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
                          item.child
                        )
                      }
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0 }));
                        }, 500);
                      }}
                    >
                      <div className={`side-icon-container-1`}>
                        {item.sidebarProps.icon && item.sidebarProps.icon}
                        {toggleOpen ? null : (
                          <p
                            className={`tablink`}
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
                          display: cords.opacity ? "block" : "none",

                          maxHeight: "300px",
                          minWidth: "150px",
                          overflowY: "scroll",
                          borderTopLeftRadius: "4px",
                          borderTopRightRadius: "4px",
                          borderLeft: "1px solid #D9D9D9",

                          color: "black",
                        }}
                      >
                        <span
                          className=""
                          style={{
                            display: "block",
                            background: "#EFEFEF",
                            padding: "8px 12px",
                            color: "black",
                            width: "100%",
                            fontWeight: "500",
                            borderBottom: "1px solid #E8E8E8",
                            fontSize: "12px",
                          }}
                        >
                          {" "}
                          {cords.text}
                        </span>

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
                            color: colorConfig.sidebar.activeBg,
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
                      style={{
                        paddingLeft: toggleOpen ? ".8rem" : "",
                        position: "relative",
                        zIndex: 5,
                      }}
                      className={`side-icon-container ${
                        location.pathname === item.path ? "active-link-bg" : ""
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
                          item.child
                        )
                      }
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0 }));
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
                          display: cords.opacity ? "block" : "none",

                          maxHeight: "300px",
                          minWidth: "150px",
                          overflowY: "scroll",
                          borderTopLeftRadius: "4px",
                          borderTopRightRadius: "4px",
                          borderLeft: "1px solid #D9D9D9",

                          color: "black",
                        }}
                      >
                        <span
                          className=""
                          style={{
                            display: "block",
                            background: "#EFEFEF",
                            padding: "8px 12px",
                            color: "black",
                            width: "100%",
                            fontWeight: "500",
                            borderBottom: "1px solid #E8E8E8",
                            fontSize: "12px",
                          }}
                        >
                          {" "}
                          {cords.text}
                        </span>

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
                            >
                              {" "}
                              {ch.sidebarProps.displayText}{" "}
                            </Link>
                          );
                        })}
                      </div>
                      <div className={`side-icon-container-1`}>
                        {item.sidebarProps.icon && item.sidebarProps.icon}
                        {toggleOpen ? null : (
                          <p
                            className={`tablink`}
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
                            color: colorConfig.sidebar.activeBg,
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
                  <div
                    className="tip"
                    style={{
                      backgroundColor: "#fff",
                      position: "fixed",
                      top: cords.top,
                      left: cords.left,
                      display: cords.opacity ? "block" : "none",

                      maxHeight: "300px",
                      minWidth: "150px",
                      overflowY: "scroll",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                      borderLeft: "1px solid #D9D9D9",

                      color: "black",
                    }}
                  >
                    <span
                      className=""
                      style={{
                        display: "block",
                        background: "#EFEFEF",
                        padding: "8px 12px",
                        color: "black",
                        width: "100%",
                        fontWeight: "500",
                        borderBottom: "1px solid #E8E8E8",
                        fontSize: "12px",
                      }}
                    >
                      {" "}
                      {cords.text}
                    </span>

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
                          }}
                          to={ch.path}
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
                          item.child
                        )
                      }
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0 }));
                        }, 500);
                      }}
                    >
                      <div className={`side-icon-container-1`}>
                        {item.sidebarProps.icon && item.sidebarProps.icon}
                        {toggleOpen ? null : (
                          <p
                            className={`tablink`}
                            style={{ color: project ? "#0069A3" : "#101828" }}
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
                          display: cords.opacity ? "block" : "none",

                          maxHeight: "300px",
                          minWidth: "150px",
                          overflowY: "scroll",
                          borderTopLeftRadius: "4px",
                          borderTopRightRadius: "4px",
                          borderLeft: "1px solid #D9D9D9",

                          color: "black",
                        }}
                      >
                        <span
                          className=""
                          style={{
                            display: "block",
                            background: "#EFEFEF",
                            padding: "8px 12px",
                            color: "black",
                            width: "100%",
                            fontWeight: "500",
                            borderBottom: "1px solid #E8E8E8",
                            fontSize: "12px",
                          }}
                        >
                          {" "}
                          {cords.text}
                        </span>

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
                              }}
                              to={ch.path}
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
                            color: colorConfig.sidebar.activeBg,
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
                                item.child
                              )
                            }
                            onMouseLeave={() => {
                              timeOut.current = setTimeout(() => {
                                setCords((prev) => ({ ...prev, opacity: 0 }));
                              }, 500);
                            }}
                          >
                            {accr.sidebarProps.icon && accr.sidebarProps.icon}
                            {toggleOpen ? null : (
                              <p className={`tablink`}>
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
                                display: cords.opacity ? "block" : "none",

                                maxHeight: "300px",
                                minWidth: "150px",
                                overflowY: "scroll",
                                borderTopLeftRadius: "4px",
                                borderTopRightRadius: "4px",
                                borderLeft: "1px solid #D9D9D9",

                                color: "black",
                              }}
                            >
                              <span
                                className=""
                                style={{
                                  display: "block",
                                  background: "#EFEFEF",
                                  padding: "8px 12px",
                                  color: "black",
                                  width: "100%",
                                  fontWeight: "500",
                                  borderBottom: "1px solid #E8E8E8",
                                  fontSize: "12px",
                                }}
                              >
                                {" "}
                                {cords.text}
                              </span>

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
                          item.child || []
                        )
                      }
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0 }));
                        }, 500);
                      }}
                      className={`side-icon-container ${
                        location.pathname === item.path ? "active-link-bg" : ""
                      }`}
                    >
                      {item.sidebarProps.icon && item.sidebarProps.icon}
                      {toggleOpen ? null : (
                        <p className={`tablink`}>
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
                          display: cords.opacity ? "block" : "none",

                          maxHeight: "300px",
                          minWidth: "150px",
                          overflowY: "scroll",
                          borderTopLeftRadius: "4px",
                          borderTopRightRadius: "4px",
                          borderLeft: "1px solid #D9D9D9",

                          color: "black",
                        }}
                      >
                        <span
                          className=""
                          style={{
                            display: "block",
                            background: "#EFEFEF",
                            padding: "8px 12px",
                            color: "black",
                            width: "100%",
                            fontWeight: "500",
                            borderBottom: "1px solid #E8E8E8",
                            fontSize: "12px",
                          }}
                        >
                          {" "}
                          {cords.text}
                        </span>

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
