import React, { useCallback, useState } from 'react';
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
  loading:boolean;
  setCurrentGeneralId: any;
}

const SideContainer: React.FC<SideContainerProps> = ({ data, setSearchPara,loading,setCurrentGeneralId }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const { dbStatus } = useOutletContext<{ dbStatus: boolean }>();

  const debouncedSetSearchPara = useCallback(
    debounce((search: string) => {
      setSearchPara(search); 
    }, 800),
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value); // Update the input field immediately
    debouncedSetSearchPara(value); // Only debounce the search parameter update
  };

  const toggleSortOrder = () => {
    setSortAscending(!sortAscending);
  };

  const mappedDataList =data.length ===0? []: data?.map((apiItem: any) => ({
    name: apiItem.project_name.trim() || 'Unnamed Project',
    projectID: apiItem.project_id.trim() || 'No ID Provided',
    address: apiItem.project_address.trim() || 'No Address Provided',
  }))?.slice(0, 30); // Prevent slicing undefined

  // Display a message if data is empty
  const isDataEmpty = data?.length === 0;
  console.log(data,"my data .......................");

  return (
    <div className={styles.container} style={{height: !dbStatus ? "calc(100vh - 133px)" : ""}}>
      <div className={styles.headerWrapper}>
        <div className={styles.heading}>
          <div className={styles.headingName}>Project List</div>
          <div onClick={toggleSortOrder} style={{ cursor: 'pointer' }}>
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

      {/* Handle empty data condition */}
     {loading? <div className={styles.microLoaderContainer}> <MicroLoader/> </div>: isDataEmpty ? (
        <div className={styles.noDataMessage}></div>
      ) : (
        <div className={styles.wrapperBox}>
          <div className={styles.dataBoxWrapper}>
            {mappedDataList?.map((data: any, index: any) => (
              <div key={index} className={styles.dataBox} onClick={() => setCurrentGeneralId(data.projectID)}>
                <p className={styles.content_one}>{data.name}</p>
                <p className={styles.content_two}>{data.projectID}</p>
                <p className={styles.content_three}>{data.address}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SideContainer;
