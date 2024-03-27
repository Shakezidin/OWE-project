import React, { useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../configure.css";
import { CiEdit } from "react-icons/ci";
import CreateDealer from "./CreateDealer";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/apiSlice/hooks";

import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { fetchDealer } from "../../../../redux/apiSlice/dealerSlice";

const DealerOverRides: React.FC = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();
  const dealerList = useAppSelector((state) => state.dealer.Dealers_list);
  const loading = useAppSelector((state) => state.dealer.loading);
  const error = useAppSelector((state) => state.dealer.error);

  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 2,
    };
    dispatch(fetchDealer(pageNumber));
  }, []);
  console.log(dealerList);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="comm">
      {
        dealerList?.length > 0? <div className="commissionContainer">
        <TableHeader
          title="Dealer OverRides"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => {}}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleOpen()}
        />
        {open && <CreateDealer handleClose={handleClose} />}
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
                    <p>Sub Dealer</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Dealer</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Pay Rate</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
              {dealerList?.length > 0
                ? dealerList?.map((el, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          value="test"
                          type="checkbox"
                          className="check-box"
                        />
                      </td>
                      <td style={{ fontWeight: "500", color: "black" }}>
                        {el.sub_dealer}
                      </td>
                      <td>{el.dealer}</td>
                      <td>{el.pay_rate}</td>
                      <td>{el.start_date}</td>
                      <td>{el.end_date}</td>

                      {/* <td>{el.endDate}</td> */}
                      <td>
                        <div className="action-icon">
                          <div className="" style={{ cursor: "pointer" }}>
                          <img src={ICONS.ARCHIVE} alt="" />
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
      </div>:<div>No Data Found</div>
      }
     
    </div>
  );
};

export default DealerOverRides;
