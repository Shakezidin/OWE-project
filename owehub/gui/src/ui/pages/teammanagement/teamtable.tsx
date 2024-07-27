import React, { useEffect, useState } from 'react';
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
    if (id && teamName && managerName) {
      const data = {
        team_name: teamName,
        manager_id: parseInt(managerName),
        team_id: parseInt(id),
      };
      dispatch(getTeam(data));
    }
  }, [id, teamName, managerName, dispatch, refetch]);

  const handleMoveMemberClick = (el: any) => {
    console.log(el, 'el');
    setSelectedMember(el);
    setOpen1(true);
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
        {open && (
          <AddMember
            handleClose={handleClose}
            onSubmitCreateUser={onSubmitCreateUser}
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
            style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
          >
            <div className="team-table-top">
              <div className="team-members-top">
                <div className="team-members">
                  <span>Team Name</span>
                  <h1>{team?.team_name || 'N/A'}</h1>
                </div>
                <div className="team-members">
                  <span>Manager</span>
                  <h1>{team?.manager_name || 'N/A'}</h1>
                </div>
                <div className="team-members">
                  <span>Regional Manager</span>
                  <h1>{team?.regional_manager_name || 'N/A'}</h1>
                </div>
              </div>
              <div className="team-button-sec">
                <button onClick={handleOpen}>+ Add New Member</button>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '34px' }}>
                    <div className="table-header">
                      <p>Sales Rep</p>
                      <FaArrowDown style={{ color: '#667085' }} />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Phone Number</p>
                      <FaArrowDown style={{ color: '#667085' }} />
                    </div>
                  </th>
                  <th>
                    <div className="table-header">
                      <p>Email ID</p>
                      <FaArrowDown style={{ color: '#667085' }} />
                    </div>
                  </th>
                  <th>
                    <div
                      className="action-header"
                      style={{ paddingRight: '94px' }}
                    >
                      <p>Move</p>
                    </div>
                  </th>
                  <th>
                    <div
                      className="table-header"
                      style={{ paddingRight: '34px' }}
                    >
                      <p>Offboard</p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.length > 0 ? (
                  currentPageData.map((el: any, index: any) => (
                    <tr key={index}>
                      <td
                        style={{
                          color: '101828',
                          paddingLeft: '33px',
                          fontWeight: '500',
                        }}
                      >
                        {el.sale_rep_name}
                      </td>
                      <td style={{ color: '#101828' }}>{el.phone_number}</td>
                      <td style={{ color: '#101828' }}>{el.sale_rep_name}</td>
                      <td
                        className="zoom-out-help"
                        style={{ paddingLeft: '18px' }}
                      >
                        <img
                          src={ICONS.TeamEdit}
                          style={{
                            height: '18px',
                            width: '18px',
                            stroke: '0.2',
                          }}
                          alt=""
                          onClick={() => handleMoveMemberClick(el)}
                        />
                      </td>
                      <td
                        className="zoom-out-help"
                        style={{ paddingLeft: '30px' }}
                      >
                        <img
                          src={ICONS.deleteIcon}
                          style={{
                            height: '18px',
                            width: '18px',
                            stroke: '0.2',
                          }}
                          alt=""
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr style={{ border: 0 }}>
                    <td colSpan={10}>
                      <DataNotFound />
                    </td>
                  </tr>
                )}
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
