import React from 'react'
import logo from '../../resources/assets/logo.png'
import './layout.css'
import btnlogo from '../../resources/assets/apps-fill.png'
import userImg from '../../resources/assets/user.png'
import { FaBell } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
const Header: React.FC = () => {
  return (
    <div className="header-content">
    <div className="header-logo">
      <img src={logo} alt="" />
    </div>
    <div className="search-container">
      <div className="search-input-field">
      <input type="search" name="" id="" placeholder='Search' className='search-input' />
      </div>
     <div className="user-container">
     <button className='app-btn'>
      <img src={btnlogo} alt="" />
      App</button>
      <div className="">
      <FaBell style={{fontSize:"1.5rem",color:"#04A5E8"}} />
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