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
  const filter = () => setFilterOpen(true);
  const filterClose = () => setFilterOpen(false);
  
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
 
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === tierloanList.length;

  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Tier Loan Fee"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleOpen()}
        />
        {filterOPen && <FilterTierLoan handleClose={filterClose}/>}
        {open && <CreateTierLoan handleClose={handleClose} />}
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
                    <p>Dealer Tier</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Installer</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Finance Type </p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>OWE Cost</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>DLR MU</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>DLR Cost</p> <FaArrowDown style={{color:"#667085"}}/>
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
              {tierloanList?.length > 0
                ? tierloanList?.map((el, i) => (
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
                        style={{
                          display: "flex",
                          gap: "1rem",
                          alignItems: "center",
                        }}
                      >
                        <img src={ICONS.ARCHIVE} alt="" />
                        <CiEdit
                          style={{ fontSize: "1.5rem", color: "#344054" }}
                        />
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
