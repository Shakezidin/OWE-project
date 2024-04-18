import React, { useEffect, useState } from "react";

import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { IoAddSharp } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { fetchDealerTier } from "../../../../redux/apiSlice/configSlice/config_get_slice/dealerTierSlice";
import CreateDealerTier from "./CreateDealerTier";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleAllRows,
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import FilterDealerTier from "./FilterDealerTier";
import { FaArrowDown } from "react-icons/fa6";
import { DealerTierModel } from "../../../../core/models/configuration/create/DealerTierModel";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import Pagination from "../../../components/pagination/Pagination";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import { Column } from "../../../../core/models/data_models/FilterSelectModel";
import { DealerTierColumn } from "../../../../resources/static_data/configureHeaderData/DealerTierColumn";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
const DealerTier = () => {
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterClose = () => setFilterOpen(false);
  const dealerTierList = useAppSelector(
    (state) => state.dealerTier.dealers_tier_list
  );
  const loading = useAppSelector((state) => state.dealerTier.loading);
  const error = useAppSelector((state) => state.dealerTier.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedDealerTier, setEditedDealerTier] = useState<DealerTierModel | null>(null);
  const [sortKey, setSortKey] =  useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 5;
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size:itemsPerPage,
    };
    dispatch(fetchDealerTier(pageNumber));
  }, [dispatch,currentPage]);
  console.log(dealerTierList);

  const filter = ()=>{
    setFilterOpen(true)

  }
  const handleAddDealerTier = () => {
    setEditMode(false);
    setEditedDealerTier(null);
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
  const totalPages = Math.ceil(dealerTierList?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handleEditDealerTier = (editDealerTier: DealerTierModel) => {
    setEditMode(true);
    setEditedDealerTier(editDealerTier);
    handleOpen()
  };
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === dealerTierList.length;
  const currentPageData = dealerTierList?.slice(startIndex, endIndex);
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
       <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Dealer Tier"/>
      <div className="commissionContainer">
        <TableHeader
          title="Dealer Tier"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleAddDealerTier()}
        />
        {filterOPen && <FilterDealerTier handleClose={filterClose}  
             columns={DealerTierColumn}
             page_number = {currentPage}
             page_size = {itemsPerPage} />}
        {open && <CreateDealerTier handleClose={handleClose} 
         editDealerTier={editedDealerTier}
         editMode={editMode} />}
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
                          dealerTierList,
                          setSelectedRows,
                          setSelectAllChecked
                        )
                      }
                      indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    />
                  </div>
                </th>
                {
                DealerTierColumn?.map((item,key)=>(
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
                        {el.dealer_name}
                      </td>
                      <td>{el.tier}</td>
                      <td>{el.start_date}</td>
                      <td>{el.end_date}</td>
                      <td
                       
                      >
                         <div className="action-icon">
                         <div className="" style={{ cursor: "pointer" }}>
                           <img src={ICONS.ARCHIVE} alt="" />
                           </div>
                     
                       <div className="" style={{cursor:"pointer"}} onClick={()=>handleEditDealerTier(el)}>
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
       {currentPage} - {totalPages} of {dealerTierList?.length} item
      </p>
 
   {
    dealerTierList?.length > 0 ? <Pagination
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

export default DealerTier;
