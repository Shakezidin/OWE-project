import React, { useEffect, useState } from "react";
import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";

import { ActionButton } from "../../../components/button/ActionButton";
import Select from "react-select";
import {
  chg_dlrOption,
  dbaOption,
  sourceOption,
  stateOption,
} from "../../../../core/models/data_models/SelectDataModel";
import { updateMarketingForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createMarketingSlice";

import { useDispatch } from "react-redux";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import {
  chldlrData,
  dbaData,
} from "../../../../resources/static_data/StaticData";
import { MarketingFeeModel } from "../../../../core/models/configuration/create/MarketingFeeModel";
import SelectOption from "../../../components/selectOption/SelectOption";
interface marketingProps {
  handleClose: () => void;
  editMode: boolean;
  marketingData: MarketingFeeModel | null;
}

const CreateMarketingFees: React.FC<marketingProps> = ({
  handleClose,
  editMode,
  marketingData,
}) => {
  const dispatch = useDispatch();
  console.log(marketingData);
  const [createMarketing, setCreateMarketing] = useState<MarketingFeeModel>({
    record_id: marketingData ? marketingData.record_id : 0,
    source: marketingData ? marketingData.source : "PRINT",
    dba: marketingData ? marketingData.dba : "Marketing DBA Name1",
    state: marketingData ? marketingData.state : "Alabama",
    fee_rate: marketingData ? marketingData.fee_rate : "100",
    chg_dlr: marketingData ? marketingData.chg_dlr : 100, // Example integer value for ChgDlr
    pay_src: marketingData ? marketingData.pay_src : 200, // Example integer value for PaySrc
    start_date: marketingData ? marketingData.start_date : "2024-03-22",
    end_date: marketingData ? marketingData.end_date : "2024-04-22",
    description: marketingData
      ? marketingData.description
      : "Marketing Fee Description1",
  });
  const [newFormData, setNewFormData] = useState<any>([]);
  const tableData = {
    tableNames: ["states", "source", "dba", "chg_dlr"],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateMarketing((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : "",
    }));
  };
  const handlemarketingInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateMarketing((prevData) => ({
      ...prevData,
      [name]: name === "pay_src" ? parseFloat(value) : value,
    }));
  };

  const submitMarketingFees = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(updateMarketingForm(createMarketing));
      if (createMarketing.record_id) {
        const res = await postCaller(
          EndPoints.update_marketingfee,
          createMarketing
        );
        if (res.status === 200) {
          alert(res.message);
          handleClose();
          window.location.reload();
        } else {
          alert(res.message);
        }
      } else {
        const { record_id, ...cleanedFormData } = createMarketing;
        const res = await postCaller(
          EndPoints.create_marketingfee,
          cleanedFormData
        );
        if (res.status === 200) {
          alert(res.message);
          handleClose();
          window.location.reload();
        } else {
          alert(res.message);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div className="transparent-model">
      <form
     
        onSubmit={(e) => submitMarketingFees(e)}
        className="modal"
      >
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? "Marketing Fees" : "Update Marketing Fees"}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select">Source</label>
                  <SelectOption
                    options={sourceOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, "source")}
                    value={sourceOption(newFormData)?.find(
                      (option) => option.value === createMarketing.source
                    )}
                  />
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">DBA</label>
                  <SelectOption
                    options={dbaOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, "dba")}
                    value={
                      dbaOption(newFormData)?.find(
                        (option) => option.value === createMarketing.dba
                      )
                    }
                  />
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">State</label>
                  <SelectOption
                    options={stateOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, "state")}
                    value={stateOption(newFormData)?.find(
                      (option) => option.value === createMarketing.state
                    )}
                  />
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Fee Rate"
                    value={createMarketing.fee_rate}
                    name="fee_rate"
                    placeholder={"Enter"}
                    onChange={(e) => handlemarketingInputChange(e)}
                  />
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">Chg DLR</label>
                  <SelectOption
                    options={chg_dlrOption(newFormData)}
                    
                    onChange={(newValue) => handleChange(newValue, "chg_dlr")}
                    value={
                      chg_dlrOption(newFormData)?.find(
                        (option: any) =>
                          option.value === createMarketing.chg_dlr
                      )
                    }
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Pay Src"
                    value={createMarketing.pay_src}
                    name="pay_src"
                    placeholder={"Enter"}
                    onChange={(e) => handlemarketingInputChange(e)}
                  />
                </div>
              </div>
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Start Date"
                    value={createMarketing.start_date}
                    name="start_date"
                    placeholder={"1/04/2004"}
                    onChange={(e) => handlemarketingInputChange(e)}
                  />
                </div>

                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="End Date"
                    value={createMarketing.end_date}
                    name="end_date"
                    placeholder={"10/04/2004"}
                    onChange={(e) => handlemarketingInputChange(e)}
                  />
                </div>
              </div>

              <div className="create-input-field-note">
                <label htmlFor="" className="inputLabel">
                  Note
                </label>{" "}
                <br />
                <textarea
                  name={createMarketing.description}
                  id=""
                  rows={4}
                  onChange={(e) => handlemarketingInputChange(e)}
                  value={createMarketing.description}
                  placeholder="Type"
                ></textarea>
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

export default CreateMarketingFees;
