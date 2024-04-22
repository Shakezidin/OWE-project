import React from "react";
import CheckBox from "../../../components/chekbox/CheckBox";
import { ICONS } from "../../../icons/Icons";
import { FaArrowDown } from "react-icons/fa6";

interface UserTableProps {
  data: { [key: string]: any }[];
}
const UserTable: React.FC<UserTableProps> = ({data}) => {
 
  //   {
  //     code: "323223",
  //     name: "Voltaic Power LLC",
  //     role: "Regional Manager",
  //     reporting: "Hanery",
  //     email: "hanery@gmail.com",
  //     pn: "123456789",
  //     des: "Implementing solar system commission",
  //   },
  //   {
  //     code: "323223",
  //     name: "Voltaic Power LLC",
  //     role: "Regional Manager",
  //     reporting: "Hanery",
  //     email: "hanery@gmail.com",
  //     pn: "123456789",
  //     des: "Implementing solar system commission",
  //   },
  //   {
  //     code: "323223",
  //     name: "Voltaic Power LLC",
  //     role: "Regional Manager",
  //     reporting: "Hanery",
  //     email: "hanery@gmail.com",
  //     pn: "123456789",
  //     des: "Implementing solar system commission",
  //   },
  // ];
  return (
    <div
      className="UserManageTable"
      style={{ overflowX: "auto", whiteSpace: "nowrap" }}
    >
      <table>
        <thead>
          <tr style={{ backgroundColor: "#F5F5F5" }}>
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
                <p>Code</p> <FaArrowDown style={{ color: "#667085" }} />
              </div>
            </th>
            <th>
              <div className="table-header">
                <p>Name</p> <FaArrowDown style={{ color: "#667085" }} />
              </div>
            </th>
            <th>
              <div className="table-header">
                <p>Role</p> <FaArrowDown style={{ color: "#667085" }} />
              </div>
            </th>

            <th>
              <div className="table-header">
                <p>Reporting To</p> <FaArrowDown style={{ color: "#667085" }} />
              </div>
            </th>
            <th>
              <div className="table-header">
                <p>Email ID</p> <FaArrowDown style={{ color: "#667085" }} />
              </div>
            </th>
            <th>
              <div className="table-header">
                <p>Phone Number</p> <FaArrowDown style={{ color: "#667085" }} />
              </div>
            </th>
            <th>
              <div className="table-header">
                <p>Description</p> <FaArrowDown style={{ color: "#667085" }} />
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
          {data?.length > 0
            ? data?.map((el, i) => (
                <tr key={i}>
                  <td>
                    <CheckBox
                      checked={true}
                      onChange={() => {}}
                      // indeterminate={isAnyRowSelected && !isAllRowsSelected}
                    />
                  </td>
                  <td style={{ color: "var( --fade-gray-black)" }}>
                    {el.code}
                  </td>
                  <td style={{ color: "var( --fade-gray-black)" }}>
                    {el.name}
                  </td>
                  <td style={{ color: "var( --fade-gray-black)" }}>
                    {el.role}
                  </td>
                  <td style={{ color: "var( --fade-gray-black)" }}>
                    {el.reporting}
                  </td>
                  <td style={{ color: "var( --fade-gray-black)" }}>
                    {el.email}
                  </td>
                  <td style={{ color: "var( --fade-gray-black)" }}>{el.pn}</td>
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
    </div>
  );
};

export default UserTable;
