import React, { useEffect, useState } from 'react';
import '../configure.css';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { ICONS } from '../../../icons/Icons';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchPaySchedule } from '../../../../redux/apiSlice/configSlice/config_get_slice/payScheduleSlice';
import CreatePaymentSchedule from './CreatePaymentSchedule';
import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import { PayScheduleModel } from '../../../../core/models/configuration/create/PayScheduleModel';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import Pagination from '../../../components/pagination/Pagination';
import { PayScheduleColumns } from '../../../../resources/static_data/configureHeaderData/PayScheduleColumn';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import DataNotFound from '../../../components/loader/DataNotFound';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import Swal from 'sweetalert2';
import { ROUTES } from '../../../../routes/routes';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import MicroLoader from '../../../components/loader/MicroLoader';
import { dateFormat } from '../../../../utiles/formatDate';
import {
  errorSwal,
  showAlert,
  successSwal,
} from '../../../components/alert/ShowAlert';

const PaymentSchedule = () => {
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filterClose = () => setFilterOpen(false);
  const payScheduleList = useAppSelector(
    (state) => state.paySchedule.payment_schedule_list
  );
  const { loading, totalCount } = useAppSelector((state) => state.paySchedule);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterModel[]>([]);
  const [refetch, setRefetch] = useState(1);
  const [editedPaySchedule, setEditedPaySchedule] =
    useState<PayScheduleModel | null>(null);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived ? true : undefined,
      filters,
    };
    dispatch(fetchPaySchedule(pageNumber));
  }, [dispatch, currentPage, viewArchived, refetch, filters]);
  // Extract column names

  const filter = () => {
    setFilterOpen(true);
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

  const handleAddPaySchedule = () => {
    setEditMode(false);
    setEditedPaySchedule(null);
    handleOpen();
  };

  const handleEditPaySchedule = (payEditedData: PayScheduleModel) => {
    setEditMode(true);
    setEditedPaySchedule(payEditedData);
    handleOpen();
  };
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = startIndex * itemsPerPage;
  const currentPageData = payScheduleList?.slice();
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === payScheduleList.length;
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
    const confirmed = await showAlert(
      'Are Your Sure',
      'This Action will archive your data',
      'Yes',
      'No'
    );
    if (confirmed) {
      const archivedRows = Array.from(selectedRows).map(
        (index) => payScheduleList[index].record_id
      );
      if (archivedRows.length > 0) {
        const newValue = {
          record_id: archivedRows,
          is_archived: true,
        };

        const pageNumber = {
          page_number: currentPage,
          page_size: itemsPerPage,
          filters,
        };

        const res = await postCaller(
          EndPoints.update_paymentschedule_archive,
          newValue
        );
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchPaySchedule(pageNumber));

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
    const confirmed = await showAlert(
      'Are Your Sure',
      'This Action will archive your data',
      'Yes',
      'No'
    );
    if (confirmed) {
      const archived: number[] = [record_id];
      let newValue = {
        record_id: archived,
        is_archived: true,
      };

      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
        filters,
      };
      const res = await postCaller(
        EndPoints.update_paymentschedule_archive,
        newValue
      );
      if (res.status === HTTP_STATUS.OK) {
        dispatch(fetchPaySchedule(pageNumber));
        setSelectedRows(new Set());
        setSelectAllChecked(false);
        await successSwal('Archived', 'The data has been archived ');
      } else {
        await errorSwal('Failed', 'Something went wrong');
      }
    }
  };

  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setCurrentPage(1);
    setSelectAllChecked(false);
  };
  const fetchFunction = (req: any) => {
    setCurrentPage(1);
    setFilters(req.filters);
  };
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

  return (
    <div className="comm">
      <Breadcrumb
        head="Commission"
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Payment Schedule"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Payment Schedule"
          onPressViewArchive={() => handleViewArchiveToggle()}
          onPressArchive={() => handleArchiveAllClick()}
          viewArchive={viewArchived}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleAddPaySchedule()}
        />

        <FilterHoc
          isOpen={filterOPen}
          resetOnChange={viewArchived}
          fetchFunction={fetchFunction}
          handleClose={filterClose}
          columns={PayScheduleColumns}
          page_number={currentPage}
          page_size={itemsPerPage}
        />

        {open && (
          <CreatePaymentSchedule
            editMode={editMode}
            setRefetch={setRefetch}
            payEditedData={editedPaySchedule}
            handleClose={handleClose}
          />
        )}
        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          <table>
            <thead>
              <tr>
                {PayScheduleColumns?.map((item, key) => (
                  <SortableHeader
                    key={key}
                    isCheckbox={item.isCheckbox}
                    titleName={item.displayName}
                    data={payScheduleList}
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
                {!viewArchived && selectedRows.size < 2 && (
                  <th>
                    <div className="action-header">
                      <p>Action</p>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={PayScheduleColumns.length}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <MicroLoader />
                    </div>
                  </td>
                </tr>
              ) : currentPageData?.length > 0 ? (
                currentPageData?.map((el: PayScheduleModel, i: any) => (
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
                        {el.dealer || 'N/A'}
                      </div>
                    </td>
                    <td> {el.partner_name || 'N/A'}</td>
                    <td>{el.installer_name || 'N/A'}</td>
                    <td>{el.sale_type || 'N/A'}</td>
                    <td>{el.state || 'N/A'}</td>
                    <td>{el.rl || 'N/A'}</td>
                    <td>{el.draw || 'N/A'}</td>
                    <td>{el.draw_max || 'N/A'}</td>
                    <td>{el.rep_draw || 'N/A'}</td>
                    <td>{el.rep_draw_max || 'N/A'}</td>
                    <td>{el.rep_pay || 'N/A'}</td>
                    <td>{el.commission_model ? capitalizeFirstLetter(el.commission_model) : 'N/A'}</td>

                    <td>{dateFormat(el.start_date) || 'N/A'}</td>
                    <td>{dateFormat(el.end_date) || 'N/A'}</td>
                    {!viewArchived && selectedRows.size < 2 && (
                      <td>
                        <div className="action-icon">
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
                            onClick={() => handleEditPaySchedule(el)}
                          >
                            <img src={ICONS.editIcon} alt="" />
                            {/* <span className="tooltiptext">Edit</span> */}
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr style={{ border: 0 }}>
                  <td colSpan={10}>
                    <DataNotFound />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {payScheduleList?.length > 0 ? (
          <div className="page-heading-container">
            <p className="page-heading">
              {currentPage} - {endIndex > totalCount ? totalCount : endIndex} of{' '}
              {totalCount} item
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

export default PaymentSchedule;
