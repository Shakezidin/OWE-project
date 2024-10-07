import React from 'react'
import styles from '../LibraryHomepage.module.css';
import { BiArrowBack } from 'react-icons/bi';
import { RxDownload } from 'react-icons/rx';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useParams } from 'react-router-dom';
const FolderDetail = () => {
    const path = useParams()
    console.log(path["*"], "pathhh")


    const RecycleBinView = () => (
        <div className={styles.recycle_div}>
            <div className={styles.recycle_icon} >
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

    return (
        <div className={styles.libraryContainer}>
            <div className={styles.libraryHeader}>
                <h3>Library</h3>
            </div>
            <div className={styles.libSecHeader}>
                <div className={styles.folderHeader}>
                    <div className={styles.undoButton} >
                        <BiArrowBack style={{
                            height: '20px',
                            width: '20px',
                        }} />
                    </div>
                    <p className={styles.recycle_p}>Dealer Owner</p>

                </div>
            </div>
            <div className={styles.libSectionWrapper}>
                <div className={styles.lib_Grid_Header}>
                    <div className={`${styles.grid_item} ${styles.table_name}`}>Name</div>
                    <div className={styles.grid_item}>Uploaded by</div>
                    <div className={styles.grid_item}>Uploaded Date</div>
                    <div className={styles.grid_item}>Actions</div>
                </div>

                <div className={styles.libGridItem} >
                    <div className={`${styles.file_icon} ${styles.image_div}`}>
                        <img
                            className={styles.cardImg}
                            src={undefined}

                        />
                        <div>
                            <p className={styles.name}>{'Dealer Owner.pdf'}</p>
                            <p className={styles.size}>{'5 MB'}</p>
                        </div>
                    </div>
                    <div className={styles.grid_item}>{'Unknown'}</div>
                    <div className={styles.grid_item}> 2016-06-24 </div>
                    <div className={`${styles.grid_item} ${styles.grid_icon}`}>
                        <RxDownload className={styles.icons} style={{ height: '18px', width: '18px', color: '#667085' }} />
                        <RiDeleteBinLine className={styles.icons} style={{ height: '18px', width: '18px', color: '#667085' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FolderDetail