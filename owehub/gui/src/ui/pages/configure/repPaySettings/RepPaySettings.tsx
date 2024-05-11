import React, { useEffect, useState } from "react";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  fetchRepaySettings,
  RepayEditParams,
} from "../../../../redux/apiActions/repPayAction";
import CreateRepPaySettings from "./CreateRepPaySettings";
import CheckBox from "../../../components/chekbox/CheckBox";
import { toggleRowSelection } from "../../../components/chekbox/checkHelper";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { RepPaySettingsModel } from "../../../../core/models/configuration/create/RepPaySettingsModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
import { RepPaySettingsColumns } from "../../../../resources/static_data/configureHeaderData/RepPaySettingsColumn";
import FilterModal from "../../../components/FilterModal/FilterModal";
import { ROUTES } from "../../../../routes/routes";
import DataNotFound from "../../../components/loader/DataNotFound";
import { HTTP_STATUS } from "../../../../core/models/api_models/RequestModel";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { showAlert, successSwal } from "../../../components/alert/ShowAlert";
import Loading from "../../../components/loader/Loading";

const RepPaySettings = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
 
   
  const error = useAppSelector((state) => state.timelineSla.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRepPaySettings, setEditedRepaySettings] =
    useState<RepayEditParams | null>(null);
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
    dispatch(fetchRepaySettings(pageNumber));
  }, [dispatch, currentPage, viewArchived]);

  const filter = () => {
    setFilterOpen(true);
  };

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const { repPaySettingsList, loading,dbCount } = useAppSelector(
    (state) => state.repaySettings
  );

  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

 

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(dbCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentPageData = repPaySettingsList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size ===  repPaySettingsList?.length;
  const handleSort = (key: any) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  
  const handleRepPaySettings = () => {
    setEditMode(false);
    setEditedRepaySettings(null);
    handleOpen();
  };

  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setSelectAllChecked(false);
  };

  const handleEdit = (data: RepayEditParams) => {
    setEditMode(true);
    setEditedRepaySettings(data);
    handleOpen();
  };

  const fetchFunction = (req: any) => {
    dispatch(fetchRepaySettings(req));
  };
  const handleArchiveAllClick = async () => {
    const confirmed = await showAlert(
      "Are Your Sure",
      "This Action will archive your data",
      "Yes",
      "No"
    );
    if (confirmed) {
      const archivedRows = Array.from(selectedRows).map(
        (index) => repPaySettingsList[index].RecordId
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

        const res = await postCaller("update_rep_pay_settings_archive", newValue);
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchRepaySettings(pageNumber));
          const remainingSelectedRows = Array.from(selectedRows).filter(
            (index) => !archivedRows.includes(repPaySettingsList[index].RecordId)
          );
          const isAnyRowSelected = remainingSelectedRows.length > 0;
          setSelectAllChecked(isAnyRowSelected);
          setSelectedRows(new Set());
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
    }
  };
  const handleArchiveClick = async (record_id: any) => {
    const confirmed = await showAlert(
      "Are Your Sure",
      "This Action will archive your data",
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
      const res = await postCaller("update_rep_pay_settings_archive", newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(fetchRepaySettings(pageNumber));
        await successSwal(
          "Archived",
          "All Selected rows have been archived",
        );
      } else {
        await successSwal(
          "Archived",
          "All Selected rows have been archived",
        );
      }
    }
  };

  if (loading) {
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

  return (
    <div className="comm">
      <Breadcrumb
        head=""
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Rep Pay Settings"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Rep Pay Settings"
          onPressViewArchive={() => handleViewArchiveToggle()}
          onPressArchive={() => handleArchiveAllClick()}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          checked={isAllRowsSelected}
          viewArchive={viewArchived}
          isAnyRowSelected={isAnyRowSelected}
          onpressExport={() => {}}
          onpressAddNew={() => handleRepPaySettings()}
        />
        {filterOPen && (
          <FilterModal
            handleClose={filterClose}
            columns={RepPaySettingsColumns}
            page_number={currentPage}
            fetchFunction={fetchFunction}
            page_size={itemsPerPage}
          />
        )}
        {open && (
          <CreateRepPaySettings editMode={editMode} handleClose={handleClose}    editData={editedRepPaySettings}/>
        )}
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
                {RepPaySettingsColumns?.map((item, key) => (
                  <SortableHeader
                    key={key}
                    isCheckbox={item.isCheckbox}
                    titleName={item.displayName}
                    data={repPaySettingsList}
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
              {repPaySettingsList?.length > 0 ? (
                repPaySettingsList?.map((el: any, i: any) => (
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
                        {el?.name}
                      </div>
                    </td>
                    <td>{el?.state}</td>
                    <td>{el?.pay_scale}</td>

                    <td>{el?.position}</td>
                    <td>{el?.b_e}</td>
                    <td>{el?.start_date}</td>
                    <td>{el?.end_date}</td>
                    {viewArchived === true ? null : (
                        <td>
                          <div className="action-icon">
                            <div
                              className=""
                              style={{ cursor: "pointer" }}
                              onClick={() => handleArchiveClick(el.RecordId)}
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
              ) : (
                <tr style={{ border: 0 }}>
                  <td colSpan={10}>
                    <div className="data-not-found">
                      <DataNotFound />
                      <h3>Data Not Found</h3>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="page-heading-container">
          <p className="page-heading">
            {currentPage} - {totalPages} of {repPaySettingsList?.length} item
          </p>

          {repPaySettingsList?.length > 0 ? (
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

export default RepPaySettings;
