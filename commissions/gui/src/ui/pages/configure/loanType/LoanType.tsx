import React, { useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../configure.css";
import { CiEdit } from "react-icons/ci";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/apiSlice/hooks";
import { fetchLoanType } from "../../../../redux/apiSlice/loanTypeSlice";
import CreateLoanType from "./CreateLoanType";

const LoanType = () => {
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const loanTypeList = useAppSelector((state) => state?.loanType?.loantype_list);
  const loading = useAppSelector((state) => state.loanType.loading);
  const error = useAppSelector((state) => state.loanType.error);

  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 2,
    };
    dispatch(fetchLoanType(pageNumber));
  }, []);
 
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="comm">
      {
        loanTypeList?.length>0 ?
      <div className="commissionContainer">
        <TableHeader
          title="Loan Type"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => {}}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleOpen()}
        />
        {
          open && (<CreateLoanType handleClose={handleClose}/>)
        }
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
                    <p>Product Code</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    <p>Active</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    <p>Adder</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Description</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
            {loanTypeList?.length > 0
                ? loanTypeList?.map(
                    (el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "500", color: "black" }}>{el.product_code}</td>
                  <td>
                    <input value={el.active} type="checkbox"  className="check-box" />
                  </td>
                  <td>
                   <input type="text" defaultValue={el.adder} name="" id="" className="adder-input" />
                  </td>
                  <td>{el.description}</td>
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

export default LoanType;
