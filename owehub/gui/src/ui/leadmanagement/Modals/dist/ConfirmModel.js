"use strict";
exports.__esModule = true;
var react_1 = require("react");
var confirmmodal_module_css_1 = require("../styles/confirmmodal.module.css");
var ConfirmationICON_svg_1 = require("./Modalimages/ConfirmationICON.svg");
var Thumbs_svg_1 = require("./Modalimages//Thumbs.svg");
var CorrectSign_png_1 = require("./Modalimages/CorrectSign.png");
var SignOfIntrogation_png_1 = require("./Modalimages/SignOfIntrogation.png");
var FAILLED_png_1 = require("./Modalimages/FAILLED.png");
// const LeadManamentSucessModel: React.FC<TableProps> = ({
var ConfirmaModel = function () {
    var _a = react_1.useState(1), visibleDiv = _a[0], setVisibleDiv = _a[1];
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("div", { className: "transparent-model" },
            react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].customer_wrapper_list },
                react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].DetailsMcontainer },
                    react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].Column1Details },
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].main_name }, "Adam Samson"),
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].mobileNumber }, "+91 8739273728")),
                    react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].Column2Details },
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].addresshead }, "12778 Domingo Ct, Parker, COLARDO, 2312"),
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].emailStyle },
                            "Sampletest@gmail.com",
                            ' ',
                            react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].verified },
                                react_1["default"].createElement("svg", { className: confirmmodal_module_css_1["default"].verifiedMarked, width: "13", height: "13", viewBox: "0 0 13 13", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
                                    react_1["default"].createElement("g", { clipPath: "url(#clip0_6615_16896)" },
                                        react_1["default"].createElement("path", { d: "M6.08 0.425781C2.71702 0.425781 0 3.13967 0 6.50578C0 9.87189 2.71389 12.5858 6.08 12.5858C9.44611 12.5858 12.16 9.87189 12.16 6.50578C12.16 3.13967 9.44302 0.425781 6.08 0.425781Z", fill: "#20963A" }),
                                        react_1["default"].createElement("path", { d: "M8.99542 4.72214C8.8347 4.56137 8.59049 4.56137 8.42668 4.72212L5.30786 7.84096L3.72834 6.26146C3.56762 6.10074 3.32341 6.10074 3.1596 6.26146C2.99888 6.42219 2.99888 6.66637 3.1596 6.8302L5.02346 8.69406C5.10383 8.77443 5.18418 8.81461 5.30784 8.81461C5.42839 8.81461 5.51185 8.77443 5.59222 8.69406L8.99542 5.29088C9.15614 5.13016 9.15614 4.886 8.99542 4.72214Z", fill: "white" })),
                                    react_1["default"].createElement("defs", null,
                                        react_1["default"].createElement("clipPath", { id: "clip0_6615_16896" },
                                            react_1["default"].createElement("rect", { width: "12.16", height: "12.16", fill: "white", transform: "translate(0 0.421875)" })))),
                                ' ',
                                "Verified")))),
                visibleDiv === 1 && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    ' ',
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].success_not },
                            react_1["default"].createElement("div", null,
                                react_1["default"].createElement("img", { height: "111px", width: "111px", src: ConfirmationICON_svg_1["default"] }),
                                ' '),
                            react_1["default"].createElement("h2", null, "Please confirm customer details "),
                            react_1["default"].createElement("p", null, "Ensure the email address and phone number are correct before sending the appointment")),
                        react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].survey_button },
                            react_1["default"].createElement("button", { className: confirmmodal_module_css_1["default"].self, style: { color: '#fff', border: 'none' }, onClick: function () { return setVisibleDiv(2); } }, "CONFIRM, SENT APPOINTMENT"),
                            react_1["default"].createElement("button", { id: "otherButtonId", className: confirmmodal_module_css_1["default"].other }, "Edit customer details"))))),
                visibleDiv === 2 && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].success_not },
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("img", { className: confirmmodal_module_css_1["default"].thumbsImg, onClick: function () { return setVisibleDiv(3); }, height: "111px", width: "111px", src: Thumbs_svg_1["default"] }),
                            ' '),
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].ApptSentConfirm },
                            "Appointment sent successfully",
                            ' '),
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].ApptSentDate }, "27 Aug ,2024. 12:00 PM")),
                    react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].survey_button },
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].AppSentDate2 }, "Appointment sent on 25, Aug, 2024"),
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].AppSentDate2 }, "Waiting for confirmation")))),
                visibleDiv === 3 && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].success_not },
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("img", { className: confirmmodal_module_css_1["default"].thumbsImg, onClick: function () { return setVisibleDiv(4); }, height: "140px", width: "140px", src: CorrectSign_png_1["default"] }),
                            ' '),
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].ApptSentSuccess },
                            "Appointment Accepted",
                            ' '),
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].ApptSentDate }, "27 Aug ,2024. 12:00 PM"),
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].remaningDate }, "6 Days Left")),
                    react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].survey_button },
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].getConfirmation },
                            "You will receive a reminder ",
                            react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].hoursBefore }, "24 hrs"),
                            " before"),
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].getDate }, "scheduled appointment date.")))),
                visibleDiv === 4 && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].success_not },
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("img", { height: "110.23px", width: "156px", src: SignOfIntrogation_png_1["default"] }),
                            ' ')),
                    react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].survey_button },
                        react_1["default"].createElement("button", { className: confirmmodal_module_css_1["default"].self, onClick: function () { return setVisibleDiv(6); }, style: { backgroundColor: '#3AC759', color: '#FFFFFF', border: 'none' } }, "CLOSED WON"),
                        react_1["default"].createElement("button", { onClick: function () { return setVisibleDiv(5); }, id: "otherButtonId", style: { backgroundColor: '#CD4040', color: '#FFFFFF', border: 'none' }, className: confirmmodal_module_css_1["default"].other }, "CLOSED LOST"),
                        react_1["default"].createElement("button", { id: "otherButtonId", style: { backgroundColor: '#D3D3D3', color: '#888888', border: 'none' }, className: confirmmodal_module_css_1["default"].other }, "FOLLOW NEEDED"),
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].getAppointment }, "Reschedule Appointment"),
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].notAvailableCtmr }, "In case of customer was not available")))),
                visibleDiv === 5 && (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].customer_wrapper_list },
                        react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].success_not },
                            react_1["default"].createElement("div", null,
                                react_1["default"].createElement("img", { className: confirmmodal_module_css_1["default"].Questmarks, height: "160px", width: "160px", src: FAILLED_png_1["default"] }),
                                ' '),
                            react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].ohNo }, "Oh No!"),
                            react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].deniedCust }, "Customer denied")),
                        react_1["default"].createElement("span", { className: confirmmodal_module_css_1["default"].whydenied }, "Why did customer denied?"),
                        react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].dropdownContainerModal },
                            react_1["default"].createElement("select", { className: confirmmodal_module_css_1["default"].dropdownModal },
                                react_1["default"].createElement("option", { value: "option1" }, "Moving to different city in few months"),
                                react_1["default"].createElement("option", { value: "option2" }, "Rabindra Kumar "),
                                react_1["default"].createElement("option", { value: "option3" }, "Sharma"))),
                        react_1["default"].createElement("div", { className: confirmmodal_module_css_1["default"].survey_button },
                            react_1["default"].createElement("button", { className: confirmmodal_module_css_1["default"].self, style: { backgroundColor: '#377CF6', color: '#FFFFFF', border: 'none' } }, "SUBMIT"))))),
                " "))));
};
exports["default"] = ConfirmaModel;
{ /* <div className={classes.success_not} >
            <div>
                <img className={classes.Questmarks} height="160px" width="160px" src={failledLogo} />{' '}
            </div>
            <span className={classes.ohNo}>
            Oh No!
            </span>
            <span className={classes.deniedCust}>
            Customer denied
            </span>
            </div>
            <span className={classes.whydenied}>Why did customer denied?</span>
            <div className={classes.dropdownContainerModal}>
            <select className={classes.dropdownModal}>
            <option value="option1">Moving to different city in few months</option>
            <option value="option2">Rabindra Kumar </option>
            <option value="option3">Sharma</option>
            </select>
            </div>

            <div className={classes.survey_button}>
            <button
                className={classes.self}
                style={{ backgroundColor: '#377CF6', color:'#FFFFFF', border: 'none' }}
            >
                SUBMIT
            </button>
            </div>
        </>
        )}
        {visibleDiv === 6 && (
        < >
            <div className={classes.success_not}  style={{ backgroundColor: '#EDFFF0' }}>
            <div>
                <img className={classes.Questmarks} height="154px" width="154px" src={DoneLogo} />{' '}
            </div>
            </div>
            <span className={classes.congratulations}>
            Congratulations!
            </span><br />
            <span className={classes.ctmracquired}>
            Customer acquired
            </span>
            <div  className={classes.survey_button}>
            <button
                className={classes.self}
                style={{ backgroundColor: '#3AC759', color:'#FFFFFF', border: 'none' }}
            >
                CREATE PROPOSAL
            </button>
            <span className={classes.n}>
            Attach proposal
            </span>
            </div> */
}
