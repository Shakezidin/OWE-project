import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { DateRange } from 'react-date-range';
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfYear,
} from 'date-fns';
import { FaUpload } from 'react-icons/fa';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import award from '../../../../resources/assets/award_icon.png';
import DataNotFound from '../../../components/loader/DataNotFound';
import MicroLoader from '../../../components/loader/MicroLoader';
import Pagination from '../../../components/pagination/Pagination';
import Papa from 'papaparse';
import { DateRangeWithLabel } from '../index';
import {
  Calendar,
  FirstAwardIcon,
  SecondAwardIcon,
  ThirdAwardIcon,
} from './Icons';
import { checkDomainOfScale } from 'recharts/types/util/ChartUtils';
import { useAppSelector } from '../../../../redux/hooks';
import { TYPE_OF_USER } from '../../../../resources/static_data/Constant';
import jsPDF from 'jspdf';
// import 'jspdf-autotable';
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
  sale: number;
  ntp: number;
  install: number;
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
  { label: 'Partner', value: 'dealer' },
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
const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 }); // assuming week starts on Monday, change to 0 if it starts on Sunday
const startOfThisMonth = startOfMonth(today);
const startOfThisYear = startOfYear(today);
const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

// Calculate the start and end of last week
const startOfLastWeek = startOfWeek(subDays(startOfThisWeek, 1), {
  weekStartsOn: 1,
});
const endOfLastWeek = endOfWeek(subDays(startOfThisWeek, 1), {
  weekStartsOn: 1,
});

