import React, { useEffect, useState } from "react";
import "../../create_profile/CreateUserProfile.css";
import { ReactComponent as PROFILE_BACKGROUND } from "../../../../resources/assets/Profile_background.svg";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";

import { ActionButton } from "../../../components/button/ActionButton";

import { useDispatch } from "react-redux";
// import { updateForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createCommissionSlice";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import Select from "react-select";
import {
  installerOption,
  partnerOption,
  repTypeOption,
  stateOption,
} from "../../../../core/models/data_models/SelectDataModel";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { respTypeData } from "../../../../resources/static_data/StaticData";
import { updateForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createCommissionSlice";
import { CommissionModel } from "../../../../core/models/configuration/create/CommissionModel";
import ToastComponent from "../../../components/toast/ToastComponent";
interface ButtonProps {
  editMode: boolean;
  handleClose: () => void;
  commission: CommissionModel | null;
}

const CreateAutoAdder: React.FC<ButtonProps> = ({
  handleClose,
  commission,
  editMode,
}) => {
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [createCommission, setCreateCommission] = useState<CommissionModel>({
    record_id: commission ? commission?.record_id : 0,
    partner: commission ? commission?.partner : "OWE",
    installer: commission ? commission?.installer : "OWE",
    state: commission ? commission?.state : "Alaska",
    sale_type: commission ? commission?.sale_type : "BATTERY",
    sale_price: commission ? commission?.sale_price : 1500.0,
    rep_type: commission ? commission?.rep_type : "EMPLOYEE",
    rl: commission ? commission?.rl : 0.5,
    rate: commission ? commission?.rate : 0.1,
    start_date: commission ? commission?.start_date : "2024-04-01",
    end_date: commission ? commission?.end_date : "2024-06-30",
  });
  const [newFormData, setNewFormData] = useState<any>([]);
  const tableData = {
    tableNames: ["partners", "states", "installers", "rep_type"],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  useEffect(() => {
    if (commission) {
      setCreateCommission(commission);
    }
  }, [commission]);

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateCommission((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : "",
    }));
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateCommission((prevData) => ({
      ...prevData,
      [name]:
        name === "rl" || name === "sale_price" || name === "rate"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(updateForm(createCommission));
      if (createCommission.record_id) {
        const res = await postCaller(
          EndPoints.update_commission,
          createCommission
        );
        if (res.status === 200) {
          setShowToast(true);
          handleClose();
          window.location.reload();
        } else {
          alert(res.message);
        }
      } else {
        const { record_id, ...cleanedFormData } = createCommission;
        const res = await postCaller(
          EndPoints.create_commission,
          cleanedFormData
        );
        if (res.status === 200) {
          setShowToast(true);
          handleClose();
          // window.location.reload()
        } else {
          alert(res.message);
        }
      }

      // dispatch(resetForm());
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div className="transparent-model">
      <form action="" onSubmit={(e) => handleSubmit(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? "Loan Fee Addr" : "Update Loan Fee Addr"}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel">Partner</label>
                  <Select
                    options={
                      partnerOption(newFormData)?.length > 0
                        ? partnerOption(newFormData)
                        : undefined
                    }
                    isSearchable
                    onChange={(newValue) => handleChange(newValue, "partner")}
                    value={partnerOption(newFormData)?.find(
                      (option) => option?.value === createCommission.partner
                    )}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        marginTop: "4.5px",
                        borderRadius: "8px",
                        outline: "none",
                        height: "42px",
                        // width:"280px"
                        border: "1px solid #d0d5dd",
                      }),
                      indicatorSeparator: () => ({
                        display: "none", // Hide the indicator separator
                      }),
                    }}
                  />
                </div>
                <div className="create-input-field">
                  <label className="inputLabel">Installer</label>
                  <div className="">
                    <Select
                      options={installerOption(newFormData)}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          marginTop: "4.5px",
                          borderRadius: "8px",
                          outline: "none",
                          height: "42px",
                          border: "1px solid #d0d5dd",
                        }),
                        indicatorSeparator: () => ({
                          display: "none", // Hide the indicator separator
                        }),
                      }}
                      onChange={(newValue) =>
                        handleChange(newValue, "installer")
                      }
                      value={installerOption(newFormData)?.find(
                        (option) => option.value === createCommission.installer
                      )}
                    />
                  </div>
                </div>
                <div className="create-input-field">
                  <label className="inputLabel">State</label>
                  <Select
                    options={stateOption(newFormData)}
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        marginTop: "4.5px",
                        borderRadius: "8px",
                        outline: "none",
                        height: "42px",
                        border: "1px solid #d0d5dd",
                      }),
                      indicatorSeparator: () => ({
                        display: "none", // Hide the indicator separator
                      }),
                    }}
                    isSearchable
                    // options={statData}
                    onChange={(newValue) => handleChange(newValue, "state")}
                    value={stateOption(newFormData)?.find(
                      (option) => option.value === createCommission.state
                    )}
                  />
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Sales Type"
                    value={createCommission.sale_type}
                    name="sale_type"
                    placeholder={"Sales Type"}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"number"}
                    label="Sales Price"
                    value={createCommission.sale_price}
                    name="sale_price"
                    placeholder={"sale price"}
                    onChange={(e) => handleInputChange(e)}
                  />
                </div>
                <div className="create-input-field">
                  <label className="inputLabel">Representative Type</label>
                  <Select
                    options={repTypeOption(newFormData) || respTypeData}
                    isSearchable
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        marginTop: "4.5px",
                        borderRadius: "8px",
                        outline: "none",
                        height: "42px",
                        border: "1px solid #d0d5dd",
                      }),
                      indicatorSeparator: () => ({
                        display: "none", // Hide the indicator separator
                      }),
                    }}
                    // options={partners}
                    onChange={(newValue) => handleChange(newValue, "rep_type")}
                    value={
                      repTypeOption(newFormData) ||
                      respTypeData?.find(
                        (option) => option.value === createCommission.rep_type
                      )
                    }
                  />
                </div>
              </div>
              <div className="create-input-container">
                <div className="rate-input-container">
                  <div className="rate-input-field">
                    <Input
                      type={"number"}
                      label="Rate"
                      value={createCommission.rate}
                      name="rate"
                      placeholder={"Rate"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                  <div className="rate-input-field">
                    <Input
                      type={"number"}
                      label="Rate List"
                      value={createCommission.rl}
                      name="rl"
                      placeholder={"Rate List"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                </div>
                <div className="start-input-container">
                  <div className="rate-input-field">
                    <Input
                      type={"date"}
                      label="Start Date"
                      value={createCommission.start_date}
                      name="start_date"
                      placeholder={"1/04/2004"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                  <div className="rate-input-field">
                    <Input
                      type={"date"}
                      label="End Date"
                      value={createCommission.end_date}
                      name="end_date"
                      placeholder={"10/04/2004"}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="createUserActionButton">
          <ActionButton
            title={"Cancel"}
            type="reset"
            onClick={() => handleClose()}
          />
          <ActionButton
            title={editMode === false ? "Save" : "Update"}
            type="submit"
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateAutoAdder;
