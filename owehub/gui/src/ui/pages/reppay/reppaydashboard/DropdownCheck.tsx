import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import './DropdownWithCheckboxes.css';

interface Option {
  label: string;
  value: string;
}

const options: Option[] = [
  { value: "All", label: "All" },
  { value: "AP-DTH", label: "AP-DTH" },
  { value: "AP-PDA", label: "AP-PDA" },
  { value: "AP-ADV", label: "AP-ADV" },
  { value: "AP-DED", label: "AP-DED" },
  { value: "REP-COMM", label: "REP-COMM" },
  { value: "REP BONUS", label: "REP BONUS" },
  { value: "LEADER", label: "LEADER" }
];

const DropdownWithCheckboxes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
      if (option === "All") {
        return prevSelectedOptions.includes("All")
          ? []
          : options.map((o) => o.value);
      } else {
        const newSelectedOptions = prevSelectedOptions.includes(option)
          ? prevSelectedOptions.filter((o) => o !== option)
          : [...prevSelectedOptions, option];

        return newSelectedOptions.length === options.length - 1
          ? ["All", ...newSelectedOptions]
          : newSelectedOptions;
      }
    });
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        {/* {selectedOptions.length > 0 ? `(${selectedOptions})` : 'Select'} */}
        Select
        <FiChevronDown className='drop-icon'/>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div key={option.value} className="dropdown-item">
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

export default DropdownWithCheckboxes;