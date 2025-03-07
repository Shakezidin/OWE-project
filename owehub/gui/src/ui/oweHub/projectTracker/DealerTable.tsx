import React, { useCallback, useEffect, useState } from 'react';
import './dealertable.css';
import pipeLineColumn from '../../../resources/static_data/pipeLineColumn';
import SortableHeader from '../../components/tableHeader/SortableHeader';
import DataNotFound from '../../components/loader/DataNotFound';
import MicroLoader from '../../components/loader/MicroLoader';
import { ICONS } from '../../../resources/icons/Icons';
import { BiArrowBack } from 'react-icons/bi';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoMdSearch } from 'react-icons/io';
import { getPipeLineData } from '../../../redux/apiActions/pipelineAction/pipelineAction';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import Pagination from '../../components/pagination/Pagination';
import { debounce } from '../../../utiles/debounce';
import FilterHoc from '../../components/FilterModal/FilterHoc';
import { FilterModel } from '../../../core/models/data_models/FilterSelectModel';
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import { MdDownloading } from 'react-icons/md';
import { LuImport } from 'react-icons/lu';
import { FaUpload } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import useMatchMedia from '../../../hooks/useMatchMedia';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { format, parseISO } from 'date-fns';
import SelectOption from '../../components/selectOption/SelectOption';
import DropDownLeadTable from '../../leadmanagement/components/LeadDashboardTable/Dropdowns/CustomDrop';
import { CiCircleCheck, CiEdit } from 'react-icons/ci';
import { TiTick } from 'react-icons/ti';
import { EndPoints } from '../../../infrastructure/web_api/api_client/EndPoints';

interface ColumnMap {
  [key: string]: string;
}

