import React, { useEffect } from 'react'
import { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FiArrowRight } from 'react-icons/fi';
import { MdClose, MdDone } from 'react-icons/md';
import { ICONS } from '../../../resources/icons/Icons';
import styles from '../styles/GeneralPage.module.css';
import { current } from '@reduxjs/toolkit';
import DataNotFound from '../../components/loader/DataNotFound';
import { useAppDispatch } from '../../../redux/hooks';
import { updateDatTool } from '../../../redux/apiActions/DatToolAction/datToolAction';
import openDropDown from '../assets/dropOpen.png';
import closeDropDown from '../assets/dropClose.png';
import { FaChevronDown,FaChevronUp } from "react-icons/fa";
interface GeneralData {
  project_name: string;
  project_id: string;
  project_address: string;
  phone_number: string;
  email_id: string;
  pv_module: string;
  inverters: string;
  battery: string;
  dc_system_size: number;
  ac_system_size: number;
  battery_capacity: number;
  ahj: string;
  utility: string;
  branch: string;
  lender: string;
  aurora_link: string;
  tape_link: string;
  site_capture_url: string;
  contract_date: string;
  module_qty: number;
  module_type: number;
  inverter_type: string;
  battery_type: string;
  ac_dc_system_size: string;
  total_production: number;
  dat_module_qty: number;
  dat_module_type: string;
  dat_design_version: number;
  dat_designer_name: string;
  dat_aurora_id: string;
  dat_system_size_ac: string;
  dat_system_size_dc: string;
  dat_changes: string;
  dat_change_order: string;
}
interface commonComponentProps {
  generalData:GeneralData| null;
  loading:boolean;
  currentGeneralId:string;
  isMobile:boolean;
}
const CommonComponent: React.FC<commonComponentProps> = ({generalData,loading,currentGeneralId,isMobile}) => {
      
  const handleClick = (index: number): void => setActiveIndex(index);
  const [address,setAddress]=useState({value:generalData?.project_address,changed:false});
  const [phoneNumber,setPhoneNumber]=useState({value:generalData?.phone_number,changed:false});
  const [emailId,setEmailId]=useState({value:generalData?.email_id,changed:false});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [openTab,setOpenTab]=useState(false);
 
  const dispatch = useAppDispatch();
  const handleEdit = (): void => setIsEditing(true);
  const handleSave = async(): Promise<void> => {setIsEditing(false);
    await dispatch(updateDatTool(
          {
            project_id: currentGeneralId,
            general_basics: {
              ...(address.changed && { project_address: address.value }),
              ...(phoneNumber.changed && {phone_number: phoneNumber.value}),
              ...(emailId.changed && {email_id: emailId.value}),
            }
          }
        ));
        setAddress(prevState=>({...prevState,changed:false}))
        setPhoneNumber(prevState=>({...prevState,changed:false}))
        setEmailId(prevState=>({...prevState,changed:false}))
  };
  useEffect(()=>{
    setAddress({ value: generalData?.project_address, changed: false });
    setPhoneNumber({ value: generalData?.phone_number, changed: false });
    setEmailId({ value: generalData?.email_id, changed: false });
  },[generalData]);
  const handleCancel = (): void => setIsEditing(false);

  
  const datTabs: string[] = ['7562', '7001', '7002', '7003'];
  
  const systemSpecs = [
    {
      title: generalData?.pv_module || "N/A",
      subtitle: 'PV Modules',
    },
    { title: generalData?.inverters || "N/A", subtitle: 'Inverters' },
    { title: generalData?.battery || "N/A", subtitle: 'Battery' },
  ];
  
  const systemMetrics = [
    { value: generalData?.dc_system_size || "N/A", label: 'DC System Size' },
    { value: generalData?.ac_system_size || "N/A", label: 'AC System Size' },
    { value: generalData?.battery_capacity || "N/A", label: 'Battery Capacity' },
  ];
  
  const rightSideInfo = [
    { label: 'AHJ', value: generalData?.ahj || "N/A" },
    { label: 'Utility', value: generalData?.utility || "N/A" },  
  ];
  
  const bottomInfo = [
    { label: 'Branch', value: generalData?.branch || "N/A" },
    { label: 'Lender', value: generalData?.lender || "N/A" },
  ];
  
  const integrations = [
    { icon: ICONS.DatAurora, name: 'Aurora' },
    { icon: ICONS.DatTape, name: 'Tape' },
    { icon: ICONS.DatCapture, name: 'Site Capture' },
  ];
  const valueChangeHandler = (e: React.ChangeEvent<HTMLInputElement>, fieldType: string) => {
    const value = e.target.value; // Get the new value from the input
  
    if (fieldType === 'text') {
      setAddress({ value, changed: true }); // Assuming setAddress updates the address with the new value
    }
    else if (fieldType === 'tel') {
      setPhoneNumber({ value, changed: true }); // Updates phone number
    }
    else if (fieldType === 'email') {
      setEmailId({ value, changed: true }); // Updates email ID
    }
  }
  return (
    <div> {loading ? <div> </div> : generalData ? <div className={`${styles.genOneCont}`}>
    <div className={styles.genOneLeft}>
      <div className={styles.gOneHeader}>
        <div className={styles.gOneHeaderTitle}>
          <div className={styles.gOneHeaderTitleTxt}>
            <p>{generalData?.project_name}</p>
            <p>{generalData?.project_id}</p>
          </div>
          <div>
            {isEditing ? (
              <div className={styles.gOneHeaderBtn}>
                <div className={styles.editUser} onClick={handleCancel}>
                  <MdClose color="#434343" />
                </div>
                <div className={styles.editUserDone} onClick={handleSave}>
                  <MdDone color="white" />
                </div>
              </div>
            ) : (
              <div
                className={`${styles.editUser} ${isEditing ? styles.active : ''}`}
                onClick={handleEdit}
                style={{display:'none'}}
              >
                <AiOutlineEdit />
              </div>
            )}
          </div>
        </div>
        <div className={styles.gOneHeaderDesc} >
          {[
           
              { type: 'text', value: address, onChange: (e: React.ChangeEvent<HTMLInputElement>) => valueChangeHandler(e, 'text') },
              { type: 'tel', value: phoneNumber, onChange: (e: React.ChangeEvent<HTMLInputElement>) => valueChangeHandler(e, 'tel') },
              { type: 'email', value: emailId, onChange: (e: React.ChangeEvent<HTMLInputElement>) => valueChangeHandler(e, 'email') },
          ].map((input, index) => (
            <input
              key={index}
              type={input.type}
              value={input.value.value}
              className={`${styles.inputField} ${isEditing ? styles.editable : ''}`}
              disabled={!isEditing}
              onChange={(e) => input.onChange(e)}
            />
          ))}
        </div>

       { isMobile ? openTab  &&  <div className={styles.gOneLeftInfo}>
          <div className={styles.gOneLeftInfoTxt}>
            {systemSpecs.map((spec:any, index:any) => (
              <div key={index}>
                <p>{spec.title}</p>
                <p>{spec.subtitle}</p>
              </div>
            ))}
          </div>
          <div className={styles.verticalBorder}></div>
          <div className={styles.gOneLeftInfoTxt}>
            {systemMetrics.map((metric:any, index:any) => (
              <div key={index}>
                <p>{metric.value}</p>
                <p>{metric.label}</p>
              </div>
            ))}
          </div>
        </div> : <div className={styles.gOneLeftInfo}>
          <div className={styles.gOneLeftInfoTxt}>
            {systemSpecs.map((spec:any, index:any) => (
              <div key={index}>
                <p>{spec.title}</p>
                <p>{spec.subtitle}</p>
              </div>
            ))}
          </div>
          <div className={styles.verticalBorder}></div>
          <div className={styles.gOneLeftInfoTxt}>
            {systemMetrics.map((metric:any, index:any) => (
              <div key={index}>
                <p>{metric.value}</p>
                <p>{metric.label}</p>
              </div>
            ))}
          </div>
        </div>}
      </div>


      {isMobile && <div className={styles.dropDownImage} style={{bottom:openTab?"-4%":"-12%"}}> 
      {openTab? <FaChevronUp onClick={()=>setOpenTab(prev=>!prev)}/> : <FaChevronDown onClick={()=>setOpenTab(prev=>!prev)}/>}
      </div>}
    </div>

    


    <div className={styles.genOneRight}>
      <div className={styles.gOneRightTop}>
        {rightSideInfo.map((info:any, index:any) => (
          <div key={index} className={styles.gOneRightTptxt}>
            <p>{info.label}</p>
            <div className={styles.gOneRightTopDesc}>
              <p>{info.value}</p>
              <span>
                <FiArrowRight />
              </span>
            </div>
          </div>
        ))}
        <div className={styles.gOneRightBtm}>
          {bottomInfo.map((info:any, index:any) => (
            <div key={index} className={styles.gOneRightTBottomTxt}>
              <p>{info.label}</p>
              <p>{info.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.gOneRightBottom}>
        <div className={styles.gOneRightBottomTxtOne}>
          {integrations.slice(0, 2).map((integration:any, index:any) => (
            <div key={index} className={styles.gOneRightBottomTxt}>
              <p className={styles.gOneRightBottomTxtImg}>
                <img
                  src={integration.icon}
                  alt={`${integration.name} img`}
                />
                {integration.name}
              </p>
              <span>
                <FiArrowRight />
              </span>
            </div>
          ))}
        </div>
        <div
          className={styles.gOneRightBottomTxt}
          style={{ marginTop: '1.2rem' }}
        >
          <p className={styles.gOneRightBottomTxtImg}>
            <img
              src={integrations[2].icon}
              alt={`${integrations[2].name} img`}
            />
            {integrations[2].name}
          </p>
          <span>
            <FiArrowRight />
          </span>
        </div>
      </div>
    </div> 
  </div>: <div>
        </div>}</div>
  )
}

export default CommonComponent;