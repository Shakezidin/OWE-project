import React from 'react'
import { RxCross2 } from 'react-icons/rx'

const EditModal = ({ open, handleClose }: any) => {
    return (
        <>
            {open &&
                <div className="transparent-model">
                    <div className='rep-mod-top'>
                        <div className='ahj-header'>
                            <p>Edit Target</p>
                            <RxCross2 className="edit-report-cross-icon" size={20} onClick={handleClose} style={{ cursor: "pointer" }} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default EditModal
