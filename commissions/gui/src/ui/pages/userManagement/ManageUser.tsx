import React from "react";
import "../userManagement/user.css";
import { ICONS } from "../../icons/Icons";
import Select from "react-select";
import { CiEdit } from "react-icons/ci";
import CheckBox from "../../components/chekbox/CheckBox";
import '../configure/configure.css'
import { userSelectData } from "../../../resources/static_data/StaticData";
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
          <div className=" rate-input-field">
            <label className="inputLabel">Adder Type</label>
            <Select
              options={userSelectData}
              isSearchable
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  marginTop: "4.5px",
                  borderRadius: "8px",
                  outline: "none",
                  height: "2.8rem",
                  border: "1px solid #d0d5dd"

                }),
              }}
              // onChange={(newValue) => handleChange(newValue, 'adder_type')}
              value={userSelectData?.find((option) => option.value === "admin_user")}
            />
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
                  <CheckBox
                    checked={true}
                    onChange={() => { }
                    }
                  // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                  />
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
                    <CheckBox
                      checked={true}
                      onChange={() => { }
                      }
                    // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    />
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
