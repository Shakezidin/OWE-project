import React, { useEffect, useState } from 'react';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchTimeLineSla } from '../../../../redux/apiSlice/configSlice/config_get_slice/timeLineSlice';
import Pagination from '../../../components/pagination/Pagination';
import { setCurrentPage } from '../../../../redux/apiSlice/paginationslice/paginationSlice';
import { TimeLineSlaModel } from '../../../../core/models/configuration/create/TimeLineSlaModel';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import CreatedArImport from './CreateArImport';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { ARImportColumns } from '../../../../resources/static_data/configureHeaderData/ARImportColumn';
import FilterModal from '../../../components/FilterModal/FilterModal';
import { ROUTES } from '../../../../routes/routes';

const ArImport = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const timelinesla_list = useAppSelector(
    (state) => state.timelineSla.timelinesla_list
  );
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTimeLineSla, setEditedTimeLineSla] =
    useState<TimeLineSlaModel | null>(null);
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const currentPage = useAppSelector(
    (state) => state.paginationType.currentPage
  );
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
    };
    dispatch(fetchTimeLineSla(pageNumber));
  }, [dispatch, currentPage]);

  const filter = () => {
    setFilterOpen(true);
  };

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const commissionList = useAppSelector((state) => state.comm.commissionsList);
  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(timelinesla_list?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentPageData = commissionList?.slice(startIndex, endIndex);
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
    dispatch(fetchTimeLineSla(req));
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
        linkparaSecond="AR Import"
      />
      <div className="commissionContainer">
        <TableHeader
          title="AR Import"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          checked={isAllRowsSelected}
          viewArchive={viewArchived}
          isAnyRowSelected={isAnyRowSelected}
          onpressExport={() => {}}
          onpressAddNew={() => handleTimeLineSla()}
        />
        {filterOPen && (
          <FilterModal
            handleClose={filterClose}
            columns={ARImportColumns}
            page_number={currentPage}
            fetchFunction={fetchFunction}
            page_size={itemsPerPage}
          />
        )}
        {open && (
          <CreatedArImport editMode={editMode} handleClose={handleClose} />
        )}
        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          <table>
            <thead>
              <tr>
                {ARImportColumns?.map((item, key) => (
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
                    <p>Action</p>
                  </div>
                </th>
              </tr>
            </thead>
            {/* <tbody >
            
                  <tr>

                    <td style={{ fontWeight: "500", color: "black" }}>
                      <div className="flex-check">
                      <td>
                        <CheckBox
                          checked={false}
                          onChange={() => {}}
                          // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                        />
                      </td>
                        AMF
                      </div>
                    </td>
                    <td>Leader Name</td>
                    <td>Type</td>
                    <td>Term</td>
                    <td>Qual</td>
                    <td>Sales Q</td>
                    <td>Team kW Q</td>
                    <td>Pay Rate</td>
                    <td>Start</td>
                    <td>End</td>
                    
                    <td

                    >
                      <div className="action-icon">
                        <div className="">
                          <img src={ICONS.ARCHIVE} alt="" />
                        </div>
                        <div className=""  style={{ cursor: "pointer" }}>
                          <img src={ICONS.editIcon} alt="" />
                        </div>
                      </div>
                    </td>
                  </tr>
                
                 
            </tbody> */}
          </table>
        </div>
        <div className="page-heading-container">
          <p className="page-heading">
            {currentPage} - {totalPages} of {currentPageData?.length} item
          </p>

          {timelinesla_list?.length > 0 ? (
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

export default ArImport;
