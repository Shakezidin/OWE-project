import React from 'react'
import Input from '../../components/text_input/Input'
import './AccountSettings.css'

const ResetPasswordAccount = () => {
  return (
    <>
      <div className='' style={{flex:"1", padding:"1rem"}}>
        <div className=''>
          <p>Settings</p>
        </div>

        <div className='Personal-container'>
          <div className="create-input-container" style={{padding:"1rem "}}>
            <div className="create-input-field-profile">
              <Input
                type={"text"}
                label="Current Password"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
                />
            </div>
            <div className="create-input-field-profile">
              <Input
                type={"text"}
                label="New Password"
                value={""}
                name="fee_rate"
                placeholder={"Enter"}
                onChange={(e) => {}}
                />
            </div>
            <div className="create-input-field-profile">
              <Input
                type={"text"}
                label="Confirm Password"
                value={""}
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