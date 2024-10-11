import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { PiSortAscendingLight } from 'react-icons/pi';
import './index.css';
import { CiFilter } from 'react-icons/ci';
interface propTypes {
  onChange?: (val: number) => void;
  default?: 'asc' | 'desc' | 'all';
}
const SortingDropDown = ({ default: defaultSort, onChange }: propTypes) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isActive, setIsActive] = useState<'asc' | 'desc' | 'all'>('all');
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
        <div className="pr-dropdown">
          <ul>
            <li
              onClick={() => {
                setIsActive('all');
                setIsDropdownOpen(false);
                onChange?.(-1);
              }}
              className={isActive === 'all' ? 'active_sorting' : ''}
            >
              All
            </li>
            <li
              onClick={() => {
                setIsActive('desc');
                setIsDropdownOpen(false);
                onChange?.(6);
              }}
              className={isActive === 'desc' ? 'active_sorting' : ''}
            >
              Deal Loss
            </li>
            <li
              onClick={() => {
                setIsActive('asc');
                setIsDropdownOpen(false);
                onChange?.(5);
              }}
              className={isActive === 'asc' ? 'active_sorting' : ''}
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
