import React, { useEffect, useState } from 'react';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { ICONS } from '../../../icons/Icons';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';

import {
  IRateRow,
  getAdjustments,
} from '../../../../redux/apiActions/config/arAdjustmentsAction';

import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import Pagination from '../../../components/pagination/Pagination';
import { setCurrentPage } from '../../../../redux/apiSlice/paginationslice/paginationSlice';
import { TimeLineSlaModel } from '../../../../core/models/configuration/create/TimeLineSlaModel';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import CreatedAdjustments from './CreateAdjustments';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { AdjustmentsColumns } from '../../../../resources/static_data/configureHeaderData/AdjustmentsColumn';
import FilterModal from '../../../components/FilterModal/FilterModal';
import { ROUTES } from '../../../../routes/routes';
import { Adjustment } from '../../../../core/models/api_models/ArAdjustMentsModel';
import { format } from 'date-fns';
import { showAlert, successSwal } from '../../../components/alert/ShowAlert';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import Loading from '../../../components/loader/Loading';
import MicroLoader from '../../../components/loader/MicroLoader';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import DataNotFound from '../../../components/loader/DataNotFound';
import { dateFormat } from '../../../../utiles/formatDate';
const Adjustments = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const {
    data: arAdjustmentsList,
    isLoading,
    error,
    count,
    isSuccess,
  } = useAppSelector((state) => state.arAdjusments);
  //   const loading = useAppSelector((state) => state.timelineSla.loading);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTimeLineSla, setEditedTimeLineSla] = useState<IRateRow | null>(
    null
  );
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<FilterModel[]>([]);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived,
      filters,
    };
    dispatch(getAdjustments(pageNumber));
  }, [dispatch, currentPage, viewArchived, filters]);

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
  const totalPages = Math.ceil(count / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = startIndex + itemsPerPage;

  const currentPageData = arAdjustmentsList?.slice();
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === arAdjustmentsList?.length;

  useEffect(() => {
    if (isSuccess) {
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
        archived: viewArchived,
        filters,
      };
      dispatch(getAdjustments({ ...pageNumber }));
    }
  }, [isSuccess, currentPage, viewArchived, filters]);
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
  const handleTimeLineSla = () => {
    setEditMode(false);
    setEditedTimeLineSla(null);
    handleOpen();
  };
  console.log(currentPageData, currentPageData.length, 'data');

  const handleArchiveClick = async (record_id: number[]) => {
    const confirmed = await showAlert(
      'Archive',
      'Are you sure do you want to archive',
      'Yes',
      'No'
    );
    if (confirmed) {
      const archived: number[] = record_id;
      let newValue = {
        record_id: archived,
        is_archived: true,
      };
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
        archived: viewArchived,
        filters,
      };
      const res = await postCaller('update_adjustments_archive', newValue);
      if (res.status === HTTP_STATUS.OK) {
        setSelectAllChecked(false);
        setSelectedRows(new Set());
        dispatch(getAdjustments(pageNumber));
        await successSwal('Archived', 'The data has been archived ');
      } else {
        await successSwal('Archived', 'The data has been archived ');
      }
    }
  };

  const handleEditTimeLineSla = (timeLineSlaData: IRateRow) => {
    setEditMode(true);
    setEditedTimeLineSla(timeLineSlaData);
    handleOpen();
  };
  const fetchFunction = (req: any) => {
    setCurrentPage(1);
    setFilters(req.filters);
  };

  return (
    <div className="comm">
      <Breadcrumb
        head=""
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Adjustments"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Adjustments"
          onPressViewArchive={() => {
            setViewArchived((prev) => !prev);
            setCurrentPage(1);
            setSelectAllChecked(false);
            setSelectedRows(new Set());
          }}
          onPressArchive={() =>
            handleArchiveClick(
              Array.from(selectedRows).map(
                (_, i: number) => currentPageData[i].record_id
              )
            )
          }
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          checked={isAllRowsSelected}
          viewArchive={viewArchived}
          isAnyRowSelected={isAnyRowSelected}
          onpressExport={() => {}}
          onpressAddNew={() => handleTimeLineSla()}
        />

        <FilterHoc
          resetOnChange={viewArchived}
          isOpen={filterOPen}
          handleClose={filterClose}
          columns={AdjustmentsColumns}
          page_number={currentPage}
          fetchFunction={fetchFunction}
          page_size={itemsPerPage}
        />

        {open && (
          <CreatedAdjustments
            setViewArchived={setViewArchived}
            editData={editedTimeLineSla}
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
                {AdjustmentsColumns?.map((item, key) => (
                  <SortableHeader
                    key={key}
                    isCheckbox={item.isCheckbox}
                    titleName={item.displayName}
                    data={arAdjustmentsList}
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
              {isLoading ? (
                <tr>
                  <td colSpan={AdjustmentsColumns?.length}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <MicroLoader />
                    </div>
                  </td>
                </tr>
              ) : currentPageData?.length ? (
                currentPageData.map((item: Adjustment, ind: number) => {
                  return (
                    <tr key={item.record_id}>
                      <td style={{ paddingRight: 0, textAlign: 'left' }}>
                        <div className="flex-check">
                          <td style={{ paddingInline: 0 }}>
                            <CheckBox
                              checked={selectedRows.has(ind)}
                              onChange={() =>
                                toggleRowSelection(
                                  ind,
                                  selectedRows,
                                  setSelectedRows,
                                  setSelectAllChecked
                                )
                              }
                            />
                          </td>
                          {item.unique_id}
                        </div>
                      </td>
                      <td>{item.customer || 'N/A'}</td>
                      <td>{item.partner_name || 'N/A'}</td>
                      <td>{item.installer_name || 'N/A'}</td>
                      <td> {item.state_name || 'N/A'} </td>
                      <td> {item.sys_size} </td>
                      <td> {item.bl} </td>
                      <td> {item.epc} </td>
                      <td>
                        {' '}
                        {item.date &&
                          dateFormat(item.date)}{' '}
                      </td>
                      <td>{item.amount}</td>
                      <td>
                        {item.notes.length > 40
                          ? item.notes.slice(0, 40) + '...'
                          : item.notes}
                      </td>

                      <td>
                        {!viewArchived && selectedRows.size < 2 && (
                          <div className="action-icon">
                            <div
                              className=""
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                handleArchiveClick([item.record_id])
                              }
                            >
                              <img src={ICONS.ARCHIVE} alt="" />
                            </div>
                            <div
                              className=""
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleEditTimeLineSla(item)}
                            >
                              <img src={ICONS.editIcon} alt="" />
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={AdjustmentsColumns.length}>
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
        <div className="page-heading-container">
          {!!count && (
            <p className="page-heading">
              {startIndex} - {endIndex > count ? count : endIndex} of {count}{' '}
              item
            </p>
          )}

          {currentPageData?.length > 0 ? (
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

export default Adjustments;
