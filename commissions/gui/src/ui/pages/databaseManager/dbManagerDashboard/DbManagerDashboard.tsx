import React from 'react'
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb'
import CreateWebHook from './CreateWebHook'
import './dbManagerDash.css'
import { BiSearch, BiChevronDown } from 'react-icons/bi';
import DashBarLineChart from '../../databaseManager/dbManagerDashboard/DashBarLineChart'
const DbManagerDashboard = () => {
  return (
    <>
      {/* <CreateWebHook/> */}
      <div className="comm">
        <Breadcrumb head="Dashboard" linkPara="Database Manager" linkparaSecond="Dashboard" />

        <div className='Db-manager-container'>
          <div className='runner-section'>
            <h3>DB Status</h3>
            <p>Application Running</p>
            <div className='active-button'>
              <div className='active-since-section'>
                <button type='button'>Active</button>
              </div>
              <div className='since-section'>
                <h3>Active Since</h3>
                <p>20/03/2024  10:40PM</p>
              </div>
            </div>
          </div>
          <div className='DashBarchart-section' >
            <DashBarLineChart />
          </div>
        </div>

        <div className='webhook-container'>
          <div className='status-section'>
            <p>Webhooks Status</p>

            <div className="search-container-data">
              <input
                type="text"
                placeholder="Table 1"
                className="search-input-data"
              />
              <BiChevronDown className="dropdown-icon" />

            </div>


          </div>
          <div className='create-container'>
            <div className='Create-section' >
              <p>Create Webhooks</p>
              <div className="dash-serach-container">
                <input
                  type="text"
                  placeholder="Table 1"
                  className="search-input-dash"
                />
                {/* <BiChevronDown className="dropdown-icon-dash" /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>



  )
}

export default DbManagerDashboard