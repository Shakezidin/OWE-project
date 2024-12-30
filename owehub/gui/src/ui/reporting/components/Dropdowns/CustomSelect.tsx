// CustomSelect.tsx
import React, { useState } from 'react';
import DropdownCheckBox from '../../../components/DropdownCheckBox';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: { value: string; label: string }[];
    label: string;
    value: string[]; // Ensure this matches the type you are using
    onChange: (selectedValues: string[]) => void; // Adjust the type as necessary
  }

const CustomSelect: React.FC<CustomSelectProps> = ({ options, label }) => {
    const [selectedDealer, setSelectedDealer] = useState<Option[]>([]);

    return (
        <div>
            <DropdownCheckBox
                label={label}  // Use the passed label here
                // placeholder={'Search Office'}
                selectedOptions={selectedDealer}
                options={options}
                onChange={(val) => setSelectedDealer(val)}
            />
        </div>
    );
};

export default CustomSelect;
