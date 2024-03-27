import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../configure.css";
import { CiEdit } from "react-icons/ci";
import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";
const SaleType = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const saleTypeData = [
    {
      an: "LEASE 0.0",
      des: "Customer paying OWE Directly ",
      action: "",
    },
    {
      an: "LEASE 0.0",
      des: "Customer paying OWE Directly ",
      action: "",
    },
    {
      an: "LEASE 0.0",
      des: "Customer paying OWE Directly ",
      action: "",
    },
    {
      an: "LEASE 0.0",
      des: "Customer paying OWE Directly ",
      action: "",
    },
  ];
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Sale Types"
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
                    <p> Name</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
              {saleTypeData.map((el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "500", color: "black" }}>{el.an}</td>

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

export default SaleType;
