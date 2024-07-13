import React, { Dispatch, SetStateAction, useState } from 'react';
import '../userManagement/user.css';
import '../configure/configure.css';
import { FaArrowDown } from 'react-icons/fa6';
import CheckBox from '../../components/chekbox/CheckBox';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import HelpDashboard from './HelpDashboard';
import { CommissionModel } from '../../../core/models/configuration/create/CommissionModel';
import ProjectBreakdown from './ProjectBreakdown';
import { BiSupport } from 'react-icons/bi';
import Pagination from '../../components/pagination/Pagination';
import { MdOutlineHelp } from 'react-icons/md';
import { ICONS } from '../../icons/Icons';
import MicroLoader from '../../components/loader/MicroLoader';
import SortableHeader from '../../components/tableHeader/SortableHeader';
import dealerPayColumn from '../../../resources/static_data/configureHeaderData/dealerPayColumn';
import DataNotFound from '../../components/loader/DataNotFound';
import { toggleRowSelection } from '../../components/chekbox/checkHelper';

// import { installers, partners, respTypeData, statData } from "../../../../../core/models/data_models/SelectDataModel";

const DashBoardTable = ({
  currentPage,
  setCurrentPage,
}: {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) => {
  const [editedCommission] = useState<CommissionModel | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { data, count, loading } = useAppSelector(
    (state) => state.dealerPaySlice
  );
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [openIcon, setOpenIcon] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>({});
  const handleOpen = () => setOpen(true);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const handleIconOpen = () => setOpenIcon(true);
  const handleIconClose = () => setOpenIcon(false);
  // const handleClose = () => setOpen(false);

  const [editMode, setEditMode] = useState(false);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(count / itemsPerPage);
  const currentPageData = data?.slice();
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = currentPage * itemsPerPage;
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === currentPageData?.length;

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSort = (key: any) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  if (sortKey) {
    currentPageData.sort((a: any, b: any) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        // Ensure numeric values for arithmetic operations
        const numericAValue =
          typeof aValue === 'number' ? aValue : parseFloat(aValue);
        const numericBValue =
          typeof bValue === 'number' ? bValue : parseFloat(bValue);
        return sortDirection === 'asc'
          ? numericAValue - numericBValue
          : numericBValue - numericAValue;
      }
    });
  }

  return (
    <>
      <div className="dashBoard-container">
        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          <table>
            {!!currentPageData.length && (
              <thead>
                <tr>
                  {dealerPayColumn?.map((item, key) => (
                    <SortableHeader
                      key={key}
                      isCheckbox={item.isCheckbox}
                      titleName={item.displayName}
                      data={data}
                      isAllRowsSelected={isAllRowsSelected}
                      isAnyRowSelected={isAnyRowSelected}
                      selectAllChecked={selectAllChecked}
                      setSelectAllChecked={setSelectAllChecked}
                      selectedRows={selectedRows}
                      setSelectedRows={setSelectedRows}
                      sortKey={item.name}
                      sortDirection={
                        sortKey === item.name ? sortDirection : undefined
                      }
                      onClick={() => handleSort(item.name)}
                    />
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <MicroLoader />
                    </div>
                  </td>
                </tr>
              ) : currentPageData.length > 0 ? (
                currentPageData.map((el: any, index: any) => (
                  <tr key={index}>
                    <td style={{ fontWeight: '500' }}>
                      <div className="flex-check">
                        <CheckBox
                          checked={selectedRows.has(index)}
                          onChange={() => {
                            if (currentPageData?.length === 1) {
                              setSelectAllChecked(true);
                              setSelectedRows(new Set([0]));
                            } else {
                              toggleRowSelection(
                                index,
                                selectedRows,
                                setSelectedRows,
                                setSelectAllChecked
                              );
                            }
                          }}
                        />
                        <span className="zoom-out-td">{el.unique_id}</span>
                      </div>
                    </td>

                    <td style={{ color: '#101828' }}>{el.dealer || 'N/A'}</td>
                    <td style={{ color: '#101828' }}>{el.rep1 || 'N/A'}</td>
                    <td style={{ color: '#101828' }}>
                      {el.home_owner || 'N/A'}
                    </td>
                    <td style={{ color: '#101828' }}>
                      {el.contract_date || 'N/A'}
                    </td>
                    <td style={{ color: '#101828' }}>
                      {el.contract_value || 'N/A'}
                    </td>
                    <td style={{ color: '#63BC51', fontWeight: '500' }}>
                      {el.amount || 'N/A'}
                    </td>
                    <td style={{ color: '#EB5CAE', fontWeight: '500' }}>
                      {el.amt_paid || 'N/A'}
                    </td>
                    <td style={{ color: '#379DE3', fontWeight: '500' }}>
                      {el.balance || 'N/A'}
                    </td>
                    <td style={{ color: '#15C31B', fontWeight: '500' }}>
                      {el.credit || 'N/A'}
                    </td>

                    {/* <td>
                        {el.ps === 'Active' ? (
                          <span style={{ color: '#15C31B' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#15C31B',
                                marginRight: '5px',
                              }}
                            ></span>
                            Active
                          </span>
                        ) : (
                          <span style={{ color: '#F82C2C' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#F82C2C',
                                marginRight: '5px',
                              }}
                            ></span>
                            Inactive
                          </span>
                        )}
                      </td> */}
                    <td>{el.epc}</td>
                    <td>{el.net_epc}</td>
                    <td>{el.net_rev}</td>
                    <td>{el.current_status}</td>
                    <td>{el.state}</td>
                    <td>{el.dba || 'N/A'}</td>
                    <td>{el.status_date}</td>
                    <td>{el.sys_size}</td>
                    <td>{el.loan_fee || 'N/A'}</td>
                    <td>{el.draw_amt || 'N/A'}</td>
                    <td>{el.rl || 'N/A'}</td>
                    <td>{el.OtherAdders || 'N/A'}</td>
                    <td>{el.rep2 || 'N/A'}</td>
                    {/* <td
                        style={{ cursor: "pointer", color: "#101828" }}
                        onClick={() => handleIconOpen()}
                        className="zoom-out-help"
                      >
                        <BiSupport className="bi-support-icon" />
                      </td> */}
                    <td className="zoom-out-help">
                      <img
                        src={ICONS.online}
                        style={{
                          height: '18px',
                          width: '18px',
                          stroke: '0.2',
                        }}
                        alt=""
                        onClick={() => {
                          setEditData(el);
                          handleIconOpen();
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr style={{ border: 0 }}>
                  <td colSpan={8}>
                    <div className="data-not-found">
                      <DataNotFound />
                      <h3>Data Not Found</h3>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {currentPageData?.length > 0 ? (
          <div className="page-heading-container">
            <p className="page-heading">
              Showing {startIndex} - {endIndex > count ? count : endIndex} of{' '}
              {count} item
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              currentPageData={currentPageData}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
              perPage={itemsPerPage}
            />
          </div>
        ) : null}
      </div>
      {open && (
        <ProjectBreakdown
          commission={editedCommission}
          editMode={editMode}
          handleClose={() => {
            setOpen(false);
          }}
        />
      )}
      {openIcon && (
        <HelpDashboard
          data={{
            id: editData.unique_id,
            name: editData.dealer,
            state: editData.state,
            status: editData.current_status,
          }}
          handleClose={handleIconClose}
        />
      )}
    </>
  );
};

export default DashBoardTable;
