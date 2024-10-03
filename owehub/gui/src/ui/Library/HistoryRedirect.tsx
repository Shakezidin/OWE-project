import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './stylesFolder/HistoryRedirect.module.css';
import ThreeDotsImage from './stylesFolder/ThreeDots.svg';
interface HistoryRedirectProps {
  setArchive: (value: boolean) => void;
}

const HistoryRedirect = ({ setArchive }: HistoryRedirectProps) => {
  const [modenIsOpenX, setModalOpenClick] = useState(false);
  const navigate = useNavigate();
  const divRef = useRef<HTMLDivElement | null>(null);

  const handleHistory = () => {
    navigate('/leadmng-history');
  };

  const ArchivesTable = () => {
    setArchive(true);
  };

  /* HERE FOR RESPONSIVESNESS */
  const [styles, setStyles] = useState({
    transform: 'scale(1) translate(0, 0)',
    marginRight: '15px',
    marginLeft: '0px',
    marginTop: '0px',
    marginBottom: '0px', // Corrected from marginBotton
    paddingRight: '36px',
    paddingTop: '0px',
    paddingBottom: '0px',
  });

  const HistoryButtonCalled = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('called');
    setModalOpenClick((prevState) => !prevState);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setModalOpenClick(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ***NOT WRITE INSIDE BUTTONS DUE TO INCREASE BUTTONS INSIDE ITEMS***

  return (
    <div className="relative drop-ref-container">
      <div className={classes.filtericonHistory} onClick={HistoryButtonCalled}>
        <img
          className={classes.ICONSTYLETHREEDOT}
          src={ThreeDotsImage}
          alt=""
          width="100"
          height="100"
        />
      </div>
      {modenIsOpenX && (
        <div
          id="dropdowninHistoryRedirect"
          className="pr-dropdown editedinParent"
          onClick={(event) => event.stopPropagation()}
          ref={divRef}
        >
          <ul>
            <li style={{ color: '#000 !important' }} onClick={handleHistory}>
              History{' '}
            </li>
            <li style={{ color: '#000 !important' }} onClick={ArchivesTable}>
              {' '}
              Archives
            </li>
          </ul>
        </div>
      )}
      {/* )} */}
    </div>
  );
};

export default HistoryRedirect;
