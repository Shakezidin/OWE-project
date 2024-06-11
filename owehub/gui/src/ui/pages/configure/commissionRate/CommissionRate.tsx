import React, { useEffect, useState } from 'react';
import '../configure.css';
import CreateCommissionRate from './CreateCommissionRate';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { ICONS } from '../../../icons/Icons';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { fetchCommissions } from '../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice';
import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import { CSVLink } from 'react-csv';
import { CommissionModel } from '../../../../core/models/configuration/create/CommissionModel';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { Commissioncolumns } from '../../../../resources/static_data/configureHeaderData/CommissionColumn';
import FilterModal from '../../../components/FilterModal/FilterModal';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import Loading from '../../../components/loader/Loading';
import DataNotFound from '../../../components/loader/DataNotFound';
import { ROUTES } from '../../../../routes/routes';
import PaginationComponent from '../../../components/pagination/PaginationComponent';
import {
  errorSwal,
  showAlert,
  successSwal,
} from '../../../components/alert/ShowAlert';
import CommissionRowComponent from './CommissionRowComponent';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import FilterHoc from '../../../components/FilterModal/FilterHoc';

const CommissionRate: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleExportOpen = () => (
    <CSVLink data={currentPageData} filename={'table.csv'} />
  );
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const commissionList = useAppSelector(
    (state: any) => state.comm.commissionsList
  );
  const loading = useAppSelector((state: any) => state.comm.loading);
  const error = useAppSelector((state: any) => state.comm.error);
  const dbCount = useAppSelector((state: any) => state.comm.dbCount);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCommission, setEditedCommission] =
    useState<CommissionModel | null>(null);
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [pageSize1, setPageSize1] = useState(10); // Set your desired page size here
  const [currentPage1, setCurrentPage1] = useState(1);
  const [filters, setFilters] = useState<FilterModel[]>([]);

  // api call in useEffect
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage1,
      page_size: pageSize1,
      archived: viewArchived ? true : undefined,
      filters,
    };
    dispatch(fetchCommissions(pageNumber));
  }, [dispatch, currentPage1, pageSize1, viewArchived, filters]);

  // pagination funtion
  const handlePageChange = (page: number) => {
    setCurrentPage1(page);
  };
  const handleItemsPerPageChange = (e: any) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setPageSize1(newItemsPerPage);
    setCurrentPage1(1); // Reset to the first page when changing items per page
  };

  const totalPages1 = Math.ceil(dbCount / pageSize1);
  const startIndex = (currentPage1 - 1) * pageSize1 + 1;
  const endIndex = startIndex * pageSize1;

  // toggle modal
  const filter = () => {
    setFilterOpen(true);
  };
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

  //  pagination slice
  const currentPageData = commissionList?.slice();
  const isAnyRowSelected = selectedRows?.size > 0;
  const isAllRowsSelected = selectedRows?.size === commissionList?.length;
  const pageNumber = {
    page_number: currentPage1,
    page_size: itemsPerPage,
    filters,
    archived: viewArchived ? true : undefined,
  };

  // acrhived function
  const handleArchiveAllClick = async () => {
    const confirmed = await showAlert(
      'Are Your Sure',
      'This Action will archive your data',
      'Yes',
      'No'
    );
    if (confirmed) {
      const archivedRows = Array.from(selectedRows).map(
        (index) => currentPageData[index].record_id
      );
      if (archivedRows.length > 0) {
        const newValue = {
          record_id: archivedRows,
          is_archived: true,
        };
        const res = await postCaller(
          EndPoints.update_commission_archive,
          newValue
        );
        if (res.status === HTTP_STATUS.OK) {
          dispatch(fetchCommissions(pageNumber));
          setSelectAllChecked(false);
          setSelectedRows(new Set());
          await successSwal('Archived', 'The data has been archived ');
        } else {
          await errorSwal(
            'Error',
            'Failed to archive selected rows. Please try again later.'
          );
        }
      }
    }
  };
  const handleArchiveClick = async (record_id: any) => {
    const confirmed = await showAlert(
      'Are Your Sure',
      'This action will archive selected data?',
      'Yes',
      'No'
    );
    if (confirmed) {
      const archived: number[] = [record_id];
      let newValue = {
        record_id: archived,
        is_archived: true,
      };
      const res = await postCaller(
        EndPoints.update_commission_archive,
        newValue
      );
      if (res.status === HTTP_STATUS.OK) {
        dispatch(fetchCommissions(pageNumber));
        setSelectAllChecked(false);
        setSelectedRows(new Set());
        await successSwal('Archived', 'Selected rows have been archived');
      } else {
        await errorSwal(
          'Error',
          'Failed to archive selected rows. Please try again later.'
        );
      }
    }
  };

  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setCurrentPage1(1);
    setSelectAllChecked(false);
  };

  // sorting function
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

  // filter function
  const fetchFunction = (req: any) => {
    setCurrentPage1(1);
    setFilters(req.filters);
  };

  return (
    <div className="comm">
      <Breadcrumb
        head="Commission"
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Commission Rate"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Commission Rate"
          onPressViewArchive={() => handleViewArchiveToggle()}
          onPressArchive={handleArchiveAllClick}
          checked={isAllRowsSelected}
          viewArchive={viewArchived}
          isAnyRowSelected={isAnyRowSelected}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => handleExportOpen()}
          onpressAddNew={() => handleAddCommission()}
        />

        <FilterHoc
          isOpen={filterOPen}
          resetOnChange={viewArchived}
          handleClose={filterClose}
          columns={Commissioncolumns}
          page_number={currentPage1}
          page_size={itemsPerPage}
          fetchFunction={fetchFunction}
        />

        {open && (
          <CreateCommissionRate
            commission={editedCommission}
            editMode={editMode}
            handleClose={handleClose}
            pageNumber={currentPage1}
            pageSize={pageSize1}
          />
        )}
        <CommissionRowComponent
          handleArchiveClick={handleArchiveClick}
          handleEditCommission={handleEditCommission}
          handleSort={handleSort}
          isAllRowsSelected={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          viewArchived={viewArchived}
          selectAllChecked={selectAllChecked}
          selectedRows={selectedRows}
          setSelectAllChecked={setSelectAllChecked}
          setSelectedRows={setSelectedRows}
          sortDirection={sortDirection}
          sortKey={sortKey}
          currentPageData={currentPageData}
        />

        {/* pagination component  */}
        {currentPageData?.length > 0 ? (
          <div className="page-heading-container">
            <p className="page-heading">
              {startIndex} - {endIndex > dbCount ? dbCount : endIndex} of{' '}
              {dbCount} item
            </p>
            <PaginationComponent
              currentPage={currentPage1}
              itemsPerPage={pageSize1}
              totalPages={totalPages1}
              onPageChange={handlePageChange}
              handleItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CommissionRate;
