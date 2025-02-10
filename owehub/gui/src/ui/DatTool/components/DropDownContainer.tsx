import React, { useState } from 'react'
import styles from '../styles/SideContainer.module.css'
import style2 from '../styles/sideContainerMobile.module.css'
import MicroLoader from '../../components/loader/MicroLoader'
import searchIcon from '../assets/searchIcon.svg';
import downArrow from '../assets/downArrow.svg';
import DropDownClosed from './DropDownClosed';
import DropDownOpen from './DropDownOpen';
interface DropDownContainerProps{
    loading: boolean; 
  mappedDataList: any[]; 
  currentGeneralId: string | null; 
  isDataEmpty: boolean; 
  handleClick: (id: string) => void; 
  setCurrentGeneralId:any;
  numFlagRef:any;
  data:any;
  showMore:boolean;
  setShowMore:any;
}
const DropDownContainer: React.FC<DropDownContainerProps>  = ({loading,mappedDataList,currentGeneralId,isDataEmpty,handleClick,setCurrentGeneralId,numFlagRef,data,showMore,setShowMore}) => {
      const [isHovered, setIsHovered] = useState<number | null>(null);
      
      
  return (
    <div>
        {showMore ? <DropDownOpen showMore={showMore} setShowMore={setShowMore} mappedDataList={mappedDataList} currentGeneralId={currentGeneralId}/> :<DropDownClosed showMore={showMore} setShowMore={setShowMore} mappedDataList={mappedDataList} currentGeneralId={currentGeneralId}/>}
        
        {showMore && <div className={style2.container2} style={{    padding: "0.6rem 0rem 0.6rem 1.4rem"}}> 
    {
        (loading ? (
          <div className={styles.microLoaderContainer}><MicroLoader /></div>
        ) : isDataEmpty ? (
          <div className={styles.noDataMessage}></div>
        ) : (
          <div className={styles.wrapperBox}>
            <div className={styles.dataBoxWrapper}>
              {mappedDataList?.map((data: any, index: any) => (
                <div key={index} className={styles.dataBox} onClick={() => {setCurrentGeneralId(data.projectID); numFlagRef.current=false}} onMouseOver={() => setIsHovered(index)} onMouseOut={() => setIsHovered(null)} style={{ 
                  backgroundColor: currentGeneralId === data.projectID 
                    ? '#377CF6' 
                    : isHovered === index 
                    ? '#377CF6' 
                    : '', 
                    color:isHovered === index ? '#000000' : '',
                 
                }}>
                  <p className={styles.content_one} style={{ color: currentGeneralId === data.projectID ? '#fafafa' : '' }}>{data.name}</p>
                  <p className={styles.content_two} style={{ color: currentGeneralId === data.projectID ? '#fafafa' : '' }}>{data.projectID}</p>
                  <p className={styles.content_three} style={{ color: currentGeneralId === data.projectID ? '#fafafa' : '' }}>{data.address}</p>
                </div>
              ))}
              {data && <p className={styles.seeMore} onClick={() => handleClick}>See More</p>}
            </div>
          </div>
        ))}
      </div>}</div>
  )
}

export default DropDownContainer