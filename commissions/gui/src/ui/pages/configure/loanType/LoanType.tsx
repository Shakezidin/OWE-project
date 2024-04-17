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
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import { Column } from "../../../../core/models/data_models/FilterSelectModel";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
import { LoanTypeColumns } from "../../../../resources/static_data/configureHeaderData/LoanTypeColumn";

const LoanType = () => {
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
  const itemsPerPage = 5;
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  const [sortKey, setSortKey] =  useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 10,
    };
    dispatch(fetchLoanType(pageNumber));
  }, [dispatch,currentPage]);
  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };


  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const handleAddLoan = () => {
    setEditMode(false);
    setEditedLoanData(null);
    handleOpen()
  };

  const filter = ()=>{
    setFilterOpen(true)
 
  }
  const totalPages = Math.ceil(loanTypeList?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handleEditLoan = (loanData:LoanTypeModel) => {
    setEditMode(true);
    setEditedLoanData(loanData);
    handleOpen()
  };
  const currentPageData = loanTypeList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === loanTypeList.length;
  const handleSort = (key:any) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  if (sortKey) {
    currentPageData.sort((a:any, b:any) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        // Ensure numeric values for arithmetic operations
        const numericAValue = typeof aValue === 'number' ? aValue : parseFloat(aValue);
        const numericBValue = typeof bValue === 'number' ? bValue : parseFloat(bValue);
        return sortDirection === 'asc' ? numericAValue - numericBValue : numericBValue - numericAValue;
      }
    });
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
 
 
  return (
    <div className="comm">
       <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Loan Type"/>
      <div className="commissionContainer">

        <TableHeader
          title="Loan Type"
          onPressViewArchive={() => { }}
          onPressArchive={() => { }}
          checked={selectAllChecked}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          onpressExport={() => { }}
          onpressAddNew={() => handleAddLoan()}
        />
        {filterOPen && <FilterLoanType handleClose={filterClose}
         columns={LoanTypeColumns}
         page_number = {1}
         page_size = {5} />}
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
                {
                LoanTypeColumns?.map((item,key)=>(
                  <SortableHeader
                  key={key}
                  titleName={item.displayName}
                  sortKey={item.name}
                  sortDirection={sortKey === item.name ? sortDirection : undefined}
                  onClick={()=>handleSort(item.name)}
                  />
                ))
              }
                <th>
                  <div className="action-header">
                    <p>Action</p> 
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPageData?.length > 0
                ? currentPageData?.map((el: any, i: any) => (
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
                    
                    >
                   <div className="action-icon">
               <div className="">
               <img src={ICONS.ARCHIVE} alt="" />
               </div>
                    
                    <div className="" style={{cursor:"pointer"}} onClick={()=>handleEditLoan(el)}>
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
        <div className="page-heading-container">
      
      <p className="page-heading">
       {currentPage} - {totalPages} of {loanTypeList?.length} item
      </p>
 
   {
    loanTypeList?.length > 0 ? <Pagination
      currentPage={currentPage}
      totalPages={totalPages} // You need to calculate total pages
      paginate={paginate}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
    /> : null
  }
   </div>
      </div>
    </div>
  );
};

export default LoanType;
