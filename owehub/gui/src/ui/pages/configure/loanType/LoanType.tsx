import React, { useEffect, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../configure.css";
import { CiEdit } from "react-icons/ci";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchLoanType } from "../../../../redux/apiSlice/configSlice/config_get_slice/loanTypeSlice";
import CreateLoanType from "./CreateLoanType";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import { LoanTypeModel } from "../../../../core/models/configuration/create/LoanTypeModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
import { LoanTypeColumns } from "../../../../resources/static_data/configureHeaderData/LoanTypeColumn";
import FilterModal from "../../../components/FilterModal/FilterModal";
import Loading from "../../../components/loader/Loading";
import DataNotFound from "../../../components/loader/DataNotFound";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { HTTP_STATUS } from "../../../../core/models/api_models/RequestModel";
import Swal from "sweetalert2";
import { ROUTES } from "../../../../routes/routes";
import { showAlert, successSwal } from "../../../components/alert/ShowAlert";

const LoanType = () => {
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterClose = () => setFilterOpen(false);
  const loanTypeList = useAppSelector(
    (state) => state?.loanType?.loantype_list
  );
  const loading = useAppSelector((state) => state.loanType.loading);
  const error = useAppSelector((state) => state.loanType.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedLoanData, setEditedLoanData] = useState<LoanTypeModel | null>(null);
  const itemsPerPage = 10;
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  const [sortKey, setSortKey] = useState("");
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived ? true : undefined,
    };
    dispatch(fetchLoanType(pageNumber));
  }, [dispatch, currentPage, viewArchived]);
  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };


  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const handleAddLoan = () => {
    setEditMode(false);
    setEditedLoanData(null);
    handleOpen()
  };

  const filter = () => {
    setFilterOpen(true)

  }
  const totalPages = Math.ceil(loanTypeList?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handleEditLoan = (loanData: LoanTypeModel) => {
    setEditMode(true);
    setEditedLoanData(loanData);
    handleOpen()
  };
  const currentPageData = loanTypeList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === loanTypeList.length;
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
  const handleArchiveAllClick = async () => {
    const confirmed = await showAlert('Are Your Sure', 'This action will archive all selected rows?', 'Yes', 'No');
    if (confirmed) {
      const archivedRows = Array.from(selectedRows).map(index => loanTypeList[index].record_id);
      if (archivedRows.length > 0) {
        const newValue = {
          record_id: archivedRows,
          is_archived: true
        };

        const pageNumber = {
          page_number: currentPage,
          page_size: itemsPerPage,
        };

        const res = await postCaller(EndPoints.update_dealer_archive, newValue);
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchLoanType(pageNumber));
          const remainingSelectedRows = Array.from(selectedRows).filter(index => !archivedRows.includes(loanTypeList[index].record_id));
          const isAnyRowSelected = remainingSelectedRows.length > 0;
          setSelectAllChecked(isAnyRowSelected);
          setSelectedRows(new Set());
          await successSwal("Archived", "All Selected rows have been archived", "success", 2000, false);
        }
        else {
          await successSwal("Archived", "All Selected rows have been archived", "error", 2000, false);
        }
      }

    }
  };
  const handleArchiveClick = async (record_id: any) => {
    const confirmed = await showAlert('Are Your Sure', 'This action will archive all selected rows?', 'Yes', 'No');
    if (confirmed){
      const archived: number[] = [record_id];
      let newValue = {
        record_id: archived,
        is_archived: true
      }
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
  
      };
      const res = await postCaller(EndPoints.update_dealer_archive, newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(fetchLoanType(pageNumber))
        await successSwal("Archived", "All Selected rows have been archived", "success", 2000, false);
      }else{
        await successSwal("Archived", "All Selected rows have been archived", "error", 2000, false);
      }
    }
  
  };

  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setSelectAllChecked(false);
  };
  const fetchFunction = (req: any) => {
    dispatch(fetchLoanType(req));
  };
  if (error) {
    return <div className="loader-container"><Loading /></div>;
  }
  if (loading) {
    return <div className="loader-container"><Loading /> {loading}</div>;
  }


  return (
    <div className="comm">
      <Breadcrumb head="Commission" linkPara="Configure" route={ROUTES.CONFIG_PAGE} linkparaSecond="Loan Type" />
      <div className="commissionContainer">

        <TableHeader
          title="Loan Type"
          onPressViewArchive={() =>handleViewArchiveToggle()}
          onPressArchive={() => handleArchiveAllClick()}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          onpressExport={() => { }}
          viewArchive={viewArchived}
          onpressAddNew={() => handleAddLoan()}
        />
        {filterOPen && <FilterModal handleClose={filterClose}
          columns={LoanTypeColumns}
          page_number={currentPage}
          fetchFunction={fetchFunction}
          page_size={itemsPerPage}
           />}
        {open && <CreateLoanType
          loanData={editedLoanData}
          editMode={editMode}
          page_number={currentPage}
          page_size={itemsPerPage}
          handleClose={handleClose} />}
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>


                {
                  LoanTypeColumns?.map((item, key) => (
                    <SortableHeader
                      key={key}
                      isCheckbox={item.isCheckbox}
                      titleName={item.displayName}
                      data={loanTypeList}
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
                {
                  viewArchived === true ? null : <th>
                    <div className="action-header">
                      <p>Action</p>
                    </div>
                  </th>
                }
              </tr>
            </thead>
            <tbody>
              {currentPageData?.length > 0
                ? currentPageData?.map((el: any, i: any) => (
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
                        {el.product_code}
                      </div>
                    </td>
                    <td>
                      <CheckBox
                        checked={el.active === 1}
                        onChange={() => { }
                        }
                      />
                    </td>
                    <td>
                      {el.adder}
                    </td>
                    <td>{el.description}</td>
                    {
                      viewArchived === true ? null : <td

                      >
                        <div className="action-icon" >
                          <div className="action-archive" style={{ cursor: "pointer" }} onClick={() => handleArchiveClick(el.record_id)}>
                            <img src={ICONS.ARCHIVE} alt="" />
                            <span className="tooltiptext">Archive</span>
                          </div>

                          <div className="action-archive" style={{ cursor: "pointer" }} onClick={() => handleEditLoan(el)}>
                            <img src={ICONS.editIcon} alt="" />
                            <span className="tooltiptext">Edit</span>
                          </div>
                        </div>
                      </td>
                    }
                  </tr>
                ))
                : <tr style={{ border: 0 }}>
                  <td colSpan={10}>
                    <div className="data-not-found">
                      <DataNotFound />
                      <h3>Data Not Found</h3>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        {
          loanTypeList?.length > 0 ?
            <div className="page-heading-container">

              <p className="page-heading">
                {currentPage} - {totalPages} of {currentPageData?.length} item
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages} // You need to calculate total pages
                paginate={paginate}
                goToNextPage={goToNextPage}
                currentPageData={currentPageData}
                goToPrevPage={goToPrevPage}
              />
            </div>
            : null
        }
      </div>
    </div>
  );
};

export default LoanType;
