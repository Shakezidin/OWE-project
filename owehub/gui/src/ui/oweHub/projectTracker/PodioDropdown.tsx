import React, { useState } from 'react';
import './Dropdown.css';
import { CiLink } from 'react-icons/ci';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { RiArrowDropDownLine } from 'react-icons/ri';

interface Option {
  id: number;
  content: string;
}

interface DropdownProps {
  options: Option[];
  onButton1Click: (optionId: number) => void;
  onButton2Click: (optionId: number) => void;
}

const PodDropdown: React.FC<DropdownProps> = ({ options, onButton1Click, onButton2Click }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleButton1Click = () => {
    if (selectedOption) {
      onButton1Click(selectedOption.id);
    }
  };

  const handleButton2Click = () => {
    if (selectedOption) {
      onButton2Click(selectedOption.id);
    }
  };

  return (
    <div className="pro-dropdown">
      <button className="pro-dropdown-toggle" onClick={toggleDropdown}>
       <span >{selectedOption ? selectedOption.content : 'Links & Documents'}</span> 
       <span><RiArrowDropDownLine /></span> 
      </button>
      {isOpen && (
        <ul className="pro-dropdown-menu">
          {options.map((option) => (
            <li key={option.id} onClick={() => handleOptionClick(option)}>
              <div className="pro-dropdown-option">
                <span>{option.content}</span>
                
                <div className="pro-dropdown-buttons">
                <button className='button-link' onClick={handleButton1Click}>
                    <CiLink />
                  </button>
                  <button className="button-external-link" onClick={handleButton2Click}>
                    <FaExternalLinkAlt />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PodDropdown;