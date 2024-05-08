import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import './ArDropdownWithCheckboxes.css';

interface Option {
  label: string;
  value: string;
}

interface ArDropdownWithCheckboxesProps {
  options: Option[];
}

const ArDropdownWithCheckboxes: React.FC<ArDropdownWithCheckboxesProps> = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (option: string) => {
    setSelectedOptions((prevSelectedOptions) => {
      if (option === 'All') {
        if (prevSelectedOptions.length === options.length) {
          // If all options are already selected, uncheck them all
          return [];
        } else {
          // If not all options are selected, select them all
          return options.map((o) => o.value);
        }
      } else {
        if (prevSelectedOptions.includes(option)) {
          return prevSelectedOptions.filter((o) => o !== option);
        } else {
          return [...prevSelectedOptions, option];
        }
      }
    });
  };

  return (
    <div className="ar-dropdown-container" ref={dropdownRef}>
      <div className="ar-dropdown-toggle" onClick={toggleDropdown}>
        {/* {selectedOptions.length > 0 ? `(${selectedOptions})` : 'Select'} */}
        Select
        <FiChevronDown className="ar-drop-icon" />
      </div>
      {isOpen && (
        <div className="ar-dropdown-menu">
          {options.map((option) => (
            <div key={option.value} className="ar-dropdown-item">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.value)}
                onChange={() => handleOptionChange(option.value)}
              />
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArDropdownWithCheckboxes;