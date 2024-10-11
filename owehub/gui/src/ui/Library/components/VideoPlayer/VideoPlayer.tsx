import React, { useState, useRef, useEffect } from 'react';
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

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            console.log('Key pressed:', event.key); 
            if (event.key === 'Escape') {
                console.log('Escape key pressed'); 
                onClose?.();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    return (
        <div className='transparent-model' >

            <div style={{ minHeight: 400, maxWidth: width,width:"100%",borderRadius:12,maxHeight:600 }} className="bg-white p2 relative">

                <div className='flex mb2 items-center justify-between' >
                    <h4 > {videoName} </h4>
                    <button
                        className='close-btn'
                        onClick={(e) => {
                           onClose?.()
                        }}
                    >
                        <MdClose color='#000' size={32} />
                    </button>
                </div>
                <ReactPlayer
                    url={url}
                    width={"100%"}
                    height={"100%"}
        
                    controls={true}
                />
            </div>
        </div>
    );
}

export default VideoPlayer;
