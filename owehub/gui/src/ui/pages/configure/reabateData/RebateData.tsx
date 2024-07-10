import React, { useEffect, useState } from 'react';
import '../configure.css';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { CSVLink } from 'react-csv';
import { ICONS } from '../../../icons/Icons';
import TableHeader from '../../../components/tableHeader/TableHeader';
import CheckBox from '../../../components/chekbox/CheckBox';
import {
  toggleAllRows,
  toggleRowSelection,
} from '../../../components/chekbox/checkHelper';
import Pagination from '../../../components/pagination/Pagination';
import { setCurrentPage } from '../../../../redux/apiSlice/paginationslice/paginationSlice';
import { CommissionModel } from '../../../../core/models/configuration/create/CommissionModel';
import { FaArrowDown } from 'react-icons/fa6';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import CreateRebateData from './CreateRebateData';
import Loading from '../../../components/loader/Loading';
import DataNotFound from '../../../components/loader/DataNotFound';
import { ROUTES } from '../../../../routes/routes';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { RebeteDataColumn } from '../../../../resources/static_data/configureHeaderData/RebetDataColumn';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import { showAlert, successSwal } from '../../../components/alert/ShowAlert';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import MicroLoader from '../../../components/loader/MicroLoader';
import { fetchRebateData } from '../../../../redux/apiActions/config/rebateDataAction';
interface Column {
  name: string;
  displayName: string;
  type: string;
}


const RebeteData: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const [exportOPen, setExportOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleExportOpen = () => setExportOpen(!exportOPen);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const commissionList = useAppSelector((state) => state.comm.commissionsList);
  const { loading, dbCount } = useAppSelector((state) => state.comm);
  const error = useAppSelector((state) => state.comm.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCommission, setEditedCommission] =
    useState<CommissionModel | null>(null);
  const itemsPerPage = 10;
  const currentPage = useAppSelector(
    (state) => state.paginationType.currentPage
  );
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<FilterModel[]>([]);
  const { data,count, isLoading, isSuccess } = useAppSelector(
    (state) => state.rebate
  );
  console.log(count, "yftfrtyretyrrytre")
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived ? true : undefined,
      filters,
    };
    dispatch(fetchRebateData(pageNumber));
  }, [dispatch, currentPage, viewArchived, filters]);

  useEffect(() => {
    if (isSuccess) {
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
        archived: viewArchived,
        filters,
      };
      dispatch(fetchRebateData({ ...pageNumber }));
    }
  }, [isSuccess, currentPage, viewArchived, filters]);
 

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
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === data?.length;
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
  const fetchFunction = (req: any) => {
    setCurrentPage(1);
    setFilters(req.filters);
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
      const res = await postCaller('update_rebate_data_archive', newValue);
      if (res.status === HTTP_STATUS.OK) {
        setSelectAllChecked(false);
        setSelectedRows(new Set());
        dispatch(fetchRebateData(pageNumber));
        await successSwal('Archived', 'The data has been archived ');
      } else {
        await successSwal('Archived', 'The data has been archived ');
      }
    }
  };

  if (error) {
    return (
      <div className="loader-container">
        <Loading />
      </div>
    );
  }

  return (
    <div className="comm">
      <Breadcrumb
        head="Commission"
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="rebate-data"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Rebate Data"
          onPressViewArchive={() => { }}
          onPressArchive={() => { }}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
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
          columns={RebeteDataColumn}
          fetchFunction={fetchFunction}
          page_number={currentPage}
          page_size={itemsPerPage}
        />
        {open && (
          <CreateRebateData
            commission={editedCommission}
            editMode={editMode}
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
                {RebeteDataColumn.map((item, key) => (
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
                    {!viewArchived && selectedRows.size < 2 && (<p>Action</p>)}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
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
                         <td>{el.unique_id || 'N/A'}</td>
                      </div>
                    </td>
                    <td>{el.customer_verf || 'N/A'}</td>
                    <td>{el.type || 'N/A'}</td>
                    <td>{el.item || 'N/A'}</td>
                    <td>{el.amount || 'N/A'}</td>
                    <td>{el.rep_doll_divby_per || 'N/A'}</td>
                    <td>{el.notes || 'N/A'}</td>
                    <td>{el.rep1_name || 'N/A'}</td>
                    <td>{el.rep2_name || 'N/A'}</td>
                    <td>{el.sys_size || 'N/A'}</td>
                    <td>{el.state || 'N/A'}</td>
                    <td>{el.rep_count || 'N/A'}</td>
                    <td>{el.per_rep_addr_share || 'N/A'}</td>
                    <td>{el.per_rep_def_ovrd || 'N/A'}</td>
                    <td>{el.per_rep_ovrd_share || 'N/A'}</td>
                    <td>{el.rep1_def_resp || 'N/A'}</td>
                    <td>{el.r1_pay_scale || 'N/A'}</td>
                    <td>{el.r1_rebate_credit || 'N/A'}</td>
                    <td>{el.r1_rebate_credit_perc || 'N/A'}</td>
                    <td>{el.r1_addr_resp || 'N/A'}</td>
                    <td>{el.r2_pay_scale || 'N/A'}</td>
                    <td>{el.r2_rebate_credit || 'N/A'}</td>
                    <td>{el.r2_rebate_credit_perc || 'N/A'}</td>
                    <td>{el.rep2_def_resp || 'N/A'}</td>
                    <td>{el.r2_addr_resp || 'N/A'}</td>
                    <td>{el.start_date || 'N/A'}</td>
                    <td>{el.end_date || 'N/A'}</td>
                    {/* <td>{el.type_rd_mktg || 'N/A'}</td> */}
                    <td>
                      {selectedRows.size > 0 ? (
                        <div className="action-icon">
                          <div
                            className="action-archive"
                            style={{ cursor: 'not-allowed' }}
                          >
                            <img src={ICONS.ARCHIVE} alt="" />
                          </div>
                          <div
                            className="action-archive"
                            style={{ cursor: 'not-allowed' }}
                          >
                            <img src={ICONS.editIcon} alt="" />
                          </div>
                        </div>
                      ) : (
                        <div className="action-icon">
                          <div
                            className="action-archive"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleArchiveClick(el.record_id)}
                          >
                            <img src={ICONS.ARCHIVE} alt="" />
                          </div>
                          <div
                            className="action-archive"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleEditCommission(el)}
                          >
                            <img src={ICONS.editIcon} alt="" />
                          </div>
                        </div>
                      )}
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
        {/* {data?.length > 0 && (
          <div className="page-heading-container">
            <p className="page-heading">
              {currentPage} - {10} of {data?.length} item
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
              currentPageData={currentPageData}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
              perPage={itemsPerPage}
            />
          </div>
        )} */}
         <div className="page-heading-container">
          {!!count && (
            <p className="page-heading">
              {startIndex} - {endIndex > count ? count : endIndex} of {count}{' '}
              item
            </p>
          )}

          {data?.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              currentPageData={currentPageData}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
              perPage={itemsPerPage}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RebeteData;
