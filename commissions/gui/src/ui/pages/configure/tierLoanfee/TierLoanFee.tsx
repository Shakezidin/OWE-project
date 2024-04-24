import React, { useEffect, useState } from "react";

import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchTearLoan } from "../../../../redux/apiSlice/configSlice/config_get_slice/tearLoanSlice";
import CreateTierLoan from "./CreateTierLoan";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";

import { TierLoanFeeModel } from "../../../../core/models/configuration/create/TierLoanFeeModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";

import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
import { TierLoanColumn } from "../../../../resources/static_data/configureHeaderData/TierLoanFeeColumn";
import FilterModal from "../../../components/FilterModal/FilterModal";
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
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const filterClose = () => setFilterOpen(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTierLoanfee, setEditedTierLoanFee] = useState<TierLoanFeeModel | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [sortKey, setSortKey] =  useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
    };
    dispatch(fetchTearLoan(pageNumber));
  }, [dispatch,currentPage]);


  const handleAddTierLoan = () => {
    setEditMode(false);
    setEditedTierLoanFee(null);
    handleOpen()
  };

  const filter = ()=>{
    setFilterOpen(true)
 
  }
 
  const handleEditTierLoan = (tierEditedData: TierLoanFeeModel) => {
    setEditMode(true);
    setEditedTierLoanFee(tierEditedData);
    handleOpen()
  };
  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(tierloanList?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = tierloanList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === tierloanList.length;
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
  const fetchFunction = (req: any) => {
    dispatch(fetchTearLoan(req));
   };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="comm">
       <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Tier Loan Fee"/>
      <div className="commissionContainer">
        <TableHeader
          title="Tier Loan Fee"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          viewArchive={viewArchived}
          onpressAddNew={() => handleAddTierLoan()}
        />
        {filterOPen && <FilterModal handleClose={filterClose}
         columns={TierLoanColumn}
         page_number = {currentPage}
         fetchFunction={fetchFunction}
         page_size = {itemsPerPage}/>}
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
               
                {
                TierLoanColumn?.map((item,key)=>(
                  <SortableHeader
                  key={key}
                  isCheckbox={item.isCheckbox}
                  titleName={item.displayName}
                  data={tierloanList}
                  isAllRowsSelected={isAllRowsSelected}
                  isAnyRowSelected={isAnyRowSelected}
                  selectAllChecked={selectAllChecked}
                  setSelectAllChecked={setSelectAllChecked}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  sortKey={item.name}
                  sortDirection={sortKey === item.name ? sortDirection : undefined}
                  onClick={() => handleSort(item.name)}
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
                    
                      <td style={{ fontWeight: "500", color: "black" }}>
                  <div className="flex-check">
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
                        {el.dealer_tier}
                  </div>
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
        <div className="page-heading-container">
      
      <p className="page-heading">
       {currentPage} - {totalPages} of {currentPageData?.length} item
      </p>
 
   {
    tierloanList?.length > 0 ? <Pagination
      currentPage={currentPage}
      totalPages={totalPages} // You need to calculate total pages
      paginate={paginate}
      currentPageData={currentPageData}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
    /> : null
  }
   </div>
      </div>
    </div>
  );
};

export default TierLoanFee;
