import React, { useEffect, useState } from 'react';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import Pagination from '../../../components/pagination/Pagination';
import { setCurrentPage } from '../../../../redux/apiSlice/paginationslice/paginationSlice';
import { TimeLineSlaModel } from '../../../../core/models/configuration/create/TimeLineSlaModel';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import { ICONS } from '../../../icons/Icons';
import CheckBox from '../../../components/chekbox/CheckBox';
import {
  toggleAllRows,
  toggleRowSelection,
} from '../../../components/chekbox/checkHelper';
import { showAlert, successSwal } from '../../../components/alert/ShowAlert';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { InstallCostColumns } from '../../../../resources/static_data/configureHeaderData/InstallCostColumn';
import FilterModal from '../../../components/FilterModal/FilterModal';
import { ROUTES } from '../../../../routes/routes';
import {
  getInstallCost,
  ICost,
} from '../../../../redux/apiActions/config/installCostAction';
import CreateInstallCost from './CreateInstallCost';
import Loading from '../../../components/loader/Loading';
import DataNotFound from '../../../components/loader/DataNotFound';
import MicroLoader from '../../../components/loader/MicroLoader';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import { dateFormat } from '../../../../utiles/formatDate';
const InstallCost = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const { data: timelinesla_list, isSuccess } = useAppSelector(
    (state) => state.installConstSlice
  );
  //   const loading = useAppSelector((state) => state.timelineSla.loading);
  const error = useAppSelector((state) => state.timelineSla.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTimeLineSla, setEditedTimeLineSla] = useState<ICost | null>(
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
    dispatch(getInstallCost(pageNumber));
  }, [dispatch, currentPage, viewArchived, filters, isSuccess]);

  const filter = () => {
    setFilterOpen(true);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const {
    data: commissionList,
    isLoading,
    dbCount,
  } = useAppSelector((state) => state.installConstSlice);
  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const totalPages = Math.ceil(dbCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = currentPage * itemsPerPage;

  const currentPageData = timelinesla_list?.slice();
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
      console.log(aValue, bValue, 'efjkngbjkgfn');

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
      const res = await postCaller('update_installcost_archive', newValue);
      if (res.status === HTTP_STATUS.OK) {
        setSelectedRows(new Set());
        setSelectAllChecked(false);

        dispatch(getInstallCost(pageNumber));
        await successSwal('Archived', 'The data has been archived ');
      } else {
        await successSwal('Archived', 'The data has been archived ');
      }
    }
  };

  const handleEditTimeLineSla = (timeLineSlaData: ICost) => {
    setEditMode(true);
    setEditedTimeLineSla(timeLineSlaData);
    handleOpen();
  };
  const fetchFunction = (req: any) => {
    setCurrentPage(1);
    setFilters(req.filters);
  };

  console.log(timelinesla_list, 'arrr');

  return (
    <div className="comm">
      <Breadcrumb
        head=""
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Install Cost"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Install Cost"
          onPressViewArchive={() => {
            setViewArchived((prev) => !prev);
            setCurrentPage(1);
            setSelectAllChecked(false);
            setSelectedRows(new Set());
          }}
          onPressArchive={() => {
            handleArchiveClick(
              Array.from(selectedRows).map(
                (_, i: number) => currentPageData[i].record_id
              )
            );
            setSelectAllChecked(false);
            setSelectedRows(new Set());
          }}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          checked={isAllRowsSelected}
          viewArchive={viewArchived}
          isAnyRowSelected={isAnyRowSelected}
          onpressExport={() => {}}
          onpressAddNew={() => handleTimeLineSla()}
        />

        <FilterHoc
          isOpen={filterOPen}
          resetOnChange={viewArchived}
          handleClose={filterClose}
          columns={InstallCostColumns}
          page_number={currentPage}
          fetchFunction={fetchFunction}
          page_size={itemsPerPage}
        />

        {open && (
          <CreateInstallCost
            editData={editedTimeLineSla}
            editMode={editMode}
            handleClose={handleClose}
            setViewArchived={setViewArchived}
            currentPage={currentPage}
          />
        )}
        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          <table>
            <thead>
              <tr>
                {InstallCostColumns?.map((item, key) => (
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
                  <div className="action-header">
                    {!viewArchived && selectedRows.size < 2 && (<p>Action</p>)}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={InstallCostColumns?.length}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <MicroLoader />
                    </div>
                  </td>
                </tr>
              ) : currentPageData?.length > 0 ? (
                currentPageData?.map((el: ICost, i: number) => (
                  <tr
                    key={i}
                    className={selectedRows.has(el.record_id) ? 'selected' : ''}
                  >
                    <td style={{ fontWeight: '500', color: 'black' }}>
                      <div className="flex-check">
                        <CheckBox
                          checked={selectedRows.has(el.record_id)}
                          onChange={() =>
                            toggleRowSelection(
                              el.record_id,
                              selectedRows,
                              setSelectedRows,
                              setSelectAllChecked
                            )
                          }
                        />
                        {el.cost}
                      </div>
                    </td>
                    <td>{dateFormat(el.start_date)}</td>
                    <td>{dateFormat(el.end_date)}</td>
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
        <div className="page-heading-container">
          <p className="page-heading">
            {startIndex} - {endIndex > dbCount ? dbCount : endIndex} of{' '}
            {dbCount} item
          </p>

          {timelinesla_list?.length > 0 ? (
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

export default InstallCost;
