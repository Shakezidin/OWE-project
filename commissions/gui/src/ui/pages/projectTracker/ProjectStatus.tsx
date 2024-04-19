import React from 'react'
import { ICONS } from '../../icons/Icons'
import '../projectTracker/projectTracker.css'
import Input from '../../components/text_input/Input'
const ProjectStatus = () => {
  return (
    <div className='project-status-container'>
           <div className="project-heading">
          <h2>Performance</h2>
          <div className="search-input-container">
            <Input 
            onChange={()=>{}}
            value={""}
            type='text'
            placeholder='Search'
            name='search'
            />
              <img src={ICONS.search} alt="" style={{ width: "16px", height: "16px" }} />
          
          </div>
        </div>
    </div>
  )
}

export default ProjectStatus