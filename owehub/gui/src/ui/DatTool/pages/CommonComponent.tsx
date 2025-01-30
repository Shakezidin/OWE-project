import React from 'react'
import { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { FiArrowRight } from 'react-icons/fi';
import { MdClose, MdDone } from 'react-icons/md';
import { ICONS } from '../../../resources/icons/Icons';
import styles from '../styles/GeneralPage.module.css';
const CommonComponent = () => {
      // Handler for setting active tab
  const handleClick = (index: number): void => setActiveIndex(index);
  // State variables for controlling editing and active tabs
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
 
  // Handlers for controlling edit/save/cancel actions
  const handleEdit = (): void => setIsEditing(true);
  const handleSave = (): void => setIsEditing(false);
  const handleCancel = (): void => setIsEditing(false);

  // Mock data arrays
  const datTabs: string[] = ['7562', '7001', '7002', '7003'];
  const companyInfo = {
    name: 'Kinderland Learning Academy',
    id: 'OUR 13668',
    address: '11 Bonnabrook Dr, Hermitage, TN 37076, United States',
    phone: '+01 27852348',
    email: 'kinderland123@gmail.com',
  };
  const systemSpecs = [
    {
      title: 'Qcells Q.PEAK DUO BLK ML-G10+/t 400W (Bifacial)',
      subtitle: 'PV Modules',
    },
    { title: 'Enphase IQ8M Microinverters', subtitle: 'Inverters' },
    { title: 'Enphase IQ5P', subtitle: 'Battery' },
  ];
  const systemMetrics = [
    { value: '123.4 wt', label: 'DC System Size' },
    { value: '87 wt', label: 'AC System Size' },
    { value: '87.34 wt', label: 'Battery Capacity' },
  ];
  const rightSideInfo = [
    { label: 'AHJ', value: 'Greater Salt Lake Municipal Services District' },
    { label: 'Utility', value: 'French Broad Electric Membership Corporation' },
  ];
  const bottomInfo = [
    { label: 'Branch', value: 'AZPEO01' },
    { label: 'Lender', value: 'Goodleap' },
  ];
  const integrations = [
    { icon: ICONS.DatAurora, name: 'Aurora' },
    { icon: ICONS.DatTape, name: 'Tape' },
    { icon: ICONS.DatCapture, name: 'Site Capture' },
  ];
  return (
    <div> <div className={styles.genOneCont}>
    <div className={styles.genOneLeft}>
      <div className={styles.gOneHeader}>
        {/* Header displaying*/}
        <div className={styles.gOneHeaderTitle}>
          <div className={styles.gOneHeaderTitleTxt}>
            <p>{companyInfo.name}</p>
            <p>{companyInfo.id}</p>
          </div>
          {/* Edit buttons: Cancel and Save */}
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
            { type: 'text', value: companyInfo.address },
            { type: 'tel', value: companyInfo.phone },
            { type: 'email', value: companyInfo.email },
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

    {/* First Right Section - AHJ, Utility, and Integrations */}
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
  </div></div>
  )
}

export default CommonComponent;