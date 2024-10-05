import React from 'react';
import { ICONS } from '../../../../resources/icons/Icons';
import styles from './videosview.module.css';

// Define the interface for the video data
interface VideoData {
  url: string;
  name: string;
  date: string;
  iconName: string;
  size: string;
  FileType?: string; // Marking it as optional if some entries don't have it
  url_play?: string;
  duration?: string;
  fileType?: string; // Optional, only relevant for video files
}

interface VideosViewProps {
  videoData: VideoData[]; // Expect an array of VideoData objects
}

function VideosView({ videoData }: VideosViewProps) {
  return (
    <div className={styles.folderMain_wrapper}>
      {videoData.map((video: VideoData, index: number) => (
        <div className={styles.folderDiv} key={index}>
          <div className={styles.videoImage_wrapper}>
            <div className={styles.transparent_play}>
              <img
                src={video.url_play}
                alt="Play"
                className={styles.transparent_play_botton}
              />
            </div>
            <div className={styles.video_time}>{video.duration}</div>
            <img
              src={video.url}
              alt="Video Thumbnail"
              className={styles.videosview_images}
            />
          </div>

          <div className={styles.folderContent_wrapper}>
            <div className={styles.videosview_name}>{video.iconName}</div>
            <div className={styles.videoInfo_wrapper}>
              <div className={styles.videosSize}>{video.size}</div>
              <div className={styles.videos_piline}></div>
              <div className={styles.videosdate}>{video.date}</div>
              <div className={styles.videos_piline}></div>
              <div className={styles.video_name}>{video.name}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideosView;
