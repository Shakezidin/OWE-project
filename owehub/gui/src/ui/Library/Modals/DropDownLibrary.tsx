import React, { useState, useRef, useEffect } from 'react';
import classes from './styles/dropdownlibrary.module.css';
import { BsThreeDotsVertical } from 'react-icons/bs';

interface DropDownLibraryProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

const DropDownLibrary: React.FC<DropDownLibraryProps> = ({
  selectedType,
  onSelectType,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
    setIsClicked(!isClicked);
  };

  const handleSelect = (type: string) => {
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
        style={{
          backgroundColor: isHovered || isClicked ? '#EFF5FF' : '',
          borderColor: isHovered || isClicked ? '#377cf6' : '#8C8C8C',
        }}
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
            onClick={() => handleSelect('All')}
            className={`${classes.dropdownItem} ${selectedType === 'All' ? classes.selected : ''}`}
          >
            All
          </li>
          <li
            onClick={() => handleSelect('Excel')}
            className={`${classes.dropdownItem} ${selectedType === 'Excel' ? classes.selected : ''}`}
          >
            Excel
          </li>
          <li
            onClick={() => handleSelect('PDF Format')}
            className={`${classes.dropdownItem} ${selectedType === 'PDF Format' ? classes.selected : ''}`}
          >
            PDF Format
          </li>
          <li
            onClick={() => handleSelect('Images')}
            className={`${classes.dropdownItem} ${selectedType === 'Images' ? classes.selected : ''}`}
          >
            Images
          </li>
          <li
            onClick={() => handleSelect('Videos')}
            className={`${classes.dropdownItem} ${selectedType === 'Videos' ? classes.selected : ''}`}
          >
            Videos
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropDownLibrary;
