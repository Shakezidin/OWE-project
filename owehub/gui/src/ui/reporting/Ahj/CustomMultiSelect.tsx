import React, { useState } from 'react'
import DropdownCheckBox from '../../components/DropdownCheckBox';

interface Option {
    value: string;
    label: string;
}

const CustomMultiSelect = ({ data,disable, placeholder,onOfficeChange = ()=>{ } }: any) => {
    const [selectedOption, setSelectedOption] = useState<Option[]>([]);
    
      const handleChange = (val: Option[]) => {
        setSelectedOption(val);
        // Extract values and send to parent
        onOfficeChange(val.map(option => option.value));
      };

    return (
        <div>
            <DropdownCheckBox
                label={placeholder}
                placeholder={placeholder ?  `Search ${placeholder}` : 'Search Office'}
                selectedOptions={selectedOption}
                options={data}
                onChange={handleChange}
                disabled={disable}
            />
        </div>
    )
}

export default CustomMultiSelect
