import React, { useState, useRef, useEffect } from 'react';
import { HiSortDescending } from 'react-icons/hi';
import styles from './Sort.module.css';

interface SortOption {
  label: string;
  value: string;
}

interface SortProps {
  options: SortOption[];
  selectedValue: string; // New prop for the selected value
  onChange: (sortOrder: string) => void;
  selectedOptionStyle?: React.CSSProperties; // Custom style for selected option
  optionStyle?: React.CSSProperties; // Custom style for each option
}

const Sort: React.FC<SortProps> = ({
  options,
  selectedValue,
  onChange,
  selectedOptionStyle,
  optionStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortChange = (value: string) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={styles.sortContainer}>
      <div
        className={`${styles.sortIcon} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <HiSortDescending size={19} />
        {/* <span>{options.find(option => option.value === selectedValue)?.label}</span> */}
      </div>
      {isOpen && (
        <div className={styles.sortDropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.sortOption} ${selectedValue === option.value ? styles.selected : ''}`} // Combine classes
              onClick={() => handleSortChange(option.value)}
              style={selectedValue === option.value ? selectedOptionStyle : optionStyle}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sort;
