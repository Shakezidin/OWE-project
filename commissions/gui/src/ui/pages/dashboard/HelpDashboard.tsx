import React from "react";
import "../dashboard/dasboard.css";
import { ICONS } from "../../icons/Icons";
import Input from "../../components/text_input/Input";
import { ActionButton } from "../../components/button/ActionButton";
import { CommissionModel } from "../../../core/models/configuration/create/CommissionModel";

interface ButtonProps {
    editMode: boolean;
    handleClose: () => void;
    commission: CommissionModel | null;
}
const HelpDashboard: React.FC<ButtonProps> = ({ editMode, handleClose, commission }) => {

    return (
        <>
            <div className="help-container">
                <div className="section-help">
                    <div className="help-section-container" style={{ display: "flex" }}>
                        <div className="help-section">
                            <h3>Help</h3>
                        </div>
                        <div className="help-icon" onClick={handleClose}>
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

                    <div className="create-input-field-note" style={{ marginTop: "0.5rem", textAlign:"left" }}>
                        <label htmlFor="" className="inputLabel" style={{marginLeft:"2rem"}}>
                            Message
                        </label>
                        <br />
                        <textarea
                            name={""}
                            id=""
                            rows={4}
                            onChange={(e) => { }}
                            value={""}
                            placeholder="Type here..."
                            style={{
                                width: "940px",
                                marginLeft: "2rem",
                                marginTop: "0.5rem",
                                alignItems:"end"
                            }}
                        ></textarea>
                    </div>

                    <div className="createUserActionButton" style={{ marginTop: "1rem" }}>
                        <ActionButton
                            title={"Cancel"}
                            type="reset"
                            onClick={handleClose}
                        />
                        <ActionButton
                            title={"Submit"}
                            type="submit"
                            onClick={() => { }}
                        />
                    </div>
                </div>

            </div>
        </>
    );
};

export default HelpDashboard;
