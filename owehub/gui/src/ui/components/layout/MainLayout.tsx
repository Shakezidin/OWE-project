import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Header from "./Header";
import "./layout.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { EndPoints } from "../../../infrastructure/web_api/api_client/EndPoints";
import { useAppDispatch } from "../../../redux/hooks";
import { logout } from "../../../redux/apiSlice/authSlice/authSlice";
import { toast } from "react-toastify";
import ChangePassword from "../../pages/resetPassword/ChangePassword/ChangePassword";

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(localStorage.getItem('is_password_change_required') === 'true');

  const [toggleOpen, setToggleOpen] = useState<boolean>(false);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const [sidebarChange, setSidebarChange] = useState<number>(0);
  
  /** TODO: temp solution for session logout. Need to change in future */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expirationTime = localStorage.getItem("expirationTime");
    const expirationTimeInMin = localStorage.getItem("expirationTimeInMin");

    if (token && expirationTime && expirationTimeInMin) {
      const currentTime = Date.now();
      if (currentTime < parseInt(expirationTime, 10)) {
        const timeout = setTimeout(() => {
          dispatch(logout());
          navigate("/login");
          toast.error("Session time expired. Please login again..");
        }, parseInt(expirationTimeInMin) * 60 * 1000); // 480 minutes in milliseconds

        return () => clearTimeout(timeout);
      } else {
        // Token has expired
        dispatch(logout());
        navigate("/login");
        toast.error("Session time expired. Please login again..");
      }
    }
  }, [dispatch, isAuthenticated]);

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
          style={{ marginLeft: !toggleOpen ? "240px" : "50px" }}
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
        {isOpenChangePassword &&  <ChangePassword handleOpenNClose={()=>{
          setIsOpenChangePassword(!isOpenChangePassword)
        }}/>}
      </div>
    </div>
  ) : (
    <Navigate to={EndPoints.login} replace />
  );
};

export default MainLayout;
