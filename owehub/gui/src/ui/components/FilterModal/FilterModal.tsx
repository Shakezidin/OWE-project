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
import useMatchMedia from '../../../hooks/useMatchMedia';
 
interface Column {
  name: string;
  filter?: string;
  displayName: string;
  type: string;
  isNotFilter?: boolean
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
  data1?: string;
  data2?: string;
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
  isNew,
}) => {
  const dispatch = useAppDispatch();
 
  const [filters, setFilters] = useState<FilterModel[]>([
    { Column: '', Operation: '', Data: '', start_date: '', end_date: '', data1: '', data2: '' },
  ]);
 
 
  const [applyFilters, setApplyFilters] = useState<FilterModel[]>([
    { Column: '', Operation: '', Data: '', start_date: '', end_date: '', data1: '', data2: '' },
  ]);
  const [errors, setErrors] = useState<ErrorState>({});
  const options: Option[] = columns
    .filter((column) => !column.isNotFilter)
    .map((column) => ({
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
          start_date: '',
          end_date: '', data1: '', data2: ''
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
        data1: '',
        data2: '',
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
    setFilters([
      ...filters,
      { Column: '', Operation: '', Data: '', start_date: '', end_date: '', data1: '', data2: '' },
    ]);
  };
 
  const handleRemoveRow = (index: number) => {
    if (filters.length === 1) {
      if (true) {
        const resetFilters = filters
          .filter((_, ind) => ind === 0)
          .map((filter) => ({
            ...filter,
            Column: '',
            Operation: '',
            Data: '',
            start_date: '',
            end_date: '',
            data1: '',
            data2: ''
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
    newRules[index].start_date = '';
    newRules[index].end_date = '';
    newRules[index].data1 = '';
    newRules[index].data2 = '';
    setFilters(newRules);
  };
  const handleDataChange = (
    index: number,
    value: string,
    type: 'number' | 'date' | 'boolean' | 'text' | 'start' | 'end' | 'data1' | 'data2'
  ) => {
    setFilters(prevFilters => {
      const newFilters = [...prevFilters]; // Create a shallow copy of the array
 
      newFilters[index] = { // Create a new object instead of mutating existing one
        ...newFilters[index], // Copy existing properties
        type, // Always update type
      };
 
      console.log(value, type, "virat");
 
      if (type === 'start') {
        console.log(newFilters[index], "veer");
        newFilters[index].start_date = value;
        newFilters[index].Data = ''; // Clear Data when setting start_date
      } else if (type === 'end') {
        newFilters[index].end_date = value;
        newFilters[index].Data = ''; // Clear Data when setting end_date
      } else if (type === 'data1') {
        newFilters[index].data1 = value;
        newFilters[index].Data = ''; // Clear Data when setting data1
      } else if (type === 'data2') {
        newFilters[index].data2 = value;
        newFilters[index].Data = ''; // Clear Data when setting data2
      } else {
        newFilters[index] = { // Ensure we are properly resetting for other types
          ...newFilters[index],
          Data: value,
          start_date: '',
          end_date: '',
          data1: '',
          data2: '',
        };
      }
 
      return newFilters; // Return new array to trigger re-render
    });
  };
 
 
 
  const getInputType = (columnName: string) => {
    const type = columns.find(
      (option) => (option.filter ? option.filter : option.name) === columnName
    )?.type;
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
 
    // Validation
    const newErrors: ErrorState = {};
    filters.forEach((filter, index) => {
      console.log((!filter.Data && filter.Operation === 'Operation' && (filter.type === 'text') && (filter.data1 === '' || filter.data2 === '')), "dfhjds")
 
      if (!filter.Column) {
        newErrors[`column${index}`] = `Please provide Column Name`;
      }
      if (!filter.Operation) {
        newErrors[`operation${index}`] = `Please provide Operation`;
      }
      if (
        filter.data1 !== '' &&
        filter.data2 !== '' &&
        !isNaN(Number(filter.data1)) &&
        !isNaN(Number(filter.data2)) &&
        Number(filter.data1) > Number(filter.data2)
      ) {
        newErrors[`data${index}`] = `First Data should be greater than Second Data`;
      }
      if (!filter.Data && (filter.type !== 'date') && (filter.start_date === '' || filter.end_date === '') && (filter.data1 === '' || filter.data2 === '')) {
        newErrors[`data${index}`] = `Please provide Data`;
      }
    });
 
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const formattedFilters: FilterModel[] = filters.map((filter) => {
        const filterModel: FilterModel = {
          Column: filter.Column,
          Operation: filter.Operation,
          Data: filter.type === 'date' ? `${String(new Date(filter.Data).getMonth() + 1).padStart(2, '0')}-${String(new Date(filter.Data).getDate()).padStart(2, '0')}-${new Date(filter.Data).getFullYear()}` : filter.Data, // Ensure Data always exists
        };
 
        if (isNew) {
          filterModel.start_date =
            filter.type === 'date' && filter.start_date
              ? `${String(new Date(filter.start_date).getMonth() + 1).padStart(2, '0')}-${String(
                new Date(filter.start_date).getDate()
              ).padStart(2, '0')}-${new Date(filter.start_date).getFullYear()}`
              : filter.start_date;
 
          filterModel.end_date =
            filter.type === 'date' && filter.end_date
              ? `${String(new Date(filter.end_date).getMonth() + 1).padStart(2, '0')}-${String(
                new Date(filter.end_date).getDate()
              ).padStart(2, '0')}-${new Date(filter.end_date).getFullYear()}`
              : filter.end_date;
        }
 
        if (isNew) {
          filterModel.data1 = filter.data1;
          filterModel.data2 = filter.data2;
        }
 
        return filterModel;
      });
 
 
 
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
 
  const isMobile = useMatchMedia('(max-width: 767px)');
 
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
 
                return (
                  <div className="create-input-container" key={index}>
                    <div
                      className="create-input-field"
                      style={{
                        width: isMobile
                          ? '100%'
                          : ((type === 'date' && isNew === true) || (type === 'number' && filter.Operation === 'btw' && isNew === true))
                            ? '23%'
                            : '',
                      }}
 
                    >
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
                    <div
                      className="create-input-field"
                      style={{
                        width: isMobile
                          ? '100%'
                          : ((type === 'date' && isNew === true) || (type === 'number' && filter.Operation === 'btw' && isNew === true))
                            ? '23%'
                            : '',
                      }}
 
                    >
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
                            (option) =>
                              (option.filter ? option.filter : option.name) ===
                              filter.Column
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
                        selected={filter.Column}
                      />
                    </div>
 
                    <div
                      className="create-input-field"
                      style={{
 
                        paddingRight:
                          ((type === 'date' && isNew === true) || (type === 'number' && filter.Operation === 'btw' && isNew === true)) ? '7px' : '',
                        width:
                          ((type === 'date' && isNew === true) || (type === 'number' && filter.Operation === 'btw' && isNew === true)) ? '40%' : '',
                      }}
                    >
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
                          {type === 'number' && filter.Operation === 'btw' && isNew === true && (
                            <>
                              <div
                                style={{
 
                                  display:
                                    type === 'number' && filter.Operation === 'btw' && isNew === true ? 'flex' : '',
                                  gap:
                                    type === 'number' && filter.Operation === 'btw' && isNew === true ? '6px' : '',
 
                                }}
                              >
                                <Input
                                  width={'2px'}
                                  type="number"
                                  label="From"
                                  name="data1"
                                  onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                      applyFilter();
                                    }
                                  }}
                                  value={filter.data1 || ''}
                                  onChange={(e: any) => {
                                    handleDataChange(
                                      index,
                                      e.target.value,
                                      'data1'
                                    ); // Use 'start' type
                                    if (filter.data1 !== '' && filter.data2 !== '') {
                                      setErrors({
                                        ...errors,
                                        [`data${index}`]: '',
                                      });
                                    }
 
                                  }}
                                  placeholder={'Enter'}
                                />
                                <Input
                                  width='18%'
                                  min={filter.data1}
                                  disabled={filter.data1 === ''}
                                  type="number"
                                  label="To"
                                  name="data2"
                                  onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                      applyFilter();
                                    }
                                  }}
                                  value={filter.data2 || ''}
                                  onChange={(e: any) => {
                                    handleDataChange(
                                      index,
                                      e.target.value,
                                      'data2'
                                    ); // Use 'end' type
                                    if (filter.data1 !== '' && filter.data2 !== '') {
                                      setErrors({
                                        ...errors,
                                        [`data${index}`]: '',
                                      });
                                    }
 
                                  }}
                                  placeholder={'Enter'}
                                />
                              </div>
                            </>
                          )}
                          {type === 'date' && isNew === true && (
                            <>
                              <div
                                style={{
 
                                  display:
                                    type === 'date' && isNew === true ? 'flex' : '',
                                  gap:
                                    type === 'date' && isNew === true ? '6px' : '',
 
                                }}
                              >
                                <Input
                                  type="date"
                                  label="Start Date"
                                  name="start_date"
                                  onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                      applyFilter();
                                    }
                                  }}
                                  value={filter.start_date || ''}
                                  onChange={(e: any) => {
                                    handleDataChange(
                                      index,
                                      e.target.value,
                                      'start'
                                    ); // Use 'start' type
                                    if (filter.start_date !== '' && filter.end_date !== '') {
                                      setErrors({
                                        ...errors,
                                        [`data${index}`]: '',
                                      });
                                    }
 
                                  }}
                                  placeholder={'Enter'}
                                />
                                <Input
                                  min={filter.start_date}
                                  disabled={filter.start_date === ''}
                                  type="date"
                                  label="End Date"
                                  name="end_date"
                                  onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                      applyFilter();
                                    }
                                  }}
                                  value={filter.end_date || ''}
                                  onChange={(e: any) => {
                                    handleDataChange(
                                      index,
                                      e.target.value,
                                      'end'
                                    ); // Use 'end' type
                                    if (filter.start_date !== '' && filter.end_date !== '') {
                                      setErrors({
                                        ...errors,
                                        [`data${index}`]: '',
                                      });
                                    }
 
                                  }}
                                  placeholder={'Enter'}
                                />
                              </div>
                            </>
                          )}
                          {!((type === 'date' && isNew === true) || (type === 'number' && filter.Operation === 'btw' && isNew === true)) && (
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
                                  setErrors({
                                    ...errors,
                                    [`data${index}`]: '',
                                  });
                                }}
                                placeholder={'Enter'}
                                noVal={isNew}
                              />
                            </>
                          )}
                        </>
                      )}
                      {errors[`data${index}`] && (
                        <span style={{ color: 'red', fontSize: '12px' }}>
                          {errors[`data${index}`]}
                        </span>
                      )}
                    </div>
                    {true && (
                      <div
                        className="fildelb-btn"
                        onClick={() => handleRemoveRow(index)}
                        style={{ paddingLeft: (type === 'number' && filter.Operation === 'btw' && isNew === true) ? '19px' : '' }}
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