const DealerTablePipeline = () => {
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemPerPage] = useState(25);
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = page * itemsPerPage;
  const totalPage = Math.ceil(totalCount / itemsPerPage);
  const location = useLocation();
  const selectedDealer = location.state?.selectedDealer || [];
  const dealerNames = selectedDealer
    ? selectedDealer.map((dealer: any) => dealer.value)
    : [];
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchInp, setSearchInp] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState(false);
  const [filterModal, setFilterModal] = React.useState<boolean>(false);
  const [filters, setFilters] = useState<FilterModel[]>([]);
  const navigate = useNavigate();
  const isMobile = useMatchMedia('(max-width: 767px)');
  const [update, setUpdate] = useState(false);


  const handleClick = () => {
    navigate('/pipeline');
  };

  const handleSearchChange = useCallback(
    debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    }, 800),
    []
  );

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
          "Data": [filter.data1, filter.data2],
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

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getPipeLineData({
        dealer_names: dealerNames,
        search_filters: {
          page_number: page,
          page_size: itemsPerPage,
          filters:
            formattedFilters && formattedFilters.length > 0
              ? formattedFilters
              : [
                { column: 'unique_id', operation: 'cont', data: searchTerm },
                {
                  column: 'customer_name',
                  operation: 'cont',
                  data: searchTerm,
                },
              ],
          sort_by: '',
          sort_order: '',
        },
      })
    );
  }, [update, page, searchTerm, filters]);

  const { pipelineData } = useAppSelector((state) => state.pipelineSlice);

  useEffect(() => {
    if (pipelineData && pipelineData.data && pipelineData.data.count) {
      setTotalCount(pipelineData.data.count);
    }
  }, [pipelineData]);

  const handleSort = (key: any) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const cuurentPageData = pipelineData.list?.slice();

  if (sortKey) {
    // Mapping backend keys to actual sorting keys
    const sortKeyMapping: Record<string, string> = {
      days_pending_pto: 'days_pto',
      days_pending_install: 'days_install',
      days_pending_permits: 'days_permits',
      days_pending_ntp: 'days_ntp',
      project_age: 'days_project_age',
    };

    // Determine the actual key to sort by
    const actualSortKey = sortKeyMapping[sortKey] || sortKey;

    cuurentPageData?.sort((a: any, b: any) => {

      const aValue = a[actualSortKey];
      const bValue = b[actualSortKey];

      if (
        actualSortKey === 'system_size' ||
        actualSortKey === 'contract_amount'
      ) {
        const numericAValue = aValue
          ? parseFloat(aValue.replace(/[^0-9.]/g, ''))
          : 0;
        const numericBValue = bValue
          ? parseFloat(bValue.replace(/[^0-9.]/g, ''))
          : 0;

        return sortDirection === 'asc'
          ? numericAValue - numericBValue
          : numericBValue - numericAValue;
      } else if (
        actualSortKey === 'days_pto' ||
        actualSortKey === 'days_install' ||
        actualSortKey === 'days_permits' ||
        actualSortKey === 'days_ntp' ||
        actualSortKey === 'days_project_age'
      ) {
        const extractNumber = (value: string | number) =>
          typeof value === 'number'
            ? value
            : parseInt(String(value).match(/\d+/)?.[0] || '0', 10);

        const numericAValue = extractNumber(aValue);
        const numericBValue = extractNumber(bValue);

        return sortDirection === 'asc'
          ? numericAValue - numericBValue
          : numericBValue - numericAValue;
      } else if (actualSortKey === 'jeopardy_date') {
        return sortDirection === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
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

  const [isExporting, setIsExporting] = useState(false);

  const exportCsv = async () => {
    setIsExporting(true);
    const headers = pipeLineColumn.map((item) => item.displayName);
    try {
      const data = {
        dealer_names: dealerNames,
        search_filters: {
          page_number: 1,
          page_size: totalCount,
          filters:
            formattedFilters && formattedFilters.length > 0
              ? formattedFilters
              : [
                { column: 'unique_id', operation: 'cont', data: searchTerm },
                {
                  column: 'customer_name',
                  operation: 'cont',
                  data: searchTerm,
                },
              ],
          sort_by: '',
          sort_order: '',
        },
      };
      const response = await postCaller('getPipelineDealerData', data);
      if (response.status > 201) {
        toast.error(response.data.message);
        setIsExporting(false);
        return;
      }
      const csvData = response.data.pipeline_dealer_data_list?.map?.(
        (item: any) => [
          item.unique_id || '-',
          item.home_owner || '-',
          item.finance_company || '-',
          item.type || '-',
          item.loan_type || '-',
          item.street_address || '-',
          item.state || '-',
          item.email || '-',
          item.phone_number || '-',

          item.partner_dealer || '-',
          item.system_size || '0',
          `${item.contract_amount || '0'}`,
          // item.created_date || '-',
          item.contract_date
            ? format(parseISO(item.contract_date), 'dd-MM-yyyy')
            : '-',
          item.survey_final_completion_date
            ? format(parseISO(item.survey_final_completion_date), 'dd-MM-yyyy')
            : '-',
          item.ntp_complete_date
            ? format(parseISO(item.ntp_complete_date), 'dd-MM-yyyy')
            : '-',
          item.permit_submit_date
            ? format(parseISO(item.permit_submit_date), 'dd-MM-yyyy')
            : '-',
          item.permit_approval_date
            ? format(parseISO(item.permit_approval_date), 'dd-MM-yyyy')
            : '-',
          item.ic_submit_date
            ? format(parseISO(item.ic_submit_date), 'dd-MM-yyyy')
            : '-',
          item.ic_approval_date
            ? format(parseISO(item.ic_approval_date), 'dd-MM-yyyy')
            : '-',
          item.rep_2 || '-',
          item.cancel_date
            ? format(parseISO(item.cancel_date), 'dd-MM-yyyy')
            : '-',
          item.pv_install_date
            ? format(parseISO(item.pv_install_date), 'dd-MM-yyyy')
            : '-',
          item.pto_date ? format(parseISO(item.pto_date), 'dd-MM-yyyy') : '-',
          item.fin_complete_date
            ? format(parseISO(item.fin_complete_date), 'dd-MM-yyyy')
            : '-',
          item.jeopardy_date === undefined || item.jeopardy_date === null
            ? 'N/A'
            : item.jeopardy_date === true
              ? 'True'
              : 'False',
          item.days_project_age || '-',
          item.days_ntp || '-',
          item.days_permits || '-',
          item.days_install || '-',
          item.days_pto || '-',
          item.rep_1 || '-',
          item.setter || '-',
          item.project_status || '-',
        ]
      );

      const csvRows = [headers, ...csvData];
      const csvString = Papa.unparse(csvRows);
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Projects Data Entry & Aging Report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      toast.error('No Data Found');
    } finally {
      setIsExporting(false);
    }
    setIsExporting(false);
  };

  /////////////////////////////////////////////////////////////////////

  const [selectedAM, setSelectedAM] = useState<any>(null);
  const [selectedSR, setSelectedSR] = useState<any>(null);
  const [selectedSR2, setSelectedSR2] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [selectedSRRow, setSelectedSRRow] = useState<string | null>(null);
  const [selectedSR2Row, setSelectedSR2Row] = useState<string | null>(null);
  const [selectedDealerName, setSelectedDealerName] = useState('');
  const [table, setSelectedTable] = useState('');




  const tableData = {
    "tableNames": [table],
    "dealer": selectedDealerName
  }

  const [amOptions, setAmOptions] = useState([
    { value: 'for test', label: 'Loading...' },
  ]);
  const [srOptions, setSrOptions] = useState([
    { value: 'for test', label: 'Loading...' },
  ]);

  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    if (res.status !== 200) return;

    if (table === "setter") {
      if (!res.data || !Array.isArray(res.data.setter) || res.data.setter.length === 0 || (res.data.setter.length === 1 && res.data.setter[0] === "")) {
        setAmOptions([{ value: "sd", label: "Data Not Found" }]);
        return;
      }

      console.log("we are at setter");
      const newOptions = res.data.setter
        .filter((name: string) => name.trim() !== "")
        .map((name: string) => ({
          value: name,
          label: name,
        }));

      setAmOptions(newOptions);
    } else {
      if (!res.data || !Array.isArray(res.data.primary_sales_rep) || res.data.primary_sales_rep.length === 0 || (res.data.primary_sales_rep.length === 1 && res.data.primary_sales_rep[0] === "")) {
        setSrOptions([{ value: "ds", label: "Data Not Found" }]);
        return;
      }

      const newOptions = res.data.primary_sales_rep
        .filter((name: string) => name.trim() !== "")
        .map((name: string) => ({
          value: name,
          label: name,
        }));

      setSrOptions(newOptions);
    }
  };


  useEffect(() => {
    getNewFormData();
  }, [selectedDealerName, table, selectedRow, selectedSR2Row, selectedSRRow]);

  const handleSetterEdit = async (id: any) => {
    if (selectedAM !== null && selectedAM.value !== '') {
      setUpdate(true);
      const res = await postCaller(EndPoints.update_setter_sales_rep, {
        "unique_id": id,
        "field": table,
        "data": selectedAM.value,
      });
      if (res.status !== 200) {
        toast.error("Failed to update Setter");
        setUpdate(false);
        return;
      }
      else {
        toast.success("Setter Updated Successfully");
        setSelectedAM(null);
        setSelectedRow(null);
        setUpdate(false);
      }
    } else {
      toast.error("Please select Setter");
    }

  };

  const handleRepEdit = async (id: any) => {
    if (selectedSR !== null && selectedSR.value !== '') {
      setUpdate(true);
      const res = await postCaller(EndPoints.update_setter_sales_rep, {
        "unique_id": id,
        "field": table,
        "data": selectedSR.value,
      });
      if (res.status !== 200) {
        toast.error("Failed to update Sales Rep");
        setUpdate(false);
        return;
      }
      else {
        toast.success("Sales Rep1 Updated Successfully");
        setSelectedSR(null);
        setSelectedSRRow(null);
        setUpdate(false);
      }
    } else {
      toast.error("Please select Sales Rep");
    }

  };

  const handleRep2Edit = async (id: any) => {
    if (selectedSR2 !== null && selectedSR2.value !== '') {
      setUpdate(true);
      const res = await postCaller(EndPoints.update_setter_sales_rep, {
        "unique_id": id,
        "field": "secondry_sales_rep",
        "data": selectedSR2.value,
      });
      if (res.status !== 200) {
        toast.error("Failed to update Sales Rep2");
        setUpdate(false);
        return;
      }
      else {
        toast.success("Sales Rep2 Updated Successfully");
        setSelectedSR(null);
        setSelectedSRRow(null);
        setUpdate(false);
      }
    } else {
      toast.error("Please select Sales Rep");
    }

  };
  const isStaging = process.env.REACT_APP_ENV;


  return (
    <>
      <FilterHoc
        isOpen={filterModal}
        handleClose={filterClose}
        resetOnChange={false}
        columns={pipeLineColumn}
        page_number={page}
        page_size={20}
        fetchFunction={fetchFunction}
        isNew={true}
      />
      <div className="dashBoard-container">
        <div className="newp-heading-container">
          <div className="newp-heading">
            <BiArrowBack
              style={{
                height: '20px',
                width: '20px',
                cursor: 'pointer',
              }}
              onClick={handleClick}
            />
            <h2>Projects Data Entry & Aging Report</h2>
          </div>
          <div className="newp-filInp">
            <div className="inp-cont">
              {formattedFilters.length === 0 && (
                <div className="search-icon">
                  <IoMdSearch
                    style={{
                      color: search ? '#377cf6' : 'inherit',
                      height: '20px',
                      width: '20px',
                    }}
                  />
                </div>
              )}
              {formattedFilters.length === 0 && (
                <input
                  value={searchInp}
                  type="text"
                  placeholder="Search"
                  className="pipe-searchInput"
                  onChange={(e) => {
                    setPage(1);
                    if (e.target.value.length <= 50) {
                      const trimmedValue = e.target.value.trimStart();
                      e.target.value = trimmedValue.replace(/\s+/g, ' ');
                      setSearchInp(e.target.value);
                      handleSearchChange(e);
                    }
                  }}
                  onFocus={() => setSearch(true)}
                  onBlur={() => setSearch(false)}
                />
              )}
            </div>

            <div className="export-button-container">
              <div
                className="filter-line-pipe relative"
                onClick={open}
                style={{ backgroundColor: '#363636' }}
                data-tooltip-id={isMobile ? '' : 'dealer-filter'}
              >
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
                  id="dealer-filter"
                  place="top"
                  content="Filter"
                  className="pagination-tooltip"
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
                <img src={ICONS.skyfilter} alt="" />
              </div>
              <div
                className="export-button-pipe"
                onClick={exportCsv}
                data-tooltip-id={isMobile ? '' : 'export'}
                style={{
                  pointerEvents: isExporting ? 'none' : 'auto',
                  opacity: isExporting ? 0.6 : 1,
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                }}
              >
                {isExporting ? (
                  <MdDownloading
                    className="downloading-animation"
                    size={12}
                    color="white"
                  />
                ) : (
                  <LuImport size={20} color="white" />
                )}
              </div>
              {!isExporting && (
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
                  id="export"
                  place="bottom"
                  content="Export"
                />
              )}
            </div>
          </div>
        </div>
        <div
          className="TableContainer-pipeline"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          {pipelineData.loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <MicroLoader />
            </div>
          ) : !cuurentPageData ||
            (cuurentPageData && cuurentPageData.length === 0) ? (
            <div
              className="flex items-center justify-center"
              style={{ height: '100%' }}
            >
              <DataNotFound />
            </div>
          ) : (
            <table>
              <thead>
                <tr style={{ background: '#F3F3FF' }}>
                  {pipeLineColumn
                    ?.filter(item =>
                      isStaging !== 'staging'
                        ? item.name !== 'project_status' && item.name !== 'setter'
                        : true // If staging === 'staging', keep all items
                    )
                    .map((item, key) => (
                      <SortableHeader
                        key={key}
                        isCheckbox={item.isCheckbox}
                        titleName={item.displayName}
                        data={cuurentPageData}
                        isAllRowsSelected={false}
                        isAnyRowSelected={false}
                        selectAllChecked={false}
                        setSelectAllChecked={() => { }}
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
                {cuurentPageData &&
                  cuurentPageData.map((item: any, index: any) => (
                    <tr key={index}>
                      <td>{item.unique_id || '-'}</td>
                      <td>{item.home_owner || '-'}</td>
                      {isStaging === 'staging' &&
                        <td>
                          {item.project_status ? item.project_status : '-'}
                        </td>
                      }
                      <td>{item.finance_company || '-'}</td>
                      <td>{item.type || '-'}</td>
                      <td>{item.loan_type || '-'}</td>

                      <td>{item.street_address || '-'}</td>

                      <td>{item.state || '-'}</td>

                      <td>{item.email || '-'}</td>
                      <td>{item.phone_number || '-'}</td>


                      <td>{item.partner_dealer || '-'}</td>
                      <td>
                        {selectedSRRow !== item.unique_id ? (
                          <div className="am-select-container">
                            <span>{item.rep_1 || '-'}</span>
                            {isStaging === 'staging' &&
                              <CiEdit
                                size={16}
                                onClick={() => {
                                  setSelectedSRRow(item.unique_id);
                                  setSelectedTable("primary_sales_rep");
                                  setSelectedDealerName(item.partner_dealer);
                                  setSelectedSR({ value: item.rep_1, label: item.rep_1 });
                                }}
                                style={{ cursor: "pointer", marginLeft: "8px" }}
                              />
                            }

                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

                            <SelectOption
                              options={srOptions}
                              onChange={(value: any) => {
                                if (value === "for test" || value === "sd") {
                                  return; // Prevent selection
                                }
                                setSelectedSR(value);
                              }}
                              value={selectedSR}
                              controlStyles={{
                                marginTop: 0,
                                minHeight: 30,
                                minWidth: isMobile ? 67 : 150,
                              }}
                              menuWidth={isMobile ? "120px" : "150px"}
                              menuListStyles={{ fontWeight: 400 }}
                              singleValueStyles={{ fontWeight: 400 }}
                              placeholder="Select Sales Rep"
                            />
                            <div
                              className='edit-setter'
                              onClick={() => { setSelectedSRRow(null); handleRepEdit(item.unique_id) }}
                              style={{ cursor: "pointer", color: "black", justifyContent: "center" }}
                            >
                              <img src={ICONS.check} alt="" />
                            </div>

                          </div>
                        )}
                      </td>
                      <td>
                        {selectedSR2Row !== item.unique_id ? (
                          <div className="am-select-container">
                            <span>{item.rep_2 || '-'}</span>
                            {isStaging === 'staging' &&
                              <CiEdit
                                size={16}
                                onClick={() => {
                                  setSelectedSR2Row(item.unique_id);
                                  setSelectedTable("primary_sales_rep");
                                  setSelectedDealerName(item.partner_dealer);
                                  setSelectedSR2({ value: item.rep_2, label: item.rep_2 });
                                }}
                                style={{ cursor: "pointer", marginLeft: "8px" }}
                              />
                            }

                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

                            <SelectOption
                              options={srOptions}
                              onChange={(value: any) => {
                                if (value === "for test" || value === "sd") {
                                  return; // Prevent selection
                                }
                                setSelectedSR2(value);
                              }}
                              value={selectedSR2}
                              controlStyles={{
                                marginTop: 0,
                                minHeight: 30,
                                minWidth: isMobile ? 67 : 150,
                              }}
                              menuWidth={isMobile ? "120px" : "150px"}
                              menuListStyles={{ fontWeight: 400 }}
                              singleValueStyles={{ fontWeight: 400 }}
                              placeholder="Select Sales Rep2"
                            />
                            <div
                              className='edit-setter'
                              onClick={() => { setSelectedSR2Row(null); handleRep2Edit(item.unique_id) }}
                              style={{ cursor: "pointer", color: "black", justifyContent: "center" }}
                            >
                              <img src={ICONS.check} alt="" />
                            </div>
                          </div>
                        )}
                      </td>
                      {isStaging === 'staging' &&
                        <td>
                          {selectedRow !== item.unique_id ? (
                            <div className="am-select-container">
                              <span>{item.setter ? item.setter : '-'}</span>

                              <CiEdit
                                size={16}
                                onClick={() => {
                                  setSelectedAM({ value: item.setter, label: item.setter });
                                  setSelectedRow(item.unique_id);
                                  setSelectedTable("setter");
                                  setSelectedDealerName(item.partner_dealer);
                                }}
                                style={{ cursor: "pointer", marginLeft: "8px" }}
                              />


                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

                              <SelectOption
                                options={amOptions}
                                onChange={(value: any) => {
                                  if (value.value === "for test" || value.value === "sd") {
                                    return;
                                  }
                                  setSelectedAM(value);
                                }}
                                value={selectedAM}
                                controlStyles={{
                                  marginTop: 0,
                                  minHeight: 30,
                                  minWidth: isMobile ? 67 : 150,
                                }}
                                menuWidth={isMobile ? "120px" : "150px"}
                                menuListStyles={{ fontWeight: 400 }}
                                singleValueStyles={{ fontWeight: 400 }}
                                placeholder="Select Setter"
                              />
                              <div
                                className='edit-setter'
                                onClick={() => { setSelectedRow(null); handleSetterEdit(item.unique_id) }}
                                style={{ cursor: "pointer", color: "black", justifyContent: "center" }}
                              >
                                <img src={ICONS.check} alt="" />
                              </div>

                            </div>
                          )}
                        </td>
                      }
                      <td>{item.system_size || '0'}</td>
                      <td>{item.contract_amount || '0'}</td>
                      <td>
                        {item.contract_date
                          ? format(parseISO(item.contract_date), 'dd-MM-yyyy')
                          : '-'}
                      </td>
                      <td>
                        {item.survey_final_completion_date
                          ? format(
                            parseISO(item.survey_final_completion_date),
                            'dd-MM-yyyy'
                          )
                          : '-'}
                      </td>
                      <td>
                        {item.ntp_complete_date
                          ? format(
                            parseISO(item.ntp_complete_date),
                            'dd-MM-yyyy'
                          )
                          : '-'}
                      </td>
                      <td>
                        {item.permit_submit_date
                          ? format(
                            parseISO(item.permit_submit_date),
                            'dd-MM-yyyy'
                          )
                          : '-'}
                      </td>
                      <td>
                        {item.permit_approval_date
                          ? format(
                            parseISO(item.permit_approval_date),
                            'dd-MM-yyyy'
                          )
                          : '-'}
                      </td>
                      <td>
                        {item.ic_submit_date
                          ? format(parseISO(item.ic_submit_date), 'dd-MM-yyyy')
                          : '-'}
                      </td>
                      <td>
                        {item.ic_approval_date
                          ? format(
                            parseISO(item.ic_approval_date),
                            'dd-MM-yyyy'
                          )
                          : '-'}
                      </td>


                      <td>
                        {item.cancel_date
                          ? format(parseISO(item.cancel_date), 'dd-MM-yyyy')
                          : '-'}
                      </td>
                      <td>
                        {item.pv_install_date
                          ? format(parseISO(item.pv_install_date), 'dd-MM-yyyy')
                          : '-'}
                      </td>
                      <td>
                        {item.pto_date
                          ? format(parseISO(item.pto_date), 'dd-MM-yyyy')
                          : '-'}
                      </td>
                      <td>
                        {item.fin_complete_date
                          ? format(
                            parseISO(item.fin_complete_date),
                            'dd-MM-yyyy'
                          )
                          : '-'}
                      </td>



                      <td>
                        {item.jeopardy_date === undefined ||
                          item.jeopardy_date === null
                          ? 'N/A'
                          : item.jeopardy_date === true
                            ? 'Yes'
                            : 'No'}
                      </td>

                      <td>
                        {item.days_project_age ? item.days_project_age : '-'}
                      </td>
                      <td>{item.days_ntp ? item.days_ntp : '-'}</td>
                      <td>{item.days_permits ? item.days_permits : '-'}</td>
                      <td>{item.days_install ? item.days_install : '-'}</td>
                      <td>{item.days_pto ? item.days_pto : '-'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
        {cuurentPageData &&
          cuurentPageData?.length > 0 &&
          !pipelineData.loading ? (
          <div className="page-heading-container">
            <p className="page-heading">
              {startIndex} - {endIndex > totalCount! ? totalCount : endIndex} of{' '}
              {totalCount} item
            </p>

            <Pagination
              currentPage={page}
              totalPages={totalPage}
              paginate={(num) => setPage(num)}
              currentPageData={[]}
              goToNextPage={() => 0}
              goToPrevPage={() => 0}
              perPage={itemsPerPage}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default DealerTablePipeline;
