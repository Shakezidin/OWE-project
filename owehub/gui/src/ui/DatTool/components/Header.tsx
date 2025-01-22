import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { GoBell } from 'react-icons/go';
import { ICONS } from '../../../resources/icons/Icons';
import styles from '../styles/Header.module.css';

interface HeaderProps {
  onMenuSelect: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuSelect }) => {
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
            className={activeMenu === 'Notes' ? styles.active : ''}
            onClick={() => handleMenuClick('Notes')}
          >
            Notes
          </li>
          <li
            className={activeMenu === 'Other' ? styles.active : ''}
            onClick={() => handleMenuClick('Other')}
          >
            Other
          </li>
        </ul>
      </nav>

      <div className={styles.headerLast}>
        <div className={styles.iconContainer}>
          <GoBell />
        </div>
        <div className={styles.iconContainer}>
          <BsThreeDotsVertical />
        </div>
        <img src={ICONS.profileImg} alt="profile-img" />
      </div>
    </div>
  );
};

export default Header;  