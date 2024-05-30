import React from 'react';
import { ICONS } from '../../icons/Icons';
import '../../pages/configure/configure.css';
import { useAppSelector } from '../../../redux/hooks';
import { useLocation } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import { CiFilter } from 'react-icons/ci';
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
  const { isActive } = useAppSelector((state) => state.filterSlice);
  const { pathname } = useLocation();
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
          <button
            style={{
              backgroundColor: isActive[pathname] ? '#eaecf0' : '',
            }}
            type="button"
            onClick={onPressFilter}
          >
            {isActive[pathname] ? (
              <FaFilter size={15} />
            ) : (
              <CiFilter size={15} />
            )}
          </button>
        </div>
        {/* <div className="iconsSection2">
          <button type="button" onClick={onPressImport}>
            <img src={ICONS.importIcon} alt="" /> Import
          </button>
        </div> */}
        <div className="iconsSection2">
          <button type="button" disabled onClick={onpressExport}>
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
