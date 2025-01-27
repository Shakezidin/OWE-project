import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  setToken,
} from '../../../redux/apiSlice/authSlice/authSlice';
import { toast } from 'react-toastify';
import ChangePassword from '../../oweHub/resetPassword/ChangePassword/ChangePassword';
import { checkUserExists, checkDbStatus } from '../../../redux/apiActions/auth/authActions';
import useMatchMedia from '../../../hooks/useMatchMedia';
import { cancelAllRequests } from '../../../http';
import useAuth from '../../../hooks/useAuth';
import useIdleTimer from '../../../hooks/useIdleTimer';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import Cookies from 'js-cookie';

const MainLayout = () => {
  const { authData, filterAuthData } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const isTablet = useMatchMedia('(max-width: 1024px)');
  const [dbStatus, setDbStatus]= useState<boolean>(true);
  const [toggleOpen, setToggleOpen] = useState<boolean>(true);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [sidebarChange, setSidebarChange] = useState<number>(0);
  const { pathname } = useLocation()

  const getToken = async () => {
    try {
      const response = await postCaller('get_graph_api_access_token', {});
      const token = await response.data.access_token;
      const tokenDuration = await response.data.expires_in;
      const expTime = new Date(Date.now() + 100);
      expTime.setMinutes(expTime.getMinutes() + Math.floor(tokenDuration / 60));
      Cookies.set('myToken', token, { expires: expTime, path: '/' });
      dispatch(setToken(token));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = Cookies.get('myToken');
    if (!token) {
      getToken();
    }
  }, [pathname]);

  /** logout  */
  const logoutUser = (message?: string) => {
    dispatch(activeSessionTimeout());
    dispatch(logout());
    filterAuthData();
    navigate('/login');
    toast.error(
      message ? message : 'Session time expired. Please login again..'
    );
  };

  /** check idle time  */
  useIdleTimer({ onIdle: logoutUser, timeout: 30 * 60000 });

  /** reset paswword */
  useEffect(() => {
    const isPasswordChangeRequired =
      authData?.isPasswordChangeRequired?.toString();

    setIsOpenChangePassword(isPasswordChangeRequired === 'true');
  }, [authData]);


  /** check whether user exist or not */
  useEffect(() => {
    const email = authData?.email;

    if (email) {
      dispatch(checkUserExists(email))
        .then((response: any) => {
          if (response.payload) {
          } else {
            // User does not exist, log out
            logoutUser('User does not exist. Please register..');
            cancelAllRequests();
          }
        })
        .catch((error: any) => {
          console.error('Error checking user existence:', error);
        });
    }
  }, [dispatch, navigate, authData]);

    /** check whether db down or not */
    useEffect(() => {
        dispatch(checkDbStatus())
          .then((response: any) => {
            if (response.payload) {
             
              setDbStatus(response.payload.is_up)
            } 
          })
          .catch((error: any) => {
            console.error('Error', error);
          });
      
    }, [dispatch, navigate, authData]);

  useEffect(() => {
    if (isTablet) {
      setToggleOpen(true);
    }
    if (localStorage.getItem('version') !== process.env.REACT_APP_VERSION!) {
      localStorage.setItem('version', process.env.REACT_APP_VERSION!);
      window.location.reload();
    }
  }, [isTablet]);

  return isAuthenticated ? (
    <div className="main-container">
      <Header
        toggleOpen={toggleOpen}
        setToggleOpen={setToggleOpen}
        sidebarChange={sidebarChange}
        setSidebarChange={setSidebarChange}
        dbStatus={dbStatus}
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
