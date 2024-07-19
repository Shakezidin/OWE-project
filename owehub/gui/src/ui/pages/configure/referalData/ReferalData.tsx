import React, { useEffect, useState } from 'react';
import '../configure.css';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { CSVLink } from 'react-csv';
import { ICONS } from '../../../icons/Icons';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { getrefralData } from '../../../../redux/apiActions/config/refralDataAction';
import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import Pagination from '../../../components/pagination/Pagination';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import CreateReferalData from './CreateReferalData';
import Loading from '../../../components/loader/Loading';
import DataNotFound from '../../../components/loader/DataNotFound';
import { ROUTES } from '../../../../routes/routes';
import { ReferalDataColumn } from '../../../../resources/static_data/configureHeaderData/ReferalDataColumn';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import MicroLoader from '../../../components/loader/MicroLoader';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import { fetchDealer } from '../../../../redux/apiSlice/configSlice/config_get_slice/dealerSlice';
import { showAlert, successSwal } from '../../../components/alert/ShowAlert';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import { CommissionModel } from '../../../../core/models/configuration/create/CommissionModel';
import { checkLastPage } from '../../../../utiles';
import { dateFormat } from '../../../../utiles/formatDate';

const ReferalData: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const [exportOPen, setExportOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleExportOpen = () => setExportOpen(!exportOPen);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const commissionList = useAppSelector((state) => state.comm.commissionsList);
  const { data, count, isLoading } = useAppSelector(
    (state) => state.refralDataSlice
  );
  const error = useAppSelector((state) => state.comm.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCommission, setEditedCommission] =
    useState<CommissionModel | null>(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<FilterModel[]>([]);
  const [refresh, setRefresh] = useState(1);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived,
      filters,
    };
    dispatch(getrefralData(pageNumber));
  }, [dispatch, currentPage, viewArchived, filters, refresh]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const filter = () => {
    setFilterOpen(true);
  };

  const totalPages = Math.ceil(count / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = currentPage * itemsPerPage;
  const handleAddCommission = () => {
    setEditMode(false);
    setEditedCommission(null);
    handleOpen();
  };

  const handleEditCommission = (commission: CommissionModel) => {
    setEditMode(true);
    setEditedCommission(commission);
    handleOpen();
  };

  const currentPageData = data?.slice();
  console.log('refer', data);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === data.length;
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

  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setCurrentPage(1);
    setSelectAllChecked(false);
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
      };
      const res = await postCaller('update_referraldata_archive', newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(getrefralData(pageNumber));
        setSelectAllChecked(false);
        setSelectedRows(new Set());
        checkLastPage(
          currentPage,
          totalPages,
          setCurrentPage,
          selectedRows.size,
          currentPageData.length
        );
        await successSwal('Archived', 'The data has been archived ');
      } else {
        await successSwal('Archived', 'The data has been archived ');
      }
    }
  };

  const handleArchiveAllClick = async () => {
    const confirmed = await showAlert(
      'Are Your Sure',
      'This Action will archive all selected rows',
      'Yes',
      'No'
    );
    if (confirmed) {
      const archivedRows = Array.from(selectedRows).map(
        //@ts-ignore
        (index) => data[index].record_id
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

        const res = await postCaller('update_reconcile_archive', newValue);
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(getrefralData(pageNumber));
          const remainingSelectedRows = Array.from(selectedRows).filter(
            //@ts-ignore
            (index) => !archivedRows.includes(data[index].RecordId)
          );
          const isAnyRowSelected = remainingSelectedRows.length > 0;
          setSelectAllChecked(false);
          setSelectedRows(new Set());
          checkLastPage(
            currentPage,
            totalPages,
            setCurrentPage,
            selectedRows.size,
            currentPageData.length
          );

          await successSwal('Archived', 'The data has been archived ');
        } else {
          await successSwal('Archived', 'The data has been archived ');
        }
      }
    }
  };

  const fetchFunction = (req: any) => {
    setCurrentPage(1);
    setFilters(req.filters);
  };

  if (error) {
    return (
      <div className="loader-container">
        <Loading />
      </div>
    );
  }
  const notAllowed = selectedRows.size > 1;

  return (
    <div className="comm">
      <Breadcrumb
        head="Commission"
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Referral Data"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Referral Data"
          onPressViewArchive={() => handleViewArchiveToggle()}
          onPressArchive={() => handleArchiveAllClick()}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          checked={isAllRowsSelected}
          viewArchive={viewArchived}
          isAnyRowSelected={isAnyRowSelected}
          onpressExport={() => handleExportOpen()}
          onpressAddNew={() => handleAddCommission()}
        />
        {exportOPen && (
          <div className="export-modal">
            <CSVLink
              style={{ color: '#04a5e8' }}
              data={currentPageData}
              filename={'table.csv'}
            >
              Export CSV
            </CSVLink>
          </div>
        )}
        <FilterHoc
          resetOnChange={viewArchived}
          isOpen={filterOPen}
          handleClose={filterClose}
          columns={ReferalDataColumn}
          fetchFunction={fetchFunction}
          page_number={currentPage}
          page_size={itemsPerPage}
        />
        {open && (
          <CreateReferalData
            commission={editedCommission}
            editMode={editMode}
            setRefresh={setRefresh}
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
                {ReferalDataColumn.map((item, key) => (
                  <SortableHeader
                    key={key}
                    isCheckbox={item.isCheckbox}
                    titleName={item.displayName}
                    data={currentPageData}
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
                  <div className="action-header">
                    <p>Action</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={currentPageData.length}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <MicroLoader />
                    </div>
                  </td>
                </tr>
              ) : currentPageData?.length > 0 ? (
                currentPageData?.map((el: any, i: any) => (
                  <tr key={i} className={selectedRows.has(i) ? 'selected' : ''}>
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
                        {el.unique_id || 'N/A'}
                      </div>
                    </td>
                    <td>{el.new_customer || 'N/A'}</td>
                    <td>{el.referrer_serial || 'N/A'}</td>
                    <td>{el.referrer_name || 'N/A'}</td>
                    <td>{el.amount || 'N/A'}</td>
                    <td>{el.rep_doll_divby_per || 'N/A'}</td>
                    <td>{el.notes || 'N/A'}</td>
                    <td>{dateFormat(el.start_date) || 'N/A'}</td>
                    <td>
                      <div className="action-icon">
                        <div
                          className="action-archive"
                          style={{
                            cursor: notAllowed ? 'not-allowed' : 'pointer',
                          }}
                          onClick={() =>
                            !notAllowed && handleArchiveClick(el.record_id)
                          }
                        >
                          <img src={ICONS.ARCHIVE} alt="" />
                          {/* <span className="tooltiptext">Archive</span> */}
                        </div>
                        <div
                          className="action-archive"
                          style={{
                            cursor: notAllowed ? 'not-allowed' : 'pointer',
                          }}
                          onClick={() =>
                            !notAllowed && handleEditCommission(el)
                          }
                        >
                          <img src={ICONS.editIcon} alt="" />
                          {/* <span className="tooltiptext">Edit</span> */}
                        </div>
                      </div>
                    </td>
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
        {data?.length > 0 ? (
          <div className="page-heading-container">
            <p className="page-heading">
              {startIndex} - {endIndex > count ? count : endIndex} of {count}{' '}
              item
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

export default ReferalData;
