import React, { useEffect, useState } from 'react';

import { ReactComponent as CROSS_BUTTON } from '../../../../resources/assets/cross_button.svg';
import Input from '../../../components/text_input/Input';
import { ActionButton } from '../../../components/button/ActionButton';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { useDispatch } from 'react-redux';
interface payScheduleProps {
  handleClose: () => void;
  editMode: boolean;
}

const CreatedArImport: React.FC<payScheduleProps> = ({
  handleClose,
  editMode,
}) => {
  const dispatch = useDispatch();
  const [newFormData, setNewFormData] = useState<any>([]);

  const tableData = {
    tableNames: ['partners', 'states', 'installers', 'sale_type'],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  useEffect(() => {
    getNewFormData();
  }, []);

  return (
    <div className="transparent-model">
      <form className="modal">
        <div className="createUserCrossButton" onClick={handleClose}>
          <CROSS_BUTTON />
        </div>

        <h3 className="createProfileText">
          {editMode === false ? 'Rep Pay Settings' : 'Update RepPay Settings'}
        </h3>

        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Customer Name"
                    value={''}
                    name="dealer_tier"
                    placeholder={'Enter'}
                    onChange={() => {}}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Unique ID"
                    value={''}
                    name="dealer_tier"
                    placeholder={'Enter'}
                    onChange={() => {}}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Date"
                    value={''}
                    name="dealer_tier"
                    placeholder={'Enter'}
                    onChange={() => {}}
                  />
                </div>
              </div>

              <div className="create-input-container">
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Amount"
                    value={''}
                    name="dealer_tier"
                    placeholder={'Enter'}
                    onChange={() => {}}
                  />
                </div>
                <div className="create-input-field">
                  <Input
                    type={'text'}
                    label="Note"
                    value={''}
                    name="dealer_tier"
                    placeholder={'Enter'}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="createUserActionButton">
          <ActionButton
            title={'Cancel'}
            type="reset"
            onClick={() => handleClose()}
          />
          <ActionButton
            title={editMode === false ? 'Save' : 'Update'}
            type="submit"
            onClick={() => {}}
          />
        </div>
      </form>
    </div>
  );
};

export default CreatedArImport;
