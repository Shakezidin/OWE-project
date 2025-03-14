import React, { useEffect, useState } from 'react';
import '../configure.css';
import CreateDealer from './CreateDealer';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import TableHeader from '../../../components/tableHeader/TableHeader';
import { fetchDealer } from '../../../../redux/apiSlice/configSlice/config_get_slice/dealerSlice';
import { DealerModel } from '../../../../core/models/configuration/create/DealerModel';
import Pagination from '../../../components/pagination/Pagination';
import { DealerTableData } from '../../../../resources/static_data/configureHeaderData/DealerTableData';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import DataNotFound from '../../../components/loader/DataNotFound';
import Loading from '../../../components/loader/Loading';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import { showAlert, successSwal } from '../../../components/alert/ShowAlert';
import FilterHoc from '../../../components/FilterModal/FilterHoc';
import MicroLoader from '../../../components/loader/MicroLoader';
import { FilterModel } from '../../../../core/models/data_models/FilterSelectModel';
import { dateFormat } from '../../../../utiles/formatDate';
import { configPostCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { checkLastPage } from '../../../../utiles';
import { toast } from 'react-toastify';
import Papa from 'papaparse';

const DealerOverRides: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();

  const error = useAppSelector((state) => state.dealer.error);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const itemsPerPage = 10;
  const [sortKey, setSortKey] = useState('');
  const [data, setData] = useState<any>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isExportingData, setIsExporting] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [editedDealer, setEditDealer] = useState<DealerModel | null>(null);
  const [filters, setFilters] = useState<FilterModel[]>([]);
  const [dealer, setDealer] = useState<{ [key: string]: any }>({});

  const handleExportOpen = () => {
    exportCsv();
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
  const handleAddDealer = () => {
    setEditMode(false);
    setEditDealer(null);
    handleOpen();
  };

  const filter = () => {
    setFilterOpen(true);
  };
  const handleEditDealer = (dealerData: DealerModel) => {
    setEditMode(true);
    setEditDealer(dealerData);
    handleOpen();
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await configPostCaller('get_dealeroverride', {
          page_number: currentPage,
          page_size: itemsPerPage,
          filters,
        });

        if (data.status > 201) {
          toast.error(data.message);
          setLoading(false);
          return;
        }
        setData(data?.data?.DealerOverrideData);
        setTotalCount(data.dbRecCount);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
      }
    })();
  }, [currentPage, viewArchived, filters]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const currentPageData = data?.slice();
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === data?.length;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;

  const endIndex = currentPage * itemsPerPage;
  const handleSort = (key: any) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortDirection('asc');
    }
    setSortKey(key);
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
        (index) => data[index].record_id
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
          setSelectAllChecked(false);
          setSelectedRows(new Set());

          dispatch(fetchDealer(pageNumber));
          checkLastPage(
            currentPage,
            totalPages,
            setCurrentPage,
            selectedRows.size,
            currentPageData.length
          );

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
        dispatch(fetchDealer(pageNumber));
        setSelectAllChecked(false);
        setSelectedRows(new Set());
        checkLastPage(
          currentPage,
          totalPages,
          setCurrentPage,
          selectedRows.size,
          currentPageData.length
        );
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
    setCurrentPage(1);
    setFilters(req.filters);
  };
  if (error) {
    return (
      <div className="loader-container">
        <Loading />
      </div>
    );
  }
  const notAllowed = selectedRows.size > 1;

  const exportCsv = async () => {
    // Define the headers for the CSV
    // Function to remove HTML tags from strings
    const removeHtmlTags = (str: any) => {
      if (!str) return '';
      return str.replace(/<\/?[^>]+(>|$)/g, '');
    };
    setIsExporting(true);
    const exportData = await configPostCaller('get_dealeroverride', {
      page_number: 1,
      page_size: totalCount,
    });
    if (exportData.status > 201) {
      toast.error(exportData.message);
      return;
    }

    const headers = [
      'Sub Dealer',
      'Dealer',
      'Pay Rate',
      'State',
      'Start Date',
      'End Date',
    ];

    const csvData = exportData?.data?.DealerOverrideData?.map?.((item: any) => [
      item.sub_dealer,
      item.dealer,
      item.pay_rate,
      item.state,
      item.start_date,
      item.end_date,
    ]);

    const csvRows = [headers, ...csvData];

    const csvString = Papa.unparse(csvRows);

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'dealeroverride.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExporting(false);
  };
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Dealer OverRides"
          onPressViewArchive={() => {
            handleViewArchiveToggle();
            setCurrentPage(1);
            setSelectAllChecked(false);
            setSelectedRows(new Set());
          }}
          onPressArchive={() => handleArchiveAllClick()}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          viewArchive={viewArchived}
          checked={isAllRowsSelected}
          isAnyRowSelected={isAnyRowSelected}
          onpressExport={() => handleExportOpen()}
          onpressAddNew={() => handleAddDealer()}
          isExportingData={isExportingData}
        />

        <FilterHoc
          resetOnChange={viewArchived}
          isOpen={filterOPen}
          handleClose={filterClose}
          columns={DealerTableData}
          fetchFunction={fetchFunction}
          page_number={currentPage}
          page_size={itemsPerPage}
        />

        {open && (
          <CreateDealer
            handleClose={handleClose}
            dealerData={editedDealer}
            editMode={editMode}
            page_number={currentPage}
            dealer={dealer}
            page_size={itemsPerPage}
          />
        )}
        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap', height: '65vh' }}
        >
          <table>
            <thead>
              <tr>
                {DealerTableData.map((item, key) => (
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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={DealerTableData.length}>
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
                        {el.sub_dealer || 'N/A'}
                      </div>
                    </td>
                    <td>{el.dealer || 'N/A'}</td>
                    <td>{el.pay_rate || 'N/A'}</td>
                    <td>{el.state?.trim?.() || 'N/A'}</td>
                    <td>{dateFormat(el.start_date) || 'N/A'}</td>
                    <td>
                      {!el.end_date || new Date(el.end_date).getFullYear() === 1
                        ? 'N/A'
                        : dateFormat(el.end_date)}
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

        {data?.length > 0 ? (
          <div className="page-heading-container">
            <p className="page-heading">
              Showing {startIndex} -{' '}
              {endIndex > totalCount ? totalCount : endIndex} of {totalCount}{' '}
              item
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

export default DealerOverRides;
