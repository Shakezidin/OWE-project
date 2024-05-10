import React, { useEffect, useState } from "react";
import "../configure.css";
import CreateDealer from "./CreateDealer";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { fetchDealer } from "../../../../redux/apiSlice/configSlice/config_get_slice/dealerSlice";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import { DealerModel } from "../../../../core/models/configuration/create/DealerModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { DealerTableData } from "../../../../resources/static_data/configureHeaderData/DealerTableData";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
import FilterModal from "../../../components/FilterModal/FilterModal";
import DataNotFound from "../../../components/loader/DataNotFound";
import Loading from "../../../components/loader/Loading";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { HTTP_STATUS } from "../../../../core/models/api_models/RequestModel";
import Swal from "sweetalert2";
import { ROUTES } from "../../../../routes/routes";
import { showAlert, successSwal } from "../../../components/alert/ShowAlert";

const DealerOverRides: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const dealerList = useAppSelector((state) => state.dealer.Dealers_list);
  const {loading,totalCount} = useAppSelector((state) => state.dealer);
  const error = useAppSelector((state) => state.dealer.error);
  
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const itemsPerPage = 5;
  const [sortKey, setSortKey] =  useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  const [editedDealer, setEditDealer] = useState<DealerModel | null>(null);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived ? true : undefined,
    };
    dispatch(fetchDealer(pageNumber));
  }, [dispatch,currentPage,viewArchived]);
  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };


  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const handleAddDealer = () => {
    setEditMode(false);
    setEditDealer(null);
    handleOpen()
  };
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filter = ()=>{
    setFilterOpen(true)

  }
  const handleEditDealer = (dealerData: DealerModel) => {
    setEditMode(true);
    setEditDealer(dealerData);
    handleOpen()
  };
  const currentPageData = dealerList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === dealerList?.length;
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
  const handleArchiveAllClick = async () => {
    const confirmed = await showAlert('Are Your Sure', 'This Action will archive your data', 'Yes', 'No');
    if (confirmed) {
      const archivedRows = Array.from(selectedRows).map(index => dealerList[index].record_id);
      if (archivedRows.length > 0) {
        const newValue = {
          record_id: archivedRows,
          is_archived: true
        };

        const pageNumber = {
          page_number: currentPage,
          page_size: itemsPerPage,
        };

        const res = await postCaller(EndPoints.update_dealer_archive, newValue);
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchDealer(pageNumber));
          const remainingSelectedRows = Array.from(selectedRows).filter(index => !archivedRows.includes(dealerList[index].record_id));
          const isAnyRowSelected = remainingSelectedRows.length > 0;
          setSelectAllChecked(isAnyRowSelected);
          setSelectedRows(new Set());
          await successSwal("Archived", "All Selected rows have been archived", "success", 2000, false);
        }
        else {
          await successSwal("Archived", "All Selected rows have been archived", "error", 2000, false);
        }
      }

    }
  };
  const handleArchiveClick = async (record_id: any) => {
    const confirmed = await showAlert('Are Your Sure', 'This Action will archive your data', 'Yes', 'No');
    if (confirmed){
      const archived: number[] = [record_id];
      let newValue = {
        record_id: archived,
        is_archived: true
      }
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
  
      };
      const res = await postCaller(EndPoints.update_dealer_archive, newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(fetchDealer(pageNumber))
        await successSwal("Archived", "All Selected rows have been archived", "success", 2000, false);
      }else{
        await successSwal("Archived", "All Selected rows have been archived", "error", 2000, false);
      }
    }
  
  };

  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setSelectAllChecked(false);
  };
  const fetchFunction = (req: any) => {
    dispatch(fetchDealer(req));
   };
   if (error) {
    return <div className="loader-container"><Loading/></div>;
  }
  if (loading) {
    return <div className="loader-container"><Loading/> {loading}</div>;
  }
console.log(currentPageData,"daaaaaaa");

  return (
    <div className="comm">
       <Breadcrumb head="Commission" linkPara="Configure" route={ROUTES.CONFIG_PAGE} linkparaSecond="Dealer OverRides"/>
      <div className="commissionContainer">
        <TableHeader
          title="Dealer OverRides"
          onPressViewArchive={() => handleViewArchiveToggle()}
          onPressArchive={() =>handleArchiveAllClick()}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          viewArchive={viewArchived}
          onpressExport={() => {}}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onpressAddNew={() => handleAddDealer()}
        />
        {filterOPen && <FilterModal handleClose={filterClose}
        columns={DealerTableData} 
        fetchFunction={fetchFunction}
        page_number = {currentPage}
        page_size = {itemsPerPage} />}
        {open && <CreateDealer handleClose={handleClose} 
         dealerData={editedDealer}
         editMode={editMode}
         page_number={currentPage}
         page_size={itemsPerPage}
        />}
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
               
               {
                DealerTableData.map((item,key)=>(
                  <SortableHeader
                  key={key}
                  isCheckbox={item.isCheckbox}
                  titleName={item.displayName}
                  data={dealerList}
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
               {
                viewArchived===true?null: <th>
                <div className="action-header">
                  <p>Action</p>
                </div>
              </th>
               }
              </tr>
            </thead>
            <tbody>
              {dealerList?.length > 0
                ? dealerList?.map((el: any, i: any) => (
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
                        {el.sub_dealer}
                   </div>
                      </td>
                      <td>{el.dealer}</td>
                      <td>{el.pay_rate}</td>
                      <td>{el.state}</td>
                      <td>{el.start_date}</td>
                      <td>{el.end_date}</td>
                   {
                    viewArchived===true?null:<td>
                    <div className="action-icon">
                      <div className="action-archive" style={{ cursor: "pointer" }} onClick={()=>handleArchiveClick(el.record_id)}>
                        <img src={ICONS.ARCHIVE} alt="" />
                        {/* <span className="tooltiptext">Archive</span> */}
                      </div>
                      <div className="action-archive" style={{ cursor: "pointer" }} onClick={()=>handleEditDealer(el)}>
                      <img src={ICONS.editIcon} alt="" />
                      {/* <span className="tooltiptext">Edit</span> */}
                      </div>
                    </div>
                  </td>
                   }
                    </tr>
                  ))
                : <tr style={{border:0}}>
                  <td colSpan={10}>
                  <div className="data-not-found">
                  <DataNotFound/>
                  <h2>Data Not Found</h2>
                  </div>
                  </td>
                </tr>
                }
            </tbody>
          </table>
        </div>
        
       {
        dealerList?.length > 0 ?
        <div className="page-heading-container">
      
          <p className="page-heading">
           {currentPage} - {totalCount} of {dealerList?.length} item
          </p>
      <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              currentPageData={currentPageData}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
perPage={itemsPerPage}
            /> 
       </div>
       :null}
      </div>
    </div>
  );
};

export default DealerOverRides;
