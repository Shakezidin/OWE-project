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
    name: "ffs",
    det: "Freedom Forever Solar",
  },
  {
    name: "ffs",
    det: "Freedom Forever Solar",
  },
  {
    name: "ffs",
    det: "Freedom Forever Solar",
  },
];

const PartnerTable: React.FC = () => {
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
      {/* <UserHeaderSection name="Partner" /> */}
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
                  <p>Details</p> <FaArrowDown style={{ color: "#667085" }} />
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
                        checked={true}
                        onChange={() => {}}
                        // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                      />
                    </td>
                    <td style={{ color: "var( --fade-gray-black)" }}>
                      {el.name}
                    </td>
                    <td>{el.det}</td>
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
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default PartnerTable;
