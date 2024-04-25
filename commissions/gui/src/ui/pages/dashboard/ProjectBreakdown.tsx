import React from "react";
import "../dashboard/dasboard.css";
import { CommissionModel } from "../../../core/models/configuration/create/CommissionModel";
import { ICONS } from "../../icons/Icons";

interface ButtonProps {
    editMode: boolean;
    handleClose: () => void;
    commission: CommissionModel | null;
  }

const ProjectBreakdown: React.FC<ButtonProps> = ({editMode,handleClose, commission}) => {
  return (
    <div className="transparent-model">
      <form action="" className="modal">
        <div className="breakdown-container">
          <div className="createUserCrossButton" >
            <img src={ICONS.closeIcon} alt="" onClick={handleClose}/>
          </div>
          <div className="project-section">
            <h3>Project Breakdown</h3>
            <h4>Customer Name</h4>
            <h5>Project ID</h5>
          </div>
        </div>

        <div className="breakdown-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>watt</td>
                <td>21250</td>
              </tr>
              <tr>
                <td>Contract</td>
                <td>$74,709.38</td>
              </tr>
              <tr>
                <td>Base</td>
                <td>$53,125.00</td>
              </tr>
              <tr>
                <td>Marketing</td>
                <td>-</td>
              </tr>
              <tr>
                <td>R&R</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Small System Size</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Adder</td>
                <td>$2,675.00</td>
              </tr>
              <tr>
                <td>Loan Fee</td>
                <td>-</td>
              </tr>
              <tr>
                <td>EPC</td>
                <td>$3.52</td>
              </tr>
              <tr>
                <td>NET EPC - Adders</td>
                <td>$3.39</td>
              </tr>
              <tr>
                <td>Credit</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Commissions</td>
                <td>$18,909.38</td>
              </tr>
              <tr>
                <td>Paid</td>
                <td>$17,630.64</td>
              </tr>
              <tr>
                <td>Expected COMM</td>
                <td>$1,278.74</td>
              </tr>
              <tr>
                <td>Split Expected Comm</td>
                <td>$8,175.95</td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
};

export default ProjectBreakdown;
