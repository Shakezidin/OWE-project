import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchCommissions } from '../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice';
import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import Pagination from '../../../components/pagination/Pagination';
import { setCurrentPage } from '../../../../redux/apiSlice/paginationslice/paginationSlice';
import { CommissionModel } from '../../../../core/models/configuration/create/CommissionModel';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import '../../configure/configure.css';
import HelpDashboard from '../../dashboard/HelpDashboard';
import { BiSupport } from 'react-icons/bi';
import PaginationComponent from '../../../components/pagination/PaginationComponent';
import { getAR } from '../../../../redux/apiActions/config/arAction';

const ArDashBoardTable = () => {
  const [pageSize1, setPageSize1] = useState(10);
  const [openIcon, setOpenIcon] = useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const [exportOPen, setExportOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleExportOpen = () => setExportOpen(!exportOPen);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const commissionList = useAppSelector((state) => state.comm.commissionsList);
  const { data, count, filters } = useAppSelector((state) => state.ardata);
  // const loading = useAppSelector((state) => state.comm.loading);
  const error = useAppSelector((state) => state.comm.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCommission, setEditedCommission] =
    useState<CommissionModel | null>(null);
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);

  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage1, setCurrentPage1] = useState(1);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage1,
      page_size: pageSize1,
      archived: viewArchived ? true : undefined,
      report_type: filters.report_type,
      sale_partner: filters.sale_partner,
      sort_by: filters.sort_by,
      shaky: filters.shaky,
      cancel: filters.cancel,
      sold: filters.sold,
      permits: filters.permits,
      ntp: filters.ntp,
      install: filters.install,
      pto: filters.pto,
    };
     dispatch(getAR(pageNumber));
  }, [dispatch, currentPage1, pageSize1, viewArchived, filters]);
  const handleItemsPerPageChange = (e: any) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setPageSize1(newItemsPerPage);
    setCurrentPage1(1); // Reset to the first page when changing items per page
  };
  const handlePageChange = (page: number) => {
    setCurrentPage1(page);
  };

  const totalPages1 = Math.ceil(count / pageSize1);
  const startIndex = (currentPage1 - 1) * pageSize1 + 1;
  const endIndex = startIndex * pageSize1;

  const currentPageData = data?.slice();
  const isAnyRowSelected = selectedRows?.size > 0;
  const isAllRowsSelected = selectedRows?.size === data?.length;

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
  if (error) {
    return <div>{error}</div>;
  }
  // if (loading) {
  //   return <div>Loading... {loading}</div>;
  // }

  

  const Commissioncolumns = [
    {
      name: 'unique_id',
      displayName: 'UID',
      type: 'string',
      isCheckbox: true,
    },
    {
      name: 'partner',
      displayName: 'Partner',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'installer',
      displayName: 'Installer',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'type',
      displayName: 'Type',
      type: 'string',
      isCheckbox: false,
    },

    {
      name: 'home_owner',
      displayName: 'Home Owner',
      type: 'number',
      isCheckbox: false,
    },
    {
      name: 'street_Address',
      displayName: 'Strt Add',
      type: 'string',
      isCheckbox: false,
    },
    { name: 'city', displayName: 'City', type: 'string', isCheckbox: false },
    { name: 'st', displayName: 'State', type: 'string', isCheckbox: false },
    { name: 'zip', displayName: 'Zip', type: 'string', isCheckbox: false },
    {
      name: 'sys-size',
      displayName: 'Sys Size',
      type: 'string',
      isCheckbox: false,
    },
    { name: 'wc', displayName: 'WC', type: 'string', isCheckbox: false },
    {
      name: 'inst_sys',
      displayName: 'Inst Sys',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'status',
      displayName: 'Status',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'status_date',
      displayName: 'Status Date',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'contract_calc',
      displayName: 'Contract Calc',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'owe_ar',
      displayName: 'Owe Ar',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'total_paid',
      displayName: 'Total Paid',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'current_due',
      displayName: 'Current Due',
      type: 'string',
      isCheckbox: false,
    },
    {
      name: 'balance',
      displayName: 'Balance',
      type: 'string',
      isCheckbox: false,
    },
  ];

  

  const handleIconOpen = () => setOpenIcon(true);
  const handleIconClose = () => setOpenIcon(false);

  return (
    <div className="comm">
      <div className="commissionContainer">
        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          <table>
            <thead>
              <tr>
                {Commissioncolumns?.map((item, key) => (
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
                      <p>Help</p>
                    </div>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {currentPageData?.length > 0
                ? currentPageData?.map(
                    (el: (typeof currentPageData)[0], i: any) => (
                      <tr
                        key={i}
                        className={selectedRows.has(i) ? 'selected' : ''}
                      >
                        <td style={{ fontWeight: '500', color: 'black' }}>
                          <div className="flex-check">
                            <CheckBox
                              checked={selectedRows.has(i)}
                              onChange={() => {
                                // If there's only one row of data and the user clicks its checkbox, select all rows
                                if (currentPageData?.length === 1) {
                                  setSelectAllChecked(true);
                                  setSelectedRows(new Set([0]));
                                } else {
                                  toggleRowSelection(
                                    i,
                                    selectedRows,
                                    setSelectedRows,
                                    setSelectAllChecked
                                  );
                                }
                              }}
                            />
                            {el.unique_id}
                          </div>
                        </td>
                        <td>{el.partner || "N/A"}</td>
                        <td>{el.installer || "N/A"}</td>

                        
                        <td>{el.type || "N/A"}</td>
                        <td>{el.home_owner|| "N/A"}</td>
                        <td>{el.street_address|| "N/A"}</td>
                        <td>{el.city|| "N/A"}</td>
                        <td>{el.st|| "N/A"}</td>
                        <td>{el.zip|| "N/A"}</td>
                        <td>{el.sys_size|| "N/A"}</td>
                        <td>{el.wc|| "N/A"}</td>
                        <td>{el.inst_sys|| "N/A"}</td>
                        <td>{el.status|| "N/A"}</td>
                        <td>{el.status_date|| "N/A"}</td>
                        <td>{el.contract_calc|| "N/A"}</td>
                        <td>{el.owe_ar|| "N/A"}</td>
                        <td>{el.total_paid|| "N/A"}</td>
                        <td>{el.current_due|| "N/A"}</td>
                        <td>{el.balance|| "N/A"}</td>
                        <td
                          style={{
                            height: '14px',
                            width: '14px',
                            stroke: '0.2',
                            cursor: 'pointer',
                          }}
                        >
                          <BiSupport onClick={() => handleIconOpen()} />
                        </td>
                      </tr>
                    )
                  )
                : null}
            </tbody>
          </table>
        </div>

        <div className="page-heading-container">
          <p className="page-heading">
            {startIndex} - {endIndex>count?count:endIndex} of {currentPageData?.length} item
          </p>

          {/* {
            commissionList?.length > 0 ? <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              currentPageData={currentPageData}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
perPage={itemsPerPage}
            /> : null
          } */}
          <PaginationComponent
            currentPage={currentPage1}
            itemsPerPage={pageSize1}
            totalPages={totalPages1}
            onPageChange={handlePageChange}
            handleItemsPerPageChange={handleItemsPerPageChange}
          />
          {openIcon && (
            <HelpDashboard
              commission={editedCommission}
              editMode={editMode}
              handleClose={handleIconClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ArDashBoardTable;
