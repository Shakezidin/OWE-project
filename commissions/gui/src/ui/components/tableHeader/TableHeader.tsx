import React from "react";
import { ICONS } from "../../icons/Icons";
import "../../pages/configure/configure.css";

interface TableProps {
  title: string;
  onPressViewArchive: () => void;
  onPressArchive: () => void;
  onPressFilter: () => void;
  onPressImport: () => void;
  onpressExport: () => void;
  onpressAddNew: () => void;
  isAnyRowSelected:boolean,
  checked:boolean
 

}

const TableHeader = (props: TableProps) => {
  const {
    title,
    onPressArchive,
    onPressFilter,
    onPressImport,
    onPressViewArchive,
    onpressExport,
    onpressAddNew,
    checked,
    isAnyRowSelected
  
  } = props;
  return (
    <div className="commissionSection">
      <div className="rateSection">
        <h2>{title}</h2>
      </div>
      <div className="iconContainer">
      <div className="iconsSection2">
          <button type="button" onClick={onPressViewArchive}>
            <img src={ICONS.VIEW_ARCHIVE} alt="" />
            View Archive
          </button>
        </div>
        {
         isAnyRowSelected ===true ?<>
       

        <div className="iconsSection2">
        <button type="button" onClick={onPressArchive} style={{cursor:checked?"pointer":"not-allowed"}}>
          <img src={ICONS.ARCHIVE} alt="" />
          Archive
        </button>
      </div>
         </>:null
        }
       
        <div className="iconsSection-filter">
          <button type="button" onClick={onPressFilter}>
            <img src={ICONS.filtercomm} alt="" style={{width:"15px", height:"15px"}}/>
          </button>
        </div>
        <div className="iconsSection2">
          <button type="button" onClick={onPressImport}>
            <img src={ICONS.importIcon} alt="" /> Import
          </button>
        </div>
        <div className="iconsSection2">
          <button type="button" onClick={onpressExport}>
            <img src={ICONS.exportIcon} alt="" />
            Export
          </button>
        </div>
        <div className="iconsSection2">
          <button
            type="button"
            style={{
              background: "black",
              color: "white",
              border: "1px solid black",
            }}
            className="hover-btn"
            onClick={onpressAddNew}
          >
             <img src={ICONS.AddIcon} alt=""  style={{width:"14px", height:"14px"}}/> Add New
          </button>
        </div>
      </div>

      {/* {open && <CreateDealer handleClose={handleClose} />} */}
    </div>
  );
};

export default TableHeader;
