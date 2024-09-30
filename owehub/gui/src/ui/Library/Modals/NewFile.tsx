import React, { useEffect, useRef, useState } from 'react';
import classes from './styles/newfile.module.css';

const NewFile = () => {
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={classes.newfile_container} ref={dropdownRef}>
      <button
        onClick={handleClick}
        className={classes.newfile_botton}
        style={
          isVisible ? { backgroundColor: '#377cf6', color: '#ffffff' } : {}
        }
      >
        + New
      </button>
      {isVisible && (
        <ul className={classes.newfilelibrary_uploadbutton_container}>
          <li className={classes.newfilelibrary_uploadbutton_inner}>
            <button className={classes.newfilelibrary_uploadbutton}>
              + Upload file
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default NewFile;
