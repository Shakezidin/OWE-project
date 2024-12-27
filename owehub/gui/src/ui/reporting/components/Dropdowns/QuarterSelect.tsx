import React, { useState } from 'react';
import DropdownCheckBox from '../../../components/DropdownCheckBox';

interface Option {
    value: string;
    label: string;
}

interface QuarterSelectProps {
    onQuarterChange?: (values: string[]) => void; // Callback function to send values to parent

}

    const QuarterSelect: React.FC<QuarterSelectProps> = ({ onQuarterChange = () => { } }) => {
        const [selectedQuarter, setSelectedQuarter] = useState<Option[]>([]);


    const quarterOptions: Option[] = [
        { value: 'Q1 2024', label: 'Q1 2024' },
        { value: 'Q2 2024', label: 'Q2 2024' },
        { value: 'Q3 2024', label: 'Q3 2024' },
        { value: 'Q4 2024', label: 'Q4 2024' },
    ];

    const handleChange = (val: Option[]) => {
        setSelectedQuarter(val);
        // Extract values and send to parent
        onQuarterChange(val.map(option => option.value));
    };

    return (
        <div>
            <DropdownCheckBox
                label="Quarter" // Label for the dropdown
                selectedOptions={selectedQuarter} // Bind selected value
                options={quarterOptions} // Options for the dropdown
                onChange={handleChange} // Update state on change
            />
        </div>
    );
};

export default QuarterSelect; 