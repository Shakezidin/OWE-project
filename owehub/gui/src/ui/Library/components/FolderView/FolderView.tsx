import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../resources/icons/Icons';
import styles from './folderView.module.css';

interface FolderViewProps {
  onCheckboxChange: (isChecked: boolean, index: number) => void;
  sortOption: 'none' | 'name' | 'date' | 'size';
  checkedFolders: number[];
}

function FolderView({
  onCheckboxChange,
  sortOption,
  checkedFolders,
}: FolderViewProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [folderData, setFolderData] = useState([
    {
      url: ICONS.folderImage,
      name: 'Joy Robert',
      date: '20 sep,24',
      folderOf: 'Dealer Owner',
      size: '565 KB',
      fileType: 'folder',
      quantity: '8 files',
    },
    {
      url: ICONS.folderImage,
      name: 'Joy Robert',
      date: '20 sep,24',
      folderOf: 'Dealer Owner',
      size: '300 KB',
      fileType: 'folder',
      quantity: '8 files',
    },
    {
      url: ICONS.folderImage,
      name: 'Joy Robert',
      date: '20 sep,24',
      folderOf: 'Johnny Depp',
      size: '565 KB',
      fileType: 'folder',
      quantity: '16 files',
    },
    {
      url: ICONS.folderImage,
      name: 'Joy Robert',
      date: '20 jan,24',
      folderOf: 'Dealer Owner',
      size: '300 KB',
      fileType: 'folder',
      quantity: '8 files',
    },
    {
      url: ICONS.folderImage,
      name: 'Joy Robert',
      date: '20 sep,24',
      folderOf: 'Dealer Owner',
      size: '565 KB',
      fileType: 'folder',
      quantity: '8 files',
    },
    {
      url: ICONS.folderImage,
      name: 'Joy Robert',
      date: '20 sep,24',
      folderOf: 'Nicolas cage',
      size: '565 KB',
      fileType: 'folder',
      quantity: '8 files',
    },
    {
      url: ICONS.folderImage,
      name: 'Joy Robert',
      date: '28 feb,24',
      folderOf: 'Dealer Owner',
      size: '565 KB',
      fileType: 'folder',
      quantity: '24 files',
    },
    {
      url: ICONS.folderImage,
      name: 'Al pacino',
      date: '20 sep,24',
      folderOf: 'Dealer Owner',
      size: '565 KB',
      fileType: 'folder',
      quantity: '8 files',
    },
    {
      url: ICONS.folderImage,
      name: 'Joy Robert',
      date: '28 sep,24',
      folderOf: 'Dealer Owner',
      size: '565 KB',
      fileType: 'folder',
      quantity: '8 files',
    },
    {
      url: ICONS.folderImage,
      name: 'Sanju Samson',
      date: '06 mar,24',
      folderOf: 'Brad Pitt',
      size: '565 KB',
      fileType: 'folder',
      quantity: '8 files',
    },
    {
      url: ICONS.folderImage,
      name: 'Joy Robert',
      date: '20 sep,24',
      folderOf: 'Al pacino',
      size: '800 KB',
      fileType: 'folder',
      quantity: '12 files',
    },
    {
      url: ICONS.folderImage,
      name: 'Nicolas Cage',
      date: '20 sep,24',
      folderOf: 'Dealer Owner',
      size: '565 KB',
      fileType: 'folder',
      quantity: '8 files',
    },
    {
      url: ICONS.folderImage,
      name: 'Joy Robert',
      date: '20 sep,24',
      folderOf: 'Dealer Owner',
      size: '890 KB',
      fileType: 'folder',
      quantity: '8 files',
    },
    {
      url: ICONS.folderImage,
      name: 'Joy Robert',
      date: '20 sep,24',
      folderOf: 'Robert De Niro',
      size: '565 KB',
      fileType: 'folder',
      quantity: '8 files',
    },
    {
      url: ICONS.folderImage,
      name: 'Joy Robert',
      date: '20 sep,24',
      folderOf: 'Dealer Owner',
      size: '699 KB',
      fileType: 'folder',
      quantity: '8 files',
    },
  ]);

  useEffect(() => {
    const sortedData = [...folderData].sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.folderOf.localeCompare(b.folderOf);
        case 'date':
          const dateA = new Date(
            a.date.split(',')[0].split(' ').reverse().join(' ')
          );
          const dateB = new Date(
            b.date.split(',')[0].split(' ').reverse().join(' ')
          );
          return dateB.getTime() - dateA.getTime();
        case 'size':
          return parseInt(b.size) - parseInt(a.size);
        default:
          return 0;
      }
    });
    setFolderData(sortedData);
  }, [sortOption]);

  return (
    <div className={styles.folderMain_wrapper}>
      {folderData.map((folder, index) => (
        <div
          className={styles.folderDiv}
          key={index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className={styles.createdByWrapper}>
            <p className={styles.createdBy}>Created by</p>
            <p className={styles.createdByName}>{folder.name}</p>
          </div>
          <div className={styles.folderIcon_wrapper}>
            <div className={styles.charDiv}>{folder.name.charAt(0)}</div>
            <img src={folder.url} alt="" />
            <div className={styles.checkboxWrapper}>
              <p className={styles.quantity}>{folder.quantity}</p>
              <input
                className={`${styles.folderInput} ${
                  checkedFolders.includes(index) || hoveredIndex === index
                    ? styles.visible
                    : styles.hidden
                }`}
                type="checkbox"
                onChange={(e) => onCheckboxChange(e.target.checked, index)}
                checked={checkedFolders.includes(index)}
              />
            </div>
          </div>

          <div className={styles.folderContent_wrapper}>
            <div className={styles.folder_name}>{folder.folderOf}</div>
            <div className={styles.folderInfo_wrapper}>
              <div className={styles.foldersize}>{folder.size}</div>
              <div className={styles.folderdate}>{folder.date}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FolderView;
