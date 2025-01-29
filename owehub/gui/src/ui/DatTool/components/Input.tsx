import React, { useState } from 'react';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const CustomInput: React.FC<InputProps> = ({ label, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  // Inline styles
  const containerStyles = {
    marginBottom: '15px',
  };

  const labelStyles = {
    marginBottom: '5px',
    fontSize: '12px',
    fontWeight: '400',
    lineHeight: '18px',
    color: '#565656',
  };

  const inputStyles = {
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    borderRadius: '50px',
    padding: '0px 10px',
    fontSize: '12px',
    fontWeight: '500',
    lineHeight: '18px',
    fontFamily: 'Poppins',
    minHeight: '36px',
    boxShadow: 'none',
    backgroundColor: '#F5F5FD',
    width: '100%',
  };

  const focusedInputStyles = {
    ...inputStyles,
    border: '1px solid #377CF6', // Highlight border on focus
  };

  return (
    <div style={containerStyles}>
      <label htmlFor={label} style={labelStyles}>
        {label}
      </label>
      <input
        id={label}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)} // Apply focus styles when input is focused
        onBlur={() => setIsFocused(false)} // Remove focus styles when input is blurred
        style={isFocused ? focusedInputStyles : inputStyles} // Apply focused styles conditionally
      />
    </div>
  );
};

export default CustomInput;
