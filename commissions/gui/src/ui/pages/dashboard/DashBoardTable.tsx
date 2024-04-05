import React from "react";
import "../userManagement/user.css";
import { CiEdit } from "react-icons/ci";
import '../configure/configure.css'
import { FaArrowDown } from "react-icons/fa6";
import CheckBox from "../../components/chekbox/CheckBox";
import { IoIosHelpCircleOutline } from "react-icons/io";
// import { installers, partners, respTypeData, statData } from "../../../../../core/models/data_models/SelectDataModel";



const dataUser = [
  {
    pi:"1234567890",
    dn:"Josh Morton",
    sr:"Josh Morton",
    cn:"josh Morton",
    amt:"$123,456",
    pipeline: "$100,362",
    cd: "$300,652",
    ps:"Active",
    state:"Texas",
    sysSize:"10.5",
    type:"loan",
    adder:"$62,500",
    ajh:"12 Days",
    rl:"$20.00",
    epc:"2.444",
  },
  {
    pi:"1234567890",
    dn:"Josh Morton",
    sr:"Josh Morton",
    cn:"josh Morton",
    amt:"$123,456",
    pipeline: "$100,362",
    cd: "$300,652",
    ps:"Active",
    state:"Texas",
    sysSize:"10.5",
    type:"loan",
    adder:"$62,500",
    ajh:"12 Days",
    rl:"$20.00",
    epc:"2.444",
  },
  {
    pi:"1234567890",
    dn:"Josh Morton",
    sr:"Josh Morton",
    cn:"josh Morton",
    amt:"$123,456",
    pipeline: "$100,362",
    cd: "$300,652",
    ps:"Active",
    state:"Texas",
    sysSize:"10.5",
    type:"loan",
    adder:"$62,500",
    ajh:"12 Days",
    rl:"$20.00",
    epc:"2.444",
  },

];

const DashBoardTable: React.FC = () => {
  return (
    <>
    {/* <UserHeaderSection  name="Appointment Setter"/> */}
      <div
        className="TableContainer"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}  >
        <table>
          <thead style={{background: "#FCFCFD"}}>
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
                  <p>Project ID</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Dealer Name</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Sales Representative</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Customer Name</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Amt Prepaid</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Pipeline Remaining</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Current Due</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Project Status</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>State</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Sys. Size</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Type</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Adder</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>AJH</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>RL</p> <FaArrowDown style={{color:"#667085"}}/>
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>EPC</p> <FaArrowDown style={{color:"#667085"}}/>
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
                  <td style={{ fontWeight: "500", color: "black" }}>{el.pi}</td>
                  <td style={{color:"#101828"}}>{el.dn}</td>
                  <td style={{color:"#101828"}}>{el.sr}</td>
                  <td style={{color:"#101828"}}>{el.cn}</td>
                  <td style={{color: "#0493CE"}}>{el.amt}</td>
                  <td style={{color: "#0493CE"}}>{el.pipeline}</td>
                  <td style={{color: "#0493CE"}}>{el.cd}</td>
                  <td style={{color:"green"}}>{el.ps}</td>
                  <td>{el.state}</td>
                  <td>{el.sysSize}</td>
                  <td>{el.type}</td>
                  <td>{el.adder}</td>
                  <td>{el.ajh}</td>
                  <td>{el.rl}</td>
                  <td>{el.epc}</td>

                  <td>
                    <div className="">
                      <div className="" style={{ cursor: "pointer", textAlign:"center" }}>
                      <IoIosHelpCircleOutline />

                        {/* <img src={ICONS.ARCHIVE} alt="" /> */}
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

export default DashBoardTable;
