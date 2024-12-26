import React, { useState } from 'react'
import DropdownCheckBox from '../../components/DropdownCheckBox';

interface Option {
    value: string;
    label: string;
}

const CustomMultiSelect = ({ data, placeholder }: any) => {
    const [selectedDealer, setSelectedDealer] = useState<Option[]>([]);

    return (
        <div>
            <DropdownCheckBox
                label={placeholder}
                placeholder={placeholder ?  `Search ${placeholder}` : 'Search Office'}
                selectedOptions={selectedDealer}
                options={data}
                onChange={(val) => {
                    setSelectedDealer(val);
                }}
            />
        </div>
    )
}

export default CustomMultiSelect
