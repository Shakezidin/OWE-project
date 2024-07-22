import { format, subDays } from 'date-fns';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-date-range';
import { FaUpload } from 'react-icons/fa';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import award from '../../../../resources/assets/award_icon.png';
import DataNotFound from '../../../components/loader/DataNotFound';
import MicroLoader from '../../../components/loader/MicroLoader';
import Pagination from '../../../components/pagination/Pagination';
import { DateRangeWithLabel } from '../index';
import {
  Calendar,
  FirstAwardIcon,
  SecondAwardIcon,
  ThirdAwardIcon,
} from './Icons';
import { checkDomainOfScale } from 'recharts/types/util/ChartUtils';

interface ILeaderBordUser {
  rank: number;
  dealer: string;
  rep_name: string;
  sale: number;
  install: number;
  ntp: number;
  cancel: number;
  hightlight: boolean;
}

interface IDealer {
  dealer?: string;
  rep_name?: string;
  start_date?: string;
  end_date?: string;
  leader_type?: string;
  name: string;
  rank: number;
  sale:number,
  ntp:number,
  install:number
}

const rankByOptions = [
  { label: 'Sale', value: 'sale' },
  { label: 'NTP', value: 'ntp' },
  { label: 'Install', value: 'install' },
  { label: 'Cancel', value: 'cancel' },
];

const role = localStorage.getItem('role');

const groupByOptionss = [
  { label: 'Sale Rep', value: 'primary_sales_rep' },
  { label: 'Team', value: 'team' },
  { label: 'State', value: 'state' },
  { label: 'Region', value: 'region' },
];

const groupByOptions = [
  { label: 'Dealer', value: 'dealer' },
  { label: 'Sale Rep', value: 'primary_sales_rep' },
  { label: 'Team', value: 'team' },
  { label: 'State', value: 'state' },
  { label: 'Region', value: 'region' },
];

export const RankColumn = ({ rank }: { rank: number }) => {
  if (rank === 1) return <FirstAwardIcon />;
  if (rank === 2) return <SecondAwardIcon />;
  if (rank === 3) return <ThirdAwardIcon />;
  return <span className="ml1">{rank}</span>;
};

//
// PERIOD FILTER
//
const today = new Date();
const periodFilterOptions: DateRangeWithLabel[] = [
  {
    label: 'This Week',
    start: subDays(today, 7),
    end: today,
  },
  {
    label: 'This Month',
    start: subDays(today, 30),
    end: today,
  },
  {
    label: 'Last Month',
    start: subDays(today, 60),
    end: subDays(today, 30),
  },
  {
    label: 'This Year',
    start: subDays(today, 365),
    end: today,
  },
];

