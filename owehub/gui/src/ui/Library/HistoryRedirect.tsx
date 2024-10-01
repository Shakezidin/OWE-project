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
 


  useEffect(() => {
    const updateStyles = () => {
      if (window.innerWidth === 390 && window.innerHeight === 844) {
        setStyles({
          ...styles,

          marginTop: '-62px',
          paddingRight: '40px',
          paddingTop: '0px',
          paddingBottom: '0px',
        });
      } else if (window.innerWidth === 844 && window.innerHeight === 390) {
        setStyles({
          ...styles,

          paddingRight: '20px',
          paddingTop: '0px',
          paddingBottom: '20px',
        });
      } else if (window.innerWidth >= 1201) {
        setStyles({
          ...styles,

          marginBottom: '0px',
          paddingRight: '37px',
          paddingTop: '0px',
          paddingBottom: '0px',
        });
      } else {
        setStyles({
          ...styles,

          marginTop: '-61px',
          paddingRight: '0px',
          paddingTop: '0px',
          paddingBottom: '0px',
        });
      }
    };

    window.addEventListener('resize', updateStyles);
    updateStyles();

    return () => {
      window.removeEventListener('resize', updateStyles);
    };
  }, []);

  return (
    <div className="relative drop-ref-container">
      <div
        className={classes.filtericonHistory}
        onClick={HistoryButtonCalled}
        style={styles}
      >
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
            {/* <ul style={{ borderRadius: '15px' }}> */}
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
