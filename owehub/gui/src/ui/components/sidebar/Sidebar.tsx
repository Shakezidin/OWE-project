import React, { useEffect, useRef, useState } from 'react';
import './sidebar.css';
import { ICONS } from '../../icons/Icons';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlinePayment } from 'react-icons/md';
import { FiLayers } from 'react-icons/fi';
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdKeyboardArrowUp,
} from 'react-icons/md';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { LuWallet } from 'react-icons/lu';
import { createSideMenuList } from '../../../routes/SideMenuOption';
import { GrDocumentPerformance } from 'react-icons/gr';
import { AiOutlineProject } from 'react-icons/ai';
import useMatchMedia from '../../../hooks/useMatchMedia';

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

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

const Sidebar: React.FC<Toggleprops> = ({ toggleOpen, setToggleOpen }) => {
  const [repay, setRepay] = useState<boolean>(false);
  const [db, setDb] = useState<boolean>(false);
  const [project, setProject] = useState<boolean>(false);

  const [cords, setCords] = useState<{
    left: number;
    top: number;
    opacity: number;
    text: string;
    child: Child[];
    id?: number;
  }>({ left: 0, top: 0, opacity: 0, text: '', child: [], id: -1 });
  const isTablet = useMatchMedia('(max-width: 1024px)');
  const location = useLocation();
  const timeOut = useRef<NodeJS.Timeout | null>(null);

  const handleMouseover = (
    e: React.MouseEvent<HTMLAnchorElement | MouseEvent>,
    name: string,
    child: Child[],
    id?: number
  ) => {
    const elm = e.target as HTMLAnchorElement;
    console.log('working', id, 'didiididid');

    if (timeOut.current) {
      clearTimeout(timeOut.current);
    }
    if (
      elm.classList.contains('side-icon-container') ||
      elm.classList.contains('side-accordian') ||
      elm.classList.contains('side-icon-container-1')
    ) {
      const co = elm.getBoundingClientRect();
      setCords({
        top: co.top,
        left: co.width + co.left,
        opacity: 1,
        text: name,
        child,
        id,
      });
    }
  };

  useEffect(() => {
    if (toggleOpen) {
      setDb(false);
      setProject(false);
    }
  }, [toggleOpen]);

  const width = useWindowWidth();

  // TODO showing required routes for now
  // const isMobile = width < 768;
  const isMobile = true;

  return (
    <div
      style={{ zIndex: '30' }}
      className={`side-bar-container ${toggleOpen ? 'side-bar-active hidden' : 'show'}`}
    >
      <div
        className={`side-bar-content ${
          toggleOpen ? 'side-bar-content-active' : ''
        }`}
        style={{ paddingInline: !toggleOpen ? 10 : '' }}
      >
        {createSideMenuList().map((el, i) => (
          <div className="" key={i}>
            {!isMobile && (
              <>
                <div
                  className=""
                  style={{ marginTop: toggleOpen ? 0 : '.4rem' }}
                >
                  {el.performance?.map((oth: any, index: number) => (
                    <Link
                      key={index}
                      style={{ paddingLeft: toggleOpen ? '.8rem' : '' }}
                      to={oth.path}
                      onMouseEnter={(e) =>
                        toggleOpen &&
                        handleMouseover(e, oth.sidebarProps.displayText, [], 1)
                      }
                      onClick={() => isTablet && setToggleOpen((prev) => !prev)}
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0, id: -1 }));
                        }, 500);
                      }}
                      className={`side-icon-container ${
                        location.pathname === oth.path
                          ? 'active-link-bg'
                          : 'not-active-link'
                      }`}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          background:
                            toggleOpen && location.pathname === oth.path
                              ? ''
                              : toggleOpen
                                ? 'transparent'
                                : 'transparent',
                        }}
                      >
                        <GrDocumentPerformance
                          size={20}
                          style={{ marginLeft: !toggleOpen ? '5px' : '' }}
                          className={
                            location.pathname === oth.path
                              ? 'sidebaricon'
                              : 'sidebariconn'
                          }
                        />
                      </div>

                      {toggleOpen && !isTablet ? null : (
                        <Link to={oth.path}>
                          {' '}
                          <p
                            className={
                              location.pathname === oth.path
                                ? 'tablink'
                                : 'tablinkk'
                            }
                          >
                            {oth.sidebarProps.displayText}
                          </p>
                        </Link>
                      )}

                      <div
                        className="tip"
                        style={{
                          backgroundColor: '#fff',
                          position: 'fixed',
                          top: cords.top,
                          left: cords.left,
                          display:
                            cords.opacity && cords.id === 1 ? 'block' : 'none',
                          maxHeight: '300px',
                          minWidth: '150px',
                          overflowY: 'scroll',
                          borderBottomRightRadius: '4px',
                          borderTopRightRadius: '4px',
                          borderLeft: '1px solid #D9D9D9',
                          // color: "#092D04",
                        }}
                      >
                        <Link
                          to="#"
                          className=""
                          style={{
                            display: 'block',
                            background: '#377CF6',
                            padding: '11px 12px',
                            color: 'white',
                            width: '100%',
                            fontWeight: '500',
                            borderBottom: '1px solid #E8E8E8',
                            fontSize: '13px',
                            // borderRight: "3px solid #377CF6",
                            cursor: 'default',
                            pointerEvents: 'none',
                          }}
                        >
                          {' '}
                          {cords.text}
                        </Link>
                      </div>
                    </Link>
                  ))}
                </div>

                <div
                  className=""
                  style={{ marginTop: toggleOpen ? 0 : '.4rem' }}
                >
                  {el.commission?.map((oth: any, index: number) => (
                    <Link
                      key={index}
                      style={{ paddingLeft: toggleOpen ? '.8rem' : '' }}
                      to={oth.path}
                      onMouseEnter={(e) =>
                        toggleOpen &&
                        !isTablet &&
                        handleMouseover(e, oth.sidebarProps.displayText, [], 2)
                      }
                      onClick={() => isTablet && setToggleOpen((prev) => !prev)}
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0, id: -1 }));
                        }, 500);
                      }}
                      className={`side-icon-container ${
                        location.pathname === oth.path
                          ? 'active-link-bg'
                          : 'not-active-link'
                      }`}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          background:
                            toggleOpen && location.pathname === oth.path
                              ? ''
                              : toggleOpen
                                ? 'transparent'
                                : 'transparent',
                        }}
                      >
                        <MdOutlinePayment
                          size={20}
                          style={{ marginLeft: !toggleOpen ? '5px' : '' }}
                          className={
                            location.pathname === oth.path
                              ? 'sidebaricon'
                              : 'sidebariconn'
                          }
                        />
                      </div>

                      {toggleOpen && !isTablet ? null : (
                        <Link to={oth.path}>
                          {' '}
                          <p
                            className={
                              location.pathname === oth.path
                                ? 'tablink'
                                : 'tablinkk'
                            }
                          >
                            {oth.sidebarProps.displayText}
                          </p>
                        </Link>
                      )}

                      <div
                        className="tip"
                        style={{
                          backgroundColor: '#fff',
                          position: 'fixed',
                          top: cords.top,
                          left: cords.left,
                          display:
                            cords.opacity && cords.id === 2 ? 'block' : 'none',
                          maxHeight: '300px',
                          minWidth: '150px',
                          overflowY: 'scroll',
                          borderBottomRightRadius: '4px',
                          borderTopRightRadius: '4px',
                          borderLeft: '1px solid #D9D9D9',
                          // color: "#092D04",
                        }}
                      >
                        <Link
                          to="#"
                          className=""
                          style={{
                            display: 'block',
                            background: '#377CF6',
                            padding: '11px 12px',
                            color: 'white',
                            width: '100%',
                            fontWeight: '500',
                            borderBottom: '1px solid #E8E8E8',
                            fontSize: '13px',
                            // borderRight: "3px solid #377CF6",
                            cursor: 'default',
                            pointerEvents: 'none',
                          }}
                        >
                          {' '}
                          {cords.text}
                        </Link>
                      </div>
                    </Link>
                  ))}
                </div>

                <div
                  className=""
                  style={{ marginTop: toggleOpen ? 0 : '.4rem' }}
                >
                  {el.repay?.map((oth: any, index: number) => (
                    <Link
                      key={index}
                      style={{ paddingLeft: toggleOpen ? '.8rem' : '' }}
                      to={oth.path}
                      onMouseEnter={(e) =>
                        toggleOpen &&
                        handleMouseover(e, oth.sidebarProps.displayText, [], 2)
                      }
                      onClick={() => isTablet && setToggleOpen((prev) => !prev)}
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0, id: -1 }));
                        }, 500);
                      }}
                      className={`side-icon-container ${
                        location.pathname === oth.path
                          ? 'active-link-bg'
                          : 'not-active-link'
                      }`}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          background:
                            toggleOpen && location.pathname === oth.path
                              ? ''
                              : toggleOpen
                                ? 'transparent'
                                : 'transparent',
                        }}
                      >
                        <LuWallet
                          size={20}
                          style={{ marginLeft: !toggleOpen ? '5px' : '' }}
                          className={
                            location.pathname === oth.path
                              ? 'sidebaricon'
                              : 'sidebariconn'
                          }
                        />
                      </div>

                      {/* {oth.sidebarProps.icon && oth.sidebarProps.icon} */}
                      {(!toggleOpen || isTablet) && (
                        <p
                          className={
                            location.pathname === oth.path
                              ? 'tablink'
                              : 'tablinkk'
                          }
                        >
                          {oth.sidebarProps.displayText}
                        </p>
                      )}

                      <div
                        className="tip"
                        style={{
                          backgroundColor: '#fff',
                          position: 'fixed',
                          top: cords.top,
                          left: cords.left,
                          display:
                            cords.opacity && cords.id === 2 ? 'block' : 'none',

                          maxHeight: '300px',
                          minWidth: '150px',
                          overflowY: 'scroll',
                          borderBottomRightRadius: '4px',
                          borderTopRightRadius: '4px',
                          borderLeft: '1px solid #D9D9D9',

                          color: 'black',
                        }}
                      >
                        <Link
                          to="#"
                          className=""
                          style={{
                            display: 'block',
                            background: '#377CF6',
                            padding: '11px 12px',
                            color: 'white',
                            width: '100%',
                            fontWeight: '500',
                            borderBottom: '1px solid #E8E8E8',
                            fontSize: '13px',
                            // borderRight: "3px solid #377CF6",
                            cursor: 'default',
                            pointerEvents: 'none',
                          }}
                        >
                          {' '}
                          {cords.text}
                        </Link>
                      </div>
                    </Link>
                  ))}
                </div>

                <div
                  className=""
                  style={{ marginTop: toggleOpen ? 0 : '.2rem' }}
                >
                  {el.ar?.map((oth: any, index: number) => (
                    <Link
                      key={index}
                      style={{ paddingLeft: toggleOpen ? '.8rem' : '' }}
                      to={oth.path}
                      onClick={() => isTablet && setToggleOpen((prev) => !prev)}
                      onMouseEnter={(e) =>
                        toggleOpen &&
                        !isTablet &&
                        handleMouseover(e, oth.sidebarProps.displayText, [], 3)
                      }
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0, id: -1 }));
                        }, 500);
                      }}
                      className={`side-icon-container ${
                        location.pathname === oth.path
                          ? 'active-link-bg'
                          : 'not-active-link'
                      }`}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          background:
                            toggleOpen && location.pathname === oth.path
                              ? ''
                              : toggleOpen
                                ? 'transparent'
                                : 'transparent',
                        }}
                      >
                        <FiLayers
                          size={20}
                          style={{ marginLeft: !toggleOpen ? '5px' : '' }}
                          className={
                            location.pathname === oth.path
                              ? 'sidebaricon'
                              : 'sidebariconn'
                          }
                        />
                      </div>
                      {toggleOpen && !isTablet ? null : (
                        <p
                          className={
                            location.pathname === oth.path
                              ? 'tablink'
                              : 'tablinkk'
                          }
                        >
                          {oth.sidebarProps.displayText}
                        </p>
                      )}
                      <div
                        className="tip"
                        style={{
                          backgroundColor: '#fff',
                          position: 'fixed',
                          top: cords.top,
                          left: cords.left,
                          display:
                            cords.opacity && cords.id === 3 ? 'block' : 'none',

                          maxHeight: '300px',
                          minWidth: '150px',
                          overflowY: 'scroll',
                          borderBottomRightRadius: '4px',
                          borderTopRightRadius: '4px',
                          borderLeft: '1px solid #D9D9D9',

                          color: 'black',
                        }}
                      >
                        <Link
                          to="#"
                          className=""
                          style={{
                            display: 'block',
                            background: '#377CF6',
                            padding: '11px 12px',
                            color: 'white',
                            width: '100%',
                            fontWeight: '500',
                            borderBottom: '1px solid #E8E8E8',
                            fontSize: '13px',
                            // borderRight: "3px solid #377CF6",
                            cursor: 'default',
                            pointerEvents: 'none',
                          }}
                        >
                          {' '}
                          {cords.text}
                        </Link>
                      </div>
                    </Link>
                  ))}
                </div>

                {el.db?.map((item: any, index: number) => (
                  <div key={index}>
                    {item.child ? (
                      <>
                        <Link
                          to={item.path}
                          style={{
                            paddingLeft: toggleOpen ? '.8rem' : '',
                            cursor: 'pointer',
                          }}
                          className={`side-accordian`}
                          onClick={() => {
                            if (!toggleOpen) {
                              setDb(!db);
                            }
                          }}
                          onMouseEnter={(e) =>
                            toggleOpen &&
                            !isTablet &&
                            handleMouseover(
                              e,
                              item.sidebarProps.displayText,
                              item.child,
                              4
                            )
                          }
                          onMouseLeave={() => {
                            timeOut.current = setTimeout(() => {
                              setCords((prev) => ({
                                ...prev,
                                opacity: 0,
                                id: -1,
                              }));
                            }, 500);
                          }}
                        >
                          <div className={`side-icon-container-1`}>
                            <div
                              className=""
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                width: 24,
                                height: 24,
                                borderRadius: 4,
                                marginLeft: !toggleOpen ? '' : '-1px',
                                background:
                                  toggleOpen && location.pathname === item.path
                                    ? ''
                                    : toggleOpen
                                      ? 'transparent'
                                      : 'transparent',
                                // marginLeft: "3px",
                              }}
                            >
                              {' '}
                              {item.sidebarProps.icon && item.sidebarProps.icon}
                            </div>
                            {toggleOpen && !isTablet ? null : (
                              <p
                                className={`tablinkk`}
                                style={{ color: repay ? '#0069A3' : '#101828' }}
                              >
                                {item.sidebarProps.displayText}
                              </p>
                            )}
                          </div>

                          <div
                            className="tip"
                            style={{
                              backgroundColor: '#fff',
                              position: 'fixed',
                              top: cords.top,
                              left: cords.left,
                              display:
                                cords.opacity && cords.id === 4
                                  ? 'block'
                                  : 'none',
                              maxHeight: '300px',
                              minWidth: '150px',
                              overflowY: 'scroll',
                              borderTopLeftRadius: '4px',
                              borderTopRightRadius: '4px',
                              borderLeft: '1px solid #D9D9D9',
                              color: 'black',
                            }}
                          >
                            <Link
                              to="#"
                              className=""
                              style={{
                                display: 'block',
                                background: '#377CF6',
                                padding: '13.5px 12px',
                                color: 'white',
                                width: '100%',
                                fontWeight: '500',
                                borderBottom: '1px solid #E8E8E8',
                                fontSize: '13px',
                                // borderRight: "3px solid #377CF6",
                                cursor: 'default',
                              }}
                            >
                              {' '}
                              {cords.text}
                            </Link>

                            {cords.child.map((ch, ind) => {
                              return (
                                <Link
                                  to={ch.path}
                                  key={ind}
                                  onClick={() =>
                                    isTablet && setToggleOpen((prev) => !prev)
                                  }
                                  style={{
                                    display: 'block',
                                    marginBlock: '6px',

                                    padding: '6px 12px',
                                    width: '100%',
                                    fontSize: '12px',
                                    marginLeft: '10px',
                                  }}
                                  className={
                                    location.pathname === ch.path
                                      ? 'hover-children'
                                      : 'hover-childrenn'
                                  }
                                >
                                  {' '}
                                  {ch.sidebarProps.displayText}{' '}
                                </Link>
                              );
                            })}
                          </div>
                          {db ? (
                            <MdKeyboardArrowUp
                              style={{
                                fontSize: '1.5rem',
                                color: 'black',
                              }}
                            />
                          ) : (
                            <MdKeyboardArrowDown
                              style={{ fontSize: '1.5rem', color: 'black' }}
                            />
                          )}
                        </Link>
                        {db && (
                          <div className={`side-accordian-item`}>
                            {item?.child?.map((accr: any, ele: number) => (
                              <Link
                                key={ele}
                                to={accr?.path}
                                onClick={() =>
                                  isTablet && setToggleOpen((prev) => !prev)
                                }
                                style={{
                                  paddingLeft: toggleOpen ? '.8rem' : '',
                                }}
                                className={`side-icon-container ${
                                  location.pathname === accr.path
                                    ? 'active-link-bg'
                                    : 'not-active-link'
                                }`}
                              >
                                <div>{accr.sidebarProps.icon}</div>
                                {toggleOpen && !isTablet ? null : (
                                  <p
                                    className={
                                      location.pathname === accr.path
                                        ? 'tablink'
                                        : 'tablinkk'
                                    }
                                  >
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
                            paddingLeft: toggleOpen ? '.8rem' : '',
                            position: 'relative',
                            zIndex: 5,
                          }}
                          className={`side-icon-container ${
                            location.pathname === item.path
                              ? 'active-link-bg'
                              : ''
                          }`}
                        >
                          <div></div>
                          {toggleOpen && !isTablet ? null : (
                            <p className={`tablink`}>
                              {item.sidebarProps.displayText}
                            </p>
                          )}
                        </Link>
                      </div>
                    )}
                  </div>
                ))}

                <div
                  className=""
                  style={{ marginTop: toggleOpen ? 0 : '.2rem' }}
                >
                  {el.project?.map((oth: any, index: number) => (
                    <Link
                      key={index}
                      style={{ paddingLeft: toggleOpen ? '.8rem' : '' }}
                      to={oth.path}
                      onMouseEnter={(e) =>
                        toggleOpen &&
                        !isTablet &&
                        handleMouseover(e, oth.sidebarProps.displayText, [], 3)
                      }
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0, id: -1 }));
                        }, 500);
                      }}
                      onClick={() => isTablet && setToggleOpen((prev) => !prev)}
                      className={`side-icon-container ${
                        location.pathname === oth.path
                          ? 'active-link-bg'
                          : 'not-active-link'
                      }`}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          background:
                            toggleOpen && location.pathname === oth.path
                              ? ''
                              : toggleOpen
                                ? 'transparent'
                                : 'transparent',
                        }}
                      >
                        <AiOutlineProject
                          size={20}
                          style={{ marginLeft: !toggleOpen ? '5px' : '' }}
                          className={
                            location.pathname === oth.path
                              ? 'sidebaricon'
                              : 'sidebariconn'
                          }
                        />
                      </div>
                      {toggleOpen && !isTablet ? null : (
                        <p
                          className={
                            location.pathname === oth.path
                              ? 'tablink'
                              : 'tablinkk'
                          }
                        >
                          {oth.sidebarProps.displayText}
                        </p>
                      )}
                      <div
                        className="tip"
                        style={{
                          backgroundColor: '#fff',
                          position: 'fixed',
                          top: cords.top,
                          left: cords.left,
                          display:
                            cords.opacity && cords.id === 3 ? 'block' : 'none',

                          maxHeight: '300px',
                          minWidth: '150px',
                          overflowY: 'scroll',
                          borderBottomRightRadius: '4px',
                          borderTopRightRadius: '4px',
                          borderLeft: '1px solid #D9D9D9',
                          color: 'black',
                        }}
                      >
                        <Link
                          to="#"
                          className=""
                          style={{
                            display: 'block',
                            background: '#377CF6',
                            padding: '11px 12px',
                            color: 'white',
                            width: '100%',
                            fontWeight: '500',
                            borderBottom: '1px solid #E8E8E8',
                            fontSize: '13px',
                            // borderRight: "3px solid #377CF6",
                            cursor: 'default',
                            pointerEvents: 'none',
                          }}
                        >
                          {' '}
                          {cords.text}
                        </Link>
                      </div>
                    </Link>
                  ))}
                </div>

                <div
                  className=""
                  style={{ marginTop: toggleOpen ? 0 : '-2px' }}
                >
                  {el.other?.map((oth: any, index: number) => (
                    <Link
                      key={index}
                      style={{ paddingLeft: toggleOpen ? '.8rem' : '' }}
                      to={oth.path}
                      onClick={() => isTablet && setToggleOpen((prev) => !prev)}
                      onMouseEnter={(e) =>
                        toggleOpen &&
                        !isTablet &&
                        handleMouseover(
                          e,
                          oth.sidebarProps.displayText,
                          [],
                          index + 8
                        )
                      }
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0, id: -1 }));
                        }, 500);
                      }}
                      className={`side-icon-container ${
                        location.pathname === oth.path
                          ? 'active-link-bg'
                          : 'not-active-link'
                      }`}
                    >
                      <div
                        className={
                          location.pathname === oth.path
                            ? 'sidebaricon'
                            : 'sidebariconn'
                        }
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          marginLeft: !toggleOpen ? '' : '-1px',
                          background:
                            toggleOpen && location.pathname === oth.path
                              ? ''
                              : toggleOpen
                                ? 'transparent'
                                : 'transparent',
                        }}
                      >
                        {oth.sidebarProps.icon && oth.sidebarProps.icon}
                      </div>

                      {toggleOpen && !isTablet ? null : (
                        <p
                          className={
                            location.pathname === oth.path
                              ? 'tablink'
                              : 'tablinkk'
                          }
                        >
                          {oth.sidebarProps.displayText}
                        </p>
                      )}
                      <div
                        className="tip"
                        style={{
                          backgroundColor: '#fff',
                          position: 'fixed',
                          top: cords.top,
                          left: cords.left,
                          display:
                            cords.opacity && cords.id === index + 8
                              ? 'block'
                              : 'none',

                          maxHeight: '300px',
                          minWidth: '150px',
                          overflowY: 'scroll',
                          borderBottomRightRadius: '4px',
                          borderTopRightRadius: '4px',
                          borderLeft: '1px solid #D9D9D9',
                          color: 'black',
                        }}
                      >
                        <Link
                          to="#"
                          className=""
                          style={{
                            display: 'block',
                            background: '#377CF6',
                            padding: '11px 12px',
                            color: 'white',
                            width: '100%',
                            fontWeight: '500',
                            borderBottom: '1px solid #E8E8E8',
                            fontSize: '13px',
                            // borderRight: "3px solid #377CF6",
                            cursor: 'default',
                            pointerEvents: 'none',
                          }}
                        >
                          {' '}
                          {cords.text}
                        </Link>
                      </div>
                    </Link>
                  ))}
                </div>

                <div
                  className=""
                  style={{ marginTop: toggleOpen ? 0 : '-2px' }}
                >
                  {el.leaderboard?.map((oth: any, index: number) => (
                    <Link
                      key={index}
                      style={{ paddingLeft: toggleOpen ? '.8rem' : '' }}
                      to={oth.path}
                      onClick={() => isTablet && setToggleOpen((prev) => !prev)}
                      onMouseEnter={(e) =>
                        toggleOpen &&
                        !isTablet &&
                        handleMouseover(
                          e,
                          oth.sidebarProps.displayText,
                          [],
                          index + 8
                        )
                      }
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0, id: -1 }));
                        }, 500);
                      }}
                      className={`side-icon-container ${
                        location.pathname === oth.path
                          ? 'active-link-bg'
                          : 'not-active-link'
                      }`}
                    >
                      <div
                        className={
                          location.pathname === oth.path
                            ? 'sidebaricon'
                            : 'sidebariconn'
                        }
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          marginLeft: !toggleOpen ? '' : '-1px',
                          background:
                            toggleOpen && location.pathname === oth.path
                              ? ''
                              : toggleOpen
                                ? 'transparent'
                                : 'transparent',
                        }}
                      >
                        {oth.sidebarProps.icon && oth.sidebarProps.icon}
                      </div>

                      {toggleOpen && !isTablet ? null : (
                        <p
                          className={
                            location.pathname === oth.path
                              ? 'tablink'
                              : 'tablinkk'
                          }
                        >
                          {oth.sidebarProps.displayText}
                        </p>
                      )}
                      <div
                        className="tip"
                        style={{
                          backgroundColor: '#fff',
                          position: 'fixed',
                          top: cords.top,
                          left: cords.left,
                          display:
                            cords.opacity && cords.id === index + 8
                              ? 'block'
                              : 'none',

                          maxHeight: '300px',
                          minWidth: '150px',
                          overflowY: 'scroll',
                          borderBottomRightRadius: '4px',
                          borderTopRightRadius: '4px',
                          borderLeft: '1px solid #D9D9D9',
                          color: 'black',
                        }}
                      >
                        <Link
                          to="#"
                          className=""
                          style={{
                            display: 'block',
                            background: '#377CF6',
                            padding: '11px 12px',
                            color: 'white',
                            width: '100%',
                            fontWeight: '500',
                            borderBottom: '1px solid #E8E8E8',
                            fontSize: '13px',
                            // borderRight: "3px solid #377CF6",
                            cursor: 'default',
                            pointerEvents: 'none',
                          }}
                        >
                          {' '}
                          {cords.text}
                        </Link>
                      </div>
                    </Link>
                  ))}
                </div>

                <div
                  className=""
                  style={{ marginTop: toggleOpen ? 0 : '-2px' }}
                >
                  {el.support?.map((oth: any, index: number) => (
                    <Link
                      key={index}
                      style={{ paddingLeft: toggleOpen ? '.8rem' : '' }}
                      to={oth.path}
                      onClick={() => isTablet && setToggleOpen((prev) => !prev)}
                      onMouseEnter={(e) =>
                        toggleOpen &&
                        !isTablet &&
                        handleMouseover(
                          e,
                          oth.sidebarProps.displayText,
                          [],
                          index + 8
                        )
                      }
                      onMouseLeave={() => {
                        timeOut.current = setTimeout(() => {
                          setCords((prev) => ({ ...prev, opacity: 0, id: -1 }));
                        }, 500);
                      }}
                      className={`side-icon-container ${
                        location.pathname === oth.path
                          ? 'active-link-bg'
                          : 'not-active-link'
                      }`}
                    >
                      <div
                        className={
                          location.pathname === oth.path
                            ? 'sidebaricon'
                            : 'sidebariconn'
                        }
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          marginLeft: !toggleOpen ? '' : '-1px',
                          background:
                            toggleOpen && location.pathname === oth.path
                              ? ''
                              : toggleOpen
                                ? 'transparent'
                                : 'transparent',
                        }}
                      >
                        {oth.sidebarProps.icon && oth.sidebarProps.icon}
                      </div>

                      {toggleOpen && !isTablet ? null : (
                        <p
                          className={
                            location.pathname === oth.path
                              ? 'tablink'
                              : 'tablinkk'
                          }
                        >
                          {oth.sidebarProps.displayText}
                        </p>
                      )}
                      <div
                        className="tip"
                        style={{
                          backgroundColor: '#fff',
                          position: 'fixed',
                          top: cords.top,
                          left: cords.left,
                          display:
                            cords.opacity && cords.id === index + 8
                              ? 'block'
                              : 'none',

                          maxHeight: '300px',
                          minWidth: '150px',
                          overflowY: 'scroll',
                          borderBottomRightRadius: '4px',
                          borderTopRightRadius: '4px',
                          borderLeft: '1px solid #D9D9D9',
                          color: 'black',
                        }}
                      >
                        <Link
                          to="#"
                          className=""
                          style={{
                            display: 'block',
                            background: '#377CF6',
                            padding: '11px 12px',
                            color: 'white',
                            width: '100%',
                            fontWeight: '500',
                            borderBottom: '1px solid #E8E8E8',
                            fontSize: '13px',
                            // borderRight: "3px solid #377CF6",
                            cursor: 'default',
                            pointerEvents: 'none',
                          }}
                        >
                          {' '}
                          {cords.text}
                        </Link>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {isMobile && (
              <div className="" style={{ marginTop: toggleOpen ? 0 : '-2px' }}>
                {el.mob?.map((oth: any, index: number) => (
                  <Link
                    key={index}
                    style={{ paddingLeft: toggleOpen ? '.8rem' : '' }}
                    to={oth.path}
                    onClick={() => isTablet && setToggleOpen((prev) => !prev)}
                    onMouseEnter={(e) =>
                      toggleOpen &&
                      !isTablet &&
                      handleMouseover(
                        e,
                        oth.sidebarProps.displayText,
                        [],
                        index + 8
                      )
                    }
                    onMouseLeave={() => {
                      timeOut.current = setTimeout(() => {
                        setCords((prev) => ({ ...prev, opacity: 0, id: -1 }));
                      }, 500);
                    }}
                    className={`side-icon-container ${
                      location.pathname === oth.path
                        ? 'active-link-bg'
                        : 'not-active-link'
                    }`}
                  >
                    <div
                      className={
                        location.pathname === oth.path
                          ? 'sidebaricon'
                          : 'sidebariconn'
                      }
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                        marginLeft: !toggleOpen ? '' : '-1px',
                        background:
                          toggleOpen && location.pathname === oth.path
                            ? ''
                            : toggleOpen
                              ? 'transparent'
                              : 'transparent',
                      }}
                    >
                      {oth.sidebarProps.icon && oth.sidebarProps.icon}
                    </div>

                    {toggleOpen && !isTablet ? null : (
                      <p
                        className={
                          location.pathname === oth.path
                            ? 'tablink'
                            : 'tablinkk'
                        }
                      >
                        {oth.sidebarProps.displayText}
                      </p>
                    )}
                    <div
                      className="tip"
                      style={{
                        backgroundColor: '#fff',
                        position: 'fixed',
                        top: cords.top,
                        left: cords.left,
                        display:
                          cords.opacity && cords.id === index + 8
                            ? 'block'
                            : 'none',

                        maxHeight: '300px',
                        minWidth: '150px',
                        overflowY: 'scroll',
                        borderBottomRightRadius: '4px',
                        borderTopRightRadius: '4px',
                        borderLeft: '1px solid #D9D9D9',
                        color: 'black',
                      }}
                    >
                      <Link
                        to="#"
                        className=""
                        style={{
                          display: 'block',
                          background: '#377CF6',
                          padding: '11px 12px',
                          color: 'white',
                          width: '100%',
                          fontWeight: '500',
                          borderBottom: '1px solid #E8E8E8',
                          fontSize: '13px',
                          // borderRight: "3px solid #377CF6",
                          cursor: 'default',
                          pointerEvents: 'none',
                        }}
                      >
                        {' '}
                        {cords.text}
                      </Link>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
