import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { useDispatch } from "react-redux";

import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import Select from "react-select";
import {
  dealerOption,
  subDealerOption,
} from "../../../../core/models/data_models/SelectDataModel";
import { updateDealerForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createDealerSlice";
import {
  dealer,
  subDealer,
} from "../../../../resources/static_data/StaticData";
import { DealerModel } from "../../../../core/models/configuration/create/DealerModel";
import SelectOption from "../../../components/selectOption/SelectOption";

interface dealerProps {
  handleClose: () => void;
  editMode: boolean;
  dealerData: DealerModel | null;
  page_number: number;
  page_size: number;
}

const CreateDealer: React.FC<dealerProps> = ({
  handleClose,
  editMode,
  page_number,
  page_size,
  dealerData,
}) => {
  const dispatch = useDispatch();

  const [createDealer, setCreateDealer] = useState<DealerModel>({
    record_id: dealerData ? dealerData?.record_id : 0,
    sub_dealer: dealerData ? dealerData?.sub_dealer : "Sub Dealer Name1",
    dealer: dealerData ? dealerData?.dealer : "Shushank Sharma",
    pay_rate: dealerData ? dealerData?.pay_rate : "500",
    start_date: dealerData ? dealerData?.start_date : "2024-04-01",
    end_date: dealerData ? dealerData?.end_date : "2024-04-30",
  });
  const [newFormData, setNewFormData] = useState<any>([]);
  const tableData = {
    tableNames: ["sub_dealer", "dealer"],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  const handleChange = (newValue: any, fieldName: string) => {
    setCreateDealer((prevData) => ({
      ...prevData,
      [fieldName]: newValue ? newValue.value : "",
    }));
  };
  const handleDealerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateDealer((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitDealer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(updateDealerForm(createDealer));
      if (createDealer.record_id) {
        const res = await postCaller(EndPoints.update_dealer, createDealer);
        if (res.status === 200) {
          alert(res.message);
      
          window.location.reload();
          handleClose();
        } else {
          alert(res.message);
        }
      } else {
        const { record_id, ...cleanedFormData } = createDealer;
        const res = await postCaller(EndPoints.create_dealer, cleanedFormData);
        if (res.status === 200) {
          alert(res.message);
          window.location.reload();
          handleClose();
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
      <form onSubmit={(e) => submitDealer(e)} className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <span className="createProfileText">
          {editMode === false ? "Dealer Overrides" : "Update Dealer Overrides"}
        </span>
        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <label className="inputLabel-select">Sub Dealer</label>
                  <SelectOption
                    options={subDealerOption(newFormData)||subDealer}
                    onChange={(newValue) =>
                      handleChange(newValue, "sub_dealer")
                    }
                    value={
                      subDealerOption(newFormData)?.find(
                        (option) => option.value === createDealer.sub_dealer
                      )
                    }
                  />
                </div>
                <div className="create-input-field">
                  <label className="inputLabel-select">Dealer</label>
                  <SelectOption
                    options={dealerOption(newFormData)}
                    onChange={(newValue) => handleChange(newValue, "dealer")}
                    value={
                      dealerOption(newFormData)?.find(
                        (option) => option.value === createDealer.dealer)}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"text"}
                    label="Pay Rate"
                    name="pay_rate"
                    value={createDealer.pay_rate}
                    placeholder={"Enter"}
                    onChange={(e) => handleDealerInputChange(e)}
                  />
                </div>
              
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="Start Date"
                    value={createDealer.start_date}
                    name="start_date"
                    placeholder={"Enter"}
                    onChange={(e) => handleDealerInputChange(e)}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={"date"}
                    label="End Date"
                    name="end_date"
                    value={createDealer.end_date}
                    placeholder={"Enter"}
                    onChange={(e) => handleDealerInputChange(e)}
                  />
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

export default CreateDealer;
