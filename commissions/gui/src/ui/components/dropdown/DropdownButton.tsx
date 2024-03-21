import React from 'react';
import '../dropdown/drop.css'
interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: string[];
  onChange: (id: string, value: string) => void;
}

const DropdownButton: React.FC<SelectFieldProps> = ({ id, label, value, options, onChange }) => {
  return (
    <div className="input-wrapper">
  {label && <p className="inputLabel">{label}</p>}
  <div className="input-inner-view">
     <select id={id} value={value} onChange={(e) => onChange(id, e.target.value)}>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
     </div>
    </div>
  );
};

export default DropdownButton;
