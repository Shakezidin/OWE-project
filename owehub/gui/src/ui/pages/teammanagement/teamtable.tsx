import React, { useEffect, useState, useRef } from 'react';
import '../userManagement/user.css';
import '../configure/configure.css';
import { FaArrowDown } from 'react-icons/fa6';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { CommissionModel } from '../../../core/models/configuration/create/CommissionModel';
import Pagination from '../../components/pagination/Pagination';
import { ICONS } from '../../icons/Icons';
import './dashboard.css';
import AddMember from './NewMember/AddMember';
import MoveMember from './NewMember/MoveMember';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import { ROUTES } from '../../../routes/routes';
import {
  BrowserRouter as Router,
  Route,
  useParams,
  useLocation,
} from 'react-router-dom';
import { getTeam } from '../../../redux/apiActions/teamManagement/teamManagement';
import DataNotFound from '../../components/loader/DataNotFound';
import { BiEditAlt } from 'react-icons/bi';
import { MdOutlineDone } from 'react-icons/md';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import { TYPE_OF_USER } from '../../../resources/static_data/Constant';

interface User {
  name: string;
  phoneNumber: string;
  emailId: string;
  nameRemoved: string;
}

const TeamTable: React.FC = () => {
  const [editedCommission] = useState<CommissionModel | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [refetch, setRefetch] = useState(1);
  const [open1, setOpen1] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const { team } = useAppSelector((state) => state.teamManagmentSlice);

  const getQueryParams = (search: string) => new URLSearchParams(search);
  const queryParams = getQueryParams(location.search);
  const teamName = queryParams.get('team-name');
  const managerName = queryParams.get('team-manager');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClose1 = () => setOpen1(false);
  const [inputValue, setInputValue] = useState<any>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const count = team?.sale_rep_list?.length;
  const itemsPerPage = 10;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const totalPages = Math.ceil(count / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const currentPageData =
    team?.sale_rep_list?.slice(startIndex, endIndex) || [];

  const onSubmitCreateUser = () => {
    console.log('User created');
    handleClose();
  };

  useEffect(() => {
    if (team?.team_name) {
      setInputValue(team?.team_name);
    }
  }, [team?.team_name]);

  useEffect(() => {
    if (teamName && id) {
      const data = {
        team_name: teamName,
        team_id: parseInt(id),
        page_number: 1,
        page_size: 10,
      };
      dispatch(getTeam(data));
    }
  }, [teamName, id, isRefresh]);

  const handleMoveMemberClick = (el: any) => {
    console.log(el, 'el');
    setSelectedMember(el);
    setOpen1(true);
  };

  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setIsEditing(true);
  };

  const role = localStorage.getItem('role');


  const handleDelete = async (id: any) => {
    const data = {};
    try {
      const response = await postCaller('delete_team_member', {
        team_member_id: id,
        team_id: team?.team_id,
      });

      if (response.status > 201) {
        toast.error('Network response was not ok');
      }

      if (response.status === 200) {
        toast.success('Successfully Deleted');
        setIsRefresh((prev) => !prev);
      }
    } catch (error) {
      console.error('There was an error deleting the team member:', error);
    }
  };

  const handleUpdateName = async () => {
    console.log('check');
    try {
      const response = await postCaller('update_team', {
        team_id: team?.team_id,
        team_name: inputValue, // Use inputValue instead of teamName
      });

      if (response.status > 201) {
        toast.error('Network response was not ok');
      }

      if (response.status === 200) {
        toast.success('Team Name Update successfully');
        setIsRefresh((prev) => !prev);
        setIsEditing(false); // Exit edit mode after successful update
      }
    } catch (error) {
      console.error('There was an error updating the team name:', error);
    }
  };

  return (
    <>
      <div className="comm">
        <Breadcrumb
          head=""
          linkPara="Team Management"
          route={ROUTES.TEAM_MANAGEMENT_DASHBOARD}
          linkparaSecond="Team Details"
        />

        {role !== TYPE_OF_USER.SALES_REPRESENTATIVE && open && (
          <AddMember
            handleClose={handleClose}
            onSubmitCreateUser={onSubmitCreateUser}
            team={team}
            setIsRefresh={setIsRefresh}
          />
        )}

        {open1 && (
          <MoveMember
            handleClose1={handleClose1}
            onSubmitCreateUser={onSubmitCreateUser}
            member={selectedMember} // Add this line
            team={team}
            setRefetch={setRefetch}
          />
        )}
        <div className="dashBoard-container">
          <div
            className="TableContainer"
            style={{ overflowX: 'auto', whiteSpace: 'nowrap', height: '85vh' }}
          >
            <div className="team-table-top">
              <div className="team-members-top">
                <div className="team-members">
                  <div className="team-table-container">
                    <input
                      type="text"
                      ref={inputRef}
                      value={inputValue}
                      className="team-input"
                      onChange={(e) => setInputValue(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      readOnly={!isEditing}
                    />
                    <div>
                      {isEditing ? (
                        <div>
                          <MdOutlineDone className='done-icon' onClick={handleUpdateName} />
                        </div>
                      ) : (
                        <div>
                          <BiEditAlt className='edit-icon' onClick={handleIconClick} />
                        </div>
                      )}
                    </div>
                  </div>
                  <p>
                    {team?.manager_count} Managers, {team?.MemberCount} Sales
                    Rep
                  </p>
                </div>
              </div>
              <div className="team-button-sec">
                { team?.logged_in_member_role === "manager" ? 
                <button onClick={handleOpen}>+ Add New Member</button>
                  : null }
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '34px' }}>
                    <div className="table-header">
                      <p>User Code</p>
                      <FaArrowDown style={{ color: '#667085' }} />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Name</p>
                      <FaArrowDown style={{ color: '#667085' }} />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Role</p>
                      <FaArrowDown style={{ color: '#667085' }} />
                    </div>
                  </th>
                  <th>
                    <div
                      className="table-header"
                      style={{ paddingRight: '94px' }}
                    >
                      <p>Email ID</p>
                      <FaArrowDown style={{ color: '#667085' }} />
                    </div>
                  </th>
                  <th>
                    <div
                      className="table-header"
                      style={{ paddingRight: '34px' }}
                    >
                      <p>Phone Number</p>
                      <FaArrowDown style={{ color: '#667085' }} />
                    </div>
                  </th>
                  <th>
                    {role !== TYPE_OF_USER.SALES_REPRESENTATIVE ? (
                      <div
                        className="table-header"
                        style={{ paddingRight: '34px' }}
                      >
                        <p>Action</p>
                      </div>
                    ) : null}
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* {currentPageData.length > 0
                  ? currentPageData.map((el: any, index: any) => (
                    <tr key={index}>
                      <td
                        style={{
                          color: '101828',
                          paddingLeft: '33px',
                          fontWeight: '500',
                        }}
                      >
                        OWE1234
                      </td>
                      <td style={{ color: '#101828' }}>Alex</td>
                      <td style={{ color: '#101828' }}><p className="user-role">Manager</p></td>
                      <td style={{ color: '#101828' }}>Alex@gmail.com</td>
                      <td style={{ color: '#101828' }}>+1 7594594545</td>
                      <td className="zoom-out-help" style={{ paddingLeft: '30px' }}>
                        <img
                          src={ICONS.deleteIcon}
                          style={{
                            height: '18px',
                            width: '16px',
                            stroke: '0.2',
                          }}
                          alt=""
                        />
                      </td>
                    </tr>
                  ))
                  : <tr style={{ border: 0 }}>
                    <td colSpan={10}>
                      <DataNotFound />
                    </td>
                  </tr>} */}
                {team?.sale_rep_list?.map((item: any, index: number) => (
                  <tr key={index}>
                    <td
                      style={{
                        color: '#101828',
                        paddingLeft: '33px',
                        fontWeight: '500',
                      }}
                    >
                      {item.user_code || 'N/A'}
                    </td>
                    <td style={{ color: '#101828' }}>{item.sale_rep_name}</td>
                    <td style={{ color: '#101828' }}>
                      <p
                        className={
                          item.role === 'manager' ? 'user-mg' : 'user-namg'
                        }
                      >
                        {item.role}
                      </p>
                    </td>
                    <td style={{ color: '#101828' }}>{item.email_id}</td>
                    <td style={{ color: '#101828' }}>{item.phone_number}</td>
                    { role !== TYPE_OF_USER.SALES_REPRESENTATIVE ?
                    <td
                      className="zoom-out-help"
                      style={{
                        paddingLeft: '30px',
                        cursor:
                          team?.logged_in_member_role === "manager" &&
                          !(team?.manager_count <= 1 && item.role === 'manager')
                            ? 'pointer'
                            : 'not-allowed',
                        opacity:
                          team?.logged_in_member_role === "manager" &&
                          !(team?.manager_count <= 1 && item.role === 'manager')
                            ? '1'
                            : '0.5',
                      }}
                      onClick={(e) => {
                        if (
                         team?.logged_in_member_role === "manager" &&
                          !(team?.manager_count <= 1 && item.role === 'manager')
                        ) {
                          handleDelete(item.team_member_id);
                        }
                      }}
                    >
                      <img
                        src={ICONS.deleteIcon}
                        style={{
                          height: '18px',
                          width: '16px',
                          stroke: '0.2',
                          pointerEvents:
                            role !== TYPE_OF_USER.SALES_REPRESENTATIVE &&
                            !(
                              team?.manager_count <= 1 &&
                              item.role === 'manager'
                            )
                              ? 'auto'
                              : 'none',
                        }}
                        alt=""
                      />
                    </td>
                   : null }
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {team?.sale_rep_list?.length > 0 ? (
            <div className="page-heading-container">
              <p className="page-heading">
                Showing {startIndex + 1} - {endIndex > count ? count : endIndex}{' '}
                of {count} items
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
                currentPageData={currentPageData}
                goToNextPage={goToNextPage}
                goToPrevPage={goToPrevPage}
                perPage={itemsPerPage}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default TeamTable;
