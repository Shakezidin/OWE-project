import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import "../configure.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import CreateCommissionRate from "./CreateCommissionRate";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { fetchCommissions } from "../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice";

import FilterCommission from "./FilterCommission";

import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleAllRows,
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";

const CommissionRate: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
 const filter = ()=>setFilterOpen(true)
  const filterClose = () => setFilterOpen(false);

  const dispatch = useAppDispatch();
  const commissionList = useAppSelector((state) => state.comm.commissionsList);
  const loading = useAppSelector((state) => state.comm.loading);
  const error = useAppSelector((state) => state.comm.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const itemsPerPage = 5;
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
    };
    dispatch(fetchCommissions(pageNumber));
  }, [dispatch,currentPage]);

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(commissionList?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!commissionList === null || commissionList.length === 0) {
    return <div>Data not found</div>;
  }
  const currentPageData = commissionList?.slice(startIndex, endIndex);

  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === commissionList.length;

  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Commisstion Rate"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleOpen()}
        />
        {filterOPen && <FilterCommission handleClose={filterClose} />}
        {open && <CreateCommissionRate handleClose={handleClose} />}
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
                <th>
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
                <th>
                  <div className="table-header">
                    <p>Partner</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Installer</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sales Type</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sales Price</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep.Type</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rate List</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rate</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Dt.</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Dt.</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Action</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPageData?.length > 0
                ? currentPageData?.map((el, i) => (
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
                      <td>{el.rl}</td>
                      <td>{el.rate}</td>
                      <td>{el.start_date}</td>
                      <td>{el.end_date}</td>
                      <td>
                        <div className="action-icon">
                          <div className="" style={{ cursor: "pointer" }}>
                            <img src={ICONS.ARCHIVE} alt="" />
                          </div>
                          <div className="" style={{ cursor: "pointer" }}>
                            <CiEdit
                              style={{ fontSize: "1.5rem", color: "#344054" }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages} // You need to calculate total pages
        paginate={paginate}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
      />
    </div>
  );
};

export default CommissionRate;
