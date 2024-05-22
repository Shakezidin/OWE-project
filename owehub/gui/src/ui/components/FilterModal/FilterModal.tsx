import { useEffect, useRef, useState } from 'react';
import OperationSelect from './OperationSelect';
import { useAppDispatch } from '../../../redux/hooks';
import { ICONS } from '../../icons/Icons';
import SelectOption from '../selectOption/SelectOption';
import Input from '../text_input/Input';
import { ActionButton } from '../button/ActionButton';
import {
  activeFilter,
  disableFilter,
} from '../../../redux/apiSlice/filterSlice/filterSlice';
import { useLocation } from 'react-router-dom';
import { showAlert } from '../alert/ShowAlert';

interface Column {
  name: string;
  displayName: string;
  type: string;
}
interface TableProps {
  handleClose: () => void;
  columns: Column[];
  page_number: number;
  page_size: number;
  fetchFunction: (req: any) => void;
  resetOnChange?: boolean;
  isOpen?: boolean;
}
interface FilterModel {
  Column: string;
  Operation: string;
  Data: string;
}
interface Option {
  value: string;
  label: string;
}

interface ErrorState {
  [key: string]: string;
}
// Filter component
const FilterModal: React.FC<TableProps> = ({
  handleClose,
  columns,
  page_number,
  page_size,
  fetchFunction,
  resetOnChange,
}) => {
  const dispatch = useAppDispatch();
  const [filters, setFilters] = useState<FilterModel[]>([
    { Column: '', Operation: '', Data: '' },
  ]);

  const [applyFilters, setApplyFilters] = useState<FilterModel[]>([
    { Column: '', Operation: '', Data: '' },
  ]);
  const [errors, setErrors] = useState<ErrorState>({});
  const options: Option[] = columns.map((column) => ({
    value: column.name,
    label: column.displayName,
  }));
  const { pathname } = useLocation();
  const init = useRef(true);

  useEffect(() => {
    setApplyFilters([...filters]);
  }, []);
  const resetAllFilter = async () => {
    const confirmed = await showAlert(
      'Reset Filters',
      'Are you sure you want to reset all of your filters?',
      'Yes',
      'No'
    );
    if (confirmed) {
      const resetFilters = filters
        .filter((_, ind) => ind === 0)
        .map((filter) => ({
          ...filter,
          Column: '',
          Operation: '',
          Data: '',
        }));
      setFilters(resetFilters);
      setApplyFilters(resetFilters);
      if (
        filters.some(
          (filter) => filter.Operation || filter.Data || filter.Column
        )
      ) {
        const req = {
          page_number: page_number,
          page_size: page_size,
        };
        fetchFunction(req);
      }
      handleClose();
      dispatch(disableFilter({ name: pathname }));
      setErrors({});
    }
  };
  useEffect(() => {
    const resetFilters = filters
      .filter((_, ind) => ind === 0)
      .map((filter) => ({
        ...filter,
        Column: '',
        Operation: '',
        Data: '',
      }));
    setFilters(resetFilters);
    setErrors({});
    if (init.current) {
      init.current = false;
    } else {
      fetchFunction({ page_number, page_size });
      setApplyFilters([...resetFilters]);
    }

    return () => {
      dispatch(disableFilter({ name: pathname }));
    };
  }, [resetOnChange]);

  const handleAddRow = () => {
    setFilters([...filters, { Column: '', Operation: '', Data: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    if (filters.length === 1) {
      // Close the modal if only one row is present
      handleClose();
      return;
    }
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  };

  const handleChange = (
    index: number,
    field: keyof FilterModel,
    value: any
  ) => {
    const newRules = [...filters];
    newRules[index][field] = value;
    newRules[index].Data = '';
    setFilters(newRules);
  };
  const handleDataChange = (index: number, value: string) => {
    const newFilters = [...filters];
    // Convert ".1" to "0.1" if the column is "rate" or "rate list"
    if (
      newFilters[index].Column === 'rate' ||
      newFilters[index].Column === 'rl'
    ) {
      value = value.replace(/^(\.)(\d+)/, '0$1$2');
    }
    newFilters[index].Data = value;
    setFilters(newFilters);
  };
  const getInputType = (columnName: string) => {
    const type = columns.find((option) => option.name === columnName)?.type;
    if (type === 'number') {
      return 'number';
    } else if (type === 'date') {
      return 'date';
    } else {
      return 'text';
    }
  };

  const applyFilter = async () => {
    setErrors({});

    // Perform validation
    const newErrors: ErrorState = {};

    filters.forEach((filter, index) => {
      if (!filter.Column) {
        newErrors[`column${index}`] = `Please provide Column`;
      }
      if (!filter.Operation) {
        newErrors[`operation${index}`] = `Please provide Operation`;
      }
      if (!filter.Data) {
        newErrors[`data${index}`] = `Please provide Data`;
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const formattedFilters = filters.map((filter) => ({
        Column: filter.Column,
        Operation: filter.Operation,
        Data: filter.Data,
      }));
      const req = {
        page_number: page_number,
        page_size: page_size,
        filters: formattedFilters,
      };
      setApplyFilters([...formattedFilters]);
      dispatch(activeFilter({ name: pathname }));
      handleClose();
      fetchFunction(req);
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setErrors({});
  };
  console.log(filters, 'filtersss', applyFilters);
  return (
    <div className="transparent-model">
      <div className="modal">
        <div className="filter-section">
          <h3 className="createProfileText" style={{ margin: 0 }}>
            Filter
          </h3>
          <div className="iconsSection2">
            <button
              type="button"
              style={{
                color: 'black',
                border: '1px solid #ACACAC',
              }}
              onClick={handleAddRow}
            >
              <img
                src={ICONS.BlackAddIcon}
                alt=""
                style={{ width: '14px', height: '14px' }}
              />{' '}
              Add New
            </button>
          </div>
        </div>
        <div className="modal-body">
          <div className="createProfileInputView">
            <div className="createProfileTextView">
              {filters?.map((filter, index) => (
                <div className="create-input-container" key={index}>
                  <div className="create-input-field">
                    <label className="inputLabel-select">Column Name</label>
                    <div className="">
                      <SelectOption
                        options={[
                          { value: 'Select', label: 'Select' },
                          ...options,
                        ]}
                        value={
                          options.find(
                            (option) => option.value === filter.Column
                          ) || undefined
                        }
                        onChange={(selectedOption: any) => {
                          handleChange(index, 'Column', selectedOption.value);
                          setErrors({ ...errors, [`column${index}`]: '' });
                        }}
                      />

                      {errors[`column${index}`] && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                          {errors[`column${index}`]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="create-input-field">
                    <label className="inputLabel-select">Operation</label>
                    <OperationSelect
                      options={options}
                      columnType={
                        columns.find((option) => option.name === filter.Column)
                          ?.type || ''
                      }
                      value={filter.Operation}
                      onChange={(value: any) => {
                        handleChange(index, 'Operation', value);
                        setErrors({ ...errors, [`operation${index}`]: '' });
                      }}
                      errors={errors}
                      index={index}
                    />
                  </div>

                  <div className="create-input-field">
                    <Input
                      type={getInputType(filter.Column)}
                      label="Data"
                      name="Data"
                      value={filter.Data}
                      onChange={(e: any) => {
                        handleDataChange(index, e.target.value);
                        setErrors({ ...errors, [`data${index}`]: '' });
                      }}
                      placeholder={'Enter'}
                    />
                    {errors[`data${index}`] && (
                      <span style={{ color: 'red', fontSize: '12px' }}>
                        {errors[`data${index}`]}
                      </span>
                    )}
                  </div>
                  {index !== 0 && (
                    // <div
                    //     className="cross-btn"
                    //     onClick={() => handleRemoveRow(index)}
                    // >
                    //     <img src={ICONS.cross} alt="" />
                    // </div>
                    <div
                      className="fildelb-btn"
                      onClick={() => handleRemoveRow(index)}
                    >
                      <img src={ICONS.deleteIcon} alt="" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="createUserActionButton">
          <div className="" style={{ gap: '0.6rem', display: 'flex' }}>
            <ActionButton
              title={'Cancel'}
              type="reset"
              onClick={() => {
                handleCloseModal();
                const deepCopy = JSON.parse(JSON.stringify(applyFilters));
                setFilters(deepCopy);
              }}
            />
            <ActionButton
              title={'reset'}
              type="reset"
              onClick={resetAllFilter}
              disabled={
                !filters.some(
                  (filter) => filter.Operation || filter.Data || filter.Column
                )
              }
              style={{ color: '#0493ce' }}
            />
            <ActionButton
              title={'Apply'}
              type="submit"
              onClick={() => applyFilter()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default FilterModal;
