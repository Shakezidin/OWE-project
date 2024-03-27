import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";

import arrowDown from "../../../../resources/assets/arrow-down.png";
import "../configure.css";
import { CiEdit } from "react-icons/ci";
import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import imgExport from "../../../../resources/assets/export.png";
import imgimport from "../../../../resources/assets/import.png";
import CreateDealer from "../dealerOverrides/CreateDealer";
import img from "../../../../resources/assets/checkbox-circle-line.png";
import CreateMarketingFees from "./CreateMarketungFees";
const MarketingFees: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const marketingFeeData = [
    {
      sou: "SOEB Settler",
      dba: "Plug PV",
      state: "Regular text column",
      fee: "$9802",
      play: "loan Type",
      note: "Regular text column",
      ed: "20-04-2024",
      sd: "20-04-2024",
    },
    {
      sou: "SOEB Settler",
      dba: "Plug PV",
      state: "Regular text column",
      fee: "$9802",
      play: "loan Type",
      note: "Regular text column",
      ed: "20-04-2024",
      sd: "20-04-2024",
    },
    {
      sou: "SOEB Settler",
      dba: "Plug PV",
      state: "Regular text column",
      fee: "$9802",
      play: "loan Type",
      note: "Regular text column",
      ed: "20-04-2024",
      sd: "20-04-2024",
    },
  ];
  return (
    <div className="comm">
      <div className="commissionContainer">
        <div className="commissionSection">
          <div className="rateSection">
            <h2>Marketing Fees</h2>
            <p style={{ color: "#667085", fontSize: "14px" }}>
              You can view and edit these data as per your requirement
            </p>
          </div>
          <div className="iconContainer">
            <div className="iconsSection2">
              <button type="button">
                {" "}
                <img src={imgExport} alt="" />
                View Archive
              </button>
            </div>
            <div className="iconsSection-filter">
              <button type="button">
                {" "}
                <img src={imgExport} alt="" />
              </button>
            </div>
            <div className="iconsSection2">
              <button type="button">
                {" "}
                <img src={imgExport} alt="" />
                Archive
              </button>
            </div>
            <div className="iconsSection2">
              <button type="button">
                {" "}
                <img src={imgimport} alt="" /> Import
              </button>
            </div>
            <div className="iconsSection2">
              <button type="button">
                {" "}
                <img src={imgExport} alt="" />
                Export
              </button>
            </div>
            <div className="iconsSection2">
              <button
                type="button"
                style={{
                  background: "black",
                  color: "white",
                  border: "1px solid black",
                }}
                onClick={handleOpen}
              >
                {" "}
                <IoAddSharp /> Add New
              </button>
            </div>
          </div>

          {open && <CreateMarketingFees handleClose={handleClose} />}
        </div>

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
                    <p>Source</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>DBA</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Fee Rate</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Chg Dlr</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Pay Soucre</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Note</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Dt.</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Dt.</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {marketingFeeData.map((el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "500", color: "black" }}>
                    {el.sou}
                  </td>
                  <td>{el.dba}</td>
                  <td>{el.state}</td>
                  <td>{el.fee}</td>
                  <td>
                    <div className="">
                      <img src={img} alt="" />
                    </div>
                  </td>
                  <td>
                    <div className="">
                      <img src={img} alt="" />
                    </div>
                  </td>
                  <td>{el.note}</td>
                  <td>{el.ed}</td>
                  <td>{el.sd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketingFees;
