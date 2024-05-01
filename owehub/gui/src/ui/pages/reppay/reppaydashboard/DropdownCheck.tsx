import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi'; // Assuming you want to use the FiChevronDown icon
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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (option: string) => {
    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(option)) {
        return prevSelectedOptions.filter((o) => o !== option);
      } else {
        return [...prevSelectedOptions, option];
      }
    });
  };

  return (
    <div className="dropdown-container">
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        {/* {selectedOptions.length > 0
          ? `(${selectedOptions})`
          : 'Select'} */}
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
