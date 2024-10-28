import React, { useRef, useState } from 'react';
import './dasboard.css';
import { ICONS } from '../../../resources/icons/Icons';
import Input from '../../components/text_input/Input';
import { ActionButton } from '../../components/button/ActionButton';

interface ButtonProps {
  handleClose: () => void;
  data: any;
}
const HelpDashboard: React.FC<ButtonProps> = ({ data, handleClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileInputChange = (e: any) => {
    const file = e.target.files?.[0];
    console.log(file);
  };

  const [state, setState] = useState({
    project_id: data?.unique_id || 'N/A',
    dealer_name: data?.dealer_code || '',
    sale_rep: data?.rep1,
    customer_name: data?.home_owner,
    amount_prepaid: 0,
    pipeline_remaining: 0,
    current_date: 0,
    project_status: data?.current_status || '',
    state: data?.st || '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // Trigger file input click event
  };

  return (
    <>
      <div className="transparent-model-down">
        <div className="help-modal">
          <div className="help-section-container">
            <div className="help-section">
              <h3>Help</h3>
            </div>
            <div className="help-icon" onClick={handleClose}>
              <img src={ICONS.closeIcon} alt="" />
            </div>
          </div>
          <div className="modal-body">
            <div className="help-input-container">
              <div
                className="create-input-container"
                style={{ width: '1740px' }}
              >
                <div className="create-input-field" style={{}}>
                  <Input
                    type={'text'}
                    label="Project ID"
                    value={state.project_id}
                    name="project_id"
                    placeholder={'Enter'}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field-help">
                  <Input
                    type={'text'}
                    label="Dealer Name"
                    value={state.dealer_name}
                    name="dealer_name"
                    placeholder={'Enter'}
                    onChange={handleChange}
                  />
                </div>

                <div className="create-input-field-help">
                  <Input
                    type={'text'}
                    label="Sale Rep."
                    value={state.sale_rep}
                    name="sale_rep"
                    placeholder={'Enter'}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field-help">
                  <Input
                    type={'text'}
                    label="Customer Name"
                    value={state.customer_name}
                    name="customer_name"
                    placeholder={'Enter'}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field-help">
                  <Input
                    type={'text'}
                    label="Amount Prepaid"
                    value={state.amount_prepaid}
                    name="amount_prepaid"
                    placeholder={'Enter'}
                    onChange={handleChange}
                  />
                </div>

                <div className="create-input-field-help">
                  <Input
                    type={'text'}
                    label="Pipeline Remaining"
                    value={state.pipeline_remaining}
                    name="pipeline_remaining"
                    placeholder={'Enter'}
                    onChange={handleChange}
                  />
                </div>
                <div className="create-input-field-help">
                  <Input
                    type={'text'}
                    label="Current Date"
                    value={state.current_date}
                    name="current_date"
                    placeholder={'Enter'}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field-help">
                  <Input
                    type={'text'}
                    label="Project Status"
                    value={state.project_status}
                    name="project_status"
                    placeholder={'Enter'}
                    onChange={handleChange}
                  />
                </div>

                <div className="create-input-field-help">
                  <Input
                    type={'text'}
                    label="State"
                    value={state.state}
                    name="state"
                    placeholder={'Enter'}
                    onChange={handleChange}
                  />
                </div>

                <div className="create-input-field-help">
                  <label className="inputLabel">
                    <p>Attach File</p>
                  </label>
                  <div className="file-input-container">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      className="file-input"
                    />
                    <div className="custom-button-container">
                      <span className="file-input-placeholder">
                        Select File
                      </span>
                      <button
                        className="custom-button"
                        onClick={handleButtonClick}
                      >
                        {/* <img src={ICONS.browserIcon} alt="" /> */}
                        Browse
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="create-input-field-note" style={{}}>
                <label htmlFor="" className="inputLabel">
                  Message
                </label>
                <br />
                <textarea
                  name={''}
                  id=""
                  rows={4}
                  onChange={handleChange}
                  value={''}
                  placeholder="Type here..."
                ></textarea>
              </div>
            </div>
          </div>
          <div className="createUserActionButton" style={{ marginTop: '1rem' }}>
            <ActionButton title={'Cancel'} type="reset" onClick={handleClose} />
            <ActionButton title={'Submit'} type="submit" onClick={() => {}} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpDashboard;
