import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import "../configure.css";
import { RiDeleteBin5Line } from "react-icons/ri";
// import CreateCommissionRate from "./CreateCommissionRate";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { CSVLink } from "react-csv";
import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { IRowDLR, getDlrOth } from "../../../../redux/apiActions/dlrAction";

// import FilterCommission from "./FilterCommission";

import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleAllRows,
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { CommissionModel } from "../../../../core/models/configuration/create/CommissionModel";
import { FaArrowDown } from "react-icons/fa6";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import CreateDlrOth from "./CreateDlrOth";
import Loading from "../../../components/loader/Loading";
import DataNotFound from "../../../components/loader/DataNotFound";
import { ROUTES } from "../../../../routes/routes";
import { DlrOthPayColumn } from "../../../../resources/static_data/configureHeaderData/DlrOthPayColumn";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
import { showAlert, successSwal } from "../../../components/alert/ShowAlert";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { HTTP_STATUS } from "../../../../core/models/api_models/RequestModel";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
interface Column {
  name: string;
  displayName: string;
  type: string;
}

const DlrOthPay: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const [exportOPen, setExportOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleExportOpen = () => setExportOpen(!exportOPen);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const { data: commissionList,dbCount } = useAppSelector((state) => state.dlrOth);
  const loading = useAppSelector((state) => state.dlrOth.isLoading);
  const error = useAppSelector((state) => state.dlrOth.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCommission, setEditedCommission] = useState<IRowDLR | null>(
    null
  );
  const itemsPerPage = 5;
  const currentPage = useAppSelector(
    (state) => state.paginationType.currentPage
  );
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
    };
    dispatch(getDlrOth({ ...pageNumber, archived: viewArchived }));
  }, [dispatch, currentPage,viewArchived]);

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const columns: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },
    { name: "partner", displayName: "Partner", type: "string" },
    { name: "installer", displayName: "Installer", type: "string" },
    { name: "state", displayName: "State", type: "string" },
    { name: "sale_type", displayName: "Sale Type", type: "string" },
    { name: "sale_price", displayName: "Sale Price", type: "number" },
    { name: "rep_type", displayName: "Rep Type", type: "string" },
    { name: "rl", displayName: "RL", type: "number" },
    { name: "rate", displayName: "Rate", type: "number" },
    { name: "start_date", displayName: "Start Date", type: "date" },
    { name: "end_date", displayName: "End Date", type: "date" },
  ];
  const filter = () => {
    setFilterOpen(true);
  };

  const totalPages = Math.ceil(dbCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handleAddCommission = () => {
    setEditMode(false);
    setEditedCommission(null);
    handleOpen();
  };

  const handleEditCommission = (commission: IRowDLR) => {
    setEditMode(true);
    setEditedCommission(commission);
    handleOpen();
  };

  const handleArchiveClick = async (record_id: number[]) => {
    const confirmed = await showAlert(
      "Are Your Sure",
      "This action will archive all selected rows?",
      "Yes",
      "No"
    );
    if (confirmed) {
      const archived= record_id;
      let newValue = {
        record_id: archived,
        is_archived: true,
      };
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
        archived: viewArchived,
      };
      const res = await postCaller("update_dlr_oth_archive", newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(getDlrOth(pageNumber));
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

  const currentPageData = commissionList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === commissionList.length;
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
  if (error) {
    return (
      <div className="loader-container">
        <Loading />
      </div>
    );
  }
  if (loading) {
    return (
      <div className="loader-container">
        <Loading /> {loading}
      </div>
    );
  }
  return (
    <div className="comm">
      <Breadcrumb
        head="Commission"
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="DLR-OTH"
      />
      <div className="commissionContainer">
        <TableHeader
          title="DLR-OTH"
          onPressViewArchive={() => setViewArchived((prev) => !prev)}
          onPressArchive={() => handleArchiveClick(Array.from(selectedRows).map((_,i:number)=>currentPageData[i].record_id))}
          onPressFilter={() => filter()}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onPressImport={() => {}}
          onpressExport={() => handleExportOpen()}
          viewArchive={viewArchived}
          onpressAddNew={() => handleAddCommission()}
        />
        {exportOPen && (
          <div className="export-modal">
            <CSVLink
              style={{ color: "#04a5e8" }}
              data={currentPageData}
              filename={"table.csv"}
            >
              Export CSV
            </CSVLink>
          </div>
        )}
        {/* {filterOPen && <FilterCommission handleClose={filterClose}  
            columns={columns} 
             page_number = {currentPage}
             page_size = {itemsPerPage}
             />} */}
        {open && (
          <CreateDlrOth
            commission={editedCommission}
            editMode={editMode}
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
                {DlrOthPayColumn.map((item, key) => (
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
              {commissionList?.length > 0 ? (
                commissionList?.map((el: IRowDLR, i: number) => (
                  <tr key={i} className={selectedRows.has(i) ? "selected" : ""}>
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
                        {el.payee}
                      </div>
                    </td>

                    <td>{el.amount}</td>
                    <td>{el.description}</td>
                    <td>{el.balance}</td>
                    <td>{el.paid_amount}</td>
                    <td>{el.start_date}</td>
                    <td>{el.end_date}</td>
                    <td>
                      {!viewArchived && (
                        <div className="action-icon">
                          <div className="" onClick={()=>handleArchiveClick([el.record_id])} style={{ cursor: "pointer" }}>
                            <img src={ICONS.ARCHIVE} alt="" />
                          </div>
                          <div
                            className=""
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEditCommission(el)}
                          >
                            <img src={ICONS.editIcon} alt="" />
                          </div>
                        </div>
                      )}
                    </td>
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
        {commissionList?.length > 0 ? (
          <div className="page-heading-container">
            <p className="page-heading">
              {currentPage} - {totalPages} of {commissionList?.length} item
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
        ) : null}
      </div>
    </div>
  );
};

export default DlrOthPay;
