import React, { useEffect, useState } from 'react';
import styles from './styles/DatTool.module.css';

import Header from './components/Header';
import GeneralPage from './pages/GeneralPage';
import StructuralPage from './pages/StructuralPage';
import AddressPage from './pages/AdderssPage';
import NotesPage from './pages/NotesPage';
import OtherPage from './pages/OtherPages';
import SideContainer from './components/SideContainer';
import AdderssPopUp from './components/AdderssPopUp';
import RefreshPopUp from './components/RefreshPopUp';
import CommonComponent from './pages/CommonComponent';
import { useOutletContext } from 'react-router-dom';
import { getDatProjectList } from '../../redux/apiActions/DatToolAction/datToolAction';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const DatTool: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<string>('General');
  const [openPopUp, setOpenPopUp] = useState<boolean>(false);
  const [openRefresh, setOpenRefresh] = useState(false);
  const { activeMenu } = useOutletContext<{ activeMenu: string }>();
  const { refreshDat } = useOutletContext<{ refreshDat: boolean }>();
  const { setRefreshDat } = useOutletContext<{ setRefreshDat: React.Dispatch<React.SetStateAction<boolean>> }>();
  useEffect(() => {
    setSelectedPage(activeMenu);
  }, [activeMenu])

  const renderPage = () => {
    switch (selectedPage) {
      case 'Structural':
        return <StructuralPage />;
      case 'Adders':
        return <AddressPage setOpenPopUp={setOpenPopUp} />;
      case 'Notes':
        return <NotesPage />;
      case 'Other':
        return <OtherPage />;
      default:
        return <GeneralPage />;
    }
  };

  const dispatch = useAppDispatch();
  const { data } = useAppSelector((state) => state.datSlice);
  useEffect(() => {
    dispatch(getDatProjectList({ search: '' }));
  }, []);

 


  return (
    <div className={styles.mainContainer}>

      {
        openPopUp && <AdderssPopUp setOpenPopUp={setOpenPopUp} />
      }
      {
        refreshDat && <RefreshPopUp setOpenRefresh={setRefreshDat} />
      }
      
      <div className={styles.layoutContainer}>
        <div className={styles.contentContainer}>
          <CommonComponent />
          {renderPage()}
        </div>

        <div className={styles.sidebar}>

          <SideContainer data={data}/>
        </div>

      </div>
    </div>
  );
};

export default DatTool;
