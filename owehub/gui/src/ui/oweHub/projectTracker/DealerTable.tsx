import React, { useState } from 'react'
import './dealertable.css'
import pipeLineColumn from '../../../resources/static_data/pipeLineColumn'
import SortableHeader from '../../components/tableHeader/SortableHeader'
import DataNotFound from '../../components/loader/DataNotFound'
import MicroLoader from '../../components/loader/MicroLoader'

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
    return (
        <div className="dashBoard-container">
            <div
                className="TableContainer"
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

                                <td style={{ color: '#101828' }}>
                                    test
                                </td>
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
