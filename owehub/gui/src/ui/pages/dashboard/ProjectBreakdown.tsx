import React, { useState } from 'react';
import '../dashboard/dasboard.css';
import { CommissionModel } from '../../../core/models/configuration/create/CommissionModel';
import { ICONS } from '../../icons/Icons';

interface ButtonProps {
  editMode: boolean;
  handleClose: () => void;
  commission: CommissionModel | null;
}

const BreakdownAccordion = () => {
  // Add your accordion content here
  return (
    <>
      <tr style={{ backgroundColor: '#F2F4F6' }}>
        <td colSpan={2}>Adder content goes here</td>
      </tr>
      <tr style={{ backgroundColor: '#F2F4F6' }}>
        <td>Small System Size</td>
        <td>21250</td>
      </tr>
      <tr style={{ backgroundColor: '#F2F4F6' }}>
        <td>Credit</td>
        <td>21250</td>
      </tr>
      <tr style={{ backgroundColor: '#F2F4F6' }}>
        <td>Referal</td>
        <td>21250</td>
      </tr>
      <tr style={{ backgroundColor: '#F2F4F6' }}>
        <td>Rebates</td>
        <td>21250</td>
      </tr>
    </>
  );
};

const ProjectBreakdown: React.FC<ButtonProps> = ({
  editMode,
  handleClose,
  commission,
}) => {
  const [toggleOpen, setToggleOpen] = useState(false);

  return (
    <div className="transparent-model-down">
      <form action="" className="modal-down-break">
        <div className="breakdown-container">
          <div className="project-section">
            <h4>Customer Name</h4>
            <h5>Project ID</h5>
          </div>
          <div className="breakdown-img" onClick={handleClose}>
            <img src={ICONS.closeIcon} alt="" />
          </div>
        </div>
        <div className="modal-body-down">
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

                <tr
                  onClick={() => setToggleOpen(!toggleOpen)}
                  style={{ backgroundColor: 'lightcyan' }}
                >
                  <td style={{ cursor: 'pointer' }}>
                    Adder{' '}
                    {toggleOpen ? (
                      <span>&#x25B2;</span> // Up arrow
                    ) : (
                      <span>&#x25BC;</span> // Down arrow
                    )}
                  </td>

                  <td>$2,675.00</td>
                </tr>
                {toggleOpen && <BreakdownAccordion />}
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
                  <td>ONYX - Dealer - 30%</td>
                  <td>$2,641.13</td>
                </tr>
                <tr>
                  <td>ONYX - Sales rep - 20%</td>
                  <td>$1,760.75</td>
                </tr>
                <tr>
                  <td>P&S - 30%</td>
                  <td>$2,641.13</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectBreakdown;
