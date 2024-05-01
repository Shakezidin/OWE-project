import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi'; // Assuming you want to use the FiChevronDown icon
import './ArDropdownWithCheckboxes.css';

interface Option {
  label: string;
  value: string;
}

const options: Option[] = [
    { value: "All", label: "All" },
    { value: "Shaky", label: "AP-DTH" },
    { value: "Cancel", label: "AP-PDA" },
    { value: "QC/Permit/NTP", label: "AP-ADV" },
    { value: "Install", label: "AP-DED" },
    { value: "PTO", label: "AR-COMM" },
];

const ArDropdownWithCheckboxes = () => {
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
    <div className="ar-dropdown-container">
      <div className="ar-dropdown-toggle" onClick={toggleDropdown}>
        {/* {selectedOptions.length > 0
          ? `(${selectedOptions})`
          : 'Select'} */}
          Select
        <FiChevronDown className='ar-drop-icon'/>
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



