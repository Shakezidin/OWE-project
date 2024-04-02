import React from "react";
import "../../userManagement/user.css";
import { ICONS } from "../../../icons/Icons";
import { CiEdit } from "react-icons/ci";
import CheckBox from "../../../components/chekbox/CheckBox";
import '../../configure/configure.css'
import UserHeaderSection from "../UserHeader/UserHeaderSection";
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
    <UserHeaderSection  name="Appointment Setter"/>
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
                  <p>Name</p> <img src={ICONS.DOWN_ARROW} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Pay Rate</p> <img src={ICONS.DOWN_ARROW} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Descriptions</p> <img src={ICONS.DOWN_ARROW} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Start Date</p> <img src={ICONS.DOWN_ARROW} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>End Date</p> <img src={ICONS.DOWN_ARROW} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Action</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
                  <td style={{ fontWeight: "500", color: "black" }}>{el.name}</td>
                  <td>{el.pay}</td>
                  <td>{el.des}</td>
                  <td>{el.sd}</td>
                  <td>{el.ed}</td>
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

export default AppointmentSetterTable;
