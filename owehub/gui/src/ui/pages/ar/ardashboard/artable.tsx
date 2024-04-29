import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchCommissions } from "../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { CommissionModel } from "../../../../core/models/configuration/create/CommissionModel";
import SortableHeader from "../../../components/tableHeader/SortableHeader";
import  "../../configure/configure.css";
import HelpDashboard from "../../dashboard/HelpDashboard";
import { BiSupport } from "react-icons/bi";


const ArDashBoardTable = () => {


  const [openIcon, setOpenIcon] = useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);
  const [exportOPen, setExportOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleExportOpen = () => setExportOpen(!exportOPen)
  const filterClose = () => setFilterOpen(false);
  const dispatch = useAppDispatch();
  const commissionList = useAppSelector((state) => state.comm.commissionsList);
  // const loading = useAppSelector((state) => state.comm.loading);
  const error = useAppSelector((state) => state.comm.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedCommission, setEditedCommission] = useState<CommissionModel | null>(null);
  const itemsPerPage = 10;
  const [viewArchived, setViewArchived] = useState<boolean>(false);
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
      archived: viewArchived ? true : undefined,
    };
    dispatch(fetchCommissions(pageNumber));

  }, [dispatch, currentPage, itemsPerPage, viewArchived]);

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
    setFilterOpen(true)
  }

  const totalPages = Math.ceil(commissionList?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const handleAddCommission = () => {
    setEditMode(false);
    setEditedCommission(null);
    handleOpen()
  };

  const currentPageData = commissionList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows?.size > 0;
  const isAllRowsSelected = selectedRows?.size === commissionList?.length;


  const handleSort = (key: any) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  if (sortKey) {
    currentPageData.sort((a: any, b: any) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        // Ensure numeric values for arithmetic operations
        const numericAValue = typeof aValue === 'number' ? aValue : parseFloat(aValue);
        const numericBValue = typeof bValue === 'number' ? bValue : parseFloat(bValue);
        return sortDirection === 'asc' ? numericAValue - numericBValue : numericBValue - numericAValue;
      }
    });
  }
  if (error) {
    return <div>{error}</div>;
  }
  // if (loading) {
  //   return <div>Loading... {loading}</div>;
  // }

  const Commissioncolumns = [
    { name: 'partner', displayName: 'Unique ID', type: 'string', isCheckbox: true },
    { name: 'installer', displayName: 'Home Owner', type: 'string', isCheckbox: false },
    { name: 'state', displayName: 'Current Status', type: 'string', isCheckbox: false },
    { name: 'sale_type', displayName: 'Status Date', type: 'string', isCheckbox: false },
    { name: 'sale_price', displayName: 'Owe Contractor', type: 'number', isCheckbox: false },
    { name: 'rep_type', displayName: 'DBA', type: 'string', isCheckbox: false },
    { name: 'rl', displayName: 'Commission Model', type: 'number', isCheckbox: false },
    { name: 'rate', displayName: 'Percentage', type: 'number', isCheckbox: false },
    { name: 'start_date', displayName: 'Type', type: 'date', isCheckbox: false },
    { name: 'end_date', displayName: 'Today', type: 'date', isCheckbox: false },

    { name: 'installer', displayName: 'Amount', type: 'string', isCheckbox: false },
    { name: 'state', displayName: 'Finance Type', type: 'string', isCheckbox: false },
    { name: 'sale_type', displayName: 'Sys Size', type: 'string', isCheckbox: false },
    { name: 'sale_price', displayName: 'Contract', type: 'number', isCheckbox: false },
    { name: 'rep_type', displayName: 'Loan Fee', type: 'string', isCheckbox: false },
    { name: 'rl', displayName: 'EPC', type: 'number', isCheckbox: false },
    { name: 'rate', displayName: 'Address', type: 'number', isCheckbox: false },
    { name: 'start_date', displayName: 'R+R', type: 'date', isCheckbox: false },
    { name: 'end_date', displayName: 'Comm Rate', type: 'date', isCheckbox: false },

    { name: 'installer', displayName: 'Net EPC', type: 'string', isCheckbox: false },
    { name: 'state', displayName: 'Credit', type: 'string', isCheckbox: false },
    { name: 'sale_type', displayName: 'Rep 2', type: 'string', isCheckbox: false },
    { name: 'sale_price', displayName: 'Net Comm', type: 'number', isCheckbox: false },
    { name: 'rep_type', displayName: 'Draw AMT', type: 'string', isCheckbox: false },
    { name: 'rl', displayName: 'Amt Paid', type: 'number', isCheckbox: false },
    { name: 'rate', displayName: 'Balance', type: 'number', isCheckbox: false },
    { name: 'start_date', displayName: 'Dealer Code', type: 'date', isCheckbox: false },
    { name: 'end_date', displayName: 'Contract date', type: 'date', isCheckbox: false },

    { name: 'start_date', displayName: 'State', type: 'date', isCheckbox: false },
    { name: 'end_date', displayName: 'Sub Total', type: 'date', isCheckbox: false },
  ];

  const handleIconOpen = () => setOpenIcon(true);
  const handleIconClose = () => setOpenIcon(false);
  


  return (
    <div className="comm">
      <div className="commissionContainer">
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
                {
                  Commissioncolumns?.map((item, key) => (
                    <SortableHeader
                      key={key}
                      isCheckbox={item.isCheckbox}
                      titleName={item.displayName}
                      data={commissionList}
                      isAllRowsSelected={isAllRowsSelected}
                      isAnyRowSelected={isAnyRowSelected}
                      selectAllChecked={selectAllChecked}
                      setSelectAllChecked={setSelectAllChecked}
                      selectedRows={selectedRows}
                      setSelectedRows={setSelectedRows}
                      sortKey={item.name}
                      sortDirection={sortKey === item.name ? sortDirection : undefined}
                      onClick={() => handleSort(item.name)}
                    />

                  ))
                }
             {
              viewArchived===true?null:   <th>
              <div className="action-header">
                <p>Help</p>
              </div>
            </th>
             }
              </tr>
            </thead>

            <tbody>
              {currentPageData?.length > 0
                ? currentPageData?.map((el: any, i: any) => (
                  <tr
                    key={i}
                    className={selectedRows.has(i) ? "selected" : ""}
                  >
                    <td style={{ fontWeight: "500", color: "black" }}>
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
                    
                    <td style={{ color: 'blue' }}>${el.rl}</td>
                    <td>{el.state}</td>
                    <td>{el.sale_type}</td>
                    <td>{el.sale_price}</td>
                    <td>{el.rep_type}</td>
                    <td>{el.rl}</td>
                    <td>{el.rate}</td>
                    <td>{el.start_date}</td>
                    <td>{el.end_date}</td>

                    <td>{el.installer}</td>
                    <td>{el.state}</td>
                    <td>{el.sale_type}</td>
                    <td>{el.sale_price}</td>
                    <td>{el.rep_type}</td>
                    <td>{el.rl}</td>
                    <td>{el.rate}</td>
                    <td>{el.start_date}</td>
                    <td>{el.end_date}</td>

                    <td>{el.start_date}</td>
                    <td>{el.end_date}</td>
                    <td style={{height: "14px", width: "14px",stroke:"0.2",cursor:"pointer"}}>
                        <BiSupport
                              onClick={() => handleIconOpen()}
                            />
                      </td>
                  </tr>
                ))
                : null}
            </tbody>
          </table>
        </div>


        <div className="page-heading-container">
          <p className="page-heading">
            {currentPage} - {totalPages} of {currentPageData?.length} item
          </p>

          {
            commissionList?.length > 0 ? <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              currentPageData={currentPageData}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
            /> : null
          }
          {openIcon && (
          <HelpDashboard
            commission={editedCommission}
            editMode={editMode}
            handleClose={handleIconClose}
          />
        )}
        </div>

      </div>
    </div>
  );
};

export default ArDashBoardTable;
