import React, { useState } from 'react';
import styles from './styles/DatTool.module.css';
import Header from './components/Header';
import GeneralPage from './pages/GeneralPage';
import StructuralPage from './pages/StructuralPage';
import AddressPage from './pages/AddressPage';
import NotesPage from './pages/NotesPage';
import OtherPage from './pages/OtherPage';
import SideContainer from './components/SideContainer';

const DatTool: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string>('General');

  const renderPage = () => {
    switch (selectedPage) {
      case 'Structural':
        return <StructuralPage />;
      case 'Adders':
        return <AddressPage />;
      case 'Notes':
        return <NotesPage />;
      case 'Other':
        return <OtherPage />;
      default:
        return <GeneralPage />;
    }
  };

  return (
    <div className={styles.mainContainer}>
      <Header onMenuSelect={setSelectedPage} />
      <div className={styles.layoutContainer}>
        <div className={styles.sidebar}>
          <SideContainer />
        </div>
        <div className={styles.contentContainer}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default DatTool;
