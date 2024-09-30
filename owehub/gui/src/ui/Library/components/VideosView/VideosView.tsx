import React from 'react';
import { ICONS } from '../../../../resources/icons/Icons';
import styles from './videosview.module.css';
import { PiLineVerticalThin } from "react-icons/pi";
 
function VideosView() {
    const folderData = [
        {
          url: ICONS.viedoImageOne,
          url_play:ICONS.viedoplay,
          name: 'Joy Robert',
          date: '2 Aug 2024',
          folderOf: 'UNTD SOLAR_.PDF',
          size: '34.82 MB',
          fileType: 'folder',
          quantity: '8 files',
        },
    
        {
            url: ICONS.viedoImageOne,
            url_play:ICONS.viedoplay,
            name: 'Joy Robert',
            date: '2 Aug 2404',
            folderOf: 'UNTD SOLAR_.PDF',
            size: '34.82 MB',
            fileType: 'folder',
            quantity: '8 files',
          },
          {
            url: ICONS.viedoImageOne,
            url_play:ICONS.viedoplay,
            name: 'Joy Robert',
            date: '2 Aug 2404',
            folderOf: 'UNTD SOLAR_.PDF',
            size: '34.82 MB',
            fileType: 'folder',
            quantity: '8 files',
          }, {
            url: ICONS.viedoImageOne,
            url_play:ICONS.viedoplay,
            name: 'Joy Robert',
            date: '2 Aug 2404',
            folderOf: 'UNTD SOLAR_.PDF',
            size: '34.82 MB',
            fileType: 'folder',
            quantity: '8 files',
          }
    ]
   
 
  return (
    <div className={styles.folderMain_wrapper}>
    {folderData.map((folder, index) => (
     <div className={styles.folderDiv} key={index}>
         
         <div className={styles.videoImage_wrapper}>
         <div className={styles.transparent_play}>
            <img src={folder.url_play} alt="" className={styles.transparent_play_botton} />
         </div>
            <div className={styles.video_time}>23.45</div>
            <img src={folder.url} alt=""  className={styles.videosview_images} />    
         </div>
        
        

       <div className={styles.folderContent_wrapper}>
            <div className={styles.videosview_name}>{folder.folderOf}</div>
            <div className={styles.videoInfo_wrapper}>
                  <div className={styles.videosSize}>{folder.size}</div>
                 <PiLineVerticalThin className={styles.videos_piline}/>
                <div className={styles.videosdate}>{folder.date}</div>
                 <PiLineVerticalThin className={styles.videos_piline}/>
                 <div className={styles.video_name}>{folder.name}</div>
           </div> 
         
       </div>
     </div>
   ))} 

 </div>
  );
}
 
export default VideosView;