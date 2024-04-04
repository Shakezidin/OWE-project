import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../configure.css";
import { CiEdit } from "react-icons/ci";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { FaArrowDown } from "react-icons/fa6";

const PaymentValidation = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const paymentValidationData = [
    {
      an: "ffs",
      det: "Freedom Forever Solar ",
      action: "$2000.00",
    },
    {
      an: "ffs",
      det: "Freedom Forever Solar ",
      action: "$2000.00",
    },
    {
      an: "ffs",
      det: "Freedom Forever Solar ",
      action: "$2000.00",
    },
    {
      an: "ffs",
      det: "Freedom Forever Solar ",
      action: "$2000.00",
    },
  ];
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Payment Validation"
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
                    <p>Adder Name</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    <p>Details</p> <FaArrowDown style={{color:"#667085"}}/>
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
              {paymentValidationData.map((el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "500", color: "black" }}>{el.an}</td>
                  <td>{el.det}</td>
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

export default PaymentValidation;