const periodFilterOptions: DateRangeWithLabel[] = [
  {
    label: 'This Week',
    start: startOfThisWeek,
    end: today,
  },
  {
    label: 'Last Week',
    start: startOfLastWeek,
    end: endOfLastWeek,
  },
  {
    label: 'This Month',
    start: startOfThisMonth,
    end: today,
  },
  {
    label: 'Last Month',
    start: startOfLastMonth,
    end: endOfLastMonth,
  },
  {
    label: 'This Year',
    start: startOfThisYear,
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
  resetDealer,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string;
  setSelected: (newVal: string) => void;
  resetPage: () => void;
  resetDealer: (value: string) => void;
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
                  if (label === 'Group by:') {
                    resetDealer(item.value);
                  }
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
            if (newVal?.value && label === 'Group by:') {
              resetDealer(newVal.value);
            }
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
      label: 'Custom',
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
      console.log(event);
      const remain = window.innerWidth - event.clientX;
      if (
        wrapperRef.current &&
        !event.composedPath().includes(wrapperRef.current) &&
        remain > 15
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
  exportPdf,
  isExporting,
  count,
  resetDealer,
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
  exportPdf: (fn: () => void) => void;
  isExporting: boolean;
  count: number;
  resetDealer: (value: string) => void;
}) => {
  const [leaderTable, setLeaderTable] = useState<ILeaderBordUser[]>([]);
  const [page, setPage] = useState(1);

  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [exportShow, setExportShow] = useState<boolean>(false);
  const [isExportingData, setIsExporting] = useState(false);
  const toggleExportShow = () => {
    setExportShow((prev) => !prev);
  };

  const [selectedOption, setSelectedOption] = useState<any>('');
  const [exportOption, setExportOption] = useState<any>('');
  const itemsPerPage = 25;
  const [isAuthenticated] = useState(
    localStorage.getItem('is_password_change_required') === 'false'
  );
  // const handleGeneratePdf = async () => {
  //   const getAllLeaders = await postCaller('get_perfomance_leaderboard', {
  //     type: activeHead,
  //     dealer: selectDealer.map((item) => item.value),
  //     page_size: count,
  //     page_number: 1,
  //     start_date: format(selectedRangeDate.start, 'dd-MM-yyyy'),
  //     end_date: format(selectedRangeDate.end, 'dd-MM-yyyy'),
  //     sort_by: active,
  //     group_by: groupBy,
  //   });
  //   const doc = new jsPDF();
  //   const columns = [
  //     { header: 'Rank', dataKey: 'rank' },
  //     { header: 'Name', dataKey: 'rep_name' },
  //     { header: 'Partner', dataKey: 'dealer' },
  //     { header: 'Sale', dataKey: 'sale' },
  //     { header: 'NTP', dataKey: 'ntp' },
  //     { header: 'Install', dataKey: 'install' },
  //     { header: 'Cancel', dataKey: 'cancel' },
  //   ];

  //   const data = getAllLeaders?.data?.ap_ded_list.map((item: any) => ({
  //     rank: item.rank,
  //     rep_name: item.rep_name,
  //     dealer: item.dealer,
  //     sale: item.sale,
  //     ntp: item.ntp,
  //     install: item.install,
  //     cancel: item.cancel,
  //   }));

  //   // @ts-ignore
  //   doc.autoTable({
  //     columns: columns,
  //     body: data,
  //     margin: { top: 20 },
  //   });
  //   doc.save('leaderboard.pdf');
  // };

  useEffect(() => {
    if (isAuthenticated) {
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
    }
  }, [
    activeHead,
    active,
    selectedRangeDate,
    itemsPerPage,
    page,
    selectDealer,
    groupBy,
    isAuthenticated,
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

  function formatSaleValue(value: any) {
    if (value === null || value === undefined) return ''; // Handle null or undefined values
    const sale = parseFloat(value);
    if (sale === 0) return '0';
    if (sale % 1 === 0) return sale.toString(); // If the number is an integer, return it as a string without .00
    return sale.toFixed(2); // Otherwise, format it to 2 decimal places
  }
  const role = localStorage.getItem('role');
  const getTotal = (column: keyof ILeaderBordUser): number => {
    return sortedPage.reduce((sum, item) => {
      const value = item[column];
      // Ensure value is a number
      return sum + (typeof value === 'number' ? value : 0);
    }, 0);
  };
  const wrapperReff = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      wrapperReff.current &&
      !wrapperReff.current.contains(event.target as Node)
    ) {
      setExportShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const showPartner = useMemo(() => {
    if (
      (role === TYPE_OF_USER.ADMIN ||
        role === TYPE_OF_USER.DEALER_OWNER ||
        role === TYPE_OF_USER.FINANCE_ADMIN) &&
      groupBy !== 'dealer'
    ) {
      return true;
    }
    if (
      role !== TYPE_OF_USER.ADMIN &&
      role !== TYPE_OF_USER.DEALER_OWNER &&
      role !== TYPE_OF_USER.FINANCE_ADMIN
    ) {
      return true;
    } else {
      return false;
    }
  }, [groupBy, role]);

  const exportCsv = async () => {
    // Define the headers for the CSV

    setIsExporting(true);
    const headers = [
      'Rank',
      'Name',
      'Partner',
      'Sale',
      'NTP',
      'Install',
      'Cancel',
    ];

    const getAllLeaders = await postCaller('get_perfomance_leaderboard', {
      type: activeHead,
      dealer: selectDealer.map((item) => item.value),
      page_size: count,
      page_number: 1,
      start_date: format(selectedRangeDate.start, 'dd-MM-yyyy'),
      end_date: format(selectedRangeDate.end, 'dd-MM-yyyy'),
      sort_by: active,
      group_by: groupBy,
    });
    if (getAllLeaders.status > 201) {
      toast.error(getAllLeaders.message);
      return;
    }
    const csvData = getAllLeaders?.data?.ap_ded_list?.map?.((item: any) => [
      item.rank,
      item.rep_name,
      role === TYPE_OF_USER.ADMIN || role === TYPE_OF_USER.FINANCE_ADMIN
        ? item.dealer
        : '',
      formatSaleValue(item.sale),
      formatSaleValue(item.ntp),
      formatSaleValue(item.install),
      formatSaleValue(item.cancel),
    ]);

    const csvRows = [headers, ...csvData];

    const csvString = Papa.unparse(csvRows);

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leaderboard.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExporting(false);
    setExportShow(false);
  };

  return (
    <div className="leaderboard-data" style={{ borderRadius: 12 }}>
      {/* <button onClick={handleGeneratePdf}>export json pdf</button> */}
      <div className="relative exportt" ref={wrapperReff}>
        <div onClick={toggleExportShow}>
          <FaUpload size={12} className="mr1" />
          <span> Export </span>
        </div>
        {exportShow && (
          <div className="export-opt">
            <button
              className="export-btn"
              disabled={isExporting || isExportingData}
              onClick={() => {
                exportPdf(toggleExportShow);
              }}
            >
              <span>Pdf</span>
            </button>
            <button
              disabled={isExportingData}
              className="export-btn export-btnn"
              onClick={exportCsv}
            >
              <span>Csv</span>
            </button>
          </div>
        )}
      </div>
      {/* <div className="leaderboard-data__export">
        <Select
          options={exportOptions}
          value={exportOption}
          onChange={(selectedOption) => {
            setExportOption(selectedOption);
            // handleExport(selectedOption.value);
          }}
          isSearchable={false}
          placeholder="Export Options"
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              fontSize: '12px',
              fontWeight: '500',
              border: 'none',
              outline: 'none',
              width: '120px',
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
              color: exportOption ? '#ee824d' : '#222',
              width: 'fit-content',
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              marginTop: '-4px',
            }),
          }}
        />
      </div> */}

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
            resetDealer={resetDealer}
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
            options={
              role === 'Admin' ||
              role === TYPE_OF_USER.DEALER_OWNER ||
              role === TYPE_OF_USER.FINANCE_ADMIN
                ? groupByOptions
                : groupByOptionss
            }
            resetDealer={resetDealer}
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
      <div className="mobile-card-wrapper mt2">
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <MicroLoader />
          </div>
        ) : sortedPage.length ? (
          <>
            {sortedPage.map((item) => {
              return (
                <div
                  onClick={() => {
                    setIsOpen(item.rank);
                    setDealer((prev) => ({
                      ...prev,
                      data_type:
                        groupBy === 'primary_sales_rep' ? 'sale_rep' : groupBy,
                      dealer:
                        groupBy === 'primary_sales_rep' ? item.dealer : '',
                      name: item.rep_name,
                      rank: item.rank,
                      sale: item.sale,
                      ntp: item.ntp,
                      install: item.install,
                    }));
                  }}
                  className="mobile-rank-card"
                  style={{
                    marginBottom: 17,
                    border: item.hightlight ? '1px solid #D7E6FE' : undefined,
                  }}
                >
                  <div
                    className="rank-standing"
                    style={{ flexBasis: '40px', flexShrink: 0 }}
                  >
                    <RankColumn rank={item.rank} />
                  </div>
                  <div className="flex-auto rank-card-body">
                    <h4 className="card-rep-name">{item.rep_name || 'N/A'} </h4>
                    {showPartner && (
                      <p className="rank-sm-text"> {item.dealer} </p>
                    )}
                    <div className="flex items-center rank-card-stats">
                      <div>
                        <span className="rank-stats-num">
                          {formatSaleValue(item?.sale)}
                        </span>
                        <p className="rank-sm-text">Sales</p>
                      </div>

                      <div>
                        <span className="rank-stats-num">
                          {formatSaleValue(item?.install)}{' '}
                        </span>
                        <p className="rank-sm-text">Installs</p>
                      </div>
                      <div>
                        <span className="rank-stats-num">
                          {formatSaleValue(item?.ntp)}{' '}
                        </span>
                        <p className="rank-sm-text">NTP</p>
                      </div>
                      <div>
                        <span className="rank-stats-num">
                          {formatSaleValue(item.cancel)}{' '}
                        </span>
                        <p className="rank-sm-text">Cancel</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="mobile-rank-card" style={{ marginBottom: 17 }}>
              <div
                className="rank-standing"
                style={{ flexBasis: '40px', flexShrink: 0 }}
              ></div>
              <div className="flex-auto rank-card-body">
                <h4 className="card-rep-name">Total</h4>
                <div className="flex items-center rank-card-statss">
                  <div>
                    <span className="rank-stats-num">
                      {formatSaleValue(getTotal('sale'))}
                    </span>
                    <p className="rank-sm-text">Sales</p>
                  </div>
                  <div>
                    <span className="rank-stats-num">
                      {formatSaleValue(getTotal('ntp'))}
                    </span>
                    <p className="rank-sm-text">NTP</p>
                  </div>
                  <div>
                    <span className="rank-stats-num">
                      {formatSaleValue(getTotal('install'))}
                    </span>
                    <p className="rank-sm-text">Install</p>
                  </div>
                  <div>
                    <span className="rank-stats-num">
                      {formatSaleValue(getTotal('cancel'))}
                    </span>
                    <p className="rank-sm-text">Cancel</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center">No Data Found</div>
        )}
      </div>
      <div className="leaderboard-table-wrapper">
        <div className="leaderboard-table-container">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>

                <th>
                  {(role === TYPE_OF_USER.ADMIN ||
                    role === TYPE_OF_USER.FINANCE_ADMIN ||
                    role === TYPE_OF_USER.DEALER_OWNER) &&
                  groupBy === 'dealer'
                    ? 'Code Name'
                    : 'Name'}
                </th>

                {showPartner && <th>Partner</th>}
                <th>Sale</th>
                <th>NTP</th>
                <th>Install</th>
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
                      style={{
                        background: item.hightlight ? '#D7E6FE' : undefined,
                      }}
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
                          sale: item.sale,
                          ntp: item.ntp,
                          install: item.install,
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
                      {showPartner && <td> {item.dealer} </td>}

                      <td>{formatSaleValue(item?.sale)} </td>
                      <td>{formatSaleValue(item?.ntp)}</td>
                      <td>{formatSaleValue(item?.install)}</td>

                      <td>{formatSaleValue(item.cancel)}</td>
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
            {!isLoading && !!leaderTable?.length && (
              <tfoot>
                <tr>
                  <td></td>
                  {showPartner && <td></td>}
                  <td className="bold-text">Total </td>
                  <td className="bold-text">
                    {formatSaleValue(getTotal('sale'))}
                  </td>

                  <td className="bold-text">
                    {formatSaleValue(getTotal('ntp'))}
                  </td>
                  <td className="bold-text">
                    {formatSaleValue(getTotal('install'))}
                  </td>
                  <td className="bold-text">
                    {formatSaleValue(getTotal('cancel'))}
                  </td>
                </tr>
              </tfoot>
            )}
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
