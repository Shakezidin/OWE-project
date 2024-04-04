import React, { useEffect, useState } from "react";
import "../configure.css";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import { ICONS } from "../../../icons/Icons";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { fetchmarketingFees } from "../../../../redux/apiSlice/configSlice/config_get_slice/marketingSlice";
import { CiEdit } from "react-icons/ci";
import CreateMarketingFees from "./CreateMarketingFees";
import CheckBox from "../../../components/chekbox/CheckBox";
import {
  toggleAllRows,
  toggleRowSelection,
} from "../../../components/chekbox/checkHelper";
import FilterMarketing from "./FilterMarketing";
import { MarketingFeeModel } from "../../../../core/models/configuration/create/MarketingFeeModel";
import { FaArrowDown } from "react-icons/fa6";

const MarketingFees: React.FC = () => {
  const dispatch = useAppDispatch();
  // const getData = useAppSelector(state=>state.comm.data)
  const [open, setOpen] = React.useState<boolean>(false);
  const [filterOPen, setFilterOpen] = React.useState<boolean>(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filter = () => setFilterOpen(true);
  const filterClose = () => setFilterOpen(false);
  const marketingFeesList = useAppSelector(
    (state) => state.marketing.marketing_fees_list
  );
  const loading = useAppSelector((state) => state.marketing.loading);
  const error = useAppSelector((state) => state.marketing.error);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [editMode, setEditMode] = useState(false);
  const [editedMarketing, setEditedMarketing] = useState<MarketingFeeModel | null>(null);
  useEffect(() => {
    const pageNumber = {
      page_number: 1,
      page_size: 10,
    };
    dispatch(fetchmarketingFees(pageNumber));
  }, [dispatch]);

  const handleAddMarketing = () => {
    setEditMode(false);
    setEditedMarketing(null);
    handleOpen()
  };

  const handleEditMarketing = (marketingData: MarketingFeeModel) => {
    setEditMode(true);
    setEditedMarketing(marketingData);
    handleOpen()
  };

  const isAnyRowSelected = selectedRows.size > 0;
  const isAllRowsSelected = selectedRows.size === marketingFeesList?.length;
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!marketingFeesList === null || marketingFeesList?.length === 0) {
    return <div>Data not found</div>;
  }
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="Marketing Fees"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => filter()}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => handleAddMarketing()}
        />
        {filterOPen && <FilterMarketing handleClose={filterClose} />}
        {open && <CreateMarketingFees marketingData={editedMarketing}
                         editMode={editMode}
                         handleClose={handleClose} />}
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
                          marketingFeesList,
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
                    <p>Source</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>DBA</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Fee Rate</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Chg Dlr</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Pay Soucre</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Note</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Start Dt.</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>End Dt.</p> <FaArrowDown style={{color:"#667085"}}/>
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Action</p>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {marketingFeesList?.length > 0
                ? marketingFeesList?.map((el, i) => (
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
                        {el.source}
                      </td>
                      <td>{el.dba}</td>
                      <td>{el.state}</td>
                      <td>{el.fee_rate}</td>
                      <td>
                        {el.chg_dlr}
                        {/* <div className="">
                      <img src={img} alt="" />
                    </div> */}
                      </td>
                      <td>{el.pay_src}</td>
                      <td>{el.description}</td>
                      <td>{el.start_date}</td>
                      <td>{el.end_date} </td>
                      <td
                        style={{
                          display: "flex",
                          gap: "1rem",
                          alignItems: "center",
                        }}
                      >
                        <img src={ICONS.ARCHIVE} alt="" />
                      <div className="" style={{cursor:"pointer"}} onClick={()=>handleEditMarketing(el)}>
                      <CiEdit
                          style={{ fontSize: "1.5rem", color: "#344054" }}
                        />
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

export default MarketingFees;
