import React, { useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../configure.css";

import { IoAddSharp } from "react-icons/io5";
import CreateDealer from "../dealerOverrides/CreateDealer";
import { CiEdit } from "react-icons/ci";
import { getAdderV } from "../../../../redux/features/adderVSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/features/hooks";
import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";
const AdderValidation = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)

  const adderVList = useAppSelector((state) => state.adderV.data);
  const loading = useAppSelector((state) => state.adderV.loading);
  const error = useAppSelector((state) => state.adderV.error);

  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 2,
    };
    dispatch(getAdderV(pageNumber));
  }, []);
  console.log(adderVList);
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
          title="Adder validation"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => {}}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => {}}
        />
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
                    <p>Adder Name</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Adder Type</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Price Type</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Price Amount</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Details</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Created On</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
              {adderVList?.VAdders_list?.length > 0
                ? adderVList?.VAdders_list?.map((el: any, i: any) => (
                    <tr key={i}>
                      <td>
                        <input
                          value="test"
                          type="checkbox"
                          className="check-box"
                        />
                      </td>
                      <td style={{ fontWeight: "500", color: "black" }}>
                        {el.adder_name}
                      </td>
                      <td>{el.adder_type}</td>
                      <td>{el.price_type}</td>
                      <td>{el.price_amount}</td>
                      <td>{el.description}</td>
                      <td>{el.create}</td>

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

export default AdderValidation;
