import React, { useEffect, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../configure.css";

import { IoAddSharp } from "react-icons/io5";
import CreateDealer from "../dealerOverrides/CreateDealer";
import { CiEdit } from "react-icons/ci";
import { fetchAdderV } from "../../../../redux/apiSlice/configSlice/config_get_slice/adderVSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";
import CreateAdder from "./CreateAdder";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleAllRows,
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import FilterAdder from "./FilterAdder";
import { FaArrowDown } from "react-icons/fa6";

const AdderValidation = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filter = () => setFilterOpen(true);
  const filterClose = () => setFilterOpen(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)

  const adderVList = useAppSelector((state) => state.adderV.VAdders_list);
  const loading = useAppSelector((state) => state.adderV.loading);
  const error = useAppSelector((state) => state.adderV.error);

  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 10,
    };
    dispatch(fetchAdderV(pageNumber));
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!adderVList === null || adderVList.length === 0) {
    return <div>Data not found</div>;
  }
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === adderVList.length;
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Adder validation"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleOpen()}
        />
        {filterOPen && <FilterAdder handleClose={filterClose}/>}
        {open && <CreateAdder handleClose={handleClose} />}
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
                          adderVList,
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
                    <p>Adder Name</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Adder Type</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Price Type</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Price Amount</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Details</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Created On</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Action</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {adderVList?.length > 0
                ? adderVList?.map((el, i) => (
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
                      <td style={{ fontWeight: "500", color: "black" }}>
                        {el.adder_name}
                      </td>
                      <td>{el.adder_type}</td>
                      <td>{el.price_type}</td>
                      <td>{el.price_amount}</td>
                      <td>{el.description}</td>
                      <td>{el.active}</td>

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
      </div>
    </div>
  );
};

export default AdderValidation;
