import React, { useEffect, useState } from 'react';
import { AddNewButton } from '../components/button/AddNewButton';
import styles from './LibraryHomepage.module.css'; 
import { ICONS } from '../../resources/icons/Icons';
import { IoMdSearch } from 'react-icons/io';
import { IoChevronDownSharp } from 'react-icons/io5';
import { RxDownload } from 'react-icons/rx';
import { RiDeleteBinLine } from 'react-icons/ri';
import { BsThreeDotsVertical } from 'react-icons/bs';
import DropDownLibrary from './DropDownLibrary';


const LibraryHomepage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeButton, setActiveButton] = useState<'files' | 'folders' | null>(null);
  const [isHovered, setIsHovered] = useState(false);



  const libData = [
    {
      url: ICONS.pdf,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.PDF',
      size: '34.82 KB',
    },
    {
      url: ICONS.excelIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.Excel',
      size: '34.82 KB',
    },
    {
      url: ICONS.mp4Icon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Meeting recording.MP4',
      size: '34.82 KB',
    },
    {
      url: ICONS.imageIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Screenshot_1234.jpeg',
      size: '34.82 KB',
    },
    {
      url: ICONS.pdf,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.PDF',
      size: '34.82 KB',
    },
    {
      url: ICONS.excelIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.Excel',
      size: '34.82 KB',
    },
    {
      url: ICONS.mp4Icon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Meeting recording.MP4',
      size: '34.82 KB',
    },
    {
      url: ICONS.imageIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Screenshot_1234.jpeg',
      size: '34.82 KB',
    },
    {
      url: ICONS.pdf,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.PDF',
      size: '34.82 KB',
    },
    {
      url: ICONS.excelIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.Excel',
      size: '34.82 KB',
    },
    {
      url: ICONS.mp4Icon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Meeting recording.MP4',
      size: '34.82 KB',
    },
    {
      url: ICONS.imageIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Screenshot_1234.jpeg',
      size: '34.82 KB',
    },
  ];

  const handleFilesButtonClick = () => {
    setActiveButton('files');
  };
  
  const handleFoldersButtonClick = () => {
    setActiveButton('folders');
  };

  useEffect(() => {
    console.log('Active button changed to:', activeButton);
  }, [activeButton]);
  const filteredData = libData.filter((data) => {
    return (
      data.iconName.toLowerCase().includes(searchValue.toLowerCase()) ||
      data.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.libraryHeader}>
        <h3>Library</h3>
      </div>

      <div className={styles.libSecHeader}>
        <div className={styles.libSecHeader_left}>
        <button
  onClick={handleFilesButtonClick}
  className={`${styles.buttons} ${activeButton === 'folders' ? styles.clickedButton : ''}`}
  style={{
    color: activeButton === 'files' ? '#377CF6' : '',
    backgroundColor: activeButton === 'files' ? '#EFF5FF' : '',
  }}
>
  All files
</button>

<button
  onClick={handleFoldersButtonClick}
  className={`${styles.buttons} ${activeButton === 'folders' ? styles.clickedButton : ''}`}
  style={{
    color: activeButton === 'folders' ? '#377CF6' : '',
    backgroundColor: activeButton === 'folders' ? '#EFF5FF' : '',
  }}
>
  All folders
</button>
          {/* <div onClick={() => {}} className={styles.verticalDots}>
            <BsThreeDotsVertical color="#8C8C8C" />
            <VerticalDots/>
          </div> */}
          <div className={styles.verticalDots}>
            <DropDownLibrary/>

          </div>
        </div>

        <div className={styles.libSecHeader_right}>
          <div className={styles.sorting}>
            <p>Sort by</p>
            <div className={styles.chevron_icon}>
              <IoChevronDownSharp color="#8C8C8C" />
            </div>
          </div>
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
          <AddNewButton title="New" onClick={() => {}} />
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
    {/* <p className={styles.recycleBinContent}>Recycle Bin</p> */}

          {/* <p>Recycle Bin</p> */}

        </div>
      </div>

      <div className={styles.libSectionWrapper}>
        {/* Render grid headers */}
        <div className={styles.lib_Grid_Header}>
          <div className={`${styles.grid_item} ${styles.table_name}`}>Name</div>
          <div className={styles.grid_item}>Uploaded by</div>
          <div className={styles.grid_item}>Uploaded Date</div>
          <div className={styles.grid_item}>Actions</div>
        </div>

        {/* filtered Data on search */}
        {filteredData.length > 0 ? (
          filteredData.map((data, index) => (
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
                  <RxDownload />
                </div>
                <div>
                  <RiDeleteBinLine />
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
