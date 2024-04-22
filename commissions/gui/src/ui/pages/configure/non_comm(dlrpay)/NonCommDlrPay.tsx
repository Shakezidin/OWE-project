import React, { useEffect, useState } from "react";
import "../configure.css";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { CSVLink } from 'react-csv';
import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { fetchCommissions } from "../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice";

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
import CreateNonComm from '../non_comm(dlrpay)/CreateNonComm';

interface Column {
  name: string;
  displayName: string;
  type: string;
}

const NonCommDlrPay: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const [exportOPen, setExportOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleExportOpen = () => setExportOpen(!exportOPen)
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const commissionList = useAppSelector((state) => state.comm.commissionsList);
  const loading = useAppSelector((state) => state.comm.loading);
  const error = useAppSelector((state) => state.comm.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCommission, setEditedCommission] = useState<CommissionModel | null>(null);
  const itemsPerPage = 5;
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);

  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,

    };
    dispatch(fetchCommissions(pageNumber));

  }, [dispatch, currentPage]);

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
    { name: "end_date", displayName: "End Date", type: "date" }
  ];
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

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const currentPageData = commissionList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === commissionList.length;

  return (
    <div className="comm">
      <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="NON-Comm" />
      <div className="commissionContainer">
        <TableHeader
          title="NON-Comm"
          onPressViewArchive={() => { }}
          onPressArchive={() => { }}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onpressExport={() => handleExportOpen()}
          onpressAddNew={() => handleAddCommission()}
        />
        {exportOPen && (<div className="export-modal">
          <CSVLink style={{ color: "#04a5e8" }} data={currentPageData} filename={"table.csv"}>Export CSV</CSVLink>
        </div>)}
        {/* {filterOPen && <FilterCommission handleClose={filterClose}  
            columns={columns} 
             page_number = {currentPage}
             page_size = {itemsPerPage}
             />} */}
        {open && <CreateNonComm
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
                <th >
                  <div>
                    <CheckBox
                      checked={selectAllChecked}
                      onChange={() =>
                        toggleAllRows(
                          selectedRows,
                          commissionList,
                          setSelectedRows,
                          setSelectAllChecked
                        )
                      }
                      indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    />
                  </div>
                </th>
                <th >
                  <div className="table-header" >
                    <p>Customer</p> <FaArrowDown style={{ color: "#667085", fontSize: "12px" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Dealer Code</p> <FaArrowDown style={{ color: "#667085", fontSize: "12px" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Dealer DBA</p> <FaArrowDown style={{ color: "#667085", fontSize: "12px" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Exact Amt.</p> <FaArrowDown style={{ color: "#667085", fontSize: "12px" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Approved By:</p> <FaArrowDown style={{ color: "#667085", fontSize: "12px" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Notes:</p> <FaArrowDown style={{ color: "#667085", fontSize: "12px" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Balance</p> <FaArrowDown style={{ color: "#667085", fontSize: "12px" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Paid Amt.</p> <FaArrowDown style={{ color: "#667085", fontSize: "12px" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>DBA</p> <FaArrowDown style={{ color: "#667085", fontSize: "12px" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Dt.</p> <FaArrowDown style={{ color: "#667085", fontSize: "12px" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Dt.</p> <FaArrowDown style={{ color: "#667085", fontSize: "12px" }} />
                  </div>
                </th>
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
                    <td>
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
                    </td>
                    <td style={{ fontWeight: "500", color: "black" }}>
                      {el.partner}
                    </td>
                    <td>{el.installer}</td>
                    <td>{el.state}</td>
                    <td>{el.sale_type}</td>
                    <td>{el.sale_price}</td>
                    <td>{el.rep_type}</td>
                    <td>{el.rep_type}</td>
                    <td>{el.rl}</td>
                    <td>{el.rate}</td>
                    <td>{el.start_date}</td>
                    <td>{el.end_date}</td>
                    <td>
                      <div className="action-icon">
                        <div className="" style={{ cursor: "pointer" }}>
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
              goToNextPage={goToNextPage}
              currentPageData={currentPageData}
              goToPrevPage={goToPrevPage}
            /> : null
          }
        </div>
      </div>

    </div>
  );
};

export default NonCommDlrPay;
