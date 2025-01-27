import React, { useState } from 'react';
import { ICONS } from '../../../resources/icons/Icons';
import styles from '../styles/Header.module.css';
import { MdRefresh } from 'react-icons/md';

interface HeaderProps {
  onMenuSelect: (page: string) => void;
}

const Header = ({ onMenuSelect,setOpenRefresh }:any) => {
  const [activeMenu, setActiveMenu] = useState<string>('General');

  const handleMenuClick = (page: string) => {
    setActiveMenu(page);
    onMenuSelect(page);
  };
  
  return (
    <div className={styles.header}>
      <div>
        <img src={ICONS.logoDesignTool} alt="logo" />
      </div>

      <nav className={styles.menuContainer}>
        <ul className={styles.menuItems}>
          <li
            className={activeMenu === 'General' ? styles.active : ''}
            onClick={() => handleMenuClick('General')}
          >
            General
          </li>
          <li
            className={activeMenu === 'Structural' ? styles.active : ''}
            onClick={() => handleMenuClick('Structural')}
          >
            Structural
          </li>
          <li
            className={activeMenu === 'Adders' ? styles.active : ''}
            onClick={() => handleMenuClick('Adders')}
          >
            Adders
          </li>
          <li
            className={activeMenu === 'Other' ? styles.active : ''}
            onClick={() => handleMenuClick('Other')}
          >
            Other
          </li>
          <li
            className={activeMenu === 'Notes' ? styles.active : ''}
            onClick={() => handleMenuClick('Notes')}
          >
            Notes
          </li>
          
        </ul>
      </nav>

      <div className={styles.headerLast}>
        <div className={styles.iconContainer} onClick={()=>setOpenRefresh(true)}>
          <MdRefresh size={18} />
        </div>
      </div>
    </div>
  );
};

export default Header;
