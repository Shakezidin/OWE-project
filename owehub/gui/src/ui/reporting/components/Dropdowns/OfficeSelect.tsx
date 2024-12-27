import React, { useState } from 'react';
import DropdownCheckBox from '../../../components/DropdownCheckBox';

interface Option {
    value: string;
    label: string;
}

interface OfficeSelectProps {
    onOfficeChange?: (values: string[]) => void; // Callback function to send values to parent
}

const OfficeSelect: React.FC<OfficeSelectProps> = ({ onOfficeChange = () => { } }) => {
    const [selectedOffices, setSelectedOffices] = useState<Option[]>([]);

    const officeOptions = [
        { value: 'AZKING01', label: 'AZKING01' },
        { value: 'AZPEO01', label: 'AZPEO01' },
        { value: 'AZTEM01', label: 'AZTEM01' },
        { value: 'AZTUC01', label: 'AZTUC01' },
        { value: 'CODEN1', label: 'CODEN1' },
        { value: 'COGJT1', label: 'COGJT1' },
        { value: 'NMABQ01', label: 'NMABQ01' },
        { value: 'No Office', label: 'No Office' },
        { value: 'TXAUS01', label: 'TXAUS01' },
        { value: 'TXDAL01', label: 'TXDAL01' },
        { value: 'TXELP01', label: 'TXELP01' },
    ];

    const handleChange = (val: Option[]) => {
        setSelectedOffices(val);
        // Extract values and send to parent
        onOfficeChange(val.map(option => option.value));
    };

    return (
        <div>
            <DropdownCheckBox
                label="Office" // Label for the dropdown
                placeholder={'Search Office'}
                selectedOptions={selectedOffices} // Bind selected value
                options={officeOptions} // Options for the dropdown
                onChange={handleChange} // Update state on change
            />
        </div>
    );
};

export default OfficeSelect; 