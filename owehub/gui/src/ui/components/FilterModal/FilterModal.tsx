import { useEffect, useRef, useState } from 'react';
import OperationSelect from './OperationSelect';
import { useAppDispatch } from '../../../redux/hooks';
import { ICONS } from '../../../resources/icons/Icons';
import SelectOption from '../selectOption/SelectOption';
import Input from '../text_input/Input';
import { ActionButton } from '../button/ActionButton';
import {
  activeFilter,
  disableFilter,
} from '../../../redux/apiSlice/filterSlice/filterSlice';
import { useLocation } from 'react-router-dom';
import { showAlert } from '../alert/ShowAlert';
import { dateFormat } from '../../../utiles/formatDate';

interface Column {
  name: string;
  filter?: string;
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
  isNew?: boolean;
}
interface FilterModel {
  Column: string;
  Operation: string;
  Data: string;
  type?: string;
  start_date?: string;
  end_date?: string;
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
  isNew
}) => {
  const dispatch = useAppDispatch();

  const data = {
    start: '',
    end: ''
  }
  const [filters, setFilters] = useState<FilterModel[]>([
    { Column: '', Operation: '', Data: '', start_date: "", end_date: '' },
  ]);

  const [applyFilters, setApplyFilters] = useState<FilterModel[]>([
    { Column: '', Operation: '', Data: '', start_date: "", end_date: '' },
  ]);
  const [errors, setErrors] = useState<ErrorState>({});
  const options: Option[] = columns.map((column) => ({
    value: column.filter ? column.filter : column.name,
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
    setFilters([...filters, { Column: '', Operation: '', Data: '', start_date: "", end_date: '' }]);
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
  const handleDataChange = (
    index: number,
    value: string,
    type: 'number' | 'date' | 'boolean' | 'text' | 'start' | 'end'
  ) => {
    const newFilters = [...filters];
    // Convert ".1" to "0.1" if the column is "rate" or "rate list"
    if (
      newFilters[index].Column === 'rate' ||
      newFilters[index].Column === 'rl'
    ) {
      value = value.replace(/^(\.)(\d+)/, '0$1$2');
    }
    
    newFilters[index].Data = value;
    newFilters[index].start_date = value;
    newFilters[index].end_date = value;
    newFilters[index].type = type;
    setFilters(newFilters);
  };



  const getInputType = (columnName: string) => {
    const type = columns.find((option) => (option.filter ? option.filter : option.name) === columnName)?.type;
    if (type === 'number') {
      return 'number';
    } else if (type === 'date') {
      return 'date';
    } else if (type === 'boolean') {
      return 'boolean';
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
        newErrors[`column${index}`] = `Please provide Column Name`;
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
        Data:
          filter.type === 'date'
            ? `${String(new Date(filter.Data).getMonth() + 1).padStart(2, '0')}-${String(new Date(filter.Data).getDate()).padStart(2, '0')}-${new Date(filter.Data).getFullYear()}`
            : filter.Data,
        start_date:
          (filter.type === 'date' && isNew === true)
            ? `${String(new Date(filter.start_date || '').getMonth() + 1).padStart(2, '0')}-${String(new Date(filter.start_date || '').getDate()).padStart(2, '0')}-${new Date(filter.start_date || '').getFullYear()}`
            : filter.start_date,
        end_date:
          (filter.type === 'date' && isNew === true)
            ? `${String(new Date(filter.end_date || '').getMonth() + 1).padStart(2, '0')}-${String(new Date(filter.end_date || '').getDate()).padStart(2, '0')}-${new Date(filter.end_date || '').getFullYear()}`
            : filter.start_date,
      }));
      const req = {
        page_number: page_number,
        page_size: page_size,
        filters: formattedFilters,
      };
      setApplyFilters([...formattedFilters]);
      dispatch(activeFilter({ name: pathname }));
      handleClose();
      // @ts-ignore
      req.filters = formattedFilters.map((filter) => ({
        ...filter,
        Data:
          filter.Data === 'yes' || filter.Data === 'no'
            ? filter.Data === 'yes'
            : filter.Data.trim(),
      }));
      fetchFunction(req);
    }
  };

  console.log(filters, "jhgghj")

  const handleCloseModal = () => {
    handleClose();
    setErrors({});
  };
  console.log(filters, ".Data")
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
                color: 'white',
                border: '1px solid #ACACAC',
              }}
              onClick={handleAddRow}
            >
              <img
                src={ICONS.AddIcon}
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
              {filters?.map((filter, index) => {
                const type = getInputType(filter.Column);
                console.log(type, 'type');
                return (
                  <div className="create-input-container" key={index}>
                    <div className="create-input-field">
                      <label
                        className="inputLabel-select"
                        style={{ fontWeight: 400 }}
                      >
                        Column Name
                      </label>
                      <div className="">
                        <SelectOption
                          options={[...options]}
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
                      <label
                        className="inputLabel-select"
                        style={{ fontWeight: 400 }}
                      >
                        Operation
                      </label>
                      <OperationSelect
                        options={options}
                        columnType={
                          columns.find(
                            (option) => (option.filter ? option.filter : option.name) === filter.Column
                          )?.type || ''
                        }
                        value={filter.Operation}
                        onChange={(value: any) => {
                          handleChange(index, 'Operation', value);
                          setErrors({ ...errors, [`operation${index}`]: '' });
                        }}
                        errors={errors}
                        index={index}
                        isNew={isNew}
                      />
                    </div>

                    <div className="create-input-field" style={{ display: (type === 'date' && isNew === true) ? 'flex' : '', gap: (type === 'date' && isNew === true) ? "6px" : '', paddingRight: (type === 'date' && isNew === true) ? "10px" : '' }}>
                      {type === 'boolean' ? (
                        <SelectOption
                          onChange={(newValue) =>
                            handleDataChange(index, newValue?.value!, type)
                          }
                          value={
                            filter.Data
                              ? {
                                value: filter.Data,
                                label: filter.Data === 'yes' ? 'Yes' : 'No',
                              }
                              : undefined
                          }
                          options={[
                            { value: 'yes', label: 'Yes' },
                            { value: 'no', label: 'No' },
                          ]}
                        />
                      ) : (
                        <>
                          {(type === 'date' && isNew === true) &&
                            <>
                              <Input
                                type={type}
                                label="Start Date"
                                name="end_date"
                                onKeyUp={(e) => {
                                  if (e.key === 'Enter') {
                                    applyFilter();
                                  }
                                }}
                                value={filter.start_date || ''}
                                onChange={(e: any) => {
                                  handleDataChange(index, e.target.value, 'start');
                                  setErrors({ ...errors, [`data${index}`]: '' });
                                }}
                                placeholder={'Enter'}
                              />
                              <Input
                                type={type}
                                label="End Date"
                                name="end_date"
                                onKeyUp={(e) => {
                                  if (e.key === 'Enter') {
                                    applyFilter();
                                  }
                                }}
                                value={filter.end_date || ''}
                                onChange={(e: any) => {
                                  handleDataChange(index, e.target.value, 'end');
                                  setErrors({ ...errors, [`data${index}`]: '' });
                                }}
                                placeholder={'Enter'}
                              />
                            </>
                          }
                          {!(type === 'date' && isNew === true) &&
                            <>
                              <Input
                                type={type}
                                label="Data"
                                name="Data"
                                onKeyUp={(e) => {
                                  if (e.key === 'Enter') {
                                    applyFilter();
                                  }
                                }}
                                value={filter.Data}
                                onChange={(e: any) => {
                                  handleDataChange(index, e.target.value, type);
                                  setErrors({ ...errors, [`data${index}`]: '' });
                                }}
                                placeholder={'Enter'}
                              />

                            </>
                          }
                        </>
                      )}
                      {errors[`data${index}`] && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                          {errors[`data${index}`]}
                        </span>
                      )}
                    </div>
                    {index !== 0 && (
                      <div
                        className="fildelb-btn"
                        onClick={() => handleRemoveRow(index)}
                      >
                        <img src={ICONS.deleteIcon} alt="" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="createUserActionButton" style={{ paddingTop: '22px' }}>
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
              style={{ color: '#377CF6' }}
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
