import React, { useEffect, useState } from 'react';
import '../configure.css';

import { ICONS } from '../../../icons/Icons';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { fetchSalesType } from '../../../../redux/apiSlice/configSlice/config_get_slice/salesSlice';
import CreateSaleType from './CreateSaleType';
import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import { SalesTypeModel } from '../../../../core/models/configuration/create/SalesTypeModel';
import Pagination from '../../../components/pagination/Pagination';
import { setCurrentPage } from '../../../../redux/apiSlice/paginationslice/paginationSlice';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import {
  Column,
  FilterModel,
} from '../../../../core/models/data_models/FilterSelectModel';
import { SalesTypeColumn } from '../../../../resources/static_data/configureHeaderData/SalesTypeColumn';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import FilterModal from '../../../components/FilterModal/FilterModal';
import Loading from '../../../components/loader/Loading';
import DataNotFound from '../../../components/loader/DataNotFound';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import Swal from 'sweetalert2';
import { ROUTES } from '../../../../routes/routes';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import MicroLoader from '../../../components/loader/MicroLoader';
import { Tooltip as ReactTooltip } from 'react-tooltip';
const SaleType = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const {
    saletype_list: salesTypeList,
    totalCount,
    loading,
  } = useAppSelector((state) => state.salesType);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedSalesType, setEditedMarketing] = useState<SalesTypeModel | null>(
    null
  );
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<FilterModel[]>([]);
  const [refetch, setRefetch] = useState(1);
  const [selected, setSelected] = useState(-1);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived ? true : undefined,
      filters,
    };
    dispatch(fetchSalesType(pageNumber));
  }, [dispatch, currentPage, viewArchived, filters, refetch]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selected !== null &&
        !(event.target as HTMLElement).closest(
          `[data-tooltip-id="tooltip-${selected}"]`
        )
      ) {
        setSelected(-1);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selected]);
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const filter = () => {
    setFilterOpen(true);
  };
  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = startIndex * itemsPerPage;
  const currentPageData = salesTypeList?.slice();
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === salesTypeList.length;
  const handleAddSaleType = () => {
    setEditMode(false);
    setEditedMarketing(null);
    handleOpen();
  };

  const handleEditSaleType = (saleTypeData: SalesTypeModel) => {
    setEditMode(true);
    setEditedMarketing(saleTypeData);
    handleOpen();
  };
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
          archived: viewArchived,
        };

        const res = await postCaller('update_saletype_archive', newValue);
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchSalesType(pageNumber));
          setSelectAllChecked(false);
          setSelectedRows(new Set());
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
    const confirmationResult = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will archive your data.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, archive',
    });
    if (confirmationResult.isConfirmed) {
      const archived: number[] = [record_id];
      let newValue = {
        record_id: archived,
        is_archived: true,
      };
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
        filters,
        archived: viewArchived,
      };
      const res = await postCaller('update_saletype_archive', newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(fetchSalesType(pageNumber));
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
  const fetchFunction = (req: any) => {
    setCurrentPage(1);
    setFilters(req.filters);
  };

  return (
    <div className="comm">
      <Breadcrumb
        head="Commission"
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Sale Type"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Sale Types"
          onPressViewArchive={() => handleViewArchiveToggle()}
          onPressArchive={() => handleArchiveAllClick()}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onPressFilter={() => filter()}
          viewArchive={viewArchived}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleAddSaleType()}
        />

        <FilterHoc
          isOpen={filterOPen}
          resetOnChange={viewArchived}
          handleClose={filterClose}
          columns={SalesTypeColumn}
          fetchFunction={fetchFunction}
          page_number={currentPage}
          page_size={itemsPerPage}
        />

        {open && (
          <CreateSaleType
            salesTypeData={editedSalesType}
            editMode={editMode}
            setRefetch={setRefetch}
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
                {SalesTypeColumn.map((item, key) => (
                  <SortableHeader
                    key={key}
                    isCheckbox={item.isCheckbox}
                    titleName={item.displayName}
                    data={salesTypeList}
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
                 {(!viewArchived && selectedRows.size<2) &&   <div className="action-header">
                      <p>Action</p>
                    </div>}
                  </th>
            
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={SalesTypeColumn.length+1}>
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
                        {el.type_name}
                      </div>
                    </td>

                    <td style={{ display: 'flex' }}>
                      <p style={{ width: 'max-content' }}>
                        {el.description?.trim().length > 40
                          ? el.description.slice(0, 20) + '...'
                          : el.description || 'N/A'}
                      </p>
                      {el.description?.trim().length > 40 && (
                        <span
                          role="button"
                          style={{ cursor: 'pointer', color:
                          selected === i
                            ? '#F82C2C'
                            : '#3083e5', }}
                          data-tooltip-id={`tooltip-${i}`}
                          data-tooltip-content={el.description}
                          data-tooltip-place="bottom"
                          onClick={() => setSelected(selected === i ? -1 : i)}
                        >
                          {i === selected ? 'Show Less' : 'Show More'}
                        </span>
                      )}

                      <ReactTooltip
                        id={`tooltip-${i}`}
                        className="custom-tooltip"
                        isOpen={selected === i}
                      />
                    </td>

                    <td>
                      {!viewArchived && selectedRows.size < 2 && (
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
                            onClick={() => handleEditSaleType(el)}
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
        {salesTypeList?.length > 0 ? (
          <div className="page-heading-container">
            <p className="page-heading">
              {startIndex} - {endIndex > totalCount ? totalCount : endIndex} of{' '}
              {totalCount} item
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

export default SaleType;
