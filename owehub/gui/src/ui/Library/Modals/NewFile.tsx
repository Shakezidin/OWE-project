import React, { useEffect, useRef, useState } from 'react';
import classes from './styles/newfile.module.css';
import CreateNewFolderLibrary from './CreateNewFolderLibrary';
import LibraryModel from '../components/LibraryModals (1)/LibraryModals/LibModal';


interface NewFileProps {
  activeSection: 'files' | 'folders' | 'dropdown' | null;
  onSort?: (option: string) => void;
}

type Option = 'Upload folder' | 'New folder' | 'Upload file';

const NewFile: React.FC<NewFileProps> = ({ activeSection, onSort }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleNewFolder, setIsVisibleNewFolder] = useState(false);
  const [isVisibleuploadFile,setIsVisibleuploadFile]=useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleClick = () => {
    setIsVisible(!isVisible);
    setIsVisibleuploadFile(false);

  };
  const handleClickNewFolder = () => {
    setIsVisibleNewFolder(!isVisibleNewFolder);
    
  };

  const handleOptionClick = () => {
    setIsVisibleuploadFile(!isVisibleuploadFile);
  };

  const handleOptionClickFile=()=>{
    
    setIsVisibleuploadFile(!isVisibleuploadFile);
    console.log("hello")
   
     
    
  }

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
                onClick={handleOptionClick}
              >
                + Upload folder
              </li>
              {isVisibleuploadFile &&  (<LibraryModel/>)}
              <li 
                className={`${classes.dropdownItem} ${selectedOption === 'New folder' ? classes.selected : ''}`}
                onClick={handleClickNewFolder}
              >
                + New folder
              </li>
              {isVisibleNewFolder && (<CreateNewFolderLibrary setIsVisibleNewFolder={setIsVisibleNewFolder} onDelete={function (): void {
                throw new Error('Function not implemented.');
              } }/>)}
           
            </>
          ) : (
            <>
            <li className={`${classes.dropdownItem} ${selectedOption === 'Upload file' ? classes.selected : ''}`}
              onClick={handleOptionClickFile}>
                   + Upload file
                   
                   </li>
                   {isVisibleuploadFile &&  (<LibraryModel/>)}
                   
                  
           
               
            </>  
          )}
         
        </ul>
        
      )}
    </div>
    
  );
};

export default NewFile;
