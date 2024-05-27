import React from 'react';
import DataNotFound from '../../../components/loader/DataNotFound';
import { ICONS } from '../../../icons/Icons';
import CheckBox from '../../../components/chekbox/CheckBox';
import SortableHeader from '../../../components/tableHeader/SortableHeader';
import { Commissioncolumns } from '../../../../resources/static_data/configureHeaderData/CommissionColumn';
import { useAppSelector } from '../../../../redux/hooks';
import { toggleRowSelection } from '../../../components/chekbox/checkHelper';
import { CommissionModel } from '../../../../core/models/configuration/create/CommissionModel';
import MicroLoader from '../../../components/loader/MicroLoader';

interface rowProps {
  selectAllChecked: boolean;
  selectedRows: Set<number>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<number>>>;
  setSelectAllChecked: React.Dispatch<React.SetStateAction<boolean>>;
  isAnyRowSelected: boolean;
  isAllRowsSelected: boolean;
  viewArchived: boolean;
  handleEditCommission: (commission: CommissionModel) => void;
  handleSort: (key: any) => void;
  currentPageData: any;
  handleArchiveClick: (record_id: any) => Promise<void>;
  sortDirection: 'asc' | 'desc';
  sortKey: string;
}
const CommissionRowComponent: React.FC<rowProps> = ({
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
  handleEditCommission,
  sortDirection,
  sortKey,
}) => {
  const { commissionsList, loading } = useAppSelector((state) => state.comm);
  return (
    <div
      className="TableContainer"
      style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
    >
      <table>
        <thead>
          <tr>
            {Commissioncolumns?.map((item, key) => (
              <SortableHeader
                key={key}
                isCheckbox={item.isCheckbox}
                titleName={item.displayName}
                data={commissionsList}
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
            {viewArchived === true ? null : (
              <th>
                <div className="action-header">
                  <p>Action</p>
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={Commissioncolumns.length}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <MicroLoader />
                </div>
              </td>
            </tr>
          ) : currentPageData?.length > 0 ? (
            currentPageData?.map((el: any, i: any) => (
              <tr
                key={i}
                style={{ background: selectedRows.has(i) ? '#56565610' : '' }}
              >
                <td style={{ fontWeight: '500', color: 'black' }}>
                  <div className="flex-check">
                    <CheckBox
                      checked={selectedRows.has(i)}
                      onChange={() => {
                        // If there's only one row of data and the user clicks its checkbox, select all rows
                        if (currentPageData?.length === 1) {
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
                    {el.partner}
                  </div>
                </td>
                <td>{el.installer}</td>
                <td>{el.state}</td>
                <td>{el.sale_type}</td>
                <td>{el.sale_price}</td>
                <td>{el.rep_type}</td>
                <td>{el.rl}</td>
                <td>{el.rate}</td>
                <td>{el.start_date}</td>
                <td>{el.end_date}</td>
                <td>
                  {!viewArchived && selectedRows.size < 2 && (
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
                        onClick={() => handleEditCommission(el)}
                      >
                        <img src={ICONS.editIcon} alt="" />
                        {/* <span className="tooltiptext">Edit</span> */}
                      </div>
                    </div>
                  )}
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

export default CommissionRowComponent;
