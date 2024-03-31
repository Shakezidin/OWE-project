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

const PaymentSchedule = () => {
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filter = () => setFilterOpen(true);
  const filterClose = () => setFilterOpen(false);
  const payScheduleList = useAppSelector(
    (state) => state.paySchedule.payment_schedule_list
  );
  const loading = useAppSelector((state) => state.paySchedule.loading);
  const error = useAppSelector((state) => state.paySchedule.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 10,
    };
    dispatch(fetchPaySchedule(pageNumber));
  }, [dispatch]);
  console.log(payScheduleList);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!payScheduleList === null || payScheduleList.length === 0) {
    return <div>Data not found</div>;
  }
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === payScheduleList.length;
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Payment Scheduler"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleOpen()}
        />
        {filterOPen && <FilterPayment handleClose={filterClose} />}
        {open && <CreatePaymentSchedule handleClose={handleClose} />}
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
                    <p>Partner Name</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Partner</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Installer</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sale Type</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>ST</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rate List</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Draw %</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Draw Max</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep Draw %</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep Max Draw %</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep Pay</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Date</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Date</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Action</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {payScheduleList?.length > 0
                ? payScheduleList?.map((el, i) => (
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
                        <CiEdit
                          style={{ fontSize: "1.5rem", color: "#344054" }}
                        />
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
