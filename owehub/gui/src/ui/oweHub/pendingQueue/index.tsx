import React, { useEffect, useState } from 'react';
import styles from './styles/index.module.css';
import Input from '../../components/text_input/Input';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { AiFillMinusCircle, AiFillCheckCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Pagination from '../../components/pagination/Pagination';
import { Link } from 'react-router-dom';
import MicroLoader from '../../components/loader/MicroLoader';
import DataNotFound from '../../components/loader/DataNotFound';
import { useDebounce } from '../../../hooks/useDebounce';
import { Tooltip } from 'react-tooltip';
import FilterHoc from '../../components/FilterModal/FilterHoc';
import { ICONS } from '../../../resources/icons/Icons';
import PendingActionColumn from '../../../resources/static_data/PendingActionColumn';
import { MdDownloading } from 'react-icons/md';
import { LuImport } from 'react-icons/lu';
import PendModal from './PendModal';
import SortableHeader from '../../components/tableHeader/SortableHeader';
import { FilterModel } from '../../../core/models/data_models/FilterSelectModel';
import Papa from 'papaparse';
import moment from 'moment';
import { BiSolidMessageDetail } from 'react-icons/bi';

const PendingQueue = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);
  const [active, setActive] = useState<'all' | 'ntp' | 'co' | 'qc'>('ntp');
  const [loading, setLoading] = useState(false);
  const [tileData, setTileData] = useState<any>('');
  const [load, setLoad] = useState(false);
  const [dataPending, setDataPending] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalcount, setTotalcount] = useState(0);
  const [pre, setPre] = useState(false);
  const itemsPerPage = 10;
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortKey, setSortKey] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportingData, setIsExporting] = useState(false);
  const [exportShow, setExportShow] = useState<boolean>(false);
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const [filters, setFilters] = useState<FilterModel[]>([]);

  const openModal = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    (async () => {
      setLoad(true);
      try {
        const data = await postCaller('get_pendingqueuestiledata', {});

        if (data.status > 201) {
          toast.error(data.message);
          return;
        }
        setTileData(data.data);
        setLoad(false);
      } catch (error) {
        console.error(error);
      } finally {
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await postCaller('get_new_pendingqueuesdata', {
          page_size: debouncedSearch ? 10 : itemsPerPage,
          page_number: debouncedSearch ? 1 : page,
          selected_pending_stage: active,
          unique_ids: [debouncedSearch],
          filters,
        });
        if (data.status > 201) {
          toast.error(data.message);
          return;
        }

        setDataPending(data.data);
        setTotalcount(data?.dbRecCount || 0);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
      }
    })();
  }, [page, itemsPerPage, debouncedSearch, active, filters]);

  const totalPages = Math.ceil(totalcount / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = page * itemsPerPage;

  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const filterClose = () => {
    setFilterModal(false);
  };
  const fetchFunction = (req: any) => {
    setPage(1);
    setFilters(req.filters);
  };

  const open = () => {
    setFilterModal(true);
  };

  const cuurentPageData = Array.isArray(dataPending) ? dataPending.slice() : [];

  const formatDate = (dateString: any) => {
    if (!dateString) return '-'; // Handle empty/null values
    const formattedDate = moment(
      dateString,
      ['YYYY-MM-DD', 'DD-MM-YYYY', 'MM-DD-YYYY'],
      true
    );
    return formattedDate.isValid() ? formattedDate.format('MM-DD-YYYY') : '-'; // Format as MM-DD-YYYY
  };

  const ExportCsv = async () => {
    setIsExporting(true);

    const headers =
      active === 'co'
        ? [
            'Project ID',
            'Home Owner',
            'Project Ages',
            'CO Status',
            'Sold Date',
            'App Status',
            'Project Status',
            'Sales Rep',
            'Setter',
            'Deal Type',
            'NTP Date',
          ]
        : [
            'Project ID',
            'Home Owner',
            'Project Ages',
            'Production',
            'Finance NTP',
            'Utility Bill',
            'Power Clerk',
            'Sold Date',
            'App Status',
            'Project Status',
            'Sales Rep',
            'Setter',
            'Deal Type',
            'NTP Date',
          ];

    const getAllData = await postCaller('get_new_pendingqueuesdata', {
      page_size: totalcount,
      page_number: debouncedSearch ? 1 : page,
      selected_pending_stage: active,
      unique_ids: [debouncedSearch],
      isExport: true,
    });

    if (getAllData.status > 201) {
      toast.error(getAllData.message);
      return;
    }

    const csvData = getAllData?.data?.map?.((item: any) =>
      active === 'co'
        ? [
            item.uninque_id,
            item.home_owner,
            item.co.project_age_days,
            item.co.co,
            item.co.sold_date,
            item.co.app_status,
            item.co.project_status,
            item.co.sales_rep,
            item.co.setter,
            item.co.deal_type,
            item.co.ntp_date,
          ]
        : [
            item.uninque_id,
            item.home_owner,
            item.ntp.project_age_days,
            item.ntp.production,
            item.ntp.finance_NTP,
            item.ntp.utility_bill,
            item.ntp.powerclerk,
            item.ntp.sold_date,
            item.ntp.app_status,
            item.ntp.project_status,
            item.ntp.sales_rep,
            item.ntp.setter,
            item.ntp.deal_type,
            item.ntp.ntp_date,
          ]
    );

    const csvRows = [headers, ...csvData];

    const csvString = Papa.unparse(csvRows);

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'PendingAction.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
    setExportShow(false);
  };

  const filteredColumns =
    active === 'co'
      ? [
          PendingActionColumn[0],
          {
            name: 'co_status',
            displayName: 'CO Status',
            type: 'string',
            isCheckbox: false,
            filter: 'co_status',
          },
          ...PendingActionColumn.slice(1).filter(
            (item) =>
              ![
                'production',
                'finance_NTP',
                'utility_bill',
                'powerclerk',
              ].includes(item.name)
          ),
        ]
      : PendingActionColumn;

  const handleSort = (key: any) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  if (sortKey) {
    console.log(sortKey, 'ejghefe');
    cuurentPageData.sort((a: any, b: any) => {
      const aValue =
        sortKey === 'uninque_id'
          ? a[sortKey]
          : active === 'ntp'
            ? a.ntp[sortKey]
            : a.co[sortKey];
      const bValue =
        sortKey === 'uninque_id'
          ? b[sortKey]
          : active === 'ntp'
            ? b.ntp[sortKey]
            : b.co[sortKey];

      console.log(a[sortKey], cuurentPageData, 'shgdhs');
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

  const formattedFilters = filters
    ? filters.map((filter) => {
        if (filter.Column === 'jeopardy_date') {
          return {
            column: 'jeopardy_date',
            operation: filter.Data !== 'yes' ? 'isnull' : 'isnotnull',
          };
        } else if (filter.start_date !== '' && filter.end_date !== '') {
          return {
            column: filter.Column,
            operation: 'btw',
            start_date: filter.start_date,
            end_date: filter.end_date,
          };
        } else if (filter.data1 !== '' && filter.data2 !== '') {
          return {
            column: filter.Column,
            operation: 'btw',
            Data: [filter.data1, filter.data2],
          };
        } else {
          return {
            column: filter.Column,
            operation: filter.Operation,
            data: filter.Data,
          };
        }
      })
    : [];

  const getProjectColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      hold: '#E6B800',
      'hold - co needed': '#E60073',
      'hold - exceptions': '#E60073',
      cancel: '#E60073',
      active: '#009973',
      duplicate: '#009973',
      "pto'd (audit)": '#009973',
      "pto'd (service)": '#009973',
      "pto'd": '#0073E6',
      jeopardy: '#FF6600',
      unresponsive: '#8000FF',
      arm: '#E60073',
      'legal - customer has an attorney involved': '#FF3333',
    };

    return colorMap[status.toLowerCase()] || '#292b2e';
  };

  return (
    <>
      <FilterHoc
        isOpen={filterModal}
        handleClose={filterClose}
        resetOnChange={active === 'ntp' ? false : true}
        columns={
          active === 'co'
            ? (() => {
                const filteredColumns = PendingActionColumn.filter(
                  (col) =>
                    !['utility_bill', 'powerclerk', 'finance_NTP'].includes(
                      col.name
                    )
                );

                return [
                  filteredColumns[0],
                  {
                    name: 'co_request',
                    displayName: 'CO Status',
                    type: 'string',
                    isCheckbox: false,
                    filter: 'co_request',
                  },
                  ...filteredColumns.slice(1),
                ];
              })()
            : PendingActionColumn
        }
        page_number={page}
        page_size={20}
        fetchFunction={fetchFunction}
        isNew={true}
      />
      <div
        style={{ borderRadius: 16 }}
        className="flex items-center bg-white px2 justify-between"
      ></div>
      {
        <div
          className={` ${pre ? styles.grid_3 : styles.grid_2} ${styles.pending_card_wrapper}`}
        >
          {load ? (
            <div
              style={{ gridTemplateColumns: '1/4' }}
              className="flex items-center justify-center"
            >
              <MicroLoader />
            </div>
          ) : (
            <>
              <div
                className={styles.pending_card}
                onClick={() => {
                  setActive('ntp'), setPage(1), setSearch('');
                }}
              >
                <div
                  className={` ${styles.disbaled_card} ${active === 'ntp' ? styles.active_card : styles.pending_card_hover} ${styles.pending_card_inner}`}
                >
                  <h5 className={styles.pending_stats}>
                    {tileData.ntp_pending_count || '0'}
                  </h5>
                  <div style={{ lineHeight: '1.2rem' }}>
                    <h5
                      className={styles.pending_card_title}
                      style={{ fontWeight: 500 }}
                    >
                      NTP Pending
                    </h5>
                    <p className={styles.pending_card_desc}>
                      Click to see all pending actions in NTP
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={styles.pending_card}
                onClick={() => {
                  setActive('co'), setPage(1), setSearch('');
                }}
              >
                <div
                  className={` ${active === 'co' ? styles.active_card : styles.pending_card_hover} ${styles.pending_card_inner}`}
                >
                  <h5 className={styles.pending_stats}>
                    {tileData.co_pending_count || '0'}
                  </h5>
                  <div style={{ lineHeight: '1.2rem' }}>
                    <h5
                      className={styles.pending_card_title}
                      style={{ fontWeight: 500 }}
                    >
                      C/O Pending
                    </h5>
                    <p className={styles.pending_card_desc}>
                      Click to see all pending actions in C/O
                    </p>
                  </div>
                </div>
              </div>
              {pre && (
                <div
                  className={styles.pending_card}
                  onClick={
                    pre
                      ? () => {
                          setActive('qc');
                          setPage(1);
                          setSearch('');
                        }
                      : undefined
                  }
                >
                  <div
                    className={` ${pre ? '' : styles.disabled_card} ${active === 'qc' ? styles.active_card : pre ? styles.pending_card_hover : ''} ${styles.pending_card_inner}`}
                  >
                    {pre && (
                      <h5 className={styles.pending_stats}>
                        {tileData.qc_pending_count || '0'}
                      </h5>
                    )}
                    <div style={{ lineHeight: '1.2rem' }}>
                      <h5
                        className={styles.pending_card_title}
                        style={{ fontWeight: 500 }}
                      >
                        QC Pending
                      </h5>
                      <p className={styles.pending_card_desc}>
                        Click to see all pending actions in QC
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      }

      <div
        className="project-container pend-actions-cont"
        style={{ marginTop: '1.2rem', padding: 0 }}
      >
        <div className="performance-table-heading">
          <div
            className={`flex  py2 items-center justify-between ${styles.pending_queue_table_header}`}
          >
            <div className={styles.pendingQueHead}>
              <h3
                className={` ${styles.table_heading}`}
                style={{ fontWeight: 600, fontSize: 16 }}
              >
                {active === 'qc'
                  ? 'QC Checklist'
                  : active === 'ntp'
                    ? 'NTP Checklist'
                    : 'C/O Status'}
              </h3>
              <div
                className={`performance-box-container ${styles.pendingBoxContainer}`}
                style={{ padding: '0.7rem 1rem' }}
              >
                <p className="status-indicator">Checklist Indicators</p>
                <div className="progress-box-body">
                  <div
                    className="progress-box"
                    style={{ background: '#2EAF71', borderRadius: '2px' }}
                  ></div>
                  <p>Completed</p>
                </div>
                <div className="progress-box-body">
                  <div
                    className="progress-box"
                    style={{ background: '#EBA900', borderRadius: '2px' }}
                  ></div>
                  <p>Pending OWE</p>
                </div>
                <div className="progress-box-body">
                  <div
                    className="progress-box"
                    style={{ background: '#E14514', borderRadius: '2px' }}
                  ></div>
                  <p>Sale Rep Action Required</p>
                </div>
              </div>
            </div>
            <div className={styles.search_wrapper}>
              <Input
                type="text"
                placeholder="Search for Unique ID or Name"
                value={search}
                name="Search for Unique ID or Name"
                onChange={(e) => {
                  const input = e.target.value;
                  // Allow only alphanumeric and spaces
                  const regex = /^[a-zA-Z0-9\s]*$/;

                  if (regex.test(input)) {
                    // Only update state if input is valid
                    setSearch(input);
                  }
                }}
              />
              <div
                className="filter-line relative"
                onClick={open}
                style={{ backgroundColor: '#377cf6', marginTop: '5.5px' }}
                data-tooltip-id="pend-action-filter"
              >
                <img
                  src={ICONS.FILTERACTIVE}
                  height={15}
                  width={15}
                  alt="pending actions table filter"
                />

                <Tooltip
                  style={{
                    zIndex: 103,
                    background: '#f7f7f7',
                    color: '#000',
                    fontSize: 12,
                    paddingBlock: 4,
                    fontWeight: '400',
                  }}
                  offset={8}
                  id="pend-action-filter"
                  place="top"
                  content="Filter"
                  className="filter-line"
                />
                {formattedFilters && formattedFilters.length > 0 && (
                  <span
                    className="absolute"
                    style={{
                      border: '1px solid #fff',
                      borderRadius: '50%',
                      backgroundColor: '#2DC74F',
                      width: 8,
                      height: 8,
                      top: 0,
                      right: -2,
                    }}
                  ></span>
                )}
              </div>
              <div data-tooltip-id="pend-down">
                <button
                  disabled={isExportingData}
                  onClick={ExportCsv}
                  style={{ marginTop: '6px' }}
                  className={`performance-exportbtn performance-exp-mob flex items-center justify-center pipeline-export ${isExportingData ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {isExportingData ? (
                    <MdDownloading
                      className="downloading-animation"
                      size={20}
                    />
                  ) : (
                    <LuImport size={20} />
                  )}
                </button>
              </div>
              <Tooltip
                style={{
                  zIndex: 103,
                  background: '#f7f7f7',
                  color: '#000',
                  fontSize: 12,
                  paddingBlock: 4,
                  fontWeight: '400',
                }}
                offset={8}
                id="pend-down"
                place="top"
                content="Export"
                className="export"
              />
            </div>
          </div>
        </div>

        <div className="pendingActionTable" style={{ position: 'relative' }}>
          <table>
            {cuurentPageData && cuurentPageData.length > 0 && (
              <thead>
                <tr>
                  {filteredColumns?.map((item, key) => (
                    <SortableHeader
                      key={key}
                      isCheckbox={item.isCheckbox}
                      titleName={item.displayName}
                      data={cuurentPageData}
                      isAllRowsSelected={false}
                      isAnyRowSelected={false}
                      selectAllChecked={false}
                      setSelectAllChecked={() => {}}
                      selectedRows={selectedRows}
                      setSelectedRows={setSelectedRows}
                      sortKey={item.name}
                      sortDirection={
                        sortKey === item.name ? sortDirection : undefined
                      }
                      onClick={() => handleSort(item.name)}
                      style={{
                        position: key === 0 ? 'sticky' : 'static', // Sticky for the first column
                        left: 0, // For the first column, keep it fixed
                        zIndex: key === 0 ? 10 : 'auto', // Ensure the first column stays above others
                        backgroundColor: '#d5e4ff', // Prevent background from overlapping
                      }}
                    />
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={14}>
                    <div className="flex items-center justify-center">
                      <MicroLoader />
                    </div>
                  </td>
                </tr>
              ) : cuurentPageData.length ? (
                cuurentPageData.map((item: any, index: number) => (
                  <tr key={index}>
                    <td
                      style={{
                        borderRight: '1px solid #eaecf0',
                        position: 'sticky', // Make the first td sticky
                        left: 0, // Fix it to the left
                        backgroundColor: 'white', // Ensure background doesn't overlap when scrolling
                        zIndex: 5, // Ensure it stays above other content
                      }}
                    >
                      <div>
                        <div style={{ position: 'relative' }}>
                          <Link
                            to={`/project-management?project_id=${item.uninque_id}&customer-name=${item.home_owner}`}
                          >
                            <div
                              className="project-info-details deco-text"
                              style={{ flexShrink: 0 }}
                            >
                              <h3
                                className="customer-name"
                                data-tooltip-id={item.home_owner}
                              >
                                {item.home_owner}
                                <Tooltip
                                  style={{
                                    zIndex: 999,
                                    background: '#555',
                                    color: '#f7f7f7',
                                    fontSize: 12,
                                    paddingBlock: 4,
                                  }}
                                  offset={8}
                                  id={item.home_owner}
                                  place="top"
                                  content={item.home_owner}
                                />
                              </h3>

                              <div className="flex items-center gap-2">
                                <p className="install-update">
                                  {item.uninque_id}
                                </p>
                              </div>
                            </div>
                          </Link>

                          <span
                            onClick={() => openModal(item)}
                            style={{
                              cursor: 'pointer',
                              position: 'absolute',
                              right: '90px',
                              top: '28px',
                            }}
                          >
                            {' '}
                            {item.ntp.finance_NTP === 'Completed' &&
                              item.ntp.powerclerk === 'Completed' &&
                              item.ntp.production === 'Completed' &&
                              item.ntp.utility_bill === 'Completed' && (
                                <>
                                  <AiFillMinusCircle
                                    size={16}
                                    color={'#EBA900'}
                                    data-tooltip-id={item.uninque_id}
                                  />
                                  <Tooltip
                                    style={{
                                      zIndex: 999,
                                      background: '#555',
                                      color: '#f7f7f7',
                                      fontSize: 12,
                                      paddingBlock: 4,
                                    }}
                                    offset={8}
                                    id={item.uninque_id}
                                    place="top"
                                    content="Pending"
                                  />
                                </>
                              )}
                          </span>
                          {(active === 'ntp' &&
                            // If all relevant 'ntp' fields are 'Completed', don't show the icon
                            (item.ntp.production == 'Completed' ||
                              item.ntp.finance_NTP == 'Completed' ||
                              item.ntp.utility_bill == 'Completed' ||
                              item.ntp.powerclerk == 'Completed') &&
                            // If either field has valid data (ignore '-')
                            ((item.ntp_delayed_by?.trim() !== '-' &&
                              item.ntp_delayed_by?.trim() !== '') ||
                              (item.ntp.ntp_delay_notes?.trim() !== '-' &&
                                item.ntp.ntp_delay_notes?.trim() !== ''))) ||
                          (active === 'co' &&
                            // If either field has valid data (ignore '-')
                            ((item.co_delayed_by?.trim() !== '-' &&
                              item.co_delayed_by?.trim() !== '') ||
                              (item.co_notes?.trim() !== '-' &&
                                item.co.notes?.trim() !== ''))) ? (
                            <span
                              style={{
                                cursor: 'pointer',
                                position: 'absolute',
                                right: '70px',
                                top: '28px',
                              }}
                              data-tooltip-id="icon"
                            >
                              <BiSolidMessageDetail
                                size={16}
                                color={'#EBA900'}
                              />
                              <Tooltip
                                style={{
                                  zIndex: 999,
                                  background: '#555',
                                  color: '#f7f7f7',
                                  fontSize: 12,
                                  paddingBlock: 4,
                                }}
                                offset={8}
                                id="icon"
                                place="top"
                                content="We have some status here Please Check!"
                              />
                            </span>
                          ) : (
                            <span>{''}</span>
                          )}

                          <p className="pend-project-ages">
                            Project ages:{' '}
                            {active === 'ntp'
                              ? item.ntp.project_age_days
                                ? `${item.ntp.project_age_days} days`
                                : 'N/A'
                              : item.co.project_age_days
                                ? `${item.co.project_age_days} days`
                                : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    {active === 'co' ? (
                      <td>
                        <div className="">
                          {renderStatusCell(item, 'co_status', active, () =>
                            openModal(item)
                          )}
                        </div>
                      </td>
                    ) : (
                      <>
                        <td>
                          <div className="">
                            {renderStatusCell(item, 'production', active, () =>
                              openModal(item)
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="">
                            {renderStatusCell(item, 'finance_NTP', active, () =>
                              openModal(item)
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="">
                            {renderStatusCell(
                              item,
                              'utility_bill',
                              active,
                              () => openModal(item)
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="">
                            {renderStatusCell(item, 'powerclerk', active, () =>
                              openModal(item)
                            )}
                          </div>
                        </td>
                      </>
                    )}

                    <td>
                      <p className={styles['pend-header-txt']}>
                        {active === 'ntp'
                          ? formatDate(item.ntp.sold_date)
                          : formatDate(item.co.sold_date)}
                      </p>
                    </td>
                    <td>
                      <p className={styles['pend-header-txt']}>
                        {active === 'ntp'
                          ? item.ntp.app_status
                            ? item.ntp.app_status
                            : '-'
                          : item.co.app_status
                            ? item.co.app_status
                            : '-'}
                      </p>
                    </td>
                    <td>
                      <p
                        className={styles['pend-header-txt']}
                        style={{
                          overflowX: 'hidden',
                          width: '150px',
                          fontWeight: 500,
                          textOverflow: 'ellipsis',
                          color: getProjectColor(
                            active === 'ntp'
                              ? item.ntp.project_status
                                ? item.ntp.project_status.toLowerCase()
                                : '-'
                              : item.co.project_status
                                ? item.co.project_status.toLowerCase()
                                : '-'
                          ),
                        }}
                      >
                        {active === 'ntp'
                          ? item.ntp.project_status
                            ? item.ntp.project_status
                            : '-'
                          : item.co.project_status
                            ? item.co.project_status
                            : '-'}
                      </p>
                    </td>
                    <td>
                      <p className={styles['pend-header-txt']}>
                        {active === 'ntp'
                          ? item.ntp.sales_rep
                            ? item.ntp.sales_rep
                            : '-'
                          : item.co.sales_rep
                            ? item.co.sales_rep
                            : '-'}
                      </p>
                    </td>
                    <td>
                      <p className={styles['pend-header-txt']}>
                        {active === 'ntp'
                          ? item.ntp.setter
                            ? item.ntp.setter
                            : '-'
                          : item.co.setter
                            ? item.co.setter
                            : '-'}
                      </p>
                    </td>
                    <td>
                      <p className={styles['pend-header-txt']}>
                        {active === 'ntp'
                          ? item.ntp.deal_type
                            ? item.ntp.deal_type
                            : '-'
                          : item.co.deal_type
                            ? item.co.deal_type
                            : '-'}
                      </p>
                    </td>
                    <td>
                      <p className={styles['pend-header-txt']}>
                        {active === 'ntp'
                          ? formatDate(item.ntp.ntp_date)
                          : formatDate(item.co.ntp_date)}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr style={{ backgroundColor: '#fff' }}>
                  <td colSpan={14}>
                    <div className="flex items-center justify-center">
                      <DataNotFound />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="page-heading-container">
          {cuurentPageData?.length > 0 ? (
            <>
              <p className="page-heading">
                Showing {startIndex} -{' '}
                {endIndex > totalcount ? totalcount : endIndex} of {totalcount}{' '}
                item
              </p>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                paginate={(num) => setPage(num)}
                currentPageData={cuurentPageData}
                goToNextPage={() => setPage(page + 1)}
                goToPrevPage={() => setPage(page - 1)}
                perPage={itemsPerPage}
              />
            </>
          ) : null}
        </div>
      </div>
      {isModalOpen && (
        <PendModal
          closeModal={closeModal}
          active={active}
          currentRowData={selectedRowData}
        />
      )}
    </>
  );
};

const getStatusColor = (status: string) => {
  if (status === 'Pending (Action Required)') {
    return styles.action_required_card;
  }
  switch (status) {
    case 'Pending':
      return styles.warning_card;
    case 'Completed':
      return styles.success_card;
    default:
      return styles.default_card;
  }
};

const getCoStatusColor = (co_status: string) => {
  return getStatusColor(co_status);
};

const renderStatusCell = (
  item: any,
  key: string,
  active: 'all' | 'ntp' | 'co' | 'qc',
  openModal: () => void
) => {
  const isPendingOrActionRequired =
    item[active][key] === 'Pending' ||
    item[active][key] === 'Pending (Action Required)';
  if (active === 'co') {
    return item.co.co_status ? (
      <div
        className={`flex items-center ${getCoStatusColor(item.co.co_status)} ${styles.outline_card_wrapper}`}
      >
        {item.co.co_status === 'Pending' &&
        item.co.co === 'CO Requested - Working' ? (
          <AiFillMinusCircle size={16} color="#EBA900" />
        ) : item.co.co_status === 'Pending' && item.co.co === 'Request CO' ? (
          <AiFillMinusCircle size={16} color="#EBA900" />
        ) : item.co.co_status === 'Completed' ? (
          <AiFillCheckCircle size={16} color="#2EAF71" />
        ) : null}
        <span
          className={`$ {
          item.co.co_status === 'Pending' ? ${styles.hoverUnderlineScale} : ''
      }`}
          onClick={item.co.co_status === 'Pending' ? openModal : undefined}
          style={{
            fontWeight: 400,
            fontSize: 12,
            whiteSpace: 'nowrap',
            marginLeft: '10px',
            cursor: item.co.co_status === 'Pending' ? 'pointer' : 'default',
            color:
              item.co.co_status === 'Pending'
                ? '#EBA900'
                : item.co.co_status === 'Completed'
                  ? '#2EAF71'
                  : 'inherit',
          }}
        >
          {item.co.co === 'CO Complete'
            ? 'CO Completed'
            : item.co.co === 'CO Requested - Working'
              ? 'CO Requested - Working'
              : item.co.co === 'Pending'
                ? 'Request CO'
                : item.co.co
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (char: any) => char.toUpperCase())}
        </span>
      </div>
    ) : (
      <p className="no-data">No data available</p>
    );
  }

  if (!item[active] || !item[active][key]) {
    return <p className="no-data">No data available</p>;
  }

  return (
    <>
      <div
        className={`flex items-center ${getStatusColor(item[active][key])} ${styles.outline_card_wrapper}`}
      >
        {item[active][key] === 'Pending (Action Required)' ? (
          <AiFillMinusCircle size={16} color="#E14514" />
        ) : item[active][key] === 'Pending' ? (
          <AiFillMinusCircle size={16} color="#EBA900" />
        ) : item[active][key] === 'Completed' ? (
          <AiFillCheckCircle size={16} color="#2EAF71" />
        ) : null}
        <span
          onClick={isPendingOrActionRequired ? openModal : undefined}
          className={`${isPendingOrActionRequired ? styles.hoverUnderlineScale : ''}`}
          style={{
            fontWeight: 400,
            fontSize: 12,
            whiteSpace: 'nowrap',
            marginLeft: '5px',
            cursor: isPendingOrActionRequired ? 'pointer' : 'default',
            color:
              item[active][key] === 'Pending (Action Required)'
                ? '#E14514'
                : item[active][key] === 'Pending'
                  ? '#EBA900'
                  : item[active][key] === 'Completed'
                    ? '#2EAF71'
                    : 'inherit',
          }}
        >
          {item[active][key] === 'Pending (Action Required)'
            ? 'Action req'
            : item[active][key] === 'Pending'
              ? 'Pending'
              : item[active][key] === 'Completed'
                ? 'Completed'
                : key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
        </span>
      </div>
    </>
  );
};

export default PendingQueue;
