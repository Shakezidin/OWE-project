import { useState } from 'react';
import { showAlert, successSwal } from '../../../components/alert/ShowAlert';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';


interface DataItem {
  record_id: number;
  // Add other properties if necessary
}

const useArchiveManagement = (
  fetchFunction: () => void,
  postCallerFunction: (endpoint: string, data: any) => Promise<any>,
  endpoints: string,
  dataList: DataItem[]
) => {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);

  const handleArchiveAllClick = async () => {
    const confirmed = await showAlert('Are You Sure', 'This action will archive all selected rows?', 'Yes', 'No');
    if (confirmed) {
      const archivedRows = Array.from(selectedRows).map(index => dataList[index].record_id);
      if (archivedRows.length > 0) {
        const newValue = {
          record_id: archivedRows,
          is_archived: true
        };
        const res = await postCallerFunction(endpoints, newValue);
        if (res.status === HTTP_STATUS.OK) {
          fetchFunction();
          const remainingSelectedRows = Array.from(selectedRows).filter(index => !archivedRows.includes(dataList[index].record_id));
          const isAnyRowSelected = remainingSelectedRows.length > 0;
          setSelectAllChecked(isAnyRowSelected);
          setSelectedRows(new Set<number>());
          await successSwal("Archived", "All Selected rows have been archived", "success", 2000, false);
        } else {
          await successSwal("Error", "Failed to archive selected rows. Please try again later.", "error", 2000, false);
        }
      }
    }
  };

  const handleArchiveClick = async (record_id: number) => {
    const confirmed = await showAlert('Are You Sure', 'This action will archive selected rows?', 'Yes', 'No');
    if (confirmed) {
      const archived = [record_id];
      const newValue = {
        record_id: archived,
        is_archived: true
      }
      const res = await postCallerFunction(endpoints, newValue);
      if (res.status === HTTP_STATUS.OK) {
        fetchFunction();
        await successSwal("Archived", "Selected rows have been archived", "success", 2000, false);
      } else {
        await successSwal("Error", "Failed to archive selected rows. Please try again later.", "error", 2000, false);
      }
    }
  };


  return {
    handleArchiveAllClick,
    handleArchiveClick,
    selectedRows,
    setSelectedRows,
    selectAllChecked,
    setSelectAllChecked
  };
};

export default useArchiveManagement;
