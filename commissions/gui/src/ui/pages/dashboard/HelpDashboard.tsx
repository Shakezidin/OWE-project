import React from "react";
import "../dashboard/dasboard.css";
import { ICONS } from "../../icons/Icons";
import Input from "../../components/text_input/Input";
import { ActionButton } from "../../components/button/ActionButton";


const HelpDashboard = () => {
  
    return (
        <>
            <div className="Help-container">
                <div className="help-section-container" style={{ display: "flex" }}>
                    <div className="help-section">
                        <h3>Help</h3>
                    </div>
                    <div className="help-icon" >
                        <img src={ICONS.crossIconUser} alt="" />
                    </div>
                </div>
                <div className="create-input-container">
                    <div className="create-input-field" style={{ width: "610px", marginLeft: "2rem" }}>
                        <Input
                            type={"text"}
                            label="Project ID"
                            value={""}
                            name="fee_rate"
                            placeholder={"Enter"}
                            onChange={(e) => { }}
                        />
                    </div>
                </div>

                <div className="create-input-container">
                    <div className="create-input-field-help">
                        <Input
                            type={"text"}
                            label="Dealer Name"
                            value={""}
                            name="fee_rate"
                            placeholder={"Enter"}
                            onChange={(e) => { }}
                        />
                    </div>

                    <div className="create-input-field-help">
                        <Input
                            type={"text"}
                            label="Sale Rep."
                            value={""}
                            name="pay_src"
                            placeholder={"Enter"}
                            onChange={(e) => { }}
                        />
                    </div>
                    <div className="create-input-field-help">
                        <Input
                            type={"text"}
                            label="Customer Name"
                            value={""}
                            name="pay_src"
                            placeholder={"Enter"}
                            onChange={(e) => { }}
                        />
                    </div>
                </div>

                <div className="create-input-container">
                    <div className="create-input-field-help">
                        <Input
                            type={"text"}
                            label="Amount Prepaid"
                            value={""}
                            name="fee_rate"
                            placeholder={"Enter"}
                            onChange={(e) => { }}
                        />
                    </div>

                    <div className="create-input-field-help">
                        <Input
                            type={"text"}
                            label="Pipeline Remaining"
                            value={""}
                            name="pay_src"
                            placeholder={"Enter"}
                            onChange={(e) => { }}
                        />
                    </div>
                    <div className="create-input-field-help">
                        <Input
                            type={"text"}
                            label="Current Date"
                            value={""}
                            name="pay_src"
                            placeholder={"Enter"}
                            onChange={(e) => { }}
                        />
                    </div>
                </div>
                <div className="create-input-container">
                    <div className="create-input-field-help">
                        <Input
                            type={"text"}
                            label="Project Status"
                            value={""}
                            name="fee_rate"
                            placeholder={"Enter"}
                            onChange={(e) => { }}
                        />
                    </div>

                    <div className="create-input-field-help">
                        <Input
                            type={"text"}
                            label="State"
                            value={""}
                            name="pay_src"
                            placeholder={"Enter"}
                            onChange={(e) => { }}
                        />
                    </div>
                   
                </div>

                {/* <div className="help-line">

                </div> */}

                <div className="createUserActionButton" style={{marginTop:"2rem"}}>
          <ActionButton
            title={"Cancel"}
            type="reset"
            onClick={() => {}}
          />
          <ActionButton
            title={"Submit"}
            type="submit"
            onClick={() => {}}
          />
        </div>
            </div>
        </>
    );
};

export default HelpDashboard;
