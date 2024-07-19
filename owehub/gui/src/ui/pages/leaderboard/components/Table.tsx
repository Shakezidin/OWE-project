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
import {
  Calendar,
  FirstAwardIcon,
  SecondAwardIcon,
  ThirdAwardIcon,
} from './Icons';
import { BiChevronDown } from 'react-icons/bi';

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

const categories = [
  { name: 'Sale', key: 'sale' },
  { name: 'NTP', key: 'ntp' },
  { name: 'Install', key: 'install' },
  { name: 'Cancel', key: 'cancel' },
];
const today = new Date();
const rangeOptData = [
  {
    label: 'Today',
    value: `${format(today, 'dd-MM-yyyy')},${format(today, 'dd-MM-yyyy')}`,
  },
  {
    label: 'Weekly',
    value: `${format(subDays(today, 7), 'dd-MM-yyyy')},${format(today, 'dd-MM-yyyy')}`,
  },
  {
    label: 'Monthly',
    value: `${format(subDays(today, 30), 'dd-MM-yyyy')},${format(today, 'dd-MM-yyyy')}`,
  },
  {
    label: 'Yearly',
    value: `${format(subDays(today, 365), 'dd-MM-yyyy')},${format(today, 'dd-MM-yyyy')}`,
  },
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
const periodFilterOptions = [
  'This Week',
  'This Month',
  'Last Month',
  'This Year',
] as const;

type PeriodFilterOption = (typeof periodFilterOptions)[number];

const PeriodFilter = ({
  period,
  setPeriod,
}: {
  period: PeriodFilterOption;
  setPeriod: (newVal: PeriodFilterOption) => void;
}) => {
  return (
    <ul className="leaderboard-data__period-group">
      {periodFilterOptions.map((item) => (
        <li key={item}>
          <button
            onClick={() => setPeriod(item)}
            className={
              'leaderboard-data__period-button' +
              (period === item
                ? ' leaderboard-data__period-button--active'
                : '')
            }
          >
            {item}
          </button>
        </li>
      ))}
    </ul>
  );
};

//
// GROUP FILTER
//

const GroupFilter = () => {
  // const [isShown, setIsShown] = useState(false);
  // const wrapperRef = useRef<HTMLDivElement | null>(null);
  // useEffect(() => {
  //   const wrapper = wrapperRef.current;
  //   if (!wrapper || !isShown) return;
  //   const onOutsideClick = (ev: Event) => {
  //     if (!ev.composedPath().includes(wrapper)) setIsShown(false);
  //   };
  //   window.addEventListener('click', onOutsideClick);
  //   return () => window.removeEventListener('click', onOutsideClick);
  // }, [isShown]);
  // return (
  //   <div className="leaderboard-data__group" ref={wrapperRef}>
  //     <button onClick={() => setIsShown(!isShown)}>
  //       <span>Group</span>
  //       <BiChevronDown size={16} />
  //     </button>
  //     {isShown && (
  //       <ul>
  //         <li>Team</li>
  //         <li>Region</li>
  //         <li>State</li>
  //       </ul>
  //     )}
  //   </div>
  // );

  return (
    <Select
      options={[
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'month' },
      ]}
      value={undefined}
      placeholder="Group"
      isSearchable={false}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          fontSize: '12px',
          borderRadius: '4px',
          outline: 'none',
          width: 'fit-content',
          minWidth: '92px',
          height: '32px',
          alignContent: 'center',
          cursor: 'pointer',
          boxShadow: 'none',
          minHeight: 30,
          border: 'none',
          background: '#EE824D',
          '&:focus': {
            outline: 'none',
          },
        }),
        placeholder: (baseStyles) => ({
          ...baseStyles,
          color: '#fff',
        }),
        indicatorSeparator: () => ({
          display: 'none',
        }),
        dropdownIndicator: (baseStyles, state) => ({
          ...baseStyles,
          svg: {
            fill: '#fff',
          },
          marginLeft: '-18px',
        }),

        option: (baseStyles, state) => ({
          ...baseStyles,
          fontSize: '12px',
          color: state.isSelected ? '#fff' : '#EE824D',
          backgroundColor: state.isSelected ? '#EE824D' : '#fff',
          ':hover': {
            backgroundColor: state.isSelected ? '#EE824D' : '#ffebe2',
            color: state.isSelected ? '#fff' : '#EE824D',
          },
        }),

        singleValue: (baseStyles) => ({
          ...baseStyles,
          color: '#fff',
          fontSize: 12,
        }),
        menu: (baseStyles) => ({
          ...baseStyles,
          width: '92px',
          zIndex: 10,
          color: '#FFFFFF',
        }),
        input: (base) => ({ ...base, margin: 0 }),
      }}
    />
  );
};

