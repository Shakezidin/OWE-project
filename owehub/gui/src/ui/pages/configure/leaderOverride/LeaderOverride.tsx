import React, { useEffect, useState } from 'react';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { ICONS } from '../../../icons/Icons';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import Pagination from '../../../components/pagination/Pagination';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import { showAlert, successSwal } from '../../../components/alert/ShowAlert';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { LeaderOverrideColumns } from '../../../../resources/static_data/configureHeaderData/LeaderOverrideColumn';
import { ROUTES } from '../../../../routes/routes';
import CreateLeaderOverride from './CreateLeaderOverride';
import MicroLoader from '../../../components/loader/MicroLoader';
import DataNotFound from '../../../components/loader/DataNotFound';
import {
  ILeaderRow,
  getleaderOverride,
} from '../../../../redux/apiActions/config/leaderOverrideAction';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/leaderOverride';
import CheckBox from '../../../components/chekbox/CheckBox';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import { dateFormat } from '../../../../utiles/formatDate';

const LeaderOverride = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const timelinesla_list = useAppSelector((state) => state.leaderOverride.data);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedTimeLineSla, setEditedTimeLineSla] = useState<ILeaderRow | null>(
    null
  );
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: commissionList,
    isLoading,
    isSuccess,
    count,
  } = useAppSelector((state) => state.leaderOverride);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<FilterModel[]>();
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived,
      filters,
    };
    dispatch(getleaderOverride(pageNumber));
  }, [dispatch, currentPage, viewArchived, filters]);

  useEffect(() => {
    if (isSuccess) {
      handleClose();
      dispatch(resetSuccess());
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
        archived: viewArchived,
        filters,
      };
      dispatch(getleaderOverride(pageNumber));
    }
  }, [isSuccess, currentPage, viewArchived, filters]);

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
  const endIndex = currentPage * itemsPerPage;

  const currentPageData = commissionList?.slice();
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === timelinesla_list?.length;
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

  const handleArchiveClick = async (record_id: any) => {
    const confirmed = await showAlert(
      'Are Your Sure',
      'This Action will archive your data',
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
      const res = await postCaller('update_leaderoverride_archive', newValue);
      if (res.status === HTTP_STATUS.OK) {
        setSelectAllChecked(false);
        setSelectedRows(new Set());

        dispatch(getleaderOverride(pageNumber));
        await successSwal('Archived', 'The data has been archived ');
      } else {
        await successSwal('Archived', 'The data has been archived ');
      }
    }
  };

  const handleEditTimeLineSla = (timeLineSlaData: ILeaderRow) => {
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
        linkparaSecond="Leader Override"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Leader Override"
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
          columns={LeaderOverrideColumns}
          page_number={currentPage}
          fetchFunction={fetchFunction}
          page_size={itemsPerPage}
        />

        {open && (
          <CreateLeaderOverride
            editMode={editMode}
            handleClose={handleClose}
            editData={editedTimeLineSla}
            setViewArchived={setViewArchived}
          />
        )}
        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          <table>
            <thead>
              <tr>
                {LeaderOverrideColumns?.map((item, key) => (
                  <SortableHeader
                    key={key}
                    isCheckbox={item.isCheckbox}
                    titleName={item.displayName}
                    data={timelinesla_list}
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
                  {!viewArchived && selectedRows.size < 2 && (
                    <div className="action-header">
                      <p>Action</p>
                    </div>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={LeaderOverrideColumns?.length}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <MicroLoader />
                    </div>
                  </td>
                </tr>
              ) : currentPageData?.length > 0 ? (
                currentPageData?.map((el: ILeaderRow, i: number) => (
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
                        {el.team_name || 'N/A'}
                      </div>
                    </td>

                    <td>{el.leader_name || 'N/A'}</td>
                    <td>{el.type || 'N/A'}</td>
                    <td>{el.term || 'N/A'}</td>
                    <td>{el.qual || 'N/A'}</td>
                    <td>{el.sales_q || 'N/A'}</td>
                    <td>{el.team_kw_q || 'N/A'}</td>
                    <td>{el.pay_rate || 'N/A'}</td>
                    <td>{dateFormat(el.start_date) || 'N/A'}</td>
                    <td>{dateFormat(el.end_date) || 'N/A'}</td>
                    <td>
                      {!viewArchived && selectedRows.size < 2 && (
                        <div className="action-icon">
                          <div
                            className=""
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleArchiveClick([el.record_id])}
                          >
                            <img src={ICONS.ARCHIVE} alt="" />
                          </div>
                          <div
                            className=""
                            onClick={() => handleEditTimeLineSla(el)}
                            style={{ cursor: 'pointer' }}
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
                  <td colSpan={LeaderOverrideColumns.length}>
                    <DataNotFound />
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

          {timelinesla_list?.length > 0 ? (
            <Pagination
              perPage={itemsPerPage}
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              currentPageData={currentPageData}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LeaderOverride;
