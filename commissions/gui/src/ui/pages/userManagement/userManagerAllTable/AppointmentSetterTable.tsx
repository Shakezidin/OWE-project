import React from "react";
import "../../userManagement/user.css";
import { ICONS } from "../../../icons/Icons";
import { CiEdit } from "react-icons/ci";
import CheckBox from "../../../components/chekbox/CheckBox";
import '../../configure/configure.css'
import { FaArrowDown } from "react-icons/fa6";
// import { installers, partners, respTypeData, statData } from "../../../../../core/models/data_models/SelectDataModel";



const dataUser = [
  {
    name: "Voltaic Power",
    pay: "$3002r",
    des: "Implementing solar system commission settings ",
    sd: "24-04-2011",
    ed: "21-08-2005",
  },
  {
    name: "Voltaic Power",
    pay: "$3002r",
    des: "Implementing solar system commission settings ",
    sd: "24-04-2011",
    ed: "21-08-2005",
  },
  {
    name: "Voltaic Power",
    pay: "$3002r",
    des: "Implementing solar system commission settings ",
    sd: "24-04-2011",
    ed: "21-08-2005",
  },

];

const AppointmentSetterTable: React.FC = () => {
  return (
    <>
    {/* <UserHeaderSection  name="Appointment Setter"/> */}
      <div
        className="UserManageTable"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}  >
        <table>
          <thead style={{ background: "#F5F5F5" }}>
            <tr>
              <th>
                <div>
                  <CheckBox
                    checked={true}
                    onChange={() => { }
                    }
                  // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                  />
                </div>
              </th>
              
              <th>
                <div className="table-header">
                  <p>Name</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Start Date</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>End Date</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Pay Rate</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Descriptions</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
             
              <th>
                <div className="action-header">
                  <p>Action</p> 
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {dataUser.length > 0
              ? dataUser.map((el, i) => (
                <tr key={i}>
                  <td>
                    <CheckBox
                      checked={true} 
                      onChange={() => { }
                      }
                    // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    />
                  </td>
                  <td style={{ fontWeight: "none", color: "var( --fade-gray-black)"}}>{el.name}</td>
                  <td>{el.sd}</td>
                  <td>{el.ed}</td>
                  <td>{el.pay}</td>
                  <td>{el.des}</td>
                  
                  <td>
                  <div className="action-icon">
                        <div className="" style={{ cursor: "pointer" }}>
                          <img src={ICONS.deleteIcon} alt="" />
                        </div>
                        <div className="" style={{ cursor: "pointer" }} >
                        <img src={ICONS.editIcon} alt="" />
                        </div>
                      </div>
                  </td>
                </tr>
              ))
              : null}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AppointmentSetterTable;
