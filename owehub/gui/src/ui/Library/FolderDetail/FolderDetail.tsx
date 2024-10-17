import React, { useEffect, useState } from 'react'
import styles from '../LibraryHomepage.module.css';
import { BiArrowBack } from 'react-icons/bi';
import { RxDownload } from 'react-icons/rx';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Link, useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import tileViewStyles from '../components/FileTileView/index.module.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import type { IFiles } from './Types';
import MicroLoader from '../../components/loader/MicroLoader';
import { ICONS } from '../../../resources/icons/Icons';
import DeleteFileModal from '../Modals/DeleteFileModal';
import { format } from 'date-fns';
import DataNotFound from '../../components/loader/DataNotFound';
import NewFile from '../Modals/NewFile';
import fileTileViewStyles from '../components/FilesTileViewList/index.module.css';
import folderWrapperStyles from '../components/FolderView/folderView.module.css';
import { useAppSelector } from '../../../redux/hooks';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import { TYPE_OF_USER } from '../../../resources/static_data/Constant';
import FileViewer from '../components/FileViewer/FileViewer';
import CheckBox from '../../components/chekbox/CheckBox';
import { FaXmark } from 'react-icons/fa6';
import { TiThMenu } from 'react-icons/ti';
import { BsGrid } from 'react-icons/bs';
import FileTileView from '../components/FileTileView/FileTileView';


