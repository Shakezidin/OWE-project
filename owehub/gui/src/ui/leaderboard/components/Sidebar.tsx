import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ArrowForward, Growth, ServiceIcon, SuccessIcon } from './Icons';
import { FaShareSquare } from 'react-icons/fa';
import Select from 'react-select';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import { format, subDays } from 'date-fns';
import axios from 'axios';
import { toCanvas } from 'html-to-image';
import {
  Calendar,
  Dollar,
  FirstAwardIcon,
  SecondAwardIcon,
  ThirdAwardIcon,
} from './Icons';
import SocialShare from '../../batterBackupCalculator/components/SocialShare';
import { useAppSelector } from '../../../redux/hooks';
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
const today = new Date();
const switchIcons = (rank: number) => {
  switch (rank) {
    case 1:
      return <FirstAwardIcon width={40} height={40} />;

    case 2:
      return <SecondAwardIcon width={40} height={40} />;
    case 3:
      return <ThirdAwardIcon width={40} height={40} />;

    default:
      return (
        <span
          style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}
          className="ml1"
        >
          {rank}
          <span
            className="block"
            style={{ fontSize: 10, color: '#434343', fontWeight: 500 }}
          >
            Rank
          </span>
        </span>
      );
  }
};
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
const Sidebar = ({
  isOpen,
  setIsOpen,
  dealer,
  unit,
}: {
  isOpen: number;
  setIsOpen: Dispatch<SetStateAction<number>>;
  dealer: IDealer;
  unit: string;
}) => {
  const [data, setData] = useState<any>({});
  const [selectedRangeDate, setSelectedRangeDate] = useState({
    label: 'Weekly',
    value: `${format(subDays(today, 7), 'dd-MM-yyyy')},${format(today, 'dd-MM-yyyy')}`,
  });
  const [isGenerating, setGenerating] = useState(false);
  const [socialUrl, setSocialUrl] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const topCards = useRef<HTMLDivElement | null>(null);
  const [isAuthenticated] = useState(
    localStorage.getItem('is_password_change_required') === 'false'
  );
  const getLeaderDetail = async () => {
    try {
      const data = await postCaller('get_leaderboardprofiledatarequest', {
        ...dealer,
        count_kw_selection: true,
        // start_date: selectedRangeDate.value.split(',')[0],
        // end_date: selectedRangeDate.value.split(',')[1],
      });
      if (data.status > 201) {
        toast.error(data.message);
        return;
      }
      setData(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const shareImage = () => {
    if (topCards.current) {
      const element = topCards.current;
      const scrollHeight = element.scrollHeight;
      setGenerating(true);
      toCanvas(element, {
        height: scrollHeight,
      }).then((canvas) => {
        const img = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = img;
        link.download = 'Performance_Leaderboard.png';
        link.click();
        setGenerating(false);
      });
    }
  };

  useEffect(() => {
    if (Object.keys(dealer).length && isAuthenticated) {
      getLeaderDetail();
    }
  }, [dealer, selectedRangeDate.value, isAuthenticated]);

  function formatSaleValue(value: any) {
    if (value === null || value === undefined) return ''; // Handle null or undefined values
    const sale = parseFloat(value);
    if (sale === 0) return '0';
    if (sale % 1 === 0) return sale.toString(); // If the number is an integer, return it as a string without .00
    return sale.toFixed(2); // Otherwise, format it to 2 decimal places
  }

  return (
    <div
      className="user-profile-sidebar-fixed scrollbar flex items-center justify-end"
      style={{ right: isOpen > 0 ? '0' : '-100%', transition: 'all 500ms' }}
    >
      <div ref={topCards} className="user-sidebar relative">
        <span
          onClick={() => setIsOpen(-1)}
          className="absolute back-icon-sidebar back-icon block"
        >
          <ArrowForward />
        </span>
        <div className="user-profile">
          <div className="user-card">
            <div className="flex items-center user-name-wrapper px2">
              {switchIcons(dealer.rank)}
              <div className="ml2">
                <h3
                  className="h5 mb0"
                  style={{ lineHeight: 1.2, fontSize: 20, color: '#434343' }}
                >
                  {dealer.name}
                </h3>
                {/* <p
                  className=""
                  style={{ color: '#434343', fontSize: 10, marginTop: 6 }}
                >
                  OUR31245
                </p> */}
              </div>
            </div>
            <div className="mt2 px2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="card-label block">Team name</span>
                  <h6 className="card-value">
                    {' '}
                    {data?.team_name || 'Unassigned'}{' '}
                  </h6>
                </div>
                <div>
                  <span className="card-label block">Contact number</span>
                  <h6 className="card-value">
                    {' '}
                    {data?.contact_number || 'N/A'}{' '}
                  </h6>
                </div>
              </div>
              <div className="mt1">
                <span className="card-label block">Email address</span>
                <h6 className="card-value">{data?.email || 'N/A'}</h6>
              </div>
            </div>
          </div>
          <div className="mt3">
            <div className="flex items-center justify-between">
              <h4 className="h4" style={{ fontWeight: 600 }}>
                Performance
              </h4>

              {/* <div className="slect-wrapper">
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
              </div> */}
            </div>
            <div className="mt2">
              <div
                className="flex items-center justify-between"
                style={{ paddingBottom: 10, borderBottom: '1px solid #EAEAEA' }}
              >
                <div>
                  <div className="icon">
                    <Growth />
                  </div>
                  <div>
                    <span className="stats-labels">Total Sales</span>
                    <span
                      style={{ fontSize: 21, fontWeight: 700 }}
                      className="block"
                    >
                      {formatSaleValue(dealer.sale)}
                      <span className="unit">
                        ({unit === 'kw' ? 'kW' : 'count'})
                      </span>
                    </span>
                  </div>
                </div>

                <div>
                  <div className="icon">
                    <SuccessIcon />
                  </div>
                  <div>
                    <span className="stats-labels">Total NTP</span>
                    <span
                      style={{ fontSize: 21, fontWeight: 700 }}
                      className="block"
                    >
                      {formatSaleValue(dealer.ntp)}
                      <span className="unit">
                        ({unit === 'kw' ? 'kW' : 'count'})
                      </span>
                    </span>
                  </div>
                </div>

                <div>
                  <div className="icon">
                    <ServiceIcon />
                  </div>
                  <div>
                    <span className="stats-labels">Total Installs</span>
                    <span
                      style={{ fontSize: 21, fontWeight: 700 }}
                      className="block"
                    >
                      {formatSaleValue(dealer.install)}
                      <span className="unit">
                        ({unit === 'kw' ? 'kW' : 'count'})
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="px2">
                <div className="grey-weekly-stats justify-center flex items-center">
                  <div className="bg-white text-center leader-board-stats-wrapper py1">
                    <span className="block" style={{ fontWeight: 400 }}>Weekly sales</span>
                    <span className="block" style={{ fontWeight: 600 }}>
                      {formatSaleValue(data?.weekly_sale)}
                    </span>
                  </div>

                  <div className="text-center leader-board-stats-wrapper py1">
                    <span className="block" style={{ fontWeight: 400 }}>Total sales</span>
                    <span className="block" style={{ fontWeight: 600 }}>
                      {formatSaleValue(data?.total_sales)}
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={shareImage}
                    className="leader-stats-share-btn"
                    disabled={isGenerating}
                  >
                    <FaShareSquare size={17} color="#fff" className="mr1" />
                    <span> {isGenerating ? 'Downloading' : 'Share'} </span>
                  </button>

                  {isShareOpen && (
                    <SocialShare
                      setIsOpen={setIsShareOpen}
                      socialUrl={socialUrl}
                      className="sidebar-social-share"
                    />
                  )}
                </div>

                <div className="mt1 text-center">
                  <span className="text-center block" style={{ fontSize: 12 }}>
                    Powered by
                  </span>
                  <small
                    className="block text-center"
                    style={{ fontWeight: 600, fontSize: 12, color: '#9CCB3B' }}
                  >
                    <span style={{ color: '#0094CD', marginRight: 3 }}>
                      OUR
                    </span>
                    WORLD ENERGY
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
