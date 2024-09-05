import React, { useEffect, useState } from 'react';
import '../configure.css';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { CSVLink } from 'react-csv';
import { ICONS } from '../../../../resources/icons/Icons';
import TableHeader from '../../../components/tableHeader/TableHeader';
import {
  IRowDLR,
  getDlrOth,
} from '../../../../redux/apiActions/config/dlrAction';

import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import Pagination from '../../../components/pagination/Pagination';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import CreateDlrOth from './CreateDlrOth';
import DataNotFound from '../../../components/loader/DataNotFound';
import { ROUTES } from '../../../../routes/routes';
import { DlrOthPayColumn } from '../../../../resources/static_data/configureHeaderData/DlrOthPayColumn';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { showAlert, successSwal } from '../../../components/alert/ShowAlert';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import MicroLoader from '../../../components/loader/MicroLoader';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import { dateFormat } from '../../../../utiles/formatDate';

const DlrOthPay: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const [exportOPen, setExportOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleExportOpen = () => setExportOpen(!exportOPen);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const [refresh, setRefresh] = useState(1);
  const { data: commissionList, dbCount } = useAppSelector(
    (state) => state.dlrOth
  );
  const loading = useAppSelector((state) => state.dlrOth.isLoading);
  const error = useAppSelector((state) => state.dlrOth.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCommission, setEditedCommission] = useState<IRowDLR | null>(
    null
  );
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<FilterModel[]>([]);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      filters,
    };
    dispatch(getDlrOth({ ...pageNumber, archived: viewArchived }));
  }, [dispatch, currentPage, viewArchived, filters, refresh]);

  const fetchFunction = (req: any) => {
    setCurrentPage(1);
    setFilters(req.filters);
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

  const filter = () => {
    setFilterOpen(true);
  };

  const totalPages = Math.ceil(dbCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = currentPage * itemsPerPage;
  const handleAddCommission = () => {
    setEditMode(false);
    setEditedCommission(null);
    handleOpen();
  };

  const handleEditCommission = (commission: IRowDLR) => {
    setEditMode(true);
    setEditedCommission(commission);
    handleOpen();
  };

  const handleArchiveClick = async (record_id: number[]) => {
    const confirmed = await showAlert(
      'Are Your Sure',
      'This Action will archive your data',
      'Yes',
      'No'
    );
    if (confirmed) {
      const archived = record_id;
      let newValue = {
        record_id: archived,
        is_archived: true,
      };
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
        archived: viewArchived,
      };
      const res = await postCaller('update_dlr_oth_archive', newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(getDlrOth(pageNumber));
        setSelectAllChecked(false);
        setSelectedRows(new Set());
        await successSwal('Archived', 'The data has been archived ');
      } else {
        await successSwal('Archived', 'The data has been archived ');
      }
    }
  };

  const currentPageData = commissionList?.slice();
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === commissionList.length;
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
  const notAllowed = selectedRows.size > 1;
  return (
    <div className="comm">
      <Breadcrumb
        head="Commission"
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="DLR-OTH"
      />
      <div className="commissionContainer">
        <TableHeader
          title="DLR-OTH"
          onPressViewArchive={() => setViewArchived((prev) => !prev)}
          onPressArchive={() =>
            handleArchiveClick(
              Array.from(selectedRows).map(
                (_, i: number) => currentPageData[i].record_id
              )
            )
          }
          onPressFilter={() => filter()}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onPressImport={() => {}}
          onpressExport={() => handleExportOpen()}
          viewArchive={viewArchived}
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
        {/* {filterOPen && <FilterCommission handleClose={filterClose}  
            columns={columns} 
             page_number = {currentPage}
             page_size = {itemsPerPage}
             />} */}
        {open && (
          <CreateDlrOth
            commission={editedCommission}
            editMode={editMode}
            handleClose={handleClose}
            setRefresh={setRefresh}
          />
        )}

        <FilterHoc
          isOpen={filterOPen}
          resetOnChange={viewArchived}
          handleClose={filterClose}
          columns={DlrOthPayColumn}
          fetchFunction={fetchFunction}
          page_number={currentPage}
          page_size={itemsPerPage}
        />

        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          <table>
            <thead>
              <tr>
                {DlrOthPayColumn.map((item, key) => (
                  <SortableHeader
                    key={key}
                    isCheckbox={item.isCheckbox}
                    titleName={item.displayName}
                    data={commissionList}
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
              {loading ? (
                <tr>
                  <td colSpan={DlrOthPayColumn.length}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <MicroLoader />
                    </div>
                  </td>
                </tr>
              ) : currentPageData?.length > 0 ? (
                currentPageData?.map((el: IRowDLR, i: number) => (
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
                    <td>{el.payee || 'N/A'}</td>
                    <td>{el.amount || 'N/A'}</td>
                    <td>{el.description || 'N/A'}</td>
                    <td>{el.balance || 'N/A'}</td>
                    <td>{el.paid_amount || 'N/A'}</td>
                    <td>{dateFormat(el.date) || 'N/A'}</td>
                    <td>
                      <div className="action-icon">
                        <div
                          className=""
                          onClick={() =>
                            !notAllowed && handleArchiveClick([el.record_id])
                          }
                          style={{
                            cursor: notAllowed ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <img src={ICONS.ARCHIVE} alt="" />
                        </div>
                        <div
                          className=""
                          style={{
                            cursor: notAllowed ? 'not-allowed' : 'pointer',
                          }}
                          onClick={() =>
                            !notAllowed && handleEditCommission(el)
                          }
                        >
                          <img src={ICONS.editIcon} alt="" />
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
        {currentPageData?.length > 0 ? (
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

export default DlrOthPay;
