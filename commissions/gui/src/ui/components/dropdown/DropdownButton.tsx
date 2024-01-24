import React, { useState } from "react";
import "./DropdownButton.css"; // Import your CSS file
import { ReactComponent as DROPDOWN_BUTTON } from "../../../resources/assets/dropdown_Button.svg";

interface DropdownButtonProps {
  options: string[];
  label?: string;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ options, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <div className="dropdownContainer">
        {label && <p className="inputLabel">{label}</p>}
        <div className="dropdown-button-view">
          <button className="dropdown-button" onClick={handleButtonClick}>
            {selectedOption || "Select an option"}
          </button>
          <DROPDOWN_BUTTON />
        </div>
      </div>
      {isOpen && (
        <ul className="dropdown-list">
          {options.map((option, index) => (
            <li key={index} onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownButton;
