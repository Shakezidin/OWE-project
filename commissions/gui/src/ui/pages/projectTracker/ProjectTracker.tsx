import React from 'react'
import Breadcrumb from '../../components/breadcrumb/Breadcrumb'
import '../projectTracker/projectTracker.css'

import ProjectPerformence from './ProjectPerformence'
import ProjectStatus from './ProjectStatus'
const ProjectTracker = () => {
  return (
    <div className="">
      <Breadcrumb head="Dashboard" linkPara="Other" linkparaSecond="Project Tracker" />
     <div className="project-main-container">
     <div className="project-container">
        <ProjectPerformence />
        </div>
     <div className="project-container" style={{padding:0}}>
     <ProjectStatus />
     </div>
     </div>
      
    </div>
  )
}

export default ProjectTracker