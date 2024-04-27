import React, { useState } from 'react'

import '../projectTracker/projectTracker.css'
import Input from '../../components/text_input/Input'
import { stateData } from '../../../resources/static_data/StaticData';
import { newStatusData, projectStatusHeadData } from './projectData';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import SelectOption from '../../components/selectOption/SelectOption';
import { ICONS } from '../../icons/Icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
interface ActivePopups {
  [key: number]: number | null;
}
interface Option {
  value: string;
  label: string;
}
const ProjectStatus = () => {
  const [activePopups, setActivePopups] = useState<ActivePopups>({}); // State to store active popups for each row

  const handleIconClick = (rowIndex:number, index:number) => {
    setActivePopups(prevState => ({
      ...prevState,
      [rowIndex]: prevState[rowIndex] === index ? null : index // Toggle the active popup index for the clicked row
    }));
  };

  const data = [
    {
      name: 'Page A',

      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
    
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
  
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
     
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
     
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
    
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
 
      pv: 4300,
      amt: 2100,
    },
  ];

  const projectOption:Option[]=[
    {
      value:"project_one",
      label:"Project1"
    },
    {
      value:"project_two",
      label:"Project Two"
    },
  ]
  return (
  <div className="">
    
          <Breadcrumb head="Project Tracking" linkPara="Project Tracker" route={""} linkparaSecond="Performance" />
      <div className='project-container'style={{padding:"0rem 0 1rem 0"}} >
      <div className="project-heading" style={{borderBottom:"1px solid #E1E1E1",padding:"1rem"}}>
      <h2 >Project Status</h2>
      <div className="create-input-field">
       <div className="">
       <SelectOption
            options={projectOption}
            value={projectOption?.find((option) => option.value === "project_one")}
            onChange={()=>{}}
         
          />
       </div>
        </div>
      </div>

    <div className="project-status-head-card">
      <div className="project-status-body">
        {
          projectStatusHeadData.map((el,i)=>(
            <div className="project-status-body-card" key={i} style={{background:el.bgColor}}>
              <div className="">
              <p className='para-head'>{el.name}</p>
              <span className='span-para'>{el.para}</span>
              </div>
              {
                el.viewButton===true?<div className='view-flex'>
                  <p>View</p>
                
                  <img src={ICONS.arrowDown} alt="" />
            

                </div>:null
              }
            </div>
          ))
        }
     
      </div>
      <div className="project-status-graph">
    <div className="status-graph-heading">
      <h2 className='percent-head'>25%</h2>
      <p>Overall Progress</p>
    </div>
    <div className="">
      {/* <div className="curve-graph-pos">
      <div className="curve-head-pos">
      <p style={{fontWeight:"600"}}>25%</p>
        <p>Apr 26th,2024</p>
      </div>
        <img src={ICONS.curveGraph} alt="" />
  
      </div> */}
      {/* <div className="curve-graph-pos"> */}
      <ResponsiveContainer width={500} height={200} >
        <LineChart
          width={100}
          height={100}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <Tooltip  />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
         
        </LineChart>
      </ResponsiveContainer>
       
      {/* </div> */}
      {/* <img src={ICONS.linearGraph} alt="" /> */}
    </div>
      </div>
    </div>

      <div className="project-heading"style={{padding:"1rem"}} >
     <div className="">
     <h2>Project Stages</h2>
        <div className="progress-box-container">
            <div className="progress-box-body">
            <div className="progress-box" style={{background:"#57B93A"}}></div>
            <p>Completed</p>
            </div>
            <div className="progress-box-body">
            <div className="progress-box"></div>
            <p>In Current Stage</p>
            </div>
            <div className="progress-box-body">
            <div className="progress-box" style={{background:"#E9E9E9"}}></div>
            <p>Not Started yet</p>
            </div>
          
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
  </div>
  )
}

export default ProjectStatus