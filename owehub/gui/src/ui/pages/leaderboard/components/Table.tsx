import { format, parse, subDays } from 'date-fns';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-date-range';
import { DateRangeWithLabel } from '../index';
import { FaUpload } from 'react-icons/fa';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import award from '../../../../resources/assets/award_icon.png';
import DataNotFound from '../../../components/loader/DataNotFound';
import MicroLoader from '../../../components/loader/MicroLoader';
import Pagination from '../../../components/pagination/Pagination';
import {
  Calendar,
  FirstAwardIcon,
  SecondAwardIcon,
  ThirdAwardIcon,
} from './Icons';

interface ILeaderBordUser {
  rank: number;
  dealer: string;
  rep_name: string;
  count: number;
  kw: number;
}

interface IDealer {
  dealer?: string;
  rep_name?: string;
  start_date?: string;
  end_date?: string;
  leader_type: string;
  name: string;
  rank: number;
}

const rankByOptions = [
  { label: 'Sale', value: 'sale' },
  { label: 'NTP', value: 'ntp' },
  { label: 'Install', value: 'install' },
  { label: 'Cancel', value: 'cancel' },
];

const groupByOptions = [
  { label: 'Sale', value: 'sale' },
  { label: 'NTP', value: 'ntp' },
  { label: 'Install', value: 'install' },
  { label: 'Cancel', value: 'cancel' },
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
    start: format(subDays(today, 7), 'dd-MM-yyyy'),
    end: format(today, 'dd-MM-yyyy'),
  },
  {
    label: 'This Month',
    start: format(subDays(today, 30), 'dd-MM-yyyy'),
    end: format(today, 'dd-MM-yyyy'),
  },
  {
    label: 'Last Month',
    start: format(subDays(today, 60), 'dd-MM-yyyy'),
    end: format(subDays(today, 30), 'dd-MM-yyyy'),
  },
  {
    label: 'This Year',
    start: format(subDays(today, 365), 'dd-MM-yyyy'),
    end: format(today, 'dd-MM-yyyy'),
  },
];

const PeriodFilter = ({
  period,
  setPeriod,
}: {
  period: DateRangeWithLabel | null;
  setPeriod: (newVal: DateRangeWithLabel) => void;
}) => {
  return (
    <ul className="leaderboard-data__period-group">
      {periodFilterOptions.map((item) => (
        <li key={item.label}>
          <button
            onClick={() => setPeriod(item)}
            className={
              'leaderboard-data__period-button' +
              (period?.label === item.label
                ? ' leaderboard-data__period-button--active'
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
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string;
  setSelected: (newVal: string) => void;
}) => {
  return (
    <div className="leaderboard-data__select-filter">
      <label>{label}</label>
      <Select
        options={options}
        value={options.find((option) => option.value === selected)}
        onChange={(newVal) => setSelected(newVal?.value ?? '')}
        isSearchable={false}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            fontSize: '12px',
            fontWeight: '500',
            border: 'none',
            outline: 'none',
            width: '84px',
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
            width: '84px',
            zIndex: 10,
          }),
        }}
      />
    </div>
  );
};

//
// DATE FILTER
//
const DateFilter = ({
  selected,
  setSelected,
}: {
  selected: DateRangeWithLabel;
  setSelected: (newVal: DateRangeWithLabel) => void;
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRanges, setSelectedRanges] = useState(
    selected
      ? [
          {
            startDate: parse(selected.start, 'dd-MM-yyyy', new Date()),
            endDate: parse(selected.end, 'dd-MM-yyyy', new Date()),
            key: 'selection',
          },
        ]
      : []
  );

  const onApply = () => {
    const range = selectedRanges[0];
    if (!range) return;
    setSelected({
      start: format(range.startDate, 'dd-MM-yyyy'),
      end: format(range.endDate, 'dd-MM-yyyy'),
    });
    setShowCalendar(false);
  };

  const onReset = () => {
    const defaultOption = periodFilterOptions[0];
    setSelected(periodFilterOptions[0]);
    setSelectedRanges([
      {
        startDate: parse(defaultOption.start, 'dd-MM-yyyy', new Date()),
        endDate: parse(defaultOption.end, 'dd-MM-yyyy', new Date()),
        key: 'selection',
      },
    ]);
    setShowCalendar(false);
  };

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
          options={[]}
          value={undefined}
          // onChange={(value) => setSelectedRangeDate(value!)}
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
  activeHead,
  setActiveHead,
  setSelectedRangeDate,
  selectedRangeDate,
}: {
  setIsOpen: Dispatch<SetStateAction<number>>;
  setDealer: Dispatch<SetStateAction<IDealer>>;
  active: string;
  setActive: Dispatch<SetStateAction<string>>;
  activeHead: string;
  setActiveHead: Dispatch<SetStateAction<string>>;
  setSelectedRangeDate: Dispatch<DateRangeWithLabel>;
  selectedRangeDate: DateRangeWithLabel;
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
          leader_type: active,
          sort_by: activeHead,
          page_size: itemsPerPage,
          page_number: page,
          start_date: selectedRangeDate.start,
          end_date: selectedRangeDate.end,
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
  }, [activeHead, active, selectedRangeDate, itemsPerPage, page]);
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage + 1;
  const endIndex = page * itemsPerPage;

  const paginate = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const goToNextPage = () => {
    setPage(page + 1);
  };

  const goToPrevPage = () => {
    setPage(page - 1);
  };

  return (
    <div className="leaderboard-data" style={{ borderRadius: 12 }}>
      <button className="leaderboard-data__export" disabled>
        <span>Export</span>
        <FaUpload size={12} />
      </button>
      <div className="leaderboard-data__head">
        <img src={award} alt="" />
        <h2 className="h3" style={{ fontWeight: 600 }}>
          Leaderboard
        </h2>

        <div className="leaderboard-data__filters">
          <SelectableFilter
            label="Rank by:"
            options={rankByOptions}
            selected={active}
            setSelected={setActive}
          />
          <SelectableFilter
            label="Group by:"
            options={groupByOptions}
            selected={active}
            setSelected={setActive}
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
          <PeriodFilter
            period={selectedRangeDate}
            setPeriod={setSelectedRangeDate}
          />
          <DateFilter
            selected={selectedRangeDate}
            setSelected={setSelectedRangeDate}
          />
        </div>
      </div>
      <div className="">
        <div className="leaderboard-table-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>

                <th>Name</th>

                <th>Dealer</th>
                <th>Sales</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <MicroLoader />
                    </div>
                  </td>
                </tr>
              ) : leaderTable.length ? (
                leaderTable.map((item) => {
                  return (
                    <tr key={item.rank}>
                      <td>
                        <div className="flex items-center">
                          <RankColumn rank={item.rank} />
                        </div>
                      </td>
                      <td>
                        <span
                          className="pointer"
                          onClick={() => {
                            setIsOpen(item.rank);
                            setDealer((prev) => ({
                              ...prev,
                              dealer: item.dealer,
                              rep_name: item.rep_name,
                              name: item.rep_name,
                              rank: item.rank,
                              start_date: selectedRangeDate?.start,
                              end_date: selectedRangeDate?.end,
                            }));
                          }}
                        >
                          {item.rep_name}
                        </span>
                      </td>

                      <td> {item.dealer} </td>
                      <td> {item.count} </td>
                      <td> {item.kw.toFixed(2)} </td>
                    </tr>
                  );
                })
              ) : (
                <tr style={{ border: 0 }}>
                  <td colSpan={4}>
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
