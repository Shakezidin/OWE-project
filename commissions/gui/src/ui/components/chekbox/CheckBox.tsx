import React from 'react';
import './check.css'; // Import CSS file for styling

interface CheckboxProps {
    checked: boolean;
    onChange: () => void;
    indeterminate?: boolean;
}

const CheckBox: React.FC<CheckboxProps> = ({ checked, onChange, indeterminate }) => {
    const getClassNames = () => {
        if (indeterminate) {
            return 'checkbox indeterminate';
        }
        return checked ? 'checkbox checked' : 'checkbox';
    };

    return (
        <div className="checkbox-container">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className={getClassNames()}
            />
            {indeterminate && <span className="minus-sign">-</span>}
        </div>
    );
};

export default CheckBox;
