import React from "react";
import "../configure.css";
import TableHeader from "../../../components/tableHeader/TableHeader";
import { ICONS } from "../../../icons/Icons";
const DealeronBoarding = () => {
  const [open, setOpen] = React.useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const dealeronBoardingData = [
    {
      united: "Regional Manager",
      dc: "323223",
      name: "Hanery",
      email: "hanery@gmail.com",
      pn: "+1 9393020303",
      dn: "Voltaic Power LLC",

      des: "Implementing solar system commission ",
    },
    {
      united: "Regional Manager",
      dc: "323223",
      name: "Hanery",
      email: "hanery@gmail.com",
      pn: "+1 9393020303",
      dn: "Voltaic Power LLC",

      des: "Implementing solar system commission ",
    },
    {
      united: "Regional Manager",
      dc: "323223",
      name: "Hanery",
      email: "hanery@gmail.com",
      pn: "+1 9393020303",
      dn: "Voltaic Power LLC",

      des: "Implementing solar system commission ",
    },
    {
      united: "Regional Manager",
      dc: "323223",
      name: "Hanery",
      email: "hanery@gmail.com",
      pn: "+1 9393020303",
      dn: "Voltaic Power LLC",

      des: "Implementing solar system commission ",
    },
  ];
  return (
    <div className="comm">
      <div className="commissionContainer">
        <TableHeader
          title="User OnBoarding"
          onPressViewArchive={() => {}}
          onPressArchive={() => {}}
          onPressFilter={() => {}}
          onPressImport={() => {}}
          onpressExport={() => {}}
          onpressAddNew={() => {}}
        />
        <div
          className="TableContainer"
          style={{ overflowX: "auto", whiteSpace: "nowrap" }}
        >
          <table>
            <thead>
              <tr>
                <th>
                  <div>
                    <input value="test" type="checkbox" className="check-box" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Designation</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    <p>Dealer Code</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
                <th>
                  <div className="table-header">
                    <p>Name</p> <img src={ICONS.DOWN_ARROW} alt="" />
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
                    <p>Dealer Name</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>

                <th>
                  <div className="table-header">
                    <p>Descriptions</p> <img src={ICONS.DOWN_ARROW} alt="" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {dealeronBoardingData.map((el, i) => (
                <tr key={i}>
                  <td>
                    <input value="test" type="checkbox" className="check-box" />
                  </td>
                  <td style={{ fontWeight: "500", color: "black" }}>
                    {el.united}
                  </td>
                  <td>{el.dc}</td>
                  <td>{el.name}</td>
                  <td>{el.email}</td>
                  <td>{el.pn}</td>
                  <td>{el.dc}</td>
                  <td>{el.des}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DealeronBoarding;
