import React, { useEffect, useState } from "react";

import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../redux/apiSlice/hooks";
import { fetchTimeLineSla } from "../../../../redux/apiSlice/timeLineSlice";
import CreateTimeLine from "./CreateTimeLine";
import CheckBox from "../../../components/chekbox/CheckBox";
import { toggleAllRows, toggleRowSelection } from "../../../components/chekbox/checkHelper";
const TimeLine = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();
  const timelinesla_list = useAppSelector((state) => state.timelineSla.timelinesla_list);
  const loading = useAppSelector((state) => state.timelineSla.loading);
  const error = useAppSelector((state) => state.timelineSla.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 2,
    };
    dispatch(fetchTimeLineSla(pageNumber));
  }, [dispatch]);

  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === timelinesla_list.length;
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!timelinesla_list === null || timelinesla_list.length === 0) {
    return <div>Data not found</div>;
  }
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader

          title="Time Line SLA"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => {}}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() =>handleOpen()}

        />
        {
          open && (<CreateTimeLine handleClose={handleClose} />)
        }
        <div className="TableContainer">
          <table>
            <thead>
              {/* indeterminate={selectedRows.size > 0 && selectedRows.size < timelinesla_list.length} */}
              <tr>
                <th>
                  <div>
                    <CheckBox
                      checked={selectAllChecked}
                      onChange={()=>toggleAllRows(selectedRows,timelinesla_list,setSelectedRows,setSelectAllChecked)}
                      indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>TYPE / M2M</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Days</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
              {timelinesla_list?.length > 0 ? timelinesla_list?.map((el, i) => (
                <tr key={i} className={selectedRows.has(i) ? 'selected' : ''}>
                  <td>
                    <CheckBox
                      checked={selectedRows.has(i)}
                      onChange={() => toggleRowSelection(i,selectedRows,setSelectedRows,setSelectAllChecked)}
                    />
                  </td>
                  <td style={{ fontWeight: "500", color: "black" }}>
                    {el.type_m2m}
                  </td>
                  <td>{el.state}</td>
                  <td>{el.days}</td>
                  <td>{el.start_date}</td>
                  <td>{el.end_date}</td>
                  <td style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <img src={ICONS.ARCHIVE} alt="" />
                    <CiEdit style={{ fontSize: "1.5rem", color: "#344054" }} />
                  </td>
                </tr>
              )) : null
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimeLine;
