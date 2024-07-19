import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import award from '../../../../resources/assets/award_icon.png';
import {
  Calendar,
  Dollar,
  FirstAwardIcon,
  SecondAwardIcon,
  ThirdAwardIcon,
} from './Icons';
import { BsFillTriangleFill } from 'react-icons/bs';
import Select from 'react-select';
import { FaUpload } from 'react-icons/fa';
import { DateRange } from 'react-date-range';
import { format, subDays } from 'date-fns';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import Pagination from '../../../components/pagination/Pagination';
import MicroLoader from '../../../components/loader/MicroLoader';
import DataNotFound from '../../../components/loader/DataNotFound';
import { Tcategory } from '..';
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

export const switchIcons = (rank: number) => {
  switch (rank) {
    case 1:
      return <FirstAwardIcon />;

    case 2:
      return <SecondAwardIcon />;
    case 3:
      return <ThirdAwardIcon />;

    default:
      return <span className="ml1">{rank}</span>;
  }
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

  return (
    <div className="bg-white mt3 px3 pt3" style={{ borderRadius: 12 }}>
      <div className=" mt1 flex items-center">
        <img src={award} alt="" width={19} height={19} />
        <h2 className="h3 ml2" style={{ fontWeight: 600 }}>
          Leaderboard
        </h2>
      </div>
      <div className="flex mt2 mb3 items-center justify-between">
        <div className="flex  items-center">
          <div className="leaderboard-category-container flex items-center">
            {categories.map((category) => {
              return (
                <div
                  key={category.name}
                  onClick={() => setActive(category.key)}
                  className={`leaderboard-category ${active === category.key ? 'category-active' : ''}`}
                >
                  {category.name}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center" style={{ gap: 14 }}>
          <div className="slect-wrapper">
            <Select
              options={[
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'month' },
              ]}
              value={undefined}
              placeholder="Group"
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
                  background: '#EE824D',
                  '&:focus': {
                    outline: 'none',
                  },
                }),
                valueContainer: (provided, state) => ({
                  ...provided,
                  height: '30px',
                  padding: '0 6px',
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
          <div className="slect-wrapper">
            <Select
              options={rangeOptData}
              value={selectedRangeDate}
              onChange={(value) => setSelectedRangeDate(value!)}
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

          <button className="leaderborad-export-btn flex items-center">
            <span>Export</span>
            <FaUpload color="#EE824D" style={{ marginLeft: 12 }} size={12} />
          </button>
        </div>
      </div>
      <div className="">
        <div className="leaderboard-table-container">
          <table className="leaderboard-table ">
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
                          {switchIcons(item.rank)}
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
