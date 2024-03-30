import React, { useEffect, useState } from "react";

import { RiDeleteBin5Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { IoAddSharp } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
import { fetchDealerTier } from "../../../../redux/apiSlice/configSlice/dealerTierSlice";
import CreateDealerTier from "./CreateDealerTier";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleAllRows,
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
const DealerTier = () => {
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dealerTierList = useAppSelector(
    (state) => state.dealerTier.dealers_tier_list
  );
  const loading = useAppSelector((state) => state.dealerTier.loading);
  const error = useAppSelector((state) => state.dealerTier.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 2,
    };
    dispatch(fetchDealerTier(pageNumber));
  }, [dispatch]);
  console.log(dealerTierList);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!dealerTierList === null || dealerTierList.length === 0) {
    return <div>Data not found</div>;
  }
  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === dealerTierList.length;
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Dealer Tier"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => {}}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleOpen()}
        />
        {open && <CreateDealerTier handleClose={handleClose} />}
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
                          dealerTierList,
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
                    <p>Dealer Name</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Tier</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
              {dealerTierList?.length > 0
                ? dealerTierList?.map((el, i) => (
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
                        {el.dealer_name}
                      </td>
                      <td>{el.tier}</td>
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

export default DealerTier;
