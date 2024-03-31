import React, { useEffect, useState } from "react";

import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchTimeLineSla } from "../../../../redux/apiSlice/configSlice/config_get_slice/timeLineSlice";
import CreateTimeLine from "./CreateTimeLine";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleAllRows,
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import FilterTimeLine from "./FilterTimeLine";
const TimeLine = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filter = () => setFilterOpen(true);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const timelinesla_list = useAppSelector(
    (state) => state.timelineSla.timelinesla_list
  );
  const loading = useAppSelector((state) => state.timelineSla.loading);
  const error = useAppSelector((state) => state.timelineSla.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const itemsPerPage = 5;
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
    };
    dispatch(fetchTimeLineSla(pageNumber));
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
  const totalPages = Math.ceil(timelinesla_list?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = timelinesla_list?.slice(startIndex, endIndex);

  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === timelinesla_list.length;
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!timelinesla_list === null || timelinesla_list.length === 0) {
    return <div>Data not found</div>;
  }
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Time Line SLA"
          onPressViewArchive={() => { }}
          onPressArchive={() => { }}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          onpressExport={() => { }}
          onpressAddNew={() => handleOpen()}
        />
        {filterOPen && <FilterTimeLine handleClose={filterClose} />}
        {open && <CreateTimeLine handleClose={handleClose} />}

          <table  style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        
           <thead >
              <tr>
                <th>
                  <div>
                    <CheckBox
                      checked={selectAllChecked}
                      onChange={() =>
                        toggleAllRows(
                          selectedRows,
                          timelinesla_list,
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
                    <p>TYPE / M2M</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Days</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Date</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Date</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Action</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
              </tr>
            </thead>
          <tbody >
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
                      {el.type_m2m}
                    </td>
                    <td>{el.state}</td>
                    <td>{el.days}</td>
                    <td>{el.start_date}</td>
                    <td>{el.end_date}</td>
                    <td
                      style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <img src={ICONS.ARCHIVE} alt="" />
                      <CiEdit
                        style={{ fontSize: "1.5rem", color: "#344054" }}
                      />
                    </td>
                  </tr>
                ))
                : null}
            </tbody>
    
          </table>
        
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

export default TimeLine;
