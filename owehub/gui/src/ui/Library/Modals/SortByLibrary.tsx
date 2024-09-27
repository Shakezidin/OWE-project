import React, { useState } from 'react';
import classes from './styles/sortby.module.css';
import { FaChevronDown } from "react-icons/fa6";

interface SortByLibraryProps {
  onSort: (option: 'none' | 'name' | 'date' | 'size') => void;
}

const SortByLibrary: React.FC<SortByLibraryProps> = ({ onSort }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'none' | 'name' | 'date' | 'size'>('none');

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const handleSortChange = (option: 'none' | 'name' | 'date' | 'size') => {
    setSelectedOption(option);
    onSort(option);
    setIsVisible(false);
  };

  return (
    <div className={classes.sortby_container}>
      <div>
        <button onClick={handleClick} className={classes.logo_sortby_botton} style={isVisible ? { backgroundColor: '#377cf6', color: '#ffffff' } : {}}>
        Sort by          
        <div className={classes.icon}><FaChevronDown style={{ height: '15px', width: '15px' }}/></div>
        </button>
      </div>
      
      {isVisible && (
        <ul className={classes.sortlibrary_inner_div}>
          <li 
            onClick={() => handleSortChange('none')}
            className={`${classes.sortbylibrary_all} ${classes.sortbylibrary_name} ${selectedOption === 'none' ? classes.selected : ''}`}
          >
            None
          </li>
          <li 
            onClick={() => handleSortChange('name')}
            className={`${classes.sortbylibrary_all} ${classes.sortbylibrary_name} ${selectedOption === 'name' ? classes.selected : ''}`}
          >
            Name
          </li>
          <li 
            onClick={() => handleSortChange('date')}
            className={`${classes.sortbylibrary_all} ${classes.sortbylibrary_date} ${selectedOption === 'date' ? classes.selected : ''}`}
          >
            Date
          </li>
          <li 
            onClick={() => handleSortChange('size')}
            className={`${classes.sortbylibrary_all} ${classes.sortbylibrary_size} ${selectedOption === 'size' ? classes.selected : ''}`}
          >
            Size
          </li>
        </ul>
      )}
    </div>
  );
};

export default SortByLibrary;
