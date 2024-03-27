import React from "react";

import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";

const TierLoanFee = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const tierloandata = [
    {
      name: "TIER 000001",
      inst: "OWE",
      state: "AZ",
      ftn: "LF-CON-FLEX-20Y-1.49",
      oc: "22.99%",
      be: "00.3%",
      dlr: "25.99%",
      sd: "99/99/99990",
      ed: "99/99/99990",
      delete: (
        <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
      ),
      edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
    },
    {
      name: "TIER 000001",
      inst: "OWE",
      state: "AZ",
      ftn: "LF-CON-FLEX-20Y-1.49",
      oc: "22.99%",
      be: "00.3%",
      dlr: "25.99%",
      sd: "99/99/99990",
      ed: "99/99/99990",
      delete: (
        <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
      ),
      edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
    },
    {
      name: "TIER 000001",
      inst: "OWE",
      state: "AZ",
      ftn: "LF-CON-FLEX-20Y-1.49",
      oc: "22.99%",
      be: "00.3%",
      dlr: "25.99%",
      sd: "99/99/99990",
      ed: "99/99/99990",
      delete: (
        <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
      ),
      edit: <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />,
    },
    {
      name: "TIER 000001",
      inst: "OWE",
      state: "AZ",
      ftn: "LF-CON-FLEX-20Y-1.49",
      oc: "22.99%",
      be: "00.3%",
      dlr: "25.99%",
      sd: "99/99/99990",
      ed: "99/99/99990",
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
          title="Tier Loan Fee"
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
                    <p>Dealer Tier</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Installer</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Finance Type </p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>OWE Cost</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>DLR MU</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>DLR Cost</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
              {tierloandata.map((el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "500", color: "black" }}>
                    {el.name}
                  </td>
                  <td>{el.inst}</td>
                  <td>{el.state}</td>
                  <td>{el.ftn}</td>
                  <td>{el.oc}</td>
                  <td>{el.be}</td>
                  <td>{el.dlr}</td>
                  <td>{el.sd}</td>
                  <td>{el.ed}</td>
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

export default TierLoanFee;
