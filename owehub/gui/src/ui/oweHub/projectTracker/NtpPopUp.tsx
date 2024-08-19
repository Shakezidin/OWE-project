import React, { useEffect, useRef, useState } from 'react';
import './Dropdown.css';
import { ReactComponent as CROSS_BUTTON } from '../../.././resources/assets/cross_button.svg';
import { ICONS } from '../../../resources/icons/Icons';


interface TableProps {
    handleClose: () => void;
    isOpen?: boolean;
}


// Filter component
const NtpModal: React.FC<TableProps> = ({
    handleClose,
    isOpen = false,
}) => {


    const handleCloseModal = () => {
        handleClose();
    };
    return (
        <div className={`filter-modal ${isOpen ? 'modal-open' : 'modal-close'} `}>
            <div className="transparent-model">
                <div className="ntp-modal">
                    <div className="qchead-section">

                        <h3 className="createProfileText" style={{ margin: 0 }}>
                            NTP
                        </h3>

                        <div className="createUserCrossButton" onClick={handleCloseModal} style={{ marginTop: "-6px" }}>
                            <CROSS_BUTTON />
                        </div>

                    </div>
                    <div className="qc-modal-body">
                        <div className="createQualCust">

                            <div className='qc-content'>
                                <span>Production Discrepancy</span>
                                <div className='qc-stat-comp'>
                                    <div className='qc-status' style={{ backgroundColor: "#2EAF71" }}>
                                        <img src={ICONS.QCTICK} alt='complete' />
                                    </div>

                                    <span className="status completed">Completed</span>
                                </div>
                            </div>

                            <div className='qc-content'>
                                <span>Sunpixel</span>
                                <div className='qc-stat-comp'>
                                    <div className='qc-status' style={{ backgroundColor: "#EBA900" }}>
                                        <img src={ICONS.QCLine} alt='complete' />
                                    </div>
                                    <span className="status pending">Pending</span>
                                </div>
                            </div>

                            <div className='qc-content'>
                                <span>Lease Agreement Uploaded</span>
                                <div className='qc-stat-comp'>
                                    <div className='qc-status' style={{ backgroundColor: "#2EAF71" }}>
                                        <img src={ICONS.QCTICK} alt='complete' />
                                    </div>
                                    <span className="status completed">Completed</span>
                                </div>
                            </div>

                            <div className='qc-content'>
                                <span>Light Reach Design Verification</span>
                                <div className='qc-stat-comp'>
                                    <div className='qc-status' style={{ backgroundColor: "#2EAF71" }}>
                                        <img src={ICONS.QCTICK} alt='complete' />
                                    </div>
                                    <span className="status completed">Completed</span>
                                </div>
                            </div>

                            <div className='qc-content'>
                                <span>OWE Agreement Uploaded</span>
                                <div className='qc-stat-comp'>
                                    <div className='qc-status' style={{ backgroundColor: "#E14514" }}>
                                        <img src={ICONS.QCLine} alt='complete' />
                                    </div>
                                    <span className="status action">Pending (action needed)</span>
                                </div>
                            </div>

                            <div className='qc-content'>
                                <span>HOF Uploaded</span>
                                <div className='qc-stat-comp'>
                                    <div className='qc-status' style={{ backgroundColor: "#2EAF71" }}>
                                        <img src={ICONS.QCTICK} alt='complete' />
                                    </div>
                                    <span className="status completed">Completed</span>
                                </div>
                            </div>

                            <div className='qc-content'>
                                <span>Finance Credit Approval (Loan or Lease)</span>
                                <div className='qc-stat-comp'>
                                    <div className='qc-status' style={{ backgroundColor: "#2EAF71" }}>
                                        <img src={ICONS.QCTICK} alt='complete' />
                                    </div>
                                    <span className="status completed">Completed</span>
                                </div>
                            </div>

                            <div className='qc-content'>
                                <span>Finance Agreement Completed (Loan or Lease)</span>
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
                                    <div className='qc-status' style={{ backgroundColor: "#E14514" }}>
                                        <img src={ICONS.QCLine} alt='complete' />
                                    </div>
                                    <span className="status action">Pending (action needed)</span>
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
export default NtpModal;
