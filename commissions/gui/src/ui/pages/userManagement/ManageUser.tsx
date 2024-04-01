import React from "react";
import "../userManagement/user.css";
import { ICONS } from "../../icons/Icons";
import Select from "react-select";
import { CiEdit } from "react-icons/ci";

// import { installers, partners, respTypeData, statData } from "../../../../../core/models/data_models/SelectDataModel";

type ButtonProps = {
  handleClose: () => void;
};

const dataUser = [
  {
    code: "323223",
    name: "Voltaic Power LLC",
    role: "Regional Manager",
    reporting: "Hanery",
    email: "hanery@gmail.com",
    pn: "123456789",
    des: "Implementing solar system commission"
  },
  {
    code: "323223",
    name: "Voltaic Power LLC",
    role: "Regional Manager",
    reporting: "Hanery",
    email: "hanery@gmail.com",
    pn: "123456789",
    des: "Implementing solar system commission"
  },
  {
    code: "323223",
    name: "Voltaic Power LLC",
    role: "Regional Manager",
    reporting: "Hanery",
    email: "hanery@gmail.com",
    pn: "123456789",
    des: "Implementing solar system commission"
  },
];

const ManageUser: React.FC = () => {
  return (
    <>
      <div className="ManagerUser-container">
        <div className="admin-user">
          <p>Admin Users</p>
        </div>
        <div className="delete-icon-container">
          <div className="create-input-field">
           <div className="User-drop-down">
            <select>
              <option value="volvo">Admin User</option>
              <option value="saab">Appointment Setter</option>
              <option value="mercedes">Partner</option>
              <option value="audi">Regional Manager</option>
              <option value="audi">Dealer Owner</option>
              <option value="audi">Sales Representative</option>
              <option value="audi">Sales Representative</option>
              <option value="audi">Sales Manager</option>

            </select>
            </div>
            {/* <div className="">
              <Select
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    // marginTop: "4.5px",
                    borderRadius: "8px",
                    outline: "none",
                    height: "1.8rem",
                    width: "200px",
                    border: "1px solid #d0d5dd",
                  }),
                }}
              // onChange={(newValue) => handleChange(newValue, 'installer')}
              // value={installers.find((option) => option.value === createCommission.installer)}
              />
            </div> */}
          </div>
          <div className="iconsSection-delete">
            <button type="button">
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
          <thead style={{ background: "#F5F5F5" }}>
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
              <th>
                <div className="table-header">
                  <p>Action</p> <img src={ICONS.DOWN_ARROW} alt="" />
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {dataUser.length > 0
              ? dataUser.map((el, i) => (
                <tr key={i}>
                  <td>
                    {/* <CheckBox
                          checked={selectedRows.has(i)}
                          onChange={() =>
                            toggleRowSelection(
                              i,
                              selectedRows,
                              setSelectedRows,
                              setSelectAllChecked
                            )
                          }
                        /> */}
                  </td>
                  <td style={{ fontWeight: "500", color: "black" }}>{el.code}</td>
                  <td>{el.name}</td>
                  <td>{el.role}</td>
                  <td>{el.reporting}</td>
                  <td>{el.email}</td>
                  <td>{el.pn}</td>
                  <td>{el.des}</td>
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
    </>
  );
};

export default ManageUser;
