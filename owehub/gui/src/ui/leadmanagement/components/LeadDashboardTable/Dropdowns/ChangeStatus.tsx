import React, { useState, useRef, useEffect } from 'react';
import classes from './index.module.css';
import { BsThreeDotsVertical } from 'react-icons/bs';

interface DropDownLibraryProps {
  selectedType: string;
  onSelectType: (type: string) => void;
  cb?: () => void;
  disabledOptions?: string[];
}

const ChangeStatus: React.FC<DropDownLibraryProps> = ({
  selectedType,
  onSelectType,
  cb,
  disabledOptions = [],
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
    setIsClicked(!isClicked);
    cb?.();
  };

  const handleSelect = (type: string) => {
    if (!disabledOptions.includes(type)) {
      onSelectType(type);
      setIsVisible(false);
      setIsClicked(false);
    }
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
        className={classes.verticalDots2}
      >
        <BsThreeDotsVertical />
      </div>

      {isVisible && (
        <ul ref={dropdownRef} className={classes.dropdownMenu}>
          <li
            onClick={() => handleSelect('Deal Won')}
            className={`${classes.dropdownItemAll} ${
              selectedType === 'Deal Won' ? classes.selected : ''
            } ${disabledOptions.includes('Deal Won') ? classes.disabled : ''}`}
          >
            Deal Won
          </li>
          <li
            onClick={() => handleSelect('Deal Loss')}
            className={`${classes.dropdownItem} ${
              selectedType === 'Deal Loss' ? classes.selected : ''
            } ${disabledOptions.includes('Deal Loss') ? classes.disabled : ''}`}
          >
            Deal Loss
          </li>
          <li
            onClick={() => handleSelect('Appointment Not Required')}
            className={`${classes.dropdownItem} ${
              selectedType === 'Appointment Not Required' ? classes.selected : ''
            } ${
              disabledOptions.includes('Appointment Not Required')
                ? classes.disabled
                : ''
            }`}
          >
            Appointment Not Required
          </li>
        </ul>
      )}
    </div>
  );
};

export default ChangeStatus;