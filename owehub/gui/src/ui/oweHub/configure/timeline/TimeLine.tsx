import React, { useEffect, useState } from 'react';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { ICONS } from '../../../../resources/icons/Icons';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchTimeLineSla } from '../../../../redux/apiSlice/configSlice/config_get_slice/timeLineSlice';
import CreateTimeLine from './CreateTimeLine';
import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import Pagination from '../../../components/pagination/Pagination';
import { TimeLineSlaModel } from '../../../../core/models/configuration/create/TimeLineSlaModel';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';

import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { TimeLineSlaColumns } from '../../../../resources/static_data/configureHeaderData/TimeLineSlaColumn';
import Loading from '../../../components/loader/Loading';
import DataNotFound from '../../../components/loader/DataNotFound';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import Swal from 'sweetalert2';
import { ROUTES } from '../../../../routes/routes';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import MicroLoader from '../../../components/loader/MicroLoader';
import { showAlert, successSwal } from '../../../components/alert/ShowAlert';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import { dateFormat } from '../../../../utiles/formatDate';
import { checkLastPage } from '../../../../utiles';

const TimeLine = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const timelinesla_list = useAppSelector(
    (state) => state.timelineSla.timelinesla_list
  );
  const { loading, totalCount } = useAppSelector((state) => state.timelineSla);
  const error = useAppSelector((state) => state.timelineSla.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTimeLineSla, setEditedTimeLineSla] =
    useState<TimeLineSlaModel | null>(null);
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<FilterModel[]>([]);
  const [refetch, setRefetch] = useState(1);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived ? true : undefined,
      filters,
    };
    dispatch(fetchTimeLineSla(pageNumber));
  }, [dispatch, currentPage, viewArchived, filters, refetch]);

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
  const totalPages = Math.ceil(totalCount / itemsPerPage);

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
        (index) => currentPageData[index].record_id
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
          EndPoints.update_timelinesla_archive,
          newValue
        );
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchTimeLineSla(pageNumber));

          setSelectAllChecked(false);
          setSelectedRows(new Set());
          checkLastPage(
            currentPage,
            totalPages,
            setCurrentPage,
            selectedRows.size,
            currentPageData.length
          );

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
        EndPoints.update_timelinesla_archive,
        newValue
      );
      if (res.status === HTTP_STATUS.OK) {
        await dispatch(fetchTimeLineSla(pageNumber));
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

  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setSelectAllChecked(false);
    setCurrentPage(1);
  };
  const handleTimeLineSla = () => {
    setEditMode(false);
    setEditedTimeLineSla(null);
    handleOpen();
  };

  const handleEditTimeLineSla = (timeLineSlaData: TimeLineSlaModel) => {
    setEditMode(true);
    setEditedTimeLineSla(timeLineSlaData);
    handleOpen();
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
        linkparaSecond="Timeline SLA"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Time Line SLA"
          // onPressViewArchive={() => handleViewArchiveToggle()}
          onPressViewArchive={() => {
            handleViewArchiveToggle();
            setCurrentPage(1);
            setSelectAllChecked(false);
            setSelectedRows(new Set());
          }}
          onPressArchive={() => handleArchiveAllClick()}
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
          columns={TimeLineSlaColumns}
          fetchFunction={fetchFunction}
          page_number={currentPage}
          page_size={itemsPerPage}
        />
        {open && (
          <CreateTimeLine
            timeLineSlaData={editedTimeLineSla}
            editMode={editMode}
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
                {TimeLineSlaColumns?.map((item, key) => (
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
                    {!viewArchived && selectedRows.size < 2 && <p>Action</p>}
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
                        {el.type_m2m}
                      </div>
                    </td>
                    <td>{el.state}</td>
                    <td>{el.days}</td>
                    <td>{dateFormat(el.start_date)}</td>
                    <td>{dateFormat(el.end_date)}</td>
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
                        </div>
                        <div
                          className="action-archive"
                          style={{
                            cursor: notAllowed ? 'not-allowed' : 'pointer',
                          }}
                          onClick={() =>
                            !notAllowed && handleEditTimeLineSla(el)
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
        {timelinesla_list?.length > 0 && (
          <div className="page-heading-container">
            <p className="page-heading">
              {startIndex} - {endIndex > totalCount ? totalCount : endIndex} of{' '}
              {totalCount} item
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
        )}
      </div>
    </div>
  );
};

export default TimeLine;
