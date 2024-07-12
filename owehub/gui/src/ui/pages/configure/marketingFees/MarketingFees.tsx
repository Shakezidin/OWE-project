import React, { useEffect, useState } from 'react';
import '../configure.css';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { ICONS } from '../../../icons/Icons';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { fetchmarketingFees } from '../../../../redux/apiSlice/configSlice/config_get_slice/marketingSlice';
import CreateMarketingFees from './CreateMarketingFees';
import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import { MarketingFeeModel } from '../../../../core/models/configuration/create/MarketingFeeModel';

import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import Pagination from '../../../components/pagination/Pagination';
import { MarketingFeesColumn } from '../../../../resources/static_data/configureHeaderData/MarketingFeeColumn';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import FilterModal from '../../../components/FilterModal/FilterModal';
import Loading from '../../../components/loader/Loading';
import DataNotFound from '../../../components/loader/DataNotFound';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import Swal from 'sweetalert2';
import { ROUTES } from '../../../../routes/routes';
import {
  errorSwal,
  showAlert,
  successSwal,
} from '../../../components/alert/ShowAlert';
import MicroLoader from '../../../components/loader/MicroLoader';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import { dateFormat } from '../../../../utiles/formatDate';

const MarketingFees: React.FC = () => {
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filterClose = () => setFilterOpen(false);
  const marketingFeesList = useAppSelector(
    (state) => state.marketing.marketing_fees_list
  );
  const { loading, totalCount } = useAppSelector((state) => state.marketing);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedMarketing, setEditedMarketing] =
    useState<MarketingFeeModel | null>(null);
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterModel[]>([]);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived ? true : undefined,
      filters,
    };
    dispatch(fetchmarketingFees(pageNumber));
  }, [dispatch, currentPage, viewArchived, filters]);

  const handleAddMarketing = () => {
    setEditMode(false);
    setEditedMarketing(null);
    handleOpen();
  };

  const handleEditMarketing = (marketingData: MarketingFeeModel) => {
    setEditMode(true);
    setEditedMarketing(marketingData);
    handleOpen();
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

  const filter = () => {
    setFilterOpen(true);
  };
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = startIndex * itemsPerPage;
  const currentPageData = marketingFeesList?.slice();
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === marketingFeesList?.length;
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
    const confirmed = await showAlert(
      'Are Your Sure',
      'This Action will archive your selected rows.',
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
          archived: viewArchived,
        };

        const res = await postCaller("update_marketingfee_archive", newValue);
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchmarketingFees(pageNumber));

          setSelectAllChecked(false);
          setSelectedRows(new Set());
          await successSwal('Archived', 'The data has been archived ');
        } else {
          await errorSwal('Failed', 'Something went wrong');
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
        archived: viewArchived 

      };
      const res = await postCaller("update_marketingfee_archive", newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(fetchmarketingFees(pageNumber));
        setSelectedRows(new Set())
        setSelectAllChecked(false);
        await successSwal('Archived', 'The data has been archived ');
      } else {
        await errorSwal('Failed', 'Something went wrong');
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
    setCurrentPage(1)
    setFilters(req.filters)
  };

  return (
    <div className="comm">
      <Breadcrumb
        head="Commission"
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Marketing Fees"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Marketing Fees"
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onPressViewArchive={() => handleViewArchiveToggle()}
          onPressArchive={() => handleArchiveAllClick()}
          viewArchive={viewArchived}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleAddMarketing()}
        />
        {filterOPen && (
          <FilterModal
            handleClose={filterClose}
            columns={MarketingFeesColumn}
            page_number={currentPage}
            fetchFunction={fetchFunction}
            page_size={itemsPerPage}
          />
        )}
        {open && (
          <CreateMarketingFees
            marketingData={editedMarketing}
            editMode={editMode}
            page_number={currentPage}
            page_size={itemsPerPage}
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
                {MarketingFeesColumn.map((item, key) => (
                  <SortableHeader
                    key={key}
                    isCheckbox={item.isCheckbox}
                    titleName={item.displayName}
                    data={marketingFeesList}
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
                  <td colSpan={MarketingFeesColumn.length}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <MicroLoader />
                    </div>
                  </td>
                </tr>
              ) : currentPageData?.length > 0 ? (
                currentPageData?.map((el: any, i: any) => (
                  <tr key={i} className={ selectedRows.has(i)? `selected`:""}>
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
                        {el.source}
                      </div>
                    </td>
                    <td>{el.dba?.trim?.()||"N/A"}</td>
                    <td>{el.state ||"N/A"}</td>
                    <td>{el.fee_rate ||"N/A"}</td>
                    <td>
                      {el.chg_dlr?.trim?.() ||"N/A"}
                      {/* <div className="">
                      <img src={img} alt="" />
                    </div> */}
                    </td>
                    <td>{el.pay_src?.trim?.() ||"N/A"}</td>
                    <td>{el.description?.trim?.() ||"N/A"}</td>
                    <td>{dateFormat(el.start_date)}</td>
                    <td>{dateFormat(el.end_date)} </td>
                    <td>
                      
                    {!viewArchived && selectedRows.size<2 && (
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
                            onClick={() => handleEditMarketing(el)}
                          >
                            <img src={ICONS.editIcon} alt="" />
                            {/* <span className="tooltiptext">Edit</span> */}
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
        {marketingFeesList?.length > 0 ? (
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
        ) : null}
      </div>
    </div>
  );
};

export default MarketingFees;
