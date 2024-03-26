import React, { useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";

import arrowDown from "../../../../resources/assets/arrow-down.png";
import "../configure.css";
import { CiEdit } from "react-icons/ci";

import { MdFilterList } from "react-icons/md";
import { IoAddSharp } from "react-icons/io5";
import imgExport from "../../../../resources/assets/export.png";
import imgimport from "../../../../resources/assets/import.png";
import CreateDealer from "./CreateDealer";
import { useAppDispatch, useAppSelector } from '../../../../redux/features/hooks';

import { getDealer } from "../../../../redux/features/dealerSlice";
const DealerOverRides: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
const dispatch = useAppDispatch()
const dealerList = useAppSelector(state=>state.dealer.data);
const loading = useAppSelector(state=>state.dealer.loading);
const error = useAppSelector(state=>state.dealer.error);

useEffect(() => {
  const pageNumber = {
    "page_number": 1,
    "page_size": 2
}
  dispatch(getDealer(pageNumber));
}, []);
console.log(dealerList)
if (loading) {
  return <div>Loading...</div>;
}

if (error) {
  return <div>Error: {error}</div>;
}
  return (
    <div className="comm">
      <div className="commissionContainer">
        <div className="commissionSection">
          <div className="rateSection">
            <h2>Dealer Overrides</h2>
            <p style={{ color: "#667085", fontSize: "14px" }}>
              You can view and edit these data as per your requirement
            </p>
          </div>
          <div className="iconContainer">
            <div className="iconsSection">
              <button type="button">
                {" "}
                <RiDeleteBin5Line /> Delete
              </button>
            </div>
            <div className="iconsSection">
              <button type="button">
                {" "}
                <MdFilterList /> Filter
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
                style={{ background: "black", color: "white",border:"1px solid black" }}
                onClick={handleOpen}
              >
                {" "}
                <IoAddSharp /> Add New
              </button>
            </div>
          </div>

          {open && <CreateDealer handleClose={handleClose} />}
        </div>
        <div className="TableContainer" style={{overflowX:"auto",whiteSpace:"nowrap"}}>
          <table>
          <thead >
              <tr>
                <th>
                  <div>
                    <input value="test" type="checkbox" className='check-box' />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sub Dealer</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Dealer</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Pay Rate</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Date</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Date</p> <img src={arrowDown} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Action</p> <img src={arrowDown} alt="" />
                  </div>
                </th>

              </tr>
            </thead>
          
            <tbody>
            {
                dealerList?.Dealers_list?.length>0 ? dealerList?.Dealers_list?.map((el:any,i:any)=>(
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "500",color:"black" }}>{el.sub_dealer}</td>
                  <td>{el.dealer}</td>
                  <td>{el.pay_rate}</td>
                  <td>{el.start_date}</td>
                  <td>{el.end_date}</td>

                  {/* <td>{el.endDate}</td> */}
                  <td>
                    <div className="action-icon">
                      <div className="" style={{ cursor: "pointer" }}>
                      <RiDeleteBin5Line style={{ fontSize: "1.5rem", color: "#344054" }} />
                      </div>
                      <div className="" style={{ cursor: "pointer" }}>
                      <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
                      </div>
                    </div>
                  </td>
                </tr>
              )):null
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DealerOverRides;
