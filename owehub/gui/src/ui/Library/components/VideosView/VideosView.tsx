import React from 'react';
import { ICONS } from '../../../../resources/icons/Icons';
import styles from './videosview.module.css';
import dummyVideoThumbnail from '../../assetss/dummyVideoThumbnail.svg'
import playBtn from '../../assetss/playBtn.svg'
import { PiLineVerticalThin } from "react-icons/pi";
import dummyThumbnail from '../../assetss/dummyThumbnail.svg'
// Define the interface for the video data
interface VideoData {
  url: string;
  name: string;
  lastModifiedDateTime: string;
  iconName: string;
  size: number;
  FileType?: string; // Marking it as optional if some entries don't have it
  url_play?: string;
  video?:{
    duration?:string;
  }
  "@microsoft.graph.downloadUrl": string;
  fileType?: string; // Optional, only relevant for video files
  
}

interface VideosViewProps {
  videoData: VideoData[]; // Expect an array of VideoData objects
  onClick:(url:string,name?:string)=>void;
}
console.log();

function VideosView({ videoData, onClick}: VideosViewProps) {
  return (
    <div className={styles.folderMain_wrapper}>
      {videoData.map((Video: VideoData, index: number) => (
        <div className={styles.folderDiv} key={index} onClick={()=>onClick(Video["@microsoft.graph.downloadUrl"],Video.name)}>
          <div className={styles.videoImage_wrapper}>
            <div className={styles.transparent_play}>
              <img
                src={playBtn}
                alt="Play"
                className={styles.transparent_play_botton}
              />
            </div>
            <div className={styles.video_time}>
          {Video.video?.duration !== undefined 
          ? (() => {
          const durationMs = parseInt(Video.video.duration);
          const totalSeconds = durationMs / 1000;

          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = (totalSeconds % 60).toFixed(2);

          return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`;
      })() 
    : ''}
</div>

            <img
              src={dummyThumbnail}
              alt="Video Thumbnail"
              className={styles.videosview_images}
            />
          </div>

          <div className={styles.folderContent_wrapper}>
            <div className={styles.videosview_name}>{Video.iconName}</div>
            <div className={styles.videoInfo_wrapper}>
              <div className={styles.videosSize}>{Video.size}</div>
              <PiLineVerticalThin className={styles.videos_LineVertical} />
              <div className={styles.videosdate}>{Video.lastModifiedDateTime.substring(0,10)}</div>
           
              <PiLineVerticalThin  className={styles.videos_LineVertical}/>
              <div className={styles.video_name}>{Video.name.substring(0,20)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideosView;
