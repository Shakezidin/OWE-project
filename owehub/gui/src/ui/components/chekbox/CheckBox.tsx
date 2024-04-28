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
    const handleMinusSignClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.stopPropagation(); // Prevent event from bubbling up to the parent elements
        onChange(); // Trigger onChange event to deselect the row
    };

    return (
        <div className="checkbox-container">
            <input
                type="checkbox"
                checked={checked}
                
                onChange={onChange}
                className={getClassNames()}
            />
            {indeterminate && <span className="minus-sign" onClick={handleMinusSignClick}>-</span>}
        </div>
    );
};

export default CheckBox;
