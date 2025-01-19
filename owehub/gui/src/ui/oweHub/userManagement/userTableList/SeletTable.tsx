import React, { useEffect, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import { FaArrowDown } from 'react-icons/fa6';
import CheckBox from '../../../components/chekbox/CheckBox';
import { ActionButton } from '../../../components/button/ActionButton';
import { useAppSelector } from '../../../../redux/hooks';

type TablePermissions = Record<string, 'View' | 'Edit' | 'Full'>;

interface ButtonProps {
  setSelectTable: React.Dispatch<React.SetStateAction<boolean>>;
  setTablePermissions: React.Dispatch<React.SetStateAction<TablePermissions>>;
  tablePermissions: TablePermissions;
  selected: Set<number>;
  setSelected: React.Dispatch<React.SetStateAction<Set<number>>>;
  editData?: any; // Refine this type if you have a specific structure
}

const SelectTable: React.FC<ButtonProps> = ({
  setSelectTable,
  setTablePermissions,
  tablePermissions,
  setSelected,
  selected,
  editData,
}) => {
  const { option } = useAppSelector((state) => state.dataTableSlice);
  const [sortType, setSortType] = useState<'asc' | 'desc'>('asc');
  const [tables, setTables] = useState<string[]>(
    option.map((option: { table_name: string }) => option.table_name)
  );

  // useEffect(() => {
  //   if (editData?.table_permission) {
  //     const permissions: TablePermissions = {};
  //     const selectedIndices = new Set<number>();

  //     editData.table_permission.forEach((perm: { table_name: string; privilege_type: string }) => {
  //       permissions[perm.table_name] = perm.privilege_type as 'View' | 'Edit' | 'Full';
  //       const index = tables.findIndex((table) => table === perm.table_name);
  //       if (index !== -1) selectedIndices.add(index);
  //     });

  //     setTablePermissions(permissions);
  //     setSelected(selectedIndices);
  //   }
  // }, [editData, tables, setTablePermissions, setSelected]);

  const handleOptionChange = (type: 'View' | 'Edit' | 'Full', table: string, ind: number) => {
    if (selected.has(ind)) {
      setTablePermissions((permissions) => ({
        ...permissions,
        [table]: type,
      }));
    }
  };

  const handleSort = () => {
    if (sortType === 'asc') {
      setSortType('desc');
      setTables([...tables].sort((a, b) => b.localeCompare(a)));
    } else {
      setSortType('asc');
      setTables([...tables].sort((a, b) => a.localeCompare(b)));
    }
  };

  return (
    <div className="transparent-model">
      <div className="modal" style={{ height: 'auto' }}>
        <div
          className="createUserCrossButton"
          onClick={() => {
            setSelectTable(false);
          }}
        >
          <CROSS_BUTTON />
        </div>
        <div className="selectTable-section">
          <p>Section Table</p>
        </div>

        <div
          className="TableContainer"
          style={{
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            height: 'auto',
            maxHeight: 417,
          }}
        >
          <table>
            <thead>
              <tr>
                <th>
                  <CheckBox
                    checked={tables.length === selected.size}
                    onChange={() => {
                      const set = new Set(selected);
                      if (set.size === tables.length) {
                        set.clear();
                        setSelected(set);
                        setTablePermissions({});
                      } else {
                        const newSet = new Set(Array.from(Array(tables.length).keys()));
                        setSelected(newSet);
                      }
                    }}
                  />
                </th>
                <th>
                  <div
                    onClick={handleSort}
                    className="table-header"
                    style={{ cursor: 'pointer' }}
                  >
                    <p>Table Name</p>
                    <FaArrowDown style={{ color: '#667085' }} />
                  </div>
                </th>
                <th>View</th>
                <th>Edit</th>
                <th>Full</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table, ind) => (
                <tr key={ind}>
                  <td>
                    <CheckBox
                      checked={selected.has(ind)}
                      onChange={() => {
                        const set = new Set(selected);
                        if (set.has(ind)) {
                          set.delete(ind);
                          const updatedPermissions = { ...tablePermissions };
                          delete updatedPermissions[table];
                          setTablePermissions(updatedPermissions);
                        } else {
                          set.add(ind);
                        }
                        setSelected(set);
                      }}
                    />
                  </td>
                  <td>{table}</td>
                  <td>
                    <input
                      type="radio"
                      disabled={!selected.has(ind)}
                      checked={tablePermissions[table] === 'View'}
                      onChange={() => handleOptionChange('View', table, ind)}
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      disabled={!selected.has(ind)}
                      checked={tablePermissions[table] === 'Edit'}
                      onChange={() => handleOptionChange('Edit', table, ind)}
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      disabled={!selected.has(ind)}
                      checked={tablePermissions[table] === 'Full'}
                      onChange={() => handleOptionChange('Full', table, ind)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', paddingBlock: '1rem' }}>
          <ActionButton type="submit" title="Done" onClick={() => setSelectTable(false)} />
        </div>
      </div>
    </div>
  );
};

export default SelectTable;
