import React, { useEffect, useRef, useState } from 'react';
import styles from './styles/DatTool.module.css';
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
import { getDatAddersInfo, getDatGeneralInfo, getDatProjectList, getStructuralInfo, updateDatTool } from '../../redux/apiActions/DatToolAction/datToolAction';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import useMatchMedia from '../../hooks/useMatchMedia';
import ResponsiveHeader from './components/ResponsiveHeader';
import { MdRefresh } from 'react-icons/md';

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
  
 const [showMenu,setShowMenu]=useState<boolean>(true);
  
 const isMobile = useMatchMedia('(max-width: 1024px)');
 const isSmallDevice = useMatchMedia('(max-width: 480px)');  useEffect(() => {
    dispatch(getDatGeneralInfo({ project_id: currentGeneralId,id :"0633f086-6c83-422a-80da-97b51a404c43" 
    }));
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
  const numFlagRef = useRef<boolean>(true);
  useEffect(() => {
    dispatch(getDatProjectList({ search: searchPara, page_number:1,page_size:pageSize,sort:sort }));
    if (data?.length > 0 && numFlagRef.current) {
      numFlagRef.current = false;
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
      {isMobile &&  <div className={styles.mobileSideContainer} style={{display:"flex"}}>
     <div style={{width:"90%"}}> 
     <SideContainer sort={sort} pageSize={pageSize} setPageSize={setPageSize} setSort={setSort} data={data} setSearchPara={setSearchPara} loading={sideLoading} setCurrentGeneralId={setCurrentGeneralId} currentGeneralId={currentGeneralId} setShowMenu={setShowMenu} showMenu={showMenu} numFlagRef={numFlagRef} isMobile={isMobile}/>
     </div>
      <div
          className={styles.iconContainer}
          onClick={() =>{ setRefreshDat(true)}}
        >
          <MdRefresh size={24} style={{transform:"scaleX(-1)"}}/>
        </div>
        </div>}

        {
          isSmallDevice && <div>
            <ResponsiveHeader onMenuSelect={() => {}} setOpenRefresh={setRefreshDat} />
             </div>
        }
      <div className={styles.layoutContainer}>
       
        <div className={styles.contentContainer} style={{height: !dbStatus ? "calc(100vh - 115px)" : ""}}>
          <CommonComponent generalData={generalData} loading={loading} currentGeneralId={currentGeneralId} isMobile={isSmallDevice}/>
          {renderPage()}
        </div>

        {!isMobile && <div className={showMenu ? styles.sidebar: styles.closedSideBar}>
          <SideContainer sort={sort} pageSize={pageSize} setPageSize={setPageSize} setSort={setSort} data={data} setSearchPara={setSearchPara} loading={sideLoading} setCurrentGeneralId={setCurrentGeneralId} currentGeneralId={currentGeneralId} setShowMenu={setShowMenu} showMenu={showMenu} numFlagRef={numFlagRef} isMobile={isMobile}/>
        </div>}

      </div>
    </div>
  );
};

export default DatTool;
