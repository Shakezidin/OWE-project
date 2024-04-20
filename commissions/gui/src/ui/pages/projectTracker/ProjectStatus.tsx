import React, { useState } from 'react'

import '../projectTracker/projectTracker.css'
import Input from '../../components/text_input/Input'
import { statusDataRow } from './projectData'
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
    <div className='project-status-container' >
      <div className="project-heading" style={{ padding: "1rem" }}>
        <h2>Projects</h2>
        <div className="search-input-container">
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
      <div className="project-status-table">
        <div className="status-header">
          <div className="head--row-status">
            <h2 className='head-status-text'>Project Name</h2>
          </div>
          <div className="head--row-status-1">
            <h2 className='head-status-text'>Milestone</h2>
          </div>
        </div>
        {
          statusDataRow.map((item, index) => (
            <div className="status-body" key={index}>
              <div className="head--row-status">
                <p className='row-status-text'>{item.title}</p>
              </div>
              <div className="head--row-status-1">
                {
                  item?.statusData?.map((el, i) => (
                    <div className="" key={i} style={{ display: "flex", position: "relative" }}>
                      {el.isProgress === true ? <div className='border-height'></div> : ""}
                      <div className="status-bg-img"  >
                        <div className="">
                          <img src={el.bgImg} alt="" style={{ width: el.width, objectFit: "cover", height: "45px" }} />
                        </div>
                        {
                          el.isProgress !== true ? <div className="status-rect-content" >
                            <div className="status-flex" >
                              <p className='name-text' style={{ color: el.color }}>{el.name}</p>
                              <img src={el.queruIcon} alt=""onClick={() => handleIconClick(index, i)} />
                            </div>
                            <p className='date-text' style={{ color: el.color }}>{el.date}</p>
                          </div> : <div className="status-rect-content" style={{ left: el.isProgress === true ? "55%" : "" }}>
                            <div className="status-flex">
                              <img src={el.queruIcon} alt="" />
                              <div className="">
                                <p className='name-text'>{el.name}</p>
                                <p className='date-text'>{el.date}</p>
                              </div>
                            </div>

                          </div>
                        }
                    
                      </div>
                      {activePopups[index] === i && (
                          <div className="popup">
                            <p className='pop-head'>Status Details</p>
                            <div className="start-date-flex">
                              <div className="date-head">
                                <p >Start Date</p>
                                <h3>20/02/2024</h3>
                              </div>
                              <div className="date-head">
                                <p>Start Date</p>
                                <h3>20/02/2024</h3>
                              </div>
                            </div>
                            <div className="work">
                              <p>Work Status</p>
                              <span>25% Complete</span>
                            </div>
                          </div>
                        )}
                    </div>
                    
                  ))
                }
              </div>
           
            </div>
          ))
        }


      </div>
    </div>
  )
}

export default ProjectStatus