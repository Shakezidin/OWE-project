import React, { useState, useEffect } from 'react';
import { ICONS } from '../../../../resources/icons/Icons';
import styles from './folderView.module.css';
import { format } from 'date-fns';

interface FolderViewProps {
  onCheckboxChange: (isChecked: boolean, index: number) => void;
  sortOption: 'none' | 'name' | 'date' | 'size';
  checkedFolders: number[];
  folderData:FileOrFolder[];
}
interface FileOrFolder {
  id: string;
  name: string;
  folder?: object;  // Optional for folders
  childCount:number;
  createdDateTime: string;
  eTag: string;
  lastModifiedDateTime: string;
  webUrl: string; // URL to the file
  size: number; 
  shared:object;
  "@microsoft.graph.downloadUrl":string;
  // File size in bytes
  // Include any other properties you expect
}

function FolderView({
  onCheckboxChange,
  sortOption,
  checkedFolders,
  folderData
}: FolderViewProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const [myFolderData, setMyFolderData] = useState(folderData);
  useEffect(() => {
    const sortedData = [...myFolderData].sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          const dateA = new Date(
            a.lastModifiedDateTime.split(',')[0].split(' ').reverse().join(' ')
          );
          const dateB = new Date(
            b.lastModifiedDateTime.split(',')[0].split(' ').reverse().join(' ')
          );
          return dateB.getTime() - dateA.getTime();
        case 'size':
          return parseInt(b.size.toString()) - parseInt(a.size.toString());
        default:
          return 0;
      }
    });
    setMyFolderData(sortedData);
  }, [sortOption]);
  useEffect(()=>{
    console.log(myFolderData, "This is folder data");
  },[]);
  return (
    <div className={styles.folderMain_wrapper}>
      {myFolderData.map((folder) => (
        <div
          className={styles.folderDiv}
          key={folder.id}
          onMouseEnter={() => setHoveredIndex(parseInt(folder.id))}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className={styles.createdByWrapper}>
            <p className={styles.createdBy}>Created by</p>
            <p className={styles.createdByName}>{folder.name}</p>
          </div>
          <div className={styles.folderIcon_wrapper}>
            <div className={styles.charDiv}>{folder.name.charAt(0)}</div>
            <img src={ICONS.folderImage} alt="" />
            <div className={styles.checkboxWrapper}>
              <p className={styles.quantity}>{folder.childCount}</p>
              <input
                className={`${styles.folderInput} ${
                  checkedFolders.includes(parseInt(folder.id)) || hoveredIndex === parseInt(folder.id)
                    ? styles.visible
                    : styles.hidden
                }`}
                type="checkbox"
                onChange={(e) => onCheckboxChange(e.target.checked, parseInt(folder.id))}
                checked={checkedFolders.includes(parseInt(folder.id))}
              />
            </div>
          </div>

          <div className={styles.folderContent_wrapper}>
            <div className={styles.folder_name}>{folder.name}</div>
            <div className={styles.folderInfo_wrapper}>
              <div className={styles.foldersize}>{folder.size<1024?folder.size:Math.round(folder.size/1024)} {folder.size<1024?'kb':'mb'}</div>
              <div className={styles.folderdate}>{format(new Date(folder.lastModifiedDateTime),'dd-MM-yyyy')}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FolderView;
