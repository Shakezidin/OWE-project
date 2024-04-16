import React from "react";

import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";

import "../configure.css";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import CreateRepPayScale from "./CreateRepPayScale";
import { FaArrowDown } from "react-icons/fa6";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
const RepPayScale: React.FC = () => {

  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const reppayData = [
    {
      Zach: "Zach Rogers",
      az: "AZ",
      rep: "REP 80/20",
      adj: "ADJ-000",
      be: "--",
      startDate: "10/10/1000",
      endDate: "99/99/99990",
      delete: (
        <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
      ),
      edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
    },
    {
      Zach: "Zach Rogers",
      az: "AZ",
      rep: "REP 80/20",
      adj: "ADJ-000",
      be: "--",
      startDate: "10/10/1000",
      endDate: "99/99/99990",
      delete: (
        <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
      ),
      edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
    },
    {
      Zach: "Zach Rogers",
      az: "AZ",
      rep: "REP 80/20",
      adj: "ADJ-000",
      be: "--",
      startDate: "10/10/1000",
      endDate: "99/99/99990",
      delete: (
        <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
      ),
      edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
    },
    {
      Zach: "Zach Rogers",
      az: "AZ",
      rep: "REP 80/20",
      adj: "ADJ-000",
      be: "--",
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
       <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Rep Pay Scale"/>
      <div className="commissionContainer">
        <TableHeader
          title="Rep Pay Scale"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => {}}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() =>handleOpen()}
        />
        {open &&(<CreateRepPayScale handleClose={handleClose}/>)}
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
                    <p>Name</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Pay Scale</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Position</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>BE</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Date</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Date</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Action</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {reppayData.map((el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "500", color: "black" }}>
                    {el.Zach}
                  </td>
                  <td>{el.az}</td>
                  <td>{el.rep}</td>
                  <td>{el.adj}</td>
                  <td>{el.be}</td>
                  <td>{el.startDate}</td>
                  <td>{el.endDate}</td>

                  {/* <td>{el.endDate}</td> */}
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

export default RepPayScale;
