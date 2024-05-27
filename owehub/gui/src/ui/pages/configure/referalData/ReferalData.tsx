import React, { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import '../configure.css';
import { RiDeleteBin5Line } from 'react-icons/ri';
// import CreateCommissionRate from "./CreateCommissionRate";
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { CSVLink } from 'react-csv';
import { ICONS } from '../../../icons/Icons';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { getrefralData } from '../../../../redux/apiActions/config/refralDataAction';

// import FilterCommission from "./FilterCommission";

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
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
interface Column {
  name: string;
  displayName: string;
  type: string;
}

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
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived,
    };
    dispatch(getrefralData(pageNumber));
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

  const filter = () => {
    setFilterOpen(true);
  };

  const totalPages = Math.ceil(dbCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
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

  const currentPageData = commissionList?.slice(startIndex, endIndex);
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
      const res = await postCaller(
        EndPoints.update_commission_archive,
        newValue
      );
      if (res.status === HTTP_STATUS.OK) {
        dispatch(fetchDealer(pageNumber));
        setSelectAllChecked(false);
        setSelectedRows(new Set());
        await successSwal('Archived', 'The data has been archived ');
      } else {
        await successSwal('Archived', 'The data has been archived ');
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

  return (
    <div className="comm">
      <Breadcrumb
        head="Commission"
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Referal-data"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Referal Data"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          viewArchive={viewArchived}
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
                        {el.partner}
                      </div>
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
                    <td>{el.sale_type}</td>
                    <td>{el.sale_price}</td>
                    <td>{el.start_date}</td>
                    <td>{el.end_date}</td>
                    <td>
                      {selectedRows.size > 0 ? (
                        <div className="action-icon">
                          <div
                            className="action-archive"
                            style={{ cursor: 'not-allowed' }}
                          >
                            <img src={ICONS.ARCHIVE} alt="" />
                            {/* <span className="tooltiptext">Archive</span> */}
                          </div>
                          <div
                            className="action-archive"
                            style={{ cursor: 'not-allowed' }}
                          >
                            <img src={ICONS.editIcon} alt="" />
                            {/* <span className="tooltiptext">Edit</span> */}
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
                            {/* <span className="tooltiptext">Archive</span> */}
                          </div>
                          <div
                            className="action-archive"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleEditCommission(el)}
                          >
                            <img src={ICONS.editIcon} alt="" />
                            {/* <span className="tooltiptext">Edit</span> */}
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
        {commissionList?.length > 0 ? (
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
              perPage={itemsPerPage}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ReferalData;
