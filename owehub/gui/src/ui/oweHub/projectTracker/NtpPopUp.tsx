import React, { useEffect, useRef, useState } from 'react';
import './Dropdown.css';
import { ReactComponent as CROSS_BUTTON } from '../../.././resources/assets/cross_button.svg';
import { ICONS } from '../../../resources/icons/Icons';

interface TableProps {
  handleClose: () => void;
  isOpen?: boolean;
  projectDetail:any
}

// Filter component
const NtpModal: React.FC<TableProps> = ({projectDetail, handleClose, isOpen = false }) => {
  const handleCloseModal = () => {
    handleClose();
  };

  const renderNTPContent = (title: string, status: string) => {
    let backgroundColor = '';
    let icon = '';
    let statusText = '';

    switch (status) {
      case 'completed':
        backgroundColor = '#2EAF71';
        icon = ICONS.QCTICK;
        statusText = 'Completed';
        break;
      case 'pending':
        backgroundColor = '#EBA900';
        icon = ICONS.QCLine;
        statusText = 'Pending';
        break;
        case 'action':
        backgroundColor = '#E14514';
        icon = ICONS.QCLine;
        statusText = 'Pending (action needed)';
        break;
      default:
        backgroundColor = '#EBA900';
        icon = ICONS.QCLine;
        statusText = 'Pending';
    }return (
      <div className="qc-content">
        <span>{title}</span>
        <div className="qc-stat-comp">
          <div className="qc-status" style={{ backgroundColor }}>
            <img src={icon} alt={statusText} />
          </div>
          <span className={`status ${status}`}>{statusText}</span>
        </div>
      </div>
    );
  };

  const ntpData = projectDetail.ntp;

  
  return (
    <div className={`filter-modal ${isOpen ? 'modal-open' : 'modal-close'} `}>
      <div className="transparent-model">
        <div className="ntp-modal">
          <div className="qchead-section">
            <h3 className="createProfileText" style={{ margin: 0 }}>
              NTP
            </h3>

            <div
              className="createUserCrossButton"
              onClick={handleCloseModal}
              style={{ marginTop: '-6px' }}
            >
              <CROSS_BUTTON />
            </div>
          </div>
          <div className="qc-modal-body">
            <div className="createQualCust">
              <div className="qc-content">
                <span>Production Discrepancy</span>
                <div className="qc-stat-comp">
                  <div
                    className="qc-status"
                    style={{ backgroundColor: '#2EAF71' }}
                  >
                    <img src={ICONS.QCTICK} alt="complete" />
                  </div>

                  <span className="status completed">Completed</span>
                </div>
              </div>

              <div className="qc-content">
                <span>Sunpixel</span>
                <div className="qc-stat-comp">
                  <div
                    className="qc-status"
                    style={{ backgroundColor: '#EBA900' }}
                  >
                    <img src={ICONS.QCLine} alt="complete" />
                  </div>
                  <span className="status pending">Pending</span>
                </div>
              </div>

              <div className="qc-content">
                <span>Lease Agreement Uploaded</span>
                <div className="qc-stat-comp">
                  <div
                    className="qc-status"
                    style={{ backgroundColor: '#2EAF71' }}
                  >
                    <img src={ICONS.QCTICK} alt="complete" />
                  </div>
                  <span className="status completed">Completed</span>
                </div>
              </div>

              <div className="qc-content">
                <span>Light Reach Design Verification</span>
                <div className="qc-stat-comp">
                  <div
                    className="qc-status"
                    style={{ backgroundColor: '#2EAF71' }}
                  >
                    <img src={ICONS.QCTICK} alt="complete" />
                  </div>
                  <span className="status completed">Completed</span>
                </div>
              </div>

              <div className="qc-content">
                <span>OWE Agreement Uploaded</span>
                <div className="qc-stat-comp">
                  <div
                    className="qc-status"
                    style={{ backgroundColor: '#E14514' }}
                  >
                    <img src={ICONS.QCLine} alt="complete" />
                  </div>
                  <span className="status action">Pending (action needed)</span>
                </div>
              </div>

              <div className="qc-content">
                <span>HOF Uploaded</span>
                <div className="qc-stat-comp">
                  <div
                    className="qc-status"
                    style={{ backgroundColor: '#2EAF71' }}
                  >
                    <img src={ICONS.QCTICK} alt="complete" />
                  </div>
                  <span className="status completed">Completed</span>
                </div>
              </div>

              <div className="qc-content">
                <span>Utility Acknowledgement and
                Disclaimer Uploaded</span>
                <div className="qc-stat-comp">
                  <div
                    className="qc-status"
                    style={{ backgroundColor: '#2EAF71' }}
                  >
                    <img src={ICONS.QCTICK} alt="complete" />
                  </div>
                  <span className="status completed">Completed</span>
                </div>
              </div>

              <div className="qc-content">
                <span>ACH Waiver (Cash Customers Only) Uploaded</span>
                <div className="qc-stat-comp">
                  <div
                    className="qc-status"
                    style={{ backgroundColor: '#2EAF71' }}
                  >
                    <img src={ICONS.QCTICK} alt="complete" />
                  </div>
                  <span className="status completed">Completed</span>
                </div>
              </div>

              <div className="qc-content">
                <span>Finance NTP of project</span>
                <div className="qc-stat-comp">
                  <div
                    className="qc-status"
                    style={{ backgroundColor: '#E14514' }}
                  >
                    <img src={ICONS.QCLine} alt="complete" />
                  </div>
                  <span className="status action">Pending (action needed)</span>
                </div>
              </div>

              <div className="qc-content">
                <span>F.NTP Approved</span>
                <div className="qc-stat-comp">
                  <div
                    className="qc-status"
                    style={{ backgroundColor: '#2EAF71' }}
                  >
                    <img src={ICONS.QCTICK} alt="complete" />
                  </div>
                  <span className="status completed">Completed</span>
                </div>
              </div>

              <div className="qc-content">
                <span>Utility bill Uploaded</span>
                <div className="qc-stat-comp">
                  <div
                    className="qc-status"
                    style={{ backgroundColor: '#2EAF71' }}
                  >
                    <img src={ICONS.QCTICK} alt="complete" />
                  </div>
                  <span className="status completed">Completed</span>
                </div>
              </div>

              <div className="qc-content">
                <span>⁠PowerClerk Signatures
                Complete</span>
                <div className="qc-stat-comp">
                  <div
                    className="qc-status"
                    style={{ backgroundColor: '#2EAF71' }}
                  >
                    <img src={ICONS.QCTICK} alt="complete" />
                  </div>
                  <span className="status completed">Completed</span>
                </div>
              </div>

              <div className="qc-content">
                <span>Over Net $3.6/w?</span>
                <div className="qc-stat-comp">
                  <div
                    className="qc-status"
                    style={{ backgroundColor: '#2EAF71' }}
                  >
                    <img src={ICONS.QCTICK} alt="complete" />
                  </div>
                  <span className="status completed">Completed</span>
                </div>
              </div>

              <div className="qc-content">
                <span>⁠Premium Pane Adder? (.10c)</span>
                <div className="qc-stat-comp">
                  <div
                    className="qc-status"
                    style={{ backgroundColor: '#2EAF71' }}
                  >
                    <img src={ICONS.QCTICK} alt="complete" />
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
export default NtpModal;

