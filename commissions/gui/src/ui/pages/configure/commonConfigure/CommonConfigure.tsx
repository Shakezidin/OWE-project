import React from "react";
import "../commonConfigure/commonConfigure.css";
import { useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
const CommonConfigure: React.FC = () => {
  // const [activeCard,setActiveCard] = useState(0)
  return (
    <div className="">
      <div className="common-card">
        <h4>Common Configuration</h4>
        <div className="common-card-content">
          <div className="admin-card-content">
            <div className="">
              <h3>85</h3>
              <p>Team</p>
            </div>
            <div className="team-circle"></div>
          </div>
        </div>
        <div className="common-card-table">
          <div className="dashboard-head">
            <div className="teams-head">
              <h4>TEAMS</h4>
              <p>You Can Modify Your Team Data</p>
            </div>
            <button type="button" className="add-team">
              + Add new
            </button>
          </div>
          <div className="common-card-content">
            <div className="teams-card">
              <div className="">
                <h4>Sales Team1</h4>
                <p>
                  It seems like you have a dataset with the dealer, sub-dealer,
                  and pay rate information.
                </p>
              </div>
              <div className="team-icon">
                <p>delete</p>
                <p>Edit</p>
              </div>
            </div>
          </div>
          <div className="">
            <table>
              <thead>
                <tr>
                  <th>
                    <input type="Checkbox" />
                  </th>
                  <th>Team Name</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <input type="Checkbox" />
                  </td>
                  <td>Sales Teams No.01</td>
                  <td>
                    It seems like you have a dataset with the dealer,
                    sub-dealer, and pay rate information.
                  </td>
                  <td style={{ display: "flex", gap: "1rem" }}>
                    <RiDeleteBin5Line
                      style={{ fontSize: "1.5rem", color: "#344054" }}
                    />
                    <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonConfigure;
