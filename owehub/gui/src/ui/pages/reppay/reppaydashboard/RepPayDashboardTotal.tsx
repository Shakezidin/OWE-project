import React from "react";
import { ICONS } from "../../../icons/Icons";

const RepPayDashboardTotal: React.FC = () => {
  const data = [
    {
      doller: "$120,450",
      paid: "Amount Prepaid",
      img: ICONS.doller1Icon,
      backgroundColor: "#C6F4DE",
    },
    {
      doller: "$100,320",
      paid: "Pipeline Remaining",
      img: ICONS.doller2Icon,
      backgroundColor: "#CAF0FF",
    },
    {
      doller: "$100,320",
      paid: "Current Due",
      img: ICONS.doller3Icon,
      backgroundColor: "#FFD1D1",
    },
  ];
  return (
    <>
      <div className="">
        <div className="commission-section-dash">
          {data.length > 0
            ? data.map((el, i) => (
                <div className="total-commisstion">
                  <div className="total-section">
                    <h4>{el.doller}</h4>
                    <p>{el.paid}</p>
                  </div>
                  <div
                    className="teamImg"
                    style={{ backgroundColor: el.backgroundColor }}
                  >
                    <img src={el.img} alt="" />
                  </div>
                </div>
              ))
            : null}
        </div>

    
      </div>
    </>
  );
};

export default RepPayDashboardTotal;
