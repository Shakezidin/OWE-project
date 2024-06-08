import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Header from './Header';
import './layout.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { EndPoints } from '../../../infrastructure/web_api/api_client/EndPoints';
import { useAppDispatch } from '../../../redux/hooks';
import {
  activeSessionTimeout,
  logout,
} from '../../../redux/apiSlice/authSlice/authSlice';
import { toast } from 'react-toastify';
import ChangePassword from '../../pages/resetPassword/ChangePassword/ChangePassword';
import { checkUserExists } from '../../../redux/apiActions/auth/authActions';
import useMatchMedia from '../../../hooks/useMatchMedia';
const MainLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(
    localStorage.getItem('is_password_change_required') === 'true'
  );
  const isTablet = useMatchMedia('(max-width: 1024px)');
  const [toggleOpen, setToggleOpen] = useState<boolean>(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [sidebarChange, setSidebarChange] = useState<number>(0);

  /** TODO: temp solution for session logout. Need to change in future */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('expirationTime');
    const expirationTimeInMin = localStorage.getItem('expirationTimeInMin');

    if (token && expirationTime && expirationTimeInMin) {
      const currentTime = Date.now();
      if (currentTime < parseInt(expirationTime, 10)) {
        const timeout = setTimeout(
          () => {
            dispatch(activeSessionTimeout());
            dispatch(logout());
            navigate('/login');
            toast.error('Session time expired. Please login again..');
          },
          parseInt(expirationTimeInMin) * 60 * 1000
        ); // 480 minutes in milliseconds

        return () => clearTimeout(timeout);
      } else {
        // Token has expired
        dispatch(activeSessionTimeout());
        dispatch(logout());
        navigate('/login');

        toast.error('Session time expired. Please login again..');
      }
    }
  }, [dispatch, isAuthenticated]);

  /** check whether user exist or not */
  useEffect(() => {
    const email = localStorage.getItem('email');

    if (email) {
      dispatch(checkUserExists(email))
        .then((response: any) => {
          if (response.payload) {
            console.log('User exists');
          } else {
            // User does not exist, log out
            dispatch(logout());
            navigate('/login');
            toast.error('User does not exist. Please register..');
          }
        })
        .catch((error: any) => {
          console.error('Error checking user existence:', error);
        });
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    setToggleOpen(isTablet);
  }, [isTablet]);

  return isAuthenticated ? (
    <div className="main-container">
      <div className="side-header">
        <Sidebar
          toggleOpen={toggleOpen}
          setToggleOpen={setToggleOpen}
          sidebarChange={sidebarChange}
          setSidebarChange={setSidebarChange}
        />
        <div
          className="header-width"
          style={{ marginLeft: !toggleOpen ? '240px' : '50px' }}
        >
          <Header
            toggleOpen={toggleOpen}
            setToggleOpen={setToggleOpen}
            sidebarChange={sidebarChange}
            setSidebarChange={setSidebarChange}
          />
          <div className="children-container">
            <Outlet />
          </div>
        </div>
        {isOpenChangePassword && (
          <ChangePassword
            handleOpenNClose={() => {
              setIsOpenChangePassword(!isOpenChangePassword);
            }}
          />
        )}
      </div>
    </div>
  ) : (
    <Navigate to={EndPoints.login} replace />
  );
};

export default MainLayout;
