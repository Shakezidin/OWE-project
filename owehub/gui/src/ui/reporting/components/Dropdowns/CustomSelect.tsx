// CustomSelect.tsx
import React, { useState } from 'react';
import DropdownCheckBox from '../../../components/DropdownCheckBox';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];  // Options will come as a prop from the parent
    label: string;      // Label will also come as a prop from the parent
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
