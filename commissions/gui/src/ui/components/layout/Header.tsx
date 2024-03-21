import React from 'react'
import logo from '../../../resources/assets/logo.png'
import './layout.css'
import btnlogo from '../../../resources/assets/appicon.png'
import userImg from '../../../resources/assets/user.png'
import notificationImg from '../../../resources/assets/notification.png'
import searchIcon from '../../../resources/assets/search.png'   
import '../layout/layout.css'

import { MdKeyboardArrowDown } from "react-icons/md";
import { MdOutlineMenu } from "react-icons/md";

 interface Toggleprops{
  toggleOpen:boolean;
  setToggleOpen:React.Dispatch<React.SetStateAction<boolean>>;
 }

const Header: React.FC<Toggleprops> = ({toggleOpen,setToggleOpen}) => {
  return (
    <div className="header-content">
   <div className="header-icon">
   <div className="menu-icon" onClick={()=>setToggleOpen(true)}>
    <MdOutlineMenu className='icon' />
    </div>
   <div className="header-logo">
      <img src={logo} alt="" />
    </div>
  
   </div>
    <div className="search-container">
      <div className="search-input-field"> <img src={searchIcon} alt="" className='searchicon' />
      <input type="search" name="" id="" placeholder='Search' className='search-input' />
      </div>
     <div className="user-container">
     <button className='app-btn'>
      <img src={btnlogo} alt="" />
      App</button>
      <div className="notification">
      <img src={notificationImg} alt="" />
      </div>
      <div className="user-img-container">
        <div className="user-img">
        <img src={userImg} alt="" />
        </div>
        <div className="user-name">
         <div className="down-arrow">
         <h4>Caleb Antonucci</h4>
       <div className="down-circle">
       <MdKeyboardArrowDown style={{fontSize:"1.5rem"}} />
       </div>
         </div>
         
          <p>Admin</p>
        </div>
      </div>
     </div>
    </div>
   </div>
  )
}

export default Header