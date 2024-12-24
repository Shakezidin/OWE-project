import React, { useState } from 'react'
import SelectOption from '../../../components/selectOption/SelectOption'

interface Option {
    value: string;
    label: string;
}

const WeekSelect = () => {
    const [reportType, setReportType] = useState<Option>(
        {
            label: 'Week 1',
            value: 'Week 1',
        }
    );
    const generateWeekOptions = () => {
        const options = [];

        for (let i = 1; i <= 52; i++) {
            options.push({
                label: `Week ${i}`,
                value: `week${i}`,
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

export default WeekSelect
