import React, { useState } from 'react';
import Select from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface Props {
  includeData: Option[];
  selectedOption3: string;
  handleSelectChange3: (selectedOption3: Option | null) => void;
}

const DropdownWithCheckboxes: React.FC<Props> = ({ includeData, selectedOption3, handleSelectChange3 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const dropdownOptions = includeData.map((option) => ({
    value: option.value,
    label: option.label, // Use the label directly from the option
  }));

  // Ensure that value prop is not undefined
  const value = selectedOption3 ? { value: selectedOption3, label: selectedOption3 } : null;

  return (
    <Select
      options={dropdownOptions}
      value={value}
      onChange={handleSelectChange3}
      onMenuClose={toggleDropdown}
      onMenuOpen={toggleDropdown}
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          fontSize: '13px',
          fontWeight: '500',
          borderRadius: '.40rem',
          border: 'none',
          outline: 'none',
          width: '6rem',
          minHeight: 'unset',
          height: '30px',
          alignContent: 'center',
          backgroundColor: '#ECECEC',
        }),
        indicatorSeparator: () => ({
          display: 'none',
        }),
        option: (baseStyles) => ({
          ...baseStyles,
          fontSize: '13px',
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          width: '6rem',
        }),
      }}
    />
  );
};

export default DropdownWithCheckboxes;
