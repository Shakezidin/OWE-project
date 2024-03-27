import React, { useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import "../configure.css";
import { IoAddSharp } from "react-icons/io5";

import { RiDeleteBin5Line } from "react-icons/ri";
import CreateCommissionRate from "./CreateCommissionRate";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/features/hooks";
import { getCommission } from "../../../../redux/features/commissionSlice";
import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";

const CommissionRate: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)

  const commissionList = useAppSelector((state) => state.comm.data);
  const loading = useAppSelector((state) => state.comm.loading);
  const error = useAppSelector((state) => state.comm.error);

  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 2,
    };
    dispatch(getCommission(pageNumber));
  }, []);
  console.log(commissionList);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Commisstion Rate"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => {}}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleOpen()}
        />
        {open && <CreateCommissionRate handleClose={handleClose} />}
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
                    <p>State</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sales Type</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sales Price</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rep.Type</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rate List</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Rate</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Dt.</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Dt.</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
              {commissionList?.commissions_list?.length > 0
                ? commissionList?.commissions_list?.map((el: any, i: any) => (
                    <tr key={i}>
                      <td>
                        <input
                          value="test"
                          type="checkbox"
                          className="check-box"
                        />
                      </td>
                      <td style={{ fontWeight: "500", color: "black" }}>
                        {el.partner}
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
                        <div className="action-icon">
                          <div className="" style={{ cursor: "pointer" }}>
                            <RiDeleteBin5Line
                              style={{ fontSize: "1.5rem", color: "#344054" }}
                            />
                          </div>
                          <div className="" style={{ cursor: "pointer" }}>
                            <CiEdit
                              style={{ fontSize: "1.5rem", color: "#344054" }}
                            />
                          </div>
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

export default CommissionRate;
