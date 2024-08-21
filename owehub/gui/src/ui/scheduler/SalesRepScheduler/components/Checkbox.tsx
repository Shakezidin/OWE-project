import React, { useState } from 'react';
import './CheckboxSlider.css';

const CheckboxSlider = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className="checkbox-slider">
      <input type="checkbox" checked={isChecked} onChange={handleToggle} />
      <span className="check-slider"></span>
    </label>
  );
};

export default CheckboxSlider;
