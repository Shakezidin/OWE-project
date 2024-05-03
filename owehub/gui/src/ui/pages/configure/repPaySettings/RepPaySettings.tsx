import React, { useEffect, useState } from "react";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {  fetchRepaySettings} from "../../../../redux/apiActions/repPayAction";
import CreateRepPaySettings from "./CreateRepPaySettings";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { RepPaySettingsModel } from "../../../../core/models/configuration/create/RepPaySettingsModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import Swal from "sweetalert2";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
import { RepPaySettingsColumns} from "../../../../resources/static_data/configureHeaderData/RepPaySettingsColumn";
import FilterModal from "../../../components/FilterModal/FilterModal";
import { ROUTES } from "../../../../routes/routes";
import DataNotFound from "../../../components/loader/DataNotFound";


const RepPaySettings = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const timelinesla_list = useAppSelector(
    (state) => state.timelineSla.timelinesla_list
  );
//   const loading = useAppSelector((state) => state.timelineSla.loading);
  const error = useAppSelector((state) => state.timelineSla.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRepPaySettings, setRepPaySettings] = useState<RepPaySettingsModel | null>(null);
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
    };
    dispatch(fetchRepaySettings(pageNumber));
  }, [dispatch, currentPage]);

  const filter = () => {
    setFilterOpen(true)

  }

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const {repPaySettingsList} = useAppSelector((state) => state.repaySettings);
  
  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  console.log(repPaySettingsList, "settings")

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(repPaySettingsList?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const currentPageData = repPaySettingsList?.slice(startIndex, endIndex);
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

  // if (sortKey) {
  //   currentPageData.sort((a: any, b: any) => {
  //     const aValue = a[sortKey];
  //     const bValue = b[sortKey];
  //     if (typeof aValue === 'string' && typeof bValue === 'string') {
  //       return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  //     } else {
  //       // Ensure numeric values for arithmetic operations
  //       const numericAValue = typeof aValue === 'number' ? aValue : parseFloat(aValue);
  //       const numericBValue = typeof bValue === 'number' ? bValue : parseFloat(bValue);
  //       return sortDirection === 'asc' ? numericAValue - numericBValue : numericBValue - numericAValue;
  //     }
  //   });
  // }
  const handleRepPaySettings = () => {
    setEditMode(false);
    setRepPaySettings(null);
    handleOpen()
  };

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
    // if (confirmationResult.isConfirmed) {
    //   const archivedRows = Array.from(selectedRows).map(index => payScheduleList[index].record_id);
    //   if (archivedRows.length > 0) {
    //     const newValue = {
    //       record_id: archivedRows,
    //       is_archived: true
    //     };

    //     const pageNumber = {
    //       page_number: currentPage,
    //       page_size: itemsPerPage,
    //     };

    //     const res = await postCaller(EndPoints.update_paymentschedule_archive, newValue);
    //     if (res.status === HTTP_STATUS.OK) {
    //       // If API call is successful, refetch commissions
    //       dispatch(fetchPaySchedule(pageNumber));
    //       const remainingSelectedRows = Array.from(selectedRows).filter(index => !archivedRows.includes(payScheduleList[index].record_id));
    //       const isAnyRowSelected = remainingSelectedRows.length > 0;
    //       setSelectAllChecked(isAnyRowSelected);
    //       setSelectedRows(new Set());
    //       Swal.fire({
    //         title: 'Archived!',
    //         text: 'All selected rows have been archived.',
    //         icon: 'success',
    //         timer: 2000,
    //         showConfirmButton: false
    //       });
    //     }
    //     else {
    //       Swal.fire({
    //         title: 'Error!',
    //         text: 'Failed to archive selected rows. Please try again later.',
    //         icon: 'error',
    //         timer: 2000,
    //         showConfirmButton: false
    //       });
    //     }
    //   }

    // }
  };
  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setSelectAllChecked(false);
  };

  const fetchFunction = (req: any) => {
    dispatch(fetchRepaySettings(req));
   };
  
//   if (loading) {
//     return <div>Loading...</div>;
//   }

 
  return (
    <div className="comm">
      <Breadcrumb head="" linkPara="Configure" route={ROUTES.CONFIG_PAGE} linkparaSecond="Rep Pay Settings" />
      <div className="commissionContainer">
        <TableHeader
          title="Rep Pay Settings"
          onPressViewArchive={() => handleViewArchiveToggle()}
          onPressArchive={() =>handleArchiveAllClick()}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          checked={isAllRowsSelected}
          viewArchive={viewArchived}
          isAnyRowSelected={isAnyRowSelected}
          onpressExport={() => { }}
          onpressAddNew={() => handleRepPaySettings()}
        />
        {filterOPen && <FilterModal handleClose={filterClose}
          columns={RepPaySettingsColumns}
          page_number={currentPage}
          fetchFunction={fetchFunction}
          page_size={itemsPerPage} />}
        {open && <CreateRepPaySettings    
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
                  RepPaySettingsColumns?.map((item, key) => (
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
                    
                      <td style={{ fontWeight: "500",color:"black" }}>
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
                        {el?.name}
                     </div>
                        </td>
                     <td>{el?.state}</td>
                      <td>{el?.pay_scale}</td>
                     
                      <td>{el?.position}</td>
                      <td>{el?.b_e}</td>
                      <td>{el?.start_date}</td>
                      <td>{el?.end_date}</td>
                       
                      
                    </tr>
                  ))
                :  <tr style={{border:0}}>
                <td colSpan={10}>
                <div className="data-not-found">
                <DataNotFound/>
                <h3>Data Not Found</h3>
                </div>
                </td>
              </tr>
                }
            </tbody>

          </table>
        </div>
        <div className="page-heading-container">

          <p className="page-heading">
            {currentPage} - {totalPages} of {currentPageData?.length} item
          </p>

          {
            repPaySettingsList?.length > 0 ? <Pagination
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

export default RepPaySettings;
