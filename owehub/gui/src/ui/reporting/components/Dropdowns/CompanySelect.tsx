import React, { useState } from 'react'
import DropdownCheckBox from '../../../components/DropdownCheckBox';

interface Option {
    value: string;
    label: string;
}

const CompanySelect = () => {
    const [selectedDealer, setSelectedDealer] = useState<Option[]>([]);

    return (
        <div>
            <DropdownCheckBox
                label={selectedDealer.length === 1 ? 'Office' : 'Office'}
                placeholder={'Search Office'}
                selectedOptions={selectedDealer}
                options={
                    [
                        {
                            label: `#N/A`,
                            value: `#N/A`,
                        },
                        {
                            label: `Peoria/Kingman`,
                            value: `Peoria/Kingman`,
                        },
                        {
                            label:'Tucson',
                            value:'Tucson'
                        },
                        {
                            label: `Colorado`,
                            value: `Colorado`,
                        },
                        {
                            label:'Albuquerque/El Paso',
                            value:'Albuquerque/El Paso'
                        },
                        {
                            label: `Tempe`,
                            value: `Tempe`,
                        },
                        {
                            label:'Texas',
                            value:'Texas'
                        }
                    ]
                }
                onChange={(val) => {
                    setSelectedDealer(val);
                }}
            />
        </div>
    )
}

export default CompanySelect
