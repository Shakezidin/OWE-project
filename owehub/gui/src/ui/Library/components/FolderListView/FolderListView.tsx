import React from 'react'
import sharedStyles from "../../LibraryHomepage.module.css"
import FolderList from '../FolderList/FolderList'
import DataNotFound from '../../../components/loader/DataNotFound';
interface IFolder {
    name: string;
    size: number,
    childCount: number;
    createdDate: string;
    id: string
}
interface IProp {
    folders?: IFolder[]
    onDelete?: (id: string) => void
}
const FolderListView = ({ folders, onDelete }: IProp) => {
    return (
        <div className={sharedStyles.libSectionWrapper}>
            <div className={sharedStyles.lib_Grid_Header}>
                <div className={`${sharedStyles.grid_item} ${sharedStyles.table_name}`}>
                    Name
                </div>

                <div className={sharedStyles.grid_item}>Uploaded Date</div>
                <div className={sharedStyles.grid_item}>Actions</div>
            </div>
            {
                folders?.length ? folders?.map((folder) => {
                    return <FolderList onDelete={onDelete} {...folder} key={folder.id} />
                })
                    : <div style={{ width: '100%' }}>
                        <div className={`bg-white py2 ${sharedStyles.filesLoader}`}>
                            <DataNotFound />
                        </div>
                    </div>
            }


        </div>
    )
}

export default FolderListView