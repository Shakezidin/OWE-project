import React, { useEffect, useState } from "react";

import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchTearLoan } from "../../../../redux/apiSlice/configSlice/config_get_slice/tearLoanSlice";
import CreateTierLoan from "./CreateTierLoan";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleAllRows,
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import FilterTierLoan from "./filterTierLoan";
import { FaArrowDown } from "react-icons/fa6";
import { TierLoanFeeModel } from "../../../../core/models/configuration/create/TierLoanFeeModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import { Column } from "../../../../core/models/data_models/FilterSelectModel";
const TierLoanFee = () => {
  const dispatch = useAppDispatch();
  const tierloanList = useAppSelector(
    (state) => state.tierLoan.tier_loan_fee_list
  );
  const loading = useAppSelector((state) => state.tierLoan.loading);
  const error = useAppSelector((state) => state.tierLoan.error);
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const filterClose = () => setFilterOpen(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTierLoanfee, setEditedTierLoanFee] = useState<TierLoanFeeModel | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 10,
    };
    dispatch(fetchTearLoan(pageNumber));
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleAddTierLoan = () => {
    setEditMode(false);
    setEditedTierLoanFee(null);
    handleOpen()
  };
  const columns: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },

    { name: "dealer_tier", displayName: "Dealer Tier", type: "string" },
    { name: "installer", displayName: "Installer", type: "string" },
    { name: "state", displayName: "State", type: "string" },
    { name: "finance_type", displayName: "Finance Type", type: "string" },
    { name: "owe_cost", displayName: "OWE Cost", type: "string" },
    { name: "dlr_mu", displayName: "DLR MU", type: "string" },
    { name: "dlr_cost", displayName: "DLR Cost", type: "string" },
    { name: "start_date", displayName: "Start Date", type: "date" },
    { name: "end_date", displayName: "End Date", type: "date" }
  ];
  const filter = ()=>{
    setFilterOpen(true)
 
  }
 
  const handleEditTierLoan = (tierEditedData: TierLoanFeeModel) => {
    setEditMode(true);
    setEditedTierLoanFee(tierEditedData);
    handleOpen()
  };
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === tierloanList.length;

  return (
    <div className="comm">
       <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Tier Loan Fee"/>
      <div className="commissionContainer">
        <TableHeader
          title="Tier Loan Fee"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleAddTierLoan()}
        />
        {filterOPen && <FilterTierLoan handleClose={filterClose}
         columns={columns}
         page_number = {1}
         page_size = {5}/>}
        {open && <CreateTierLoan 
        editMode={editMode}
      tierEditedData={editedTierLoanfee}
        handleClose={handleClose}
        
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
                          tierloanList,
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
                    <p>Dealer Tier</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Installer</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Finance Type </p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>OWE Cost</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>DLR MU</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>DLR Cost</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
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
                  <div className="action-header">
                    <p>Action</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {tierloanList?.length > 0
                ? tierloanList?.map((el: any, i: any) => (
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
                        {el.dealer_tier}
                      </td>
                      <td>{el.installer}</td>
                      <td>{el.state}</td>
                      <td>{el.finance_type}</td>
                      <td>{el.owe_cost}</td>
                      <td>{el.dlr_mu}</td>
                      <td>{el.dlr_cost}</td>
                      <td>{el.start_date}</td>
                      <td>{el.end_date}</td>
                      <td
                        
                      >
                      <div className="action-icon">
                <div className="">
                <img src={ICONS.ARCHIVE} alt="" />
                </div>
                     <div className="" style={{cursor:"pointer"}} onClick={()=>handleEditTierLoan(el)}>
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

export default TierLoanFee;
