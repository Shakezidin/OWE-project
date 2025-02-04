import React, { useEffect, useState } from 'react'
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

const DealerTablePipeline = () => {

    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [itemsPerPage, setItemPerPage] = useState(20);
    const startIndex = (page - 1) * itemsPerPage + 1;
    const endIndex = page * itemsPerPage;
    const totalPage = Math.ceil(totalCount / itemsPerPage);

    const location = useLocation();
    const selectedDealer = location.state?.selectedDealer || [];

    const dealerNames = selectedDealer ? selectedDealer.map((dealer: any) => dealer.value) : [];



    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [sortKey, setSortKey] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');


    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/pipeline');
    };
    const [searchInp, setSearchInp] = useState('')
    const [search, setSearch] = useState(false);

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getPipeLineData(
            {
                "dealer_names": dealerNames,
                "search_filters": {
                    "page_number": page,
                    "page_size": itemsPerPage,
                    "filters": [
                    ],
                    "sort_by": "",
                    "sort_order": ""
                }
            }
        ))
    }, [page])

    const { pipelineData } = useAppSelector((state) => state.pipelineSlice);

    useEffect(() => {
        if (pipelineData) {
            setTotalCount(pipelineData.data.count)
        }
    })
   
    const handleSort = (key: any) => {
        console.log(key, sortKey, "jghgfh")
        if (sortKey === key) {
            setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };
    



    return (
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
                                }
                            }}
                            onFocus={() => setSearch(true)}
                            onBlur={() => setSearch(false)}
                        />
                    </div>


                    <div className='skyfilter'><img src={ICONS.skyfilter} alt='' /></div>
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
                ) : !(pipelineData.data.list.data.pipeline_dealer_data_list) ? (
                    <div
                        className="flex items-center justify-center"
                        style={{ height: '100%' }}
                    >
                        <DataNotFound />
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                {pipeLineColumn?.map((item, key) => (
                                    <SortableHeader
                                        key={key}
                                        isCheckbox={item.isCheckbox}
                                        titleName={item.displayName}
                                        data={[]}
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

                            {pipelineData.data.list.data.pipeline_dealer_data_list.map((item: any, index: any) => (
                                <tr key={index}>
                                    <td>{item.unique_id || 'N/A'}</td>
                                    <td>{item.home_owner || 'N/A'}</td>
                                    <td>{item.finance_company || 'N/A'}</td>
                                    <td>{item.source_type || 'N/A'}</td>
                                    <td>{'pending'}</td>
                                    <td>{item.loan_type || 'pending'}</td>

                                    <td>{item.street_address || 'N/A'}</td>
                                    <td>{item.city || 'N/A'}</td>
                                    <td>{item.state || 'N/A'}</td>
                                    <td>{item.zip_code || 'N/A'}</td>
                                    <td>{item.email || 'N/A'}</td>
                                    <td>{item.phone_number || 'pending'}</td>

                                    <td>{item.rep_1 || 'N/A'}</td>
                                    <td>{'Not Found'}</td>
                                    <td>{item.system_size || '0'}</td>
                                    <td>${item.contract_amount || '0'}</td>
                                    <td>{item.created_date || 'N/A'}</td>
                                    <td>{item.contract_date || 'pending'}</td>

                                    <td>{item.survey_final_completion_date || 'N/A'}</td>
                                    <td>{item.ntp_complete_date || 'N/A'}</td>
                                    <td>{item.permit_submit_date || 'N/A'}</td>
                                    <td>{item.permit_approval_date || 'N/A'}</td>
                                    <td>{item.ic_submit_date || 'N/A'}</td>
                                    <td>{item.ic_approval_date || 'N/A'}</td>
                                    <td>{item.jeopardy_date || 'N/A'}</td>
                                </tr>
                            ))}


                        </tbody>
                    </table>
                )}
            </div>
            {pipelineData.data.list.data.pipeline_dealer_data_list?.length > 0 ? (
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
    )
}

export default DealerTablePipeline
