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
import { FileOrFolder } from './types';
const LibraryHomepage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeSection, setActiveSection] = useState<'files' | 'folders' | 'dropdown' | null>('files');
  const [isHovered, setIsHovered] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  const [sortOption, setSortOption] = useState<'name' | 'date' | 'size'>('date');
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isRecycleBinView, setIsRecycleBinView] = useState(false);
  const [toggleClick, setToggleClick] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number>(0);
  const [checkedFolders, setCheckedFolders] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [recycleBinItems, setRecycleBinItems] = useState<any[]>([]);
  const [selectedDelete, setSelecetedDelete] = useState("");
  const [currentFolder, setCurrentFolder] = useState<FileOrFolder | null>(null);
  const [currentFolderContent, setCurrentFolderContent] = useState<FileOrFolder[]>([]);
  const fetchFolderContent = async (folderId: string) => {
    setLoading(true);
    const url = `https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drive/items/${folderId}/children`;
    const token = await Cookies.get('myToken');
    if (!token) {
      console.error('Token not found in cookies.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(url, config);
      setCurrentFolderContent(response.data.value);
    } catch (error) {
      console.error('Error fetching folder content:', error);
      toast.error("Failed to fetch folder content");
    }
    setLoading(false);
  };


  //Ajay Chaudhary Code Start from Here

  // const [expirationTime, setExpirationTime] = useState<number | null>(null);

  const [isFetchingToken, setIsFetchingToken] = useState(false);
  const getToken = async () => {
    if (isFetchingToken) return; // Prevent duplicate calls
    setLoading(true);
    setIsFetchingToken(true);
    try {
      const response = await postCaller("get_graph_api_access_token", {});
      const token = await response.data.access_token;
      const tokenDuration = await response.data.expires_in;
      const currentTime = new Date()
      const expTime = new Date(Date.now() + 100)
      expTime.setMinutes(expTime.getMinutes() + Math.floor(tokenDuration / 60))
      Cookies.set('myToken', token, { expires: expTime, path: "/" });
      fetchDataFromGraphAPI();
    } catch (error) {
      console.error(error);
    }
    finally {
      setIsFetchingToken(false);
    }
  };


  useEffect(() => {
    const token = Cookies.get('myToken');
    if (!token) {
      getToken();
    }
    else {
      fetchDataFromGraphAPI();
    }
  }, []);
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
    shared: object;
    childCount: number;
    "@microsoft.graph.downloadUrl": string;
    url: string;
    date: string;
    iconName: string;
    
    // File size in bytes
    // Include any other properties you expect
  }
  const [allData, setAllData] = useState<FileOrFolder[] | null>(null);
  const [fileData, setFileData] = useState<FileOrFolder[]>([]);

  const [folderData, setFolderData] = useState<FileOrFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchDataFromGraphAPI = async () => {
    setLoading(true);
    const url = 'https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drive/root/children'; //endpoint
    const token = await Cookies.get('myToken'); // fetching my token from cookie
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
  // useEffect(()=>{

  // },[Cookies.get('myToken')]);
  const [originalFileData, setOriginalFileData] = useState<FileOrFolder[]>([]);
  const [originalFolderData, setOriginalFolderData] = useState<FileOrFolder[]>([]);
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
      setOriginalFileData([...files]);
      setOriginalFolderData([...folders]);
    }
  }, [allData]);

  //Delete FILES OR FOLDERS

  const DeleteHandler = async (itemId: string) => {
    const token = Cookies.get("myToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drive/items/${itemId}`;
    try {
      const response = await axios.delete(url, config);
    }
    catch (err) {
      console.log("Error", err);
    }
  };
  //Find File

  // const SearchFile=async()=>{
  //   setLoading(true);
  //   const token=Cookies.get("myToken");
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  //   const url=`https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drives/b!ziQq5dWt9kWuyPslNaqmjstRGXtbSdFJt7ikFQDkwscktioganMSRLFyrCAJTFu-/root/search(q='${searchValue}')`;
  //   try{
  //     const response=await axios.get(url,config);
  //     const results:FileOrFolder[] = response.data.value || []; // Ensure results is an array

  //   // Initialize arrays to hold files and folders
  //   const filteredFolders:FileOrFolder[] = [];
  //   if(searchValue==='')
  //     fetchDataFromGraphAPI();
  //   results.forEach((item) => {
  //     // Check if searchValue is not empty
  //     if (searchValue.length > 0) {
  //        if (activeSection === 'folders' && item.folder) {
  //         filteredFolders.push(item); // Push folders to the array
  //       }
  //     }
  //   });
  //    if (activeSection === 'folders') {
  //     setFolderData(filteredFolders);
  //   }

  //   }
  //   catch(err)
  //   {
  //     toast.error("Sorry, ERROR");
  //   }
  //   setLoading(false);
  // }

  // //SEARCH HANDLER

  // const SearchHandler=()=>{
  //   SearchFile();
  // }
  const SearchFileAndFolders = async () => {
    setLoading(true);
    const token = Cookies.get("myToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drives/b!ziQq5dWt9kWuyPslNaqmjstRGXtbSdFJt7ikFQDkwscktioganMSRLFyrCAJTFu-/root/search(q='${searchValue}')`;
    try {
      const response = await axios.get(url, config);
      const results: FileOrFolder[] = response.data.value || []; // Ensure results is an array

      // Initialize arrays to hold files and folders
      const filteredFolders: FileOrFolder[] = [];
      if (searchValue === '')
        fetchDataFromGraphAPI();
      results.forEach((item) => {
        // Check if searchValue is not empty
        if (searchValue.length > 0) {
          if (activeSection === 'folders' && item.folder) {
            filteredFolders.push(item); // Push folders to the array
          }
        }
      });
      if (activeSection === 'folders') {
        setFolderData(filteredFolders);
      }

    }
    catch (err) {
      toast.error("Sorry, ERROR");
    }
    setLoading(false);
  }
  const SearchHandler = () => {

  }

  const HandleSearch = (e: any) => {
    setSearchValue(e.target.value);
    // setFileData(fileData.filter((file)=>file.name.toLowerCase().includes(searchValue.toLowerCase())));
    if (e.target.value === '') {
      setFileData(originalFileData);
      setFolderData(originalFolderData);
    } if(activeSection==='files')
    {
      
        // Filter the file data based on the search input
        const filteredData = originalFileData.filter((file) =>
          file.name.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setFileData(filteredData);
      
    }
    else if(activeSection==='folders')
    {
      const filteredData = originalFolderData.filter((folder) =>
        folder.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFolderData(filteredData);
    }
  }


  //Function for Deleting files
  const deleteMyFiles = async () => {
    const token = Cookies.get("myToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drive/items/${selectedDelete}`
    try {

      const response = await axios.delete(url, config);
      toast.success("Deleted.......");
      fetchDataFromGraphAPI();
    }
    catch (err) {


      console.log("Error     ", err);
    }
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
  const OpenModal = () => {
    setIsVisible(!isVisible);
  }
  const handleSectionClick = (section: 'files' | 'folders' | 'dropdown') => {
    setActiveSection(section);
    setSearchValue('');
  };

  const filteredData = fileData.filter((data) => {
    const matchesSearch = data.name.toLowerCase().includes(searchValue.toLowerCase()) || data.lastModifiedBy.user.displayName.toLowerCase().includes(searchValue.toLowerCase());
    const matchesType = selectedType === 'All' || (selectedType === 'Excel' && data.file?.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (selectedType === 'PDF Format' && data.file?.mimeType === 'application/pdf') || (selectedType === 'Images' && data.file?.mimeType === 'image/png') || (selectedType === 'Videos' && (data.file?.mimeType === 'video/mp4' || data.file?.mimeType === 'video/mpeg' || data.file?.mimeType === 'video/ogg' || data.file?.mimeType === 'video/webm' || data.file?.mimeType === 'video/x-msvideo' || data.file?.mimeType === 'video/quicktime'));
    return matchesSearch && matchesType;
  });

  // const convertToBytes = (sizeString: string) => {
  //   const [size, unit] = sizeString.split(' ');
  //   const sizeNumber = parseFloat(size);
  //   switch (unit) {
  //     case 'kb': return sizeNumber * 1024;
  //     case 'mb': return sizeNumber * 1024 * 1024;
  //     case 'gb': return sizeNumber * 1024 * 1024 * 1024;
  //     case 'tb': return sizeNumber * 1024 * 1024 * 1024 * 1024;
  //     default: return sizeNumber;
  //   }
  // };

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortOption) {
        case 'name':
            return a.name.localeCompare(b.name);
        case 'date':
            const dateA = new Date(a.lastModifiedDateTime);
            const dateB = new Date(b.lastModifiedDateTime);
            return dateB.getTime() - dateA.getTime(); // sort descending
        case 'size':
            return b.size - a.size; // assuming size is already in bytes
        default:
            return 0; // no sorting applied
    }
});

  const handleSort = (option: 'name' | 'date' | 'size') => {
    setSortOption(option);
  };
  //check handler
  const [allIds, setAllIds] = useState<string[]>([]);


  const handleCheckboxChange = (isChecked: boolean, index: number, id: string) => {
    setCheckedItems((prev) => (isChecked ? prev + 1 : prev - 1));
    setCheckedFolders((prev) =>
      isChecked
        ? [...prev, index]
        : prev.filter((item) => item !== index)
    );
    if (isChecked)
      setAllIds((prev) => [...prev, id]);

  };



  const handleBackClick = () => {
    setCurrentFolder(null);
    setCurrentFolderContent([]);
    fetchDataFromGraphAPI();
  };
  const handleDelete = async () => {
    // const newLibData = libData.filter((_, index) => !checkedFolders.includes(index));
    // setLibData(newLibData);
    // const newData = folderData.filter((idata) => 
    //   !allIds.some((i) => i === idata.id)
    // );
    const count = allIds.length;
    await Promise.all(allIds.map((id) => DeleteHandler(id)));
    setAllIds([]);
    setCheckedItems(0);
    setCheckedFolders([]);


    {
      count === 1 ?
        toast.error(`Deleted 1 Folder`) :
        toast.error(`Deleted ${count} Folders`)
    }


    fetchDataFromGraphAPI();
  };

  const handleUndo = () => {
    setCheckedItems(0);
    setCheckedFolders([]);
  };

  const renderHeaderContent = () => {
    if (currentFolder) {
      return (
        <div className={styles.folderHeader}>
          <div className={styles.undoButton} onClick={handleBackClick}>
            <BiArrowBack style={{
              height: '20px',
              width: '20px',
            }} />
          </div>
          <p className={styles.recycle_p}>{currentFolder.name}</p>

        </div>
      );
    }

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
            <IoMdSearch className={styles.search_icon} onClick={SearchHandler} />
            {/* SEARCHINGGGG */}
            <input
              type="text"
              value={searchValue}
              onChange={HandleSearch}
              placeholder="Search by file name or person"
              className={styles.searchInput}
            />
          </div>
          <NewFile activeSection={activeSection} handleSuccess={fetchDataFromGraphAPI}/>

          {activeSection == 'files' ? (<div
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

    if (currentFolder) {
      if (loading) {
        return <div className={styles.filesLoader}><MicroLoader /></div>;
      }

      if (currentFolderContent.length === 0) {
        return <p className={styles.noParagraph}>No items in this folder.</p>;
      }

      return (
        <div className={styles.libSectionWrapper}>
          <div className={styles.lib_Grid_Header}>
            <div className={`${styles.grid_item} ${styles.table_name}`}>Name</div>
            <div className={styles.grid_item}>Uploaded by</div>
            <div className={styles.grid_item}>Uploaded Date</div>
            <div className={styles.grid_item}>Actions</div>
          </div>

          {currentFolderContent.map((item) => (
            <div className={styles.libGridItem} key={item.id}>
              <div className={`${styles.file_icon} ${styles.image_div}`}>
                <img
                  className={styles.cardImg}
                  src={item['@microsoft.graph.downloadUrl'] || ICONS.pdf}
                  alt={item.name}
                />
                <div>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.size}>{item.size < 1024 ? item.size : Math.round(item.size / 1024)} {item.size < 1024 ? 'KB' : 'MB'}</p>
                </div>
              </div>
              <div className={styles.grid_item}>{item.lastModifiedBy?.user?.displayName || 'Unknown'}</div>
              <div className={styles.grid_item}>{format(new Date(item.lastModifiedDateTime), 'dd-MM-yyyy')}</div>
              <div className={`${styles.grid_item} ${styles.grid_icon}`}>
                <RxDownload className={styles.icons} style={{ height: '18px', width: '18px', color: '#667085' }} />
                <RiDeleteBinLine className={styles.icons} style={{ height: '18px', width: '18px', color: '#667085' }} onClick={() => handleClickdeleted(item.id)} />
              </div>
            </div>
          ))}
        </div>
      );
    }



    if (isRecycleBinView) {
      return (
        <div className={styles.recycleBinContent}>
          {recycleBinItems.length === 0 ? (
            <p></p>
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
           .filter((data) => data.file?.mimeType === 'mp4')} />}
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

        {loading ? <div className={styles.filesLoader}> <MicroLoader /></div> : fileData.length > 0 ? (
          sortedData.map((data) => (
            <div className={styles.libGridItem} key={data.id}>
              <div className={`${styles.file_icon} ${styles.image_div}`}>
                <img
                  className={styles.cardImg}
                  src={data.file?.mimeType==='application/pdf'? ICONS.pdf: data.file?.mimeType==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"?ICONS.excelIcon: data.file?.mimeType==='video/mp4' ? ICONS.viedoImageOne : data.file?.mimeType==='video/mpeg' ? ICONS.viedoImageOne : data.file?.mimeType==='video/ogg' ? ICONS.viedoImageOne :data.file?.mimeType==='video/webm' ? ICONS.viedoImageOne : data.file?.mimeType==='video/x-msvideo' ? ICONS.viedoImageOne : data.file?.mimeType==='video/quicktime' ? ICONS.viedoImageOne :data.file?.mimeType==='text/plain'?'':data['@microsoft.graph.downloadUrl']}
                  alt={`null`}
                  loading='lazy'
                />
                <div>
                  <p className={styles.name}>{data.name.substring(0, 10)}</p>
                  <p className={styles.size}>
                  {data.size < 1024 
                  ? `${data.size} byte${data.size !== 1 ? 's' : ''}` 
                  : data.size < 1048576 
                  ? `${Math.round(data.size / 1024)} KB`
                  : `${Math.round(data.size / 1048576)} MB`}
                  </p>

                </div>
              </div>
              <div className={styles.grid_item}>{data.lastModifiedBy.user.displayName}</div>
              <div className={styles.grid_item}>{format(new Date(data.lastModifiedDateTime), 'dd-MM-yyyy')}</div>
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
                        }} onClick={() => {
                          OpenModal()
                          setSelecetedDelete(data.id)
                        }} />
                      {isVisible && (<DeleteFileModal setIsVisible={setIsVisible} onDelete={() => deleteMyFiles()} />)}
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