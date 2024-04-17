import React, { useEffect, useState } from "react";
import "../configure.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";

import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { fetchPaySchedule } from "../../../../redux/apiSlice/configSlice/config_get_slice/payScheduleSlice";
import CreatePaymentSchedule from "./CreatePaymentSchedule";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleAllRows,
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import FilterPayment from "./FilterPayment";
import { FaArrowDown } from "react-icons/fa6";
import { PayScheduleModel } from "../../../../core/models/configuration/create/PayScheduleModel";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import { Column } from "../../../../core/models/data_models/FilterSelectModel";
import Pagination from "../../../components/pagination/Pagination";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
import { PayScheduleColumns } from "../../../../resources/static_data/configureHeaderData/PayScheduleColumn";
import SortableHeader from "../../../components/tableHeader/SortableHeader";

const PaymentSchedule = () => {
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filterClose = () => setFilterOpen(false);
  const payScheduleList = useAppSelector(
    (state) => state.paySchedule.payment_schedule_list
  );
  const loading = useAppSelector((state) => state.paySchedule.loading);
  const error = useAppSelector((state) => state.paySchedule.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [sortKey, setSortKey] =  useState("");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;
  const currentPage = useAppSelector((state) => state.paginationType.currentPage);
  const [editedPaySchedule, setEditedPaySchedule] =
    useState<PayScheduleModel | null>(null);
  useEffect(() => {
    const pageNumber = {
      page_number: currentPage,
      page_size: itemsPerPage,
    };
    dispatch(fetchPaySchedule(pageNumber));
  }, [dispatch,currentPage]);
  // Extract column names

  const filter = () => {
    setFilterOpen(true);
  
  };
  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };


  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };

  const handleAddPaySchedule = () => {
    setEditMode(false);
    setEditedPaySchedule(null);
    handleOpen();
  };

  const handleEditPaySchedule = (payEditedData: PayScheduleModel) => {
    setEditMode(true);
    setEditedPaySchedule(payEditedData);
    handleOpen();
  };
  const totalPages = Math.ceil(payScheduleList?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = payScheduleList?.slice(startIndex, endIndex);
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === payScheduleList.length;
  const handleSort = (key:any) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  if (sortKey) {
    currentPageData.sort((a:any, b:any) => {
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
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
 
  return (
    <div className="comm">
         <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Payment Scheduler"/>
      <div className="commissionContainer">
        <TableHeader
          title="Payment Scheduler"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          checked={selectAllChecked}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleAddPaySchedule()}
        />
        {filterOPen && (
          <FilterPayment
            handleClose={filterClose}
            columns={PayScheduleColumns}
            page_number={1}
            page_size={5}
          />
        )}
        {open && (
          <CreatePaymentSchedule
            editMode={editMode}
            payEditedData={editedPaySchedule}
            handleClose={handleClose}
          />
        )}
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
                <th>
                  <div>
                    <CheckBox
                      checked={selectAllChecked}
                      onChange={() =>
                        toggleAllRows(
                          selectedRows,
                          payScheduleList,
                          setSelectedRows,
                          setSelectAllChecked
                        )
                      }
                      indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    />
                  </div>
                </th>
                {
                PayScheduleColumns?.map((item,key)=>(
                  <SortableHeader
                  key={key}
                  titleName={item.displayName}
                  sortKey={item.name}
                  sortDirection={sortKey === item.name ? sortDirection : undefined}
                  onClick={()=>handleSort(item.name)}
                  />
                ))
              }
                <th>
                  <div className="action-header">
                    <p>Action</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPageData?.length > 0
                ? currentPageData?.map((el: any, i: any) => (
                    <tr key={i}>
                      <td>
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
                      </td>
                      <td style={{ fontWeight: "600" }}>{el.partner_name}</td>
                      <td>{el.partner}</td>
                      <td>{el.installer_name}</td>
                      <td>{el.sale_type}</td>
                      <td>{el.state}</td>
                      <td>{el.rl}</td>
                      <td>{el.draw}</td>
                      <td>{el.draw_max}</td>
                      <td>{el.rep_draw}</td>
                      <td>{el.rep_draw_max}</td>
                      <td>{el.rep_pay}</td>
                      <td>{el.start_date}</td>
                      <td>{el.end_date}</td>
                      <td
                      
                      >
                      <div className="action-icon">
                    <div className="">
                    <img src={ICONS.ARCHIVE} alt="" />
                    </div>
                        <div
                          className=""
                          style={{ cursor: "pointer" }}
                          onClick={() => handleEditPaySchedule(el)}
                        >
                              <img src={ICONS.editIcon} alt="" />
                        </div>
                      </div>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
        <div className="page-heading-container">
      <p className="page-heading">
       {currentPage} - {totalPages} of {payScheduleList?.length} item
      </p>
 
   {
    payScheduleList?.length > 0 ? <Pagination
      currentPage={currentPage}
      totalPages={totalPages} // You need to calculate total pages
      paginate={paginate}
      goToNextPage={goToNextPage}
      goToPrevPage={goToPrevPage}
    /> : null
  }
   </div>
      </div>
    </div>
  );
};

export default PaymentSchedule;
