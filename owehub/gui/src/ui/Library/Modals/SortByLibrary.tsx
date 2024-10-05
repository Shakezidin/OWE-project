import React, { useEffect, useRef, useState, useCallback } from 'react';
import classes from './styles/sortby.module.css';
import { FaChevronDown } from 'react-icons/fa6';

interface SortByLibraryProps {
  onSort: (option: 'none' | 'name' | 'date' | 'size') => void;
}

const SortByLibrary: React.FC<SortByLibraryProps> = ({ onSort }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<
    'none' | 'name' | 'date' | 'size'
  >('none');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClick = () => {
    setIsVisible((prev) => !prev);
  };

  const handleSortChange = (option: 'none' | 'name' | 'date' | 'size') => {
    setSelectedOption(option);
    onSort(option);
    setIsVisible(false);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsVisible(false);
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
        <FaChevronDown
          className={`${classes.icon} ${isVisible ? classes.icon_active : ''}`}
        />
      </button>

      {isVisible && (
        <ul className={classes.dropdownMenu}>
          {['none', 'name', 'date', 'size'].map((option) => (
            <li
              key={option}
              onClick={() =>
                handleSortChange(option as 'none' | 'name' | 'date' | 'size')
              }
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
