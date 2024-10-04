import React, { useState, useRef, useEffect } from 'react';
import { AddNewButton } from '../components/button/AddNewButton';
import styles from './LibraryHomepage.module.css';
import { ICONS } from '../../resources/icons/Icons';
import { IoMdSearch } from 'react-icons/io';
import { IoArrowBack, IoChevronDownSharp } from 'react-icons/io5';
import { RxDownload } from 'react-icons/rx';
import { RiDeleteBinLine } from 'react-icons/ri';
import DropDownLibrary from './Modals/DropDownLibrary';
import SortByLibrary from './Modals/SortByLibrary';
import NewFile from './Modals/NewFile';
import { BiArrowBack } from 'react-icons/bi';
import FolderView from './components/FolderView/FolderView';
import { FaXmark } from 'react-icons/fa6';
import VideosView from './components/VideosView/VideosView';
import DeleteFileModal from './Modals/DeleteFileModal';
import { getCaller } from '../../infrastructure/web_api/services/apiUrl';
import { postCaller } from '../../infrastructure/web_api/services/apiUrl';
import Cookies from 'js-cookie';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import MicroLoader from '../components/loader/MicroLoader';
const LibraryHomepage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeSection, setActiveSection] = useState<'files' | 'folders' | 'dropdown' | null>('files');
  const [isHovered, setIsHovered] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  const [sortOption, setSortOption] = useState<'none' | 'name' | 'date' | 'size'>('none');
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isRecycleBinView, setIsRecycleBinView] = useState(false);
  const [toggleClick, setToggleClick] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number>(0);
  const [checkedFolders, setCheckedFolders] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [recycleBinItems, setRecycleBinItems] = useState<any[]>([]);

  const [libData, setLibData] = useState([
    {
      url: ICONS.pdf,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.PDF',
      size: '34.82 KB',
      FileType: 'pdf',
    },
    {
      url: ICONS.excelIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.Excel',
      size: '34.82 KB',
      FileType: 'excel',
    },
    {
      url: ICONS.viedoImageOne,
          url_play:ICONS.viedoplay,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Meeting recording.MP4',
      size: '34.82 mb',
      FileType: 'mp4',
      duration: '23.45',
    },
    {
      url: ICONS.pdf,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.PDF',
      size: '34.82 KB',
      FileType: 'pdf',
    },
    {
      url: ICONS.excelIcon,
      name: 'Jordan Ulmer',
      date: '14 sep 2024',
      iconName: 'UNTD SOLAR_.Excel',
      size: '30.82 KB',
      FileType: 'excel',
    },
    {
      url: ICONS.viedoImageOne,
          url_play:ICONS.viedoplay,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Meeting recording.MP4',
      size: '34.82 gb',
      FileType: 'mp4',
      duration: '23.45',
    },
    {
      url: ICONS.viedoImageOne,
          url_play:ICONS.viedoplay,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Meeting recording.MP4',
      size: '34.82 gb',
      FileType: 'mp4',
      duration: '23.45',
    },
    {
      url: ICONS.imageIcon,
      name: 'Jordan Ulmer',
      date: '17 Aug 2024',
      iconName: 'Screenshot_1234.jpeg',
      size: '34.82 KB',
      FileType: 'img',
    },
    {
      url: ICONS.pdf,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.PDF',
      size: '34.82 KB',
      FileType: 'pdf',
    },
    {
      url: ICONS.excelIcon,
      name: 'Jordan Ulmer',
      date: '8 feb 2024',
      iconName: 'UNTD SOLAR_.Excel',
      size: '52 KB',
      FileType: 'excel',
    },
    {
      url: ICONS.viedoImageOne,
          url_play:ICONS.viedoplay,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Meeting recording.MP4',
      size: '26.65 mb',
      FileType: 'mp4',
      duration: '23.45',
    },
    {
      url: ICONS.imageIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Screenshot_1234.jpeg',
      size: '46.45 KB',
      FileType: 'img',
    },
    {
      url: ICONS.pdf,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.PDF',
      size: '34.82 KB',
      FileType: 'pdf',
    },
    {
      url: ICONS.excelIcon,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'UNTD SOLAR_.Excel',
      size: '34.82 KB',
      FileType: 'excel',
    },
    {
      url: ICONS.viedoImageOne,
          url_play:ICONS.viedoplay,
      name: 'Jordan Ulmer',
      date: '14 Sep 2024',
      iconName: 'Meeting recording.MP4',
      size: '22 mb',
      FileType: 'mp4',
      duration: '23.45',
    },
    {
      url: ICONS.imageIcon,
      name: 'Jordan Ulmer',
      date: '28 Sep 2024',
      iconName: 'Screenshot_1234.jpeg',
      size: '34.82 KB',
      FileType: 'img',
    },    
    {
      url: ICONS.imageIcon,
      name: 'Jordan Ulmer',
      date: '3 mar 2024',
      iconName: 'Screenshot_1234.jpeg',
      size: '34.82 KB',
      FileType: 'img',
    },
  ]);
    //Ajay Chaudhary Code Start from Here

