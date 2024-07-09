import React, { useEffect, useState } from 'react';
import CheckBox from '../../../components/chekbox/CheckBox';
import { ICONS } from '../../../icons/Icons';
import { UserRoleBasedListModel } from '../../../../core/models/api_models/UserManagementModel';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import { UserManagementTableColumn } from '../../../../resources/static_data/UserManagementColumn';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import DataNotFound from '../../../components/loader/DataNotFound';

interface DBUserTableProps {
  data: UserRoleBasedListModel[];
  onClickEdit: (item: UserRoleBasedListModel) => void;
  onClickDelete: (item: UserRoleBasedListModel) => void;

  selectAllChecked: boolean;
  selectedRows: Set<number>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>;
  setSelectAllChecked: React.Dispatch<React.SetStateAction<boolean>>;
}
const DBUserTable: React.FC<DBUserTableProps> = ({
  data,
  onClickDelete,
  onClickEdit,
  selectAllChecked,
  selectedRows,
  setSelectedRows,
  setSelectAllChecked,
}) => {
  const isAnyRowSelected = selectedRows?.size > 0;
  const isAllRowsSelected = selectedRows?.size === data?.length;
  const [sortKey, setSortKey] = useState('user_code');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    console.log(key);
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  let sortedData = [...data]; // Create a shallow copy of the original data array

  if (sortKey) {
    sortedData.sort((a: any, b: any) => {
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

  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

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
                sortDirection={
                  sortKey === item.name ? sortDirection : 'asc'
                }
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
          {sortedData?.length > 0 ? (
            sortedData?.map((el: UserRoleBasedListModel, i: number) => (
              <tr key={el.email_id}>
                <td>
                  <div className="flex-check">
                    <CheckBox
                      checked={selectedRows.has(i)}
                      disabled={el.email_id === email}
                      onChange={() => {
                        // If there's only one row of data and the user clicks its checkbox, select all rows
                        if (data?.length === 1) {
                          setSelectAllChecked(true);
                          setSelectedRows(new Set([0]));
                        } else {
                          toggleRowSelection(
                            i,
                            selectedRows,
                            setSelectedRows,
                            setSelectAllChecked
                          );
                        }
                      }}
                    />
                    {el.user_code}
                  </div>
                </td>
                <td>{el.name}</td>
                <td>{el.role_name}</td>
                {/* <td>{el.reporting_manager}</td> */}
                <td>{el.email_id}</td>
                <td>{el.mobile_number}</td>
                <td style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {el.description ? el.description : 'NA'}
                </td>
                <td>
                  <div className="action-icon">
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
                      <img src={ICONS.deleteIcon} alt="" />
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr style={{ border: 0 }}>
              <td colSpan={10}>
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
  );
};

export default DBUserTable;
