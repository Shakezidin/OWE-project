import React from 'react';
import { ICONS } from '../../icons/Icons';
import '../../pages/configure/configure.css';

interface TableProps {
  title: string;
  onPressViewArchive: () => void;
  onPressArchive: () => void;
  onPressFilter: () => void;
  onPressImport: () => void;
  onpressExport: () => void;
  onpressAddNew: () => void;
  isAnyRowSelected: boolean;
  checked: boolean;
  viewArchive: boolean;
}

const TableHeader = (props: TableProps) => {
  const {
    title,
    onPressArchive,
    viewArchive,
    onPressFilter,
    onPressImport,
    onPressViewArchive,
    onpressExport,
    onpressAddNew,
    isAnyRowSelected,
  } = props;
  console.log(viewArchive);
  return (
    <div className="commissionSection">
      <h3>{title}</h3>

      <div className="iconContainer">
        <div className="iconsSection2">
          <button type="button" onClick={onPressViewArchive}>
            {viewArchive === true ? (
              <img src={ICONS.Ellipse} alt="" />
            ) : (
              <img src={ICONS.VIEW_ARCHIVE} alt="" />
            )}
            View Archive
          </button>
        </div>
        {isAnyRowSelected === true && !viewArchive ? (
          <>
            <div className="iconsSection2">
              <button
                type="button"
                onClick={onPressArchive}
                style={{ cursor: isAnyRowSelected ? 'pointer' : 'not-allowed' }}
              >
                <img src={ICONS.ARCHIVE} alt="" />
                Archive
              </button>
            </div>
          </>
        ) : null}

        <div className="iconsSection-filter">
          <button type="button" onClick={onPressFilter}>
            <img
              src={ICONS.filtercomm}
              alt=""
              style={{ width: '15px', height: '15px' }}
            />
          </button>
        </div>
        {/* <div className="iconsSection2">
          <button type="button" onClick={onPressImport}>
            <img src={ICONS.importIcon} alt="" /> Import
          </button>
        </div> */}
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
              background: `var(--active-text-color)`,
              color: 'white',
              border: '1px solid var(--active-text-color)',
            }}
            // className="hover-btn"
            onClick={onpressAddNew}
          >
            <img
              src={ICONS.AddIcon}
              alt=""
              style={{ width: '14px', height: '14px' }}
            />{' '}
            Add New
          </button>
        </div>
      </div>

      {/* {open && <CreateDealer handleClose={handleClose} />} */}
    </div>
  );
};

export default TableHeader;
