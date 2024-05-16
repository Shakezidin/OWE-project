import React, { useEffect, useState } from "react";
import "../../configure/configure.css";
import { FaArrowDown } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchCommissions } from "../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { DealerModel } from "../../../../core/models/configuration/create/DealerModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import DataTableHeaderr from "../../../components/tableHeader/DataTableHeaderr";
import CheckBox from "../../../components/chekbox/CheckBox";
import { toggleAllRows, toggleRowSelection } from "../../../components/chekbox/checkHelper";
import FilterData from "./FilterData";
import { Column } from "../../../../core/models/data_models/FilterSelectModel";
import Pagination from "../../../components/pagination/Pagination";
import { DataTableColumn } from "../../../../resources/static_data/DataTableColumn";
import FilterModal from "../../../components/FilterModal/FilterModal";
import {getAnyTableData} from '../../../../redux/apiActions/dataTableAction'

interface RowData {
  [key: string]: string | number | null; // Define possible data types for table cells
}


const DataTablle: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<any>("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const  data: RowData[] = useAppSelector((state) => state.dataTableSlice.tableData);
  const {dbCount } = useAppSelector((state) => state.dataTableSlice)
  const loading = useAppSelector((state) => state.dealer.loading);
  const error = useAppSelector((state) => state.dealer.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  const itemsPerPage = 30;
const start = (currentPage-1)* itemsPerPage+1
const end = currentPage* itemsPerPage
 

  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      filters: [
        {
            Column: "table_name",
            Operation: "=",
            Data: selectedTable.value || "finance_metrics_schema"
        }   
    ]
    };
    dispatch(getAnyTableData(pageNumber));

  }, [dispatch, currentPage, selectedTable]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };


  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };


  const filter = () => {
    setFilterOpen(true);
  }


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  const propertyNames: string[] = data.length > 0 ? Object.keys(data[0]) : [];
  const orderedColumns: string[] = propertyNames.reverse();

  const replaceEmptyOrNull = (value: string | number | null) => {
    return value === null || value === "" ? "N/A" : value;
  };
  
  const totalPages = Math.ceil(dbCount / itemsPerPage );

  const currentPageData = data.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === data.length;
  const fetchFunction = (req: any) => {
    // dispatch(fetchPaySchedule(req));
   };
console.log(dbCount, "db")
 
  return (
    <div className="comm">
      <Breadcrumb head="" linkPara="Database Manager" route={""} linkparaSecond="Data" />
      <div className="commissionContainer">
        <DataTableHeaderr
          title={selectedTable.value}
          onPressFilter={() => filter()}
          onPressImport={() => { }}
          showImportIcon={false}
          showSelectIcon={true}
          showFilterIcon={false}
          selectMarginLeft="-10px"
          selectMarginLeft1="-20px"
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
        />
             {/* {filterOPen && <FilterModal handleClose={filterClose}  
               columns={DataTableColumn} 
               fetchFunction={fetchFunction}
               page_number = {currentPage}
               page_size = {itemsPerPage}
             />} */}
             <div className="TableContainer" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                 
                {orderedColumns.map((columnName, index) => (
                  <th key={index}>{columnName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                    <td>{startIndex + rowIndex + 1}</td>
                  
                    {orderedColumns.map((columnName, colIndex) => (
                      <td key={colIndex}>{replaceEmptyOrNull(item[columnName])}</td>
                    ))}
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="page-heading-container">
      
      <p className="page-heading">
       {start} - {end} of {dbCount} item
      </p>
 
   {
    data?.length > 0 ? <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              currentPageData={currentPageData}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
perPage={itemsPerPage}
            />  : null
  }
        </div>
      </div>
    </div>
  );
};

export default DataTablle;