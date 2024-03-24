import React,{useState} from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import sizeConfig from "../../../config/sizeConfig";
import Header from "./Header";
import './layout.css'
import { useSelector } from 'react-redux';
import { RootState } from "../../../redux/store";

const MainLayout = () => {
  const [toggleOpen,setToggleOpen] = useState<boolean>(false)
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    isAuthenticated ?
    <div className='main-container'>
    <div className="side-header">
        <Sidebar toggleOpen={toggleOpen} setToggleOpen={setToggleOpen}/>
       <div className="header-width" >
       <Header  toggleOpen={toggleOpen} setToggleOpen={setToggleOpen}/>
        <div className='children-container'>
         <Outlet/>
           </div>
       </div>
    </div>
</div>:<Navigate to={'/login'} replace/>

  );
};

export default MainLayout;