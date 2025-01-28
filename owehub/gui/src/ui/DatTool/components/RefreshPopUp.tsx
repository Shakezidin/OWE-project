import React from 'react'
import style from '../styles/RefreshPopUp.module.css'
import refreshImg from '../assets/Group.png';
const RefreshPopUp = ({setOpenRefresh}:any) => {
  return (
    <div>
        <div className={style.openRefresh}>
            <div  className={style.openRefresh_page}>
                <img src={refreshImg} alt="" />
                <p className={style.openRefresh_page_text}>Do you really want to Refresh the Entire page?</p>
                <div  className={style.openRefresh_page_btns}>
                    <div className={style.openRefresh_page_btn_yes} onClick={()=>{window.location.reload()}}>Yes</div>
                    <div className={style.openRefresh_page_btn_No} onClick={()=>setOpenRefresh(false)}>No</div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default RefreshPopUp