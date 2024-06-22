import React, { useEffect, useState } from 'react';

import TableHeader from '../../../components/tableHeader/TableHeader';
import { ICONS } from '../../../icons/Icons';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchTearLoan } from '../../../../redux/apiSlice/configSlice/config_get_slice/tearLoanSlice';
import CreateTierLoan from './CreateTierLoan';
import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';

import { TierLoanFeeModel } from '../../../../core/models/configuration/create/TierLoanFeeModel';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';

import Pagination from '../../../components/pagination/Pagination';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { TierLoanColumn } from '../../../../resources/static_data/configureHeaderData/TierLoanFeeColumn';
import DataNotFound from '../../../components/loader/DataNotFound';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import Swal from 'sweetalert2';
import MicroLoader from '../../../components/loader/MicroLoader';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';

import { ROUTES } from '../../../../routes/routes';
import { dateFormat } from '../../../../utiles/formatDate';
const TierLoanFee = () => {
  const dispatch = useAppDispatch();
  const tierloanList = useAppSelector(
    (state) => state.tierLoan.tier_loan_fee_list
  );

  const { dbCount } = useAppSelector((state) => state.tierLoan);
  const loading = useAppSelector((state) => state.tierLoan.loading);
  const error = useAppSelector((state) => state.tierLoan.error);
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const filterClose = () => setFilterOpen(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTierLoanfee, setEditedTierLoanFee] =
    useState<TierLoanFeeModel | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterModel[]>([]);
  const [refetch, setRefetch] = useState(1);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived ? true : undefined,
    };
    dispatch(fetchTearLoan(pageNumber));
  }, [dispatch, currentPage, viewArchived, filters, refetch]);

  const handleAddTierLoan = () => {
    setEditMode(false);
    setEditedTierLoanFee(null);
    handleOpen();
  };

  const filter = () => {
    setFilterOpen(true);
  };

  const handleEditTierLoan = (tierEditedData: TierLoanFeeModel) => {
    setEditMode(true);
    setEditedTierLoanFee(tierEditedData);
    handleOpen();
  };
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const totalPages = Math.ceil(dbCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;

  const endIndex = currentPage * itemsPerPage;

  const currentPageData = tierloanList?.slice();
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === tierloanList.length;
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
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        // Ensure numeric values for arithmetic operations
        const numericAValue =
          typeof aValue === 'number' ? aValue : parseFloat(aValue);
        const numericBValue =
          typeof bValue === 'number' ? bValue : parseFloat(bValue);
        return sortDirection === 'asc'
          ? numericAValue - numericBValue
          : numericBValue - numericAValue;
      }
    });
  }
  const handleArchiveAllClick = async () => {
    const confirmationResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will archive all selected rows.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, archive all',
    });
    if (confirmationResult.isConfirmed) {
      const archivedRows = Array.from(selectedRows).map(
        (index) => tierloanList[index].record_id
      );
      if (archivedRows.length > 0) {
        const newValue = {
          record_id: archivedRows,
          is_archived: true,
        };

        const pageNumber = {
          page_number: currentPage,
          page_size: itemsPerPage,
        };

        const res = await postCaller(
          EndPoints.update_tierloanfee_archive,
          newValue
        );
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchTearLoan(pageNumber));
          setSelectAllChecked(false);
          setSelectedRows(new Set());
          Swal.fire({
            title: 'Archived!',
            text: 'The data has been archived .',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to archive selected rows. Please try again later.',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
          });
        }
      }
    }
  };
  const handleArchiveClick = async (record_id: any) => {
    const archived: number[] = [record_id];
    let newValue = {
      record_id: archived,
      is_archived: true,
    };
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
    };
    const res = await postCaller(
      EndPoints.update_tierloanfee_archive,
      newValue
    );
    if (res.status === HTTP_STATUS.OK) {
      dispatch(fetchTearLoan(pageNumber));
    }
  };

  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setCurrentPage(1);
    setSelectedRows(new Set());
    setSelectAllChecked(false);
  };
  const fetchFunction = (req: any) => {
    setCurrentPage(1);
    setFilters(req.filters);
  };

  return (
    <div className="comm">
      <Breadcrumb
        head="Commission"
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Tier Loan Fee"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Tier Loan Fee"
          onPressViewArchive={() => handleViewArchiveToggle()}
          onPressArchive={() => handleArchiveAllClick()}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          viewArchive={viewArchived}
          onpressAddNew={() => handleAddTierLoan()}
        />
        <FilterHoc
          resetOnChange={viewArchived}
          isOpen={filterOPen}
          handleClose={filterClose}
          columns={TierLoanColumn}
          fetchFunction={fetchFunction}
          page_number={currentPage}
          page_size={itemsPerPage}
        />

        {open && (
          <CreateTierLoan
            editMode={editMode}
            tierEditedData={editedTierLoanfee}
            handleClose={handleClose}
            setRefetch={setRefetch}
          />
        )}
        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          <table>
            <thead>
              <tr>
                {TierLoanColumn?.map((item, key) => (
                  <SortableHeader
                    key={key}
                    isCheckbox={item.isCheckbox}
                    titleName={item.displayName}
                    data={tierloanList}
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
                   {(!viewArchived && selectedRows.size<2) && <div className="action-header">
                      <p>Action</p>
                    </div>}
                  </th>
    
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={TierLoanColumn.length}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <MicroLoader />
                    </div>
                  </td>
                </tr>
              ) : currentPageData?.length > 0 ? (
                currentPageData?.map((el: any, i: any) => (
                  <tr key={i}>
                    <td style={{ fontWeight: '500', color: 'black' }}>
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
                        {el.dealer_tier}
                      </div>
                    </td>
                    <td>{el.installer}</td>
                    <td>{el.state}</td>
                    <td>{el.loan_type}</td>
                    <td>{el.owe_cost}</td>
                    <td>{el.dlr_mu}</td>
                    <td>{el.dlr_cost}</td>
                    <td>{dateFormat(el.start_date)}</td>
                    <td>{dateFormat(el.end_date)}</td>
                   
                      <td>
                  {(!viewArchived && selectedRows.size<2) &&      <div className="action-icon">
                          <div
                            className="action-archive"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleArchiveClick(el.record_id)}
                          >
                            <img src={ICONS.ARCHIVE} alt="" />
                            {/* <span className="tooltiptext">Archive</span> */}
                          </div>
                          <div
                            className="action-archive"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleEditTierLoan(el)}
                          >
                            <img src={ICONS.editIcon} alt="" />
                            {/* <span className="tooltiptext">Edit</span> */}
                          </div>
                        </div>}
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
        {tierloanList?.length > 0 ? (
          <div className="page-heading-container">
            <p className="page-heading">
              {startIndex} - {endIndex > dbCount ? dbCount : endIndex} of{' '}
              {dbCount} item
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

export default TierLoanFee;
