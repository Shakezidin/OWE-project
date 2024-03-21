import React,{useState} from "react";
import SidebarItem from "./SidebarItem";
import SidebarItemCollapse from "./SidebarItemCollapse";
import appRoutes from "../../../routes/appRoutes";
import '../layout/layout.css'
import { ICONS } from "../../icons/Icons";
interface Toggleprops{
  toggleOpen:boolean;
  setToggleOpen:React.Dispatch<React.SetStateAction<boolean>>;
 }
const Sidebar: React.FC<Toggleprops> = ({toggleOpen,setToggleOpen})=> {
 
  return (
    <div className={`side-bar-container ${toggleOpen?'side-bar-active':""}`}>
    <div className="side-bar-logo" onClick={()=>setToggleOpen(false)}>
<img src={ICONS.sidebarLogo} alt="" />
    <h3>Commission App</h3>
    </div>
    <div className="side-bar-content">
   {appRoutes.map((route, index) => (
        route.sidebarProps ? (
          route.child ? (
            <SidebarItemCollapse  setToggleOpen={setToggleOpen} item={route} key={index} />
          ) : (
            <SidebarItem  setToggleOpen={setToggleOpen} item={route} key={index} />
          )
        ) : null
      ))}

   
    </div>
  </div>
    // <div
      
    //   style={{
    //     width: sizeConfig.sidebar.width,
    //     flexShrink: 0,
    //     height:"100vh",
    //       // width: sizeConfig.sidebar.width,
    //       boxSizing: "border-box",
    //       borderRight: "0px",
    //       backgroundColor: colorConfig.sidebar.bg,
    //       color: colorConfig.sidebar.color
        
    //   }}
    // >
    //   <div  >
    //  <div className="">
    //   image
    //  </div>
    //  <div className="">
   
    //  </div>
    //   </div>
    // </div>
  );
};

export default Sidebar;