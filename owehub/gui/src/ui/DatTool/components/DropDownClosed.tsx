import React from 'react'
import style2 from '../styles/sideContainerMobile.module.css'
import searchIcon from '../assets/searchIcon.svg';
import downArrow from '../assets/downArrow.svg';
interface DropDownClosed{
  showMore:boolean;
  setShowMore:any;
  mappedDataList: any[]; 
  currentGeneralId: string | null; 
}
const DropDownClosed: React.FC<DropDownClosed> = ({setShowMore,showMore,mappedDataList,currentGeneralId}) => {
  return (
    <div>
        <div className={style2.container} onClick={()=>setShowMore(true)} style={{ borderRadius:showMore?'28px 28px 0 0':'28px'}}>
        <div className={style2.textContentDiv}> 
          <img src={searchIcon} alt="" className={style2.searchImg}/>
          <div className={style2.textDiv}> 
          <p className={style2.text1}>{mappedDataList.find(item => item.projectID === currentGeneralId)?.name || 'No Project Found'}</p>
          <p className={style2.text2}>{mappedDataList.find(item => item.projectID === currentGeneralId)?.projectID || 'NA'}</p>
          </div>
        </div>

        <div className={style2.showMore}> {<img src={downArrow} alt="" className={style2.downArrow}/>} </div>

        
      </div>
    </div>
  )
}

export default DropDownClosed