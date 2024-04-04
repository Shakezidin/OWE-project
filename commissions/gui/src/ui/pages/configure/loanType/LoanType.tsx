import React, { useEffect, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../configure.css";
import { CiEdit } from "react-icons/ci";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchLoanType } from "../../../../redux/apiSlice/configSlice/config_get_slice/loanTypeSlice";
import CreateLoanType from "./CreateLoanType";
import CheckBox from "../../../components/chekbox/CheckBox";
import { FaArrowDown } from "react-icons/fa6";

import {
  toggleAllRows,
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import FilterLoanType from "./FilterLoanType";
import { LoanTypeModel } from "../../../../core/models/configuration/create/LoanTypeModel";

const LoanType = () => {
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filter = () => setFilterOpen(true);
  const filterClose = () => setFilterOpen(false);
  const loanTypeList = useAppSelector(
    (state) => state?.loanType?.loantype_list
  );
  const loading = useAppSelector((state) => state.loanType.loading);
  const error = useAppSelector((state) => state.loanType.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedLoanData, setEditedLoanData] = useState<LoanTypeModel | null>(null);
  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 10,
    };
    dispatch(fetchLoanType(pageNumber));
  }, [dispatch]);
  const handleAddLoan = () => {
    setEditMode(false);
    setEditedLoanData(null);
    handleOpen()
  };

  const handleEditLoan = (loanData:LoanTypeModel) => {
    setEditMode(true);
    setEditedLoanData(loanData);
    handleOpen()
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
 
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === loanTypeList.length;
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Loan Type"
          onPressViewArchive={() => { }}
          onPressArchive={() => { }}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          onpressExport={() => { }}
          onpressAddNew={() => handleAddLoan()}
        />
        {filterOPen && <FilterLoanType handleClose={filterClose} />}
        {open && <CreateLoanType
         loanData={editedLoanData}
         editMode={editMode}
         handleClose={handleClose} />}
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
                          loanTypeList,
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
                    <p>Product Code</p> <FaArrowDown style={{color:"#667085"}}/> 
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    <p>Active</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    <p>Adder</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Description</p> <FaArrowDown style={{color:"#667085"}}/>
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
              {loanTypeList?.length > 0
                ? loanTypeList?.map((el, i) => (
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
                      {el.product_code}
                    </td>
                    <td>
                    <CheckBox
                        checked={el.active===1}
                        onChange={() =>
                          {}
                        }
                      />
                    </td>
                    <td>
                      {el.adder}
                    </td>
                    <td>{el.description}</td>
                    <td
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <img src={ICONS.ARCHIVE} alt="" />
                     <div className="" style={{cursor:"pointer"}} >
                    <div className="" style={{cursor:"pointer"}} onClick={()=>handleEditLoan(el)}>
                    <CiEdit
                        style={{ fontSize: "1.5rem", color: "#344054" }}
                      />
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

export default LoanType;
