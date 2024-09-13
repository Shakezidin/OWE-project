import React, { useState, useEffect, useRef } from 'react';
import "../../leaderboard/components/Banner.css"
import "../text_input/Input.css"

interface Option {
  label: string;
  value: string;
}

interface DropdownCheckboxProps {
  options: Option[];
  selectedOptions: Option[];
  onChange: (selectedOptions: Option[]) => void;
  placeholder?: string;
}

const DropdownCheckbox: React.FC<DropdownCheckboxProps> = ({
  options,
  selectedOptions,
  onChange,
  placeholder = 'Search...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
        setFilteredOptions(options);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [options]);

  useEffect(() => {
    // Check if "ALL" option is present and select all options by default
    if (options.some(option => option.value === "ALL")) {
      onChange(options);
    }
  }, [options, onChange]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    setSearch(searchTerm);

    if (searchTerm) {
      const filtered = options.filter(item =>
        item.label.toLowerCase().includes(searchTerm)
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  };
  console.log(options, "topionsss")
  const handleOptionChange = (option: Option) => {
    let updatedSelection: Option[];
    if (option.value === "ALL") {
      updatedSelection = selectedOptions.length === options.length ? [] : options;
    } else {
      updatedSelection = selectedOptions.some(item => item.value === option.value)
        ? selectedOptions.filter(item => item.value !== option.value && item.value !== "ALL")
        : [...selectedOptions.filter(item => item.value !== "ALL"), option];
      if (updatedSelection.length === options.length - 1 && options.some(opt => opt.value === "ALL")) {
        updatedSelection = options;
      }
    }
    onChange(updatedSelection);
  };

  const handleSelectAll = () => {
    onChange(selectedOptions.length === options.length ? [] : options);
  };

  const isAllSelected = (selectedOptions.length === options.length || selectedOptions.some(item => item.value === "ALL"));

  return (
    <div className="dropdown-checkbox" ref={dropdownRef}>
      <div className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isAllSelected ? 'All selected' : `${selectedOptions.length}  selected`}
      </div>
      {isOpen && (
        <div className="dropdown-menu scrollbar" style={{ overflowX: "clip" }}>
          <input
            type="text"
            className="input"
            placeholder={placeholder}
            value={search}
            onChange={handleSearch}
          />
          {!!(!search && options.length) && (
            <div className="dropdown-item">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
              />
              <span>All</span>
            </div>
          )}
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div key={index} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={selectedOptions.some(item => item.value === option.value)}
                  onChange={() => handleOptionChange(option)}
                />
                <span>{option.label}</span>
              </div>
            ))
          ) : (
            <div className="text-center h5 mt4 text-dark">No data found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownCheckbox;