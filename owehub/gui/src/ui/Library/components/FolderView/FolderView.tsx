import React from 'react';
import { ICONS } from '../../../../resources/icons/Icons';
import styles from './folderView.module.css';
 
function FolderView() {
   const folderData = [
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
      size: '565 KB',
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
      size: '565 KB',
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
      size: '565 KB',
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
      size: '565 KB',
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
      size: '565 KB',
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
    

    ];
 
  return (
    <div className={styles.folderMain_wrapper}>
       {folderData.map((folder, index) => (
        <div className={styles.folderDiv} key={index}>
          <div className={styles.folderIcon_wrapper}>
            <div className={styles.charDiv}>{folder.name.charAt(0)}</div>
            <img src={folder.url} alt="" />
            <input className={styles.folderInput} type="checkbox" />
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