import React from 'react'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import '../projectTracker/projectTracker.css'
import { ICONS } from '../../icons/Icons'
import { cardData } from './projectData'
const ProjectTracker = () => {
  return (
    <div className="">
 <Breadcrumb head="Dashboard" linkPara="Other" linkparaSecond="Project Tracker" />
      <div className="project-container">
<div className="project-heading">
  <h2>Performance</h2>
  <div className="iconsSection-filter">
          <button type="button" >
            <img src={ICONS.filtercomm} alt="" style={{width:"15px", height:"15px"}}/>
          </button>
        </div>
</div>
<div className="project-card-container">
  {
    cardData.map((el,i)=>(
      <div className="project-card" key={i} style={{backgroundColor:el.bgColor}}>
      <div className="project-card-head">
      <div className="project-icon-img" style={{backgroundColor:el.iconBgColor}}>
        <img src={el.icon} alt="" className='icon-image' />
       </div>
       <h2>{el.name}</h2>
      </div>
      <div className="project-card-body">
   <div className="project-body-details">
    <h2>60</h2>
    <p>Sales</p>
   </div>
   <div className="project-body-details">
    <h2>120</h2>
    <p>Sales KW</p>
   </div>
      </div>
      </div>
    ))
  }

</div>

      </div>
    </div>
  )
}

export default ProjectTracker