const FolderDetail = () => {
    const path = useParams()
    const [files, setFiles] = useState<IFiles[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [slectedDeleteId, setSelectedDeleteId] = useState("")
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
    const { microsoftGraphAccessToken } = useAppSelector(state => state.auth)
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [videoUrl, setVideoUrl] = useState("")
    const [viewMode, setViewMode] = useState<"list" | "tiles">((localStorage.getItem("fileTypeView") as "list" | "tiles") || "tiles")
    const { role_name } = useAppSelector(state => state.auth)
    const [fileInfo, setFileInfo] = useState({
        name: "",
        fileType: "",
        url: ""
    })
    const [isFileViewerOpen, setIsFileViewerOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [multiDeletePopup, setMultiDeletePopup] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState<string | null>(null);
    const location = useLocation();
    const [searchParams] = useSearchParams()
    const [videoName, setVideoName] = useState("")
    const [isHovered, setIsHovered] = useState<number | null>(null);
    console.log(location.state, "location")
    const handleBackWithQuery = () => {
        const previousUrl = location.state?.from;
        const query = searchParams.get("from")
        const queryString = `?from=${query}`;
        if (query) {
            navigate(`${previousUrl}${queryString}`);
            return;
        } else {
            navigate(-1);
        }

    };
    const navigate = useNavigate()
    const saveFileTypeView = (type: string) => {
        localStorage.setItem('fileTypeView', type)
    }
    const getFolderChilds = async () => {
        try {
            setIsLoading(true)
            const token = Cookies.get('myToken');
            const url = `https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drives/b!ziQq5dWt9kWuyPslNaqmjstRGXtbSdFJt7ikFQDkwscktioganMSRLFyrCAJTFu-/root:/${path["*"]}:/children`;
            const resp = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setFiles((resp.data.value as IFiles[]) || [])
        } catch (error) {
            console.error(error);
            toast.error((error as Error).message)
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (path && microsoftGraphAccessToken) {
            getFolderChilds()
        }
    }, [path, microsoftGraphAccessToken])

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


    const downloadFile = (fileUrl: string, fileName: string) => {
        const anchor = document.createElement("a");
        anchor.href = fileUrl;
        anchor.download = fileName || "download";
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    const handleDelete = async (id = slectedDeleteId, type: "single" | "multi" = "single") => {
        const token = Cookies.get("myToken");
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const url = `https://graph.microsoft.com/v1.0/sites/e52a24ce-add5-45f6-aec8-fb2535aaa68e/drive/items/${id}`;
        try {
            const response = await axios.delete(url, config);
            await getFolderChilds()
            if (type === "single") {
                toast.success("Item deleted successfully")
            }
            setSelectedDeleteId("")
        }
        catch (err) {
            console.log("Error", err);
            toast.error((err as Error).message)
        }
    };
    const parent = path["*"]?.split("/")
    const refetch = async () => {
        await getFolderChilds()
    }

    const handleMultiDelete = async () => {
        setIsPending(true)
        Promise.all(Array.from(selected).map(id => handleDelete(id, "multi")))
            .then((res) => {
                setIsPending(false)
                setSelected(new Set())
                getFolderChilds()
                toast.success(` ${res.length} items deleted successfully`)
            })
            .catch(err => {
                toast.error((err as Error).message)
            })
    }

    const handleCheckboxChange = (fileId: string) => {
        setSelected(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(fileId)) {
                newSelected.delete(fileId);
            } else {
                newSelected.add(fileId);
            }
            return newSelected;
        });
    };
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
    const onPreview = (url: string, type: string, name: string) => {
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
    }

    return (
        <div className={styles.libraryContainer}>
            <div className={styles.libraryHeader}>
                <h3>Library</h3>
            </div>
            {
                selected.size ?
                    <div className='flex items-center justify-between p2 bg-white'>
                        <div className={styles.delete_left}>
                            <div className={styles.undoButton} onClick={() => {
                                setSelected(new Set())


                            }}>
                                <FaXmark style={{
                                    height: '20px',
                                    width: '20px',
                                }} />
                            </div>
                            <span className={styles.selectedCount}>
                                {selected.size}  selected
                            </span>
                        </div>
                        <div className={styles.delete_right}>
                            <button disabled={isPending} onClick={() => setMultiDeletePopup(true)} className={styles.DeleteButton} >
                                Delete
                            </button>
                        </div>
                    </div>
                    : <div className={styles.libSecHeader}>
                        <div className={styles.folderHeader}>
                            <div className={styles.undoButton} >
                                <BiArrowBack onClick={() => handleBackWithQuery()} style={{
                                    height: '20px',
                                    width: '20px',
                                }} />
                            </div>
                            <p className={styles.recycle_p}> {parent?.[parent?.length - 1] || "Unknown"} </p>

                        </div>

                        <div className={styles.libSecHeader_right}>
                            <button onClick={() => {
                                setViewMode("list")
                                saveFileTypeView("list")
                            }} className={` ${viewMode === "list" ? styles.active_tile : ""} ${styles.view_btn}`} >
                                <TiThMenu />
                            </button>
                            <button onClick={() => {
                                setViewMode("tiles")
                                saveFileTypeView("tiles")
                            }} className={` ${viewMode === "tiles" ? styles.active_tile : ""} ${styles.view_btn}`}>
                                <BsGrid />
                            </button>
                            {role_name === TYPE_OF_USER.ADMIN && <NewFile handleSuccess={refetch} folderUploadPath={`${path["*"]}`} uploadPath={`/${path["*"]}/`} activeSection="dropdown" setLoading={setIsLoading} />}
                        </div>
                    </div>
            }


            {
                <div className={styles.libSectionWrapper}>


                    {viewMode === "list" && <div className={styles.lib_Grid_Header}>
                        <div className={`${styles.grid_item} ${styles.table_name}`}>
                            <div className="flex items-center">
                                {role_name === TYPE_OF_USER.ADMIN && <div className="mr1">
                                    <CheckBox checked={selected.size === files.length && !!files.length} onChange={() => {
                                        if (selected.size === files.length) {
                                            setSelected(new Set())
                                        } else {
                                            const newChecked = new Set(files.map((item) => item.id))
                                            setSelected(newChecked)
                                        }
                                    }} />
                                </div>}
                                <span>

                                    Name
                                </span>
                            </div>
                        </div>
                        <div className={`${styles.grid_item_upload_date} ${styles.grid_item}`}>Uploaded Date</div>
                        <div className={styles.grid_item}>Actions</div>
                    </div>}
                    {
                        isLoading ?
                            <div className={` bg-white py2 ${styles.filesLoader}`}> <MicroLoader /></div>
                            :
                            files.length ?
                                viewMode === "list" ?
                                    files.map((file, index) => {
                                        const fileType = getContentThumbnail(file.folder ? "folder" : file.file?.mimeType!)
                                        const isValidVideo = isVideo(file.file?.mimeType!)
                                        return <div key={file.id} className={styles.libGridItem} >
                                            {
                                                file.folder ?
                                                    <div className='flex items-center'>
                                                        {role_name === TYPE_OF_USER.ADMIN &&
                                                            <div className="mr1">
                                                                <CheckBox
                                                                    checked={selected.has(file.id)}
                                                                    onChange={() => handleCheckboxChange(file.id)}
                                                                />
                                                            </div>
                                                        }
                                                        <Link to={`/library/${path["*"]}/${file.name}`} className={`${styles.file_icon} ${styles.image_div}`}>
                                                            <img
                                                                src={ICONS.folderImage}
                                                            />
                                                            <div className={styles.name_div}>
                                                                <p className={styles.name_hide}>{file.name?.substring(0, 125)}</p>
                                                                <p className={styles.name}> {file.name?.substring(0, 25)} {file.name?.length !== undefined && file.name?.length >= 25 ? '...' : ''}</p>
                                                                <p className={styles.size}> {(file.size > 1024 * 1024)
                                                                    ? `${(file.size / (1024 * 1024)) > 0 ? (file.size / (1024 * 1024)).toFixed(2) : 0} MB`
                                                                    : `${Math.round(file.size / 1024) > 0 ? Math.round(file.size / 1024) : 0} KB`}</p>
                                                            </div>
                                                        </Link>
                                                    </div>

                                                    :
                                                    <div className="flex items-center">
                                                        {role_name === TYPE_OF_USER.ADMIN && <div className="mr1">
                                                            <CheckBox
                                                                checked={selected.has(file.id)}
                                                                onChange={() => handleCheckboxChange(file.id)}
                                                            />
                                                        </div>}
                                                        <div style={{ cursor: "pointer" }} className={`${styles.file_icon} ${styles.image_div}`} onClick={() => {
                                                            if (isValidVideo) {
                                                                setIsVideoModalOpen(true)
                                                                setVideoUrl(file["@microsoft.graph.downloadUrl"]!)
                                                                return
                                                            }
                                                            if (fileType === "image") {
                                                                setFileInfo({ name: file.name, fileType: file.file?.mimeType!, url: file["@microsoft.graph.downloadUrl"]! })
                                                                setIsFileViewerOpen(true)
                                                                return
                                                            } else {
                                                                window.open(file.webUrl, "_blank")
                                                            }

                                                        }}>

                                                            <img
                                                                src={fileType === "image" ? file["@microsoft.graph.downloadUrl"] : fileType}
                                                                style={{
                                                                    width: isValidVideo ? 32 : undefined,
                                                                    height: isValidVideo ? 32 : undefined
                                                                }}
                                                            />
                                                            <div className={styles.name_div}>
                                                                <p className={styles.name_hide}>{file.name}</p>

                                                                <p className={styles.name}>{file.name}</p>
                                                                <p className={styles.size}>
                                                                    {(file.size > 1024 * 1024)
                                                                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                                                                        : `${Math.round(file.size / 1024)} KB`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                            }

                                            <div className={`${styles.grid_item} ${styles.grid_item_upload_date}`}>{format(new Date(file.lastModifiedDateTime), 'dd-MM-yyyy')}</div>
                                            <div className={`${styles.grid_item} ${styles.grid_icon}`}>
                                                <RxDownload className={styles.icons_download} style={{ height: '18px', width: '18px', color: isHovered === index && !file.folder ? '#377CF6' : (file.folder ? "rgba(102, 112, 133, 0.5)" : '#101828'), cursor: !file.folder ? "pointer" : "not-allowed" }} onClick={() => !file.folder && downloadFile(file[`@microsoft.graph.downloadUrl`]!, file.name)}
                                                    onMouseOver={() => { setIsHovered(index) }} onMouseLeave={() => { setIsHovered(null) }}
                                                />
                                                {role_name === TYPE_OF_USER.ADMIN && <RiDeleteBinLine className={styles.icons_delete} onClick={() => {
                                                    setIsDeleteModalVisible(true)
                                                    setSelectedDeleteId(file.id)
                                                }}

                                                />}
                                            </div>
                                        </div>
                                    })
                                    :
                                    <div className={fileTileViewStyles.list_grid}>
                                        {files.map((file) => {
                                            return !file?.folder ? <FileTileView file={{
                                                id: file.id,
                                                name: file.name,
                                                webUrl: file.webUrl,
                                                size: file.size,
                                                "@microsoft.graph.downloadUrl": file["@microsoft.graph.downloadUrl"],
                                                mimeType: file.file?.mimeType,
                                                createdDateTime: `${file.createdDateTime}`
                                            }} onDelete={() => setMultiDeletePopup(true)} onFilePreview={onPreview} selected={selected} onCheck={(id) => handleCheckboxChange(id)} key={file.id} /> :
                                                <div
                                                    style={{ cursor: 'pointer' }}
                                                    className={"flex flex-column items-center justify-center"}
                                                    key={file.id}
                                                    onMouseEnter={() => setHoveredIndex(file.id)}
                                                    onMouseLeave={() => setHoveredIndex(null)}
                                                    onDoubleClick={() => navigate(`/library/${path["*"]}/${file.name}`)}
                                                >
                                                    <div className={folderWrapperStyles.createdByWrapper}>

                                                    </div>
                                                    <div className={tileViewStyles.thumbnail_wrapper}>
                                                        <div className={folderWrapperStyles.charDiv}>{file.name.charAt(0)}</div>
                                                        <img src={ICONS.folderImage} alt="" />
                                                        <div className={folderWrapperStyles.checkboxWrapper}>
                                                            <p className={folderWrapperStyles.quantity}>{file.childCount}</p>
                                                            {role_name === TYPE_OF_USER.ADMIN &&
                                                                <div className={` ${selected.has(file?.id!) ? tileViewStyles.selected : ""}  ${tileViewStyles.checkbox_wrapper}`}>

                                                                    <CheckBox


                                                                        onChange={() => {

                                                                            handleCheckboxChange(file.id)
                                                                        }}
                                                                        checked={selected.has(file.id)}
                                                                    />
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className={"mt2"} style={{ width: "100%" }}>

                                                        <div className={folderWrapperStyles.folder_name}>{file.name.substring(0, 10)}</div>
                                                        <div className={folderWrapperStyles.folderInfo_wrapper} >
                                                            <div className={folderWrapperStyles.foldersize}> {file.size > 1024 * 1024
                                                                ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                                                                : `${Math.round(file.size / 1024)} KB`} </div>
                                                            <div className={folderWrapperStyles.folderdate}>{format(new Date(file.createdDateTime), 'dd-MM-yyyy')}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                        })}
                                    </div>



                                : <div className={` bg-white py2 ${styles.filesLoader}`}>
                                    <DataNotFound />
                                </div>
                    }


                </div>
            }

            {
                isDeleteModalVisible && <DeleteFileModal onDelete={handleDelete} setIsVisible={setIsDeleteModalVisible} />
            }

            {
                multiDeletePopup && <DeleteFileModal onDelete={handleMultiDelete} setIsVisible={setMultiDeletePopup} />
            }
            {
                isVideoModalOpen && <VideoPlayer videoName={videoName} url={videoUrl} onClose={() => setIsVideoModalOpen(false)} />
            }
            {
                isFileViewerOpen && <FileViewer onClose={() => setIsFileViewerOpen(false)} fileUrl={fileInfo.url} fileType={fileInfo.fileType} name={fileInfo.name} />}

        </div>
    )
}

export default FolderDetail