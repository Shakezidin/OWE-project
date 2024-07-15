import React, { useEffect, useState } from 'react';
import '../configure.css';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { CSVLink } from 'react-csv';
import { ICONS } from '../../../icons/Icons';
import TableHeader from '../../../components/tableHeader/TableHeader';
import {
  getNonComm,
  INonCommRowDLR,
} from '../../../../redux/apiActions/config/nocCommAction';
import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import Pagination from '../../../components/pagination/Pagination';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import DataNotFound from '../../../components/loader/DataNotFound';
import { ROUTES } from '../../../../routes/routes';
import { NonCommDlrColumn } from '../../../../resources/static_data/configureHeaderData/NonCommDlrColumn';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import CreateNonComm from './CreateNonComm';
import { showAlert, successSwal } from '../../../components/alert/ShowAlert';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import MicroLoader from '../../../components/loader/MicroLoader';
import { Tooltip as ReactTooltip } from 'react-tooltip';

const NonCommDlrPay: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const [exportOPen, setExportOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleExportOpen = () => setExportOpen(!exportOPen);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const commissionList = useAppSelector((state) => state.nonComm.data);
  const { isLoading: loading, dbCount } = useAppSelector(
    (state) => state.nonComm
  );
  const error = useAppSelector((state) => state.nonComm.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCommission, setEditedCommission] =
    useState<INonCommRowDLR | null>(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<FilterModel[]>([]);
  const [refetch, setRefetch] = useState(1);
  const [selected, setSelected] = useState(-1);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived,
      filters,
    };
    dispatch(getNonComm(pageNumber));
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

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const filter = () => {
    setFilterOpen(true);
  };

  const totalPages = Math.ceil(dbCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = startIndex * itemsPerPage;
  const handleAddCommission = () => {
    setEditMode(false);
    setEditedCommission(null);
    handleOpen();
  };

  const handleEditCommission = (commission: INonCommRowDLR) => {
    setEditMode(true);
    setEditedCommission(commission);
    handleOpen();
  };

  const currentPageData = commissionList?.slice();
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
  //

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
      const res = await postCaller('update_noncommdlrpay_archive', newValue);
      if (res.status === HTTP_STATUS.OK) {
        setSelectAllChecked(false);
        setSelectedRows(new Set());
        dispatch(getNonComm(pageNumber));
        await successSwal('Archived', 'The data has been archived ');
      } else {
        await successSwal('Archived', 'The data has been archived ');
      }
    }
  };

  console.log(
    endIndex,
    dbCount,
    '................................................'
  );

  return (
    <div className="comm">
      <Breadcrumb
        head="Commission"
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="NON-Comm"
      />
      <div className="commissionContainer">
        <TableHeader
          title="NON-Comm"
          onPressViewArchive={() => {
            setViewArchived((prev) => !prev);
            setCurrentPage(1);
            setSelectedRows(new Set());
            setSelectAllChecked(false);
          }}
          onPressArchive={() =>
            handleArchiveClick(
              Array.from(selectedRows).map(
                (_, i: number) => currentPageData[i].record_id
              )
            )
          }
          viewArchive={viewArchived}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          checked={isAllRowsSelected}
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
        {/* {filterOPen && <FilterCommission handleClose={filterClose}  
            columns={columns} 
             page_number = {currentPage}
             page_size = {itemsPerPage}
             />} */}
        {open && (
          <CreateNonComm
            commission={editedCommission}
            editMode={editMode}
            handleClose={handleClose}
            setRefetch={setRefetch}
          />
        )}

        <FilterHoc
          isOpen={filterOPen}
          resetOnChange={viewArchived}
          handleClose={filterClose}
          columns={NonCommDlrColumn}
          fetchFunction={fetchFunction}
          page_number={currentPage}
          page_size={itemsPerPage}
        />

        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          <table>
            <thead>
              <tr>
                {NonCommDlrColumn.map((item, key) => (
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
                    {!viewArchived && selectedRows.size < 2 && <p>Action</p>}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={NonCommDlrColumn.length}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <MicroLoader />
                    </div>
                  </td>
                </tr>
              ) : currentPageData?.length > 0 ? (
                currentPageData?.map((el: INonCommRowDLR, i: number) => (
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
                    <td>{el.customer || 'N/A'}</td>
                    <td>{el.dealer_name || 'N/A'}</td>
                    <td>{el.dealer_dba || 'N/A'}</td>
                    <td>{el.exact_amount}</td>
                    <td>{el.balance}</td>
                    <td>{el.approved_by}</td>
                    <td style={{ display: 'flex' }}>
                      <p style={{ width: 'max-content' }}>
                        {el.notes?.trim().length > 40
                          ? el.notes.slice(0, 20) + '...'
                          : el.notes || 'N/A'}
                      </p>
                      {el.notes?.trim().length > 40 && (
                        <span
                          role="button"
                          style={{
                            cursor: 'pointer',
                            color: selected === i ? '#F82C2C' : '#3083e5',
                          }}
                          data-tooltip-id={`tooltip-${i}`}
                          data-tooltip-content={el.notes}
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
                        style={{ zIndex: 20 }}
                      />
                    </td>
                    <td>{el.paid_amount}</td>
                    <td>{el.date}</td>
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
                    <DataNotFound />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {commissionList?.length > 0 ? (
          <div className="page-heading-container">
            <p className="page-heading">
              {startIndex} - {endIndex > dbCount ? dbCount : endIndex} of{' '}
              {dbCount} item
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

export default NonCommDlrPay;
