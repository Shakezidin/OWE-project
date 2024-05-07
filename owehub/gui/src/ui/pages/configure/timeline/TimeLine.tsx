import React, { useEffect, useState } from "react";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchTimeLineSla } from "../../../../redux/apiSlice/configSlice/config_get_slice/timeLineSlice";
import CreateTimeLine from "./CreateTimeLine";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { TimeLineSlaModel } from "../../../../core/models/configuration/create/TimeLineSlaModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";

import SortableHeader from "../../../components/tableHeader/SortableHeader";
import { TimeLineSlaColumns } from "../../../../resources/static_data/configureHeaderData/TimeLineSlaColumn";
import FilterModal from "../../../components/FilterModal/FilterModal";
import Loading from "../../../components/loader/Loading";
import DataNotFound from "../../../components/loader/DataNotFound";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { HTTP_STATUS } from "../../../../core/models/api_models/RequestModel";
import Swal from "sweetalert2";
import { ROUTES } from "../../../../routes/routes";
const TimeLine = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const timelinesla_list = useAppSelector(
    (state) => state.timelineSla.timelinesla_list
  );
  const loading = useAppSelector((state) => state.timelineSla.loading);
  const error = useAppSelector((state) => state.timelineSla.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTimeLineSla, setEditedTimeLineSla] = useState<TimeLineSlaModel | null>(null);
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived ? true : undefined,
    };
    dispatch(fetchTimeLineSla(pageNumber));
  }, [dispatch, currentPage,viewArchived]);

  const filter = () => {
    setFilterOpen(true)

  }

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(timelinesla_list?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = timelinesla_list?.slice(startIndex, endIndex);

  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === timelinesla_list?.length;
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
  const handleArchiveAllClick = async () => {
    const confirmationResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will archive all selected rows.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, archive all'
    });
    if (confirmationResult.isConfirmed) {
      const archivedRows = Array.from(selectedRows).map(index => timelinesla_list[index].record_id);
      if (archivedRows.length > 0) {
        const newValue = {
          record_id: archivedRows,
          is_archived: true
        };

        const pageNumber = {
          page_number: currentPage,
          page_size: itemsPerPage,
        };

        const res = await postCaller(EndPoints.update_timelinesla_archive, newValue);
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchTimeLineSla(pageNumber));
          const remainingSelectedRows = Array.from(selectedRows).filter(index => !archivedRows.includes(timelinesla_list[index].record_id));
          const isAnyRowSelected = remainingSelectedRows.length > 0;
          setSelectAllChecked(isAnyRowSelected);
          setSelectedRows(new Set());
          Swal.fire({
            title: 'Archived!',
            text: 'All selected rows have been archived.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to archive selected rows. Please try again later.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          });
        }
      }

    }
  };
  const handleArchiveClick = async (record_id: any) => {
    const archived: number[] = [record_id];
    let newValue = {
      record_id: archived,
      is_archived: true
    }
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,

    };
    const res = await postCaller(EndPoints.update_timelinesla_archive, newValue);
    if (res.status === HTTP_STATUS.OK) {
      dispatch(fetchTimeLineSla(pageNumber))
    }
  };

  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setSelectAllChecked(false);
  };
  const handleTimeLineSla = () => {
    setEditMode(false);
    setEditedTimeLineSla(null);
    handleOpen()
  };


  const handleEditTimeLineSla = (timeLineSlaData: TimeLineSlaModel) => {
    setEditMode(true);
    setEditedTimeLineSla(timeLineSlaData);
    handleOpen()
  };
  const fetchFunction = (req: any) => {
    dispatch(fetchTimeLineSla(req));
   };
   if (error) {
    return <div className="loader-container"><Loading/></div>;
  }
  if (loading) {
    return <div className="loader-container"><Loading/> {loading}</div>;
  }

  return (
    <div className="comm">
      <Breadcrumb head="Commission" linkPara="Configure" route={ROUTES.CONFIG_PAGE} linkparaSecond="Timeline SLA" />
      <div className="commissionContainer">
        <TableHeader
          title="Time Line SLA"
          onPressViewArchive={() => handleViewArchiveToggle()}
          onPressArchive={() => handleArchiveAllClick()}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          checked={isAllRowsSelected}
          viewArchive={viewArchived}
          isAnyRowSelected={isAnyRowSelected}
          onpressExport={() => { }}
          onpressAddNew={() => handleTimeLineSla()}
        />
        {filterOPen && <FilterModal handleClose={filterClose}
          columns={TimeLineSlaColumns}
          page_number={currentPage}
          fetchFunction={fetchFunction}
          page_size={itemsPerPage} />}
        {open && <CreateTimeLine
          timeLineSlaData={editedTimeLineSla}
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
                  TimeLineSlaColumns?.map((item, key) => (
                    <SortableHeader
                      key={key}
                      isCheckbox={item.isCheckbox}
                      titleName={item.displayName}
                      data={timelinesla_list}
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
              viewArchived===true?null:   <th>
              <div className="action-header">
                <p>Action</p>
              </div>
            </th>
             }
              </tr>
            </thead>
            <tbody >
              {currentPageData?.length > 0
                ? currentPageData?.map((el: any, i: any) => (
                  <tr
                    key={i}
                    className={selectedRows.has(i) ? "selected" : ""}
                  >

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
                        {el.type_m2m}
                      </div>
                    </td>
                    <td>{el.state}</td>
                    <td>{el.days}</td>
                    <td>{el.start_date}</td>
                    <td>{el.end_date}</td>
          {
            viewArchived===true?null: <td

            >
              <div className="action-icon">
                <div className="action-archive" style={{ cursor: "pointer" }} onClick={()=>handleArchiveClick(el.record_id)}>
                  <img src={ICONS.ARCHIVE} alt="" />
                  <span className="tooltiptext">Archive</span>
                </div>
                <div className="action-archive" onClick={() => handleEditTimeLineSla(el)} style={{ cursor: "pointer" }}>
                  <img src={ICONS.editIcon} alt="" />
                  <span className="tooltiptext">Edit</span>
                </div>
              </div>
            </td>
          }
                  </tr>
                ))
                :  <tr style={{border:0}}>
                <td colSpan={10}>
                <div className="data-not-found">
                <DataNotFound/>
                <h3>Data Not Found</h3>
                </div>
                </td>
              </tr>}
            </tbody>

          </table>
        </div>
        {
            timelinesla_list?.length > 0 ?
        <div className="page-heading-container">

          <p className="page-heading">
            {currentPage} - {totalPages} of {currentPageData?.length} item
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
: null
}
      </div>

    </div>

  );
};

export default TimeLine;
