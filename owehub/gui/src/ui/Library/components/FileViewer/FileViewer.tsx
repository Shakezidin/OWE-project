import React, { useState, useEffect } from 'react';

import { MdClose } from 'react-icons/md'
interface IProps {
    fileUrl?: string | undefined;
    fileType?: string | undefined;
    onClose?: () => void
    name?:string
}

const FileViewer = ({ fileUrl = "", fileType = "", onClose,name }: IProps) => {


    return (
        <div className='transparent-model' >
            <div className='bg-white p2' style={{maxWidth:800 ,borderRadius:12,width:"100%",minHeight:200}}>
                <div className='flex mb2 items-center justify-between' >
                    <h4 style={{fontSize:14}} > {name} </h4>
                    <button
                        className='close-btn'
                        onClick={(e) => {
                            onClose?.()
                        }}
                    >
                        <MdClose color='#000' size={32} />
                    </button>
                </div>
                <img className='mx-auto block' src={fileUrl} alt={name} style={{maxWidth:"100%",maxHeight:"100%"}} />
            </div>

        </div>
    )
}

export default FileViewer