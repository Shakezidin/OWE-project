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
 
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,

    };
    dispatch(fetchCommissions(pageNumber));

  }, [dispatch, currentPage,itemsPerPage]);

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
  const handleArchiveAllClick = () => {
    const archived: number[] = Array.from(selectedRows);
    // Implement archive logic here
    console.log("Archiving all rows:", archived);
    setSelectedRows(new Set());
  };

  const handleArchiveClick = (record_id: number) => {
    const archived: number[] = [record_id];
    // Implement archive logic here
    console.log("Archiving row:", archived);
    const newSelectedRows = new Set(selectedRows);
    newSelectedRows?.delete(record_id);
    setSelectedRows(newSelectedRows);
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
          onPressViewArchive={() => { }}
          onPressArchive={handleArchiveAllClick}
          checked={isAllRowsSelected}
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
                          onChange={() =>
                            toggleRowSelection(
                              i,
                              selectedRows,
                              setSelectedRows,
                              setSelectAllChecked
                            )
                          }
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