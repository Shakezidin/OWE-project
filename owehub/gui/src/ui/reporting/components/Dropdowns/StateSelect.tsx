import React, { useState } from 'react';
import DropdownCheckBox from '../../../components/DropdownCheckBox';

interface Option {
    value: string;
    label: string;
}

interface StateSelectProps {
    onStateChange?: (values: string[]) => void; // Callback function to send values to parent

}

    const StateSelect: React.FC<StateSelectProps> = ({ onStateChange = () => { } }) => {
        const [selectedStates, setSelectedState] = useState<Option[]>([]);


    const stateOptions = [
        { value: 'AZ :: Arizona', label: 'AZ' },
        { value: 'CO :: Colorado', label: 'CO' },
        { value: 'NM :: New Mexico', label: 'NM' },
        { value: 'NV :: Nevada', label: 'NV' },
        { value: 'ST :: South Dakota', label: 'ST' },
        { value: 'TX :: Texas', label: 'TX' },
    ];

    const handleChange = (val: Option[]) => {
        setSelectedState(val);
        // Extract values and send to parent
        onStateChange(val.map(option => option.value));
    };

    return (
        <div>
            <DropdownCheckBox
                label="Quarter" // Label for the dropdown
                selectedOptions={selectedStates} // Bind selected value
                options={stateOptions} // Options for the dropdown
                onChange={handleChange} // Update state on change
            />
        </div>
    );
};

export default StateSelect; 