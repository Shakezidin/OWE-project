import React from 'react';
import DropdownCheckBox from '../../components/DropdownCheckBox';
import YearSelect from '../components/Dropdowns/YearSelect';

interface FiltersProps {
  selectedOffices: any[];
  setSelectedOffices: (offices: any[]) => void;
  selectedState: any[];
  setSelectedState: (state: any[]) => void;
  selectedYear: any;
  handleYearChange: (value: any) => void;
  selectedQuarter: any[];
  setSelectedQuarter: (quarter: any[]) => void;
  selectedAhj: any[];
  setSelectedAhj: (ahj: any[]) => void;
  officeSelect: any[];
  stateSet: any[];
  QuarterSet: any[];
  ahj: any[];
  loading: boolean;
  selectloading: boolean;
}

const Filters: React.FC<FiltersProps> = ({
  selectedOffices,
  setSelectedOffices,
  selectedState,
  setSelectedState,
  selectedYear,
  handleYearChange,
  selectedQuarter,
  setSelectedQuarter,
  selectedAhj,
  setSelectedAhj,
  officeSelect,
  stateSet,
  QuarterSet,
  ahj,
  loading,
  selectloading,
}) => {
  return (
    <div className="report-header-dropdown flex-wrap">
      <div>
        <DropdownCheckBox
          label={'Offices'}
          placeholder={'Search Offices'}
          selectedOptions={selectedOffices}
          options={officeSelect}
          onChange={setSelectedOffices}
          disabled={selectloading || loading}
        />
      </div>
      <div>
        <DropdownCheckBox
          label={'State'}
          placeholder={'Search States'}
          selectedOptions={selectedState}
          options={stateSet}
          onChange={setSelectedState}
          disabled={selectloading || loading}
        />
      </div>
      <div>
        <YearSelect
          value={selectedYear}
          onChange={handleYearChange}
          disabled={selectloading || loading}
        />
      </div>
      <div>
        <DropdownCheckBox
          label={'Quarter'}
          placeholder={'Search Quarter'}
          selectedOptions={selectedQuarter}
          options={QuarterSet}
          onChange={setSelectedQuarter}
          disabled={selectloading || loading}
        />
      </div>
      <div>
        <DropdownCheckBox
          label={`${selectedAhj.length} AHJ's`}
          placeholder={'Search AHJ'}
          selectedOptions={selectedAhj}
          options={ahj}
          onChange={setSelectedAhj}
          disabled={selectloading || loading}
        />
      </div>
    </div>
  );
};

export default Filters; 