import React from "react";
import "../../userManagement/user.css";
import { ICONS } from "../../../icons/Icons";
import { CiEdit } from "react-icons/ci";
import CheckBox from "../../../components/chekbox/CheckBox";
import "../../configure/configure.css";
import { FaArrowDown } from "react-icons/fa6";
import Pagination from "../../../components/pagination/Pagination";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setCurrentPage } from "../../../../redux/apiSlice/paginationslice/paginationSlice";
// import { installers, partners, respTypeData, statData } from "../../../../../core/models/data_models/SelectDataModel";

const dataUser = [
  {
    name: "Voltaic Power",
    pay: "$3002r",
    des: "Implementing solar system commission settings ",
    sd: "24-04-2011",
    ed: "21-08-2005",
  },
  {
    name: "Voltaic Power",
    pay: "$3002r",
    des: "Implementing solar system commission settings ",
    sd: "24-04-2011",
    ed: "21-08-2005",
  },
  {
    name: "Voltaic Power",
    pay: "$3002r",
    des: "Implementing solar system commission settings ",
    sd: "24-04-2011",
    ed: "21-08-2005",
  },
];

const AppointmentSetterTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector(
    (state) => state.paginationType.currentPage
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
      {/* <UserHeaderSection  name="Appointment Setter"/> */}
      <div
        className="UserManageTable"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        <table>
          <thead style={{ background: "#F5F5F5" }}>
            <tr>
              <th>
                <div>
                  <CheckBox
                    checked={true}
                    onChange={() => {}}
                    // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                  />
                </div>
              </th>

              <th>
                <div className="table-header">
                  <p>Name</p> <FaArrowDown style={{ color: "#667085" }} />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Start Date</p> <FaArrowDown style={{ color: "#667085" }} />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>End Date</p> <FaArrowDown style={{ color: "#667085" }} />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Pay Rate</p> <FaArrowDown style={{ color: "#667085" }} />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Descriptions</p>{" "}
                  <FaArrowDown style={{ color: "#667085" }} />
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
            {currentPageData.length > 0
              ? currentPageData.map((el, i) => (
                  <tr key={i}>
                    <td>
                      <CheckBox
                        checked={true}
                        onChange={() => {}}
                        // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                      />
                    </td>
                    <td
                      style={{
                        fontWeight: "none",
                        color: "var( --fade-gray-black)",
                      }}
                    >
                      {el.name}
                    </td>
                    <td style={{ color: "var( --fade-gray-black)" }}>
                      {el.sd}
                    </td>
                    <td style={{ color: "var( --fade-gray-black)" }}>
                      {el.ed}
                    </td>
                    <td style={{ color: "var( --fade-gray-black)" }}>
                      {el.pay}
                    </td>
                    <td>{el.des}</td>

                    <td>
                      <div className="action-icon">
                        <div className="" style={{ cursor: "pointer" }}>
                          <img src={ICONS.deleteIcon} alt="" />
                        </div>
                        <div className="" style={{ cursor: "pointer" }}>
                          <img src={ICONS.editIcon} alt="" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
        <div className="page-heading-container">
          <p className="page-heading">
            {currentPage} - {totalPages} of {dataUser?.length} item
          </p>

          {dataUser?.length > 0 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // You need to calculate total pages
              paginate={paginate}
              goToNextPage={goToNextPage}
              goToPrevPage={goToPrevPage}
              currentPageData={currentPageData}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default AppointmentSetterTable;
