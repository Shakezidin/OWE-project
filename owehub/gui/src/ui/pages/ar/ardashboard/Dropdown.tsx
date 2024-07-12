import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import './ArDropdownWithCheckboxes.css';
import { useAppDispatch } from '../../../../redux/hooks';
import {
  handleChange as filterChange,
  toggleAllDropdown,
  toggleOffDropdowns,
} from '../../../../redux/apiSlice/AR/ArDataSlice';
import { FaChevronDown } from 'react-icons/fa6';
import { TbChevronDown } from 'react-icons/tb';
interface Option {
  label: string;
  value: string;
  key: string;
}

interface ArDropdownWithCheckboxesProps {
  options: Option[];
}

const DropIcon = () =>{
  return <svg
  height="20"
  width="20"
  viewBox="0 0 20 20"
  aria-hidden="true"
  focusable="false"
  className="css-tj5bde-Svg"
>
  <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
</svg>
}

const ArDropdownWithCheckboxes: React.FC<ArDropdownWithCheckboxesProps> = ({
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    options.map((o) => o.value)
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

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
  console.log(selectedOptions, 'check');
  return (
    <div className="ar-dropdown-container" ref={dropdownRef}>
      <div className="dropdown-toggle" onClick={toggleDropdown}>
        <span className="toggle-text">
          {selectedOptions.length > 0
            ? selectedOptions.includes('All')
              ? 'All'
              : ''
            : 'Select'}
        </span>
        {selectedOptions.length > 0 && !selectedOptions.includes('All') && (
          <span className="selected-count">{selectedOptions.length}</span>
        )}
        <DropIcon/>
      </div>
      {isOpen && (
        <div className="ar-dropdown-menu">
          {options.map((option) => (
            <div key={option.value} className="ar-dropdown-item">
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

export default ArDropdownWithCheckboxes;
