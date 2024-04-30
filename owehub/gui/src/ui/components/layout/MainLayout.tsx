import React,{useState} from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import sizeConfig from "../../../config/sizeConfig";
import Header from "./Header";
import './layout.css'
import { useSelector } from 'react-redux';
import { RootState } from "../../../redux/store";
import { EndPoints } from "../../../infrastructure/web_api/api_client/EndPoints";


const MainLayout= () => {
  const [toggleOpen,setToggleOpen] = useState<boolean>(false)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [sidebarChange,setSidebarChange] = useState<number>(0)
  return (
    isAuthenticated ?
    <div className='main-container'>
    <div className="side-header">
        <Sidebar toggleOpen={toggleOpen} setToggleOpen={setToggleOpen} sidebarChange={sidebarChange} setSidebarChange={setSidebarChange}/>
       <div className="header-width" style={{marginLeft: !toggleOpen ? "240px" : "50px"}}>
       <Header  toggleOpen={toggleOpen} setToggleOpen={setToggleOpen} sidebarChange={sidebarChange} setSidebarChange={setSidebarChange}/>
        <div className='children-container'>
       <Outlet/>
           </div>
       </div>
    </div>
</div>:<Navigate to={EndPoints.login} replace/>

  );
};

export default MainLayout;


