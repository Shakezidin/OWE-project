import React, { useEffect, useRef, useState } from 'react';
import './Dropdown.css';
import { ReactComponent as CROSS_BUTTON } from '../../.././resources/assets/cross_button.svg';
import { ICONS } from '../../../resources/icons/Icons';


interface TableProps {
  handleClose: () => void;
  isOpen?: boolean;
}


// Filter component
const QCModal: React.FC<TableProps> = ({
  handleClose,
  isOpen = false,
}) => {


  const handleCloseModal = () => {
    handleClose();
  };
  return (
    <div className={`filter-modal ${isOpen ? 'modal-open' : 'modal-close'} `}>
      <div className="transparent-model">
        <div className="qc-modal">
          <div className="qchead-section">

            <h3 className="createQCText" style={{ margin: 0 }}>
              Qualified Customers
            </h3>

            <div className="createUserCrossButton" onClick={handleCloseModal} style={{marginTop:"-6px"}}>
              <CROSS_BUTTON />
            </div>

          </div>
          <div className="qc-modal-body">
            <div className="createQualCust">
              <div className='qc-content'>
                <span>PowerClerk Sent(AZ)</span>
                <div className='qc-stat-comp'>
                  <div className='qc-status' style={{ backgroundColor: "#2EAF71" }}>
                    <img src={ICONS.QCTICK} alt='complete' />
                  </div>

                  <span className="status completed">Completed</span>
                </div>
              </div>

              <div className='qc-content'>
                <span>ACH Waiver (Sent and Signed)
                  (Cash Only)</span>
                <div className='qc-stat-comp'>
                  <div className='qc-status' style={{ backgroundColor: "#EBA900" }}>
                    <img src={ICONS.QCLine} alt='complete' />
                  </div>
                  <span className="status pending">Pending</span>
                </div>
              </div>

              <div className='qc-content'>
                <span>Green Area (NM Only)</span>
                <div className='qc-stat-comp'>
                  <div className='qc-status' style={{ backgroundColor: "#2EAF71" }}>
                    <img src={ICONS.QCTICK} alt='complete' />
                  </div>
                  <span className="status completed">Completed</span>
                </div>
              </div>

              <div className='qc-content'>
                <span>Finance Credit Approval
                  (Loan or Lease)</span>
                <div className='qc-stat-comp'>
                  <div className='qc-status' style={{ backgroundColor: "#2EAF71" }}>
                    <img src={ICONS.QCTICK} alt='complete' />
                  </div>
                  <span className="status completed">Completed</span>
                </div>
              </div>

              <div className='qc-content'>
                <span>Finance Agreement Completed
                  (Loan or Lease)</span>
                <div className='qc-stat-comp'>
                  <div className='qc-status' style={{ backgroundColor: "#2EAF71" }}>
                    <img src={ICONS.QCTICK} alt='complete' />
                  </div>
                  <span className="status completed">Completed</span>
                </div>
              </div>

              <div className='qc-content'>
                <span>OWE Documents Completed</span>
                <div className='qc-stat-comp'>
                  <div className='qc-status' style={{ backgroundColor: "#2EAF71" }}>
                    <img src={ICONS.QCTICK} alt='complete' />
                  </div>
                  <span className="status completed">Completed</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default QCModal;
