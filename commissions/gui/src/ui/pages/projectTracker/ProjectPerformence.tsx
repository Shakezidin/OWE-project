import React from 'react'
import { cardData, projectDashData } from './projectData'
import { ICONS } from '../../icons/Icons'
import '../projectTracker/projectTracker.css'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
const ProjectPerformence = () => {
  return (
  <div className="">
      <Breadcrumb head="" linkPara="Project Tracking" route={""} linkparaSecond="Performance" />
    <div className="project-container">
    <div className="project-heading">
          <h2>Performance</h2>
          <div className="iconsSection-filter">
            <button type="button" >
              <img src={ICONS.filtercomm} alt="" style={{ width: "15px", height: "15px" }} />
            </button>
          </div>
        </div>
        <div className="project-card-container">
          {
            cardData.map((el, i) => (
              <div className="project-card" key={i} style={{ backgroundColor: el.bgColor }}>
                <div className="project-card-head">
                  <div className="project-icon-img" style={{ backgroundColor: el.iconBgColor }}>
                    <img src={el.icon} alt="" className='icon-image' />
                  </div>
                  <h2 style={{color:el.color}}>{el.name}</h2>
                </div>
                <div className="project-card-body">
                  <div className="project-body-details">
                    <h2 style={{fontSize:"14px"}}>60</h2>
                    <p style={{fontSize:"14px"}}>Sales</p>
                  </div>
                  <div className="project-body-details">
                    <h2 style={{fontSize:"14px"}}>120</h2>
                    <p style={{fontSize:"14px"}}>Sales KW</p>
                  </div>
                </div>
              </div>
            ))
          }

        </div>
        <div className="project-card-container">
          {
            projectDashData.map((item, i) => (
              <div className="project-ruppes-card" key={i}>
                <div className="project-ruppes-body">
                  <div className="project-icon-img" style={{ background: item.iconBgColor }}>
                    <img src={item.icon} alt="" />
                  </div>
                  <div className="doller-head">
                    <h2>{item.ruppes}</h2>
                    <p>{item.para}</p>
                  </div>
                </div>
                <div className="project-ruppes-body">
                  <div className="project-img-curve">
                    <img src={item.curveImg} alt="" />
                  </div>
                  <div className="percent" style={{ background: item.iconBgColor }}>
                    <img src={item.arrow} alt="" />
                    <p style={{ color: item.percentColor }}>40%</p>
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

export default ProjectPerformence