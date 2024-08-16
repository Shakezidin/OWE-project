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
      <div className="modal">
        <div className="filter-section">
        
          <h3 className="createProfileText" style={{ margin: 0 }}>
            Qualified Customers
          </h3>

          <div className="createUserCrossButton" onClick={handleCloseModal}>
          <CROSS_BUTTON/>
        </div>
          
        </div>
        <div className="qc-modal-body">
          <div className="createQualCust">
              <div className='qc-content'>
                <span>PowerClerk Sent(AZ)</span>
                <div className='qc-stat-comp'>
                    <img  src={ICONS.complete} alt='complete'/>
                    <span>Completed</span>
                </div>
              </div>

              <div className='qc-content'>
                <span>PowerClerk Sent</span>
                <div className='qc-stat-comp'>
                    <img  src='' alt='complete'/>
                    <span>Completed</span>
                </div>
              </div>

              <div className='qc-content'>
                <span>PowerClerk Sent</span>
                <div className='qc-stat-comp'>
                    <img  src='' alt='complete'/>
                    <span>Completed</span>
                </div>
              </div>

              <div className='qc-content'>
                <span>PowerClerk Sent</span>
                <div className='qc-stat-comp'>
                    <img  src='' alt='complete'/>
                    <span>Completed</span>
                </div>
              </div>

              <div className='qc-content'>
                <span>PowerClerk Sent</span>
                <div className='qc-stat-comp'>
                    <img  src='' alt='complete'/>
                    <span>Completed</span>
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
