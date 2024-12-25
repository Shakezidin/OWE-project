import React from 'react'
import SelectOption from '../../../components/selectOption/SelectOption'

export interface Option {
    value: string;
    label: string;
}
interface YearSelectProps {
    onChange?: (value: Option | null) => void;
    value?: Option; // Make value optional
}

const YearSelect: React.FC<YearSelectProps> = ({ onChange = () => {}, value }) => {
    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const options = [];
        for (let i = currentYear; i >= currentYear - 5; i--) {
            options.push({
                label: `${i}`,
                value: `${i}`,
            });
        }
        return options;
    };

    return (
        <SelectOption
            options={generateYearOptions()}
            onChange={onChange}
            value={value}
            controlStyles={{ marginTop: 0, minHeight: 30, minWidth: 150 }}
            menuListStyles={{ fontWeight: 400 }}
            singleValueStyles={{ fontWeight: 400 }}
        />
    )
}

export default YearSelect
