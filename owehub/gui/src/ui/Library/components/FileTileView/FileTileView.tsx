import React from 'react'
import styles from "./index.module.css"
import { GoTrash } from "react-icons/go";
import { LuDownload } from "react-icons/lu";
import { format } from 'date-fns';
import { useAppSelector } from '../../../../redux/hooks';
import { TYPE_OF_USER } from '../../../../resources/static_data/Constant';
export interface IFiles {
    createdDateTime: string;
    id: string;
    name: string;
    webUrl: string;
    size: number;
    "@microsoft.graph.downloadUrl"?: string;
    mimeType?:string
}

const FileTileView = ({ file, onDelete,onFilePreview }: { file?: IFiles, onDelete: (id: string) => void,onFilePreview:(url:string,type:string,name:string)=>void; }) => {
    const { role_name } = useAppSelector(state => state.auth)

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
      const getUrl = ()=>{
        if(isImage(file?.mimeType!) || isVideo(file?.mimeType!)){
          return file?.['@microsoft.graph.downloadUrl']
        }
        else{
            return file?.webUrl!
        }
      }

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
                 // return ; icons to be returned

            case "application/pdf":
         // return ; icons to be returned

            case "application/vnd.ms-excel":
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.template":
            case "application/vnd.ms-excel.sheet.macroEnabled.12":
                // return ; icons to be returned

            case "video/mp4":
            case "video/mpeg":
            case "video/ogg":
            case "video/webm":
            case "video/x-msvideo":
            case "video/quicktime":
                   // return ; icons to be returned

            case "folder":
                  // return ; icons to be returned


        }
    };
    return (
        <div className='bg-white'>
            <div className={styles.thumbnail_wrapper} onClick={()=>{   
                onFilePreview(getUrl()!,file?.mimeType!,file?.name!)
            }}>
                <div className={styles.avatar_circle}>
                    {file?.name?.[0]}
                </div>
                <img src={file?.['@microsoft.graph.downloadUrl']} width={48} height={46} alt="" />
            </div>

            <div>
                <div className="flex items-center justify-between mt2">
                    <h4 className={styles.card_title} > {file?.name}  </h4>
                    <div className="flex items-center">
                        {role_name === TYPE_OF_USER.ADMIN && <span onClick={() => onDelete(file?.id!)} className={styles.card_btn}>
                            <GoTrash size={14} />
                        </span>}
                        <span className={styles.card_btn}>
                            <LuDownload size={14} />
                        </span>
                    </div>
                </div>
                <div style={{ marginTop: 2 }} className={`flex  items-center justify-between ${styles.card_content}`}>
                    <p>{(file!.size > 1024 * 1024)
                        ? `${(file!.size / (1024 * 1024)).toFixed(2)} MB`
                        : `${Math.round(file!.size / 1024)} KB`}</p>
                    <p> {file?.createdDateTime && format(new Date(file?.createdDateTime), 'dd MMM, yy')} </p>
                </div>
            </div>
        </div>
    )
}

export default FileTileView