import React, { useState, useRef, useEffect } from 'react';
import classes from './styles/sortby.module.css';
import { FaChevronDown } from "react-icons/fa6";

interface SortByLibraryProps {
  onSort: (option: 'none' | 'name' | 'date' | 'size') => void;
}

const SortByLibrary: React.FC<SortByLibraryProps> = ({ onSort }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const handleSortChange = (option: 'none' | 'name' | 'date' | 'size') => {
    onSort(option);
    setIsVisible(false); 
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current && 
        buttonRef.current && 
        !dropdownRef.current.contains(target) && 
        !buttonRef.current.contains(target)
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
    <div className={classes.sortby_container}>
      <div>
        <button onClick={handleClick} className={classes.logo_sortby_botton} ref={buttonRef}>
          Sort by          
          <div className={classes.icon}><FaChevronDown style={{ height: '15px', width: '15px' }}/></div>
        </button>
      </div>
      
      {isVisible && (
        <ul className={classes.sortlibrary_inner_div} ref={dropdownRef}>
          <li onClick={() => handleSortChange('none')}
            className={`${classes.sortbylibrary_all} ${classes.sortbylibrary_name}`}
          >
            None
          </li>
          <li onClick={() => handleSortChange('name')}
            className={`${classes.sortbylibrary_all} ${classes.sortbylibrary_name}`}
          >
            Name
          </li>
          <li onClick={() => handleSortChange('date')}
            className={`${classes.sortbylibrary_all} ${classes.sortbylibrary_date}`}
          >
            Date
          </li>
          <li onClick={() => handleSortChange('size')}
            className={`${classes.sortbylibrary_all} ${classes.sortbylibrary_size}`}
          >
            Size
          </li>
        </ul>
      )}
    </div>
  );
};

export default SortByLibrary;
