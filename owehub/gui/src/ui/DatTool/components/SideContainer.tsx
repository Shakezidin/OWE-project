import React, { useCallback, useState, useEffect } from 'react';
import { TbArrowsSort } from 'react-icons/tb';
import styles from '../styles/SideContainer.module.css'
import MicroLoader from '../../components/loader/MicroLoader';
const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => func(...args), delay);
  };
};
import { useOutletContext } from 'react-router-dom';

interface Data {
  name: string;
  projectID: string;
  address: string;
}

interface SideContainerProps {
  data: any[];
  setSearchPara: any;
  loading: boolean;
  setCurrentGeneralId: any;
  currentGeneralId: string;
  setPageSize: any;
  setSort: any;
  pageSize: any;
  sort: any;
}

const SideContainer: React.FC<SideContainerProps> = ({
  sort,
  setSort,
  setPageSize,
  data,
  setSearchPara,
  loading,
  setCurrentGeneralId,
  currentGeneralId
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const { dbStatus } = useOutletContext<{ dbStatus: boolean }>();
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    if (data && data.length > 0 && !loading && !initialLoadDone) {
      const firstItem = data[0];
      setCurrentGeneralId(firstItem.project_id.trim());
      setInitialLoadDone(true);
    }
  }, [data, loading, setCurrentGeneralId, initialLoadDone]);

  const debouncedSetSearchPara = useCallback(
    debounce((search: string) => {
      setSearchPara(search);
    }, 800),
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSetSearchPara(value);
  };

  const toggleSortOrder = () => {
    setSortAscending(!sortAscending);
  };

  const isDataEmpty = data?.length === 0;
  const mappedDataList = isDataEmpty ? [] : data?.map((apiItem: any) => ({
    name: apiItem.project_name.trim() || 'Unnamed Project',
    projectID: apiItem.project_id.trim() || 'No ID Provided',
    address: apiItem.project_address.trim() || 'No Address Provided',
  }));

  const handleClick = () => {
    console.log('Before increasing page size', currentGeneralId);
    setPageSize((prevPageSize: number) => prevPageSize + 10);
    console.log('After increasing page size', currentGeneralId);

  };

  const handleSort = () => {
    if (sort === 'asc') {
      setSort('desc');
    } else {
      setSort('asc');
    }
  };

  const handleDataClick = (projectID: string) => {
    setCurrentGeneralId(projectID);
  };

  return (
    <div className={styles.container} style={{ height: !dbStatus ? "calc(100vh - 133px)" : "" }}>
      <div className={styles.headerWrapper}>
        <div className={styles.heading}>
          <div className={styles.headingName}>Project List</div>
          <div onClick={handleSort} style={{ cursor: 'pointer' }}>
            <TbArrowsSort size={18} />
          </div>
        </div>
        <div className={styles.searchBox}>
          <input
            placeholder="Search by project ID."
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.microLoaderContainer}><MicroLoader /></div>
      ) : isDataEmpty ? (
        <div className={styles.noDataMessage}></div>
      ) : (
        <div className={styles.wrapperBox}>
          <div className={styles.dataBoxWrapper}>
            {mappedDataList?.map((data: any, index: number) => (
              <div key={index} className={styles.dataBox} onClick={() => setCurrentGeneralId(data.projectID)} onMouseOver={() => setIsHovered(index)} onMouseOut={() => setIsHovered(null)} style={{ 
                backgroundColor: currentGeneralId === data.projectID 
                  ? '#377CF6' 
                  : isHovered === index 
                  ? '#d5e4ff' 
                  : '', 
                  color:isHovered === index ? '#000000' : ''
               
              }}>
                <p className={styles.content_one} style={{ color: currentGeneralId === data.projectID ? '#fafafa' : '' }}>{data.name}</p>
                <p className={styles.content_two} style={{ color: currentGeneralId === data.projectID ? '#fafafa' : '' }}>{data.projectID}</p>
                <p className={styles.content_three} style={{ color: currentGeneralId === data.projectID ? '#fafafa' : '' }}>{data.address}</p>
              </div>
            ))}
            <p className={styles.seeMore} onClick={handleClick}>See More</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideContainer;
