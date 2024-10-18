import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { PiSortAscendingLight } from 'react-icons/pi';
import './index.css';
import classes from "./LeadDashboardTable/Dropdowns/index.module.css"
import { CiFilter } from 'react-icons/ci';
import useEscapeKey from '../../../hooks/useEscape';
interface propTypes {
  onChange?: (val: number) => void;
  default?: 'asc' | 'desc' | 'all';
}
const SortingDropDown = ({ default: defaultSort, onChange }: propTypes) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSelectedValue, setSelectedValue]=useState()
  const [isActiveX, setIsActiveX] = useState<'asc' | 'desc' | 'all'>('all');
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const dropdownRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const elm = event.target as HTMLElement;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !elm.closest('.pr-dropdown')
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


useEscapeKey(toggleDropdown);

  return (
    <div className="relative drop-ref-container">
      <button
        onClick={toggleDropdown}
        ref={dropdownRef}
        className={`flex items-center justify-center  sort_btn`}
      >
        <CiFilter size={22} />
      </button>

      {isDropdownOpen && (
        
        <div id="dropdowninHistoryRedirect" className="pr-dropdown editedinParentHTRY">
          <ul>
            <li
              onClick={() => {
                setIsActiveX('all');
                setIsDropdownOpen(false);
                onChange?.(-1);
              }}
              className={`${classes.selectedFilter} ${isActiveX === 'all' ?classes.active : ''}`}
              
            >
              All
            </li>
            <li
              onClick={() => {
                setIsActiveX('desc');
                setIsDropdownOpen(false);
                onChange?.(6);
              }}
              className={`${classes.selectedFilter} ${isActiveX === 'desc' ?classes.active : ''}`}
             
            >
              Deal Loss
            </li>
            <li
              onClick={() => {
                setIsActiveX('asc');
                setIsDropdownOpen(false);
                onChange?.(5);
              }}
              className={`${classes.selectedFilter} ${isActiveX === 'asc' ?classes.active : ''}`}
            
            >
              Deal Won
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortingDropDown;
