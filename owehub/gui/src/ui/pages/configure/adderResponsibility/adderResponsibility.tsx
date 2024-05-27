import React, { useEffect, useState } from 'react';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { ICONS } from '../../../icons/Icons';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchTimeLineSla } from '../../../../redux/apiSlice/configSlice/config_get_slice/timeLineSlice';
// import CreateTimeLine from "./CreateTimeLine";
import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import Pagination from '../../../components/pagination/Pagination';
import { setCurrentPage } from '../../../../redux/apiSlice/paginationslice/paginationSlice';
import { TimeLineSlaModel } from '../../../../core/models/configuration/create/TimeLineSlaModel';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';

import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { AdderResponsibilityColumns } from '../../../../resources/static_data/configureHeaderData/adderResponsibilityColumn';
import FilterModal from '../../../components/FilterModal/FilterModal';
import { ROUTES } from '../../../../routes/routes';
import CreateAdderResponsibility from './CreateAdderResponsibility';
import { fetchAdderResponsibility } from '../../../../redux/apiActions/config/adderResponsbilityAction';
import { fetchApptSetters } from '../../../../redux/apiActions/config/apptSetterAction';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { showAlert, successSwal } from '../../../components/alert/ShowAlert';
import Loading from '../../../components/loader/Loading';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import DataNotFound from '../../../components/loader/DataNotFound';
import MicroLoader from '../../../components/loader/MicroLoader';
const AdderResponsibility = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const { data, isLoading } = useAppSelector(
    (state) => state.adderresponsbility
  );
  //   const loading = useAppSelector((state) => state.timelineSla.loading);
  const error = useAppSelector((state) => state.timelineSla.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedAdderResponsbility, setEditedAdderResponsbility] =
    useState(null);
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
    dispatch(fetchAdderResponsibility(pageNumber));
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
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = startIndex * itemsPerPage;

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
  const handleTimeLineSla = () => {
    setEditMode(false);
    setEditedAdderResponsbility(null);
    handleOpen();
  };

  const fetchFunction = (req: any) => {
    setCurrentPage(1);
    setFilters(req.filters);
  };
  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setSelectAllChecked(false);
  };
  const handleEdit = (data: any) => {
    setEditMode(true);
    setEditedAdderResponsbility(data);
    handleOpen();
  };

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

        const pageNumber = {
          page_number: currentPage,
          page_size: itemsPerPage,
          filters,
        };

        const res = await postCaller(
          'update_adder_responsibility_archive',
          newValue
        );
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchAdderResponsibility(pageNumber));

          setSelectAllChecked(false);
          setSelectedRows(new Set());
          await successSwal('Archived', 'The data has been archived ');
        } else {
          await successSwal('Archived', 'The data has been archived ');
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
        'update_adder_responsibility_archive',
        newValue
      );
      if (res.status === HTTP_STATUS.OK) {
        dispatch(fetchAdderResponsibility(pageNumber));
        setSelectAllChecked(false);
        setSelectedRows(new Set());
        await successSwal('Archived', 'The data has been archived ');
      } else {
        await successSwal('Archived', 'The data has been archived ');
      }
    }
  };
  //   if (loading) {
  //     return <div>Loading...</div>;
  //   }

  return (
    <div className="comm">
      <Breadcrumb
        head=""
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Adder Responsbility"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Adder Responsbility"
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
          columns={AdderResponsibilityColumns}
          page_number={currentPage}
          fetchFunction={fetchFunction}
          page_size={itemsPerPage}
        />

        {open && (
          <CreateAdderResponsibility
            editMode={editMode}
            setRefetch={setRefetch}
            editData={editedAdderResponsbility}
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
                {AdderResponsibilityColumns?.map((item, key) => (
                  <SortableHeader
                    key={key}
                    isCheckbox={item.isCheckbox}
                    titleName={item.displayName}
                    data={data}
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
                  <th>
                    <div className="action-header">
                      <p>Action</p>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={AdderResponsibilityColumns.length + 1}>
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
                        {el.unique_id}
                      </div>
                    </td>
                    <td> {el.pay_scale}</td>
                    <td>{el.percentage}</td>

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
                  <td colSpan={AdderResponsibilityColumns.length}>
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
          {data?.length > 0 ? (
            <>
              <p className="page-heading">
                {startIndex} - {endIndex} of {currentPageData?.length} item
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
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdderResponsibility;
