import React from "react";
import "../userManagement/user.css";
import "../configure/configure.css";
import { CiEdit } from "react-icons/ci";
import { FaArrowDown } from "react-icons/fa6";
import CheckBox from "../../components/chekbox/CheckBox";
import { IoIosHelpCircleOutline } from "react-icons/io";
import "../../components/pagination/Pagination";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setCurrentPage } from "../../../redux/apiSlice/paginationslice/paginationSlice";
import Pagination from "../../components/pagination/Pagination";
import { BiSupport } from "react-icons/bi";
// import { installers, partners, respTypeData, statData } from "../../../../../core/models/data_models/SelectDataModel";

const DashBoardTable: React.FC = () => {
  const dataUser = [
    {
      pi: "1234567890",
      dn: "Josh Morton",
      sr: "Josh Morton",
      cn: "josh Morton",
      cm: "Percentage",
      pg: "18/20",
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
      pg: "90/10",
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
      pg: "18/20",
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
      pg: "90/10",
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
      pg: "18/20",
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
      pg: "90/10",
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

                <th>
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
                    <p>Sales Representative</p>{" "}
                    <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Customer Name</p>{" "}
                    <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Commision Model</p>{" "}
                    <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Percentage</p>{" "}
                    <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Amt Prepaid</p>{" "}
                    <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Pipeline Remaining</p>{" "}
                    <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Current Due</p>{" "}
                    <FaArrowDown style={{ color: "#667085" }} />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Project Status</p>{" "}
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
                    <p>AJH</p> <FaArrowDown style={{ color: "#667085" }} />
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
                    <p>Action</p>
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
                      <td style={{ color: "black" }}>{el.pi}</td>
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
                      <td style={{cursor: "pointer"}}><BiSupport /></td>
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
    </>
  );
};

export default DashBoardTable;
