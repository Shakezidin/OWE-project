import React, { useEffect, useState } from "react";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import { IRateRow, getAdjustments } from "../../../../redux/apiActions/arAdjustmentsAction";

import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { TimeLineSlaModel } from "../../../../core/models/configuration/create/TimeLineSlaModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import CreatedAdjustments from "./CreateAdjustments";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
import { AdjustmentsColumns} from "../../../../resources/static_data/configureHeaderData/AdjustmentsColumn";
import FilterModal from "../../../components/FilterModal/FilterModal";
import { ROUTES } from "../../../../routes/routes";
import { Adjustment } from "../../../../core/models/api_models/ArAdjustMentsModel";
import { format } from "date-fns";
import { showAlert, successSwal } from "../../../components/alert/ShowAlert";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { HTTP_STATUS } from "../../../../core/models/api_models/RequestModel";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import Loading from "../../../components/loader/Loading";
const Adjustments  = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const {data:arAdjustmentsList,isLoading,error,count} = useAppSelector(
    (state) => state.arAdjusments
  );
//   const loading = useAppSelector((state) => state.timelineSla.loading);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTimeLineSla, setEditedTimeLineSla] = useState<IRateRow | null>(null);
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived:viewArchived
    };
    dispatch(getAdjustments(pageNumber));
  }, [dispatch, currentPage,viewArchived]);

  const filter = () => {
    setFilterOpen(true)

  }

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const commissionList = useAppSelector((state) => state.arAdjusments.data);
  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(count / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const currentPageData = commissionList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === arAdjustmentsList?.length;
  const handleSort = (key: any) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  if (sortKey) {
    currentPageData.sort((a: any, b: any) => {
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
  const handleTimeLineSla = () => {
    setEditMode(false);
    setEditedTimeLineSla(null);
    handleOpen()
  };

  const handleArchiveClick = async (record_id: number[]) => {
    const confirmed = await showAlert(
      "Archive",
      "Are you sure do you want to archive",
      "Yes",
      "No"
    );
    if (confirmed) {
      const archived: number[] = record_id;
      let newValue = {
        record_id: archived,
        is_archived: true,
      };
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
        archived: viewArchived,
      };
      const res = await postCaller("update_adjustments_archive", newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(getAdjustments(pageNumber));
        await successSwal(
          "Archived",
          "All Selected rows have been archived"
        );
      } else {
        await successSwal(
          "Archived",
          "All Selected rows have been archived"
        );
      }
    }
  };

  const handleEditTimeLineSla = (timeLineSlaData: IRateRow) => {
    setEditMode(true);
    setEditedTimeLineSla(timeLineSlaData);
    handleOpen()
  };
  const fetchFunction = (req: any) => {
    dispatch(getAdjustments(req));
   };
  if (isLoading) {
    return <div className="loader-container"> <Loading/> </div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="comm">
      <Breadcrumb head="" linkPara="Configure" route={ROUTES.CONFIG_PAGE} linkparaSecond="Adjustments" />
      <div className="commissionContainer">
        <TableHeader
          title="Adjustments"
          onPressViewArchive={() => setViewArchived(prev=>!prev)}
          onPressArchive={() =>handleArchiveClick(Array.from(selectedRows).map((_,i:number)=>currentPageData[i].record_id))}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          checked={isAllRowsSelected}
          viewArchive={viewArchived}
          isAnyRowSelected={isAnyRowSelected}
          onpressExport={() => { }}
          onpressAddNew={() => handleTimeLineSla()}
        />
        {filterOPen && <FilterModal handleClose={filterClose}
          columns={AdjustmentsColumns}
          page_number={currentPage}
          fetchFunction={fetchFunction}
          page_size={itemsPerPage} />}
        {open && <CreatedAdjustments
         setViewArchived={setViewArchived}
         editData={editedTimeLineSla}
          editMode={editMode}
          handleClose={handleClose} />}
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>

            <thead >
              <tr>

                {
                  AdjustmentsColumns?.map((item, key) => (
                    <SortableHeader
                      key={key}
                      isCheckbox={item.isCheckbox}
                      titleName={item.displayName}
                      data={arAdjustmentsList}
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
            <tbody >
              {
                arAdjustmentsList.map((item:Adjustment,ind:number)=>{
                  return <tr key={item.unique_id}>

                  <td style={{paddingRight:0,textAlign:"left"}}>
                    <div className="flex-check">
                    <td style={{paddingInline:0}}>
                      <CheckBox
                         checked={selectedRows.has(ind)}
                         onChange={() =>
                           toggleRowSelection(
                            ind,
                             selectedRows,
                             setSelectedRows,
                             setSelectAllChecked
                           )
                         }
                      />
                    </td>
                      {item.unique_id}
                    </div>
                  </td>
                  <td>{item.customer}</td>
                  <td>{item.partner_name}</td>
                  <td>{item.installer_name}</td>
                  <td> {item.state_name} </td>
                  <td> {item.sys_size} </td>
                  <td> {item.bl} </td>
                  <td> {item.epc} </td>
                  <td> {item.date && format(new Date(item.date),"yyyy-MM-dd")} </td>
                  <td>{item.amount }</td>
                  <td>{item.notes.length>40?item.notes.slice(0,40)+"...":item.notes }</td>
                  
                  <td

                  >
                    {!viewArchived &&<div className="action-icon">
                      <div className="" style={{cursor:"pointer"}} onClick={()=>handleArchiveClick([item.record_id])} >
                        <img src={ICONS.ARCHIVE} alt="" />
                      </div>
                      <div className=""  style={{ cursor: "pointer" }} onClick={()=>handleEditTimeLineSla(item)}>
                        <img src={ICONS.editIcon} alt="" />
                      </div>
                    </div>}
                  </td>
                </tr>
                })
              }
            
                  
                
                 
            </tbody>

          </table>
        </div>
        <div className="page-heading-container">

          <p className="page-heading">
            {currentPage} - {totalPages} of {arAdjustmentsList?.length} item
          </p>

          {
            arAdjustmentsList?.length > 0 ? <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              currentPageData={currentPageData}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
perPage={itemsPerPage}
            /> : null
          }
        </div>

      </div>

    </div>

  );
};

export default Adjustments;
