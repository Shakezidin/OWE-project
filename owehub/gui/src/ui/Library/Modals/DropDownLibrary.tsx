import React, { useState, useRef, useEffect } from 'react';
import classes from './styles/dropdownlibrary.module.css';
import { BsThreeDotsVertical } from 'react-icons/bs';

interface DropDownLibraryProps {
  onSelectType: (type: string) => void;
}

const DropDownLibrary: React.FC<DropDownLibraryProps> = ({ onSelectType }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [selectedType, setSelectedType] = useState('all'); // New state for selected type
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
    setIsClicked(!isClicked);
  };

  const handleSelect = (type: string) => {
    setSelectedType(type); // Update selected type
    onSelectType(type);
    setIsVisible(false);
    setIsClicked(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        setIsVisible(false);
        setIsClicked(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={classes.dropdown_container}>
      <div
        ref={buttonRef}
        onMouseEnter={() => setIsHovered(true)}
        onClick={toggleDropdown}
        onMouseLeave={() => setIsHovered(false)}
        className={classes.verticalDots}
      >
        <BsThreeDotsVertical
          style={{
            height: '25px',
            width: '20px',
            color: isHovered || isClicked ? '#377cf6' : '#8C8C8C',
          }}
        />
      </div>

      {isVisible && (
        <ul ref={dropdownRef} className={classes.dropdownMenu}>
          <li
            onClick={() => handleSelect('all')}
            className={`${classes.dropdownItem} ${selectedType === 'all' ? classes.selected : ''}`}
          >
            All
          </li>
          <li
            onClick={() => handleSelect('excel')}
            className={`${classes.dropdownItem} ${selectedType === 'excel' ? classes.selected : ''}`}
          >
            Excel
          </li>
          <li
            onClick={() => handleSelect('pdf')}
            className={`${classes.dropdownItem} ${selectedType === 'pdf' ? classes.selected : ''}`}
          >
            PDF Format
          </li>
          <li
            onClick={() => handleSelect('img')}
            className={`${classes.dropdownItem} ${selectedType === 'img' ? classes.selected : ''}`}
          >
            Images
          </li>
          <li
            onClick={() => handleSelect('mp4')}
            className={`${classes.dropdownItem} ${selectedType === 'mp4' ? classes.selected : ''}`}
          >
            Videos
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropDownLibrary;
