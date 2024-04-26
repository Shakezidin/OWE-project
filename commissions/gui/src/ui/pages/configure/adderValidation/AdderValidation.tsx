import React, { useEffect, useState } from "react";
import "../configure.css";
import { fetchAdderV } from "../../../../redux/apiSlice/configSlice/config_get_slice/adderVSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";
import CreateAdder from "./CreateAdder";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import { AdderVModel } from "../../../../core/models/configuration/create/AdderVModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { AdderVColumns } from "../../../../resources/static_data/configureHeaderData/AdderVTableColumn";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
import FilterModal from "../../../components/FilterModal/FilterModal";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { HTTP_STATUS } from "../../../../core/models/api_models/RequestModel";
import Swal from "sweetalert2";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import Loading from "../../../components/loader/Loading";


const AdderValidation = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filterClose = () => setFilterOpen(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const adderVList = useAppSelector((state) => state.adderV.VAdders_list);
  const loading = useAppSelector((state) => state.adderV.loading);
  const error = useAppSelector((state) => state.adderV.error);
  const [editMode, setEditMode] = useState(false);
  const [editedVAdder, setEditedVAdder] = useState<AdderVModel | null>(null);
  const itemsPerPage = 10;
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const handleAddvAdder = () => {
    setEditMode(false);
    setEditedVAdder(null);
    handleOpen()
  };

  const handleEditVAdder = (vAdderData: AdderVModel) => {
    setEditMode(true);
    setEditedVAdder(vAdderData);
    handleOpen()
  };
  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };


  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(adderVList?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filter = () => {
    setFilterOpen(true)

  }

  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived ? true : undefined,
    };
    dispatch(fetchAdderV(pageNumber));
  }, [dispatch, currentPage,viewArchived]);
  const currentPageData = adderVList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === adderVList.length;
  const handleSort = (key: any) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
  const handleArchiveAllClick = async () => {
    const confirmationResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will archive all selected rows.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, archive all'
    });
    if (confirmationResult.isConfirmed) {
      // Extract record IDs from selected rows
      const archivedRows = Array.from(selectedRows).map(index => adderVList[index].record_id);

      // Check if any rows are selected
      if (archivedRows.length > 0) {
        // Perform API call to archive all selected rows
        const newValue = {
          record_id: archivedRows,
          is_archived: true
        };

        const pageNumber = {
          page_number: currentPage,
          page_size: itemsPerPage,
        };

        const res = await postCaller(EndPoints.update_vadders_archive, newValue);
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchAdderV(pageNumber));
          const remainingSelectedRows = Array.from(selectedRows).filter(index => !archivedRows.includes(adderVList[index].record_id));
          const isAnyRowSelected = remainingSelectedRows.length > 0;
          setSelectAllChecked(isAnyRowSelected);
          setSelectedRows(new Set());
          Swal.fire({
            title: 'Archived!',
            text: 'All selected rows have been archived.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }
        else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to archive selected rows. Please try again later.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
          });
        }
      }

    }
  };



  const handleArchiveClick = async (record_id: any) => {
    const archived: number[] = [record_id];
    let newValue = {
      record_id: archived,
      is_archived: true
    }
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,

    };
    const res = await postCaller(EndPoints.update_vadders_archive, newValue);
    if (res.status === HTTP_STATUS.OK) {
      dispatch(fetchAdderV(pageNumber))
    }
    // const newSelectedRows = new Set(selectedRows);
    // newSelectedRows.delete(record_id);
    // setSelectedRows(newSelectedRows);
  };

  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setSelectAllChecked(false);
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
    dispatch(fetchAdderV(req));
   };
   if (error) {
    return <div className="loader-container"><Loading/></div>;
  }
  if (loading) {
    return <div className="loader-container"><Loading/> {loading}</div>;
  }

  return (
    <div className="comm">
      <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="AdderV" />
      <div className="commissionContainer">
        <TableHeader
          title="Adder Validation"
          onPressViewArchive={() => handleViewArchiveToggle()}
          checked={isAllRowsSelected}
          onPressArchive={() => handleArchiveAllClick()}
          isAnyRowSelected={isAnyRowSelected}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          onpressExport={() => { }}
          viewArchive={viewArchived}
          onpressAddNew={() => handleAddvAdder()}
        />
        {filterOPen && <FilterModal handleClose={filterClose}
          columns={AdderVColumns}
          page_number={currentPage}
          fetchFunction={fetchFunction}
          page_size={itemsPerPage} />

          }
        {open && <CreateAdder
          vAdderData={editedVAdder}
          editMode={editMode}
          handleClose={handleClose} />}
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
             
                {
                  AdderVColumns.map((item, key) => (
                    <SortableHeader
                    key={key}
                    isCheckbox={item.isCheckbox}
                    titleName={item.displayName}
                    data={adderVList}
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
                      {el.adder_name}
                   </div>
                    </td>
                    <td>{el.adder_type}</td>
                    <td>{el.price_type}</td>
                    <td>{el.price_amount}</td>
                    <td>{el.description}</td>
                    <td>{el.active}</td>

                    <td>
                      <div className="action-icon">
                        <div className="" style={{ cursor: "pointer" }} onClick={()=>handleArchiveClick(el.record_id)}>
                          <img src={ICONS.ARCHIVE} alt="" />
                        </div>
                        <div className="" style={{ cursor: "pointer" }} onClick={() => handleEditVAdder(el)}>
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
            adderVList?.length > 0 ?
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

export default AdderValidation;
