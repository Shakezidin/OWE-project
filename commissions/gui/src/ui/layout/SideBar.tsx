import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './layout.css'
import { MdKeyboardArrowDown } from "react-icons/md";
import { useState } from 'react';
import commissionLogo from '../../resources/assets/commisson_small_logo.svg'
import dash from '../../resources/assets/mail_white.svg'
const SideBar: React.FC = () => {
const navigate = useNavigate()
const location = useLocation();
const [toggleActive,setToggleActive] = useState(false)
  return (
    <div className="side-bar-container">
      <div className="side-bar-logo">
 <img src={commissionLogo} alt="" />
      <h3>Commission App</h3>
   
      </div>
      <div className="side-bar-content">
     <div className="side-tab-container" onClick={()=>setToggleActive(false)}>
        <img src={dash} alt="" />
     <Link className={`tablink ${location.pathname.includes('dashboard') ? 'active-side' : null}`} to={'/dashboard'}>
          Dashboard
        </Link>
     </div>
 <div className="side-accordian">
 <div className="side-tab-container" onClick={()=>setToggleActive(!toggleActive)}>
     <Link className={`tablink ${toggleActive ? 'active-side' : null}`} to={'#'}>
          Configure
        </Link>
        <MdKeyboardArrowDown style={{fontSize:"1.5rem",color:"white"}} />
     </div>
    {
      toggleActive &&(
        <div className="side-accordian-item">
        <Link className={`tablink ${location.pathname.includes('configure/commission_rate') ? 'active-side' : null}`} to={'/configure/commission_rate'}>Commission Rate</Link>
        <Link className={`tablink ${location.pathname.includes('configure/dealer_override') ? 'active-side' : null}`} to={'/configure/dealer_override'}>Dealer Overrides</Link>
        <Link className={`tablink ${location.pathname.includes('configure/marketing_fees') ? 'active-side' : null}`} to={'/configure/marketing_fees'}>Marketing Fees</Link>
        <Link className={`tablink ${location.pathname.includes('configure/common_configure') ? 'active-side' : null}`} to={'/configure/common_configure'}>Common Configure</Link>
        </div>
      )
    }
 </div>
      <div className="side-tab-container">
      <Link className={`tablink ${location.pathname.includes('onboarding') ? 'active-side' : null}`} to={'/onboarding'}>
          Onboarding
        </Link>
        <MdKeyboardArrowDown style={{fontSize:"1.5rem",color:"white"}} />
      </div>
      <div className="side-tab-container" onClick={()=>setToggleActive(false)}>
      <Link className={`tablink ${location.pathname.includes('project') ? 'active-side' : null}`} to={'/project'}>
         Project
        </Link>
      </div>
     <div className="side-tab-container" onClick={()=>setToggleActive(false)}>
     <Link className={`tablink ${location.pathname.includes('report') ? 'active-side' : null}`} to={'/report'}>
         Report
        </Link>
     </div>
      </div>
    </div>
   
  )
}

export default SideBar