// const [expirationTime, setExpirationTime] = useState<number | null>(null);
const [isFetchingToken, setIsFetchingToken] = useState(false);
const getToken = async () => {
  if (isFetchingToken) return; // Prevent duplicate calls
  setIsFetchingToken(true);
  try {
    const response = await postCaller("get_graph_api_access_token", {});
    const token =await response.data.access_token;
    const tokenDuration = await response.data.expires_in;
    const currentTime = new Date()
    const expTime = new Date(Date.now()+ 100)
   expTime.setMinutes(expTime.getMinutes() + Math.floor(tokenDuration/60))
    Cookies.set('myToken', token, { expires: expTime,path:"/"});
  } catch (error) {
    console.error(error);
  }
  finally {
    setIsFetchingToken(false);
  }
};


useEffect(() => {
  const token = Cookies.get('myToken');
    if(!token )
    {
      getToken();
    }
}, []);
//   const checkTokenValidity = () => {
//   const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
//   const storedExpirationTime = parseInt(expirationTime?.toString() || '0', 10);
//   return currentTime < storedExpirationTime;
// };



// useEffect(() => {
//   if (!checkTokenValidity()) {
//     console.error('Token expired or not found in cookies.');
//     getToken();
//   } else {
//     console.log("Token is valid");
//   }
// }, [expirationTime]);
interface User {
  // Define the properties of the user object as needed
  id: string;
  displayName: string;
}

interface FileData {
  hashes: Record<string, string>; // Assuming it could have multiple hash types
  mimeType: string;
}

interface FileOrFolder {
  id: string;
  name: string;
  folder?: object;  // Optional for folders
  file?: FileData;  // Optional for files
  createdBy: { user: User };
  createdDateTime: string;
  eTag: string;
  lastModifiedBy: { user: User };
  lastModifiedDateTime: string;
  webUrl: string; // URL to the file
  size: number; 
  shared:object;
  childCount:number;
  "@microsoft.graph.downloadUrl":string;
  // File size in bytes
  // Include any other properties you expect
}
const [allData, setAllData] = useState<FileOrFolder[] | null>(null);
  const [fileData, setFileData] = useState<FileOrFolder[]>([]);
  const [folderData, setFolderData] = useState<FileOrFolder[]>([]);
  const [loading,setLoading]=useState<boolean>(false);
