import './Banner.css';
import { ICONS } from '../../../resources/icons/Icons';
import { LiaEdit } from 'react-icons/lia';
import EditModal from './EditModal';
import { useState, useEffect, useRef, SetStateAction } from 'react';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import Select, { Options } from 'react-select';

import SelectOption from '../../components/selectOption/SelectOption';
import { EndPoints } from '../../../infrastructure/web_api/api_client/EndPoints';
import { FaChevronCircleDown, FaChevronDown } from 'react-icons/fa';
import { TYPE_OF_USER } from '../../../resources/static_data/Constant';

interface BannerProps {
  selectDealer: { label: string; value: string }[];
  setSelectDealer: React.Dispatch<
    React.SetStateAction<{ label: string; value: string }[]>
  >;
  bannerDetails: any;
  groupBy: string;
  isShowDropdown: boolean;
  setIsFetched: React.Dispatch<SetStateAction<boolean>>;
}

const Banner: React.FC<BannerProps> = ({
  selectDealer,
  setSelectDealer,
  bannerDetails,
  groupBy,
  isShowDropdown,
  setIsFetched,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState<any>('');
  const [dealerId, setDealerId] = useState('');
  const [newFormData, setNewFormData] = useState<any>([]);
  const [vdealer, setVdealer] = useState('');
  const [refetch, setRefetch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [opts, setOpts] = useState<{ label: string; value: string }[]>([]);
  const [isAuthenticated] = useState(
    localStorage.getItem('is_password_change_required') === 'false'
  );
  const tableData = {
    tableNames: ['dealer_name'],
  };

  const leaderDealer = (newFormData: any): { value: string; label: string }[] =>
    newFormData?.dealer_name?.map((value: string) => ({
      value,
      label: value,
    }));
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    if(res.status>200){
      return 
    }
    setNewFormData(res.data);
    setSelectDealer(leaderDealer(res.data));
    setOpts(leaderDealer(res.data));
    setIsFetched(true);
  };
  const role = localStorage.getItem('role');
  useEffect(() => {
    if (
      role === 'Admin' ||
      role === TYPE_OF_USER.FINANCE_ADMIN ||
      isShowDropdown
    ) {
      getNewFormData();
    }
  }, [role, isShowDropdown]);

  useEffect(() => {
    if (
      role !== 'Admin' &&
      role !== TYPE_OF_USER.FINANCE_ADMIN &&
      isAuthenticated
    ) {
      (async () => {
        try {
          const data = await postCaller('get_leaderboarddatarequest', {});

          if (data.status > 201) {
            // setIsLoading(false);

            toast.error(data?.message);
            return;
          }
          // setLeaderTable(data.data?.ap_ded_list as ILeaderBordUser[]);
          // setTotalCount(data?.dbRecCount);
          setDetails(data?.data);
          setDealerId(data?.data?.dealer_id);
        } catch (error) {
          console.error(error);
        } finally {
          // setIsLoading(false);
        }
      })();
    }
  }, [dealerId, role, refetch, isAuthenticated]);

  useEffect(() => {
    if (role === 'Admin' || role === TYPE_OF_USER.FINANCE_ADMIN) {
      const admintheme = localStorage.getItem('admintheme');
      if (admintheme) {
        const parsed = JSON.parse(admintheme);
        setDetails((prev: any) => ({ ...prev, ...parsed }));
      }
    }
  }, [refetch]);

  useEffect(() => {
    if (details?.dealer_id) {
      (async () => {
        try {
          const data = await postCaller('get_vdealer', {
            page_number: 1,
            page_size: 1,
            filters: [
              {
                Column: 'id',
                Operation: '=',
                Data: details?.dealer_id,
              },
            ],
          });

          if (data.status > 201) {
            // setIsLoading(false);

            toast.error(data.message);
            return;
          }
          // setLeaderTable(data.data?.ap_ded_list as ILeaderBordUser[]);
          // setTotalCount(data?.dbRecCount);
          setVdealer(data?.data?.vdealers_list[0]);
        } catch (error) {
          console.error(error);
        } finally {
          // setIsLoading(false);
        }
      })();
    }
  }, [details]);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const handleChange = (opt: { label: string; value: string }) => {
    const isExist = selectDealer.some((item) => item.value === opt.value);
    if (isExist) {
      setSelectDealer((prev) =>
        prev.filter((item) => item.value !== opt.value)
      );
    } else {
      setSelectDealer((prev) => [...prev, opt]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setOpts(leaderDealer(newFormData));
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [newFormData, search]);

  return (
    <div className="relative">
      <div
        className={`${role !== 'Admin' && role !== TYPE_OF_USER.FINANCE_ADMIN ? 'bg-blue ' : 'bg-green-radiant'}  banner-main flex items-center`}
        style={{ background: details.bg_color || undefined }}
      >
        <div
          className={
            role !== 'Admin' && role !== TYPE_OF_USER.FINANCE_ADMIN
              ? 'radiant-anime'
              : 'radiant-anime-2'
          }
        ></div>
        <div className="banner-wrap">
          {/* left side  */}
          <button className="edit-button" onClick={() => setShowModal(true)}>
            <LiaEdit className="edit-svg" />
            <p>Edit</p>
          </button>
          <div className="flex items-center pl4 banner-left">
            {role !== TYPE_OF_USER.FINANCE_ADMIN &&
              role !== TYPE_OF_USER.ADMIN &&
              details?.dealer_logo && (
                <img
                  src={
                    role === 'Admin' || role === TYPE_OF_USER.FINANCE_ADMIN
                      ? details?.dealer_logo || ICONS.OWEBanner
                      : details?.dealer_logo || ICONS.BannerLogo
                  }
                  style={{ maxWidth: 132, maxHeight: 180 }}
                  alt="solar-name-icon"
                />
              )}
            {(role === TYPE_OF_USER.FINANCE_ADMIN ||
              role === TYPE_OF_USER.ADMIN) && (
              <img
                src={
                  role === 'Admin' || role === TYPE_OF_USER.FINANCE_ADMIN
                    ? details?.dealer_logo || ICONS.OWEBanner
                    : details?.dealer_logo || ICONS.BannerLogo
                }
                style={{ maxWidth: 132, maxHeight: 180 }}
                alt="solar-name-icon"
              />
            )}
            <div className="">
              {role !== 'Admin' && role !== TYPE_OF_USER.FINANCE_ADMIN ? (
                <h1 className="solar-heading">
                  {details?.daeler_name || 'N/A'}
                </h1>
              ) : (
                <h1 className="solar-heading green-banner-heading">
                  OUR WORLD ENERGY
                </h1>
              )}
              {role !== 'Admin' && role !== TYPE_OF_USER.FINANCE_ADMIN ? (
                <div className="flex items-center ">
                  <img src={ICONS.OWEBannerLogo} alt="" />
                  <p className="left-ban-des">
                    Powered by <br /> <span>Our World Energy</span>
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {role !== 'Admin' && role !== TYPE_OF_USER.FINANCE_ADMIN ? (
            <div className="straight-line"></div>
          ) : null}
          {/* right side  */}
          <div className="flex items-center banner-right">
            {role !== 'Admin' && role !== TYPE_OF_USER.FINANCE_ADMIN ? (
              <div className="banner-names flex flex-column">
                <div>
                  <p className="owner-heading">Owner Name</p>
                  <p className="owner-names">{details?.owner_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="owner-heading">Total Teams</p>
                  <p className="owner-names">{details?.total_teams}</p>
                </div>
                <div>
                  <p className="owner-heading">Team Strength</p>
                  <p className="owner-names">{details?.total_strength}</p>
                </div>
              </div>
            ) : null}
            <div
              className={
                role !== 'Admin' && role !== TYPE_OF_USER.FINANCE_ADMIN
                  ? 'banner-trophy'
                  : 'user-trophy'
              }
            >
              <img src={ICONS.BannerTrophy} alt="login-icon" />
            </div>
            <div className="banner-stars">
              <img
                src={ICONS.BannerStar}
                width={30}
                alt=""
                className="banner-star-1"
              />
              <img
                src={ICONS.BannerStar}
                width={30}
                className="banner-star-2"
                alt=""
              />
              <img
                src={ICONS.BannerStar}
                width={20}
                className="banner-star-3"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      {(role === 'Admin' || role === TYPE_OF_USER.FINANCE_ADMIN) && (
        <div
          className="dealer-dropdown-filter"
          style={{ zIndex: 100 }}
          ref={dropdownRef}
        >
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="dealer-toggler pointer flex items-center"
          >
            <span>
              {selectDealer?.length}{' '}
              <span>{selectDealer?.length > 1 ? 'Partners' : 'Partner'}</span>
            </span>
            <FaChevronDown className="ml1" />
          </div>
          {isOpen && (
            <div
              className=" scrollbar dealer-dropdown dropdown-menu "
              style={{ overflowX: 'clip' }}
            >
              <div className="searchBox">
                <input
                  type="text"
                  className="input"
                  placeholder="Search Dealers"
                  style={{ width: '100%' }}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    if (e.target.value.trim()) {
                      const filtered = leaderDealer(newFormData).filter(
                        (item) =>
                          item.value
                            .toLocaleLowerCase()
                            .includes(e.target.value.toLowerCase().trim())
                      );
                      setOpts([...filtered]);
                    } else {
                      setOpts(leaderDealer(newFormData));
                    }
                  }}
                />
              </div>
              {!search.trim() && (
                <div className="dropdown-item">
                  <input
                    type="checkbox"
                    style={{ flexShrink: 0 }}
                    checked={
                      leaderDealer(newFormData).length === selectDealer.length
                    }
                    onChange={() => {
                      if (opts.length === selectDealer.length) {
                        setSelectDealer([]);
                      } else {
                        setSelectDealer([...opts]);
                      }
                    }}
                  />
                  All
                </div>
              )}
              {opts?.map?.((option, ind) => (
                <div key={ind} className="dropdown-item">
                  <input
                    type="checkbox"
                    style={{ flexShrink: 0 }}
                    checked={selectDealer.some(
                      (item) => item.value === option.value
                    )}
                    onChange={() => handleChange(option)}
                  />
                  {option.label}
                </div>
              ))}
            </div>
          )}

          {/* <Select
          isMulti
            styles={{
              menuList: (base) => ({
                ...base,
                height: '230px',
                '&::-webkit-scrollbar': {
                  scrollbarWidth: 'thin',
                  display: 'block',
                  scrollbarColor: 'rgb(173, 173, 173) #fff',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgb(173, 173, 173)',
                  borderRadius: '30px',
                },
              }),
              option: (base) => ({
                ...base,
                fontSize: '12px',
              }),
              indicatorSeparator: (base) => ({
                ...base,
                display: 'none',
              }),
              control: (base) => ({
                ...base,
                borderRadius: '24px',
                // width: 'fit-content',
                zIndex: 999,
                fontSize: 14,
              }),
              dropdownIndicator: (base) => ({
                ...base,
                svg: {
                  fill: '#3B3B3B',
                },
              }),
            }}
            options={leaderDealer(newFormData)}
            onChange={(newValue) => setSelectDealer([...newValue])}
            value={selectDealer}
          /> */}
        </div>
      )}
      {showModal && (
        <EditModal
          onClose={() => setShowModal(false)}
          vdealer={vdealer}
          dealerLogo={details?.dealer_logo}
          setRefetch={setRefetch}
        />
      )}
    </div>
  );
};

export default Banner;
