import React,{useState} from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import sizeConfig from "../../../config/sizeConfig";
import Header from "./Header";
import './layout.css'

const MainLayout = () => {
  const [toggleOpen,setToggleOpen] = useState<boolean>(false)
  return (
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
            
   
    
</div>
    // <div style={{ display: "flex" }}>
    
    //   <div
    //     style={{
    //       width: sizeConfig.sidebar.width,
    //       flexShrink: 0
    //     }}
    //   >
    //     <Sidebar/>
    //   </div>
    //   <div
    //     style={{
    //       flexGrow: 1,
    //       padding: 3,
    //       width: `calc(100% - ${sizeConfig.sidebar.width})`,
    //       minHeight: "100vh",
    //       backgroundColor: colorConfig.mainBg
    //     }}
    //   >
    //      <Topbar />
    //     <Outlet />
    //   </div>
    // </div>
  );
};

export default MainLayout;