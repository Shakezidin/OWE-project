import React from 'react';
import styles from './styles/index.module.css';
import CustomersList from './components/CustomersList';
import PendingReview from './components/PendingReview';
const Index = () => {
  return (
    <>
      <div>
        <h1>Scheduler</h1>
      </div>
      <div className={`flex justify-between mt2 ${styles.h_screen}`}>
        <div className={styles.customer_wrapper_list}>
          <CustomersList />
        </div>
        <div className={styles.pending_review_wrapper}>
            <PendingReview/>
        </div>
      </div>
    </>
  );
};

export default Index;
