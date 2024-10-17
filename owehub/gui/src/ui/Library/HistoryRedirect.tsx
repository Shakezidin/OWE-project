import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './stylesFolder/HistoryRedirect.module.css';
import ThreeDotsImage from './stylesFolder/ThreeDots.svg';
import useEscapeKey from '../../hooks/useEscape';
interface HistoryRedirectProps {
  setArchive: (value: boolean) => void;
}

// { setArchive }: HistoryRedirectProps

const HistoryRedirect = () => {
  const [modenIsOpenX, setModalOpenClick] = useState(false);
  const navigate = useNavigate();
  const clickableDivRef = useRef<HTMLDivElement>(null);

  const handleHistory = () => {
    navigate('/leadmng-history');
  };

  const ArchivesTable = () => {
    // setArchive(true);
    navigate('/lead-dashboard-archieves');
  };

  /* HERE FOR RESPONSIVESNESS */
  // const [styles, setStyles] = useState({
  //   transform: 'scale(1) translate(0, 0)',
  //   marginRight: '15px',
  //   marginLeft: '0px',
  //   marginTop: '0px',
  //   marginBottom: '0px',
  //   paddingRight: '36px',
  //   paddingTop: '0px',
  //   paddingBottom: '0px',
  // });

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

  const handleClose = () => {
    setModalOpenClick(false);
  }

  useEscapeKey(handleClose)


  // ***NOT WRITE INSIDE BUTTONS DUE TO INCREASE BUTTONS INSIDE ITEMS***

  return (
    <div className="relative drop-ref-container" ref={clickableDivRef}>
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
