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
}

const FileTileView = ({ file, onDelete }: { file?: IFiles, onDelete: (id: string) => void }) => {
    const { role_name } = useAppSelector(state => state.auth)

    return (
        <div className='bg-white'>
            <div className={styles.thumbnail_wrapper}>
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