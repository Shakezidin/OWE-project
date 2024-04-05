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
    code:"header-content",
    name: "Voltaic Power LLC",
    email: "$hanery@gmail.com",
    pn: "123456789",
    des: "Implementing solar system commission",
  
  },
  {
    code:"header-content",
    name: "Voltaic Power LLC",
    email: "$hanery@gmail.com",
    pn: "123456789",
    des: "Implementing solar system commission",
  
  },
  {
    code:"header-content",
    name: "Voltaic Power LLC",
    email: "$hanery@gmail.com",
    pn: "123456789",
    des: "Implementing solar system commission",
  
  },

];

const DealerOwnerTable: React.FC = () => {
  return (
    <>
    {/* <UserHeaderSection  name="Dealer Owner"/> */}
      <div
        className="TableContainer"
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
                  <p>Code</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Name</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Email ID</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Phone Number</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Descriptions</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Action</p> <FaArrowDown style={{color:"#667085"}}/>
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
                  <td style={{ fontWeight: "500", color: "black" }}>{el.code}</td>
                  <td>{el.name}</td>
                  <td>{el.email}</td>
                  <td>{el.pn}</td>
                  <td>{el.des}</td>
                  <td>
                    <div className="action-icon">
                      <div className="" style={{ cursor: "pointer" }}>
                        <img src={ICONS.ARCHIVE} alt="" />
                      </div>
                      <div className="" style={{ cursor: "pointer" }}>
                        <CiEdit
                          style={{ fontSize: "1.5rem", color: "#344054" }}
                        />
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

export default DealerOwnerTable;
