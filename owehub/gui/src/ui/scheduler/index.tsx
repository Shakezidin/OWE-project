import React from 'react';
import styles from './styles/index.module.css';
import CustomersList from './components/CustomersList';
import PendingReview from './components/PendingReview';
const Index = () => {
  return (
    <>
      <div>
        <h1 className={styles.schedule_detail}>Schedule</h1>
        <div className="flex items-center">
          <h5 style={{ fontSize: 12 }} className={styles.primary_heading}>
            Customer Queue {`>`}{' '}
          </h5>
          <span className='ml1' style={{ fontSize: 12 }}> Schedule </span>
        </div>
      </div>
      <div className={`flex justify-between mt2 ${styles.h_screen}`}>
        <div className={styles.customer_wrapper_list}>
          <CustomersList />
        </div>
        <div className={styles.pending_review_wrapper}>
          <PendingReview />
        </div>
      </div>
    </>
  );
};

export default Index;
