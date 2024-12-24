import React, { useState } from 'react'
import SelectOption from '../../../components/selectOption/SelectOption'

interface Option {
    value: string;
    label: string;
}

const YearSelect = () => {
    const [reportType, setReportType] = useState<Option>(
        {
            label: '2024',
            value: '2024',
        }
    );
    const generateWeekOptions = () => {
        const options = [];

        for (let i = 2022; i <= 2024; i++) {
            options.push({
                label: `${i}`,
                value: `${i}`,
            });
        }

        return options;
    };

    const options = generateWeekOptions();
    return (
        <div>
            <SelectOption
                options={options}
                onChange={(value: any) => setReportType(value)}
                value={reportType}
                controlStyles={{ marginTop: 0, minHeight: 30, minWidth: 150 }}
                menuListStyles={{ fontWeight: 400 }}
                singleValueStyles={{ fontWeight: 400 }}
            />
        </div>
    )
}

export default YearSelect
