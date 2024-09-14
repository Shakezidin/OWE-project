import React, { useEffect, useState } from 'react';
import '../user.css';
import { ICONS } from '../../../../resources/icons/Icons';
import CheckBox from '../../../components/chekbox/CheckBox';
import '../../configure/configure.css';
import { UserRoleBasedListModel } from '../../../../core/models/api_models/UserManagementModel';
import { UserDealerTableColumn } from '../../../../resources/static_data/UserManagementColumn';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import DataNotFound from '../../../components/loader/DataNotFound';
import { shuffleArray } from '../../../../redux/apiSlice/userManagementSlice/userManagementSlice';
import { useAppDispatch } from '../../../../redux/hooks';
interface DealerProps {
  data: UserRoleBasedListModel[];
  onClickEdit: (item: UserRoleBasedListModel) => void;
  onClickDelete: (item: UserRoleBasedListModel) => void;
  selectAllChecked: boolean;
  selectedRows: Set<number>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>;
  setSelectAllChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const DealerOwnerTable: React.FC<DealerProps> = ({
  data,
  onClickDelete,
  onClickEdit,
  selectAllChecked,
  selectedRows,
  setSelectedRows,
  setSelectAllChecked,
}) => {
  const [sortKey, setSortKey] = useState('user_code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const dispatch = useAppDispatch()
  const isAnyRowSelected = selectedRows?.size > 0;
  const isAllRowsSelected = selectedRows?.size === data?.length;
 
  const handleSort = (key: string) => {
    const direction = sortKey === key ? (sortDirection === 'desc' ? 'asc' : 'desc') : 'asc'
    if (sortKey === key) {
      setSortDirection(direction);
    } else {
      setSortKey(key);
      setSortDirection(direction);
    }
    sortArray(key,direction)
  };


  const sortArray = (sortKey: string,direction:string) => {
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
    dispatch(shuffleArray(sortedData))

  }

  return (
    <>
      {/* <UserHeaderSection  name="Dealer Owner"/> */}
      <div
        className="UserManageTable"
        style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
      >
        <table>
          <thead>
            <tr style={{ backgroundColor: 'var(--primary-light-color)' }}>
              {UserDealerTableColumn.map((item, key) => (
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
                  <td>{el.email_id}</td>
                  <td>{el.mobile_number}</td>
                  <td>{el.dealer_owner}</td>
                  <td
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                  >
                    {el.description ? el.description : 'NA'}
                  </td>
                  <td>
                    <div className="action-icon">
                      <div
                        className=""
                        style={{ cursor: 'pointer' }}
                        onClick={() => onClickDelete(el)}
                      >
                        <img
                          src={ICONS.deleteIcon}
                          alt=""
                          style={{ marginRight: '15px' }}
                        />
                      </div>
                      {/* <div className="" style={{ cursor: "pointer" }} onClick={()=> onClickEdit(el)}>
                          <img src={ICONS.editIcon} alt="" />
                        </div> */}
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
    </>
  );
};

export default DealerOwnerTable;