const fetchDataFromGraphAPI = async () => {
  setLoading(true);
  const url = 'https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drive/root/children'; //endpoint
  const token =await Cookies.get('myToken'); // fetching my token from cookie
  if (!token) {
    console.error('Token not found in cookies.');
    return; // Exit if the token is not available, should i need to call my getToken function here?? doubt
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(url, config);
    setAllData([...response.data.value]);
    
    
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  setLoading(false);
};
useEffect(()=>{
  fetchDataFromGraphAPI();
},[Cookies.get('myToken')]);

useEffect(() => {
  if (allData) {
    const folders: FileOrFolder[] = [];
    const files: FileOrFolder[] = [];

    allData.forEach((data) => {
      if (data.folder) {
        folders.push(data);
      } else {
        files.push(data);
      }
    });

    setFolderData([...folders]);
    setFileData([...files]);
  }
}, [allData]);


//Delete FILES OR FOLDERS

const DeleteHandler=async(itemId : string)=>{
  const token=Cookies.get("myToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const url=`https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drive/items/${itemId}`;
  try{
    const response=await axios.delete(url,config);
    
  }
  catch(err)
  {
    console.log("Error",err);
  }
};

//Find File

const SearchFile=async()=>{
  setLoading(true);
  const token=Cookies.get("myToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const url=`https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drives/b!ziQq5dWt9kWuyPslNaqmjstRGXtbSdFJt7ikFQDkwscktioganMSRLFyrCAJTFu-/root/search(q='${searchValue}')`;
  try{
    const response=await axios.get(url,config);
    const results:FileOrFolder[] = response.data.value || []; // Ensure results is an array

  // Initialize arrays to hold files and folders
  const filteredFiles:FileOrFolder[] = [];
  const filteredFolders:FileOrFolder[] = [];
  if(searchValue==='')
    fetchDataFromGraphAPI();
  results.forEach((item) => {
    // Check if searchValue is not empty
    if (searchValue.length > 0) {
      if (activeSection === 'files' && !item.folder) {
        filteredFiles.push(item); // Push files to the array
      } else if (activeSection === 'folders' && item.folder) {
        filteredFolders.push(item); // Push folders to the array
      }
    }
  });
  if (activeSection === 'files') {
    setFileData(filteredFiles);
  } else if (activeSection === 'folders') {
    setFolderData(filteredFolders);
  }

  }
  catch(err)
  {
    toast.error("Sorry, ERROR");
  }
  setLoading(false);
}

//SEARCH HANDLER

const SearchHandler=()=>{
  SearchFile();
}
// console.log(folderData,"This is folder data");
// console.log(fileData,"This is file data");
//Ajay Chaudhary Code Ends Here
 
  const handleDivClick = () => {
    setToggleClick(!toggleClick);
  };

  const handleRecycleBinClick = () => {
    setIsRecycleBinView(!isRecycleBinView);
    setIsHovered(false);
  };

  const RecycleBinView = () => (
    <div className={styles.recycle_div}>
      <div className={styles.recycle_icon} onClick={handleRecycleBinClick}>
        <svg
          width="20"
          height="16"
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.292892 7.29289C-0.0976315 7.68342 -0.0976314 8.31658 0.292893 8.70711L6.65686 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928933C7.68054 0.538409 7.04738 0.538409 6.65685 0.928933L0.292892 7.29289ZM20 7L1 7L1 9L20 9L20 7Z"
            fill="black"
          />
        </svg>
      </div>
      <p className={styles.recycle_p}>Recycle Bin</p>
    </div>
  );

  const handleClickdeleted = (index: string) => {
    DeleteHandler(index);
    toast.error("Deleted a file");
    fetchDataFromGraphAPI();
    // setRecycleBinItems([...recycleBinItems, libData[index]]);
    // setLibData(libData.filter((_, i) => i !== index));
    
  };
  const OpenModal=()=>{
    setIsVisible(!isVisible);
  }
  const handleSectionClick = (section: 'files' | 'folders' | 'dropdown') => {
    setActiveSection(section);
    setSearchValue('');
  };

  const filteredData = libData.filter((data) => {
    const matchesSearch = data.iconName.toLowerCase().includes(searchValue.toLowerCase()) || data.name.toLowerCase().includes(searchValue.toLowerCase());
    const matchesType = selectedType === 'All' || (selectedType === 'Excel' && data.FileType === 'excel') || (selectedType === 'PDF Format' && data.FileType === 'pdf') || (selectedType === 'Images' && data.FileType === 'img') || (selectedType === 'Videos' && data.FileType === 'mp4');
    return matchesSearch && matchesType;
  });

  const convertToBytes = (sizeString: string) => {
    const [size, unit] = sizeString.split(' ');
    const sizeNumber = parseFloat(size);
    switch (unit.toLowerCase()) {
      case 'kb': return sizeNumber * 1024;
      case 'mb': return sizeNumber * 1024 * 1024;
      case 'gb': return sizeNumber * 1024 * 1024 * 1024;
      case 'tb': return sizeNumber * 1024 * 1024 * 1024 * 1024;
      default: return sizeNumber;
    }
  };

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortOption) {
      case 'name':
        return a.iconName.localeCompare(b.iconName);
      case 'date':
        const dateA = new Date(a.date.split(' ').reverse().join(' '));
        const dateB = new Date(b.date.split(' ').reverse().join(' '));
        return dateB.getTime() - dateA.getTime();
      case 'size':
        return convertToBytes(b.size) - convertToBytes(a.size);
      default:
        return 0;
    }
  });

  const handleSort = (option: 'none' | 'name' | 'date' | 'size') => {
    setSortOption(option);
  };
  //check handler
  const [allIds,setAllIds]=useState<string[]>([]);
 
  
  const handleCheckboxChange = (isChecked: boolean, index: number,id:string) => {
    setCheckedItems((prev) => (isChecked ? prev + 1 : prev - 1));
    setCheckedFolders((prev) => 
      isChecked 
        ? [...prev, index] 
        : prev.filter((item) => item !== index)
    );
    if(isChecked)
      setAllIds((prev) => [...prev, id]);

  };
  const handleDelete =async () => {
    // const newLibData = libData.filter((_, index) => !checkedFolders.includes(index));
    // setLibData(newLibData);
    // const newData = folderData.filter((idata) => 
    //   !allIds.some((i) => i === idata.id)
    // );
    const count=allIds.length;
    await Promise.all(allIds.map((id) => DeleteHandler(id)));
    setAllIds([]);
    setCheckedItems(0);
    setCheckedFolders([]);
   
    
    {
      count===1?
      toast.error(`Deleted 1 Folder`):
      toast.error(`Deleted ${count} Folders`)
    }
   
   
   fetchDataFromGraphAPI();
  };

  const handleUndo = () => {
    setCheckedItems(0);
    setCheckedFolders([]);
  };

  const renderHeaderContent = () => {
    if (checkedItems > 0) {
      return (
        <>
          <div className={styles.delete_left}>
            <div className={styles.undoButton} onClick={handleUndo}>
              <FaXmark style={{
                        height: '20px',
                        width: '20px',
                      }} />
            </div>
            <span className={styles.selectedCount}>
              {checkedItems} folder{checkedItems > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className={styles.delete_right}>
            <button className={styles.DeleteButton} onClick={handleDelete}>
              Delete
            </button>
          </div>
        </>
      );
    }

    return (
      <>
        <div className={styles.libSecHeader_left}>
          <button
            onClick={() => handleSectionClick('files')}
            className={`${styles.buttons} ${activeSection === 'files' ? styles.clickedButton : ''}`}
            style={{
              color: activeSection === 'files' ? '#ffffff' : '',
              backgroundColor: activeSection === 'files' ? '#377CF6' : '',
              border: activeSection === 'files' ? '0px solid #377CF6' : '',
            }}
          >
            Files
          </button>

          <button
            onClick={() => handleSectionClick('folders')}
            className={`${styles.buttons} ${activeSection === 'folders' ? styles.clickedButton : ''}`}
            style={{
              color: activeSection === 'folders' ? '#ffffff' : '',
              backgroundColor: activeSection === 'folders' ? '#377CF6' : '',
              border: activeSection === 'folders' ? '0px solid #377CF6' : '',
            }}
          >
            Folders
          </button>

          {activeSection !== 'folders' && (
            <div
              ref={dropdownRef}
              onClick={handleDivClick}
              style={toggleClick ? { borderColor: '#377cf6' } : {}}
            >
              <DropDownLibrary
                selectedType={selectedType}
                onSelectType={(type: string) => {
                  setSelectedType(type);
                  setActiveSection(activeSection);
                }}
              />
            </div>
          )}

          {selectedType !== 'All' &&
          activeSection !== 'folders' &&
          ['Excel', 'PDF Format', 'Images', 'Videos'].includes(selectedType) ? (
            <button className={styles.filter_button}>
              {selectedType}
              <FaXmark onClick={() => setSelectedType('All')} color="#4E4E4E" />
            </button>
          ) : null}
        </div>

        <div className={styles.libSecHeader_right}>
          <SortByLibrary onSort={handleSort} />

          <div className={styles.searchWrapper}>
            <IoMdSearch className={styles.search_icon} onClick={SearchHandler}/>
            {/* SEARCHINGGGG */}
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by file name or person"
              className={styles.searchInput}
            />
          </div>
          <NewFile activeSection={activeSection} />

{activeSection == 'files' ? (          <div
            className={styles.recycleBin}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleRecycleBinClick}
          >
            <img
              src={isHovered ? ICONS.recycleBinColor : ICONS.recycleBin}
              alt="recycle-bin"
            />
            <span className={styles.recycleSpan}>Recycle Bin</span>
          </div>) : ""}


        </div>
      </>
    );
  };

  const renderContent = () => {
    if (isRecycleBinView) {
      return (
        <div className={styles.recycleBinContent}>
          {recycleBinItems.length === 0 ? (
            <p>No items in recycle bin</p>
          ) : (
            recycleBinItems.map((item, index) => (
              <div key={index}>
              </div>
            ))
          )}
        </div>
      );
    }

    if (activeSection === 'folders') {
      return (
        <FolderView
          onCheckboxChange={handleCheckboxChange}
          sortOption={sortOption}
          checkedFolders={checkedFolders}
          folderData={folderData}
        />
      );
    }

    if (selectedType === 'Videos') {
      return (
        <div>
          {selectedType === 'Videos' && <VideosView videoData={sortedData
              .filter((data) => data.FileType === 'mp4')} />}
        </div>
      );
    }

    return (
      <div className={styles.libSectionWrapper}>
        <div className={styles.lib_Grid_Header}>
          <div className={`${styles.grid_item} ${styles.table_name}`}>Name</div>
          <div className={styles.grid_item}>Uploaded by</div>
          <div className={styles.grid_item}>Uploaded Date</div>
          <div className={styles.grid_item}>Actions</div>
        </div>

        {loading?<div className={styles.filesLoader}> <MicroLoader/></div>:fileData.length > 0 ? (
          fileData.map((data) => (
            <div className={styles.libGridItem} key={data.id}>
              <div className={`${styles.file_icon} ${styles.image_div}`}>
                <img
                  className={styles.cardImg}
                  src={data[`@microsoft.graph.downloadUrl`]}
                  alt={`null`}
                />
                <div>
                  <p className={styles.name}>{data.name.substring(0,10)}_.JPG</p>
                  <p className={styles.size}>{}</p>
                </div>
              </div>
              <div className={styles.grid_item}>{data.lastModifiedBy.user.displayName}</div>
              <div className={styles.grid_item}>{format(new Date(data.lastModifiedDateTime),'dd-MM-yyyy')}</div>
              <div className={`${styles.grid_item} ${styles.grid_icon}`}>
                {isRecycleBinView ? (
                  <div>
                    <RiDeleteBinLine
                      className={styles.icons}
                      style={{
                        height: '16px',
                        width: '16px',
                        color: '#667085',
                      }}
                      onClick={() => handleClickdeleted(data.id)} />
                      {isVisible && (<DeleteFileModal setIsVisible={setIsVisible} onDelete={() => handleClickdeleted(data.id)} />)}
                  </div>
                ) : (
                  <>
                    <div>
                      <RxDownload
                        className={styles.icons}
                        style={{
                          height: '18px',
                          width: '18px',
                          color: '#667085',
                        }}
                      />
                    </div>
                    <div>
                      <RiDeleteBinLine
                        className={styles.icons}
                        style={{
                          height: '18px',
                          width: '18px',
                          color: '#667085',
                        }} onClick={OpenModal} />
                      {isVisible && (<DeleteFileModal setIsVisible={setIsVisible} onDelete={() => handleClickdeleted(data.id)} />)}
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noParagraph}>No files found.</p>
        )}
      </div>
    );
  };

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.libraryHeader}>
        <h3>Library</h3>
      </div>

      {isRecycleBinView ? (
        <RecycleBinView />
      ) : (
        <div className={styles.libSecHeader}>{renderHeaderContent()}</div>
      )}

      {renderContent()}
    </div>
  );
};

export default LibraryHomepage;