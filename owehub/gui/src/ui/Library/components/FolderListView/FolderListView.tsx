import React, { useState } from 'react'
import sharedStyles from "../../LibraryHomepage.module.css"
import FolderList from '../FolderList/FolderList'
import DataNotFound from '../../../components/loader/DataNotFound';
import CheckBox from '../../../components/chekbox/CheckBox';
interface IFolder {
    name: string;
    size: number,
    childCount: number;
    createdDate: string;
    id: string
}
interface IProp {
    folders?: IFolder[]
    onDelete?: (id: string) => void,
    handleCheckboxChange:(set:Set<string>)=>void
    selected:Set<string>
    setSelected:React.Dispatch<React.SetStateAction<Set<string>>>
}
const FolderListView = ({ folders, onDelete,handleCheckboxChange,selected,setSelected }: IProp) => {

    const onCheck = (id: string) => {
        const prev = new Set(Array.from(selected))
        if (selected.has(id)) {
            prev.delete(id)
        } else {
            prev.add(id)
        }
        setSelected(prev)
        handleCheckboxChange(prev)
    }
    return (
        <div className={sharedStyles.libSectionWrapper}>
            <div className={sharedStyles.lib_Grid_Header}>
                <div className={`${sharedStyles.grid_item} ${sharedStyles.table_name}`}>
                    <div className="flex items-center">
                        <div className='mr1'>
                            <CheckBox checked={selected.size === folders?.length && folders?.length > 0} onChange={() => {
                                if (selected.size === folders?.length) {
                                    setSelected(new Set())
                                } else {
                                    const newChecked = new Set(folders?.map((item) => item.id))
                                    setSelected(newChecked)
                                }
                            }} />
                        </div>
                        <span>
                            Name
                        </span>
                    </div>
                </div>

                <div className={sharedStyles.grid_item}>Uploaded Date</div>
                <div className={sharedStyles.grid_item}>Actions</div>
            </div>
            {
                folders?.length ? folders?.map((folder) => {
                    return <FolderList checkedValues={selected} onCheck={onCheck} onDelete={onDelete} {...folder} key={folder.id} />
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