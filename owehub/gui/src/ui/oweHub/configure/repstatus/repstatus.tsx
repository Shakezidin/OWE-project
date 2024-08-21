import React, { useEffect, useState } from 'react';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { ICONS } from '../../../../resources/icons/Icons';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  archiveRepStatus,
  fetchRepStatusList,
} from '../../../../redux/apiActions/config/repstatusAction';
import CreateAr from './createrepstatus';
import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import Pagination from '../../../components/pagination/Pagination';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { ROUTES } from '../../../../routes/routes';
import {
  errorSwal,
  showAlert,
  successSwal,
} from '../../../components/alert/ShowAlert';
import DataNotFound from '../../../components/loader/DataNotFound';
import MicroLoader from '../../../components/loader/MicroLoader';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import { RepStatuscolumns } from '../../../../resources/static_data/configureHeaderData/RepStatusColumn';

const RepStatus = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedAr, setEditedAr] = useState(null);
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { rep_status_list, count, isSuccess, isLoading } = useAppSelector(
    (state) => state.repStatus
  );
  const [filters, setFilters] = useState<FilterModel[]>([]);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived ? true : undefined,
      filters,
    };
    dispatch(fetchRepStatusList(pageNumber));
  }, [dispatch, currentPage, viewArchived, filters]);

  useEffect(() => {
    if (isSuccess) {
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
        archived: viewArchived,
        filters,
      };
      dispatch(fetchRepStatusList({ ...pageNumber }));
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

  const currentPageData = rep_status_list?.slice();
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === rep_status_list?.length;
  const handleSort = (key: any) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  if (sortKey) {
    currentPageData?.sort((a: any, b: any) => {
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
    setEditedAr(null);
    handleOpen();
  };
  const handleEdit = (data: any) => {
    setEditMode(true);
    setEditedAr(data);
    handleOpen();
  };

  const fetchFunction = (req: any) => {
    setCurrentPage(1);
    setFilters(req.filters);
  };
  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    setSelectedRows(new Set());
    setSelectAllChecked(false);
    setCurrentPage(1);
  };
  const handleArchiveAllClick = async () => {
    const confirmed = await showAlert(
      'Are You Sure',
      'This action will archive your data',
      'Yes',
      'No'
    );
    if (confirmed) {
      const archivedRows = Array.from(selectedRows).map(
        (index) => rep_status_list[index].record_id
      );
      if (archivedRows.length > 0) {
        const pageNumber = {
          page_number: currentPage,
          page_size: itemsPerPage,
          filters,
        };

        try {
          await dispatch(archiveRepStatus(archivedRows));

          setSelectedRows(new Set());
          setSelectAllChecked(false);

          // Refetch the rep status list after archiving
          dispatch(fetchRepStatusList(pageNumber));

          await successSwal('Archived', 'The data has been archived');
        } catch (error) {
          console.error('Error archiving rep status:', error);
          await errorSwal('Error', 'Failed to archive the data');
        }
      }
    }
  };

  const handleArchiveClick = async (record_id: any) => {
    const confirmed = await showAlert(
      'Are You Sure',
      'This action will archive your data',
      'Yes',
      'No'
    );
    if (confirmed) {
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
        filters,
      };

      try {
        await dispatch(archiveRepStatus([record_id]));

        setSelectedRows(new Set());
        setSelectAllChecked(false);

        // Refetch the rep status list after archiving
        dispatch(fetchRepStatusList(pageNumber));

        await successSwal('Archived', 'The data has been archived');
      } catch (error) {
        console.error('Error archiving rep status:', error);
        await errorSwal('Error', 'Failed to archive the data');
      }
    }
  };

  return (
    <div className="comm">
      <Breadcrumb
        head=""
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Rep Status"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Rep Status"
          onPressViewArchive={() => handleViewArchiveToggle()}
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
          isOpen={filterOPen}
          resetOnChange={viewArchived}
          handleClose={filterClose}
          columns={RepStatuscolumns}
          page_number={currentPage}
          fetchFunction={fetchFunction}
          page_size={itemsPerPage}
        />

        {open && (
          <CreateAr
            editMode={editMode}
            handleClose={handleClose}
            editData={editedAr}
          />
        )}
        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          <table>
            <thead>
              <tr>
                {RepStatuscolumns?.map((item, key) => (
                  <SortableHeader
                    key={key}
                    isCheckbox={item.isCheckbox}
                    titleName={item.displayName}
                    data={rep_status_list}
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
                {viewArchived === true ? null : (
                  <th
                    className={
                      !viewArchived && selectedRows.size < 2 ? '' : 'd-none'
                    }
                  >
                    <div className="action-header">
                      {!viewArchived && selectedRows.size < 2 && <p>Action</p>}
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10}>
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
                        {el.name || 'N/A'}
                      </div>
                    </td>
                    <td>{el.status || 'N/A'}</td>

                    {!viewArchived && selectedRows.size < 2 && (
                      <td>
                        <div className="action-icon">
                          <div
                            className=""
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleArchiveClick(el.record_id)}
                          >
                            <img src={ICONS.ARCHIVE} alt="" />
                          </div>
                          <div
                            className=""
                            onClick={() => handleEdit(el)}
                            style={{ cursor: 'pointer' }}
                          >
                            <img src={ICONS.editIcon} alt="" />
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
        <div className="page-heading-container">
          {!!count && (
            <p className="page-heading">
              {startIndex} - {endIndex > count ? count : endIndex} of {count}{' '}
              item
            </p>
          )}

          {rep_status_list?.length > 0 ? (
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

export default RepStatus;
