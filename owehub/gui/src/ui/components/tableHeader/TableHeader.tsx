import React from 'react';
import { ICONS } from '../../../resources/icons/Icons';
import '../../oweHub/configure/configure.css';
import { useAppSelector } from '../../../redux/hooks';
import { useLocation } from 'react-router-dom';
import { RiFilterLine } from 'react-icons/ri';
import Switch from '../../components/Switch';
import { RiDeleteBinLine } from 'react-icons/ri';
interface TableProps {
  title: string;
  onPressViewArchive: (() => void) | null;
  onPressArchive: () => void;
  onPressFilter: (() => void) | null;
  onPressImport: () => void;
  onpressExport: (() => void) | null;
  onpressAddNew: () => void;
  isAnyRowSelected: boolean;
  checked: boolean;
  viewArchive: boolean;
  archiveText?: string;
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
    archiveText,
  } = props;
  const { isActive } = useAppSelector((state) => state.filterSlice);
  const { pathname } = useLocation();
  return (
    <div className="commissionSection">
      <h3>{title}</h3>

      <div className="iconContainer">
        {onPressViewArchive ? (
          <div className="iconsSection2">
            <div className="flex items-center">
              <label
                htmlFor="h6 "
                style={{
                  marginRight: 13,
                  color: '#292929',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                View Archive
              </label>
              <Switch checked={viewArchive} onChange={onPressViewArchive} disabled />

            </div>
          </div>
        ) : null}

        {isAnyRowSelected === true && !viewArchive ? (
          <>
            <div className="iconsSection2">
              <button
                type="button"
                onClick={onPressArchive}
                style={{ cursor: isAnyRowSelected ? 'pointer' : 'not-allowed' }}
              >
                {archiveText === 'Delete' ? (
                  <RiDeleteBinLine
                    color="white"
                    style={{ marginBottom: 2, marginRight: 2 }}
                    size={18}
                  />
                ) : (
                  <img src={ICONS.ARCHIVE} alt="" />
                )}

                <span>{archiveText || 'Archive'}</span>
              </button>
            </div>
          </>
        ) : null}

        {/* <div className="iconsSection2">
          <button type="button" onClick={onPressImport}>
            <img src={ICONS.importIcon} alt="" /> Import
          </button>
        </div> */}
        <div className="iconsSection2-confex">
          {onpressExport ? (
            <button type="button" disabled onClick={onpressExport}>
              <svg
                width="19"
                height="19"
                viewBox="0 0 19 19"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16.6253 1.58325H11.8753C11.6653 1.58325 11.464 1.66666 11.3155 1.81513C11.167 1.96359 11.0836 2.16496 11.0836 2.37492C11.0836 2.58488 11.167 2.78625 11.3155 2.93471C11.464 3.08318 11.6653 3.16659 11.8753 3.16659H14.7142L8.14891 9.73188C8.0733 9.8049 8.01299 9.89226 7.9715 9.98885C7.93001 10.0854 7.90817 10.1893 7.90726 10.2944C7.90634 10.3996 7.92637 10.5038 7.96618 10.6011C8.00599 10.6984 8.06477 10.7868 8.1391 10.8611C8.21343 10.9354 8.30182 10.9942 8.39912 11.034C8.49641 11.0738 8.60066 11.0939 8.70577 11.0929C8.81089 11.092 8.91477 11.0702 9.01136 11.0287C9.10794 10.9872 9.1953 10.9269 9.26833 10.8513L15.8336 4.286V7.12492C15.8336 7.33488 15.917 7.53624 16.0655 7.68471C16.214 7.83318 16.4153 7.91658 16.6253 7.91658C16.8353 7.91658 17.0366 7.83318 17.1851 7.68471C17.3335 7.53624 17.417 7.33488 17.417 7.12492V2.37492C17.417 2.16496 17.3335 1.96359 17.1851 1.81513C17.0366 1.66666 16.8353 1.58325 16.6253 1.58325Z" />
                <path d="M15.0413 8.38225C14.8314 8.38225 14.63 8.46566 14.4815 8.61412C14.3331 8.76259 14.2497 8.96395 14.2497 9.17391V14.8446C14.2495 15.1068 14.1452 15.3582 13.9598 15.5436C13.7744 15.729 13.5231 15.8332 13.2609 15.8334H4.15513C3.89295 15.8332 3.64157 15.729 3.45618 15.5436C3.27079 15.3582 3.16655 15.1068 3.16634 14.8446V5.73887C3.16655 5.47669 3.27079 5.22531 3.45618 5.03992C3.64157 4.85453 3.89295 4.75029 4.15513 4.75008H9.08088C9.29085 4.75008 9.49221 4.66667 9.64068 4.51821C9.78914 4.36974 9.87255 4.16838 9.87255 3.95841C9.87255 3.74845 9.78914 3.54709 9.64068 3.39862C9.49221 3.25016 9.29085 3.16675 9.08088 3.16675H4.15513C3.47322 3.16759 2.81948 3.43885 2.33729 3.92103C1.85511 4.40322 1.58385 5.05696 1.58301 5.73887V14.843C1.58343 15.5252 1.8545 16.1794 2.33673 16.6619C2.81896 17.1444 3.47295 17.4159 4.15513 17.4167H13.2593C13.9415 17.4163 14.5956 17.1453 15.0782 16.663C15.5607 16.1808 15.8322 15.5268 15.833 14.8446V9.17391C15.833 8.96395 15.7496 8.76259 15.6011 8.61412C15.4527 8.46566 15.2513 8.38225 15.0413 8.38225Z" />
              </svg>
              Export
            </button>
          ) : null}
        </div>
        <div className="iconsSection2-conan">
          <button
            type="button"
            style={{
              // background: `var(--primary-color)`,
              color: 'white',
              border: '1px solid var(--primary-color)',
              opacity:'0.7',
              cursor:'not-allowed'
              
            }}
            // className="hover-btn"
            // onClick={onpressAddNew}
          >
            <img
              src={ICONS.AddIcon}
              alt=""
              style={{ width: '14px', height: '14px' }}
            />{' '}
            Add New
          </button>
        </div>
        <div className="iconsSection-filter relative">
          {onPressFilter ? (
            <button
              style={{
                // backgroundColor: 'var(--primary-color)',
                borderRadius: 8,
              }}
              type="button"
              onClick={onPressFilter}
            >
              {isActive[pathname] && (
                <span
                  className="absolute"
                  style={{
                    border: '1px solid #fff',
                    borderRadius: '50%',
                    backgroundColor: '#2DC74F',
                    width: 8,
                    height: 8,
                    top: 0,
                    right: -2,
                  }}
                ></span>
              )}
              <RiFilterLine size={24} color="#fff" />
            </button>
          ) : null}
        </div>
      </div>

      {/* {open && <CreateDealer handleClose={handleClose} />} */}
    </div>
  );
};

export default TableHeader;
