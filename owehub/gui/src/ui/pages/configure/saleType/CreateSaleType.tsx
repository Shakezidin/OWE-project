import React, { Dispatch, SetStateAction, useState } from 'react';
import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { useDispatch } from 'react-redux';
import { updateSalesForm } from '../../../../redux/apiSlice/configSlice/config_post_slice/createSalesTypeSlice';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { SalesTypeModel } from '../../../../core/models/configuration/create/SalesTypeModel';
import { FormEvent } from '../../../../core/models/data_models/typesModel';
import { toast } from 'react-toastify';

interface salesProps {
  handleClose: () => void;
  salesTypeData: SalesTypeModel | null;
  editMode: boolean;
  setRefetch:Dispatch<SetStateAction<number>>
}

const CreateSaleType: React.FC<salesProps> = ({
  handleClose,
  salesTypeData,
  editMode,
  setRefetch
}) => {
  const dispatch = useDispatch();
  console.log(salesTypeData);
  const [createSales, setCreateSales] = useState<SalesTypeModel>({
    record_id: salesTypeData ? salesTypeData?.record_id : 0,
    type_name: salesTypeData ? salesTypeData?.type_name : '',
    description: salesTypeData ? salesTypeData?.description : '',
  });
  const [isPending, setIsPending] = useState(false)

  const handleSalesChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateSales((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitSalesType = async (e: FormEvent) => {
    e.preventDefault();
    setIsPending(true)
    try {
      dispatch(updateSalesForm(createSales));
      if (createSales.record_id) {
        const res = await postCaller(EndPoints.update_saletype, createSales);
        if (res.status === 200) {
          toast.success(res.message);
          handleClose();
          setIsPending(false)
          setRefetch(prev=>prev+1)
        } else {
          setIsPending(false)
          toast.error(res.message);
        }
      } else {
        const { record_id, ...cleanedFormData } = createSales;
        const res = await postCaller(
          EndPoints.create_saletype,
          cleanedFormData
        );
        if (res.status === 200) {
          toast.success(res.message);
          handleClose();
          setIsPending(false)
          setRefetch(prev=>prev+1)
        } else {
          setIsPending(false)
          toast.error(res.message);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <div className="transparent-model">
      <div className="sales-modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>
        <div className="createUserContainer">
          <h3 className="createProfileText">
            {editMode === false ? 'Create Sale Type' : 'Update Sale Type'}
          </h3>
          <form onSubmit={(e) => submitSalesType(e)}>
            <div className="createProfileInputView">
              <div className="createProfileTextView">
                <div className="create-input-container">
                  <div className="create-input-field-note">
                    <Input
                      type={'text'}
                      label="Name"
                      value={createSales.type_name}
                      name="type_name"
                      placeholder={'Name'}
                      onChange={(e) => handleSalesChange(e)}
                    />
                  </div>
                </div>
                <div className="create-input-field-note">
                  <label htmlFor="" className="inputLabel">
                    Note
                  </label>{' '}
                  <br />
                  <textarea
                    name="description"
                    id=""
                    rows={4}
                    value={createSales.description}
                    onChange={(e) => handleSalesChange(e)}
                    placeholder="Type"
                  ></textarea>
                </div>
              </div>
              <div
                className="createUserActionButton"
                style={{ marginTop: '32px' }}
              >
                <ActionButton
                  title={'Cancel'}
                  type="reset"
                  onClick={() => handleClose()}
                />
                <ActionButton
                  title={editMode === false ? 'Create' : 'Update'}
                  type="submit"
                  disabled={isPending}
                  onClick={() => {}}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSaleType;
