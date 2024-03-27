import React, { useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../configure.css";
import { CiEdit } from "react-icons/ci";

import { ICONS } from "../../../icons/Icons";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/apiSlice/hooks";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { fetchSalesType } from "../../../../redux/apiSlice/salesSlice";
import CreateSaleType from "./CreateSaleType";

const SaleType = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();
  const salesTypeList = useAppSelector((state) => state.salesType.saletype_list);
  const loading = useAppSelector((state) => state.salesType.loading);
  const error = useAppSelector((state) => state.salesType.error);

  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 2,
    };
    dispatch(fetchSalesType(pageNumber));
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="comm">

      {
        salesTypeList?.length>0 ?  <div className="commissionContainer">
        <TableHeader
          title="Sale Types"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => {}}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleClose()}
        />
        {open && (<CreateSaleType handleClose={handleClose}/>)}
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
                    <p> Name</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
              { salesTypeList?.length> 0 ? salesTypeList?.map((el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "500", color: "black" }}>{el.type_name}</td>

                  <td>{el.type_name}</td>

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

export default SaleType;
