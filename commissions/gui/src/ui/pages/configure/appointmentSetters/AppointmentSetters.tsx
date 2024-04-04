import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../configure.css";
import { CiEdit } from "react-icons/ci";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { FaArrowDown } from "react-icons/fa6";
const AppointmentSetters = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const appointmentSettersData = [
    {
      name: "Voltaic Power",
      pr: "$3002",
      desc: "Implementing solar system commission settings ",
      sd: "10/10/1000",
      ed: "99/99/9999",
      action: "$2000.00",
    },
    {
      name: "Voltaic Power",
      pr: "$3002",
      desc: "Implementing solar system commission settings ",
      sd: "10/10/1000",
      ed: "99/99/9999",
      action: "$2000.00",
    },
    {
      name: "Voltaic Power",
      pr: "$3002",
      desc: "Implementing solar system commission settings ",
      sd: "10/10/1000",
      ed: "99/99/9999",
      action: "$2000.00",
    },
  ];
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Appointment Setters"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => {}}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => {}}
        />
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
                <th>
                  <div>
                    <input value="test" type="checkbox" className="check-box" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p> Name</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    <p>Pay Rate</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    <p>Description</p> <FaArrowDown style={{color:"#667085"}}/>
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
                    <p>Action</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {appointmentSettersData.map((el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "500", color: "black" }}>
                    {el.name}
                  </td>

                  <td>{el.pr}</td>
                  <td>{el.desc}</td>
                  <td>{el.sd}</td>
                  <td>{el.ed}</td>

                  <td style={{ display: "flex", gap: "1rem" }}>
                  <img src={ICONS.ARCHIVE} alt="" />
                    <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSetters;
