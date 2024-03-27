import React, { useEffect } from "react";
import "../configure.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";

import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/apiSlice/hooks";
import { fetchPaySchedule } from "../../../../redux/apiSlice/payScheduleSlice";
import CreatePaymentSchedule from "./CreatePaymentSchedule";

const PaymentSchedule = () => {
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const payScheduleList = useAppSelector((state) => state.paySchedule.payment_schedule_list);
  const loading = useAppSelector((state) => state.paySchedule.loading);
  const error = useAppSelector((state) => state.paySchedule.error);

  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 2,
    };
    dispatch(fetchPaySchedule(pageNumber));
  }, []);
  console.log(payScheduleList);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="comm">
     { payScheduleList?.length > 0?
      <div className="commissionContainer">
        <TableHeader
          title="Marketing Fees"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => {}}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleOpen()}
        />
{open && (<CreatePaymentSchedule handleClose={handleClose}/>)}
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
                <th>
                  <div>
                    <input value="test" type="checkbox" className="check-box" />
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
                ? payScheduleList?.map(
                    (el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
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
                  <td style={{ display: "flex", gap: "1rem",alignItems:"center" }}>
                  <img src={ICONS.ARCHIVE} alt="" />
                    <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
                  </td>

                </tr>
              )):null
            }
            </tbody>
          </table>
        </div>
      </div>:<div>No Data Found</div>
}
    </div>
  );
};

export default PaymentSchedule;
