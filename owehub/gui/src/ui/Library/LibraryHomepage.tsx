import React, { useState } from 'react';
import { AddNewButton } from '../components/button/AddNewButton';
import styles from './LibraryHomepage.module.css'; // Importing styles from the CSS module
import { ICONS } from '../../resources/icons/Icons';
import { IoMdSearch } from 'react-icons/io';
import { IoChevronDownSharp } from "react-icons/io5";
import { RxDownload } from "react-icons/rx";
import { RiDeleteBinLine } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";




const LibraryHomepage = () => {
  const [searchValue, setSearchValue] = useState('');

  const libData = [
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
    {
      url: `${ICONS.pdf}`,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'ICONS.pdf',
    },
  ];

  return (
    <div
      className={`${(styles.libraryContainer)} `}
    >
      <div className={`${styles.libraryHeader}`}>
        <h3>Library</h3>
      </div>

      <div className={`${styles.libSecHeader}`}>
        <div className={`${styles.libSecHeader_left}`}>
          <button>All files</button>
          <button>All folder</button>
          <div className={`${styles.verticalDots}`}>
          <BsThreeDotsVertical color="#8C8C8C" />
          </div>
        </div>

        <div className={`${styles.libSecHeader_right}`}>
          <div className={`${styles.sorting}`} >
            <p>Sort by</p>
            <div className={`${styles.chevron_icon}`}>
            <IoChevronDownSharp  color="#8C8C8C"/>
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
          {/* <div className={`${styles.recycleBin}`}>
            {' '}
            <img src={ICONS.recycleBin} alt="" />
          </div> */}
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

        {/* Render data rows */}
        <div className={styles.libGridItem}>
          {libData.map((data, index) => (
            <React.Fragment key={index}>
<div className={`${styles.file_icon} ${styles.image_div}`}>
<img
                  className={styles.cardImg}
                  src={data.url}
                  alt="pdf-images"
                />
                <p>{data.iconName}</p>
              </div>
              <div className={styles.grid_item}>{data.name}</div>
              <div className={styles.grid_item}>{data.date}</div>
              <div className={`${styles.grid_item} ${styles.grid_icon}`}>
              <div><RxDownload />
                </div>
                <div><RiDeleteBinLine />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LibraryHomepage;
