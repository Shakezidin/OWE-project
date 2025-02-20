import React, { useState, useEffect, useRef } from 'react';
import './layout.css';
import '../layout/layout.css';
import {
    MdKeyboardArrowDown,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdRefresh,
} from 'react-icons/md';
import { ICONS } from '../../../resources/icons/Icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/apiSlice/authSlice/authSlice';
import { ROUTES } from '../../../routes/routes';
import { FaUserCircle } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import useMatchMedia from '../../../hooks/useMatchMedia';
import { IoMenu } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import useAuth from '../../../hooks/useAuth';
import useWindowWidth from '../../../hooks/useWindowWidth';
import styles from './datheader.module.css';
import Select from 'react-select';
import oweLogo from '../../DatTool/assets/oweLogo.svg'
interface OptionType {
    value: string;
    label: string;
}
interface Toggleprops {
    toggleOpen: boolean;
    setToggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSidebarChange: React.Dispatch<React.SetStateAction<number>>;
    sidebarChange: number;
    dbStatus: boolean;
    activeMenu: string;
    setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
    setRefreshDat: React.Dispatch<React.SetStateAction<boolean>>;
}

const DatHeader: React.FC<Toggleprops> = ({ setRefreshDat, activeMenu, setActiveMenu, toggleOpen, setToggleOpen, dbStatus }) => {
    const [name, setName] = useState<String>();
    const { authData, clearAuthData } = useAuth();

    const userRole = authData?.role;
    const userName = authData?.userName;
    const [openIcon, setOPenIcon] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const isTablet = useMatchMedia('(max-width: 1024px)');
    const isIpad = useMatchMedia('(max-width: 900px)');

    const width = useWindowWidth();
    const isMobile = width < 768;
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    const isStaging = process.env.REACT_APP_ENV;
    const isSmMobile = useMatchMedia('(max-width: 480px)');

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    useEffect(() => {
        if (userName) {
            const firstLetter = userName.charAt(0).toUpperCase();
            setName(firstLetter);
        }
    }, [userName]);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 0;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    // Code for if we click anywhere outside dropdown he will close
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOPenIcon(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const [selectedOption, setSelectedOption] = useState<any>({ value: '7090', label: '7090' });
    const [isOpen, setIsOpen] = useState(false);


    const handleMenuClick = (page: string) => {
        setActiveMenu(page);
    };


    const handleChange = (selectedOption: any) => {
        setSelectedOption(selectedOption);
        setIsOpen(false);
    };
    const customStyles = {
        control: (provided: any, state: any) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
            border: 'none',
            borderRadius: '50px',
            padding: '0px 4px',
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: '21px',
            fontFamily: 'Poppins',
            minHeight: '36px',
            minWidth: '100px',
            boxShadow: 'none',
            backgroundColor: state.selectProps.menuIsOpen ? '#2A2626' : 'transparent',
            cursor: 'pointer',
            color: state.isFocused || state.selectProps.menuIsOpen ? '#fff' : '#2A2626',
            '&:hover': {
                backgroundColor: 'rgba(42, 38, 38, 0.2)',
                color: '#fff'
            },
        }),

        placeholder: (provided: any, state: any) => ({
            ...provided,
            color: state.isFocused || state.selectProps.menuIsOpen ? '#fff' : '#2A2626',
            padding: '0px 4px',
            transition: 'color 0.2s ease',
        }),

        dropdownIndicator: (provided: any, state: any) => ({
            ...provided,
            color: state.selectProps.menuIsOpen ? '#fff' : '#2A2626',
            transition: 'color 0.2s ease',
            padding: '0px 4px'

        }),

        indicatorSeparator: (provided: any) => ({
            ...provided,
            display: 'none',
        }),

        option: (provided: any, state: any) => ({
            ...provided,
            fontSize: '12px',
            cursor: 'pointer',
            background: state.isSelected ? '#377CF6' : '#fff',
            color: provided.color,
            '&:hover': {
                background: state.isSelected ? '#377CF6' : '#DDEBFF',
            },
        }),

        singleValue: (provided: any, state: any) => ({
            ...provided,
            color: state.selectProps.menuIsOpen ? '#fff' : '#2A2626',
            transition: 'color 0.2s ease',
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: '21px',
            marginLeft: '5px',
        }),

        menu: (provided: any) => ({
            ...provided,
            width: '100%',
            marginTop: '3px',
            borderRadius: '7px',
            padding: '0px 10px',
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: '21px'
        }),

        menuList: (provided: any) => ({
            ...provided,
            '&::-webkit-scrollbar': {
                scrollbarWidth: 'thin',
                scrollBehavior: 'smooth',
                display: 'block',
                scrollbarColor: 'rgb(173, 173, 173) #fff',
                width: 8,
            },
            '&::-webkit-scrollbar-thumb': {
                background: 'rgb(173, 173, 173)',
                borderRadius: '30px',
            },
        }),
        valueContainer: (provided: any) => ({
            ...provided,
            padding: '0px 3px',
        }),
    };

    const options: OptionType[] = [
        { value: '7090', label: '7090' },
        { value: '7190', label: '7190' },
        { value: '7290', label: '7290' },
        { value: '7390', label: '7390' },
        { value: '7490', label: '7490' },
    ];
    console.log(selectedOption, "7090")


    return (
        <div className={`${scrolled ? 'header-scrolled' : ''} header-content`}>


            <div className="header-icon">
                <div
                    className={`side-bar-logo ${toggleOpen ? 'side-bar-logo-active' : ''}`}
                    style={{
                        width: !toggleOpen && !isTablet ? 240 : 50,
                        paddingLeft: toggleOpen || isTablet ? 0 : undefined,
                    }}
                    onClick={() => isTablet && setToggleOpen((prev) => !prev)}
                >
                    {isTablet ? (
                        toggleOpen ? (
                            <IoMenu size={22} className="mx-auto" />
                        ) : (
                            <RxCross2 size={20} className="mx-auto" />
                        )
                    ) : (
                        <img
                            src={toggleOpen ? ICONS.sidebarLogoSquare : ICONS.VersionLogo}
                            alt=""
                            style={{
                                height: toggleOpen ? 30 : 45,
                                paddingLeft: toggleOpen ? 10 : '',
                            }}
                        />
                    )}

                    {!isTablet && (
                        <div
                            className={`icon-shape ${toggleOpen ? 'icon-shape-active' : ''}`}
                            onClick={() => setToggleOpen(!toggleOpen)}
                            style={{
                                position: 'absolute',
                                right: toggleOpen ? -17 : 0,
                                top: '10px',
                                borderRadius: toggleOpen
                                    ? '0px 10px 10px 0px'
                                    : '10px 0 0 10px',
                            }}
                        >
                            {toggleOpen ? (
                                <MdKeyboardArrowRight
                                    style={{ fontSize: '1.2rem', color: '#23B364' }}
                                />
                            ) : (
                                <MdKeyboardArrowLeft
                                    style={{ fontSize: '1.2rem', color: '#23B364' }}
                                />
                            )}
                        </div>
                    )}
                </div>
                <div
                    className="header-logo flex items-center"
                    style={{
                        marginLeft: isTablet ? 'unset !important' : 25,
                        height: isTablet ? '100%' : '',
                        alignSelf: isTablet ? 'center' : '',
                        display: isTablet ? 'none' : 'flex',
                        alignItems: isTablet ? 'center' : '',
                    }}
                >
                    <object
                        type="image/svg+xml"
                        data={ICONS.LOGO}
                        aria-label="login-icon"
                    ></object>
                    <img
                        src={ICONS.sidebarLogo}
                        alt=""
                        style={{
                            height: 36,
                            alignSelf: 'center',
                            display: isTablet ? 'flex' : 'none',
                            alignItems: 'center',
                        }}
                    />
                    <></>
                </div>
                <img
                    src={oweLogo}
                    alt=""
                    style={{
                        height: 35,
                        alignSelf: 'center',
                        display: isTablet ? 'flex' : 'none',
                        alignItems: 'center',
                        // paddingLeft: '1rem',
                    }}
                />
            </div>


            {!isSmMobile && <div className={styles.midElements}>
                <nav className={styles.menuContainer}>
                    <ul className={styles.menuItems}>
                        <li
                            className={activeMenu === 'General' ? styles.active : ''}
                            onClick={() => handleMenuClick('General')}
                        >
                            General
                        </li>
                        <li
                            className={activeMenu === 'Structural' ? styles.active : ''}
                            onClick={() => handleMenuClick('Structural')}
                        >
                            Structural
                        </li>
                        <li
                            className={activeMenu === 'Adders' ? styles.active : ''}
                            onClick={() => handleMenuClick('Adders')}
                        >
                            Adders
                        </li>
                        <li
                            className={activeMenu === 'Other' ? styles.active : ''}
                            onClick={() => handleMenuClick('Other')}
                        >
                            Other
                        </li>
                        <li
                            className={activeMenu === 'Notes' ? styles.active : ''}
                            onClick={() => handleMenuClick('Notes')}
                        >
                            Notes
                        </li>
                    </ul>
                </nav>
            </div>}







            { (
                <div className="dat-search-container" style={{marginLeft: isMobile ? "3rem":""}}>

                    <div className={styles.midElements}>
                        <div className={styles.headerLast}>

                            <div>
                                <Select
                                    value={selectedOption}
                                    onChange={handleChange}
                                    options={options}
                                    styles={customStyles}
                                    onFocus={() => setIsOpen(true)}
                                    onBlur={() => setIsOpen(false)}
                                    placeholder="Rev.No:"
                                    classNamePrefix="select"
                                    isSearchable={false}
                                    getOptionLabel={(option) => option.label}
                                    formatOptionLabel={(option, { context }) =>
                                        context === 'value' ? !isSmMobile ? `Rev.No: ${option.label}` : ` ${option.label}` : option.label
                                    }
                                />
                            </div>
                            {!isIpad && <div className={styles.iconContainer} onClick={() => { setRefreshDat(true) }}>
                                <MdRefresh size={18} />
                            </div>}
                        </div>
                    </div>

                    {!isIpad && <div
                        className="dat-user-container relative"
                        ref={dropdownRef}
                        onClick={() => setOPenIcon(!openIcon)}
                    >
                        <div className="dat-user-img-container ">
                            <div className="user-img">
                                <span>{name}</span>
                            </div>
                            <div className="dat-user-name">
                                <div className="down-arrow">
                                    <h4>Hello,&nbsp;{userName}</h4>
                                    <p className="admin-p">{userRole}</p>
                                </div>

                                <div className="">
                                    <div className="down-circle">
                                        {openIcon ? (
                                            <img src={ICONS.upperIcon} alt="" />
                                        ) : (
                                            <MdKeyboardArrowDown
                                                style={{ fontSize: '1.5rem', color: '#292B2E' }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {openIcon && (
                            <div className="header-modal-1" style={{ width: '225px' }}>
                                <div
                                    className="image-box-container"
                                    onClick={() => navigate(ROUTES.ACCOUNT_SETTING)}
                                >
                                    <div className="image-icon">
                                        <FaUserCircle />
                                    </div>
                                    <p
                                        className=""
                                        style={{ fontSize: '12px', fontWeight: '500' }}
                                    >
                                        My Account
                                    </p>
                                </div>

                                <div className="image-box-container " onClick={handleLogout}>
                                    <div className="image-icon">
                                        <IoMdLogOut />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>
                                            Logout
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>}
                </div>
            )}

            {isIpad && (
                <div className="search-container">

                    <div
                        className="user-container relative"
                        ref={dropdownRef}
                        onClick={() => setOPenIcon(!openIcon)}
                    >
                        <div className="user-img-container ">
                            <div className="user-img">
                                <span>{name}</span>
                            </div>
                            <div className="user-name">
                                <div className="">
                                    <div className="down-circle">
                                        {openIcon ? (
                                            <img src={ICONS.upperIcon} alt="" />
                                        ) : (
                                            <MdKeyboardArrowDown style={{ fontSize: '1.5rem' }} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {openIcon && (
                            <div className="header-modal-mob">
                                <div
                                    className="image-box-container"
                                    onClick={() => navigate(ROUTES.ACCOUNT_SETTING)}
                                >
                                    <div className="image-icon">
                                        <FaUserCircle />
                                    </div>
                                    <p
                                        className=""
                                        style={{ fontSize: '12px', fontWeight: '500' }}
                                    >
                                        My Account
                                    </p>
                                </div>

                                <div className="image-box-container " onClick={handleLogout}>
                                    <div className="image-icon">
                                        <IoMdLogOut />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: '500' }}>
                                            Logout
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default DatHeader;
