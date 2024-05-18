import React, { useEffect, useState } from 'react';

import { RiDeleteBin5Line } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';
import { IoAddSharp } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';

import TableHeader from '../../../components/tableHeader/TableHeader';
import { ICONS } from '../../../icons/Icons';
import { fetchDealerTier } from '../../../../redux/apiSlice/configSlice/config_get_slice/dealerTierSlice';
import CreateDealerTier from './CreateDealerTier';
import CheckBox from '../../../components/chekbox/CheckBox';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import { DealerTierModel } from '../../../../core/models/configuration/create/DealerTierModel';
import { setCurrentPage } from '../../../../redux/apiSlice/paginationslice/paginationSlice';
import Pagination from '../../../components/pagination/Pagination';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import { DealerTierColumn } from '../../../../resources/static_data/configureHeaderData/DealerTierColumn';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import FilterModal from '../../../components/FilterModal/FilterModal';
import DataNotFound from '../../../components/loader/DataNotFound';
import Loading from '../../../components/loader/Loading';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import Swal from 'sweetalert2';
import { ROUTES } from '../../../../routes/routes';
import { showAlert, successSwal } from '../../../components/alert/ShowAlert';
const DealerTier = () => {
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterClose = () => setFilterOpen(false);
  const dealerTierList = useAppSelector(
    (state) => state.dealerTier.dealers_tier_list
  );
  const dbCount = useAppSelector((state) => state.dealerTier.dbCount);
  const loading = useAppSelector((state) => state.dealerTier.loading);
  const error = useAppSelector((state) => state.dealerTier.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedDealerTier, setEditedDealerTier] =
    useState<DealerTierModel | null>(null);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived ? true : undefined,
    };
    dispatch(fetchDealerTier(pageNumber));
  }, [dispatch, currentPage, viewArchived]);
  console.log(dealerTierList);

  const filter = () => {
    setFilterOpen(true);
  };
  const handleAddDealerTier = () => {
    setEditMode(false);
    setEditedDealerTier(null);
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
  const totalPages = Math.ceil(dbCount / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;

  const endIndex = currentPage * itemsPerPage;
  const handleEditDealerTier = (editDealerTier: DealerTierModel) => {
    setEditMode(true);
    setEditedDealerTier(editDealerTier);
    handleOpen();
  };
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === dealerTierList.length;
  const currentPageData = dealerTierList?.slice();
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
      'This Action will archive your data',
      'Yes',
      'No'
    );
    if (confirmed) {
      const archivedRows = Array.from(selectedRows).map(
        (index) => dealerTierList[index].record_id
      );
      if (archivedRows.length > 0) {
        const newValue = {
          record_id: archivedRows,
          is_archived: true,
        };

        const pageNumber = {
          page_number: currentPage,
          page_size: itemsPerPage,
        };

        const res = await postCaller(EndPoints.update_dealer_archive, newValue);
        if (res.status === HTTP_STATUS.OK) {
          // If API call is successful, refetch commissions
          dispatch(fetchDealerTier(pageNumber));
          const remainingSelectedRows = Array.from(selectedRows).filter(
            (index) => !archivedRows.includes(dealerTierList[index].record_id)
          );
          const isAnyRowSelected = remainingSelectedRows.length > 0;
          setSelectAllChecked(isAnyRowSelected);
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
      };
      const res = await postCaller(EndPoints.update_dealer_archive, newValue);
      if (res.status === HTTP_STATUS.OK) {
        dispatch(fetchDealerTier(pageNumber));
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
  };
  const fetchFunction = (req: any) => {
    dispatch(fetchDealerTier(req));
  };
  if (error) {
    return (
      <div className="loader-container">
        <Loading />
      </div>
    );
  }
  if (loading) {
    return (
      <div className="loader-container">
        <Loading /> {loading}
      </div>
    );
  }

  return (
    <div className="comm">
      <Breadcrumb
        head="Commission"
        linkPara="Configure"
        route={ROUTES.CONFIG_PAGE}
        linkparaSecond="Dealer Tier"
      />
      <div className="commissionContainer">
        <TableHeader
          title="Dealer Tier"
          onPressViewArchive={() => handleViewArchiveToggle()}
          onPressArchive={() => handleArchiveAllClick()}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          viewArchive={viewArchived}
          onpressExport={() => {}}
          onpressAddNew={() => handleAddDealerTier()}
        />
        {filterOPen && (
          <FilterModal
            handleClose={filterClose}
            columns={DealerTierColumn}
            fetchFunction={fetchFunction}
            page_number={currentPage}
            page_size={itemsPerPage}
          />
        )}
        {open && (
          <CreateDealerTier
            handleClose={handleClose}
            editDealerTier={editedDealerTier}
            editMode={editMode}
            page_number={currentPage}
            page_size={itemsPerPage}
          />
        )}
        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          <table>
            <thead>
              <tr>
                {DealerTierColumn?.map((item, key) => (
                  <SortableHeader
                    key={key}
                    isCheckbox={item.isCheckbox}
                    titleName={item.displayName}
                    data={dealerTierList}
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
              {currentPageData?.length > 0 ? (
                currentPageData?.map((el: any, i: any) => (
                  <tr key={i}>
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
                        {el.dealer_name}
                      </div>
                    </td>
                    <td>{el.tier}</td>
                    <td>{el.start_date}</td>
                    <td>{el.end_date}</td>
                    {viewArchived === true ? null : (
                      <td>
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
                            onClick={() => handleEditDealerTier(el)}
                          >
                            <img src={ICONS.editIcon} alt="" />
                            {/* <span className="tooltiptext">Edit</span> */}
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr style={{ border: 0 }}>
                  <td colSpan={10}>
                    <div className="data-not-found">
                      <DataNotFound />
                      <h2>Data Not Found</h2>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {dealerTierList?.length > 0 ? (
          <div className="page-heading-container">
            <p className="page-heading">
              {startIndex} - {endIndex>dbCount?dbCount:endIndex} of {dbCount} item
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

export default DealerTier;
