import React from 'react'
import Input from '../../components/text_input/Input'
import { ICONS } from '../../icons/Icons'
import './support.css'
import Select from 'react-select'
const TechnicalSupport = () => {
  return (
    <>
      <div className='support-cont-section'>
        <div className='support-container'>
          <div className='support-section'>
            <h3>Support</h3>
          </div>
          <div className='supportImage'>
            <img src={ICONS.supportImage} alt='' />
          </div>
        </div>

        <div className="vertical-support">

        </div>
        <div className='touch-container'>
          <div className="touch-info">
            <p>Get In Touch with us for more Information</p>
          </div>
          <div className="create-input-container" style={{ width: "100%", display: "flex", marginTop: "1rem" }}>
            <div className="create-input-field" style={{ width: "40%" }} >
              <Input
                type={"text"}
                label="First Name"
                value={"createMarketing.fee_rate"}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => { }}
              />
            </div>
            <div className="create-input-field" style={{ width: "40%" }}>
              <Input
                type={"text"}
                label="Last Name"
                value={"createMarketing.fee_rate"}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => { }}
              />
            </div>
          </div>
          <div className="create-input-container" style={{ width: "100%", display: "flex", marginTop: "1rem" }}>
            <div className="create-input-field" style={{ width: "40%" }} >
              <Input
                type={"text"}
                label="Email"
                value={"createMarketing.fee_rate"}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => { }}

              />
            </div>
            <div className="create-input-field" style={{ width: "40%" }}>
              <Input
                type={"text"}
                label="Phone Number"
                value={"createMarketing.fee_rate"}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => { }}
              />
            </div>
          </div>
          <div className="create-input-field" style={{ marginTop: "0.5rem" }}>
            <label className="inputLabel">Issue</label>
            <Select
              // options={repTypeOption(newFormData) || respTypeData}
              isSearchable
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  marginTop: "4.5px",
                  borderRadius: "8px",
                  outline: "none",
                  fontSize: "13px",
                  height: "2.25rem",
                  width: "260px",
                  border: "1px solid #d0d5dd",
                }),

                indicatorSeparator: () => ({
                  display: "none", // Hide the indicator separator
                }),
              }}

            />
        </div>
        <div className="create-input-container">
            <div className="rate-input-container">
              <div className="rate-input-field">
                <Input
                  type={"number"}
                  label="Rate"
                  value={"createCommission.rate"}
                  name="rate"
                  placeholder={"Rate"}
                  onChange={(e) => { }}
                />
              </div>
              <div className="rate-input-field">
                <Input
                  type={"number"}
                  label="Rate List"
                  value={"createCommission.rate"}
                  name="rl"
                  placeholder={"Rate List"}
                  onChange={(e) => { }} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default TechnicalSupport