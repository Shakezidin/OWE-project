import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import { MdClose } from 'react-icons/md';
import "./index.css"
interface IPlayer {
    width?: number | undefined;
    height?: number | undefined;
    url?: string | undefined;
    onClose?: () => void;
}
const VideoPlayer = ({ width = 900, height = 650, url = "", onClose }: IPlayer) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className='transparent-model' >
            <button  className='close-btn' onClick={onClose} ><MdClose color='#fff' size={32} />  </button>
            <div className="bg-white" >
                <ReactPlayer   onReady={() => setIsLoading(false)} style={{ background: "#fff" }} url={url} width={width} height={height} controls={true} />
            </div>
        </div>
    )
}

export default VideoPlayer