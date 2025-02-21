import React from 'react'
import style from '../styles/RefreshPopUp.module.css'
import { RiDeleteBinLine } from 'react-icons/ri';
const DeleteImagePopUp = ({setDeleteImage}:any) => {
  return (
    <div>
        <div className={style.openDelete}>
            <div  className={style.openRefresh_page}>
                <div className={style.openRefresh_page_icon}>
                <RiDeleteBinLine color=' #377CF6' size={40}/>
                </div>
                <p className={style.openRefresh_page_text}>Do you really want to delete the image?</p>
                <div  className={style.openRefresh_page_btns}>
                    <div className={style.openRefresh_page_btn_yes} onClick={()=>setDeleteImage(true)}>Yes</div>
                    <div className={style.openRefresh_page_btn_No} onClick={()=>setDeleteImage(false)}>No</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DeleteImagePopUp