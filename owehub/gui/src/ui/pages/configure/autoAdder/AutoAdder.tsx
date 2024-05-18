import React, { useEffect, useState } from 'react';
import '../configure.css';
// import CreateCommissionRate from "./CreateCommissionRate";
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { CSVLink } from 'react-csv';
import { ICONS } from '../../../icons/Icons';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { fetchCommissions } from '../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice';

// import FilterCommission from "./FilterCommission";

import CheckBox from '../../../components/chekbox/CheckBox';
import {
  toggleAllRows,
  toggleRowSelection,
} from '../../../components/chekbox/checkHelper';
import Pagination from '../../../components/pagination/Pagination';
import { setCurrentPage } from '../../../../redux/apiSlice/paginationslice/paginationSlice';
import { CommissionModel } from '../../../../core/models/configuration/create/CommissionModel';
import { FaArrowDown } from 'react-icons/fa6';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import CreateAutoAdder from './CreateAutoAdder';
import Loading from '../../../components/loader/Loading';
import { ROUTES } from '../../../../routes/routes';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { AutoAdderColumn } from '../../../../resources/static_data/configureHeaderData/AutoAdderColumn';
import { fetchAutoAdder } from '../../../../redux/apiActions/AutoAdderAction';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import PaginationComponent from '../../../components/pagination/PaginationComponent';
import MicroLoader from '../../../components/loader/MicroLoader';
interface Column {
  name: string;
  displayName: string;
  type: string;
}

const AutoAdder: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const [exportOPen, setExportOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleExportOpen = () => setExportOpen(!exportOPen);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const commissionList = useAppSelector((state) => state.autoadder.data);
  const loading = useAppSelector((state: any) => state.comm.loading);
  const error = useAppSelector((state: any) => state.comm.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCommission, setEditedCommission] =
    useState<CommissionModel | null>(null);
  const itemsPerPage = 5;
  const currentPage = useAppSelector(
    (state: any) => state.paginationType.currentPage
  );
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [pageSize1, setPageSize1] = useState(10); // Set your desired page size here
  // const pageSize = 10;
  const [currentPage1, setCurrentPage1] = useState(1);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage1,
      page_size: pageSize1,
      archived: viewArchived ? true : undefined,
    };
    dispatch(fetchAutoAdder(pageNumber));
  }, [dispatch, currentPage1, viewArchived, pageSize1]);

  const handlePageChange = (page: number) => {
    setCurrentPage1(page);
  };
  const handleItemsPerPageChange = (e: any) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setPageSize1(newItemsPerPage);
    setCurrentPage1(1); // Reset to the first page when changing items per page
  };

  const filter = () => {
    setFilterOpen(true);
  };
  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };
  const pageNumber = {
    page_number: currentPage,
    page_size: itemsPerPage,
  };

  const dbCount = 10;
  const totalPages1 = Math.ceil(dbCount / pageSize1);

  const startIndex = (currentPage - 1) * itemsPerPage +1;
  const endIndex = startIndex * itemsPerPage;
  const handleAddCommission = () => {
    setEditMode(false);
    setEditedCommission(null);
    handleOpen();
  };

  const handleEditCommission = (commission: CommissionModel) => {
    setEditMode(true);
    setEditedCommission(commission);
    handleOpen();
  };

  const currentPageData = commissionList?.slice();
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === commissionList?.length;
  
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
    return (
      <div className="loader-container">
        <Loading />
      </div>
    );
  }
 
  return (
    <div className="comm">
      <Breadcrumb
        head="Commission"
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Autoadder"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Auto Adder"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          viewArchive={viewArchived}
          onpressExport={() => handleExportOpen()}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
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
        {/* {open && <CreateAutoAdder
                         commission={editedCommission}
                         editMode={editMode}
                         handleClose={handleClose}
                          />} */}
        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          <table>
            <thead>
              <tr>
                {AutoAdderColumn.map((item, key) => (
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
                    <p>Action</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {
               loading?
               <tr>
                 <td colSpan={AutoAdderColumn.length}>
                   <div style={{display:"flex",justifyContent:"center"}}>
                     <MicroLoader/>
                   </div>
                 </td>
               </tr>
              : 
              
              currentPageData?.length > 0
                ? currentPageData?.map((el: any, i: any) => (
                    <tr
                      key={i}
                      className={selectedRows.has(i) ? 'selected' : ''}
                    >
                      <td>
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

                          {el.partner}
                        </div>
                      </td>
                      <td>{el.installer}</td>
                      <td>{el.state}</td>
                      <td>{el.sale_type}</td>
                      <td>{el.sale_price}</td>
                      <td>{el.rep_type}</td>
                      <td>{el.rl}</td>
                      <td>{el.rate}</td>
                      <td>{el.state}</td>
                      <td>{el.sale_type}</td>
                      <td>{el.sale_price}</td>
                      <td>{el.rep_type}</td>
                      <td>{el.rl}</td>
                      <td>{el.rate}</td>
                      <td>{el.state}</td>
                      <td>{el.sale_type}</td>
                      <td>{el.sale_price}</td>
                      <td>{el.rep_type}</td>
                      <td>{el.rl}</td>
                      <td>{el.rate}</td>
                      <td>{el.state}</td>
                      <td>{el.sale_type}</td>
                      <td>{el.sale_price}</td>
                      <td>{el.rep_type}</td>
                      <td>{el.rl}</td>
                      <td>{el.rate}</td>
                      <td>{el.sale_price}</td>
                      <td>{el.rep_type}</td>
                      <td>{el.rl}</td>
                      <td>{el.rate}</td>
                      <td>{el.start_date}</td>
                      <td>{el.end_date}</td>
                      <td>
                        <div className="action-icon">
                          <div className="" style={{ cursor: 'pointer' }}>
                            <img src={ICONS.ARCHIVE} alt="" />
                          </div>
                          {/* <div className="" style={{ cursor: "pointer" }} onClick={() => handleEditCommission(el)}>
                        <img src={ICONS.editIcon} alt="" />
                        </div> */}
                        </div>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
        {commissionList?.length > 0 ? (
          <div className="page-heading-container">
           {!!dbCount && <p className="page-heading">
              {startIndex} - {endIndex>dbCount?dbCount:endIndex} of {dbCount} item
            </p>}
            <PaginationComponent
              currentPage={currentPage1}
              itemsPerPage={pageSize1}
              totalPages={totalPages1}
              onPageChange={handlePageChange}
              handleItemsPerPageChange={handleItemsPerPageChange}
            />
            {/* <Pagination
      currentPage={currentPage}
      totalPages={totalPages} 
      paginate={paginate}
      currentPageData={currentPageData}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
    />  */}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AutoAdder;
