import React, { useEffect, useState } from 'react';
import '../../configure/configure.css';
import { setCurrentPage } from '../../../../redux/apiSlice/paginationslice/paginationSlice';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import Breadcrumb from '../../../components/breadcrumb/Breadcrumb';
import { FaArrowDown } from 'react-icons/fa6';
import { fetchDBManagerUserActivity } from '../../../../redux/apiActions/DBManagerAction/DBManagerAction';
import { getCurrentDateFormatted } from '../../../../utiles/formatDate';
import { DBManagerUserActivityModel } from '../../../../core/models/api_models/DBManagerModel';
import DataNotFound from '../../../components/loader/DataNotFound';
import Pagination from '../../../components/pagination/Pagination';

const UserActivity: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, userActivityList, totalCount } = useAppSelector(
    (state) => state.dbManager
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      start_date: '2024-05-01', //TODO: Need to change in future
      end_date: getCurrentDateFormatted(), // current date
    };
    dispatch(fetchDBManagerUserActivity(pageNumber));
  }, [dispatch, currentPage]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const filter = () => {};

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = currentPage * itemsPerPage;

  return (
    <div className="comm">
      <Breadcrumb
        head="User Activity"
        linkPara="Database Manager"
        route={''}
        linkparaSecond="User Activity"
      />
      <div className="commissionContainer">
        <div className="commissionSection">
          <h3>Activity List</h3>
        </div>
        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          <table>
            <thead>
              <tr>
                <th style={{ paddingLeft: '10px' }}>
                  <div className="table-header">
                    <p>User Name</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>DB Name</p> <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Time & Date</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Query Details</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {userActivityList && userActivityList?.length > 0 ? (
                userActivityList?.map((el: DBManagerUserActivityModel) => (
                  <tr key={el.time_date}>
                    <td
                      style={{
                        fontWeight: '500',
                        color: 'black',
                        paddingLeft: '10px',
                        textAlign: 'left',
                      }}
                    >
                      {el.username}
                    </td>
                    <td style={{ textAlign: 'left' }}>{el.db_name}</td>
                    <td style={{ textAlign: 'left' }}>{el.time_date}</td>
                    <td style={{ textAlign: 'left' }}>{el.query_details}</td>
                  </tr>
                ))
              ) : (
                <tr style={{ border: 0 }}>
                  <td colSpan={10}>
                    <div className="data-not-found">
                      <DataNotFound />
                      <h3>Data Not Found</h3>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="page-heading-container">
          <p className="page-heading">
            {startIndex} - {endIndex} of {totalCount} item
          </p>

          {userActivityList && userActivityList?.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              currentPageData={userActivityList.slice(startIndex, endIndex)}
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

export default UserActivity;
