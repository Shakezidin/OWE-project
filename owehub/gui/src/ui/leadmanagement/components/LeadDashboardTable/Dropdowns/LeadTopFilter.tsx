import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './index.module.css';
import ThreeDotsImage from './stylesFolder/ThreeDots.svg';
import { CiFilter } from 'react-icons/ci';
interface HistoryRedirectProps {
  setArchive: (value: boolean) => void;
}

const LeadTableFilter = ({ setArchive }: HistoryRedirectProps) => {
  const [modenIsOpenX, setModalOpenClick] = useState(false);
  const clickableDivRef = useRef<HTMLDivElement>(null);
  const HistoryButtonCalled = () => {
    setModalOpenClick((prevState) => !prevState);
  };
  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    const target = event.target as Node;

    if (clickableDivRef.current && !clickableDivRef.current.contains(target)) {
      setModalOpenClick(false);
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const [selectedValue, setSelectedValue] = useState('');

  const handleItemClick = (value: string) => {
    setSelectedValue(value);
    setModalOpenClick(false);
  };

  return (
    <div className="relative drop-ref-container" ref={clickableDivRef}>
      <div className={classes.filtericonLead} onClick={HistoryButtonCalled}>
        <CiFilter size={20} fontWeight={600} />
      </div>
      {modenIsOpenX && (
        <div id="dropdowninHistoryRedirect" className="pr-dropdown editedinParent">
          <ul>
            <li
              className={`${classes.selectedFilter} ${selectedValue === 'All' ? classes.active : ''}`}
              onClick={() => handleItemClick('All')}
            >
              All{' '}
            </li>

            <li
              className={`${classes.selectedFilter} ${selectedValue === 'Deal Won' ? classes.active : ''}`}
              onClick={() => handleItemClick('Deal Won')}
            >
              {' '}
              Deal Won
            </li>
            <li
              className={`${classes.selectedFilter} ${selectedValue === 'Appointment Accepted' ? classes.active : ''}`}
              onClick={() => handleItemClick('Appointment Accepted')}
            >
              Appointment Accepted{' '}
            </li>
            <li
              style={{
                fontSize: '12px',
                color: selectedValue === 'Appointment Sent' ? '#fff !important' : '#000 !important',
                backgroundColor: selectedValue === 'Appointment Sent' ? '#377cf6' : 'transparent',
              }}
              onClick={() => handleItemClick('Appointment Sent')}
            >
              {' '}
              Appointment Sent
            </li>
            <li
              style={{
                fontSize: '12px',
                color: selectedValue === 'Proposal In Progress' ? '#fff !important' : '#000 !important',
                backgroundColor: selectedValue === 'Proposal In Progress' ? '#377cf6' : 'transparent',
              }}
              onClick={() => handleItemClick('Proposal In Progress')}
            >
              Proposal In Progress{' '}
            </li>
            <li
              style={{
                fontSize: '12px',
                color: selectedValue === 'Appointment Not Required' ? '#fff !important' : '#000 !important',
                backgroundColor: selectedValue === 'Appointment Not Required' ? '#377cf6' : 'transparent',
              }}
              onClick={() => handleItemClick('Appointment Not Required')}
            >
              {' '}
              Appointment Not Required
            </li>
          </ul>
        </div>
      )}
      {/* )} */}
    </div>
  );
};

export default LeadTableFilter;
