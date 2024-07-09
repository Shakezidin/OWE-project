import React, { useState } from 'react';
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

// import { installers, partners, respTypeData, statData } from "../../../../../core/models/data_models/SelectDataModel";

const DashBoardTable: React.FC = () => {
  const [editedCommission] = useState<CommissionModel | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { data, count } = useAppSelector((state) => state.dealerPaySlice);
 
  const [currentPage, setCurrentPage] = useState(1);

  const [openIcon, setOpenIcon] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);

  const handleIconOpen = () => setOpenIcon(true);
  const handleIconClose = () => setOpenIcon(false);
  // const handleClose = () => setOpen(false);
  const [editMode, setEditMode] = useState(false);

  const dataUser = [
    {
      pi: '1234567890',
      dn: 'Josh Morton',
      sr: 'Josh Morton',
      cn: 'josh Morton',
      cm: 'Percentage',
      pg: '80/20',
      amt: '$123,456',
      pipeline: '$100,362',
      cd: '$300,652',
      ps: 'Active',
      state: 'Texas',
      sysSize: '10.5',
      type: 'loan',
      adder: '$62,500',
      ajh: '12 Days',
      rl: '$20.00',
      epc: '2.444',
    },
    {
      pi: '1234567890',
      dn: 'Josh Morton',
      sr: 'Josh Morton',
      cn: 'josh Morton',
      cm: 'RL',
      pg: '-',
      amt: '$123,456',
      pipeline: '$100,362',
      cd: '$300,652',
      ps: 'Active',
      state: 'Texas',
      sysSize: '10.5',
      type: 'loan',
      adder: '$62,500',
      ajh: '12 Days',
      rl: '$20.00',
      epc: '2.444',
    },
    {
      pi: '1234567890',
      dn: 'Josh Morton',
      sr: 'Josh Morton',
      cn: 'josh Morton',
      cm: 'Percentage',
      pg: '70/30',
      amt: '$123,456',
      pipeline: '$100,362',
      cd: '$300,652',
      ps: 'Active',
      state: 'Texas',
      sysSize: '10.5',
      type: 'loan',
      adder: '$62,500',
      ajh: '12 Days',
      rl: '$20.00',
      epc: '2.444',
    },
    {
      pi: '1234567890',
      dn: 'Josh Morton',
      sr: 'Josh Morton',
      cn: 'josh Morton',
      cm: 'RL',
      pg: '-',
      amt: '$123,456',
      pipeline: '$100,362',
      cd: '$300,652',
      ps: 'Active',
      state: 'Texas',
      sysSize: '10.5',
      type: 'loan',
      adder: '$62,500',
      ajh: '12 Days',
      rl: '$20.00',
      epc: '2.444',
    },
    {
      pi: '1234567890',
      dn: 'Josh Morton',
      sr: 'Josh Morton',
      cn: 'josh Morton',
      cm: 'Percentage',
      pg: '80/20',
      amt: '$123,456',
      pipeline: '$100,362',
      cd: '$300,652',
      ps: 'Inactive',
      state: 'Texas',
      sysSize: '10.5',
      type: 'loan',
      adder: '$62,500',
      ajh: '12 Days',
      rl: '$20.00',
      epc: '2.444',
    },
    {
      pi: '1234567890',
      dn: 'Josh Morton',
      sr: 'Josh Morton',
      cn: 'josh Morton',
      cm: 'RL',
      pg: '-',
      amt: '$123,456',
      pipeline: '$100,362',
      cd: '$300,652',
      ps: 'Active',
      state: 'Texas',
      sysSize: '10.5',
      type: 'loan',
      adder: '$62,500',
      ajh: '12 Days',
      rl: '$20.00',
      epc: '2.444',
    },
    {
      pi: '1234567890',
      dn: 'Josh Morton',
      sr: 'Josh Morton',
      cn: 'josh Morton',
      cm: 'Percentage',
      pg: '70/30',
      amt: '$123,456',
      pipeline: '$100,362',
      cd: '$300,652',
      ps: 'Active',
      state: 'Texas',
      sysSize: '10.5',
      type: 'loan',
      adder: '$62,500',
      ajh: '12 Days',
      rl: '$20.00',
      epc: '2.444',
    },
    {
      pi: '1234567890',
      dn: 'Josh Morton',
      sr: 'Josh Morton',
      cn: 'josh Morton',
      cm: 'RL',
      pg: '-',
      amt: '$123,456',
      pipeline: '$100,362',
      cd: '$300,652',
      ps: 'Active',
      state: 'Texas',
      sysSize: '10.5',
      type: 'loan',
      adder: '$62,500',
      ajh: '12 Days',
      rl: '$20.00',
      epc: '2.444',
    },
    {
      pi: '1234567890',
      dn: 'Josh Morton',
      sr: 'Josh Morton',
      cn: 'josh Morton',
      cm: 'Percentage',
      pg: '80/20',
      amt: '$123,456',
      pipeline: '$100,362',
      cd: '$300,652',
      ps: 'Active',
      state: 'Texas',
      sysSize: '10.5',
      type: 'loan',
      adder: '$62,500',
      ajh: '12 Days',
      rl: '$20.00',
      epc: '2.444',
    },
    {
      pi: '1234567890',
      dn: 'Josh Morton',
      sr: 'Josh Morton',
      cn: 'josh Morton',
      cm: 'RL',
      pg: '-',
      amt: '$123,456',
      pipeline: '$100,362',
      cd: '$300,652',
      ps: 'Active',
      state: 'Texas',
      sysSize: '10.5',
      type: 'loan',
      adder: '$62,500',
      ajh: '12 Days',
      rl: '$20.00',
      epc: '2.444',
    },
  ];
  const dispatch = useAppDispatch();
  
  const itemsPerPage = 10;

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const totalPages = Math.ceil(count / itemsPerPage);
  const currentPageData = data?.slice();
  // const isAnyRowSelected = selectedRows.size > 0;
  // const isAllRowsSelected = selectedRows.size === data?.length;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;

  const endIndex = currentPage * itemsPerPage;
  return (
    <>
      <div className="dashBoard-container">
        <div
          className="TableContainer"
          style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
        >
          <table>
            <thead>
              <tr>
                <th>
                  <div>
                    <CheckBox
                      checked={false}
                      onChange={() => {}}
                      // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    />
                  </div>
                </th>

                <th style={{ padding: '0px' }}>
                  <div className="table-header">
                    <p>Project ID</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Dealer Name</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
               
                <th>
                  <div className="table-header">
                    <p>Rep 1</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Home Owner</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Contract Date</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Contract Value</p> <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Amount</p> <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Amount Paid</p> <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Balance</p> <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Credit</p> <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>EPC</p> <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>NET EPC</p> <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>NET REV</p> <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                
                <th>
                  <div className="table-header">
                    <p>Current Status</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Dba</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Status Date</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sys Size</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Loan Fee</p> <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Draw Amt</p> <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>RL</p> <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>

                 
                <th>
                  <div className="action-header">
                    <p>Help</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0
                ? data.map((el:any, index:any) => (
                    <tr key={index}>
                      <td>
                        <CheckBox
                          checked={false}
                          onChange={() => {}}
                          // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                        />
                      </td>
                      <td
                        onClick={() => {
                          handleOpen();
                        }}
                        style={{
                          color: '101828',
                          paddingLeft: '0',
                          cursor: 'pointer',
                          fontWeight: '500',
                        }}
                        className="zoom-out-td"
                      >
                        {el.unique_id}
                      </td>
                      <td style={{ color: '#101828' }}>{el.dealer}</td>
                      <td style={{ color: '#101828' }}>{el.rep1}</td>
                      <td style={{ color: '#101828' }}>{el.home_owner}</td>
                      <td style={{ color: '#101828' }}>{el.contract_date}</td>
                      <td style={{ color: '#101828' }}>{el.contract_value}</td>
                      <td style={{ color: '#63BC51', fontWeight: '500' }}>
                        {el.amount}
                      </td>
                      <td style={{ color: '#EB5CAE', fontWeight: '500' }}>
                        {el.amt_paid} 
                      </td>
                      <td style={{ color: '#379DE3', fontWeight: '500' }}>
                        {el.balance || "N/A"} 
                      </td>
                      <td style={{ color: '#15C31B', fontWeight: '500' }}>
                        {el.credit || "N/A"} 
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
                      <td>
                        {el.current_status} 
                      </td>
                      <td>{el.state}</td>
                      <td>{el.dba || "N/A"}</td>
                      <td>{el.status_date}</td>
                      <td>{el.sys_size}</td>
                      <td>{el.loan_fee || "N/A"}</td>
                      <td>{el.draw_amt || "N/A"}</td>
                      <td>{el.rl || "N/A"}</td>
                      {/* <td
                        style={{ cursor: "pointer", color: "#101828" }}
                        onClick={() => handleIconOpen()}
                        className="zoom-out-help"
                      >
                        <BiSupport className="bi-support-icon" />
                      </td> */}
                      <td className="zoom-out-help">
                      <img src={ICONS.online} style={{
                        height: '18px',
                        width: '18px',
                        stroke: '0.2',
                      }}
                      alt=""
                      onClick={() => handleIconOpen()}
                      />

                    </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
        {data?.length > 0 ? (
          <div className="page-heading-container">
            <p className="page-heading">
              Showing {startIndex} -{' '}
              {endIndex > count ? count : endIndex} of {count}{' '}
              item
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
          commission={editedCommission}
          editMode={editMode}
          handleClose={handleIconClose}
        />
      )}
    </>
  );
};

export default DashBoardTable;
