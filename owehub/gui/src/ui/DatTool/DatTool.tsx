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
import { getDatAddersInfo, getDatGeneralInfo, getDatProjectList, getStructuralInfo } from '../../redux/apiActions/DatToolAction/datToolAction';
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
  const [searchPara,setSearchPara]=useState<string>('');  
  

  const dispatch = useAppDispatch();
  const { data,loading,generalData, structuralData,sideLoading } = useAppSelector((state) => state.datSlice);
  const [currentGeneralId, setCurrentGeneralId] = useState<string>('OUR01037');
  
 
  
 
  useEffect(() => {
    dispatch(getDatGeneralInfo({ project_id: currentGeneralId }));
  }, [currentGeneralId]);


  const renderPage = () => {
    switch (selectedPage) {
      case 'Structural':
        return <StructuralPage structuralData={structuralData} currentGeneralId={currentGeneralId} loading={loading}/>;
      case 'Adders':
        return <AddressPage setOpenPopUp={setOpenPopUp} currentGeneralId={currentGeneralId} loading={loading} changeInQuantity={changeInQuantity} setChangeInQuantity={setChangeInQuantity}/>;
      case 'Notes':
        return <NotesPage currentGeneralId={currentGeneralId}/>;
      case 'Other':
        return <OtherPage currentGeneralId={currentGeneralId} loading={loading}/>;
      default:
        return <GeneralPage  currentGeneralId={currentGeneralId} generalData={generalData} loading={loading}/>;
    }

  };

  const { dbStatus } = useOutletContext<{ dbStatus: boolean }>();


  const [pageSize, setPageSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('asc');
  const projectId = data[0]?.project_id;
  useEffect(() => {
    dispatch(getDatProjectList({ search: searchPara, page_number:1,page_size:pageSize,sort:sort }));
    if (data?.length > 0) {
      const projectId = data[0]?.project_id;
      setCurrentGeneralId(projectId?.startsWith(' ') ? projectId.trim() : projectId);
    }
  }, [searchPara, pageSize, sort]);
 
  const[changeInQuantity,setChangeInQuantity] = useState<boolean>(false);
  return (
    <div className={styles.mainContainer}>

      {
        openPopUp && <AdderssPopUp setOpenPopUp={setOpenPopUp} currentGeneralId={currentGeneralId}/>
      }
      {
        refreshDat && <RefreshPopUp setOpenRefresh={setRefreshDat} />
      }
      
      <div className={styles.layoutContainer}>
        <div className={styles.contentContainer} style={{height: !dbStatus ? "calc(100vh - 115px)" : ""}}>
          <CommonComponent generalData={generalData} loading={loading} />
          {renderPage()}
        </div>

        <div className={styles.sidebar}>
          <SideContainer sort={sort} pageSize={pageSize} setPageSize={setPageSize} setSort={setSort} data={data} setSearchPara={setSearchPara} loading={sideLoading} setCurrentGeneralId={setCurrentGeneralId} currentGeneralId={currentGeneralId}/>
        </div>

      </div>
    </div>
  );
};

export default DatTool;
