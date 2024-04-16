import React, { useEffect, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../configure.css";
import { CiEdit } from "react-icons/ci";

import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { fetchSalesType } from "../../../../redux/apiSlice/configSlice/config_get_slice/salesSlice";
import CreateSaleType from "./CreateSaleType";
import CheckBox from "../../../components/chekbox/CheckBox";

import {
  toggleAllRows,
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import FilterSale from "./FilterSale";
import { FaArrowDown } from "react-icons/fa6";
import { SalesTypeModel } from "../../../../core/models/configuration/create/SalesTypeModel";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import { Column } from "../../../../core/models/data_models/FilterSelectModel";

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
  const itemsPerPage = 5;
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 10,
    };
    dispatch(fetchSalesType(pageNumber));
  }, [dispatch,currentPage]);
  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };
  const columns: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },

    { name: "type_name", displayName: "Name", type: "string" },
    { name: "description", displayName: "Description", type: "string" },
 
  ];
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
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
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
  const currentPageData = salesTypeList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === salesTypeList.length;
  return (
    <div className="comm">
       <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Sale Type"/>
      <div className="commissionContainer">
        <TableHeader
          title="Sale Types"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleAddSaleType()}
        />
        {filterOPen && <FilterSale handleClose={filterClose}
         columns={columns}
         page_number = {1}
         page_size = {5}/>}
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
                <th>
                  <div>
                    <CheckBox
                      checked={selectAllChecked}
                      onChange={() =>
                        toggleAllRows(
                          selectedRows,
                          salesTypeList,
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
                    <p> Name</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    <p>Description</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    <p>Action</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
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
                        {el.type_name}
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
                      <div className="" style={{cursor:"pointer"}} onClick={()=>handleEditSaleType(el)}>
                      <img src={ICONS.editIcon} alt="" />
                      </div>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
      {
      salesTypeList?.length>0?  <Pagination
      currentPage={currentPage}
      totalPages={totalPages} // You need to calculate total pages
      paginate={paginate}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
    />:null
    }
    </div>
  );
};

export default SaleType;
