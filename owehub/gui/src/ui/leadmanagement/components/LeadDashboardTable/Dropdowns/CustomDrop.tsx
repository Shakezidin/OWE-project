import React, { useState, useRef, useEffect } from 'react';
import classes from './index.module.css';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaAngleRight } from 'react-icons/fa';
import { FaAngleDown } from 'react-icons/fa6';
import { usePopper } from 'react-popper';


interface DropDownLibraryProps {
  selectedType: string;
  onSelectType: (type: string) => void;
  cb?: () => void
}

const DropDownLeadTable: React.FC<DropDownLibraryProps> = ({
  selectedType,
  onSelectType,
  cb
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLUListElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: ['top', 'bottom'],
        },
      },
      {
        name: 'preventOverflow',
        options: {
          boundary: 'clippingParents',
        },
      },
    ],
  });

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
    setIsClicked(!isClicked);
    cb?.()
  };

  const handleSelect = (type: string) => {
    onSelectType(type);
    setIsVisible(false);
    setIsClicked(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popperElement &&
        referenceElement &&
        !popperElement.contains(event.target as Node) &&
        !referenceElement.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popperElement, referenceElement]);

  return (
    <div className={classes.dropdown_container}>
      <div
      ref={setReferenceElement}
        onMouseEnter={() => setIsHovered(true)}
        onClick={toggleDropdown}
        onMouseLeave={() => setIsHovered(false)}
        className={classes.verticalDots}

      >
        Action <FaAngleDown />
      </div>

      {isVisible && (
        <ul
          ref={setPopperElement}
          style={{
            ...styles.popper,
            marginRight: '-10px',
            marginTop: '10px',
          }}
          {...attributes.popper}
          className={classes.dropdownMenu}
        >
          <li
            onClick={() => handleSelect('All')}
            className={`${classes.dropdownItemAll} ${selectedType === 'All' ? classes.selected : ''}`}
          >
          View Proposal
          </li>
          <li
            onClick={() => handleSelect('Excel')}
            className={`${classes.dropdownItem} ${selectedType === 'Excel' ? classes.selected : ''}`}
          >
            Download Proposal
          </li>
          <li
            onClick={() => handleSelect('PDF Format')}
            className={`${classes.dropdownItem} ${selectedType === 'PDF Format' ? classes.selected : ''}`}
          >
            Create New Proposal
          </li>
          <li
            onClick={() => handleSelect('app_sched')}
            className={`${classes.dropdownItem} ${selectedType === 'Images' ? classes.selected : ''}`}
          >
            Schedule Appointment
          </li>
        </ul>
      )}
    </div>
  );
};

export default DropDownLeadTable;
