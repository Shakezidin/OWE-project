import React from "react";
import { ICONS } from "../../icons/Icons";
import { IoAddSharp } from "react-icons/io5";
import "../../pages/configure/configure.css";

interface TableProps {
  title: string;
  onPressViewArchive: () => void;
  onPressArchive: () => void;
  onPressFilter: () => void;
  onPressImport: () => void;
  onpressExport: () => void;
  onpressAddNew: () => void;
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
  } = props;
  return (
    <div className="commissionSection">
      <div className="rateSection">
        <h2>{title}</h2>
        <p style={{ color: "#667085", fontSize: "14px" }}>
          You can view and edit these data as per your requirement
        </p>
      </div>
      <div className="iconContainer">
        <div className="iconsSection2">
          <button type="button" onClick={onPressViewArchive}>
            <img src={ICONS.VIEW_ARCHIVE} alt="" />
            View Archive
          </button>
        </div>

        <div className="iconsSection2">
          <button type="button" onClick={onPressArchive}>
            <img src={ICONS.ARCHIVE} alt="" />
            Archive
          </button>
        </div>
        <div className="iconsSection-filter">
          <button type="button" onClick={onPressFilter}>
            <img src={ICONS.FILTER} alt="" />
          </button>
        </div>
        <div className="iconsSection2">
          <button type="button" onClick={onPressImport}>
            <img src={ICONS.IMAGE_IMPORT} alt="" /> Import
          </button>
        </div>
        <div className="iconsSection2">
          <button type="button" onClick={onpressExport}>
            <img src={ICONS.IMAGE_EXPORT} alt="" />
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
            onClick={onpressAddNew}
          >
            <IoAddSharp /> Add New
          </button>
        </div>
      </div>

      {/* {open && <CreateDealer handleClose={handleClose} />} */}
    </div>
  );
};

export default TableHeader;
