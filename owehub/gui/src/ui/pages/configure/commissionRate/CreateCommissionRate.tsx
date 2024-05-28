import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../redux/hooks';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { updateForm } from '../../../../redux/apiSlice/configSlice/config_post_slice/createCommissionSlice';
import { CommissionModel } from '../../../../core/models/configuration/create/CommissionModel';
import { HTTP_STATUS } from '../../../../core/models/api_models/RequestModel';
import { validateConfigForm } from '../../../../utiles/configFormValidation';
import { fetchCommissions } from '../../../../redux/apiSlice/configSlice/config_get_slice/commissionSlice';
import CommissionForm from './CommissionForm';
import { errorSwal, successSwal } from '../../../components/alert/ShowAlert';
import {
  FormEvent,
  FormInput,
} from '../../../../core/models/data_models/typesModel';
import { toast } from 'react-toastify';
interface ButtonProps {
  editMode: boolean;
  handleClose: () => void;
  commission: CommissionModel | null;
  pageNumber: number;
  pageSize: number;
}

const CreateCommissionRate: React.FC<ButtonProps> = ({
  handleClose,
  commission,
  editMode,
  pageNumber,
  pageSize,
}) => {
  const dispatch = useAppDispatch();
  console.log(commission);
  const [createCommission, setCreateCommission] = useState<CommissionModel>({
    record_id: commission ? commission?.record_id : 0,
    partner: commission ? commission?.partner : '',
    installer: commission ? commission?.installer : '',
    state: commission ? commission?.state : '',
    sale_type: commission ? commission?.sale_type : '',
    sale_price: commission ? commission?.sale_price : '',
    rep_type: commission ? commission?.rep_type : '',
    rl: commission ? commission?.rl : '',
    rate: commission ? commission?.rate : '',
    start_date: commission ? commission?.start_date : '',
    end_date: commission ? commission?.end_date : '',
  });
  const [newFormData, setNewFormData] = useState<any>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPending,setIsPending] = useState(false)
  const tableData = {
    tableNames: ['partners', 'states', 'installers', 'rep_type', 'sale_type'],
  };
  const userType = {
    role: 'rep_type',
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
  };
  console.log(newFormData);
  const getUser = async () => {
    const res = await postCaller(EndPoints.get_user_by_role, userType);
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
      [fieldName]: newValue ? newValue.value : '',
    }));
  };
  const handleInputChange = (e: FormInput) => {
    const { name, value } = e.target;
    if (name === 'start_date') {
      setCreateCommission((prevData) => ({
        ...prevData,
        [name]: value,
        end_date: '',
      }));
      return;
    }
    setCreateCommission((prevData) => ({
      ...prevData,
      [name]:
        name === 'rl' || name === 'sale_price' || name === 'rate'
          ? parseFloat(value)
          : value,
    }));
  };
  const page = {
    page_number: pageNumber,
    page_size: pageSize,
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Define validation rules for each field
    const validationRules = {
      partner: [
        { condition: (value: any) => !!value, message: 'Partner is required' },
      ],
      installer: [
        {
          condition: (value: any) => !!value,
          message: 'Installer is required',
        },
      ],
      state: [
        { condition: (value: any) => !!value, message: 'State is required' },
      ],
      sale_type: [
        {
          condition: (value: any) => !!value,
          message: 'Sales Type is required',
        },
      ],
      sale_price: [
        {
          condition: (value: any) => !!value,
          message: 'Sales Price is required',
        },
      ],
      rep_type: [
        { condition: (value: any) => !!value, message: 'Rep Type is required' },
      ],
      rate: [
        { condition: (value: any) => !!value, message: 'Rate is required' },
      ],
      rl: [{ condition: (value: any) => !!value, message: 'RL is required' }],
      start_date: [
        {
          condition: (value: any) => !!value,
          message: 'Start Date is required',
        },
      ],
      end_date: [
        { condition: (value: any) => !!value, message: 'End Date is required' },
      ],
    };
    const { isValid, errors } = validateConfigForm(
      createCommission!,
      validationRules
    );
    if (!isValid) {
      setErrors(errors);
      return;
    }
    try {
      setIsPending(true)
      dispatch(updateForm(createCommission));
      if (createCommission.record_id) {
        const res = await postCaller(
          EndPoints.update_commission,
          createCommission
        );
        if (res.status === HTTP_STATUS.OK) {
          toast.success(res.message);
          handleClose();
          setIsPending(false)
          dispatch(fetchCommissions(page));
        } else {
          toast.error(res.message);
          setIsPending(false)
        }
      } else {
        const { record_id, ...cleanedFormData } = createCommission;
        const res = await postCaller(
          EndPoints.create_commission,
          cleanedFormData
        );
        if (res.status === HTTP_STATUS.OK) {
          toast.success(res.message);
          handleClose();
          setIsPending(false)
          dispatch(fetchCommissions(page));
        } else {
          toast.error(res.message);
          setIsPending(false)
        }
      }
      // dispatch(resetForm());
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  return (
    <CommissionForm
      handleChange={handleChange}
      handleClose={handleClose}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      editMode={editMode}
      createCommission={createCommission}
      errors={errors}
      newFormData={newFormData}
      isPending={isPending}
    />
  );
};

export default CreateCommissionRate;
