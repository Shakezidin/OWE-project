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


  const [editedPaySchedule, setEditedPaySchedule] =
    useState<PayScheduleModel | null>(null);
  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 10,
    };
    dispatch(fetchPaySchedule(pageNumber));
  }, [dispatch]);
  // Extract column names
  const columns: Column[] = [
    // { name: "record_id", displayName: "Record ID", type: "number" },

    { name: "partner", displayName: "Partner", type: "string" },
    { name: "partner_name", displayName: "Partner Name", type: "string" },
    { name: "installer_name", displayName: "Installer Name", type: "string" },
    { name: "sale_type", displayName: "Partner", type: "string" },
    { name: "state", displayName: "State", type: "string" },
    { name: "rl", displayName: "Rate List", type: "string" },
    { name: "draw", displayName: "Draw", type: "string" },
    { name: "draw_max", displayName: "Draw Max", type: "string" },
    { name: "rep_draw", displayName: "rep_draw", type: "string" },
    { name: "rep_draw_max", displayName: "rep_draw_max", type: "string" },
    { name: "rep_pay", displayName: "rep_pay", type: "string" },
    { name: "start_date", displayName: "Start Date", type: "date" },
    { name: "end_date", displayName: "End Date", type: "date" }
  ];
  const filter = () => {
    setFilterOpen(true);
  
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
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === payScheduleList.length;
  return (
    <div className="comm">
         <Breadcrumb head="Commission" linkPara="Configure" linkparaSecond="Payment Scheduler"/>
      <div className="commissionContainer">
        <TableHeader
          title="Payment Scheduler"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleAddPaySchedule()}
        />
        {filterOPen && (
          <FilterPayment
            handleClose={filterClose}
            columns={columns}
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
                <th>
                  <div className="table-header">
                    <p>Partner Name</p>{" "}
                    <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Partner</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Installer</p>{" "}
                    <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sale Type</p>{" "}
                    <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>ST</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rate List</p>{" "}
                    <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Draw %</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Draw Max</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep Draw %</p>{" "}
                    <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep Max Draw %</p>{" "}
                    <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep Pay</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Date</p>{" "}
                    <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Date</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Action</p> <FaArrowDown style={{color:"#667085" , fontSize:"12px"}} />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {payScheduleList?.length > 0
                ? payScheduleList?.map((el: any, i: any) => (
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
                        style={{
                          display: "flex",
                          gap: "1rem",
                          alignItems: "center",
                        }}
                      >
                        <img src={ICONS.ARCHIVE} alt="" />
                        <div
                          className=""
                          style={{ cursor: "pointer" }}
                          onClick={() => handleEditPaySchedule(el)}
                        >
                              <img src={ICONS.editIcon} alt="" />
                        </div>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentSchedule;
