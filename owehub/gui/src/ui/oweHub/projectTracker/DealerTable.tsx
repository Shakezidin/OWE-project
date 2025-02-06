import React, { useCallback, useEffect, useState } from 'react'
import './dealertable.css'
import pipeLineColumn from '../../../resources/static_data/pipeLineColumn'
import SortableHeader from '../../components/tableHeader/SortableHeader'
import DataNotFound from '../../components/loader/DataNotFound'
import MicroLoader from '../../components/loader/MicroLoader'
import { ICONS } from '../../../resources/icons/Icons'
import { BiArrowBack } from 'react-icons/bi'
import { useLocation, useNavigate } from 'react-router-dom'
import { IoMdSearch } from 'react-icons/io'
import { getPipeLineData } from '../../../redux/apiActions/pipelineAction/pipelineAction'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import Pagination from '../../components/pagination/Pagination'
import { debounce } from '../../../utiles/debounce'
import FilterHoc from '../../components/FilterModal/FilterHoc'
import { FilterModel } from '../../../core/models/data_models/FilterSelectModel'
import Papa from 'papaparse';
import { toast } from 'react-toastify'
import { MdDownloading } from 'react-icons/md'
import { LuImport } from 'react-icons/lu'
import { FaUpload } from 'react-icons/fa'
import { Tooltip } from 'react-tooltip'
import useMatchMedia from '../../../hooks/useMatchMedia'
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl'


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
    const dealerNames = selectedDealer ? selectedDealer.map((dealer: any) => dealer.value) : [];
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [sortKey, setSortKey] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchInp, setSearchInp] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const [search, setSearch] = useState(false);
    const [filterModal, setFilterModal] = React.useState<boolean>(false);
    const [filters, setFilters] = useState<FilterModel[]>([]);
    const navigate = useNavigate();
    const isMobile = useMatchMedia('(max-width: 767px)');


    const handleClick = () => {
        navigate('/pipeline');
    };


    const columnMap: ColumnMap = {
        "customer_name": "customer_name",
        "partner_dealer": "dealer",
        "finance_company": "finance_company",
        "source_type": "source_type",
        "loan_type": "loan_type",
        "unique_id": "unique_id",
        "street_address": "address",
        "city": "city",
        "state": "state",
        "zip_code": "zip_code",
        "email": "email_address",
        "phone_number": "phone_number",
        "rep_1": "primary_sales_rep",
        "rep_2": "secondary_sales_rep",
        "system_size": "contracted_system_size",
        "contract_amount": "total_system_cost",
        "created_date": "sale_date",
        "contract_date": "sale_date",
        "survey_final_completion_date": "survey_final_completion_date",
        "ntp_complete_date": "ntp_complete_date",
        "permit_submit_date": "pv_submitted",
        "permit_approval_date": "pv_approved",
        "ic_submit_date": "ic_submitted_date",
        "ic_approval_date": "ic_approved_date",
        "jeopardy_date": "jeopardy_date",
        "cancel_date": "cancel_date",
        "pv_install_date": "pv_completion_date",
        "fin_complete_date": "pv_fin_date",
        "pto_date": "pto_granted"
    };
    const handleSearchChange = useCallback(
        debounce((e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
        }, 800),
        []
    );
    const formattedFilters = filters ? filters.map(filter => ({
        column: filter.Column,
        operation: filter.Operation,
        data: filter.Data
    })) : [];

    const getColumnKey = (sortKey: string): string => {
        return columnMap[sortKey] || sortKey;
    };
    const columnKey = getColumnKey(sortKey);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getPipeLineData(
            {
                "dealer_names": dealerNames,
                "search_filters": {
                    "page_number": page,
                    "page_size": itemsPerPage,
                    "filters": (formattedFilters && formattedFilters.length > 0) ? formattedFilters : [
                        { "column": "unique_id", "operation": "cont", "data": searchTerm },
                        { "column": "customer_name", "operation": "cont", "data": searchTerm },
                    ],
                    "sort_by": "",
                    "sort_order": ""
                }
            }
        ))
    }, [page, searchTerm, filters])

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
        cuurentPageData?.sort((a: any, b: any) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];

            if (sortKey === 'system_size' || sortKey === 'contract_amount') {
                // Extract numeric values from system_size or contract_amount
                const numericAValue = parseFloat(aValue.replace(/[^0-9.]/g, ''));
                const numericBValue = parseFloat(bValue.replace(/[^0-9.]/g, ''));

                return sortDirection === 'asc'
                    ? numericAValue - numericBValue
                    : numericBValue - numericAValue;
            } else if (typeof aValue === 'string' && typeof bValue === 'string') {
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


    const filterClose = () => {
        setFilterModal(false);
    };
    const fetchFunction = (req: any) => {
        setPage(1);
        setFilters(req.filters);
    };
    const open = () => {
        setFilterModal(true);
    }

    const [isExporting, setIsExporting] = useState(false);

    const exportCsv = async () => {
        setIsExporting(true);
        const headers = pipeLineColumn.map((item) => item.displayName);
        try {
            const data = {
                "dealer_names": dealerNames,
                "search_filters": {
                    "page_number": page,
                    "page_size": totalCount,
                    "filters": [],
                    "sort_by": "",
                    "sort_order": ""
                }
            };
            const response = await postCaller('getPipelineDealerData', data);
            if (response.status > 201) {
                toast.error(response.data.message);
                setIsExporting(false);
                return;
            }
            const csvData = response.data.pipeline_dealer_data_list?.map?.((item: any) => [
                item.unique_id || 'N/A',
                item.home_owner || 'N/A',
                item.finance_company || 'N/A',
                item.type || 'N/A',
                item.loan_type || 'N/A',
                item.street_address || 'N/A',
                item.state || 'N/A',
                item.email || 'N/A',
                item.phone_number || 'N/A',
                item.rep_1 || 'N/A',
                'Not Found',
                item.system_size || '0',
                `${item.contract_amount || '0'}`,
                item.created_date || 'N/A',
                item.contract_date || 'N/A',
                item.survey_final_completion_date || 'N/A',
                item.ntp_complete_date || 'N/A',
                item.permit_submit_date || 'N/A',
                item.permit_approval_date || 'N/A',
                item.ic_submit_date || 'N/A',
                item.ic_approval_date || 'N/A',
                item.rep_2 || 'N/A',
                item.cancel_date || 'N/A',
                item.pv_install_date || 'N/A',
                item.pto_date || 'N/A',
                'N/A',
                item.fin_complete_date || 'N/A',
                item.jeopardy_date ? item.jeopardy_date.toString() : 'N/A',
            ]);


            const csvRows = [headers, ...csvData];
            const csvString = Papa.unparse(csvRows);
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'report.csv');
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


    console.log(formattedFilters, "sdjjfgj")

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
            />
            <div className="dashBoard-container">
                <div className="newp-heading-container">
                    <div className='newp-heading'>
                        <BiArrowBack style={{
                            height: '20px',
                            width: '20px',
                            cursor: "pointer"
                        }}
                            onClick={handleClick}
                        />
                        <h2>All Status</h2>
                    </div>
                    <div className='newp-filInp'>
                        <div className='inp-cont'>
                            <div className="search-icon">
                                <IoMdSearch style={{ color: search ? "#377cf6" : "inherit", height: '20px', width: '20px' }} />
                            </div>
                            <input
                                value={searchInp}
                                type="text"
                                placeholder="Search"
                                className="pipe-searchInput"
                                onChange={(e) => {
                                    if (e.target.value.length <= 50) {
                                        e.target.value = e.target.value.replace(
                                            /[^a-zA-Z0-9\u00C0-\u024F\u1E00-\u1EFF_\- $,\.]| {2,}/g,
                                            ''
                                        );
                                        setSearchInp(e.target.value);
                                        handleSearchChange(e);
                                    }
                                }}
                                onFocus={() => setSearch(true)}
                                onBlur={() => setSearch(false)}
                            />
                        </div>

                        <div className='export-button-container'>
                            <div className='skyfilter' onClick={open} data-tooltip-id={isMobile ? "" : "filter"}><img src={ICONS.skyfilter} alt='' /></div>
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
                                delayShow={800}
                                id="filter"
                                place="bottom"
                                content="Filter"
                            />
                            <div
                                className="export-button-pipe"
                                onClick={exportCsv}
                                data-tooltip-id={isMobile ? "" : "export"}
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
                                    <FaUpload size={12} color="white" />
                                )}
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
                                delayShow={800}
                                id="export"
                                place="bottom"
                                content="Export"
                            />
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
                    ) : !(pipelineData && pipelineData.data.list.data && pipelineData.data.list.data.pipeline_dealer_data_list) ? (
                        <div
                            className="flex items-center justify-center"
                            style={{ height: '100%' }}
                        >
                            <DataNotFound />
                        </div>
                    ) : (
                        <table>
                            <thead>
                                <tr style={{ background: "#F3F3FF" }}>
                                    {pipeLineColumn?.map((item, key) => (
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

                                {cuurentPageData && cuurentPageData.map((item: any, index: any) => (
                                    <tr key={index}>
                                        <td>{item.unique_id || 'N/A'}</td>
                                        <td>{item.home_owner || 'N/A'}</td>
                                        <td>{item.finance_company || 'N/A'}</td>
                                        <td>{item.type || 'N/A'}</td>
                                        <td>{item.loan_type || 'N/A'}</td>

                                        <td>{item.street_address || 'N/A'}</td>

                                        <td>{item.state || 'N/A'}</td>

                                        <td>{item.email || 'N/A'}</td>
                                        <td>{item.phone_number || 'N/A'}</td>

                                        <td>{item.rep_1 || 'N/A'}</td>
                                        <td>{item.partner_dealer || 'N/A'}</td>
                                        <td>{item.system_size || '0'}</td>
                                        <td>{item.contract_amount || '0'}</td>
                                        <td>{item.created_date || 'N/A'}</td>
                                        <td>{item.contract_date || 'N/A'}</td>

                                        <td>{item.survey_final_completion_date || 'N/A'}</td>
                                        <td>{item.ntp_complete_date || 'N/A'}</td>
                                        <td>{item.permit_submit_date || 'N/A'}</td>
                                        <td>{item.permit_approval_date || 'N/A'}</td>
                                        <td>{item.ic_submit_date || 'N/A'}</td>
                                        <td>{item.ic_approval_date || 'N/A'}</td>
                                        <td>{item.rep_2 || 'N/A'}</td>
                                        <td>{item.cancel_date || 'N/A'}</td>
                                        <td>{item.pv_install_date || 'N/A'}</td>
                                        <td>{item.pto_date || 'N/A'}</td>
                                        <td>{'N/A'}</td>
                                        <td>{item.fin_complete_date || 'N/A'}</td>
                                        <td>{item.jeopardy_date ? item.jeopardy_date.toString() : 'N/A'}</td>
                                    </tr>
                                ))}


                            </tbody>
                        </table>
                    )}
                </div>
                {pipelineData && pipelineData.data && pipelineData.data.list.data.pipeline_dealer_data_list && pipelineData.data.list.data.pipeline_dealer_data_list?.length > 0 ? (
                    <div className="page-heading-container">
                        <p className="page-heading">
                            {startIndex} - {endIndex > totalCount! ? totalCount : endIndex} of {totalCount} item
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
    )
}

export default DealerTablePipeline
