import React, { useState } from 'react';
import DropdownCheckBox from '../../../components/DropdownCheckBox';

interface Option {
  value: string;
  label: string;
}

interface CompanySelectProps {
  onOfficeChange?: (values: string[]) => void; // Callback function to send values to parent
}

const CompanySelect: React.FC<CompanySelectProps> = ({ onOfficeChange = ()=>{ } }) => {
  const [selectedDealer, setSelectedDealer] = useState<Option[]>([]);

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
        options={[
          { label: `#N/A`, value: `#N/A` },
          { label: `Peoria/Kingman`, value: `Peoria/Kingman` },
          { label: 'Tucson', value: 'Tucson' },
          { label: `Colorado`, value: `Colorado` },
          { label: 'Albuquerque/El Paso', value: 'Albuquerque/El Paso' },
          { label: `Tempe`, value: `Tempe` },
          { label: 'Texas', value: 'Texas' },
        ]}
        onChange={handleChange}
      />
    </div>
  );
};

export default CompanySelect;
