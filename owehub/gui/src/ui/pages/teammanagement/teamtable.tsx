import React, { useState } from 'react';
import '../userManagement/user.css';
import '../configure/configure.css';
import { FaArrowDown } from 'react-icons/fa6';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { CommissionModel } from '../../../core/models/configuration/create/CommissionModel';
import Pagination from '../../components/pagination/Pagination';
import { ICONS } from '../../icons/Icons';
import './dashboard.css'

// import { installers, partners, respTypeData, statData } from "../../../../../core/models/data_models/SelectDataModel";

const TeamTable: React.FC = () => {
  const [editedCommission] = useState<CommissionModel | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  
  const [currentPage, setCurrentPage] = useState(1);

  const [openIcon, setOpenIcon] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);

  const handleIconOpen = () => setOpenIcon(true);
  const handleIconClose = () => setOpenIcon(false);
  // const handleClose = () => setOpen(false);
  const [editMode, setEditMode] = useState(false);

  const dataUser = [
    {
      name: 'John Doe',
      phoneNumber: '123-456-7890',
      emailId: 'johndoe@example.com',
      nameRemoved: '',
    },
    {
      name: 'Jane Smith',
      phoneNumber: '987-654-3210',
      emailId: 'janesmith@example.com',
      nameRemoved: '',
    },
    {
      name: 'Bob Johnson',
      phoneNumber: '555-123-4567',
      emailId: 'bobjohnson@example.com',
      nameRemoved: '',
    },
    {
      name: 'Alice Brown',
      phoneNumber: '111-222-3333',
      emailId: 'alicebrown@example.com',
      nameRemoved: '',
    },
    {
      name: 'Mike Davis',
      phoneNumber: '999-888-7777',
      emailId: 'mikedavis@example.com',
      nameRemoved: '',
    },
    {
      name: 'Sara Wilson',
      phoneNumber: '444-555-6666',
      emailId: 'sarawilson@example.com',
      nameRemoved: '',
    },
  ];
  const count = dataUser.length;
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
  const currentPageData = dataUser?.slice();
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
            <div className='team-table-top'>
                <div className='team-members-top'>
                   <div className='team-members'>
                   <span>Team Name</span>
                   <h1>Bison</h1>
                   </div>
                   <div className='team-members'>
                   <span>Manager</span>
                      <h1>Glen Philips</h1>
                   </div>
                   <div className='team-members'>
                   <span>Regional Manager</span>
                      <h1>Ab Dev</h1>
                   </div>
                </div>
                <div className='team-button-sec'>
                   <button>+ Add New Member</button>
                </div>
            </div>
          <table>
            <thead>
              <tr>

                <th style={{ paddingLeft: '34px' }}>
                  <div className="table-header">
                    <p>Sales Rep</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                  <p>Phone Number</p>{' '}
                    
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
               
                <th>
                  <div className="table-header">
                  <p>Email ID</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Offboard</p>{' '}
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>               
                <th>
                  <div className="action-header">
                    <p>Move</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {dataUser.length > 0
                ? dataUser.map((el:any, index:any) => (
                    <tr key={index}>
    
                      <td
                        style={{
                          color: '101828',
                          paddingLeft: '33px',
                          fontWeight: '500',
                        }}
                      >
                        {el.name}
                      </td>
                      <td style={{ color: '#101828' }}>{el.phoneNumber}</td>
                      <td style={{ color: '#101828' }}>{el.emailId}</td>
                      <td style={{ color: '#101828' }}>Remove</td>
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
        {dataUser?.length > 0 ? (
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
    </>
  );
};

export default TeamTable;
