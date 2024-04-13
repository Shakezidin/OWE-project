import React, { useEffect, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../configure.css";
import { CiEdit } from "react-icons/ci";
import CreateDealer from "./CreateDealer";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { fetchDealer } from "../../../../redux/apiSlice/configSlice/config_get_slice/dealerSlice";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleAllRows,
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import FilterDealer from "./FilterDealer";
import { DealerModel } from "../../../../core/models/configuration/create/DealerModel";
import { FaArrowDown } from "react-icons/fa6";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";

const DealerOverRides: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const dealerList = useAppSelector((state) => state.dealer.Dealers_list);
  const loading = useAppSelector((state) => state.dealer.loading);
  const error = useAppSelector((state) => state.dealer.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [columns, setColumns] = useState<string[]>([]);
  const [editedDealer, setEditDealer] = useState<DealerModel | null>(null);
  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 10,
    };
    dispatch(fetchDealer(pageNumber));
  }, [dispatch]);
  const handleAddDealer = () => {
    setEditMode(false);
    setEditDealer(null);
    handleOpen()
  };
  const getColumnNames = () => {
    if (dealerList.length > 0) {
      const keys = Object.keys(dealerList[0]);
      setColumns(keys);
    }
  };
  const filter = ()=>{
    setFilterOpen(true)
    getColumnNames()
  }
  const handleEditDealer = (dealerData: DealerModel) => {
    setEditMode(true);
    setEditDealer(dealerData);
    handleOpen()
  };
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === dealerList?.length;
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="comm">
       <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Dealer OverRides"/>
      <div className="commissionContainer">
        <TableHeader
          title="Dealer OverRides"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleAddDealer()}
        />
        {filterOPen && <FilterDealer handleClose={filterClose}
        columns={columns}
        page_number = {1}
        page_size = {5} />}
        {open && <CreateDealer handleClose={handleClose} 
         dealerData={editedDealer}
         editMode={editMode}
        />}
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
                <th>
                  <div>
                    <CheckBox
                      checked={selectAllChecked}
                      onChange={() =>
                        toggleAllRows(
                          selectedRows,
                          dealerList,
                          setSelectedRows,
                          setSelectAllChecked
                        )
                      }
                      indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sub Dealer</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Dealer</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Pay Rate</p> <FaArrowDown style={{color:"#667085"}}/>
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
              {dealerList?.length > 0
                ? dealerList?.map((el, i) => (
                    <tr key={i}>
                      <td>
                        <CheckBox
                          checked={selectedRows.has(i)}
                          onChange={() =>
                            toggleRowSelection(
                              i,
                              selectedRows,
                              setSelectedRows,
                              setSelectAllChecked
                            )
                          }
                        />
                      </td>
                      <td style={{ fontWeight: "500", color: "black" }}>
                        {el.sub_dealer}
                      </td>
                      <td>{el.dealer}</td>
                      <td>{el.pay_rate}</td>
                      <td>{el.start_date}</td>
                      <td>{el.end_date}</td>

                      {/* <td>{el.endDate}</td> */}
                      <td>
                        <div className="action-icon">
                          <div className="" style={{ cursor: "pointer" }}>
                            <img src={ICONS.ARCHIVE} alt="" />
                          </div>
                          <div className="" style={{ cursor: "pointer" }} onClick={()=>handleEditDealer(el)}>
                          <img src={ICONS.editIcon} alt="" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DealerOverRides;