//
// RANK BY
//
const RankBy = ({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: (newVal: string) => void;
}) => {
  const options = categories.map(({ key, name }) => ({
    value: key,
    label: name,
  }));

  return (
    <div className="leaderboard-data__rankby">
      <label>Rank By:</label>
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
            backgroundColor: '#ffffff',
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
            fontSize: '14px',
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
  setSelectedRangeDate: Dispatch<
    SetStateAction<{ label: string; value: string }>
  >;
  selectedRangeDate: { label: string; value: string };
}) => {
  const [selection, setSelection] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [showCalendar, setShwoCalendar] = useState(false);
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
          start_date: selectedRangeDate.value?.split(',')[0],
          end_date: selectedRangeDate.value?.split(',')[1],
          sort_by: activeHead,
          page_size: itemsPerPage,
          page_number: page,
        });
        if (data.status > 201) {
          setIsLoading(false);
          toast.error(data.message);
          return;
        }
        setLeaderTable(data.data?.ap_ded_list as ILeaderBordUser[]);
        setTotalCount(data?.dbRecCount);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [
    selection.startDate,
    selection.endDate,
    activeHead,
    active,
    selectedRangeDate,
    itemsPerPage,
    page,
  ]);
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

  const [periodFilter, setPeriodFilter] = useState<PeriodFilterOption>(
    periodFilterOptions[0]
  );

  return (
    <div className="leaderboard-data" style={{ borderRadius: 12 }}>
      <div className="leaderboard-data__head">
        <button className="leaderboard-data__export">
          <span>Export</span>
          <FaUpload size={12} />
        </button>
        <div className="leaderboard-data__title">
          <img src={award} alt="" />
          <h2 className="h3" style={{ fontWeight: 600 }}>
            Leaderboard
          </h2>
          <RankBy selected={active} setSelected={setActive} />
        </div>

        <div className="leaderboard-data__filters">
          <GroupFilter />
          <PeriodFilter period={periodFilter} setPeriod={setPeriodFilter} />
          <div className="relative" style={{ lineHeight: 0 }}>
            <span
              role="button"
              onClick={() => setShwoCalendar((prev) => !prev)}
              style={{ lineHeight: 0 }}
            >
              <Calendar />
            </span>
            {showCalendar && (
              <div
                className="absolute bg-white "
                style={{ top: 40, right: 0, zIndex: 50 }}
              >
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => {
                    // @ts-ignore
                    setSelection({ ...item.selection });
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={[selection]}
                />
              </div>
            )}
          </div>
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
                <th>
                  <div className="leaderbord-tab-container flex items-center">
                    <div
                      onClick={() => setActiveHead('kw')}
                      className={` tab ${activeHead === 'kw' ? 'activehead' : ''}`}
                    >
                      KW
                    </div>
                    <div
                      onClick={() => setActiveHead('count')}
                      className={` tab ${activeHead === 'count' ? 'activehead' : ''}`}
                    >
                      Count
                    </div>
                  </div>
                </th>
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
                              start_date: selectedRangeDate.value?.split(
                                ','
                              )[0] as string,
                              end_date: selectedRangeDate.value?.split(
                                ','
                              )[1] as string,
                              name: item.rep_name,
                              rank: item.rank,
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
