import React from 'react'
import style2 from '../styles/sideContainerMobile.module.css'
import searchIcon from '../assets/searchIcon.svg';
import downArrow from '../assets/downArrow.svg';
interface DropDownOpen{
    showMore:boolean;
    setShowMore:any;
    mappedDataList: any[]; 
    currentGeneralId: string | null; 
  }
const DropDownOpen: React.FC<DropDownOpen>  = ({setShowMore,showMore,mappedDataList,currentGeneralId}) => {
  return (
    <div>
        <div className={style2.containerOpen}  style={{ borderRadius:'28px 28px 0 0'}} >
        <div className={style2.openDiv}> 
        <div className={style2.textContentDiv}> 
          <img src={searchIcon} alt="" className={style2.searchImg}/>
        </div>
        <input 
        type='text'
        style={{width:"90%",backgroundColor:"#39393F"}}
        className={style2.inputDiv}
        placeholder='Search by project id.'
        />

        <div className={style2.showMore} onClick={()=>setShowMore(false)}> { <img src={downArrow} alt="" style={{transform:"rotate(180deg)"}} className={style2.downArrow}/>} </div>

        
      </div>
        </div>
    </div>
  )
}

export default DropDownOpen