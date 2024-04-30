import React, { useEffect, useState } from "react";

import { ReactComponent as CROSS_BUTTON } from "../../../../resources/assets/cross_button.svg";
import Input from "../../../components/text_input/Input";
import { ActionButton } from "../../../components/button/ActionButton";
import { updateDealerTierForm } from "../../../../redux/apiSlice/configSlice/config_post_slice/createDealerTierSlice";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { useDispatch } from "react-redux";
import { dealertierOption } from "../../../../core/models/data_models/SelectDataModel";


import { DealerTierModel } from "../../../../core/models/configuration/create/DealerTierModel";
import SelectOption from "../../../components/selectOption/SelectOption";
import { useAppDispatch } from "../../../../redux/hooks";
import { fetchDealerTier } from "../../../../redux/apiSlice/configSlice/config_get_slice/dealerTierSlice";
import { errorSwal, successSwal } from "../../../components/alert/ShowAlert";
import { validateConfigForm } from "../../../../utiles/configFormValidation";
interface dealerProps {
    handleClose: () => void,
    editMode: boolean,
    editDealerTier: DealerTierModel | null;
    page_number: number;
    page_size: number;
}
const CreateDealerTier: React.FC<dealerProps> = ({ handleClose, editMode, editDealerTier, page_number, page_size }) => {
    const dispatch = useAppDispatch();

    const [createDealerTierData, setCreateDealerTierData] = useState<DealerTierModel>(
        {
            record_id: editDealerTier ? editDealerTier?.record_id : 0,
            dealer_name: editDealerTier ? editDealerTier?.dealer_name : "Shushank Sharma",
            tier: editDealerTier ? editDealerTier?.tier : "",
            start_date: editDealerTier ? editDealerTier?.start_date : "2024-04-01",
            end_date: editDealerTier ? editDealerTier?.end_date : "2024-04-30"
        }
    )
    const [newFormData, setNewFormData] = useState<any>([])
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const tableData = {
        tableNames: ["tier"]
    }
    const getNewFormData = async () => {
        const res = await postCaller(EndPoints.get_newFormData, tableData)
        setNewFormData(res.data)

    }
    useEffect(() => {
        getNewFormData()
    }, [])

    const page = {
        page_number: page_number,
        page_size: page_size,

    };

    const handleChange = (newValue: any, fieldName: string) => {
        setCreateDealerTierData((prevData) => ({
            ...prevData,
            [fieldName]: newValue ? newValue.value : '',
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [fieldName]: ''
        }));
    };
    const handleTierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreateDealerTierData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const submitTierLoan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationRules = {
            dealer_name: [{ condition: (value: any) => !!value, message: "Dealer Name is required" }],
            tier: [{ condition: (value: any) => !!value, message: "Tier Name is required" }],

            start_date: [{ condition: (value: any) => !!value, message: "Start Date is required" }],
            end_date: [{ condition: (value: any) => !!value, message: "End Date is required" }],

        };
        const { isValid, errors } = validateConfigForm(createDealerTierData!, validationRules);
        if (!isValid) {
            setErrors(errors);
            return;
        }
        try {
            dispatch(updateDealerTierForm(createDealerTierData));
            if (createDealerTierData.record_id) {
                const res = await postCaller(EndPoints.update_dealertier, createDealerTierData);
                if (res?.status === 200) {
                    await successSwal("", res.message, "success", 2000, false);
                    handleClose()
                    dispatch(fetchDealerTier(page))

                }
                else {
                    await errorSwal("", res.message, "error", 2000, false);
                }
            }
            else {
                const { record_id, ...cleanedFormData } = createDealerTierData;
                const res = await postCaller(EndPoints.create_dealertier, cleanedFormData);
                if (res?.status === 200) {
                    await successSwal("", res.message, "success", 2000, false);
                    handleClose()
                    dispatch(fetchDealerTier(page))
                }
                else {
                    await errorSwal("", res.message, "error", 2000, false);
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    return (
        <div className="transparent-model">
            <form onSubmit={(e) => submitTierLoan(e)} className="modal">

                <div className="createUserCrossButton" onClick={handleClose}>
                    <CROSS_BUTTON />
                </div>

                <h3 className="createProfileText">{editMode === false ? "Dealer Tier" : "Update Dealer Tier"}</h3>

                <div className="modal-body">
                    <div className="createProfileInputView">
                        <div className="createProfileTextView">
                            <div className="create-input-container">
                                <div className="create-input-field">
                                    <Input
                                        type={"text"}
                                        label="Dealer Name"
                                        value={createDealerTierData.dealer_name}
                                        name="dealer_name"
                                        placeholder={"Enter"}
                                        onChange={(e) => handleTierChange(e)}
                                    />
                                    {errors.dealer_name && <span className="error">{errors.dealer_name}</span>}
                                </div>
                                <div className="create-input-field">
                                    <label className="inputLabel-select">Tier</label>
                                    <SelectOption
                                        options={dealertierOption(newFormData)}
                                        onChange={(newValue) => handleChange(newValue, 'tier')}
                                        value={dealertierOption(newFormData)?.find((option) => option.value === createDealerTierData.tier)}
                                    />
                                    {errors.tier && <span className="error">{errors.tier}</span>}
                                </div>
                                <div className="create-input-field">
                                    <Input
                                        type={"date"}
                                        label="Start Date"
                                        value={createDealerTierData.start_date}
                                        name="start_date"
                                        placeholder={"1/04/2004"}
                                        onChange={(e) => handleTierChange(e)}
                                    />
                                    {errors.start_date && <span className="error">{errors.start_date}</span>}
                                </div>
                            </div>
                            <div className="create-input-container">
                                <div className="create-input-field">
                                    <Input
                                        type={"date"}
                                        label="End Date"
                                        value={createDealerTierData.end_date}
                                        name="end_date"
                                        placeholder={"10/04/2004"}
                                        onChange={(e) => handleTierChange(e)}
                                    />
                                    {errors.end_date && <span className="error">{errors.end_date}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="createUserActionButton">
                    <ActionButton title={"Cancel"} type="reset"
                        onClick={() => handleClose()} />
                    <ActionButton title={editMode === false ? "Save" : "Update"} type="submit"
                        onClick={() => { }} />
                </div>




            </form>
        </div>
    );
};

export default CreateDealerTier;
