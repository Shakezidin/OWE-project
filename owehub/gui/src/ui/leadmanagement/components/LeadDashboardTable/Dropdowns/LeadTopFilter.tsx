import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './index.module.css';
import ThreeDotsImage from './stylesFolder/ThreeDots.svg';
import { CiFilter } from 'react-icons/ci';
import { FaFilter } from 'react-icons/fa';
interface HistoryRedirectProps {
  setArchive: (value: boolean) => void;
}

interface SelectedValueState {
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
}

const LeadTableFilter: React.FC<SelectedValueState> = ({ selectedValue = 'ALL', setSelectedValue }) => {
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

  

  const handleItemClick = (value: string) => {
    setSelectedValue(value);
    setModalOpenClick(false);
  };

  console.log(selectedValue, "what happens")

  return (
    <div className="relative drop-ref-container" ref={clickableDivRef}>
      <div className={classes.filtericonLead} onClick={HistoryButtonCalled}>
        <FaFilter size={14} fontWeight={600} />
      </div>
      {modenIsOpenX && (
        <div id="dropdowninHistoryRedirect" className="pr-dropdown editedinParent">
          <ul>


            <li
              className={`${classes.selectedFilter} ${selectedValue === 'ALL' ? classes.active : ''}`}
              onClick={() => handleItemClick('ALL')}
            >
              All{' '}
            </li>


            <li
              className={`${classes.selectedFilter} ${selectedValue === 'DEAL_WON' ? classes.active : ''}`}
              onClick={() => handleItemClick('DEAL_WON')}
            >
             
              Deal Won
            </li>


            <li
              className={`${classes.selectedFilter} ${selectedValue === 'APPOINTMENT_ACCEPTED' ? classes.active : ''}`}
              onClick={() => handleItemClick('APPOINTMENT_ACCEPTED')}
            >
              Appointment Accepted{' '}
            </li>
            <li className={`${classes.selectedFilter} ${selectedValue === 'APPOINTMENT_SENT' ? classes.active : ''}`}
              
              onClick={() => handleItemClick('APPOINTMENT_SENT')}
            >
              {' '}
              Appointment Sent
            </li>
            <li className={`${classes.selectedFilter} ${selectedValue === 'PROPOSAL_IN_PROGRESS' ? classes.active : ''}`}
              
              onClick={() => handleItemClick('PROPOSAL_IN_PROGRESS')}
            >
              Proposal In Progress{' '}
            </li>
            <li className={`${classes.selectedFilter} ${selectedValue === 'APPOINTMENT_NOT_REQUIRED' ? classes.active : ''}`}
             
              onClick={() => handleItemClick('APPOINTMENT_NOT_REQUIRED')}
            >
              {' '}
              Appointment Not Required
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeadTableFilter;