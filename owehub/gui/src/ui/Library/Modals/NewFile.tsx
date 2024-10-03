import React, { useEffect, useRef, useState } from 'react';
import classes from './styles/newfile.module.css';

interface NewFileProps {
  activeSection: 'files' | 'folders' | 'dropdown' | null;
  onSort?: (option: string) => void;
}

type Option = 'Upload folder' | 'New folder' | 'Upload file';

const NewFile: React.FC<NewFileProps> = ({ activeSection, onSort }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleClick = () => {
    setIsVisible(!isVisible);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    if (onSort) {
      onSort(option);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={classes.newfile_container} ref={dropdownRef}>
      <button
        onClick={handleClick}
        className={classes.newfile_botton}
        style={
          isVisible ? { backgroundColor: '#377cf6', color: '#ffffff' } : {}
        }
      >
        + New
      </button>
      {isVisible && (
        <ul className={classes.dropdownMenu}>
          {activeSection === 'folders' ? (
            <>
              <li
                className={`${classes.dropdownItem} ${selectedOption === 'Upload folder' ? classes.selected : ''}`}
                onClick={() => handleOptionClick('Upload folder')}
              >
                + Upload folder
              </li>
              <li
                className={`${classes.dropdownItem} ${selectedOption === 'New folder' ? classes.selected : ''}`}
                onClick={() => handleOptionClick('New folder')}
              >
                + New folder
              </li>
            </>
          ) : (
            <li
              className={`${classes.dropdownItem} ${selectedOption === 'Upload file' ? classes.selected : ''}`}
              onClick={() => handleOptionClick('Upload file')}
            >
              + Upload file
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default NewFile;
