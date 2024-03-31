import React from "react";
import "../userManagement/user.css";
import { ICONS } from "../../icons/Icons";
import Select from 'react-select';
// import { installers, partners, respTypeData, statData } from "../../../../../core/models/data_models/SelectDataModel";

type ButtonProps = {
  handleClose: () => void;
};

const ManageUser: React.FC = () => {
  return (
    <>
      <div className="ManagerUser-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="admin-user">
          <h3>Admin Users</h3>
        </div>
        <div className="delete-icon-container">
          <div className="create-input-field">
            <div className="">
              <Select
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    marginTop: "4.5px",
                    borderRadius: "8px",
                    outline: "none",
                    height: "1.8rem",
                    width: "200px",
                    border: "1px solid #d0d5dd"

                  }),
                }}
              // onChange={(newValue) => handleChange(newValue, 'installer')}
              // value={installers.find((option) => option.value === createCommission.installer)}
              />
            </div>
          </div>
          <div className="iconsSection-delete" >
            <button type="button" >
              <img src={ICONS.deleteIcon} alt="" />
              <h4>Delete</h4>
            </button>
          </div>
          <div className="iconsSection-filter">
            <button type="button">
              <img src={ICONS.FILTER} alt="" />
            </button>
          </div>
        </div>
      </div>
      <div
        className="TableContainer"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        <table>
          <thead>
            <tr>
              <th>
                <div>
                  {/* <CheckBox
                      checked={selectAllChecked}
                      onChange={() =>
                        toggleAllRows(
                          selectedRows,
                          commissionList,
                          setSelectedRows,
                          setSelectAllChecked
                        )
                      }
                      indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    /> */}
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Code</p> <img src={ICONS.DOWN_ARROW} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Name</p> <img src={ICONS.DOWN_ARROW} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Role</p> <img src={ICONS.DOWN_ARROW} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Reporting To</p> <img src={ICONS.DOWN_ARROW} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Email ID</p> <img src={ICONS.DOWN_ARROW} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Phone Number</p> <img src={ICONS.DOWN_ARROW} alt="" />
                </div>
              </th>
              <th>
                <div className="table-header">
                  <p>Description</p> <img src={ICONS.DOWN_ARROW} alt="" />
                </div>
              </th>

            </tr>
          </thead>
          <tbody>
            {/* {currentPageData?.length > 0
                ? currentPageData?.map((el, i) => (
                    <tr
                      key={i}
                      className={selectedRows.has(i) ? "selected" : ""}
                    >
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
                        {el.partner}
                      </td>
                      <td>{el.installer}</td>
                      <td>{el.state}</td>
                      <td>{el.sale_type}</td>
                      <td>{el.sale_price}</td>
                      <td>{el.rep_type}</td>
                      <td>{el.rl}</td>
                      <td>{el.rate}</td>
                      <td>{el.start_date}</td>
                      <td>{el.end_date}</td>
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
                : null} */}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageUser;
