import React, { useEffect, useRef, useState } from 'react';
import './Dropdown.css';
import { ReactComponent as CROSS_BUTTON } from '../../.././resources/assets/cross_button.svg';
import { ICONS } from '../../../resources/icons/Icons';

interface TableProps {
  handleClose: () => void;
  isOpen?: boolean;
  projectDetail: any
}

// Filter component
const NtpModal: React.FC<TableProps> = ({ projectDetail, handleClose, isOpen = false }) => {
  const handleCloseModal = () => {
    handleClose();
  };

  const renderNTPContent = (title: string, status: string) => {
    let backgroundColor = '';
    let icon = '';
    let statusText = '';
    let statusClass = '';

    switch (status) {
      case 'Completed':
        backgroundColor = '#2EAF71';
        icon = ICONS.QCTICK;
        statusText = 'Completed';
        statusClass = 'completed';
        break;
      case 'Pending':
        backgroundColor = '#EBA900';
        icon = ICONS.QCLine;
        statusText = 'Pending';
        statusClass = 'pending';
        break;
      case 'Pending (Action Required)':
        backgroundColor = '#E14514';
        icon = ICONS.QCLine;
        statusText = 'Pending (Action Required)';
        statusClass = 'action';
        break;
      default:
        backgroundColor = '#EBA900';
        icon = ICONS.QCLine;
        statusText = 'Pending';
        statusClass = 'pending';
    }
   
    return (
      <div className="qc-content">
        <span>{title}</span>
        <div className="qc-stat-comp">
          <div className="qc-status" style={{ backgroundColor }}>
            <img src={icon} alt={statusText} />
          </div>
          <span className={`status ${statusClass}`}>{statusText}</span>
        </div>
      </div>
    );
  };

  const formatTitle = (key: string) => {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const ntpData = projectDetail?.ntp;


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
              {ntpData && (
                <>
                {Object.entries(ntpData)
                  .filter(([key]) => key !== 'action_required_count')
                  .map(([key, value]) => (
                    <div key={key}>{renderNTPContent(formatTitle(key), value as string)}</div>
                  ))}
              </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NtpModal;



{/* <div className="createQualCust">
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
</div> */}

