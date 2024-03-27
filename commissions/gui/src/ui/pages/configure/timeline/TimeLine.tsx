import React from "react";

import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
const TimeLine = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const timeLineData = [
    {
      m2m: "TIER 000001",
      state: "AZ",
      days: "5",
      startDate: "10/10/1000",
      endDate: "99/99/99990",
      delete: (
        <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
      ),
      edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
    },
    {
      m2m: "TIER 000001",
      state: "AZ",
      days: "5",
      startDate: "10/10/1000",
      endDate: "99/99/99990",
      delete: (
        <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
      ),
      edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
    },
    {
      m2m: "TIER 000001",
      state: "AZ",
      days: "5",
      startDate: "10/10/1000",
      endDate: "99/99/99990",
      delete: (
        <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
      ),
      edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
    },
    {
      m2m: "TIER 000001",
      state: "AZ",
      days: "5",
      startDate: "10/10/1000",
      endDate: "99/99/99990",
      delete: (
        <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
      ),
      edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
    },
  ];
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Time Line"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => {}}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => {}}
        />
        <div className="TableContainer">
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
                    <p>TYPE / M2M</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Days</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
              {timeLineData.map((el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "500", color: "black" }}>
                    {el.m2m}
                  </td>
                  <td>{el.state}</td>
                  <td>{el.days}</td>
                  <td>{el.startDate}</td>
                  <td>{el.endDate}</td>
                  <td>
                    <div className="action-icon">
                      <div className="" style={{ cursor: "pointer" }}>
                        {el.delete}
                      </div>
                      <div className="" style={{ cursor: "pointer" }}>
                        {el.edit}
                      </div>
                    </div>
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

export default TimeLine;
