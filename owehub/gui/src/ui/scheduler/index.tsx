import React from 'react';
import styles from './styles/index.module.css';
import CustomersList from './components/CustomersList';
import PendingReview from './components/PendingReview';
import Pagination from '../components/pagination/Pagination';
const Index = () => {
  return (
    <>
      <div>
        <h1 className={styles.schedule_detail}>Schedule</h1>
        <div className="flex items-center">
          <h5 style={{ fontSize: 12 }} className={styles.primary_heading}>
            Customer Queue {`>`}{' '}
          </h5>
          <span className="ml1" style={{ fontSize: 12 }}>
            {' '}
            Schedule{' '}
          </span>
        </div>
      </div>
      <div className={`flex justify-between mt2 items-start`}>
        <div className={styles.customer_wrapper_list}>
          <CustomersList />

          <div className="page-heading-container px0">
            <p className="page-heading">1 - 10 of 50 item</p>

            <Pagination
              currentPage={1}
              totalPages={12} // You need to calculate total pages
              paginate={(num) => num}
              currentPageData={[]}
              goToNextPage={() => 0}
              goToPrevPage={() => 0}
              perPage={10}
            />
          </div>
        </div>
        <div className={styles.pending_review_wrapper}>
          <PendingReview />
        </div>
      </div>
    </>
  );
};

export default Index;
