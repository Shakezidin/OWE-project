import './Banner.css';
import { ICONS } from '../../../resources/icons/Icons';
import { LiaEdit } from 'react-icons/lia';
import EditModal from './EditModal';
import { useState, useEffect, useRef, SetStateAction } from 'react';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { toast } from 'react-toastify';
import { EndPoints } from '../../../infrastructure/web_api/api_client/EndPoints';
import { FaChevronDown } from 'react-icons/fa';
import { TYPE_OF_USER } from '../../../resources/static_data/Constant';
import useAuth from '../../../hooks/useAuth';
import { Tooltip } from 'react-tooltip';
import useMatchMedia from '../../../hooks/useMatchMedia';


interface BannerProps {
  selectDealer: { label: string; value: string }[];
  selectedRecruiter: { label: string; value: string }[];
  setSelectedRecruiter: React.Dispatch<
    React.SetStateAction<{ label: string; value: string }[]>
  >;
  setSelectDealer: React.Dispatch<
    React.SetStateAction<{ label: string; value: string }[]>
  >;
  bannerDetails: any;
  groupBy: string;
  isShowDropdown: boolean;
  isGenerating: boolean;
  setIsFetched: React.Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
}

const Banner: React.FC<BannerProps> = ({
  selectDealer,
  setSelectDealer,
  selectedRecruiter,
  setSelectedRecruiter,
  isShowDropdown,
  setIsFetched,
  isGenerating,
  isLoading,
  groupBy,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [details, setDetails] = useState<any>('');
  const [dealerId, setDealerId] = useState('');
  const [newFormData, setNewFormData] = useState<any>([]);
  const [vdealer, setVdealer] = useState('');
  const [refetch, setRefetch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenn, setIsOpenn] = useState(false);
  const [search, setSearch] = useState('');
  const [opts, setOpts] = useState<{ label: string; value: string }[]>([]);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    []
  );
  const { authData, getUpdatedAuthData } = useAuth();
  const [isAuthenticated, setAuthenticated] = useState(false);
  const tableData = {
    tableNames: ['dealer_name', 'recruiter'],
  };
  const role = authData?.role;

  useEffect(() => {
    const isPasswordChangeRequired =
      authData?.isPasswordChangeRequired?.toString();
    setAuthenticated(isPasswordChangeRequired === 'false');
  }, [authData]);

  const leaderDealer = (newFormData: any): { value: string; label: string }[] =>
    newFormData?.dealer_name?.map((value: string) => ({
      value,
      label: value,
    }));

  const leaderRecruiter = (
    newFormData: any
  ): { value: string; label: string }[] =>
    newFormData?.recruiter?.map((value: string) => ({
      value,
      label: value,
    }));

  const getNewFormData = async () => {
    const res = await postCaller(EndPoints.get_newFormData, tableData);
    if (res.status > 200) {
      return;
    }
    setNewFormData(res.data);
    setSelectDealer(leaderDealer(res.data));

    setOpts(leaderDealer(res.data));
    setOptions(leaderRecruiter(res.data));
    setIsFetched(true);
  };
  useEffect(() => {
    if (
      role === 'Admin' ||
      role === TYPE_OF_USER.FINANCE_ADMIN ||
      role === TYPE_OF_USER.ACCOUNT_EXCUTIVE ||
      role === TYPE_OF_USER.ACCOUNT_MANAGER ||
      role === TYPE_OF_USER.DEALER_OWNER ||
      role === TYPE_OF_USER.PROJECT_MANAGER ||
      isShowDropdown
    ) {
      getNewFormData();
    }
  }, [role]);
  useEffect(() => {
    if (
      role !== 'Admin' &&
      role !== TYPE_OF_USER.FINANCE_ADMIN &&
      role !== TYPE_OF_USER.ACCOUNT_EXCUTIVE &&
      role !== TYPE_OF_USER.ACCOUNT_MANAGER &&
      role !== TYPE_OF_USER.PROJECT_MANAGER &&
      isAuthenticated
    ) {
      (async () => {
        try {
          const data = await postCaller('get_leaderboarddatarequest', {});
          if (data.status > 201) {
            toast.error(data?.message);
            return;
          }
          setDetails(data?.data);
          setDealerId(data?.data?.dealer_id);
        } catch (error) {
          console.error(error);
        } finally {
        }
      })();
    }
  }, [role, refetch, isAuthenticated]);

  useEffect(() => {
    if (
      role === TYPE_OF_USER.ADMIN ||
      role === TYPE_OF_USER.FINANCE_ADMIN ||
      role === TYPE_OF_USER.ACCOUNT_EXCUTIVE ||
      role === TYPE_OF_USER.ACCOUNT_MANAGER
    ) {
      const updatedAuthData = getUpdatedAuthData();
      if (updatedAuthData && updatedAuthData.adminTheme) {
        setDetails((prev: any) => ({ ...prev, ...updatedAuthData.adminTheme }));
      }
    }
  }, [refetch, role]);
  const isMobile = useMatchMedia('(max-width: 767px)');

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
            toast.error(data.message);
            return;
          }
          setVdealer(data?.data?.vdealers_list[0]);
        } catch (error) {
          console.error(error);
        } finally {
        }
      })();
    }
  }, [details]);

  const recruiterDropdownRef = useRef<HTMLDivElement | null>(null);
  const partnerDropdownRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (opt: { label: string; value: string }) => {
    setSelectedRecruiter([]); // Clear recruiters when a dealer is selected
    const isExist = selectDealer.some((item) => item.value === opt.value);
    if (isExist) {
      setSelectDealer((prev) =>
        prev.filter((item) => item.value !== opt.value)
      );
    } else {
      setSelectDealer((prev) => [...prev, opt]);
    }
  };
  const handleChangee = (opt: { label: string; value: string }) => {
    setSelectDealer([]); // Clear dealers when a recruiter is selected
    const isExist = selectedRecruiter.some((item) => item.value === opt.value);
    if (isExist) {
      setSelectedRecruiter((prev) =>
        prev.filter((item) => item.value !== opt.value)
      );
    } else {
      setSelectedRecruiter((prev) => [...prev, opt]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        recruiterDropdownRef.current &&
        !recruiterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpenn(false);
        setOptions(leaderRecruiter(newFormData));
        setSearch('');
      }
      if (
        partnerDropdownRef.current &&
        !partnerDropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setOpts(leaderDealer(newFormData));
        setSearch('');
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpenn(false);
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [newFormData, search]);

  console.log('details', details);
  return (
    <div className="relative">
      <div
        className={`${role !== 'Admin' && role !== TYPE_OF_USER.FINANCE_ADMIN && role !== TYPE_OF_USER.ACCOUNT_EXCUTIVE && role !== TYPE_OF_USER.ACCOUNT_MANAGER && role !== TYPE_OF_USER.PROJECT_MANAGER ? 'bg-blue ' : 'bg-green-radiant'}  banner-main flex items-center`}
        style={{ background: details.bg_color || undefined }}
      >
        <div
          className={
            role !== 'Admin' &&
              role !== TYPE_OF_USER.FINANCE_ADMIN &&
              role !== TYPE_OF_USER.ACCOUNT_EXCUTIVE &&
              role !== TYPE_OF_USER.ACCOUNT_MANAGER &&
              role !== TYPE_OF_USER.PROJECT_MANAGER
              ? 'radiant-anime'
              : 'radiant-anime-2'
          }
        ></div>
        <div className="banner-wrap">
          {/* left side  */}
          {!isGenerating ? (
            <button
              className={`edit-button ${isLoading ? 'edit-button-load' : ''}`}
              onClick={() => !isLoading && setShowModal(true)}
            >
              <LiaEdit className="edit-svg" />
              <p>Edit</p>
            </button>
          ) : null}

          <div className="flex items-center pl4 banner-left">
            {role !== TYPE_OF_USER.FINANCE_ADMIN &&
              role !== TYPE_OF_USER.ADMIN &&
              role !== TYPE_OF_USER.ACCOUNT_EXCUTIVE &&
              role !== TYPE_OF_USER.ACCOUNT_MANAGER &&
              role !== TYPE_OF_USER.PROJECT_MANAGER &&
              details?.dealer_logo && (
                <img
                  src={
                    role === 'Admin' ||
                      role === TYPE_OF_USER.FINANCE_ADMIN ||
                      role === TYPE_OF_USER.ACCOUNT_EXCUTIVE ||
                      role === TYPE_OF_USER.ACCOUNT_MANAGER
                      ? details?.dealer_logo || ICONS.OWEBanner
                      : details?.dealer_logo || ICONS.BannerLogo
                  }
                  style={{ maxWidth: 132, maxHeight: 180 }}
                  alt="solar-name-icon"
                />
              )}
            {(role === TYPE_OF_USER.FINANCE_ADMIN ||
              role === TYPE_OF_USER.ADMIN ||
              role === TYPE_OF_USER.ACCOUNT_EXCUTIVE ||
              role === TYPE_OF_USER.ACCOUNT_MANAGER ||
              role === TYPE_OF_USER.PROJECT_MANAGER) && (
                <img
                  src={
                    role === 'Admin' ||
                      role === TYPE_OF_USER.FINANCE_ADMIN ||
                      role === TYPE_OF_USER.ACCOUNT_EXCUTIVE ||
                      role === TYPE_OF_USER.ACCOUNT_MANAGER
                      ? details?.dealer_logo || ICONS.OWEBanner
                      : details?.dealer_logo || ICONS.BannerLogo
                  }
                  style={{ maxWidth: 132, maxHeight: 180 }}
                  alt="solar-name-icon"
                />
              )}
            <div className="">
              {role !== 'Admin' &&
                role !== TYPE_OF_USER.FINANCE_ADMIN &&
                role !== TYPE_OF_USER.ACCOUNT_EXCUTIVE &&
                role !== TYPE_OF_USER.ACCOUNT_MANAGER &&
                role !== TYPE_OF_USER.PROJECT_MANAGER ? (
                <h1 className="solar-heading">
                  {details?.daeler_name || 'N/A'}
                </h1>
              ) : (
                <h1 className="solar-heading green-banner-heading">
                  OUR WORLD ENERGY
                </h1>
              )}
              {role !== 'Admin' &&
                role !== TYPE_OF_USER.FINANCE_ADMIN &&
                role !== TYPE_OF_USER.ACCOUNT_EXCUTIVE &&
                role !== TYPE_OF_USER.ACCOUNT_MANAGER &&
                role !== TYPE_OF_USER.PROJECT_MANAGER ? (
                <div className="flex items-center ">
                  <img src={ICONS.OWEBannerLogo} alt="" />
                  <p className="left-ban-des">
                    Powered by <br /> <span>Our World Energy</span>
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {role !== 'Admin' &&
            role !== TYPE_OF_USER.FINANCE_ADMIN &&
            role !== TYPE_OF_USER.ACCOUNT_EXCUTIVE &&
            role !== TYPE_OF_USER.ACCOUNT_MANAGER &&
            role !== TYPE_OF_USER.PROJECT_MANAGER ? (
            <div className="straight-line"></div>
          ) : null}
          {/* right side  */}
          <div className="flex items-center banner-right">
            {role !== 'Admin' &&
              role !== TYPE_OF_USER.FINANCE_ADMIN &&
              role !== TYPE_OF_USER.ACCOUNT_EXCUTIVE &&
              role !== TYPE_OF_USER.ACCOUNT_MANAGER &&
              role !== TYPE_OF_USER.PROJECT_MANAGER ? (
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
                role !== 'Admin' &&
                  role !== TYPE_OF_USER.FINANCE_ADMIN &&
                  role !== TYPE_OF_USER.ACCOUNT_EXCUTIVE &&
                  role !== TYPE_OF_USER.ACCOUNT_MANAGER &&
                  role !== TYPE_OF_USER.PROJECT_MANAGER
                  ? 'banner-trophy'
                  : 'user-trophy'
              }
            >
              <img
                src={ICONS.BannerTrophy}
                style={{ maxWidth: 241 }}
                alt="banner-trophy-image"
              />
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

      <div className='dropdowns-lbd-new'>

        {(role === 'Admin' ||
          role === TYPE_OF_USER.FINANCE_ADMIN

        ) && (
            <div
              className="dealer-dropdown-filter"
              style={{
                zIndex: 100,
                marginRight: isMobile
                  ? (selectedRecruiter?.length > 0 && selectDealer?.length === 0)
                    ? '73px'
                    : (selectedRecruiter?.length === 0 && selectDealer?.length === 0)
                      ? '80px'
                      : (selectedRecruiter?.length > 0 && selectDealer?.length > 0)
                        ? '87px'
                        : '89px'
                  : (selectedRecruiter?.length > 0 && selectDealer?.length === 0)
                    ? '118px'
                    : (selectedRecruiter?.length === 0 && selectDealer?.length === 0)
                      ? '115px'
                      : (selectedRecruiter?.length > 0 && selectDealer?.length > 0)
                        ? '138px'
                        : '135px'
              }}

              ref={recruiterDropdownRef}
            >
              {!isGenerating ? (
                <div
                  onClick={() => !isLoading && setIsOpenn(!isOpenn)}
                  className={`dealer-toggler pointer flex items-center ${isOpenn ? 'open' : ''
                    } ${isLoading ? 'dealer-toggler-load' : ''}`}
                >
                  <span>
                    {selectedRecruiter?.length ?? '0'}{' '}
                    <span>
                      {selectedRecruiter?.length > 1 ? 'Recruiters' : 'Recruiter'}
                    </span>
                  </span>
                  <FaChevronDown className="ml1 fa-chevron-down" />
                </div>
              ) : null}

              {isOpenn && (
                <div
                  className=" scrollbar dealer-dropdown dropdown-menu "
                  style={{ overflowX: 'clip' }}
                >
                  <div className="searchBox">
                    <input
                      type="text"
                      className="input leaderboard-input"
                      placeholder="Search Recuriters"
                      style={{ width: '100%' }}
                      value={search}
                      disabled={isLoading}
                      onChange={(e) => {
                        // Remove any non-alphanumeric characters
                        const sanitizedValue = e.target.value.replace(
                          /[^a-zA-Z0-9 _-]/g,
                          ''
                        );
                        setSearch(sanitizedValue);

                        if (sanitizedValue.trim()) {
                          const filtered = leaderRecruiter(newFormData)?.filter(
                            (item) =>
                              item?.value
                                .toLowerCase()
                                .includes(sanitizedValue.toLowerCase().trim())
                          );
                          setOptions([...filtered]);
                        } else {
                          setOptions(leaderRecruiter(newFormData));
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
                          leaderRecruiter(newFormData)?.length ===
                          selectedRecruiter?.length
                        }
                        onChange={() => {
                          setSelectDealer([]); // Clear dealers
                          if (options.length === selectedRecruiter?.length) {
                            setSelectedRecruiter([]);
                          } else {
                            setSelectedRecruiter([...options]);
                          }
                        }}
                      />
                      All
                    </div>
                  )}
                  {options?.length ? (
                    options?.map?.((option, ind) => (
                      <div key={ind} className="dropdown-item">
                        <input
                          type="checkbox"
                          style={{ flexShrink: 0 }}
                          disabled={isLoading}
                          checked={selectedRecruiter?.some(
                            (item) => item.value === option.value
                          )}
                          onChange={() => handleChangee(option)}
                        />
                        {/* <span className="dropdown-text" data-tooltip-id={option.label.length > 13 ? option.label : ''}>
                          {option.label}
                        </span> */}
                        <span className="dropdown-text" data-tooltip-id={option.label.length > 13 ? option.label : ''}>
                          {option.label.length > 13 ? option.label.substring(0, 13) + "..." : option.label}
                        </span>
                        {option.label.length > 13 && (
                          <Tooltip
                            style={{
                              zIndex: 20,
                              background: "#f7f7f7",
                              color: "#292b2e",
                              fontSize: 12,
                              paddingBlock: 4,
                            }}
                            offset={8}
                            id={option.label}
                            place="bottom"
                            content={option.label}
                          />
                        )}

                      </div>
                    ))
                  ) : (
                    <div
                      className="text-center"
                      style={{ fontSize: 14, color: '#000' }}
                    >
                      No Data Found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        {(role === 'Admin' ||
          role === TYPE_OF_USER.FINANCE_ADMIN ||
          role === TYPE_OF_USER.ACCOUNT_EXCUTIVE ||
          role === TYPE_OF_USER.ACCOUNT_MANAGER ||
          role === TYPE_OF_USER.PROJECT_MANAGER ||
          (role === TYPE_OF_USER.DEALER_OWNER && groupBy === 'dealer')) && (
            <div
              className="dealer-dropdown-filter"
              style={{ zIndex: 100 }}
              ref={partnerDropdownRef}
            >
              {!isGenerating ? (
                <div
                  onClick={() => !isLoading && setIsOpen(!isOpen)}
                  className={`dealer-toggler pointer flex items-center ${isOpen ? 'open' : ''
                    } ${isLoading ? 'dealer-toggler-load' : ''}`}
                >
                  <span>
                    {selectDealer?.length ?? '0'}{' '}
                    <span>{selectDealer?.length > 1 ? 'Partners' : 'Partner'}</span>
                  </span>
                  <FaChevronDown className="ml1 fa-chevron-down" />
                </div>
              ) : null}

              {isOpen && (
                <div
                  className=" scrollbar dealer-dropdown dropdown-menu "
                  style={{ overflowX: 'clip' }}
                >
                  <div className="searchBox">
                    <input
                      type="text"
                      className="input leaderboard-input"
                      placeholder="Search Partners"
                      style={{ width: '100%' }}
                      value={search}
                      disabled={isLoading}
                      onChange={(e) => {
                        // Remove any non-alphanumeric characters
                        const sanitizedValue = e.target.value.replace(
                          /[^a-zA-Z0-9 _-]/g,
                          ''
                        );
                        setSearch(sanitizedValue);

                        if (sanitizedValue.trim()) {
                          const filtered = leaderDealer(newFormData)?.filter(
                            (item) =>
                              item?.value
                                .toLowerCase()
                                .includes(sanitizedValue.toLowerCase().trim())
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
                          leaderDealer(newFormData)?.length === selectDealer?.length
                        }
                        onChange={() => {
                          setSelectedRecruiter([]); // Clear recruiters
                          if (opts.length === selectDealer?.length) {
                            setSelectDealer([]);
                          } else {
                            setSelectDealer([...opts]);
                          }
                        }}
                      />
                      All
                    </div>
                  )}
                  {opts?.length ? (
                    opts?.map?.((option, ind) => (
                      <div key={ind} className="dropdown-item">
                        <input
                          type="checkbox"
                          style={{ flexShrink: 0 }}
                          disabled={isLoading}
                          checked={selectDealer?.some(
                            (item) => item.value === option.value
                          )}
                          onChange={() => handleChange(option)}
                        />
                        {/* <span className="dropdown-text" data-tooltip-id={option.label.length > 13 ? option.label : ''}>
                          {option.label}
                        </span> */}
                        <span
                          className="dropdown-text"
                          data-tooltip-id={option.label.length > 10 ? `tooltip-${option.label}` : ''} // Ensure unique tooltip ID
                        >
                          {option.label.length > 15 ? option.label.substring(0, 15) + "..." : option.label}
                        </span>
                        {option.label.length > 11 && (
                          <Tooltip
                            style={{
                              zIndex: 20,
                              background: "#f7f7f7",
                              color: "#292b2e",
                              fontSize: 12,
                              paddingBlock: 4,
                              width: "140px",
                            }}
                            offset={8}
                            id={`tooltip-${option.label}`} // Ensure ID matches data-tooltip-id
                            place="bottom"
                            content={option.label}
                          />
                        )}

                     

                      </div>
                    ))
                  ) : (
                    <div
                      className="text-center"
                      style={{ fontSize: 14, color: '#000' }}
                    >
                      No Data Found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
      </div>

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
