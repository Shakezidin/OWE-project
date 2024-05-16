import React, { useEffect, useState } from "react";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { getLoanFee, ILoanRow } from "../../../../redux/apiActions/loanFeeActions";
// import CreateTimeLine from "./CreateTimeLine";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { TimeLineSlaModel } from "../../../../core/models/configuration/create/TimeLineSlaModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";

import SortableHeader from "../../../components/tableHeader/SortableHeader";
import { LoanFeesColumn} from "../../../../resources/static_data/configureHeaderData/LoanFeeColumn";
import FilterModal from "../../../components/FilterModal/FilterModal";
import { ROUTES } from "../../../../routes/routes";
import CreatedLoanFee from "./CreateLoanFee";
import { showAlert, successSwal } from "../../../components/alert/ShowAlert";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { HTTP_STATUS } from "../../../../core/models/api_models/RequestModel";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import Loading from "../../../components/loader/Loading";
const LoanFee = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const timelinesla_list = useAppSelector(
    (state) => state.loanFeeSlice.data
  );
  const {dbCount} = useAppSelector((state) => state.loanFeeSlice)
//   const loading = useAppSelector((state) => state.timelineSla.loading);
  const error = useAppSelector((state) => state.timelineSla.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTimeLineSla, setEditedTimeLineSla] = useState<ILoanRow | null>(null);
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [currentPage,setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived:viewArchived
    };
    dispatch(getLoanFee(pageNumber));
  }, [dispatch, currentPage,viewArchived]);

  const filter = () => {
    setFilterOpen(true)

  }

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const {data:commissionList,isLoading} = useAppSelector((state) => state.loanFeeSlice);
  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
  setCurrentPage(currentPage - 1);
  };
  const totalPages = Math.ceil(dbCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  
  const endIndex = currentPage * itemsPerPage 
  const currentPageData = commissionList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === timelinesla_list?.length;
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
  const handleTimeLineSla = () => {
    setEditMode(false);
    setEditedTimeLineSla(null);
    handleOpen()
  };

  const handleArchiveClick = async (record_id: any) => {
    const confirmed = await showAlert('Are Your Sure', 'This Action will archive your data', 'Yes', 'No');
    if (confirmed){
      const archived: number[] = record_id;
      let newValue = {
        record_id: archived,
        is_archived: true
      }
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
        archived:viewArchived
      };
      const res = await postCaller("update_loan_fee_archive", newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(getLoanFee(pageNumber))
        await successSwal("Archived", "The data has been archived ");
      }else{
        await successSwal("Archived", "The data has been archived ");
      }
    }
  
  };

  const handleEditTimeLineSla = (timeLineSlaData: ILoanRow) => {
    setEditMode(true);
    setEditedTimeLineSla(timeLineSlaData);
    handleOpen()
  };
  const fetchFunction = (req: any) => {
    dispatch(getLoanFee(req));
   };
  if (isLoading) {
    return <div className="loader-container"> <Loading/> </div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="comm">
      <Breadcrumb head="" linkPara="Configure" route={ROUTES.CONFIG_PAGE} linkparaSecond="Loan Fee" />
      <div className="commissionContainer">
        <TableHeader
          title="Loan Fee"
          onPressViewArchive={() => setViewArchived(prev=>!prev)}
          onPressArchive={() =>handleArchiveClick(Array.from(selectedRows).map((_,i:number)=>currentPageData[i].record_id))}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          checked={isAllRowsSelected}
          viewArchive={viewArchived}
          isAnyRowSelected={isAnyRowSelected}
          onpressExport={() => { }}
          onpressAddNew={() => handleTimeLineSla()}
        />
        {filterOPen && <FilterModal handleClose={filterClose}
          columns={LoanFeesColumn}
          page_number={currentPage}
          fetchFunction={fetchFunction}
          page_size={itemsPerPage} />}
        {open && <CreatedLoanFee
          editMode={editMode}
          editData={editedTimeLineSla}
          handleClose={handleClose} />}
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>

            <thead >
              <tr>

                {
                  LoanFeesColumn?.map((item, key) => (
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
            <tbody >
              {timelinesla_list?.length > 0
                ? timelinesla_list?.map((el: ILoanRow, i: number) => (
                  <tr
                    key={el.record_id}
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
                        {el.dealer}
                      </div>
                    </td>
                    <td>{el.installer}</td>
                    <td>{el.state}</td>
                    <td>{el.loan_type}</td>
                    <td>{el.owe_cost}</td>
                    <td>{el.dlr_mu}</td>
                    <td>{el.dlr_cost}</td>
                    <td>{el.start_date}</td>
                    <td>{el.end_date}</td>
                    <td

                    >
                     {!viewArchived && <div className="action-icon">
                        <div className="" style={{cursor:"pointer"}} onClick={()=>handleArchiveClick([el.record_id])}>
                          <img src={ICONS.ARCHIVE} alt="" />
                        </div>
                        <div className="" onClick={() => handleEditTimeLineSla(el)} style={{ cursor: "pointer" }}>
                          <img src={ICONS.editIcon} alt="" />
                        </div>
                      </div>}
                    </td>
                  </tr>
                ))
                : null}
            </tbody>

          </table>
        </div>
        <div className="page-heading-container">

          <p className="page-heading">
            {startIndex} - {endIndex} of {dbCount} item
          </p>

          {
            timelinesla_list?.length > 0 ? <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              currentPageData={currentPageData}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
             perPage={itemsPerPage}
            /> : null
          }
        </div>

      </div>

    </div>

  );
};

export default LoanFee;
