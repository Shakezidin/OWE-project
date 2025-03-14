import React, { useEffect, useMemo, useState } from 'react';
import CheckBox from '../../../components/chekbox/CheckBox';
import { ICONS } from '../../../../resources/icons/Icons';
import { UserRoleBasedListModel } from '../../../../core/models/api_models/UserManagementModel';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import { UserManagementTableColumn as UserColumns } from '../../../../resources/static_data/UserManagementColumn';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import DataNotFound from '../../../components/loader/DataNotFound';
import { TYPE_OF_USER } from '../../../../resources/static_data/Constant';
import useAuth from '../../../../hooks/useAuth';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { shuffleArray } from '../../../../redux/apiSlice/userManagementSlice/userManagementSlice';
import { MdOutlineLockReset } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';
import { CiEdit } from 'react-icons/ci';
import EditUser from '../../../../resources/assets/edituser.svg';

interface UserTableProps {
  data: UserRoleBasedListModel[];
  onClickEdit: (item: UserRoleBasedListModel) => void;
  onClickDelete: (item: UserRoleBasedListModel) => void;
  handlePasswordReset: (id?: string) => void;
  handleEdit: (id?: string) => void;
  selectAllChecked: boolean;
  selectedRows: Set<number>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>;
  setSelectAllChecked: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValue?: string;
}
const UserTable: React.FC<UserTableProps> = ({
  data,
  onClickDelete,
  onClickEdit,
  selectAllChecked,
  selectedRows,
  setSelectedRows,
  setSelectAllChecked,
  selectedValue,
  handlePasswordReset,
  handleEdit,
}) => {
  const isAnyRowSelected = selectedRows?.size > 0;
  const isAllRowsSelected = selectedRows?.size === data?.length;
  const [sortKey, setSortKey] = useState('user_code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [email, setEmail] = useState('');
  const { authData } = useAuth();
  const dispatch = useAppDispatch();
  const { role_name } = useAppSelector((state) => state.auth);
  const handleSort = (key: string) => {
    const direction =
      sortKey === key ? (sortDirection === 'desc' ? 'asc' : 'desc') : 'asc';
    if (sortKey === key) {
      setSortDirection(direction);
    } else {
      setSortKey(key);
      setSortDirection(direction);
    }
    sortArray(key, direction);
  };

  const sortArray = (sortKey: string, direction: string) => {
    let sortedData = [...data];
    if (sortKey) {
      sortedData.sort((a: any, b: any) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc'
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
    dispatch(shuffleArray(sortedData));
  };

  const UserManagementTableColumn = useMemo(() => {
    const col = [...UserColumns];
    if (selectedValue === TYPE_OF_USER.SUB_DEALER_OWNER) {
      // col.splice(3, 0, {
      //   name: 'dealer_owner',
      //   displayName: 'Dealer',
      //   type: 'string',
      //   isCheckbox: false,
      // });
    } else if (selectedValue === TYPE_OF_USER.ALL) {
      col.splice(3, 0, {
        name: 'role_name',
        displayName: 'Role',
        type: 'string',
        isCheckbox: false,
      });
    }
    return col;
  }, [selectedValue, UserColumns]);

  useEffect(() => {
    const storedEmail = authData?.email;
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, [authData]);

  console.log(selectedValue, 'ghjsfghsdf');

  const environment = process.env.REACT_APP_ENV;
  const isEditVisible =
  (role_name === TYPE_OF_USER.ADMIN) 
  console.log( environment === 'staging', "isEditVisible")


  return (
    <div
      className="UserManageTable"
      style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
    >
      <table>
        <thead>
          <tr style={{ backgroundColor: 'var(--primary-light-color)' }}>
            {UserManagementTableColumn.filter(
              (item) => item.displayName !== 'Reporting To'
            ).map((item, key) => (
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
                sortDirection={sortKey === item.name ? sortDirection : 'asc'}
                onClick={() => handleSort(item.name)}
              />
            ))}
            <th>
              <div className="action-header">
                <p>Action</p>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {data?.length > 0 ? (
            data?.map((el: UserRoleBasedListModel, i: number) => (
              <tr key={el.email_id}>
                <td>
                  <div className="flex-check">
                    <CheckBox
                      checked={selectedRows.has(i)}
                      disabled={el.email_id === email}
                      onChange={() => {
                        // If there's only one row of data and the user clicks its checkbox, select all rows

                        toggleRowSelection(
                          i,
                          selectedRows,
                          setSelectedRows,
                          setSelectAllChecked
                        );
                      }}
                    />
                    {el.user_code}
                  </div>
                </td>
                <td>{el.name}</td>
                {selectedValue === TYPE_OF_USER.ALL && (
                  <td>{el.role_name ? el.role_name : 'NA'}</td>
                )}

                <td>{el.email_id}</td>

                <td>{el.mobile_number}</td>
                {/* Manager column */}
                <td>{el.reporting_manager ? el.reporting_manager : 'NA'}</td>
                {/* Added Dealer column */}
                <td
                  data-tooltip-id={
                    el.dealer?.length > 15 ? `dealer-${el.dealer}` : undefined
                  }
                  style={{ position: 'relative' }}
                >
                  {el.dealer?.length > 15
                    ? `${el.dealer.slice(0, 15)}...`
                    : el.dealer || 'NA'}
                  {el.dealer?.length > 15 && (
                    <Tooltip
                      id={`dealer-${el.dealer}`}
                      style={{
                        zIndex: 103,
                        background: '#000',
                        color: '#f7f7f7',
                        fontSize: 12,
                        paddingBlock: 4,
                        fontWeight: '400',
                      }}
                      offset={0}
                      place="left"
                      content={el.dealer}
                      delayShow={100}
                    />
                  )}
                </td>
                <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {el.description ? el.description : 'NA'}
                </td>
                <td>
                  <div className="action-icon" style={{ gap: 3 }}>
                   {isEditVisible && (
                      <div
                        className="reset_hover_btn"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          handleEdit(el.email_id);
                        }}
                      >
                        <Tooltip
                           style={{
                            zIndex: 103,
                            background: '#f7f7f7',
                            color: '#000',
                            fontSize: 12,
                            paddingBlock: 4,
                            fontWeight: '400',
                            
                          }}
                          offset={8}
                          id="edit_user"
                          place="left"
                          content="Edit"
                          delayShow={200}
                          className="pagination-tooltip"
                        />
                        <img
                          src={EditUser} // Replace with the correct path to the edit icon
                          alt="Edit User"
                          data-tooltip-id="edit_user"
                          style={{ color: 'rgb(102, 112, 133)', width: 18, height: 18 }}
                        />
                      </div>
                    )}
                    
                    <div
                      className=""
                      style={{
                        cursor:
                          el.email_id === email ? 'not-allowed' : 'pointer',
                      }}
                      onClick={() => {
                        if (el.email_id !== email) {
                          onClickDelete(el);
                        }
                      }}
                    >
                      <Tooltip
                        style={{
                          zIndex: 103,
                          background: '#f7f7f7',
                          color: '#000',
                          fontSize: 12,
                          paddingBlock: 4,
                          fontWeight: '400',
                        }}
                        offset={8}
                        id="user_delete"
                        place="left"
                        content="Delete"
                        delayShow={200}
                        className="pagination-tooltip"
                      />
                      <img
                        src={ICONS.deleteIcon}
                        alt=""
                        data-tooltip-id="user_delete"
                      />
                    </div>

                    {(role_name === TYPE_OF_USER.ADMIN ||
                      role_name === TYPE_OF_USER.DEALER_OWNER) && (
                      <div
                        className="reset_hover_btn"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handlePasswordReset(el.email_id)}
                      >
                        <Tooltip
                          style={{
                            zIndex: 103,
                            background: '#f7f7f7',
                            color: '#000',
                            fontSize: 12,
                            paddingBlock: 4,
                            fontWeight: '400',
                          }}
                          offset={8}
                          id="user_reset"
                          place="left"
                          content="Reset"
                          delayShow={200}
                          className="pagination-tooltip"
                        />
                        <MdOutlineLockReset
                          color="#667085"
                          size={24}
                          
                          data-tooltip-id="user_reset"
                        />
                      </div>
                    )}
                  </div>
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
  );
};

export default UserTable;