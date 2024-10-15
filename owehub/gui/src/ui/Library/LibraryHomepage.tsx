import React, { useState, useRef, useEffect } from 'react';
import { AddNewButton } from '../components/button/AddNewButton';
import styles from './LibraryHomepage.module.css';
import { ICONS } from '../../resources/icons/Icons';
import { IoMdSearch } from 'react-icons/io';
import { IoArrowBack, IoChevronDownSharp } from 'react-icons/io5';
import { RxDownload } from 'react-icons/rx';
import { TiThMenu } from "react-icons/ti";
import { BsGrid } from "react-icons/bs";
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
import { format, set } from 'date-fns';
import MicroLoader from '../components/loader/MicroLoader';
import { FileOrFolder } from './types';
import { useAppSelector } from '../../redux/hooks';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import audioFile from './assetss/audioFile.svg'
import myDocument from './assetss/myDocument.svg';
import powerpoint from './assetss/powerpoint.svg';
import textFile from './assetss/textFile.svg';
import wordFile from './assetss/wordFile.svg';
import zipFolder from './assetss/zipFolder.svg';
import defauult from './assetss/default.svg';
import DataNotFound from '../components/loader/DataNotFound';
import { TYPE_OF_USER } from '../../resources/static_data/Constant';
import FileViewer from './components/FileViewer/FileViewer';
import { useSearchParams } from 'react-router-dom';
import FilesTileViewList from './components/FilesTileViewList/FilesTileViewList';
import Input from '../components/text_input/Input';
import CheckBox from '../components/chekbox/CheckBox';
import FolderListView from './components/FolderListView/FolderListView';
import useMatchMedia from '../../hooks/useMatchMedia';
const LibraryHomepage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeSection, setActiveSection] = useState<
    'files' | 'folders' | 'dropdown' | null
  >('files');
  const [isHovered, setIsHovered] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  const [sortOption, setSortOption] = useState<'name' | 'date' | 'size'
  >('date');
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isRecycleBinView, setIsRecycleBinView] = useState(false);
  const [filesView, setFilesView] = useState<"list" | "tiles">("tiles")
  const [toggleClick, setToggleClick] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number>(0);
  const [checkedFolders, setCheckedFolders] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [recycleBinItems, setRecycleBinItems] = useState<any[]>([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [videoUrl, setVideoUrl] = useState("")
  const [selectedDelete, setSelecetedDelete] = useState("");
  const [currentFolder, setCurrentFolder] = useState<FileOrFolder | null>(null);
  const [currentFolderContent, setCurrentFolderContent] = useState<FileOrFolder[]>([]);
  const { microsoftGraphAccessToken, role_name } = useAppSelector(state => state.auth)
  const [fileInfo, setFileInfo] = useState({
    name: "",
    fileType: "",
    url: ""
  })
  const isMobile = useMatchMedia("(max-width: 450px)")
  const [selectedCheckbox, setSelectedCheckbox] = useState<Set<string>>(new Set())
  const [searchParams] = useSearchParams()
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false)
  const query = searchParams.get("from")
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
      toast.error('Failed to fetch folder content');
    }
    setLoading(false);
  };






  useEffect(() => {
    if (microsoftGraphAccessToken) {
      fetchDataFromGraphAPI();
    }
    if (query) {
      setActiveSection(query as "folders")
    }
  }, [microsoftGraphAccessToken, query]);
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
    video?: {
      duration?: number
    };
    // File size in bytes
    // Include any other properties you expect
  }
  const [allData, setAllData] = useState<FileOrFolder[] | null>(null);
  const [fileData, setFileData] = useState<FileOrFolder[]>([]);

  const [folderData, setFolderData] = useState<FileOrFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPending, setIsPending] = useState(false)
  const [videoName, setVideoName] = useState("")
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
    setIsPending(true)
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drive/items/${itemId}`;
    try {
      const response = await axios.delete(url, config);
      setIsPending(false)
    }
    catch (err) {
      console.log("Error", err);
      setIsPending(false)
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
      toast.error("ERROR");
    }
    setLoading(false);
  }
  const SearchHandler = () => {

  }

  const HandleSearch = (e: any) => {
    let inputValue: string = e.target.value;
    const validCharacters = /^[a-zA-Z0-9. _-]*$/;
    if (inputValue.length === 1 && inputValue === ' ') {
      inputValue = '';
    }
    if (inputValue.length > 0 && (inputValue.charAt(0) === ' ' || !validCharacters.test(inputValue.charAt(0)))) {
      return; // Exit early if the first character is a space or invalid
    }
    // Check if the last character is valid


    // if (!validCharacters.test(inputValue.slice(-1))) {
    //   // Ignore the last character if it's invalid
    //   return; // Exit early without updating searchValue
    // }
    // for(let i=0;i<inputValue.length;i++)
    // {
    //   if(!validCharacters.test(inputValue.slice(i)))
    //     return;
    // }


    // Set the search value
    setSearchValue(inputValue);

    // Handle empty search case
    if (inputValue === '') {
      setFileData(originalFileData);
      setFolderData(originalFolderData);
      return; // Exit early to avoid further processing
    }

    // Filter based on the active section
    if (activeSection === 'files') {
      const filteredData = originalFileData.filter((file) =>
        file.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFileData(filteredData);
    } else if (activeSection === 'folders') {
      const filteredData = originalFolderData.filter((folder) =>
        folder.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFolderData(filteredData);
    }
  };


  //Function for Deleting files
  const deleteMyFiles = async () => {
    const token = Cookies.get("myToken");
    setIsPending(true)

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drive/items/${selectedDelete}`
    try {

      const response = await axios.delete(url, config);
      toast.success("Deleted Successfully");
      setIsPending(false)
      fetchDataFromGraphAPI();
    }
    catch (err) {


      console.log("Error     ", err);
      setIsPending(false)

    }
  }
  // console.log(folderData,"This is folder data");
  // console.log(fileData,"This is file data");
  //Ajay Chaudhary Code Ends Here

  const handleDivClick = () => {
    setToggleClick(!toggleClick);
  };

  const getContentThumbnail = (type: string) => {
    switch (type) {
      case "image/jpeg":
      case "image/png":
      case "image/jpg":
      case "image/gif":
      case "image/webp":
      case "image/bmp":
      case "image/tiff":
      case "image/svg+xml":
      case "image/x-icon":
      case "image/heif":
      case "image/heic":
        return "image";

      case "application/pdf":
        return ICONS.pdf;

      case "application/vnd.ms-excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.template":
      case "application/vnd.ms-excel.sheet.macroEnabled.12":
        return ICONS.excelIcon;

      case "video/mp4":
      case "video/mpeg":
      case "video/ogg":
      case "video/webm":
      case "video/x-msvideo":
      case "video/quicktime":
        return ICONS.videoPlayerIcon;

      case "folder":
        return ICONS.folderImage;


    }
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

  const isImage = (mimeType: string) => {
    switch (mimeType) {
      case "image/jpeg":
      case "image/png":
      case "image/jpg":
      case "image/gif":
      case "image/webp":
      case "image/bmp":
      case "image/tiff":
      case "image/svg+xml":
      case "image/x-icon":
      case "image/heif":
      case "image/heic":
        return true;
      default:
        return false
    }
  }

  const handleClickdeleted = (index: string) => {
    DeleteHandler(index);
    toast.error('Deleted a file');
    fetchDataFromGraphAPI();
    // setRecycleBinItems([...recycleBinItems, libData[index]]);
    // setLibData(libData.filter((_, i) => i !== index));
  };
  const OpenModal = () => {
    setIsVisible(!isVisible);
  };
  const handleSectionClick = (section: 'files' | 'folders' | 'dropdown') => {
    setActiveSection(section);
    setSearchValue('');
    setFolderData(originalFolderData);
    setFileData(originalFileData);
  };

  const filteredData = fileData.filter((data) => {
    const matchesSearch = data.name.toLowerCase().includes(searchValue.toLowerCase()) || data.lastModifiedBy.user.displayName.toLowerCase().includes(searchValue.toLowerCase());
    const matchesType = selectedType === 'All' || (selectedType === 'Excel' && data.file?.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || (selectedType === 'PDF Format' && data.file?.mimeType === 'application/pdf') || (selectedType === 'Images' && (data.file?.mimeType === 'image/png' || data.file?.mimeType === 'image/jpeg' ||
      data.file?.mimeType === 'image/jpeg' ||
      data.file?.mimeType === 'image/gif' ||
      data.file?.mimeType === 'image/webp' ||
      data.file?.mimeType === 'image/bmp' ||
      data.file?.mimeType === 'image/tiff' ||
      data.file?.mimeType === 'image/svg+xml' ||
      data.file?.mimeType === 'image/heif' ||
      data.file?.mimeType === 'image/heic'

    )) || (selectedType === 'Videos' && (data.file?.mimeType === 'video/mp4' || data.file?.mimeType === 'video/mpeg' || data.file?.mimeType === 'video/ogg' || data.file?.mimeType === 'video/webm' || data.file?.mimeType === 'video/x-msvideo' || data.file?.mimeType === 'video/quicktime'));
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

  const downloadFile = (fileUrl: string, fileName: string) => {
    const anchor = document.createElement("a");
    anchor.href = fileUrl;
    anchor.download = fileName || "download";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
  const isVideo = (mimeType: string) => {
    if (
      mimeType === "video/mp4" ||
      mimeType === "video/mpeg" ||
      mimeType === "video/ogg" ||
      mimeType === "video/webm" ||
      mimeType === "video/x-msvideo" ||
      mimeType === "video/quicktime"
    ) {
      return true
    } else {
      return false
    }
  }


  const handleCheckboxChange = (
    isChecked: boolean,
    index: number,
    id: string
  ) => {
    setCheckedItems((prev) => (isChecked ? prev + 1 : prev - 1));
    setCheckedFolders((prev) =>
      isChecked ? [...prev, id] : prev.filter((item) => item !== id)
    );
    if (isChecked) setAllIds((prev) => [...prev, id]);
  };


  const handleBackClick = () => {
    setCurrentFolder(null);
    setCurrentFolderContent([]);
    fetchDataFromGraphAPI();
  };

  const handleDeleteFiles = async () => {
    setIsPending(true)
    Promise.all(Array.from(selectedCheckbox).map((id) => DeleteHandler(id as string)))
      .then((res) => {
        toast.success(`Deleted ${res.length} ${res.length > 1 ? "files" : "file"}`)
        reset()
        setCheckedItems(0)
        fetchDataFromGraphAPI()
        setIsPending(false)
      })
      .catch((err) => {
        setIsPending(false)
        toast.error((err as Error).message)
      })
  }
  const handleDelete = async () => {
    // const newLibData = libData.filter((_, index) => !checkedFolders.includes(index));
    // setLibData(newLibData);
    // const newData = folderData.filter((idata) =>
    //   !allIds.some((i) => i === idata.id)
    // );
    const count = allIds.length;
    Promise.all(allIds.map((id) => DeleteHandler(id)))
      .then((res) => {
        reset()
        setAllIds([]);
        setCheckedItems(0);
        console.log("working block")
        setCheckedFolders([]);
        toast.success(`Deleted ${res.length} ${res.length > 1 ? "folders" : "folder"}`)
        fetchDataFromGraphAPI();
      })
      .catch((err) => {
        toast.error((err as Error).message)
      })

  };
  console.log("checkeditems", checkedItems, selectedCheckbox)
  const handleUndo = () => {
    setCheckedItems(0);
    setCheckedFolders([]);
  };
  const reset = () => {
    setSelectedCheckbox(new Set())
  }
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

    if (checkedItems > 0 || selectedCheckbox.size > 0) {
      return (
        <>
          <div className={styles.delete_left}>
            <div className={styles.undoButton} onClick={() => {
              setSelectedCheckbox(new Set())
              setCheckedItems(0)
              setCheckedFolders([])

            }}>
              <FaXmark style={{
                height: '20px',
                width: '20px',
              }} />
            </div>
            <span className={styles.selectedCount}>
              {activeSection === "files" ? selectedCheckbox.size : checkedItems} {activeSection === "files" ? "file" : "folder"}{(checkedItems > 1 || selectedCheckbox.size > 1) ? 's ' : ' '}
              selected
            </span>
          </div>
          <div className={styles.delete_right}>
            <button disabled={isPending} className={activeSection === 'files' ? styles.DeleteButtonForFile : styles.DeleteButton} onClick={() => OpenModal()}>
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
            className={`${styles.Folderbuttons} ${activeSection === 'folders' ? styles.clickedButton : ''}`}
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

        <div className={`  ${styles.libSecHeader_right}`}>
          <button onClick={() => setFilesView("list")} className={` ${styles.sm_hide} ${filesView === "list" ? styles.active_tile : ""} ${styles.view_btn}`} >
            <TiThMenu />
          </button>
          <button onClick={() => setFilesView("tiles")} className={`${styles.sm_hide} ${filesView === "tiles" ? styles.active_tile : ""} ${styles.view_btn}`}>
            <BsGrid />
          </button>
          <div className={`${styles.sm_hide}`}>

            <SortByLibrary onSort={handleSort} />
          </div>

          <div className={`${styles.sm_hide} ${styles.searchWrapper}`}>
            <IoMdSearch className={styles.search_icon} onClick={SearchHandler} />
            {/* SEARCHINGGGG */}
            <input
              type="text"
              value={searchValue}
              onChange={HandleSearch}
              placeholder="Search by file name "
              className={styles.searchInput}
              maxLength={25}
            />
          </div>
          {role_name === TYPE_OF_USER.ADMIN && <NewFile activeSection={activeSection} handleSuccess={fetchDataFromGraphAPI} setLoading={setLoading} />}

          {/* <Link
            className={styles.recycleBin}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            to={ROUTES.LIBRARY_RECYCLE_BIN}
          >
            <img
              src={isHovered ? ICONS.recycleBinColor : ICONS.recycleBin}
              alt="recycle-bin"
            />
            <span className={styles.recycleSpan}>Recycle Bin</span>
          </Link> */}


        </div>
      </>
    );
  };

  const renderContent = () => {
    if (currentFolder) {
      if (loading) {
        return (
          <div className={styles.filesLoader}>
            <MicroLoader />
          </div>
        );
      }




      if (currentFolderContent.length === 0) {
        return <div className={` bg-white py2 ${styles.filesLoader}`}>
          <DataNotFound />
        </div>
      }

      return (


        <div className={styles.libSectionWrapper}>
          <div className={styles.lib_Grid_Header}>
            <div className={`${styles.grid_item} ${styles.table_name}`}>
              Name
            </div>

            <div className={`${styles.grid_item} ${styles.sm_hide}`}>Uploaded Date</div>
            <div style={{ textAlign: "end" }} className={` ${styles.grid_item}`}>Actions</div>
          </div>

          {currentFolderContent.map((item) => {
            return <div className={styles.libGridItem} key={item.id}>
              <div className={`${styles.file_icon} ${styles.image_div}`} >
                <img
                  className={styles.cardImg}
                  src={item['@microsoft.graph.downloadUrl'] || ICONS.pdf}
                  alt={item.name}
                />
                <div>
                  <p className={styles.name}>{item.name}</p>
                  <p className={styles.size}>
                    {item.size < 1024
                      ? item.size
                      : Math.round(item.size / 1024)}{' '}
                    {item.size < 1024 ? 'KB' : 'MB'}
                  </p>
                </div>
              </div>

              <div className={styles.grid_item}>
                {format(new Date(item.lastModifiedDateTime), 'dd-MM-yyyy')}
              </div>
              <div className={`${styles.grid_item} ${styles.grid_icon}`}>
                <RxDownload
                  className={styles.icons}
                  onClick={() => downloadFile(item["@microsoft.graph.downloadUrl"], item.name)}
                  style={{ height: '18px', width: '18px', color: '#667085' }}
                />
                {role_name === TYPE_OF_USER.ADMIN && <RiDeleteBinLine
                  className={styles.icons}
                  style={{ height: '18px', width: '18px', color: '#667085' }}
                  onClick={() => handleClickdeleted(item.id)}
                />}
              </div>
            </div>
          })}
        </div>


      );
    }



    if (isRecycleBinView) {
      return (
        <div className={styles.recycleBinContent}>
          {recycleBinItems.length === 0 ? (
            <p></p>
          ) : (
            recycleBinItems.map((item, index) => <div key={index}></div>)
          )}
        </div>
      );
    }

    if (activeSection === 'folders') {
      return (
        filesView === "list" ?
          <FolderListView folders={folderData.map((item) => ({
            name: item.name,
            size: item.size,
            childCount: item.childCount,
            createdDate: item.createdDateTime,
            id: item.id
          }))}

            selected={selectedCheckbox}
            setSelected={setSelectedCheckbox}
            onDelete={(id) => {
              OpenModal()
              setAllIds(prev => [...prev, id])
            }}
            handleCheckboxChange={(ids) => {
              setAllIds(Array.from(ids))
              setCheckedItems(ids.size)
            }}
          />
          : <FolderView
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
            .filter((data) => (data.file?.mimeType === 'video/mp4' || data.file?.mimeType === 'video/mpeg' || data.file?.mimeType === 'video/ogg' || data.file?.mimeType === 'video/webm' || data.file?.mimeType === 'video/mpeg' || data.file?.mimeType === 'video/x-msvideo' || data.file?.mimeType === 'video/quicktime'))} onClick={(url: string, name) => {
              setIsVideoModalOpen(true)
              setVideoUrl(url)
              setVideoName(name!)
            }} />}
        </div>
      );
    }

    return (
      <div className={styles.libSectionWrapper}>
        {filesView === "list" && <div className={styles.lib_Grid_Header}>
          <div className={`${styles.grid_item} ${styles.table_name}`}>
            <div className="flex items-center">
              <div className='mr1'>
                <CheckBox checked={selectedCheckbox.size === sortedData.length && !loading && sortedData.length > 0} onChange={() => {
                  if (selectedCheckbox.size === sortedData.length) {
                    setSelectedCheckbox(new Set())
                    setAllIds([])
                    setCheckedItems(0)


                  } else {
                    const newSet = new Set(sortedData.map((item) => item.id))
                    setSelectedCheckbox(newSet)
                    setAllIds(Array.from(newSet))
                    setCheckedItems(newSet.size)
                  }

                }} />
              </div>
              <span className={styles.libname_heading}>
                Name
              </span>
            </div>
          </div>
          <div className={` ${styles.sm_hide} ${styles.grid_item}`}>Uploaded Date</div>

          <div className={styles.grid_item}>Actions</div>
        </div>}

        {loading ?



          <div className={styles.filesLoader}> <MicroLoader /></div> :


          sortedData.length > 0 ? (
            filesView === "list" ?
              sortedData.map((data) => {
                const isValidVideo = isVideo(data.file?.mimeType!)
                const isValidImage = isImage(data.file?.mimeType!)
                return (
                  <div className={styles.libGridItem} key={data.id}>
                    <div className="flex items-center">
                      <div className="mr2">
                        <CheckBox checked={selectedCheckbox.has(data.id)} onChange={() => {
                          if (selectedCheckbox.has(data.id)) {
                            const newArr = new Set(Array.from(selectedCheckbox).filter((item) => item !== data.id))
                            setSelectedCheckbox(newArr)
                            setAllIds(Array.from(newArr))
                          } else {
                            const prev = Array.from(selectedCheckbox)
                            prev.push(data.id)
                            setSelectedCheckbox(new Set(prev))
                            setAllIds(prev)
                          }
                        }} />
                      </div>
                      <div style={{ cursor: "pointer" }} className={`${styles.file_icon} ${styles.image_div}`} onClick={() => {
                        if (isValidVideo) {
                          setIsVideoModalOpen(true)
                          setVideoUrl(data["@microsoft.graph.downloadUrl"]!)
                          setVideoName(data.name!)
                          return
                        }
                        if (isValidImage) {
                          setFileInfo({ name: data.name, fileType: data.file?.mimeType!, url: data["@microsoft.graph.downloadUrl"] })
                          setIsFileViewerOpen(true)
                          return
                        } else {
                          window.open(data.webUrl, "_blank")
                        }
                      }}>
                        <img
                          className={styles.cardImg}
                          src={data.file?.mimeType === 'application/pdf' ? ICONS.pdf : data.file?.mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? ICONS.excelIcon : data.file?.mimeType === 'video/mp4' ? ICONS.videoPlayerIcon : data.file?.mimeType === 'video/mpeg' ? ICONS.viedoImageOne : data.file?.mimeType === 'video/ogg' ? ICONS.viedoImageOne : data.file?.mimeType === 'video/webm' ? ICONS.viedoImageOne : data.file?.mimeType === 'video/x-msvideo' ? ICONS.viedoImageOne : data.file?.mimeType === 'video/quicktime' ? ICONS.viedoImageOne : data.file?.mimeType === 'text/plain' ? textFile : data.file?.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? wordFile : isValidImage ? data['@microsoft.graph.downloadUrl'] : defauult}
                          alt={`null`}
                          loading='lazy'
                        />
                        <div>
                          <p className={styles.name}>{data.name.substring(0, 25)} {data.name.length >= 26 ? '...' : ''}</p>
                          <p className={styles.size}>
                            {data.size < 1024
                              ? `${data.size} byte${data.size !== 1 ? 's' : ''}`
                              : data.size < 1048576
                                ? `${Math.round(data.size / 1024)} KB`
                                : `${Math.round(data.size / 1048576)} MB`}
                          </p>

                        </div>
                      </div>
                    </div>
                    <div className={` ${styles.sm_hide} ${styles.grid_item_dates}`}>{format(new Date(data.lastModifiedDateTime), 'dd-MM-yyyy')}</div>
                    <div className={`${styles.grid_item_delete} ${styles.grid_icon} justify-center`}>

                      <div>
                        <RxDownload
                          className={styles.icons_download}
                          onClick={() => downloadFile(data["@microsoft.graph.downloadUrl"], data.name)}

                        />
                      </div>
                      <div>
                        {role_name === TYPE_OF_USER.ADMIN && <RiDeleteBinLine
                          className={styles.icons_delete}
                          onClick={() => {
                            OpenModal()
                            const prev = Array.from(selectedCheckbox)
                            prev.push(data.id)
                            setSelectedCheckbox(new Set(prev))
                          }} />}
                      </div>


                    </div>
                  </div>)
              })
              : <FilesTileViewList
                selected={selectedCheckbox}
                setSelected={setSelectedCheckbox}
                onFilePreview={(url, type, name) => {
                  const isValidVideo = isVideo(type)
                  const isValidImage = isImage(type)
                  if (isValidVideo) {
                    setIsVideoModalOpen(true)
                    setVideoUrl(url)
                    setVideoName(name)
                    return
                  }
                  if (isValidImage) {
                    setFileInfo({ name: name, fileType: type!, url: url })
                    setIsFileViewerOpen(true)
                    return
                  } else {
                    window.open(url, "_blank")
                  }
                }}
                onDelete={(id: string) => {
                  OpenModal()
                  const prev = Array.from(selectedCheckbox)
                  prev.push(id)
                  setSelectedCheckbox(new Set(prev))
                }}
                files={sortedData.map((item) => ({
                  createdDateTime: item.createdDateTime,
                  id: item.id,
                  name: item.name,
                  webUrl: item.webUrl,
                  "@microsoft.graph.downloadUrl": item["@microsoft.graph.downloadUrl"],
                  size: item.size,
                  file: item.file,
                  mimeType: item.file?.mimeType
                }))} />
          )



            : (
              <div className={` bg-white py2 ${styles.filesLoader}`}>
                <DataNotFound />
              </div>
            )}
      </div>
    );
  };

  return (
    <div className={styles.libraryContainer}>
      <div className={`${styles.libraryHeader} flex items-center justify-between`}>
        <h3>Library</h3>
        <div className={` items-center ${styles.desktop_hide}`} style={{ gap: 8 }}>
          <div className={`${styles.sm_search} ${styles.searchWrapper} bg-white`}>
            <IoMdSearch className={styles.search_icon} onClick={SearchHandler} />
            <input
              type="text"
              value={searchValue}
              onChange={HandleSearch}
              placeholder="Search by file name "
              className={styles.searchInput}
              maxLength={25}
            />
          </div>
          <div className={styles.sort_container} >
            <SortByLibrary isPalceholder={!isMobile || false} onSort={handleSort} />
          </div>
          <button onClick={() => setFilesView("list")} className={`  ${filesView === "list" ? styles.active_tile : ""} ${styles.view_btn}`} >
            <TiThMenu />
          </button>
          <button onClick={() => setFilesView("tiles")} className={` ${filesView === "tiles" ? styles.active_tile : ""} ${styles.view_btn}`}>
            <BsGrid />
          </button>
        </div>
      </div>

      {isRecycleBinView ? (
        <RecycleBinView />
      ) : (
        <div className={styles.libSecHeader}>{renderHeaderContent()}</div>
      )}

      {renderContent()}
      {
        isVideoModalOpen && <VideoPlayer videoName={videoName} url={videoUrl} onClose={() => {
          setIsVideoModalOpen(false)
        }
        } />
      }
      {
        isFileViewerOpen && <FileViewer onClose={() => setIsFileViewerOpen(false)} fileUrl={fileInfo.url} fileType={fileInfo.fileType} name={fileInfo.name} />
      }
      {isVisible && (<DeleteFileModal setIsVisible={setIsVisible} onDelete={() => activeSection === "folders" ? handleDelete() : handleDeleteFiles()} />)}

    </div>
  );

}

export default LibraryHomepage;
