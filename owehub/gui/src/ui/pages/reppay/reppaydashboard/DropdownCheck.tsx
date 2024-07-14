import React, { useState, useEffect, useRef, SetStateAction } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import './DropdownWithCheckboxes.css';
import {
  handleChange as filterChange,
  toggleAllDropdown,
  toggleOffDropdowns,
} from '../../../../redux/apiSlice/repPaySlice/repPaySlice';
import { useAppDispatch } from '../../../../redux/hooks';

interface Option {
  label: string;
  value: string;
  key: string;
}

const options: Option[] = [
  { value: 'All', label: 'All', key: 'all' },
  { value: 'AP-OTH', label: 'AP-OTH', key: 'ap_oth' },
  { value: 'AP-PDA', label: 'AP-PDA', key: 'ap_pda' },
  { value: 'AP-ADV', label: 'AP-ADV', key: 'ap_adv' },
  { value: 'AP-DED', label: 'AP-DED', key: 'ap_ded' },
  { value: 'REP-COMM', label: 'REP-COMM', key: 'rep_comm' },
  { value: 'REP BONUS', label: 'REP BONUS', key: 'rep_bonus' },
  { value: 'LEADER-OVERRIDE', label: 'LEADER-OVRD', key: 'leader_ovrd' },
];

const DropdownWithCheckboxes = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  // const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    options.map((o) => o.value)
  );
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
  const handleOptionChange = (option: string, key: string) => {
    console.log(key === 'all');

    if (key !== 'all') {
      dispatch(
        filterChange({ name: key, value: !selectedOptions.includes(option) })
      );
    } else if (key === 'all' && !selectedOptions.includes('All')) {
      dispatch(toggleAllDropdown());
    } else {
      dispatch(toggleOffDropdowns());
    }
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
        // Remove 'All' from prevSelectedOptions if it exists
        const updatedOptions = prevSelectedOptions.filter((o) => o !== 'All');

        if (updatedOptions.includes(option)) {
          return updatedOptions.filter((o) => o !== option);
        } else {
          return [...updatedOptions, option];
        }
      }
    });
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        <span className="toggle-text">
          {selectedOptions.length > 0
            ? selectedOptions.includes('All')
              ? 'All'
              : ''
            : 'All'}
        </span>
        {selectedOptions.length > 0 && !selectedOptions.includes('All') && (
          <span className="selected-count">{selectedOptions.length}</span>
        )}
        <FiChevronDown className="drop-icon" />
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div key={option.value} className="dropdown-item">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.value)}
                onChange={() => handleOptionChange(option.value, option.key)}
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
