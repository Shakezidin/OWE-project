import React from "react";
import teamLine from '../../../resources/assets/team-line.png';
const DashboardTotal: React.FC = () => {
  return (
    <>
    <div className="commission-section-dash">
      <div className="total-commisstion">
        <div className="total-section">
          <h4>$120,450</h4>
          <p>Total Commissions Paid</p>
        </div>
        <div className="teamImg">
          <img src={teamLine} alt=""/>
        </div>
      </div>
      <div className="total-commisstion">
        <div className="total-section">
          <h4>$120,450</h4>
          <p>Total Commissions Paid</p>
        </div>
        <div className="teamImg">
          <img src={teamLine} alt=""/>
        </div>
      </div>
      </div>
    </>
  );
};

export default DashboardTotal;
