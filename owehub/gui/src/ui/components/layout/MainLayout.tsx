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
import ChangePassword from '../../oweHub/resetPassword/ChangePassword/ChangePassword';
import { checkUserExists } from '../../../redux/apiActions/auth/authActions';
import useMatchMedia from '../../../hooks/useMatchMedia';
import { cancelAllRequests } from '../../../http';

import ChatSupport from './ChatSupport';

import useAuth from '../../../hooks/useAuth';

const MainLayout = () => {
  const { authData, filterAuthData } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const isTablet = useMatchMedia('(max-width: 1024px)');
  const [toggleOpen, setToggleOpen] = useState<boolean>(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [sidebarChange, setSidebarChange] = useState<number>(0);
  const [sessionExist, setSessionExist] = useState(false);

  useEffect(() => {
    const isPasswordChangeRequired =
      authData?.isPasswordChangeRequired?.toString();

    setIsOpenChangePassword(isPasswordChangeRequired === 'true');
  }, [authData]);

  /** TODO: temp solution for session logout. Need to change in future */
  useEffect(() => {
    const token = authData?.token;
    const expirationTime = authData?.expirationTime;
    const expirationTimeInMin = authData?.expirationTimeInMin;

    if (token && expirationTime && expirationTimeInMin) {
      const currentTime = Date.now();
      if (currentTime < parseInt(expirationTime, 10)) {
        setSessionExist(true);
        const timeout = setTimeout(
          () => {
            dispatch(activeSessionTimeout());
            dispatch(logout());
            filterAuthData();
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
        filterAuthData();
        navigate('/login');

        toast.error('Session time expired. Please login again..');
      }
    }
  }, [dispatch, isAuthenticated, authData]);

  /** check whether user exist or not */
  useEffect(() => {
    const email = authData?.email;

    if (email) {
      dispatch(checkUserExists(email))
        .then((response: any) => {
          if (response.payload) {
          } else {
            // User does not exist, log out
            dispatch(logout());
            filterAuthData();
            navigate('/login');
            toast.error('User does not exist. Please register..');
            cancelAllRequests();
          }
        })
        .catch((error: any) => {
          console.error('Error checking user existence:', error);
        });
    }
  }, [dispatch, navigate, authData]);

  useEffect(() => {
    setToggleOpen(isTablet);
    if (localStorage.getItem('version') !== process.env.REACT_APP_VERSION!) {
      localStorage.setItem('version', process.env.REACT_APP_VERSION!);
      window.location.reload()
    }
  }, [isTablet]);

  return isAuthenticated ? (
    <div className="main-container">
      <ChatSupport />
      <Header
        toggleOpen={toggleOpen}
        setToggleOpen={setToggleOpen}
        sidebarChange={sidebarChange}
        setSidebarChange={setSidebarChange}
      />
      <div className="side-header">
        <Sidebar
          toggleOpen={toggleOpen}
          setToggleOpen={setToggleOpen}
          sidebarChange={sidebarChange}
          setSidebarChange={setSidebarChange}
        />
        <div
          className="header-width"
          style={{
            marginLeft:
              !toggleOpen && !isTablet ? '240px' : isTablet ? 0 : '50px',
          }}
        >
          <div className="children-container">{sessionExist && <Outlet />}</div>
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