const PeriodFilter = ({
  period,
  setPeriod,
  resetPage,
}: {
  period: DateRangeWithLabel | null;
  setPeriod: (newVal: DateRangeWithLabel) => void;
  resetPage: () => void;
}) => {
  return (
    <ul className="leaderboard-data__btn-group">
      {periodFilterOptions.map((item) => (
        <li key={item.label}>
          <button
            onClick={() => {
              setPeriod(item);
              resetPage();
            }}
            className={
              'leaderboard-data__btn' +
              (period?.label === item.label
                ? ' leaderboard-data__btn--active'
                : '')
            }
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

//
// SELECTABLE FILTER (rank by & group by)
//
const SelectableFilter = ({
  label,
  options,
  selected,
  setSelected,
  resetPage,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string;
  setSelected: (newVal: string) => void;
  resetPage: () => void;
}) => {
  return (
    <>
      <div className="leaderboard-data__select-filter">
        <label>{label}</label>
        <ul className="leaderboard-data__btn-group">
          {options.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => {
                  setSelected(item.value);
                  resetPage();
                }}
                className={
                  'leaderboard-data__btn' +
                  (item.value === selected
                    ? ' leaderboard-data__btn--active'
                    : '')
                }
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="leaderboard-data__select-filter--mobile">
        <label>{label}</label>
        <Select
          options={options}
          value={options.find((option) => option.value === selected)}
          onChange={(newVal) => {
            setSelected(newVal?.value ?? '');
            resetPage();
          }}
          isSearchable={false}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              fontSize: '12px',
              fontWeight: '500',
              border: 'none',
              outline: 'none',
              width: '92px',
              alignContent: 'center',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              boxShadow: 'none',
            }),
            indicatorSeparator: () => ({
              display: 'none',
            }),
            dropdownIndicator: (baseStyles) => ({
              ...baseStyles,
              color: '#ee824d',
              marginLeft: '-8px',
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              fontSize: '12px',
              backgroundColor: state.isSelected ? '#ee824d' : '#fff',
              '&:hover': {
                backgroundColor: state.isSelected ? '#ee824d' : '#ffebe2',
                color: state.isSelected ? '#fff' : '#ee824d',
              },
            }),
            singleValue: (baseStyles) => ({
              ...baseStyles,
              fontSize: '12px',
              color: selected ? '#ee824d' : '#222',
              width: 'fit-content',
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              marginTop: '-4px',
              width: '92px',
              zIndex: 10,
            }),
          }}
        />
      </div>
    </>
  );
};

//
// DATE FILTER
//
const DateFilter = ({
  selected,
  setSelected,
  resetPage,
}: {
  selected: DateRangeWithLabel;
  setSelected: (newVal: DateRangeWithLabel) => void;
  resetPage: () => void;
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRanges, setSelectedRanges] = useState(
    selected
      ? [
          {
            startDate: selected.start,
            endDate: selected.end,
            key: 'selection',
          },
        ]
      : []
  );

  const onApply = () => {
    const range = selectedRanges[0];
    if (!range) return;
    setSelected({
      start: range.startDate,
      end: range.endDate,
    });
    setShowCalendar(false);
    resetPage();
  };

  const onReset = () => {
    const defaultOption = periodFilterOptions[0];
    setSelected(periodFilterOptions[0]);
    setSelectedRanges([
      {
        startDate: defaultOption.start,
        endDate: defaultOption.end,
        key: 'selection',
      },
    ]);
    setShowCalendar(false);
    resetPage();
  };

  // update datepicker if "selected" updated externally
  useEffect(() => {
    setSelectedRanges([
      {
        startDate: selected.start,
        endDate: selected.end,
        key: 'selection',
      },
    ]);
  }, [selected]);

  // close on click outside anywhere
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !event.composedPath().includes(wrapperRef.current)
      )
        setShowCalendar(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-end">
      <div className="leaderborder_filter-slect-wrapper mr1">
        <Select
          options={periodFilterOptions}
          value={selected}
          // placeholder={selected?"Custom"}
          isSearchable={false}
          onChange={(value) => value && setSelected(value)}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              fontSize: '11px',
              fontWeight: '500',
              borderRadius: '4px',
              outline: 'none',
              width: 'fit-content',
              minWidth: '92px',
              height: '28px',
              alignContent: 'center',
              cursor: 'pointer',
              boxShadow: 'none',
              border: '1px solid #EE824D',
              minHeight: 30,
            }),
            valueContainer: (provided, state) => ({
              ...provided,
              height: '30px',
              padding: '0 6px',
            }),
            placeholder: (baseStyles) => ({
              ...baseStyles,
              color: '#EE824D',
            }),
            indicatorSeparator: () => ({
              display: 'none',
            }),
            dropdownIndicator: (baseStyles, state) => ({
              ...baseStyles,
              svg: {
                fill: '#EE824D',
              },
              marginLeft: '-18px',
            }),

            option: (baseStyles, state) => ({
              ...baseStyles,
              fontSize: '12px',
              color: '#fff',
              transition: 'all 500ms',
              '&:hover': {
                transform: 'scale(1.1)',
                background: 'none',
                transition: 'all 500ms',
              },
              background: '#EE824D',
              transform: state.isSelected ? 'scale(1.1)' : 'scale(1)',
            }),

            singleValue: (baseStyles, state) => ({
              ...baseStyles,
              color: '#EE824D',
              fontSize: 11,
              padding: '0 8px',
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              width: '92px',
              zIndex: 999,
              color: '#FFFFFF',
            }),
            menuList: (base) => ({
              ...base,
              background: '#EE824D',
            }),
            input: (base) => ({ ...base, margin: 0 }),
          }}
        />
      </div>
      <div ref={wrapperRef} className="leaderboard-data__datepicker-wrapper">
        <span
          role="button"
          onClick={() => setShowCalendar((prev) => !prev)}
          style={{ lineHeight: 0 }}
        >
          <Calendar />
        </span>
        {showCalendar && (
          <div className="leaderboard-data__datepicker-content">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => {
                const startDate = item.selection?.startDate;
                const endDate = item.selection?.endDate;
                if (startDate && endDate) {
                  setSelectedRanges([{ startDate, endDate, key: 'selection' }]);
                }
              }}
              moveRangeOnFirstSelection={false}
              ranges={selectedRanges}
            />
            <div className="leaderboard-data__datepicker-btns">
              <button className="reset-calender" onClick={onReset}>
                Reset
              </button>
              <button className="apply-calender" onClick={onApply}>
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Table = ({
  setIsOpen,
  setDealer,
  active,
  setActive,
  setGroupBy,
  groupBy,
  activeHead,
  setActiveHead,
  setSelectedRangeDate,
  selectedRangeDate,
  selectDealer,
}: {
  setIsOpen: Dispatch<SetStateAction<number>>;
  setDealer: Dispatch<SetStateAction<IDealer>>;
  active: string;
  groupBy: string;
  setActive: Dispatch<SetStateAction<string>>;
  setGroupBy: Dispatch<SetStateAction<string>>;
  activeHead: string;
  setActiveHead: Dispatch<SetStateAction<string>>;
  setSelectedRangeDate: Dispatch<DateRangeWithLabel>;
  selectedRangeDate: DateRangeWithLabel;
  selectDealer: { label: string; value: string }[];
}) => {
  const [leaderTable, setLeaderTable] = useState<ILeaderBordUser[]>([]);
  const [page, setPage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await postCaller('get_perfomance_leaderboard', {
          type: activeHead,
          dealer: selectDealer.map((item) => item.value),
          page_size: itemsPerPage,
          page_number: page,
          start_date: format(selectedRangeDate.start, 'dd-MM-yyyy'),
          end_date: format(selectedRangeDate.end, 'dd-MM-yyyy'),
          sort_by: active,
          group_by: groupBy,
        });
        if (data.status > 201) {
          setIsLoading(false);
          toast.error(data.message);
          return;
        }
        if (data.data?.ap_ded_list) {
          setLeaderTable(data.data?.ap_ded_list as ILeaderBordUser[]);
          setTotalCount(data?.dbRecCount);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [
    activeHead,
    active,
    selectedRangeDate,
    itemsPerPage,
    page,
    selectDealer,
    groupBy,
  ]);
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = page * itemsPerPage;

  const paginate = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const resetPage = () => {
    setPage(1);
  };

  const goToNextPage = () => {
    setPage(page + 1);
  };

  const goToPrevPage = () => {
    setPage(page - 1);
  };

  const sortedPage = leaderTable
    .slice()
    .sort((a, b) => (a.hightlight || b.hightlight ? -1 : 1));
console.log(sortedPage,"srtedPage");

  return (
    <div className="leaderboard-data" style={{ borderRadius: 12 }}>
      <button className="leaderboard-data__export" disabled>
        <span>Export</span>
        <FaUpload size={12} />
      </button>
      <div>
        <div className="leaderboard-data__title">
          <img src={award} alt="" />
          <h2 className="h3" style={{ fontWeight: 600 }}>
            Leaderboard
          </h2>
        </div>
        <div className="leaderboard-data__filter-row">
          <SelectableFilter
            label="Rank by:"
            options={rankByOptions}
            resetPage={resetPage}
            selected={active}
            setSelected={setActive}
          />
          <div>
            <div className="leaderboard-data__selected-dates">
              {format(selectedRangeDate.start, 'dd MMM yyyy')} -{' '}
              {format(selectedRangeDate.end, 'dd MMM yyyy')}
            </div>
            <div className="flex items-center justify-end">
              <PeriodFilter
                resetPage={resetPage}
                period={selectedRangeDate}
                setPeriod={setSelectedRangeDate}
              />
              <DateFilter
                selected={selectedRangeDate}
                resetPage={resetPage}
                setSelected={setSelectedRangeDate}
              />
            </div>
          </div>
        </div>
        <div className="leaderboard-data__filter-row">
          <SelectableFilter
            label="Group by:"
            options={role === 'Admin' ? groupByOptions : groupByOptionss}
            selected={groupBy}
            resetPage={resetPage}
            setSelected={setGroupBy}
          />

          <div className="leaderbord-tab-container">
            <div
              onClick={() => setActiveHead('kw')}
              className={`tab ${activeHead === 'kw' ? 'activehead' : ''}`}
            >
              KW
            </div>
            <div
              onClick={() => setActiveHead('count')}
              className={`tab ${activeHead === 'count' ? 'activehead' : ''}`}
            >
              Count
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="leaderboard-table-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>

                <th>Name</th>

                <th>Dealer</th>
                <th>Sale</th>
                <th>Install</th>
                <th>NTP</th>
                <th>Cancel</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '8rem 0',
                      }}
                    >
                      <MicroLoader />
                    </div>
                  </td>
                </tr>
              ) : sortedPage.length ? (
                sortedPage.map((item) => {
                  return (
                    <tr
                      className="pointer"
                      key={item.rank}
                      style={{background:item.hightlight?"#D7E6FE":undefined}}
                      onClick={() => {
                        setIsOpen(item.rank);
                        setDealer((prev) => ({
                          ...prev,
                          data_type:
                            groupBy === 'primary_sales_rep'
                              ? 'sale_rep'
                              : groupBy,
                          dealer:
                            groupBy === 'primary_sales_rep' ? item.dealer : '',
                          name: item.rep_name,
                          rank: item.rank,
                          sale:item.sale,
                          ntp:item.ntp,
                          install:item.install
                        }));
                      }}
                    >
                      <td>
                        <div className="flex items-center">
                          <RankColumn rank={item.rank} />
                        </div>
                      </td>
                      <td>
                        <span>{item.rep_name || 'N/A'}</span>
                      </td>

                      <td> {item.dealer} </td>

                      <td>{item?.sale?.toFixed(2)} </td>
                      <td>{item?.install?.toFixed(2)}</td>
                      <td>{item?.ntp?.toFixed(2)}</td>
                      <td>{item?.cancel?.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr style={{ border: 0 }}>
                  <td colSpan={7}>
                    <DataNotFound />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {leaderTable?.length > 0 ? (
        <div className="page-heading-container">
          <p className="page-heading">
            {startIndex} - {endIndex > totalCount ? totalCount : endIndex} of{' '}
            {totalCount} item
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            paginate={paginate}
            currentPageData={leaderTable}
            goToNextPage={goToNextPage}
            goToPrevPage={goToPrevPage}
            perPage={itemsPerPage}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Table;
