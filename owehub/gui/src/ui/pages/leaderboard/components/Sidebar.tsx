import React, { Dispatch, SetStateAction } from 'react';
import {
  ArrowForward,
  FirstAwardIcon,
  Growth,
  ServiceIcon,
  SuccessIcon,
} from './Icons';

const Sidebar = ({
  isOpen,
  setIsOpen,
}: {
  isOpen?: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      className="user-profile-sidebar-fixed scrollbar"
      style={{ right: isOpen ? '0' : '-100%', transition: 'all 500ms' }}
    >
      <div className="user-sidebar ml-auto relative">
        <span onClick={() => setIsOpen(false)} className="absolute back-icon block">
          <ArrowForward />
        </span>
        <div className="user-profile">
          <div className="user-card">
            <div className="flex items-center user-name-wrapper px2">
              <FirstAwardIcon width={40} height={34} />
              <div className="ml2">
                <h3
                  className="h5 mb0"
                  style={{ lineHeight: '12px', fontSize: 20, color: '#434343' }}
                >
                  John Doe
                </h3>
                <p
                  className=""
                  style={{ color: '#434343', fontSize: 10, marginTop: 6 }}
                >
                  OUR31245
                </p>
              </div>
            </div>
            <div className="mt2 px2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="card-label block">Team name</span>
                  <h6 className="card-value">UNITED SOLAR</h6>
                </div>
                <div>
                  <span className="card-label block">Contact number</span>
                  <h6 className="card-value">+91 1234567890</h6>
                </div>
              </div>
              <div className="mt1">
                <span className="card-label block">Email address</span>
                <h6 className="card-value">Royalaekin@gmail.com</h6>
              </div>
            </div>
          </div>
          <div className="mt3">
            <h4 className="h4" style={{ fontWeight: 600 }}>
              Performance
            </h4>
            <div className="mt2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="icon">
                    <Growth />
                  </div>
                  <div>
                    <span className="stats-labels">Total Sales</span>
                    <span
                      style={{ fontSize: 21, fontWeight: 700 }}
                      className="block"
                    >
                      256
                    </span>
                  </div>
                </div>

                <div>
                  <div className="icon">
                    <SuccessIcon />
                  </div>
                  <div>
                    <span className="stats-labels">Total Sales</span>
                    <span
                      style={{ fontSize: 21, fontWeight: 700 }}
                      className="block"
                    >
                      256
                    </span>
                  </div>
                </div>

                <div>
                  <div className="icon">
                    <ServiceIcon />
                  </div>
                  <div>
                    <span className="stats-labels">Total Sales</span>
                    <span
                      style={{ fontSize: 21, fontWeight: 700 }}
                      className="block"
                    >
                      256
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
