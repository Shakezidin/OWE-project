import React from 'react'
import Input from '../../components/text_input/Input'
import './AccountSettings.css'

const ResetPasswordAccount = () => {
  return (
    <>
      <div className='myProf-section'>
        <div className=''>
          <p>Settings</p>
        </div>

        <div className='Personal-container'>
          <div className="create-input-container" style={{ padding: "0.5rem", marginLeft: "1rem" }}>
            <div className="create-input-field">
              <Input
                type={"text"}
                label="Current Password"
                value={"createMarketing.fee_rate"}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
                />
            </div>
            <div className="create-input-field">
              <Input
                type={"text"}
                label="New Password"
                value={"createMarketing.fee_rate"}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
                />
            </div>
            <div className="create-input-field">
              <Input
                type={"text"}
                label="Confirm Password"
                value={"createMarketing.fee_rate"}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
                />
            </div>
          </div>
          <div className='reset-Update'>
            <button type='button'>Update</button>
          </div>

        </div>
      </div>
    </>
  )
}

export default ResetPasswordAccount