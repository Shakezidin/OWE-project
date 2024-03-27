import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../configure.css";
import { CiEdit } from "react-icons/ci";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
const LoanType = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const loanTypeDAta = [
    {
      pc: " LF-CON-FLEX-20Y-1.49",
      des: "Customer paying OWE Directly ",
      action: "",
    },
    {
      pc: " LF-CON-FLEX-20Y-1.49",
      des: "Customer paying OWE Directly ",
      action: "",
    },
    {
      pc: " LF-CON-FLEX-20Y-1.49",
      des: "Customer paying OWE Directly ",
      action: "",
    },
    {
      pc: " LF-CON-FLEX-20Y-1.49",
      des: "Customer paying OWE Directly ",
      action: "",
    },
  ];
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Loan Type"
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
                    <p>Product Code</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    <p>Active</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    <p>Adder</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Description</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
              {loanTypeDAta.map((el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "500", color: "black" }}>{el.pc}</td>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td>
                    <div
                      className=""
                      style={{
                        border: "1px solid #979797",
                        width: "40px",
                        height: "24px",
                        top: "232px",
                        left: "763px",
                        gap: "0px",
                        borderRadius: "8px",
                        opacity: "0px",
                      }}
                    ></div>
                  </td>
                  <td>{el.des}</td>
                  <td style={{ display: "flex", gap: "1rem" }}>
                    <RiDeleteBin5Line
                      style={{ fontSize: "1.5rem", color: "#344054" }}
                    />
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

export default LoanType;
