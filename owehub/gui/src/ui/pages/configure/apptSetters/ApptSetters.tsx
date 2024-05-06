import React, { useEffect, useState } from "react";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import CheckBox from "../../../components/chekbox/CheckBox";
import { toggleRowSelection } from "../../../components/chekbox/checkHelper";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { TimeLineSlaModel } from "../../../../core/models/configuration/create/TimeLineSlaModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";

import SortableHeader from "../../../components/tableHeader/SortableHeader";
import { ApptSettersColumn } from "../../../../resources/static_data/configureHeaderData/ApptSettersColumn";
import FilterModal from "../../../components/FilterModal/FilterModal";
import { ROUTES } from "../../../../routes/routes";
import { fetchApptSetters } from "../../../../redux/apiActions/apptSetterAction";
import { HTTP_STATUS } from "../../../../core/models/api_models/RequestModel";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { showAlert, successSwal } from "../../../components/alert/ShowAlert";
import Loading from "../../../components/loader/Loading";
import CreateAppSetters from "./CreateAppSetters";
const ApptSetters = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const { data, isLoading } = useAppSelector((state) => state.apptsetters);
  const error = useAppSelector((state) => state.timelineSla.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedApptSetters, setEditedApptSetters] = useState(null);
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const currentPage = useAppSelector(
    (state) => state.paginationType.currentPage
  );
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived ? true : undefined,
    };
    dispatch(fetchApptSetters(pageNumber));
  }, [dispatch, currentPage, viewArchived]);

  const filter = () => {
    setFilterOpen(true);
  };

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const commissionList = useAppSelector((state) => state.comm.commissionsList);
  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentPageData = data?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === data?.length;
  const handleSort = (key: any) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  if (sortKey) {
    currentPageData.sort((a: any, b: any) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        // Ensure numeric values for arithmetic operations
        const numericAValue =
          typeof aValue === "number" ? aValue : parseFloat(aValue);
        const numericBValue =
          typeof bValue === "number" ? bValue : parseFloat(bValue);
        return sortDirection === "asc"
          ? numericAValue - numericBValue
          : numericBValue - numericAValue;
      }
    });
  }
  const handleTimeLineSla = () => {
    setEditMode(false);
    setEditedApptSetters(null);
    handleOpen();
  };

  const handleEdit = (data: any) => {
    setEditMode(true);
    setEditedApptSetters(data);
    handleOpen();
  };
  const fetchFunction = (req: any) => {
    dispatch(fetchApptSetters(req));
  };
  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setSelectAllChecked(false);
  };
  const handleArchiveAllClick = async () => {
    const confirmed = await showAlert(
      "Are Your Sure",
      "This action will archive all selected rows?",
      "Yes",
      "No"
    );
    if (confirmed) {
      const archivedRows = Array.from(selectedRows).map(
        (index) => data[index].record_id
      );
      if (archivedRows.length > 0) {
        const newValue = {
          record_id: archivedRows,
          is_archived: true,
        };

        const pageNumber = {
          page_number: currentPage,
          page_size: itemsPerPage,
        };

        const res = await postCaller("update_appt_setters_archive", newValue);
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchApptSetters(pageNumber));
          const remainingSelectedRows = Array.from(selectedRows).filter(
            (index) => !archivedRows.includes(data[index].record_id)
          );
          const isAnyRowSelected = remainingSelectedRows.length > 0;
          setSelectAllChecked(isAnyRowSelected);
          setSelectedRows(new Set());
          await successSwal(
            "Archived",
            "All Selected rows have been archived",
            "success",
            2000,
            false
          );
        } else {
          await successSwal(
            "Archived",
            "All Selected rows have been archived",
            "error",
            2000,
            false
          );
        }
      }
    }
  };
  const handleArchiveClick = async (record_id: any) => {
    const confirmed = await showAlert(
      "Are Your Sure",
      "This action will archive all selected rows?",
      "Yes",
      "No"
    );
    if (confirmed) {
      const archived: number[] = [record_id];
      let newValue = {
        record_id: archived,
        is_archived: true,
      };
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
      };
      const res = await postCaller("update_appt_setters_archive", newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(fetchApptSetters(pageNumber));
        await successSwal(
          "Archived",
          "All Selected rows have been archived",
          "success",
          2000,
          false
        );
      } else {
        await successSwal(
          "Archived",
          "All Selected rows have been archived",
          "error",
          2000,
          false
        );
      }
    }
  };
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log(data);

  return (
    <div className="comm">
      <Breadcrumb
        head=""
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Appt Setters"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Appt Setters"
          onPressViewArchive={() => handleViewArchiveToggle()}
          onPressArchive={() => handleArchiveAllClick()}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          checked={isAllRowsSelected}
          viewArchive={viewArchived}
          isAnyRowSelected={isAnyRowSelected}
          onpressExport={() => {}}
          onpressAddNew={() => handleTimeLineSla()}
        />
        {filterOPen && (
          <FilterModal
            handleClose={filterClose}
            columns={ApptSettersColumn}
            page_number={currentPage}
            fetchFunction={fetchFunction}
            page_size={itemsPerPage}
          />
        )}

        {open && (
          <CreateAppSetters
            editMode={editMode}
            editData={editedApptSetters}
            handleClose={handleClose}
          />
        )}
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
                {ApptSettersColumn?.map((item, key) => (
                  <SortableHeader
                    key={key}
                    isCheckbox={item.isCheckbox}
                    titleName={item.displayName}
                    data={data}
                    isAllRowsSelected={isAllRowsSelected}
                    isAnyRowSelected={isAnyRowSelected}
                    selectAllChecked={selectAllChecked}
                    setSelectAllChecked={setSelectAllChecked}
                    selectedRows={selectedRows}
                    setSelectedRows={setSelectedRows}
                    sortKey={item.name}
                    sortDirection={
                      sortKey === item.name ? sortDirection : undefined
                    }
                    onClick={() => handleSort(item.name)}
                  />
                ))}
                {viewArchived === true ? null : (
                  <th>
                    <div className="action-header">
                      <p>Action</p>
                    </div>
                  </th>
                )}
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
                            checked={selectedRows?.has(i)}
                            onChange={() =>
                              toggleRowSelection(
                                i,
                                selectedRows,
                                setSelectedRows,
                                setSelectAllChecked
                              )
                            }
                          />
                          {el.name}
                        </div>
                      </td>
                      <td>{el.team_name}</td>
                      <td>{el.pay_rate}</td>
                      <td>{el.start_date}</td>
                      <td>{el.end_date}</td>
                      {viewArchived === true ? null : (
                        <td>
                          <div className="action-icon">
                            <div
                              className=""
                              style={{ cursor: "pointer" }}
                              onClick={() => handleArchiveClick(el.record_id)}
                            >
                              <img src={ICONS.ARCHIVE} alt="" />
                            </div>
                            <div
                              className=""
                              onClick={() => handleEdit(el)}
                              style={{ cursor: "pointer" }}
                            >
                              <img src={ICONS.editIcon} alt="" />
                            </div>
                          </div>
                        </td>
                      )}
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

          {data?.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              currentPageData={currentPageData}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ApptSetters;
