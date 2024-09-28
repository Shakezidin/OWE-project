import React, { useEffect, useRef, useState, useCallback } from 'react';
import classes from './styles/sortby.module.css';
import { FaChevronDown } from "react-icons/fa6";

interface SortByLibraryProps {
  onSort: (option: 'none' | 'name' | 'date' | 'size') => void;
}

const SortByLibrary: React.FC<SortByLibraryProps> = ({ onSort }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'none' | 'name' | 'date' | 'size'>('none');
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ensure ref is applied correctly

  const handleClick = () => {
    setIsVisible(prev => !prev);
  };

  const handleSortChange = (option: 'none' | 'name' | 'date' | 'size') => {
    setSelectedOption(option);
    onSort(option);
    setIsVisible(false); // Close dropdown when a sort option is selected
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    // Debugging: Check if the ref and event.target are working as expected
    console.log("Click event:", event.target);
    console.log("Dropdown ref:", dropdownRef.current);

    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsVisible(false); // Close dropdown if clicked outside
      console.log("Clicked outside, closing dropdown");
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className={classes.sortby_container} ref={dropdownRef}>
      <button
        onClick={handleClick}
        className={`${classes.logo_sortby_botton} ${isVisible ? classes.active : ''}`}
      >
        Sort by
        <FaChevronDown className={classes.icon} />
      </button>

      {isVisible && (
        // <ul className={classes.sortlibrary_inner_div}>
        <ul className={classes.dropdownMenu}>
        {['none', 'name', 'date', 'size'].map(option => (
            <li
              key={option}
              onClick={() => handleSortChange(option as 'none' | 'name' | 'date' | 'size')}
              // className={`${classes.sortbylibrary_all} ${selectedOption === option ? classes.selected : ''}`}
              className={`${classes.dropdownItem} ${selectedOption === option ? classes.selected : ''}`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortByLibrary;
