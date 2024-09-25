import React, { useState, useEffect, useRef, memo } from 'react';
import '../../leaderboard/components/Banner.css';
import '../text_input/Input.css';
import './styles/index.css';
import { BiChevronDown } from 'react-icons/bi';
import SelectOption from '../selectOption/SelectOption';
interface Option {
  label: string;
  value: string;
}

interface DropdownCheckboxProps {
  options: Option[];
  selectedOptions: Option[];
  onChange: (selectedOptions: Option[]) => void;
  placeholder?: string;
  label?: string;
}

const DropdownCheckbox: React.FC<DropdownCheckboxProps> = ({
  options,
  selectedOptions,
  onChange,
  placeholder = 'Search...',
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions([...options]);
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
        setFilteredOptions(options);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [options]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    setSearch(searchTerm);

    if (searchTerm) {
      const filtered = options.filter((item) =>
        item.label.toLowerCase().includes(searchTerm)
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([...options]);
    }
  };
  const handleOptionChange = (option: Option) => {
    let updatedSelection: Option[];

    if (option.value === 'ALL') {
      updatedSelection = selectedOptions.length === options.length ? [] : options;
    } else {
      if (selectedOptions.some((item) => item.value === option.value)) {
        updatedSelection = selectedOptions.filter((item) => item.value !== option.value);
      } else {
        updatedSelection = [...selectedOptions, option];
        optionContainer.current?.scroll({ top: 0,behavior:"smooth" })
      }
      if (updatedSelection.length === options.length - 1 && options.some((opt) => opt.value === 'ALL')) {
        updatedSelection = [...options];
      }
    }
    onChange(updatedSelection);
  };

  const handleSelectAll = () => {
    onChange(selectedOptions.length === options.length ? [] : options);
  };

  const isAllSelected =
    selectedOptions.length === options.length ||
    selectedOptions.some((item) => item.value === 'ALL');
  const sortedOptions = filteredOptions.sort((a, b) => {
    const isSelected = selectedOptions.some((item) => item.value === a.value);
    if (isSelected) {
      return -1
    } else {
      return 1
    }
  });
  return (
    <div className="dropdown-checkbox relative bg-white" ref={dropdownRef}>
      <div className="dropdown-toggle flex items-center" onClick={() => setIsOpen(!isOpen)}>
        <span>
          {` ${isAllSelected ? "All" : selectedOptions.length} ${label} selected`}
        </span>
        <BiChevronDown className="ml1 " size={22} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "all 550ms" }} />
      </div>
      {isOpen && (
        <div ref={optionContainer} className="dropdown-menu scrollbar" style={{ overflowX: 'clip' }}>
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
          {sortedOptions.length > 0 ? (
            sortedOptions.map((option, index) => (
              <div key={index} className="dropdown-item">
                <input
                  type="checkbox"
                  style={{ flexShrink: 0 }}
                  checked={selectedOptions.some(
                    (item) => item.value === option.value
                  )}
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

export default memo(DropdownCheckbox);
