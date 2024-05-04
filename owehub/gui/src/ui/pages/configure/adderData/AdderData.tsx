import React, { useEffect, useState } from "react";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  getarAdderData,
  IAdderRowData,
} from "../../../../redux/apiActions/arAdderDataAction";
import { toggleRowSelection } from "../../../components/chekbox/checkHelper";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { TimeLineSlaModel } from "../../../../core/models/configuration/create/TimeLineSlaModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import CheckBox from "../../../components/chekbox/CheckBox";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
import { AdderDataColumn } from "../../../../resources/static_data/configureHeaderData/adderDataColumn";
import FilterModal from "../../../components/FilterModal/FilterModal";
import { ROUTES } from "../../../../routes/routes";
import CreateArAdderData from "./CreateArAdderData";
import Loading from "../../../components/loader/Loading";
import { showAlert, successSwal } from "../../../components/alert/ShowAlert";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { HTTP_STATUS } from "../../../../core/models/api_models/RequestModel";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
const AdderData = () => {
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
  const [editedTimeLineSla, setEditedTimeLineSla] =
    useState<IAdderRowData | null>(null);
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
    };
    dispatch(getarAdderData({ ...pageNumber }));
  }, [dispatch, currentPage]);

  const filter = () => {
    setFilterOpen(true);
  };

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const { data: commissionList, isLoading } = useAppSelector(
    (state) => state.adderDataSlice
  );
  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(timelinesla_list?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentPageData = commissionList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === timelinesla_list?.length;
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

  const handleEditTimeLineSla = (timeLineSlaData: IAdderRowData) => {
    setEditMode(true);
    setEditedTimeLineSla(timeLineSlaData);
    handleOpen();
  };
  const fetchFunction = (req: any) => {
    dispatch(getarAdderData(req));
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
      const res = await postCaller("update_adderdata_archive", newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(getarAdderData(pageNumber));
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
  if (isLoading) {
    return (
      <div className=" loader-container">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // update_adderdata_archive

  return (
    <div className="comm">
      <Breadcrumb
        head=""
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Adder Data"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Adder Data"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
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
            columns={AdderDataColumn}
            page_number={currentPage}
            fetchFunction={fetchFunction}
            page_size={itemsPerPage}
          />
        )}

        {open && (
          <CreateArAdderData
            editMode={editMode}
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
                {AdderDataColumn?.map((item, key) => (
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
                ? currentPageData?.map((el: IAdderRowData, i: number) => (
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
                          {el.unique_id}
                        </div>
                      </td>
                      <td>{el.date}</td>
                      <td>{el.type}</td>
                      <td>{el.gc}</td>
                      <td>{el.exact_amount}</td>
                      <td>{el.per_kw_amt}</td>
                      <td>{el.rep_percent}</td>
                      <td>{el.description}</td>
                      <td>{el.notes}</td>
                      <td>{el.type_ad_mktg}</td>
                      <td>{el.sys_size}</td>
                      <td>{el.adder_cal}</td>
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
                            onClick={() => handleEditTimeLineSla(el)}
                            style={{ cursor: "pointer" }}
                          >
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

          {timelinesla_list?.length > 0 ? (
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

export default AdderData;
