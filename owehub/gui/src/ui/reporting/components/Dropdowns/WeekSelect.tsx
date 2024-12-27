import React from 'react'
import SelectOption from '../../../components/selectOption/SelectOption'

export interface Option {
    value: string;
    label: string;
}

interface WeekSelectProps {
    onChange?: (value: Option | null) => void;
    value?: Option; // Make value optional
}

const WeekSelect: React.FC<WeekSelectProps> = ({ onChange = () => { }, value }) => {

    const generateWeekOptions = () => {
        const options = [];
        for (let i = 1; i <= 52; i++) {
            options.push({
                label: `Week ${i}`,
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
                onChange={(newValue: Option | null) => {
                    if (newValue) {
                        onChange(newValue);
                    }
                }}
                value={value}
                controlStyles={{ marginTop: 0, minHeight: 30, minWidth: 150 }}
                menuListStyles={{ fontWeight: 400 }}
                singleValueStyles={{ fontWeight: 400 }}
            />
        </div>
    )
}

export default WeekSelect
