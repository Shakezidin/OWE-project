import React, { useEffect, useRef, useState } from 'react'

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
 
];

const projectOption:Option[]=[
  {
    value:"project_one",
    label:"Project 1"
  },
  {
    value:"project_two",
    label:"Project Two"
  },
]
const ProjectStatus = () => {
  const [activePopups, setActivePopups] = useState<boolean>(false);
  const menuRef = useRef()
   // State to store active popups for each row
   const handleClickOutside=()=>{
    setActivePopups(false)
   }
   useEffect(() => {
    if (activePopups) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePopups]);


 

  return (
  <div className="">
          <Breadcrumb head="Project Tracking" linkPara="Project Tracking" route={""} linkparaSecond="Performance" />
      <div className='project-container'style={{padding:"0rem 0 1rem 0"}} >
      <div className="project-heading" style={{borderBottom:"1px solid #E1E1E1",padding:"1rem"}}>
      <h2 >Project Status</h2>
      <div className="" style={{width:"25%"}}>
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
                el.viewButton===true?<div className='view-flex' onClick={()=>setActivePopups(true)}>
                  <p>View</p>
                
                  <img src={ICONS.arrowDown} alt="" />
            

                </div>:null
              }
            </div>
          ))
        }
     {
      activePopups&&( <div className="popup">
      <p className='pop-head'>Adder Details</p>
      <ol className='order-list'>
  <li className='order-list-name'>Adders</li>
  <li className='order-list-name'>Sub Adder</li>
  <li className='order-list-name'>$20 Adder</li>
  <li className='order-list-name'>$20 Sub Adder</li>
</ol>  
    </div>)
     }
      </div>
      <div className="project-status-graph">
    <div className="status-graph-heading">
      <h2 className='percent-head'>25%</h2>
      <p>Overall Progress</p>
    </div>
    <div className="">
      <div className="curve-graph-pos">
      <div className="curve-head-pos">
      <p style={{fontWeight:"600"}}>25%</p>
        <p>Apr 26th,2024</p>
      </div>
        <img src={ICONS.curveGraph} alt="" />
      {/* time */}
      </div>
   <div className="graph-pos">
   {/* <ResponsiveContainer width={350} height={200} >
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
      </ResponsiveContainer> */}
   </div>
      <img src={ICONS.linearGraph} alt="" />
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
   
     {
      newStatusData.map((item:any,i:any)=>(
        <>
             <div className="project-status-table">
       <div className="project-status-card" style={{marginTop:'0',background:item.bgColor}}>
        <div className="status-number" style={{background:"#FFFFF",color:item.numColor}}>{item.number}</div>
        <p className='stage-1-para' style={{color:item.color}}>{item.name}</p>
       </div>
     
    {
      item.childStatusData.map((el:any,i:any)=>(
        <div className="notch-corner" style={{background:el.bgColor,color:"#101828"}}>
        <div className="">
    <div className="" style={{}}>
    <span className='date-para' style={{color:el.color,fontSize:"11px"}} >
      {el.name}
      </span> 
     
    </div>
         <p className='stage-1-para' style={{color:el.color,fontSize:"10px"}}>2024</p>
 
        </div>
        <div className="border-notch" style={{border:"1px solid ",borderColor:el.borderColor}}></div>
        <div className="">
         <p className='stage-1-para' style={{color:el.color}}>{el.process}</p>
         <p className='date-para' style={{color:el.color}}>{el.data}</p>
        </div>
       </div>
      ))
    }

      </div>
     {
      i===9?null: <div className="dotted-border"></div>
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