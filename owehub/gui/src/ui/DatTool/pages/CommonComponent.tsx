import React from 'react'
import { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FiArrowRight } from 'react-icons/fi';
import { MdClose, MdDone } from 'react-icons/md';
import { ICONS } from '../../../resources/icons/Icons';
import styles from '../styles/GeneralPage.module.css';
import { current } from '@reduxjs/toolkit';
import DataNotFound from '../../components/loader/DataNotFound';
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
}
const CommonComponent: React.FC<commonComponentProps> = ({generalData,loading}) => {
      
  const handleClick = (index: number): void => setActiveIndex(index);
  
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
 
  
  const handleEdit = (): void => setIsEditing(true);
  const handleSave = (): void => setIsEditing(false);
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
  
  return (
    <div> {loading ? <div> </div> : generalData ? <div className={styles.genOneCont}>
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
              >
                <AiOutlineEdit />
              </div>
            )}
          </div>
        </div>
        <div className={styles.gOneHeaderDesc}>
          {[
            { type: 'text', value: generalData?.project_address },
            { type: 'tel', value: generalData?.phone_number },
            { type: 'email', value: generalData?.email_id },
          ].map((input, index) => (
            <input
              key={index}
              type={input.type}
              defaultValue={input.value}
              className={`${styles.inputField} ${isEditing ? styles.editable : ''}`}
              disabled={!isEditing}
            />
          ))}
        </div>

        <div className={styles.gOneLeftInfo}>
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
        </div>
      </div>
    </div>

    {}
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