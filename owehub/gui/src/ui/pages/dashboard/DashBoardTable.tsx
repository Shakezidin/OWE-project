import React, { useState } from "react";
import "../userManagement/user.css";
import "../configure/configure.css";
import { FaArrowDown } from "react-icons/fa6";
import CheckBox from "../../components/chekbox/CheckBox";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setCurrentPage } from "../../../redux/apiSlice/paginationslice/paginationSlice";
import HelpDashboard from "./HelpDashboard";
import { CommissionModel } from "../../../core/models/configuration/create/CommissionModel";
import ProjectBreakdown from "./ProjectBreakdown";
import { BiSupport } from "react-icons/bi";
import Pagination from "../../components/pagination/Pagination";

// import { installers, partners, respTypeData, statData } from "../../../../../core/models/data_models/SelectDataModel";

const DashBoardTable: React.FC = () => {
  const [editedCommission, setEditedCommission] =
    useState<CommissionModel | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const [openIcon, setOpenIcon] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);

  const handleIconOpen = () => setOpenIcon(true);
  const handleIconClose = () => setOpenIcon(false);
  const handleClose = () => setOpen(false);
  const [editMode, setEditMode] = useState(false);

  const dataUser = [
    {
      pi: "1234567890",
      dn: "Josh Morton",
      sr: "Josh Morton",
      cn: "josh Morton",
      cm: "Percentage",
      pg: "80/20",
      amt: "$123,456",
      pipeline: "$100,362",
      cd: "$300,652",
      ps: "Active",
      state: "Texas",
      sysSize: "10.5",
      type: "loan",
      adder: "$62,500",
      ajh: "12 Days",
      rl: "$20.00",
      epc: "2.444",
    },
    {
      pi: "1234567890",
      dn: "Josh Morton",
      sr: "Josh Morton",
      cn: "josh Morton",
      cm: "RL",
      pg: "-",
      amt: "$123,456",
      pipeline: "$100,362",
      cd: "$300,652",
      ps: "Active",
      state: "Texas",
      sysSize: "10.5",
      type: "loan",
      adder: "$62,500",
      ajh: "12 Days",
      rl: "$20.00",
      epc: "2.444",
    },
    {
      pi: "1234567890",
      dn: "Josh Morton",
      sr: "Josh Morton",
      cn: "josh Morton",
      cm: "Percentage",
      pg: "70/30",
      amt: "$123,456",
      pipeline: "$100,362",
      cd: "$300,652",
      ps: "Active",
      state: "Texas",
      sysSize: "10.5",
      type: "loan",
      adder: "$62,500",
      ajh: "12 Days",
      rl: "$20.00",
      epc: "2.444",
    },
    {
      pi: "1234567890",
      dn: "Josh Morton",
      sr: "Josh Morton",
      cn: "josh Morton",
      cm: "RL",
      pg: "-",
      amt: "$123,456",
      pipeline: "$100,362",
      cd: "$300,652",
      ps: "Active",
      state: "Texas",
      sysSize: "10.5",
      type: "loan",
      adder: "$62,500",
      ajh: "12 Days",
      rl: "$20.00",
      epc: "2.444",
    },
    {
      pi: "1234567890",
      dn: "Josh Morton",
      sr: "Josh Morton",
      cn: "josh Morton",
      cm: "Percentage",
      pg: "80/20",
      amt: "$123,456",
      pipeline: "$100,362",
      cd: "$300,652",
      ps: "Active",
      state: "Texas",
      sysSize: "10.5",
      type: "loan",
      adder: "$62,500",
      ajh: "12 Days",
      rl: "$20.00",
      epc: "2.444",
    },
    {
      pi: "1234567890",
      dn: "Josh Morton",
      sr: "Josh Morton",
      cn: "josh Morton",
      cm: "RL",
      pg: "-",
      amt: "$123,456",
      pipeline: "$100,362",
      cd: "$300,652",
      ps: "Active",
      state: "Texas",
      sysSize: "10.5",
      type: "loan",
      adder: "$62,500",
      ajh: "12 Days",
      rl: "$20.00",
      epc: "2.444",
    },
    {
      pi: "1234567890",
      dn: "Josh Morton",
      sr: "Josh Morton",
      cn: "josh Morton",
      cm: "Percentage",
      pg: "70/30",
      amt: "$123,456",
      pipeline: "$100,362",
      cd: "$300,652",
      ps: "Active",
      state: "Texas",
      sysSize: "10.5",
      type: "loan",
      adder: "$62,500",
      ajh: "12 Days",
      rl: "$20.00",
      epc: "2.444",
    },
    {
      pi: "1234567890",
      dn: "Josh Morton",
      sr: "Josh Morton",
      cn: "josh Morton",
      cm: "RL",
      pg: "-",
      amt: "$123,456",
      pipeline: "$100,362",
      cd: "$300,652",
      ps: "Active",
      state: "Texas",
      sysSize: "10.5",
      type: "loan",
      adder: "$62,500",
      ajh: "12 Days",
      rl: "$20.00",
      epc: "2.444",
    },
    {
      pi: "1234567890",
      dn: "Josh Morton",
      sr: "Josh Morton",
      cn: "josh Morton",
      cm: "Percentage",
      pg: "80/20",
      amt: "$123,456",
      pipeline: "$100,362",
      cd: "$300,652",
      ps: "Active",
      state: "Texas",
      sysSize: "10.5",
      type: "loan",
      adder: "$62,500",
      ajh: "12 Days",
      rl: "$20.00",
      epc: "2.444",
    },
    {
      pi: "1234567890",
      dn: "Josh Morton",
      sr: "Josh Morton",
      cn: "josh Morton",
      cm: "RL",
      pg: "-",
      amt: "$123,456",
      pipeline: "$100,362",
      cd: "$300,652",
      ps: "Active",
      state: "Texas",
      sysSize: "10.5",
      type: "loan",
      adder: "$62,500",
      ajh: "12 Days",
      rl: "$20.00",
      epc: "2.444",
    },
  ];
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector(
    (state: any) => state.paginationType.currentPage
  );
  const itemsPerPage = 10;

  const paginate = (pageNumber: number) => {
    dispatch(setCurrentPage(pageNumber));
  };

  const goToNextPage = () => {
    dispatch(setCurrentPage(currentPage + 1));
  };

  const goToPrevPage = () => {
    dispatch(setCurrentPage(currentPage - 1));
  };
  const totalPages = Math.ceil(dataUser?.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = dataUser?.slice(startIndex, endIndex);
  return (
    <>
      <div className="dashBoard-container">
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr style={{ background: "#fcfcfc" }}>
                <th>
                  <div>
                    <CheckBox
                      checked={false}
                      onChange={() => {}}
                      // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    />
                  </div>
                </th>

                <th style={{ padding: "0px" }}>
                  <div className="table-header">
                    <p>Project ID</p>{" "}
                    <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Dealer Name</p>{" "}
                    <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sales Rep</p>{" "}
                    <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Cust Name</p>{" "}
                    <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Comm Model</p>{" "}
                    <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Percent</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Amt Prep</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Pipe Rem</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Curr Due</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Proj Status</p>{" "}
                    <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>State</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Sys. Size</p>{" "}
                    <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Type</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Adder</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>AHJ</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>RL</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>EPC</p> <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="action-header">
                    <p>Help</p>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {dataUser.length > 0
                ? dataUser.map((el, i) => (
                    <tr key={i}>
                      <td>
                        <CheckBox
                          checked={false}
                          onChange={() => {}}
                          // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                        />
                      </td>
                      <td
                        onClick={() => {
                          handleOpen();
                        }}
                        style={{
                          color: "101828",
                          paddingLeft: "0",
                          cursor: "pointer",
                        }}
                      >
                        {el.pi}
                      </td>
                      <td style={{ color: "#101828" }}>{el.dn}</td>
                      <td style={{ color: "#101828" }}>{el.sr}</td>
                      <td style={{ color: "#101828" }}>{el.cn}</td>
                      <td style={{ color: "#101828" }}>{el.cm}</td>
                      <td style={{ color: "#101828" }}>{el.pg}</td>
                      <td style={{ color: "#0493CE" }}>{el.amt}</td>
                      <td style={{ color: "#0493CE" }}>{el.pipeline}</td>
                      <td style={{ color: "#0493CE" }}>{el.cd}</td>
                      <td style={{ color: "green" }}>{el.ps}</td>
                      <td>{el.state}</td>
                      <td>{el.sysSize}</td>
                      <td>{el.type}</td>
                      <td>{el.adder}</td>
                      <td>{el.ajh}</td>
                      <td>{el.rl}</td>
                      <td>{el.epc}</td>
                      <td
                        style={{ cursor: "pointer", color: "#101828" }}
                        onClick={() => handleIconOpen()}
                      >
                        <BiSupport className="bi-support-icon" />
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
        <div className="page-heading-container">
          <p className="page-heading">
            {currentPage} - {totalPages} of {dataUser?.length} item
          </p>
          {dataUser?.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              currentPageData={currentPageData}
              paginate={paginate}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
            />
          ) : null}
        </div>
      </div>
      {open && (
        <ProjectBreakdown
          commission={editedCommission}
          editMode={editMode}
          handleClose={() => {
            setOpen(false);
          }}
        />
      )}
      {openIcon && (
        <HelpDashboard
          commission={editedCommission}
          editMode={editMode}
          handleClose={handleIconClose}
        />
      )}
    </>
  );
};

export default DashBoardTable;
