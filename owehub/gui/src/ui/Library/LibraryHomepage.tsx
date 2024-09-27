import React, { useState, useRef, useEffect } from 'react';
import { AddNewButton } from '../components/button/AddNewButton';
import styles from './LibraryHomepage.module.css';
import { ICONS } from '../../resources/icons/Icons';
import { IoMdSearch } from 'react-icons/io';
import { IoArrowBack, IoChevronDownSharp } from 'react-icons/io5';
import { RxDownload } from 'react-icons/rx';
import { RiDeleteBinLine } from 'react-icons/ri';
import DropDownLibrary from './Modals/DropDownLibrary';
import SortByLibrary from './Modals/SortByLibrary';
import NewFile from './Modals/NewFile';
import { BiArrowBack } from 'react-icons/bi';

const LibraryHomepage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeSection, setActiveSection] = useState<
    'files' | 'folders' | 'dropdown' | null
  >('files');
  const [isHovered, setIsHovered] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [sortOption, setSortOption] = useState<
    'none' | 'name' | 'date' | 'size'
  >('none');
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isRecycleBinView, setIsRecycleBinView] = useState(false);
  const [toggleClick, setToggleClick] = useState(false);

  const libData = [
    {
      url: ICONS.pdf,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.PDF',
      size: '34.82 KB',
      FileType: 'pdf',
    },
    {
      url: ICONS.excelIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.Excel',
      size: '34.82 KB',
      FileType: 'excel',
    },
    {
      url: ICONS.mp4Icon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Meeting recording.MP4',
      size: '34.82 KB',
      FileType: 'mp4',
    },
    {
      url: ICONS.imageIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Screenshot_1234.jpeg',
      size: '34.82 KB',
      FileType: 'img',
    },
    {
      url: ICONS.pdf,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.PDF',
      size: '34.82 KB',
      FileType: 'pdf',
    },
    {
      url: ICONS.excelIcon,
      name: 'Jordan Ulmer',
      date: '10 Sep 2024',
      iconName: 'UNTD SOLAR_.Excel',
      size: '30.82 KB',
      FileType: 'excel',
    },
    {
      url: ICONS.mp4Icon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Meeting recording.MP4',
      size: '34.82 KB',
      FileType: 'mp4',
    },
    {
      url: ICONS.imageIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Screenshot_1234.jpeg',
      size: '34.82 KB',
      FileType: 'img',
    },
    {
      url: ICONS.pdf,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.PDF',
      size: '34.82 KB',
      FileType: 'pdf',
    },
    {
      url: ICONS.excelIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.Excel',
      size: '34.82 KB',
      FileType: 'excel',
    },
    {
      url: ICONS.mp4Icon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Meeting recording.MP4',
      size: '26.65 KB',
      FileType: 'mp4',
    },
    {
      url: ICONS.imageIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Screenshot_1234.jpeg',
      size: '34.82 KB',
      FileType: 'img',
    },
    {
      url: ICONS.pdf,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.PDF',
      size: '34.82 KB',
      FileType: 'pdf',
    },
    {
      url: ICONS.excelIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.Excel',
      size: '34.82 KB',
      FileType: 'excel',
    },
    {
      url: ICONS.mp4Icon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Meeting recording.MP4',
      size: '34.82 KB',
      FileType: 'mp4',
    },
    {
      url: ICONS.imageIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Screenshot_1234.jpeg',
      size: '34.82 KB',
      FileType: 'img',
    },
  ];

  const handleDivClick = () => {
    setToggleClick(!true);
  };

  const handleRecycleBinClick = () => {
    // Toggle the recycle bin view based on the current state
    setIsRecycleBinView(!isRecycleBinView);
    setIsHovered(false);
  };

  // const handleBackClick = () => {
  //   setIsRecycleBinView(false);
  // };

  const RecycleBinView = () => (
    <div className={styles.recycle_div}>
      <div className={styles.recycle_icon} onClick={handleRecycleBinClick}>
        <svg
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.292892 7.29289C-0.0976315 7.68342 -0.0976314 8.31658 0.292893 8.70711L6.65686 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928933C7.68054 0.538409 7.04738 0.538409 6.65685 0.928933L0.292892 7.29289ZM20 7L1 7L1 9L20 9L20 7Z"
            fill="black"
          />
        </svg>
      </div>

      <p className={styles.recycle_p}>Recycle Bin</p>
    </div>
  );



  const handleSectionClick = (section: 'files' | 'folders' | 'dropdown') => {
    setActiveSection(section);
  };

  const filteredData = libData.filter((data) => {
    const matchesSearch =
      data.iconName.toLowerCase().includes(searchValue.toLowerCase()) ||
      data.name.toLowerCase().includes(searchValue.toLowerCase());
    const matchesType =
      selectedType === 'all' || data.FileType === selectedType;
    return matchesSearch && matchesType;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortOption) {
      case 'name':
        return a.iconName.localeCompare(b.iconName);
      case 'date':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'size':
        const sizeA = parseFloat(a.size);
        const sizeB = parseFloat(b.size);
        return sizeA - sizeB;
      default:
        return 0;
    }
  });

  // Handle click outside the dropdown to close it (if necessary)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        // setActiveSection(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.libraryHeader}>
        <h3>Library</h3>
      </div>

      {/* {isRecycleBinView && <RecycleBinView />} */}

      {isRecycleBinView ? (
        <RecycleBinView />
      ) : (
        <div className={styles.libSecHeader}>
          <div className={styles.libSecHeader_left}>
            <button
              onClick={() => handleSectionClick('files')}
              className={`${styles.buttons} ${activeSection === 'files' ? styles.clickedButton : ''}`}
              style={{
                color: activeSection === 'files' ? '#ffffff' : '',
                backgroundColor: activeSection === 'files' ? '#377CF6' : '',
                border: activeSection === 'files' ? '0px solid #377CF6' : '' 
              }}
            >
              All files
            </button>

            <button
              onClick={() => handleSectionClick('folders')}
              className={`${styles.buttons} ${activeSection === 'folders' ? styles.clickedButton : ''}`}
              style={{
                color: activeSection === 'folders' ? '#ffffff' : '',
                backgroundColor: activeSection === 'folders' ? '#377CF6' : '',
                border: activeSection === 'folders' ? '0px solid #377CF6' : ''
              }}
            >
              All folders
            </button>

            <div
              ref={dropdownRef}
              className={styles.verticalDots}
              onClick={handleDivClick}
              style={toggleClick ? { borderColor: '#377cf6' } : {}}
              >
              <DropDownLibrary
                onSelectType={(type: string) => {
                  setSelectedType(type);
                  handleSectionClick('dropdown');
                }}
              />
            </div>
          </div>

          <div className={styles.libSecHeader_right}>
            <SortByLibrary
              onSort={(option: 'none' | 'name' | 'date' | 'size') =>
                setSortOption(option)
              }
            />

            <div className={styles.searchWrapper}>
              <IoMdSearch />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search by file name or person"
                className={styles.searchInput}
              />
            </div>
            <NewFile />
            <div
              className={styles.recycleBin}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleRecycleBinClick} // Handle click to toggle RecycleBinView
            >
              <img
                src={isHovered ? ICONS.recycleBinColor : ICONS.recycleBin}
                alt="recycle-bin"
              />
            </div>
          </div>
        </div>
      )}


      {activeSection === 'folders' ? (<p>Folder View</p>) : 
      
      <div className={styles.libSectionWrapper}>
      <div className={styles.lib_Grid_Header}>
        <div className={`${styles.grid_item} ${styles.table_name}`}>Name</div>
        <div className={styles.grid_item}>Uploaded by</div>
        <div className={styles.grid_item}>Uploaded Date</div>
        <div className={styles.grid_item}>Actions</div>
      </div>

      {filteredData.length > 0 ? (
        sortedData.map((data, index) => (
          <div className={styles.libGridItem} key={index}>
            <div className={`${styles.file_icon} ${styles.image_div}`}>
              <img
                className={styles.cardImg}
                src={data.url}
                alt={`${data.iconName}-icon`}
              />
              <div>
                <p className={styles.name}>{data.iconName}</p>
                <p className={styles.size}>{data.size}</p>
              </div>
            </div>
            <div className={styles.grid_item}>{data.name}</div>
            <div className={styles.grid_item}>{data.date}</div>
            <div className={`${styles.grid_item} ${styles.grid_icon}`}>
              {isRecycleBinView ? (
                <div>
                  <RiDeleteBinLine
                    className={styles.icons}
                    style={{
                      height: '18px',
                      width: '18px',
                      color: '#667085',
                    }}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <RxDownload
                      className={styles.icons}
                      style={{
                        height: '18px',
                        width: '18px',
                        color: '#667085',
                      }}
                    />
                  </div>
                  <div>
                    <RiDeleteBinLine
                      className={styles.icons}
                      style={{
                        height: '18px',
                        width: '18px',
                        color: '#667085',
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No matching files found.</p>
      )}
    </div>
    }

      
    </div>
  );
};

export default LibraryHomepage;













































