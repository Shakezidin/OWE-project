import React, { useEffect, useState } from "react";
import "../configure.css";
import CreateCommissionRate from "./CreateCommissionRate";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { fetchCommissions } from "../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import { CSVLink } from 'react-csv';
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { CommissionModel } from "../../../../core/models/configuration/create/CommissionModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
import { Commissioncolumns } from "../../../../resources/static_data/configureHeaderData/CommissionColumn";
import FilterModal from "../../../components/FilterModal/FilterModal";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { HTTP_STATUS } from "../../../../core/models/api_models/RequestModel";
import Swal from 'sweetalert2';

const CommissionRate: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const [exportOPen, setExportOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleExportOpen = () => setExportOpen(!exportOPen)
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const commissionList = useAppSelector((state) => state.comm.commissionsList);
  // const loading = useAppSelector((state) => state.comm.loading);
  const error = useAppSelector((state) => state.comm.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCommission, setEditedCommission] = useState<CommissionModel | null>(null);
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
    dispatch(fetchCommissions(pageNumber));

  }, [dispatch, currentPage, itemsPerPage, viewArchived]);

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };
  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };
  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const filter = () => {
    setFilterOpen(true)
  }

  const totalPages = Math.ceil(commissionList?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handleAddCommission = () => {
    setEditMode(false);
    setEditedCommission(null);
    handleOpen()
  };

  const handleEditCommission = (commission: CommissionModel) => {
    setEditMode(true);
    setEditedCommission(commission);
    handleOpen()
  };
  const currentPageData = commissionList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows?.size > 0;
  const isAllRowsSelected = selectedRows?.size === commissionList?.length;

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
      // Extract record IDs from selected rows
      const archivedRows = Array.from(selectedRows).map(index => commissionList[index].record_id);

      // Check if any rows are selected
      if (archivedRows.length > 0) {
        // Perform API call to archive all selected rows
        const newValue = {
          record_id: archivedRows,
          is_archived: true
        };

        const pageNumber = {
          page_number: currentPage,
          page_size: itemsPerPage,
        };

        const res = await postCaller(EndPoints.update_commission_archive, newValue);
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchCommissions(pageNumber));
          const remainingSelectedRows = Array.from(selectedRows).filter(index => !archivedRows.includes(commissionList[index].record_id));
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
    const res = await postCaller(EndPoints.update_commission_archive, newValue);
    if (res.status === HTTP_STATUS.OK) {
      dispatch(fetchCommissions(pageNumber))
    }
    // const newSelectedRows = new Set(selectedRows);
    // newSelectedRows.delete(record_id);
    // setSelectedRows(newSelectedRows);
  };

  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setSelectAllChecked(false);
  };
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
  const fetchFunction = (req: any) => {
    dispatch(fetchCommissions(req));
  };
  if (error) {
    return <div>{error}</div>;
  }
  // if (loading) {
  //   return <div>Loading... {loading}</div>;
  // }


  return (
    <div className="comm">
      <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Commission Rate" />
      <div className="commissionContainer">
        <TableHeader
          title="Commisstion Rate"
          onPressViewArchive={() => handleViewArchiveToggle()}
          onPressArchive={handleArchiveAllClick}
          checked={isAllRowsSelected}
          viewArchive={viewArchived}
          isAnyRowSelected={isAnyRowSelected}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          onpressExport={() => handleExportOpen()}
          onpressAddNew={() => handleAddCommission()}
        />
        {exportOPen && (<div className="export-modal">
          <CSVLink style={{ color: "white", fontSize: "12px" }} data={currentPageData} filename={"table.csv"}>Export CSV</CSVLink>
        </div>)}
        {filterOPen && <FilterModal handleClose={filterClose}
          columns={Commissioncolumns}
          page_number={currentPage}
          page_size={itemsPerPage}
          fetchFunction={fetchFunction}
        />
        }
        {open && <CreateCommissionRate
          commission={editedCommission}
          editMode={editMode}
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
                  Commissioncolumns?.map((item, key) => (
                    <SortableHeader
                      key={key}
                      isCheckbox={item.isCheckbox}
                      titleName={item.displayName}
                      data={commissionList}
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
                  <tr
                    key={i}
                    className={selectedRows.has(i) ? "selected" : ""}
                  >
                    <td style={{ fontWeight: "500", color: "black" }}>
                      <div className="flex-check">
                        <CheckBox
                          checked={selectedRows.has(i)}
                          onChange={() => {
                            // If there's only one row of data and the user clicks its checkbox, select all rows
                            if (currentPageData?.length === 1) {
                              setSelectAllChecked(true);
                              setSelectedRows(new Set([0]));
                            } else {
                              toggleRowSelection(
                                i,
                                selectedRows,
                                setSelectedRows,
                                setSelectAllChecked
                              );
                            }
                          }}
                        />
                        {el.partner}
                      </div>
                    </td>
                    <td>{el.installer}</td>
                    <td>{el.state}</td>
                    <td>{el.sale_type}</td>
                    <td>{el.sale_price}</td>
                    <td>{el.rep_type}</td>
                    <td>{el.rl}</td>
                    <td>{el.rate}</td>
                    <td>{el.start_date}</td>
                    <td>{el.end_date}</td>
                    <td>
                      <div className="action-icon">
                        <div className="" style={{ cursor: "pointer" }} onClick={() => handleArchiveClick(el.record_id)}>
                          <img src={ICONS.ARCHIVE} alt="" />
                        </div>
                        <div className="" style={{ cursor: "pointer" }} onClick={() => handleEditCommission(el)}>
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
            commissionList?.length > 0 ? <Pagination
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

export default CommissionRate;