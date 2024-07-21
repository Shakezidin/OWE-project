import './Banner.css';
import { ICONS } from '../../../icons/Icons';
import { LiaEdit } from 'react-icons/lia';
import EditModal from './EditModal';
import { useState, useEffect, useRef } from 'react';
import { postCaller } from '../../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import Select, { Options } from 'react-select';
import { dealerOption } from '../../../../core/models/data_models/SelectDataModel';
import SelectOption from '../../../components/selectOption/SelectOption';
import { EndPoints } from '../../../../infrastructure/web_api/api_client/EndPoints';
import { FaChevronCircleDown, FaChevronDown } from 'react-icons/fa';

interface BannerProps {
  selectDealer: { label: string; value: string }[];
  setSelectDealer: React.Dispatch<
    React.SetStateAction<{ label: string; value: string }[]>
  >;
  bannerDetails: any;
}

const Banner: React.FC<BannerProps> = ({
  selectDealer,
  setSelectDealer,
  bannerDetails,
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

  const tableData = {
    tableNames: ['dealer'],
  };
  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    setNewFormData(res.data);
    setSelectDealer(dealerOption(res.data));
    setOpts(dealerOption(res.data));
  };
  const role = localStorage.getItem('role');
  useEffect(() => {
    getNewFormData();
  }, []);

  useEffect(() => {
    if (role !== 'Admin') {
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
  }, [dealerId, role, refetch]);

  useEffect(() => {
    (async () => {
      try {
        const data = await postCaller('get_vdealer', {
          page_number: 1,
          page_size: 1,
          filters: [
            {
              Column: 'id',
              Operation: '=',
              Data: details?.dealer_id || 1,
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
  }, []);

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
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div
        className={`${role !== 'Admin' ? 'bg-blue ' : 'bg-green-radiant'}  banner-main flex items-center`}
      >
        <div
          className={role !== 'Admin' ? 'radiant-anime' : 'radiant-anime-2'}
        ></div>
        <div className="banner-wrap">
          {/* left side  */}
          <div className="flex items-center pl4 banner-left">
            <img
              src={role !== 'Admin' ? ICONS.BannerLogo : ICONS.OWEBanner}
              alt="solar-name-icon"
            />
            <div className="">
              {role !== 'Admin' ? (
                <h1 className="solar-heading">
                  {details?.dealer_name || 'N/A'}
                </h1>
              ) : (
                <h1 className="solar-heading green-banner-heading">
                  OUR WORLD ENERGY
                </h1>
              )}
              {role !== 'Admin' ? (
                <div className="flex items-center ">
                  <img
                    src={details?.dealer_logo || ICONS.OWEBannerLogo}
                    alt=""
                  />
                  <p className="left-ban-des">
                    Powered by <br /> <span>Our World Energy</span>
                  </p>
                </div>
              ) : null}
            </div>
          </div>
          {role !== 'Admin' ? <div className="straight-line"></div> : null}
          {/* right side  */}
          <div className="flex items-center banner-right">
            {role !== 'Admin' ? (
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
            <div className={role !== 'Admin' ? 'banner-trophy' : 'user-trophy'}>
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

            {role === 'Dealer Owner' && (
              <button
                className="edit-button"
                onClick={() => setShowModal(true)}
              >
                <LiaEdit className="edit-svg" />
                <p>Edit</p>
              </button>
            )}
          </div>
        </div>
        {showModal && (
          <EditModal
            onClose={() => setShowModal(false)}
            vdealer={vdealer}
            setRefetch={setRefetch}
          />
        )}
      </div>

      {role === 'Admin' && (
        <div
          className=" dealer-dropdown-filter"
          style={{ zIndex: 999 }}
          ref={dropdownRef}
        >
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="dealer-toggler pointer flex items-center"
          >
            <span>{selectDealer.length} Teams</span>
            <FaChevronDown className="ml1" />
          </div>
          {isOpen && (
            <div
              className=" scrollbar dropdown-menu "
              style={{ overflowX: 'clip' }}
            >
              <div className="searchBox">
                <input
                  type="text"
                  className="input"
                  placeholder="Search Dealers"
                  style={{ width: '100%' }}
                  onChange={(e) => {
                    if (e.target.value.trim()) {
                      setOpts((prev) =>
                        prev.filter((item) =>
                          item.value
                            .toLowerCase()
                            .includes(e.target.value.trim())
                        )
                      );
                    } else {
                      setOpts(dealerOption(newFormData));
                    }
                  }}
                />
              </div>
              <div className="dropdown-item">
                <input
                  type="checkbox"
                  style={{ flexShrink: 0 }}
                  checked={
                    dealerOption(newFormData).length === selectDealer.length
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
              {opts?.map?.((option, ind) => (
                <div key={option.value} className="dropdown-item">
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
            options={dealerOption(newFormData)}
            onChange={(newValue) => setSelectDealer([...newValue])}
            value={selectDealer}
          /> */}
        </div>
      )}
    </div>
  );
};

export default Banner;
