import React, { useEffect, useState } from 'react';
import DropdownCheckBox from '../../../components/DropdownCheckBox';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { getDropDownData } from '../../../../redux/apiActions/reportingAction/reportingAction';

interface Option {
  value: string;
  label: string;
}

interface CompanySelectProps {
  onOfficeChange?: (values: string[]) => void; // Callback function to send values to parent
}

const CompanySelect: React.FC<CompanySelectProps> = ({ onOfficeChange = () => { } }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getDropDownData({}));
  }, []);

  const { dropdownData } = useAppSelector(
    (state) => state.reportingSlice
  );

  console.log(dropdownData, "data is sjowhwug")

  const [selectedDealer, setSelectedDealer] = useState<Option[]>([]);

  const [officeSelect, setOfficeSelect] = useState([]);

  useEffect(() => {
    if (!dropdownData.loading && dropdownData) {
      const officeData = dropdownData?.data?.offices?.map((office: any) => ({
        label: office,
        value: office,
      }));
      setOfficeSelect(officeData);
    }
  }, [dropdownData])

  const handleChange = (val: Option[]) => {
    setSelectedDealer(val);
    // Extract values and send to parent
    onOfficeChange(val.map(option => option.value));
  };

  return (
    <div>
      <DropdownCheckBox
        label={selectedDealer.length === 1 ? 'Office' : 'Office'}
        placeholder={'Search Office'}
        selectedOptions={selectedDealer}
        options={officeSelect ? officeSelect : []}
        onChange={handleChange}
      />
    </div>
  );
};

export default CompanySelect;
