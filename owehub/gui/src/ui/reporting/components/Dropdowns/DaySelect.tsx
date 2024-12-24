import React, { useState } from 'react'
import SelectOption from '../../../components/selectOption/SelectOption'

interface Option {
    value: string;
    label: string;
}

const DaySelect = () => {
    const [reportType, setReportType] = useState<Option>(
        {
            label: 'Day 1',
            value: 'Day 1',
        }
    );
    const generateWeekOptions = () => {
        const options = [];

        for (let i = 1; i <= 7; i++) {
            options.push({
                label: `Day ${i}`,
                value: `Day ${i}`,
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

export default DaySelect
