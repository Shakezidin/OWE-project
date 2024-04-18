import React, { useState } from "react";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import CreateWebHook from "./CreateWebHook";
import "./dbManagerDash.css";
import { BiSearch, BiChevronDown } from "react-icons/bi";
import DashBarLineChart from "../../databaseManager/dbManagerDashboard/DashBarLineChart";
import PieChartWithPaddingAngle from "./PieChartWithPaddingAngle";
import { Bar, BarChart, Rectangle, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../../routes/routes";
import Boxes from "./Boxes";
const DbManagerDashboard = () => {
  const navigate = useNavigate();


  const handleClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
      navigate(routes.dataTableRoutes);
  };
  return (
    <>
      {/* <CreateWebHook/> */}
      <div className="common">
        <Breadcrumb
          head="Dashboard"
          linkPara="Database Manager"
          linkparaSecond="Dashboard"
        />
      </div>

      <div className="Db-manager-container">
          <div className="runner-section">
            <h3>DB Status</h3>
            <p>Application Running</p>
            <div className="active-button">
              <div className="active-since-section">
                <button type="button">Active</button>
              </div>
              <div className="since-section">
                <h3>Active Since</h3>
                <p>20/03/2024 10:40PM</p>
              </div>
            </div>
          </div>
          <div className="DashBarchart-section">
            <DashBarLineChart />
          </div>

        </div>


        <div className="webhook-container">
          <div className="status-section">
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
          <div className="container-graph">

           <div className="create-container">
              <div className="Create-section">
                <p>Create Webhooks</p>
                
              <div className="Payroll-section">
              <select name="" id="" className="dash-select">
                <option value="">Today</option>
                <option value="">This Week</option>
                <option value="">All</option>
              </select>
            </div>

                
              </div>

              <div className="PieBarchart-section">
                  <PieChartWithPaddingAngle/>                  

            </div> */}


            {/* <div className="create-container">
              <div className="Create-section">
                <p>Delete Webhooks</p>
                <div
                  className="search-container-data"
                  style={{ marginLeft: '99px' }}
                >
                  <select
                    value={selectedOption}
                    onChange={handleChange}
                    className="search-input-data"
                  >
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="All">All</option>
                  </select>

                </div>
                <div className="identity">
                <Boxes color="#FB7955"/> <p>30% Fail</p>
                <Boxes color="#0088FE"/> <p>70% Pass</p>
                </div>

               
            </div> 



            <div className="create-container">
              <div className="Create-section">
                <p>Update Webhooks</p>
                
              <div className="Payroll-section">
              <select name="" id="" className="dash-select">
                <option value="">Today</option>
                <option value="">This Week</option>
                <option value="">All</option>
              </select>
            </div>

                
              </div>
              <div className="PieBarchart-section">
                  <PieChartWithPaddingAngle />                  
                </div>
                <div className="identity">
                <Boxes color="#FB7955"/> <p>30% Fail</p>
                <Boxes color="#0088FE"/> <p>70% Pass</p>
                </div>
               
            </div> 


            <div className="create-container">
              <div className="Create-section">
                <p>Delete Webhooks</p>
                
              <div className="Payroll-section">
              <select name="" id="" className="dash-select">
                <option value="">Today</option>
                <option value="">This Week</option>
                <option value="">All</option>
              </select>
            </div>

                
              </div>
              <div className="PieBarchart-section">
                  <PieChartWithPaddingAngle />                  
                </div>
                <div className="identity">
                <Boxes color="#FB7955"/> <p>30% Fail</p>
                <Boxes color="#0088FE"/> <p>70% Pass</p>
                </div>
               
            </div> 


          </div>
        </div>
    </>
  );
};

export default DbManagerDashboard;
