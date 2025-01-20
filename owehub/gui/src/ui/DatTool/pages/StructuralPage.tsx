import React from 'react';
import SideContainer from '../components/SideContainer';
import { VscDebugRestart } from "react-icons/vsc";
import styles from '../styles/StructuralPage.module.css';
import { AiOutlineEdit } from 'react-icons/ai';
import { IoMdAdd } from 'react-icons/io';

function StructuralPage() {
  return (
    <div style={{
        display:'flex',
        flexDirection:'row',
        gap:'18px',
    }}>
      <div><SideContainer /></div>
      <div className={styles.container}>
        <div className={styles.titleContainer}>
          {/* <p>DAT Tool</p>
          <div className={styles.iconContainer}>
          <VscDebugRestart />
        </div> */}
        </div>

        <div className={styles.flexContainer}>
          <div className={styles.boxOne}>
            <div className={styles.headingContainer}>
            <div><p>Structural Info</p></div>
            <div className={styles.headingIcon}>
            <div className={styles.wordContainer}>
          MP1
        </div>
        <div className={styles.iconContainer}>
          <IoMdAdd />
        </div>
        <div className={styles.iconContainer}>
        <AiOutlineEdit />
        </div>
            </div>
            </div>
          </div>

          <div className={styles.boxTwo}>

          </div>
        </div>
      </div>
    </div>
  );
}

export default StructuralPage;
