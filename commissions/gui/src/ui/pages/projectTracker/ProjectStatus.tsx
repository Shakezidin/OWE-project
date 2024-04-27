import React, { useState } from 'react'

import '../projectTracker/projectTracker.css'
import Input from '../../components/text_input/Input'
import { stateData } from '../../../resources/static_data/StaticData';
import { newStatusData } from './projectData';

interface ActivePopups {
  [key: number]: number | null;
}
const ProjectStatus = () => {
  const [activePopups, setActivePopups] = useState<ActivePopups>({}); // State to store active popups for each row

  const handleIconClick = (rowIndex:number, index:number) => {
    setActivePopups(prevState => ({
      ...prevState,
      [rowIndex]: prevState[rowIndex] === index ? null : index // Toggle the active popup index for the clicked row
    }));
  };
  return (
    <div className='project-status-container' style={{height:"100%",paddingBottom:"1rem"}} >
      <div className="project-heading" style={{ padding: "1rem" }}>
     <div className="">
     <h2>Project Status</h2>
        <div className="progress-box-container">
            <div className="progress-box-body">
            <div className="progress-box" style={{background:"#57B93A"}}></div>
            <p>Stage1 Completed</p>
            </div>
            <div className="progress-box-body">
            <div className="progress-box"></div>
            <p>Stage2 Completed</p>
            </div>
            <div className="progress-box-body">
            <div className="progress-box" style={{background:"#E9E9E9"}}></div>
            <p>data not available</p>
            </div>
          
          </div>
     </div>
        <div className="search-input-container">
       <div className="">
       <Input
            onChange={() => { }}
            value={""}
            type='text'
            placeholder='Search'
            name='search'
            isTypeSearch={true}
          />
       </div>
        </div>
      </div>
    <div className="project-staus-progress-container">
    <div className="project-status-table">
       <div className="project-status-card">
        <div className="status-number">1</div>
        <p className='stage-1-para'>Sales</p>
       </div>
      <div className="notch-corner">
       <div className="">
        <span className='date-para'>10 Apr</span> 
        <p className='stage-1-para'>2024</p>

       </div>
       <div className="border-notch"></div>
       <div className="">
        <p className='stage-1-para'>Stage 1</p>
        <p className='date-para'>1st Stage is completed</p>
       </div>
      </div>
      <div className="notch-corner" style={{background:"#0493CE"}}>
       <div className="">
        <span className='date-para'>10 Apr</span> 
        <p className='stage-1-para'>2024</p>

       </div>
       <div className="border-notch"></div>
       <div className="">
        <p className='stage-1-para'>Stage 2</p>
        <p className='date-para'>2nd Stage is completed</p>
       </div>
      </div>

      </div>
      <div className="dotted-border"></div>
     {
      newStatusData.map((item:any,i:any)=>(
        <>
             <div className="project-status-table">
       <div className="project-status-card" style={{marginTop:'0',background:"#D8D9E0"}}>
        <div className="status-number" style={{background:"#FFFFF",color:"#101828"}}>{item.number}</div>
        <p className='stage-1-para' style={{color:"#101828"}}>{item.name}</p>
       </div>
     
    {
      item.childStatusData.map((el:any,i:any)=>(
        <div className="notch-corner" style={{background:"#E9E9E9",color:"#101828"}}>
        <div className="">
    <div className="" style={{}}>
    <span className='date-para' style={{color:"#101828",fontSize:"11px"}} >ETA20</span> 
         <span className='' style={{color:"#101828",fontSize:"10px"}} >{el.para}</span> 
    </div>
         <p className='stage-1-para' style={{color:"#101828",fontSize:"10px"}}>2024</p>
 
        </div>
        <div className="border-notch" style={{border:"1px solid #A5AAB2"}}></div>
        <div className="">
         <p className='stage-1-para' style={{color:"#101828"}}>{el.process}</p>
         <p className='date-para' style={{color:"#101828"}}>data is not available</p>
        </div>
       </div>
      ))
    }

      </div>
     {
      i===3?null: <div className="dotted-border"></div>
     }
        </>
      ))
     }
    </div>
    </div>
  )
}

export default ProjectStatus