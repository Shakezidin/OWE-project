import React, { useState, useEffect, useRef } from 'react';
import './layout.css';
import '../layout/layout.css';
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';
import { ICONS } from '../../../resources/icons/Icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/apiSlice/authSlice/authSlice';
import { ROUTES } from '../../../routes/routes';
import { FaUserCircle } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import useMatchMedia from '../../../hooks/useMatchMedia';
import { IoMenu } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import useAuth from '../../../hooks/useAuth';
import useWindowWidth from '../../../hooks/useWindowWidth';

interface Toggleprops {
  toggleOpen: boolean;
  setToggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarChange: React.Dispatch<React.SetStateAction<number>>;
  sidebarChange: number;
}

const Header: React.FC<Toggleprops> = ({ toggleOpen, setToggleOpen }) => {
  const [name, setName] = useState<String>();
  const { authData, clearAuthData } = useAuth();

  const userRole = authData?.role;
  const userName = authData?.userName;
  const [openIcon, setOPenIcon] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const isTablet = useMatchMedia('(max-width: 1024px)');

  const width = useWindowWidth();
  const isMobile = width < 768;

  const handleLogout = () => {
    clearAuthData();
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    if (userName) {
      const firstLetter = userName.charAt(0).toUpperCase();
      setName(firstLetter);
    }
  }, [userName]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Code for if we click anywhere outside dropdown he will close
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOPenIcon(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`${scrolled ? 'header-scrolled' : ''} header-content`}>
      <div className="header-icon">
        <div
          className={`side-bar-logo ${toggleOpen ? 'side-bar-logo-active' : ''}`}
          style={{
            width: !toggleOpen && !isTablet ? 240 : 50,
            paddingLeft: toggleOpen || isTablet ? 0 : undefined,
          }}
          onClick={() => isTablet && setToggleOpen((prev) => !prev)}
        >
          {isTablet ? (
            toggleOpen ? (
              <IoMenu size={22} className="mx-auto" />
            ) : (
              <RxCross2 size={20} className="mx-auto" />
            )
          ) : (
            <img
              src={ICONS.sidebarLogo}
              alt=""
              style={{
                marginInline: toggleOpen ? 'auto' : undefined,
              }}
            />
          )}
          {toggleOpen || isTablet ? null : (
            <h3 style={{ color: 'black' }}>OWE HUB</h3>
          )}

          {!isTablet && (
            <div
              className={`icon-shape ${toggleOpen ? 'icon-shape-active' : ''}`}
              onClick={() => setToggleOpen(!toggleOpen)}
              style={{
                position: 'absolute',
                right: toggleOpen ? -17 : 0,
                top: '10px',
                borderRadius: toggleOpen
                  ? '0px 10px 10px 0px'
                  : '10px 0 0 10px',
              }}
            >
              {toggleOpen ? (
                <MdKeyboardArrowRight
                  style={{ fontSize: '1.2rem', color: '#23B364' }}
                />
              ) : (
                <MdKeyboardArrowLeft
                  style={{ fontSize: '1.2rem', color: '#23B364' }}
                />
              )}
            </div>
          )}
        </div>
        <div
          className="header-logo flex items-center"
          style={{ marginLeft: isTablet ? 0 : 25, height: '100%' }}
        >
          <object
            type="image/svg+xml"
            data={ICONS.LOGO}
            aria-label="login-icon"
          ></object>
        </div>
      </div>
      {!isMobile && (
        <div className="search-container">
          <div
            className="user-container"
            ref={dropdownRef}
            onClick={() => setOPenIcon(!openIcon)}
          >
            <div className="user-img-container">
              <div className="user-img">
                <span>{name}</span>
              </div>
              <div className="user-name">
                <div className="down-arrow">
                  <h4>Hello,&nbsp;{userName}</h4>
                  <p className="admin-p">{userRole}</p>
                </div>

                <div className="">
                  <div className="down-circle">
                    {openIcon ? (
                      <img src={ICONS.upperIcon} alt="" />
                    ) : (
                      <MdKeyboardArrowDown style={{ fontSize: '1.5rem' }} />
                    )}
                    {openIcon && (
                      <div className="header-modal-1">
                        <div
                          className="image-box-container"
                          onClick={() => navigate(ROUTES.ACCOUNT_SETTING)}
                        >
                          <div className="image-icon">
                            <FaUserCircle />
                          </div>
                          <p
                            className=""
                            style={{ fontSize: '12px', fontWeight: '500' }}
                          >
                            My Account
                          </p>
                        </div>

                        <div
                          className="image-box-container "
                          onClick={handleLogout}
                        >
                          <div className="image-icon">
                            <IoMdLogOut />
                          </div>
                          <div>
                            <p style={{ fontSize: '12px', fontWeight: '500' }}>
                              Logout
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="search-container">
          <div
            className="user-container"
            ref={dropdownRef}
            onClick={() => setOPenIcon(!openIcon)}
          >
            <div className="user-img-container">
              <div className="user-img">
                <span>{name}</span>
              </div>
              <div className="user-name">
                <div className="">
                  <div className="down-circle">
                    {openIcon ? (
                      <img src={ICONS.upperIcon} alt="" />
                    ) : (
                      <MdKeyboardArrowDown style={{ fontSize: '1.5rem' }} />
                    )}
                    {openIcon && (
                      <div className="header-modal-mob">
                        <div
                          className="image-box-container"
                          onClick={() => navigate(ROUTES.ACCOUNT_SETTING)}
                        >
                          <div className="image-icon">
                            <FaUserCircle />
                          </div>
                          <p
                            className=""
                            style={{ fontSize: '12px', fontWeight: '500' }}
                          >
                            My Account
                          </p>
                        </div>

                        <div
                          className="image-box-container "
                          onClick={handleLogout}
                        >
                          <div className="image-icon">
                            <IoMdLogOut />
                          </div>
                          <div>
                            <p style={{ fontSize: '12px', fontWeight: '500' }}>
                              Logout
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
