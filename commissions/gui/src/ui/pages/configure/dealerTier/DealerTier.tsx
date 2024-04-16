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
  const columns: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },

    { name: "dealer", displayName: "Dealer", type: "string" },
    { name: "tier", displayName: "Tier", type: "string" },
    { name: "start_date", displayName: "Start Date", type: "date" },
    { name: "end_date", displayName: "End Date", type: "date" }
  ];
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
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === dealerTierList.length;
  const currentPageData = dealerTierList?.slice(startIndex, endIndex);
  return (
    <div className="comm">
       <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Dealer Tier"/>
      <div className="commissionContainer">
        <TableHeader
          title="Dealer Tier"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleAddDealerTier()}
        />
        {filterOPen && <FilterDealerTier handleClose={filterClose}  
             columns={columns}
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
                <th>
                  <div className="table-header">
                    <p>Dealer Name</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Tier</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}}/>
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
                        {el.dealer_name}
                      </td>
                      <td>{el.tier}</td>
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
                       <div className="" style={{cursor:"pointer"}} onClick={()=>handleEditDealerTier(el)}>
                       <img src={ICONS.editIcon} alt="" />
                       </div>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
        {
      dealerTierList?.length>0?  <Pagination
      currentPage={currentPage}
      totalPages={totalPages} // You need to calculate total pages
      paginate={paginate}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
    />:null
    }
      </div>
   
    </div>
  );
};

export default DealerTier;
