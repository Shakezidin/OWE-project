import React, { useEffect, useState } from 'react';
import '../../configure/configure.css';
import { FaArrowDown } from 'react-icons/fa6';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { fetchCommissions } from '../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice';
import { setCurrentPage } from '../../../../redux/apiSlice/paginationslice/paginationSlice';
import { DealerModel } from '../../../../core/models/configuration/create/DealerModel';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import DataTableHeaderr from '../../../components/tableHeader/DataTableHeaderr';
import CheckBox from '../../../components/chekbox/CheckBox';
import {
  toggleAllRows,
  toggleRowSelection,
} from '../../../components/chekbox/checkHelper';
import FilterData from './FilterData';
import { Column } from '../../../../core/models/data_models/FilterSelectModel';
import Pagination from '../../../components/pagination/Pagination';
import { DataTableColumn } from '../../../../resources/static_data/DataTableColumn';
import FilterModal from '../../../components/FilterModal/FilterModal';
import { getAnyTableData } from '../../../../redux/apiActions/dataTableAction';
import { Tooltip as ReactTooltip } from 'react-tooltip';

interface RowData {
  [key: string]: string | number | null; // Define possible data types for table cells
}

const DataTablle: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<any>('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const data: RowData[] = useAppSelector(
    (state) => state.dataTableSlice.tableData
  );
  const { dbCount, option } = useAppSelector((state) => state.dataTableSlice);
  const loading = useAppSelector((state) => state.dealer.loading);
  const error = useAppSelector((state) => state.dealer.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);


  const [openTooltipIndex, setOpenTooltipIndex] = useState<number | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openTooltipIndex !== null && !(event.target as HTMLElement).closest(`[data-tooltip-id="tooltip-${openTooltipIndex}"]`)) {
        setOpenTooltipIndex(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openTooltipIndex]);

  const countWords = (str: string): number => {
    return str.trim().split(/\s+/).length;
  };


  const currentPage = useAppSelector(
    (state) => state.paginationType.currentPage
  );
  const itemsPerPage = 30;
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = currentPage * itemsPerPage;
  console.log(currentPage * itemsPerPage, "", itemsPerPage);

  useEffect(() => {
    if (selectedTable.value) {
      const pageNumber = {
        page_number: currentPage,
        page_size: itemsPerPage,
        filters: [
          {
            Column: 'table_name',
            Operation: '=',
            Data: selectedTable.value,
          },
        ],
      };
      dispatch(getAnyTableData(pageNumber));
    }
  }, [dispatch, currentPage, selectedTable]);

  useEffect(() => {
    if (option.length) {
      setSelectedTable({
        label: option?.[0].table_name,
        value: option?.[0].table_name,
      });
    }
  }, [option?.length]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };

  const filter = () => {
    setFilterOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const propertyNames: string[] = data?.length > 0 ? Object.keys(data[0]) : [];
  const orderedColumns: string[] = propertyNames.reverse();

  const replaceEmptyOrNull = (value: string | number | null) => {
    return value === null || value === '' ? 'N/A' : value;
  };

  const totalPages = Math.ceil(dbCount / itemsPerPage);
  return (
    <div className="commissionContainer">
      <DataTableHeaderr
        title={selectedTable.value?.replaceAll('_', ' ')}
        onPressFilter={() => { }}
        onPressImport={() => { }}
        showImportIcon={false}
        showSelectIcon={true}
        showFilterIcon={false}
        selectMarginLeft="-10px"
        selectMarginLeft1="-20px"
        selectedTable={selectedTable}
        setSelectedTable={setSelectedTable}
      />
      <div className="TableContainer" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              {orderedColumns?.map?.((columnName, index) => (
                <th style={{ textTransform: 'capitalize' }} key={index}>
                  {columnName?.replaceAll?.('_', ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map?.((item, rowIndex) => (
              <tr key={rowIndex}>
                <td>{startIndex + rowIndex + 1}</td>
                {orderedColumns.map((columnName, colIndex) => (
                  <td key={colIndex}>
                    {columnName === 'status' ? (
                      item[columnName] === 'Active' ? (
                        <span style={{ color: '#15C31B' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#15C31B',
                              marginRight: '5px',
                            }}
                          ></span>
                          Active
                        </span>
                      ) : (
                        <span style={{ color: '#F82C2C' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#F82C2C',
                              marginRight: '5px',
                            }}
                          ></span>
                          Inactive
                        </span>
                      )
                    ) : columnName === 'details' ? (
                      <>
                        {item.details ? (
                          typeof item.details === 'string' ? (
                            <>
                              {item.details.length > 5 ? (
                                <>
                                  {item.details.slice(0, 5)}...
                                  <button
                                    onClick={() => setOpenTooltipIndex(openTooltipIndex === rowIndex ? null : rowIndex)}
                                    data-tooltip-id={`tooltip-${rowIndex}`}
                                    data-tooltip-content={item.details}
                                    data-tooltip-place="bottom"
                                    style={{
                                      marginLeft: '5px',
                                      border: 'none',
                                      background: 'none',
                                      color: openTooltipIndex === rowIndex ? '#F82C2C' : '#3083e5',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {openTooltipIndex === rowIndex ? 'Show less' : 'Show more'}
                                  </button>
                                  <ReactTooltip
                                    id={`tooltip-${rowIndex}`}
                                    className="custom-tooltip"
                                    isOpen={openTooltipIndex === rowIndex}
                                  />
                                </>
                              ) : (
                                item.details
                              )}
                            </>
                          ) : (
                            item.details.toString()
                          )
                        ) : (
                          replaceEmptyOrNull(item[columnName])
                        )}
                      </>
                    ) : (
                      replaceEmptyOrNull(item[columnName])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="page-heading-container">
        <p className="page-heading">
          {start} - {end > dbCount ? dbCount : end} of {dbCount} item
        </p>
        {data?.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
            currentPageData={data}
            goToNextPage={goToNextPage}
            goToPrevPage={goToPrevPage}
            perPage={itemsPerPage}
          />
        ) : null}
      </div>
    </div>
  );
};



export default DataTablle;
