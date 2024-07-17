import React from 'react';
import DataNotFound from '../../../components/loader/DataNotFound';
import { ICONS } from '../../../icons/Icons';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { AdderVColumns } from '../../../../resources/static_data/configureHeaderData/AdderVTableColumn';
import { AdderVModel } from '../../../../core/models/configuration/create/AdderVModel';
import CheckBox from '../../../components/chekbox/CheckBox';
import { useAppSelector } from '../../../../redux/hooks';
interface rowProps {
  selectAllChecked: boolean;
  selectedRows: Set<number>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>;
  setSelectAllChecked: React.Dispatch<React.SetStateAction<boolean>>;
  isAnyRowSelected: boolean;
  isAllRowsSelected: boolean;
  viewArchived: boolean;
  handleEdit: (adderV: AdderVModel) => void;
  handleSort: (key: any) => void;
  currentPageData: any;
  handleArchiveClick: (record_id: any) => Promise<void>;
  sortDirection: 'asc' | 'desc';
  sortKey: string;
}
const AdderVRow: React.FC<rowProps> = ({
  selectAllChecked,
  selectedRows,
  isAllRowsSelected,
  isAnyRowSelected,
  setSelectAllChecked,
  setSelectedRows,
  viewArchived,
  currentPageData,
  handleSort,
  handleArchiveClick,
  handleEdit,
  sortDirection,
  sortKey,
}) => {
  const adderVList = useAppSelector((state) => state.adderV.VAdders_list);
  return (
    <div
      className="TableContainer"
      style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
    >
      <table>
        <thead>
          <tr>
            {AdderVColumns.map((item, key) => (
              <SortableHeader
                key={key}
                isCheckbox={item.isCheckbox}
                titleName={item.displayName}
                data={adderVList}
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

            <th>
              <div className="action-header">
                <p>Action</p>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentPageData?.length > 0 ? (
            currentPageData?.map((el: any, i: any) => (
              <tr key={i}>
                <td style={{ fontWeight: '500', color: 'black' }}>
                  <div className="flex-check">
                    <CheckBox
                      checked={selectedRows.has(i)}
                      onChange={() =>
                        toggleRowSelection(
                          i,
                          selectedRows,
                          setSelectedRows,
                          setSelectAllChecked
                        )
                      }
                    />
                    {el.adder_name}
                  </div>
                </td>
                <td>{el.adder_type}</td>
                <td>{el.price_type}</td>
                <td>{el.price_amount}</td>
                <td>{el.description}</td>
                <td>{el.active}</td>

                <td>
                  <div className="action-icon">
                    <div
                      className="action-archive"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleArchiveClick(el.record_id)}
                    >
                      <img src={ICONS.ARCHIVE} alt="" />
                      {/* <span className="tooltiptext">Archive</span> */}
                    </div>
                    <div
                      className="action-archive"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleEdit(el)}
                    >
                      <img src={ICONS.editIcon} alt="" />
                      {/* <span className="tooltiptext">Edit</span> */}
                    </div>
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

export default AdderVRow;
