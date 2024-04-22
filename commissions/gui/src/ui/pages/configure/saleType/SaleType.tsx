import React, { useEffect, useState } from "react";
import "../configure.css";

import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { fetchSalesType } from "../../../../redux/apiSlice/configSlice/config_get_slice/salesSlice";
import CreateSaleType from "./CreateSaleType";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import { SalesTypeModel } from "../../../../core/models/configuration/create/SalesTypeModel";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import { Column } from "../../../../core/models/data_models/FilterSelectModel";
import { SalesTypeColumn } from "../../../../resources/static_data/configureHeaderData/SalesTypeColumn";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
import FilterModal from "../../../components/FilterModal/FilterModal";

const SaleType = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const salesTypeList = useAppSelector(
    (state) => state.salesType.saletype_list
  );
  const loading = useAppSelector((state) => state.salesType.loading);
  const error = useAppSelector((state) => state.salesType.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedSalesType, setEditedMarketing] = useState<SalesTypeModel | null>(null);
  const itemsPerPage = 10;
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  const [sortKey, setSortKey] =  useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
    };
    dispatch(fetchSalesType(pageNumber));
  }, [dispatch,currentPage]);
  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const filter = ()=>{
    setFilterOpen(true)

  }
  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(salesTypeList?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = salesTypeList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === salesTypeList.length;
  const handleAddSaleType = () => {
    setEditMode(false);
    setEditedMarketing(null);
    handleOpen()
  };

  const handleEditSaleType = (saleTypeData: SalesTypeModel) => {
    setEditMode(true);
    setEditedMarketing(saleTypeData);
    handleOpen()
  };
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
    dispatch(fetchSalesType(req));
   };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
 
  return (
    <div className="comm">
       <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Sale Type"/>
      <div className="commissionContainer">
        <TableHeader
          title="Sale Types"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleAddSaleType()}
        />
        {filterOPen && <FilterModal handleClose={filterClose}
         columns={SalesTypeColumn}
         fetchFunction={fetchFunction}
         page_number = {currentPage}
         page_size = {itemsPerPage}/>}
        {open && <CreateSaleType salesTypeData={editedSalesType}
                         editMode={editMode}
                         handleClose={handleClose} />}
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
          
                {
                SalesTypeColumn.map((item,key)=>(
                  <SortableHeader
                  key={key}
                  isCheckbox={item.isCheckbox}
                  titleName={item.displayName}
                  data={salesTypeList}
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
                        {el.type_name}
                   </div>
                      </td>

                      <td>{el.description}</td>

                      <td
                       
                      >
                      <div className="action-icon">
                      <div className="">
                      <img src={ICONS.ARCHIVE} alt="" />
                      </div>
                      <div className="" style={{cursor:"pointer"}} onClick={()=>handleEditSaleType(el)}>
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
    salesTypeList?.length > 0 ? <Pagination
      currentPage={currentPage}
      totalPages={totalPages} // You need to calculate total pages
      paginate={paginate}
      goToNextPage={goToNextPage}
      currentPageData={currentPageData}
      goToPrevPage={goToPrevPage}
    /> : null
  }
   </div>
      </div>
     
    </div>
  );
};

export default SaleType;
