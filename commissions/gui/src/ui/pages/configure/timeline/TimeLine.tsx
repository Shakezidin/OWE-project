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
import { FaArrowDown } from "react-icons/fa6";
import { TimeLineSlaModel } from "../../../../core/models/configuration/create/TimeLineSlaModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
const TimeLine = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [columns, setColumns] = useState<string[]>([]);

  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const timelinesla_list = useAppSelector(
    (state) => state.timelineSla.timelinesla_list
  );
  const loading = useAppSelector((state) => state.timelineSla.loading);
  const error = useAppSelector((state) => state.timelineSla.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTimeLineSla, setEditedTimeLineSla] = useState<TimeLineSlaModel | null>(null);
  const itemsPerPage = 5;
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
    };
    dispatch(fetchTimeLineSla(pageNumber));
  }, [dispatch,currentPage]);

  const getColumnNames = () => {
    if (timelinesla_list.length > 0) {
      const keys = Object.keys(timelinesla_list[0]);
      setColumns(keys);
    }
  };
  const filter = ()=>{
    setFilterOpen(true)
    getColumnNames()
  }
 

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

  const handleTimeLineSla = () => {
    setEditMode(false);
    setEditedTimeLineSla(null);
    handleOpen()
  };

  const handleEditTimeLineSla = (timeLineSlaData:TimeLineSlaModel) => {
    setEditMode(true);
    setEditedTimeLineSla(timeLineSlaData);
    handleOpen()
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
 
  return (
    <div className="comm">
       <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Timeline SLA"/>
      <div className="commissionContainer">
        <TableHeader
          title="Time Line SLA"
          onPressViewArchive={() => { }}
          onPressArchive={() => { }}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          onpressExport={() => { }}
          onpressAddNew={() => handleTimeLineSla()}
        />
        {filterOPen && <FilterTimeLine handleClose={filterClose}
         columns={columns}
         page_number = {1}
         page_size = {5} />}
        {open && <CreateTimeLine 
        timeLineSlaData={editedTimeLineSla}
        editMode={editMode}
        handleClose={handleClose} />}

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
                    <p>TYPE / M2M</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Days</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Date</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Date</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Action</p> <FaArrowDown style={{color:"#667085"}}/>
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
                     <div className="" onClick={()=>handleEditTimeLineSla(el)} style={{cursor:"pointer"}}>
                     <img src={ICONS.editIcon} alt="" />
                     </div>
                    </td>
                  </tr>
                ))
                : null}
            </tbody>
    
          </table>
        
        </div>
       {
        timelinesla_list?.length>0 ? <Pagination
        currentPage={currentPage}
        totalPages={totalPages} // You need to calculate total pages
        paginate={paginate}
        goToNextPage={goToNextPage}
        goToPrevPage={goToPrevPage}
      />:null
       }
      </div>
  
  );
};

export default TimeLine;
