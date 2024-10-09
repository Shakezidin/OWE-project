import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { MdClose } from 'react-icons/md';
import "./index.css";

interface IPlayer {
    width?: number;
    height?: number;
    url?: string;
    onClose?: () => void;
    videoName?: string;
}

const VideoPlayer = ({ width = 900, height = 650, url = "", onClose, videoName }: IPlayer) => {
    const playerRef = useRef<ReactPlayer | null>(null);
    
    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event bubbling
        if (playerRef.current) {
            playerRef.current.getInternalPlayer().pause(); // Explicitly pause the video
        }
        if (onClose) {
            onClose(); // Call the onClose handler
        }
    };

    return (
        <div className='transparent-model' onClick={handleClose}>
            <div>
                <p className='videoName'>{videoName}</p>
            </div>
            <button 
                className='close-btn' 
                onClick={(e) => {
                    e.stopPropagation(); // Prevent bubbling to the parent
                    handleClose(e); // Call handleClose
                }}
            >
                <MdClose color='#000' size={32}/>
            </button>
            <div className="bg-white">
                <ReactPlayer
                    ref={playerRef}
                    url={url}
                    width={width}
                    height={height}
                    controls={true}
                    onReady={() => console.log('Player is ready')}
                    onPause={() => console.log('Video paused')} // Debugging log
                />
            </div>
        </div>
    );
}

export default VideoPlayer;
