import React, { useEffect, useState } from "react";
import "../configure.css";
// import CreateCommissionRate from "./CreateCommissionRate";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { CSVLink } from 'react-csv';
import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { fetchCommissions } from "../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice";

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
import CreateAutoAdder from "./CreateAutoAdder";
import Loading from "../../../components/loader/Loading";
interface Column {
  name: string;
  displayName: string;
  type: string;
}

const AutoAdder: React.FC = () => {
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
  const [viewArchived, setViewArchived] = useState<boolean>(false);
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
  const filter = ()=>{
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

  if (error) {
    return <div className="loader-container"><Loading/></div>;
  }
  if (loading) {
    return <div className="loader-container"><Loading/> {loading}</div>;
  }

  const currentPageData = commissionList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === commissionList.length;

  return (
    <div className="comm">
      <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Autoadder"/>
      <div className="commissionContainer">
        <TableHeader
          title="Auto Adder"
          onPressViewArchive={() => { }}
          onPressArchive={() => { }}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          viewArchive={viewArchived}
          onpressExport={() => handleExportOpen()}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
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
             {open && <CreateAutoAdder
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
                <th style={{paddingRight:0}}>
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
                <th style={{paddingLeft:"10px"}}>
                  <div className="table-header" >
                    <p>Type</p> <FaArrowDown style={{color: "#667085", fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>GC</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Exact Amt.</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Per KW Amt.</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>REP $ / %</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Description</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Notes</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Type</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep1</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep2</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sys Size</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep Count</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Per Rep Addr</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Per Rep Ovrd</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Share</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>R1 Pay Scale</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep 1 Def Resp</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>R1 Addr Resp</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>R2 Pay Scale</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep 2 Def Resp</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>R1 Addr Resp</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Contract Amount</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Project Base</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>CR1 ADDR</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>R1 Loan Fee</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>R1 Rebate</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>R1 Referral </p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>R1 R+R</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Total Comm</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Dt.</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Dt.</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
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
                ? currentPageData?.map((el:any, i:any) => (
                  <tr
                    key={i}
                    className={selectedRows.has(i) ? "selected" : ""}
                  >
                    <td style={{paddingRight:"0"}}>
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
                    <td style={{ fontWeight: "500", color: "black",paddingLeft:"10px" }}>
                      {el.partner}
                    </td>
                    <td>{el.installer}</td>
                    <td>{el.state}</td>
                    <td>{el.sale_type}</td>
                    <td>{el.sale_price}</td>
                    <td>{el.rep_type}</td>
                    <td>{el.rl}</td>
                    <td>{el.rate}</td>
                    <td>{el.state}</td>
                    <td>{el.sale_type}</td>
                    <td>{el.sale_price}</td>
                    <td>{el.rep_type}</td>
                    <td>{el.rl}</td>
                    <td>{el.rate}</td>
                    <td>{el.state}</td>
                    <td>{el.sale_type}</td>
                    <td>{el.sale_price}</td>
                    <td>{el.rep_type}</td>
                    <td>{el.rl}</td>
                    <td>{el.rate}</td>
                    <td>{el.state}</td>
                    <td>{el.sale_type}</td>
                    <td>{el.sale_price}</td>
                    <td>{el.rep_type}</td>
                    <td>{el.rl}</td>
                    <td>{el.rate}</td>
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
        {
    commissionList?.length > 0 ?
        <div className="page-heading-container">
      
      <p className="page-heading">
       {currentPage} - {totalPages} of {currentPageData?.length} item
      </p>
 
 <Pagination
      currentPage={currentPage}
      totalPages={totalPages} // You need to calculate total pages
      paginate={paginate}
      currentPageData={currentPageData}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
    /> 
   </div>
   : null
  }
      </div>
    
    </div>
  );
};

export default AutoAdder;
