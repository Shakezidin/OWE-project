import React from 'react'
import styles from './index.module.css'
import FileTileView from '../FileTileView/FileTileView'
export interface IFiles {
  createdDateTime: string;
  id: string;
  name: string;
  webUrl: string;
  size: number;
  "@microsoft.graph.downloadUrl"?: string;

}
const FilesTileViewList = ({ files = [],onDelete }: { files?: IFiles[],  onDelete:(id:string)=>void }) => {
  console.log(files,"filesss")
  return (
    <div className={styles.list_grid}>
      {
        files.map((file) => {
          return <FileTileView onDelete={(id:string)=>onDelete(id)} file={file} key={file.id} />
        })
      }


    </div>
  )
}

export default FilesTileViewList