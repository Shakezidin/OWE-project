import React, { useState, useEffect } from 'react';
import { ICONS } from "../../../../resources/icons/Icons"
import { MdClose } from 'react-icons/md'
interface IProps {
    fileUrl?: string | undefined;
    fileType?: string | undefined;
    onClose?: () => void
    name?: string
}

const FileViewer = ({ fileUrl = "", fileType = "", onClose, name }: IProps) => {
    const isAudio = (mimeType: string): boolean => {
        switch (mimeType) {
            case "audio/mpeg":
            case "audio/mp3":
            case "audio/wav":
            case "audio/x-wav":
            case "audio/ogg":
            case "audio/aac":
            case "audio/midi":
            case "audio/x-midi":
            case "audio/webm":
            case "audio/flac":
            case "audio/x-m4a":
            case "audio/x-matroska":
                return true;
            default:
                return false;
        }
    };

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
            <div className='bg-white p2 ml2 mr2' style={{ maxWidth: 800, borderRadius: 12, width: "100%", minHeight: 200 }}>
                <div className='flex mb2 items-center justify-between' >
                    <h4 style={{ fontSize: 14 }} > {name} </h4>
                    <button
                        className='close-btn'
                        onClick={(e) => {
                            onClose?.()
                        }}
                    >
                        <MdClose color='#000' size={32} />
                    </button>
                </div>
                {
                    isAudio(fileType) ?
                        <>
                            <img className='mx-auto block' src={ICONS.audioPlaceholder} alt="" />
                            <audio controls className='mx-auto block mt2' src={fileUrl} style={{ maxWidth: "100%", maxHeight: 500 }} />
                        </>
                        : <img className='mx-auto block' src={fileUrl} alt={name} style={{ maxWidth: "100%", maxHeight: 500 }} />
                }

            </div>

        </div>
    )
}

export default FileViewer