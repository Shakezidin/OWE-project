import React, { useState } from 'react';
import './dasboard.css';
import { CommissionModel } from '../../../core/models/configuration/create/CommissionModel';
import { ICONS } from '../../../resources/icons/Icons';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface ButtonProps {
  editMode: boolean;
  handleClose: () => void;
  commission: CommissionModel | null;
  data?: any;
}
interface BreakdownAccordionProps {
  el: Record<string, any>; // You can replace `Record<string, any>` with a more specific type if you know the shape of `el`
}

const BreakdownAccordion: React.FC<BreakdownAccordionProps> = ({ el }) => {
  console.log(el, 'el');

  return (
    <>
      <tr>
        <td colSpan={2} style={{ paddingLeft: '2.5rem' }}>
          Additional content goes here
        </td>
      </tr>
      <tr>
        <td style={{ paddingLeft: '2.5rem' }}>Small System Size</td>
        <td>{el.small_system_size}</td>
      </tr>
      <tr>
        <td style={{ paddingLeft: '2.5rem' }}>Credit</td>
        <td>{el.credit}</td>
      </tr>
      <tr>
        <td style={{ paddingLeft: '2.5rem' }}>Referral</td>
        <td>{el.referral}</td>
      </tr>
      <tr>
        <td style={{ paddingLeft: '2.5rem' }}>Rebates</td>
        <td>{el.rebates}</td>
      </tr>
    </>
  );
};

const ProjectBreakdown: React.FC<ButtonProps> = ({ handleClose, data }) => {
  const [toggleOpen, setToggleOpen] = useState(false);

 
  return (
    <div className="transparent-model-down">
      <form action="" className="modal-down-break">
        <div className="breakdown-container">
          <div className="project-section">
            <h5>Project ID</h5>
            {/* <h4>{data?.}</h4> */}
            
          </div>
          <div className="breakdown-img" onClick={handleClose}>
            <img className="close-popup-btn" src={ICONS.closeIcon} alt="" />
          </div>
        </div>
        <div className="modal-body-down">
          <div className="breakdown-table">
            <table>
              <thead>
                <tr>
                  <th>Home Owner</th>
                  <th>{data?.home_owner}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>watt</td>
                  <td>{data?.watt}</td>
                </tr>
                <tr>
                  <td>Contract</td>
                  <td>{data?.contract || 'N/A'}</td>
                </tr>
                <tr>
                  <td>Base</td>
                  <td>{data?.base}</td>
                </tr>
                <tr>
                  <td>Marketing</td>
                  <td>{data?.Marketing || 0}</td>
                </tr>

                <tr
                  onClick={() => setToggleOpen(!toggleOpen)}
                  style={{ backgroundColor: '#D5E4FF' }}
                >
                  <td style={{ cursor: 'pointer',fontSize: "14px", fontWeight: 600 }}>
                    Adder{' '}
                    {toggleOpen ? (
                      <IoIosArrowUp className="add-arrow-icon up" />
                    ) : (
                      <IoIosArrowDown className="add-arrow-icon down" />
                    )}
                  </td>

                  <td></td>
                </tr>
                {toggleOpen && <BreakdownAccordion el={data.adder} />}
                <tr>
                  <td>Loan Fee</td>
                  <td>{data?.loan_fee || 0}</td>
                </tr>
                <tr>
                  <td>EPC</td>
                  <td>{data?.epc || 0}</td>
                </tr>
                <tr>
                  <td>NET EPC - Adders</td>
                  <td>{data?.net_epc || 0}</td>
                </tr>

                <tr>
                  <td>Commissions</td>
                  <td>{data?.commission || 0}</td>
                </tr>
                <tr>
                  <td>Paid</td>
                  <td>{data?.paid || 0}</td>
                </tr>
                <tr>
                  <td>Expected COMM</td>
                  <td>{data?.expected_comm || 0}</td>
                </tr>

                <tr>
                  <td>ONYX - Dealer - 30%</td>
                  <td>{data?.onyx_dealer_30_perc || 0}</td>
                </tr>
                <tr>
                  <td>ONYX - Sales rep - 20%</td>
                  <td>{data?.onyx_sales_rep_20_perc || 0}</td>
                </tr>
                <tr>
                  <td>P&S - 30%</td>
                  <td></td>
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
