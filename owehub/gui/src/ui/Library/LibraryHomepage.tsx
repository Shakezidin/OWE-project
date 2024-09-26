import React, { useEffect, useRef, useState } from 'react';
import { AddNewButton } from '../components/button/AddNewButton';
import styles from './LibraryHomepage.module.css';
import { ICONS } from '../../resources/icons/Icons';
import { IoMdSearch } from 'react-icons/io';
import { IoChevronDownSharp } from 'react-icons/io5';
import { RxDownload } from 'react-icons/rx';
import { RiDeleteBinLine } from 'react-icons/ri';
import DropDownLibrary from './Modals/DropDownLibrary';
import SortByLibrary from './Modals/SortByLibrary';
import NewFile from './Modals/NewFile';

const LibraryHomepage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeSection, setActiveSection] = useState<
    'files' | 'folders' | 'dropdown' | null
  >(null);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<
    'none' | 'name' | 'date' | 'size'
  >('none');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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
    setIsClicked(!isClicked);
  };

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setActiveSection(null);
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

      <div className={styles.libSecHeader}>
        <div className={styles.libSecHeader_left}>
          <button
            onClick={() => handleSectionClick('files')}
            className={`${styles.buttons} ${activeSection === 'files' ? styles.clickedButton : ''}`}
            style={{
              color: activeSection === 'files' ? '#377CF6' : '',
              backgroundColor: activeSection === 'files' ? '#EFF5FF' : '',
            }}
          >
            All files
          </button>

          <button
            onClick={() => handleSectionClick('folders')}
            className={`${styles.buttons} ${activeSection === 'folders' ? styles.clickedButton : ''}`}
            style={{
              color: activeSection === 'folders' ? '#377CF6' : '',
              backgroundColor: activeSection === 'folders' ? '#EFF5FF' : '',
            }}
          >
            All folders
          </button>

          <div
            ref={dropdownRef}
            className={`${styles.verticalDots} ${activeSection === 'dropdown' ? styles.clicked : ''}`}
            onClick={() => {
              setActiveSection(
                activeSection === 'dropdown' ? null : 'dropdown'
              );
            }}
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
          >
            <img
              src={isHovered ? ICONS.recycleBinColor : ICONS.recycleBin}
              alt="recycle-bin"
            />
          </div>
        </div>
      </div>

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
                <div>
                  <RxDownload
                    className={styles.icons}
                    style={{ height: '18px', width: '18px', color: '#667085' }}
                  />
                </div>
                <div>
                  <RiDeleteBinLine
                    className={styles.icons}
                    style={{ height: '18px', width: '18px', color: '#667085' }}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No matching files found.</p>
        )}
      </div>
    </div>
  );
};

export default LibraryHomepage;
