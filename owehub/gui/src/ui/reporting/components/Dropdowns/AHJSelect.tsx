import React, { useState } from 'react';
import DropdownCheckBox from '../../../components/DropdownCheckBox';

interface Option {
    value: string;
    label: string;
}

interface AHJSelectProps {
    onAhjChange?: (values: string[]) => void; // Callback function to send values to parent
}
const AHJSelect: React.FC<AHJSelectProps> = ({ onAhjChange = () => { } }) => {
    const [selectedAhj, setSelectedAhj] = useState<Option[]>([]);

    const ahjOptions = [
        { value: 'null', label: 'null' },
        { value: 'AHJ', label: 'AHJ' },
        { value: 'Abilene, City of (TX)', label: 'Abilene, City of (TX)' },
        { value: 'Adams County (CO)', label: 'Adams County (CO)' },
        { value: 'Alamogordo, City of (NM)', label: 'Alamogordo, City of (NM)' },
        { value: 'Alamosa City (CO)', label: 'Alamosa City (CO)' },
        { value: 'Alamosa County (CO)', label: 'Alamosa County (CO)' },
        { value: 'Albuquerque, City of (NM)', label: 'Albuquerque, City of (NM)' },
        { value: 'Alice, City of (TX)', label: 'Alice, City of (TX)' },
        { value: 'Allen, City of (TX)', label: 'Allen, City of (TX)' },
        { value: 'Amarillo, City of (TX)', label: 'Amarillo, City of (TX)' },
        { value: 'Andrews, City of (TX)', label: 'Andrews, City of (TX)' },
        { value: 'Angelina County (TX)', label: 'Angelina County (TX)' },
        { value: 'Anna, City of (TX)', label: 'Anna, City of (TX)' },
    ];

    const handleChange = (val: Option[]) => {
        setSelectedAhj(val);
        // Extract values and send to parent
        onAhjChange(val.map(option => option.value));
    };

    return (
        <div>
            <DropdownCheckBox
                label="AHJ" // Label for the dropdown
                placeholder={'Search AHJ'}
                selectedOptions={selectedAhj} // Bind selected value
                options={ahjOptions} // Options for the dropdown
                onChange={handleChange} // Update state on change
            />
        </div>
    );
};

export default AHJSelect; 