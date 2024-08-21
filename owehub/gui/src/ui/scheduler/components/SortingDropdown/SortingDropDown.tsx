import React, { useEffect, useRef, useState } from 'react';
import { PiSortAscendingLight } from 'react-icons/pi';
import './index.css';
const SortingDropDown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const dropdownRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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
    <div className="relative">
      <button
        onClick={toggleDropdown}
        ref={dropdownRef}
        className={`flex items-center justify-center  sort_btn`}
      >
        <PiSortAscendingLight size={26} />
      </button>

      {isDropdownOpen && (
        <div className="pr-dropdown">
          <ul>
            <li>All</li>
            <li>Old To New</li>
            <li>New To Old</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortingDropDown;
