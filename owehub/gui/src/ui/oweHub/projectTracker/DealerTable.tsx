import React, { useState } from 'react'
import './dealertable.css'
import pipeLineColumn from '../../../resources/static_data/pipeLineColumn'
import SortableHeader from '../../components/tableHeader/SortableHeader'
import DataNotFound from '../../components/loader/DataNotFound'
import MicroLoader from '../../components/loader/MicroLoader'
import { ICONS } from '../../../resources/icons/Icons'
import { BiArrowBack } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { IoMdSearch } from 'react-icons/io'

const DealerTablePipeline = () => {

    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [sortKey, setSortKey] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const handleSort = (key: any) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };
    if (sortKey) {
        [].sort((a: any, b: any) => {
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
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/pipeline');
    };
    const [searchInp, setSearchInp] = useState('')
    const [search, setSearch] = useState(false);
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
                {false ? (
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
                ) : false ? (
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

                            <tr>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                            </tr>
                            <tr>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                                <td>test</td>
                            </tr>

                        </tbody>
                    </table>
                )}
            </div>
            {/* {currentPageData?.length > 0 ? (
          <div className="page-heading-container">
            <p className="page-heading">
              Showing {startIndex} - {endIndex > count ? count : endIndex} of{' '}
              {count} item
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
        ) : null} */}
        </div>
    )
}

export default DealerTablePipeline
