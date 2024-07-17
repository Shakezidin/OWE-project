import React, { useEffect, useState } from 'react';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { ICONS } from '../../../icons/Icons';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import CreateRateAdjustments from './createRateAdjustments';
import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import Pagination from '../../../components/pagination/Pagination';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { RateAdjustmentsColumns } from '../../../../resources/static_data/configureHeaderData/RateAdjustmentsColumn';
import { ROUTES } from '../../../../routes/routes';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import {
  errorSwal,
  showAlert,
  successSwal,
} from '../../../components/alert/ShowAlert';
import { fetchRateAdjustments } from '../../../../redux/apiActions/config/RateAdjustmentsAction';
import DataNotFound from '../../../components/loader/DataNotFound';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import MicroLoader from '../../../components/loader/MicroLoader';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import { resetSuccess } from '../../../../redux/apiSlice/configSlice/config_get_slice/rateAdjustmentsSlice';
import { checkLastPage } from '../../../../utiles';
const RateAdjustments = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const { data, totalCount, isLoading, isSuccess } = useAppSelector(
    (state) => state.rateAdjustment
  );
  const [refetch, setRefetch] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedRateAdjustment, setEditedRateAdjustment] = useState(null);
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
      archived: viewArchived ? true : undefined,
      filters,
    };
    dispatch(fetchRateAdjustments(pageNumber));
  }, [dispatch, currentPage, viewArchived, filters, refetch]);

  useEffect(() => {
    if (isSuccess) {
      handleClose();
      setRefetch((prev) => prev + 1);
      dispatch(resetSuccess());
    }
  }, [isSuccess]);

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
    setEditedRateAdjustment(null);
    handleOpen();
  };
  const handleViewArchiveToggle = () => {
    setViewArchived(!viewArchived);
    // When toggling, reset the selected rows
    setSelectedRows(new Set());
    setSelectAllChecked(false);
    setCurrentPage(1);
  };

  const fetchFunction = (req: any) => {
    setCurrentPage(1);
    setFilters(req.filters);
  };

  const handleEdit = (data: any) => {
    setEditMode(true);
    setEditedRateAdjustment(data);
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
          'update_rateadjustments_archive',
          newValue
        );
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchRateAdjustments(pageNumber));
          checkLastPage(currentPage, totalPages, setCurrentPage,selectedRows.size,currentPageData.length);
          setSelectAllChecked(false);
          setSelectedRows(new Set());
          await successSwal('Archived', 'The data has been archived ');
        } else {
          await errorSwal('Failed', 'Something went wrong');
        }
      }
    }
  };

  const handleArchiveClick = async (record_id: number[]) => {
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
        archive: viewArchived,
        filters,
      };
      const res = await postCaller('update_rateadjustments_archive', newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(fetchRateAdjustments(pageNumber));
        checkLastPage(currentPage, totalPages, setCurrentPage,selectedRows.size,currentPageData.length);
        setSelectedRows(new Set());
        await successSwal('Archived', 'The data has been archived ');
      } else {
        await errorSwal('Failed', 'Something went wrong');
      }
    }
  };
  const notAllowed = selectedRows.size>1


  return (
    <div className="comm">
      <Breadcrumb
        head=""
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Rate Adjustments"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Rate Adjustments"
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
          columns={RateAdjustmentsColumns}
          page_number={currentPage}
          fetchFunction={fetchFunction}
          page_size={itemsPerPage}
        />

        {open && (
          <CreateRateAdjustments
            editMode={editMode}
            handleClose={handleClose}
            editData={editedRateAdjustment}
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
                {RateAdjustmentsColumns?.map((item, key) => (
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
                <th>
                  <div className="action-header">
                   <p>Action</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={RateAdjustmentsColumns.length}>
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
                        {el.pay_scale}
                      </div>
                    </td>
                    <td>{el.position}</td>
                    <td>{el.adjustment}</td>
                    <td>{el.min_rate}</td>
                    <td>{el.max_rate}</td>
                    <td>
                     
                     
                        <div className="action-icon">
                          <div
                            className=""
                            style={{ cursor:notAllowed?"not-allowed" :'pointer' }}
                            onClick={() => !notAllowed &&  handleArchiveClick([el.record_id])}
                          >
                            <img src={ICONS.ARCHIVE} alt="" />
                          </div>
                          <div
                            className=""
                            onClick={() => !notAllowed &&  handleEdit(el)}
                            style={{ cursor:notAllowed?"not-allowed" :'pointer' }}
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
        <div className="page-heading-container">
          {data?.length > 0 ? (
            <>
              <p className="page-heading">
                {startIndex} - {endIndex > totalCount ? totalCount : endIndex}{' '}
                of {totalCount} item
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

export default RateAdjustments;
