import React, { useEffect, useState } from "react";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
// import CreateTimeLine from "./CreateTimeLine";
import CheckBox from "../../../components/chekbox/CheckBox";
import { toggleRowSelection } from "../../../components/chekbox/checkHelper";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { TimeLineSlaModel } from "../../../../core/models/configuration/create/TimeLineSlaModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";

import SortableHeader from "../../../components/tableHeader/SortableHeader";
import { ARScheduleColumns } from "../../../../resources/static_data/configureHeaderData/ARScheduleColumn";
import FilterModal from "../../../components/FilterModal/FilterModal";
import { ROUTES } from "../../../../routes/routes";
import {
  getArscheduleList,
  IARSchedule,
} from "../../../../redux/apiActions/arScheduleAction";
import CreatedArSchedule from "./CreateArSchedeul";
import Loading from "../../../components/loader/Loading";
import { showAlert, successSwal } from "../../../components/alert/ShowAlert";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { HTTP_STATUS } from "../../../../core/models/api_models/RequestModel";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
const ARSchedule = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.ArSchedule);
  //   const loading = useAppSelector((state) => state.timelineSla.loading);
  const error = useAppSelector((state) => state.timelineSla.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTimeLineSla, setEditedTimeLineSla] =
    useState<IARSchedule | null>(null);
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
      archived: viewArchived,
    };
    dispatch(getArscheduleList(pageNumber));
  }, [dispatch, currentPage, viewArchived]);

  const filter = () => {
    setFilterOpen(true);
  };

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const { data: commissionList, isLoading } = useAppSelector(
    (state) => state.ArSchedule
  );
  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentPageData = commissionList?.slice(startIndex, endIndex);
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
    setEditedTimeLineSla(null);
    handleOpen();
  };

  const handleEditTimeLineSla = (data: IARSchedule) => {
    setEditMode(true);
    setEditedTimeLineSla(data);
    handleOpen();
  };
  const fetchFunction = (req: any) => {
    dispatch(getArscheduleList(req));
  };

  const handleArchiveClick = async (record_id: number[]) => {
    const confirmed = await showAlert(
      "Are Your Sure",
      "This Action will archive your data",
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
      const res = await postCaller("update_arschedule_archive", newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(getArscheduleList(pageNumber));
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
  if (isLoading) {
    return (
      <div className="loader-container">
        {" "}
        <Loading />{" "}
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
console.log(selectedRows,"rorrrrr");

  return (
    <div className="comm">
      <Breadcrumb
        head=""
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="AR Schedule"
      />
      <div className="commissionContainer">
        <TableHeader
          title="AR Schedule"
          onPressViewArchive={() => setViewArchived((prev) => !prev)}
          onPressArchive={() => handleArchiveClick(Array.from(selectedRows).map((_,i:number)=>currentPageData[i].record_id))}
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
            columns={ARScheduleColumns}
            page_number={currentPage}
            fetchFunction={fetchFunction}
            page_size={itemsPerPage}
          />
        )}
        {open && (
          <CreatedArSchedule
            editMode={editMode}
            setViewArchived={setViewArchived}
            editData={editedTimeLineSla}
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
                {ARScheduleColumns?.map((item, key) => (
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
                <th>
                  <div className="action-header">
                    <p>Action</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPageData?.length > 0
                ? currentPageData?.map((el: IARSchedule, i: number) => (
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

                          <td>{el.partner_name}</td>
                        </div>
                      </td>

                      <td>{el.installer_name}</td>
                      <td>{el.sale_type_name}</td>
                      <td>{el.state_name}</td>
                      <td>{el.red_line}</td>
                      <td>{el.calc_date}</td>
                      <td>{el.permit_pay}</td>
                      <td>{el.permit_max}</td>
                      <td>{el.install_pay}</td>
                      <td>{el.pto_pay}</td>
                      <td>{el.start_date}</td>
                      <td>{el.end_date}</td>
                      <td>
                        {!viewArchived && (
                          <div className="action-icon">
                            <div
                              className=""
                              style={{ cursor: "pointer" }}
                              onClick={() => handleArchiveClick([el.record_id])}
                            >
                              <img src={ICONS.ARCHIVE} alt="" />
                            </div>
                            <div
                              className=""
                              onClick={() => handleEditTimeLineSla(el)}
                              style={{ cursor: "pointer" }}
                            >
                              <img src={ICONS.editIcon} alt="" />
                            </div>
                          </div>
                        )}
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

          {data?.length > 0 ? (
           <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              currentPageData={currentPageData}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
perPage={itemsPerPage}
            /> 
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ARSchedule;
