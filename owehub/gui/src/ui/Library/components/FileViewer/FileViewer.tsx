import React, { useState, useEffect, useCallback, RefObject } from 'react';
import { ICONS } from "../../../../resources/icons/Icons"
import { MdClose } from 'react-icons/md'
import { TransformWrapper, TransformComponent, useControls, ReactZoomPanPinchContentRef, ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import styles from "./index.module.css"
interface IProps {
    fileUrl?: string | undefined;
    fileType?: string | undefined;
    onClose?: () => void
    name?: string
}

const FileViewer = ({ fileUrl = "", fileType = "", onClose, name }: IProps) => {
    const zoomWrapperRef = React.useRef<ReactZoomPanPinchRef>(null);
    const [isExpanded, setIsExpanded] = useState(false)
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
    console.log(zoomWrapperRef?.current, "regggg")
    return (
        <div className='transparent-model' >
            <div className='bg-white p2 ml2 mr2' style={{ maxWidth: 800, borderRadius: 12, width: "100%", minHeight: 200 }}>
                <div className='flex mb2 items-center justify-between' >
                    <h4 style={{ fontSize: 14 }} > {name} </h4>
                    <button
                        className={styles.close_btn}
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
                        :
                        <div className='relative flex items-center justify-center mx-auto' style={{
                            maxWidth: isExpanded ? '100%' : 800,
                            borderRadius: 12,
                            width: "100%",
                            minHeight: 200,
                            position: isExpanded ? 'fixed' : 'relative',
                            top: isExpanded ? 0 : 'auto',
                            left: isExpanded ? 0 : 'auto',
                            right: isExpanded ? 0 : 'auto',
                            bottom: isExpanded ? 0 : 'auto',
                            zIndex: isExpanded ? 9999 : 'auto'
                        }}>
                            <TransformWrapper
                                smooth
                                minScale={1}
                                maxScale={10}
                                ref={zoomWrapperRef}
                                zoomAnimation={{
                                    animationType: "linear",
                                    animationTime: 500
                                }}
                                wheel={{
                                    smoothStep: .1
                                }}
                            >
                                <TransformComponent  >
                                    <div
                                        className='mx-auto'
                                        style={{ width: '100%', height: '100%', cursor: "zoom-in" }}
                                    >
                                        <img
                                            className='mx-auto block'
                                            src={fileUrl}
                                            alt={name}
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: isExpanded ? '100vh' : 500,
                                                pointerEvents: 'none'
                                            }}
                                        />


                                    </div>

                                </TransformComponent>

                            </TransformWrapper>
                            <div className={styles.absolute_zoom_control_wrapper}>
                                <button onClick={() => zoomWrapperRef?.current?.zoomIn()}> + </button>
                                <button onClick={() => zoomWrapperRef?.current?.zoomOut()}> - </button>
                                <button onClick={() => zoomWrapperRef?.current?.resetTransform()}> Reset </button>
                                <button onClick={() => setIsExpanded(prev => !prev)}>  {isExpanded ? "Collapse" : "Expand"}  </button>
                            </div>
                        </div>

                }

            </div>

        </div>
    )
}

export default FileViewer
