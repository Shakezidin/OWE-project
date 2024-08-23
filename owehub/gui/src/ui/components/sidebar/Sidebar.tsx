import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './sidebar.css';
import { ICONS } from '../../../resources/icons/Icons';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlinePayment } from 'react-icons/md';
import { FiLayers } from 'react-icons/fi';
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdKeyboardArrowUp,
} from 'react-icons/md';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { LuWallet } from 'react-icons/lu';
import { createSideMenuList } from '../../../routes/SideMenuOption';
import { GrDocumentPerformance } from 'react-icons/gr';
import { AiOutlineProject } from 'react-icons/ai';
import useMatchMedia from '../../../hooks/useMatchMedia';
import { TYPE_OF_USER } from '../../../resources/static_data/Constant';
import { ROUTES } from '../../../routes/routes';

interface Child {
  path: string;
  sidebarProps: {
    displayText: string;
    icon: React.JSX.Element;
  };
}
interface Toggleprops {
  toggleOpen: boolean;
  setToggleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarChange: React.Dispatch<React.SetStateAction<number>>;
  sidebarChange: number;
}

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

const Sidebar: React.FC<Toggleprops> = ({ toggleOpen, setToggleOpen }) => {
  const [repay, setRepay] = useState<boolean>(false);
  const [db, setDb] = useState<boolean>(false);
  const [project, setProject] = useState<boolean>(false);

  const [cords, setCords] = useState<{
    left: number;
    top: number;
    opacity: number;
    text: string;
    child: Child[];
    id?: number;
  }>({ left: 0, top: 0, opacity: 0, text: '', child: [], id: -1 });
  const isTablet = useMatchMedia('(max-width: 1024px)');
  const location = useLocation();
  const timeOut = useRef<NodeJS.Timeout | null>(null);

  const role = localStorage.getItem('role');

  const dealer = localStorage.getItem('dealer');
  console.log(dealer, "sidebar dealer")

  const filteredList = useMemo(() => {
    let list = [...createSideMenuList()];
    if ( role === TYPE_OF_USER.ADMIN) {
      const newArr: any[] = [{ mob: [] }];
      list[0].mob.forEach((item: any) => {
        newArr[0].mob.push(item);
      });
      return newArr;
    }else if (role === TYPE_OF_USER.DEALER_OWNER) {
      if (dealer === "WhyGen Solar") {
        return list;
      } else {
        const newArr: any[] = [{ mob: [] }];
        list[0].mob.forEach((item: any) => {
          if (
            item.path !== ROUTES.PROJECT_PERFORMANCE &&
            item.path !== ROUTES.PROJECT_STATUS
          ) {
            newArr[0].mob.push(item);
          }
        });
        return newArr;
      }
    } else if ( role === TYPE_OF_USER.FINANCE_ADMIN) {
      const newArr: any[] = [{ mob: [] }];
      list[0].mob.forEach((item: any) => {
        if (item.path !== ROUTES.USER_MANAEMENT) {
          newArr[0].mob.push(item);
        }
      });
      return newArr;
    } else if (role === TYPE_OF_USER.APPOINTMENT_SETTER) {
      const newArr: any[] = [{ mob: [] }];
      list[0].mob.forEach((item: any) => {
        if (
          item.path !== ROUTES.TEAM_MANAGEMENT_DASHBOARD &&
          item.path !== ROUTES.USER_MANAEMENT &&
          ((dealer && dealer === "WhyGen Solar") ||
            (item.path !== ROUTES.PROJECT_PERFORMANCE &&
              item.path !== ROUTES.PROJECT_STATUS))
        ) {
          newArr[0].mob.push(item);
        }
      });
      return newArr;
    }else if (role === TYPE_OF_USER.DB_USER) {
      const newArr: any[] = [{ mob: [] }];
      list[0].mob.forEach((item: any) => {
        if (
          item.path !== ROUTES.TEAM_MANAGEMENT_DASHBOARD &&
          item.path !== ROUTES.USER_MANAEMENT &&
          item.path !== ROUTES.PROJECT_PERFORMANCE &&
          item.path !== ROUTES.PROJECT_STATUS
        ) {
          newArr[0].mob.push(item);
        }
      });
      return newArr;
    } else {
      const newArr: any[] = [{ mob: [] }];
      list[0].mob.forEach((item: any) => {
        if (
          item.path !== ROUTES.USER_MANAEMENT &&
          ((dealer && dealer === "WhyGen Solar") ||
            (item.path !== ROUTES.PROJECT_PERFORMANCE &&
              item.path !== ROUTES.PROJECT_STATUS))
        ) {
          newArr[0].mob.push(item);
        }
      });
      return newArr;
    }
  }, [createSideMenuList, role]);


  const handleMouseover = (
    e: React.MouseEvent<HTMLAnchorElement | MouseEvent>,
    name: string,
    child: Child[],
    id?: number
  ) => {
    const elm = e.target as HTMLAnchorElement;
    console.log('working', id, 'didiididid');

    if (timeOut.current) {
      clearTimeout(timeOut.current);
    }
    if (
      elm.classList.contains('side-icon-container') ||
      elm.classList.contains('side-accordian') ||
      elm.classList.contains('side-icon-container-1')
    ) {
      const co = elm.getBoundingClientRect();
      setCords({
        top: co.top,
        left: co.width + co.left,
        opacity: 1,
        text: name,
        child,
        id,
      });
    }
  };

  useEffect(() => {
    if (toggleOpen) {
      setDb(false);
      setProject(false);
    }
  }, [toggleOpen]);

  const width = useWindowWidth();

  // TODO showing required routes for now
  // const isMobile = width < 768;
  const isMobile = true;


  console.log(dealer, "dealer")
  return (
    <div
      style={{ zIndex: '30' }}
      className={`side-bar-container ${toggleOpen ? 'side-bar-active hidden' : 'show'}`}
    >
      <div
        className={`side-bar-content ${
          toggleOpen ? 'side-bar-content-active' : ''
        }`}
        style={{ paddingInline: !toggleOpen ? 10 : '' }}
      >
        {filteredList.map((el: any, i: number) => (
          <div className="" key={i}>
            {isMobile && (
              <div className="" style={{ marginTop: toggleOpen ? 0 : '-2px' }}>
                {el.mob?.map((oth: any, index: number) => (
                  <Link
                    key={index}
                    style={{ paddingLeft: toggleOpen ? '.8rem' : '' }}
                    to={oth.path}
                    onClick={() => isTablet && setToggleOpen((prev) => !prev)}
                    onMouseEnter={(e) =>
                      toggleOpen &&
                      !isTablet &&
                      handleMouseover(
                        e,
                        oth.sidebarProps.displayText,
                        [],
                        index + 8
                      )
                    }
                    onMouseLeave={() => {
                      timeOut.current = setTimeout(() => {
                        setCords((prev) => ({ ...prev, opacity: 0, id: -1 }));
                      }, 500);
                    }}
                    className={`side-icon-container ${
                      location.pathname === oth.path
                        ? 'active-link-bg'
                        : 'not-active-link'
                    }`}
                  >
                    <div
                      className={
                        location.pathname === oth.path
                          ? 'sidebaricon'
                          : 'sidebariconn'
                      }
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        width: 24,
                        height: 24,
                        borderRadius: 4,
                        marginLeft: !toggleOpen ? '' : '-1px',
                        background:
                          toggleOpen && location.pathname === oth.path
                            ? ''
                            : toggleOpen
                              ? 'transparent'
                              : 'transparent',
                      }}
                    >
                      {oth.sidebarProps.icon && oth.sidebarProps.icon}
                    </div>

                    {toggleOpen && !isTablet ? null : (
                      <p
                        className={
                          location.pathname === oth.path
                            ? 'tablink'
                            : 'tablinkk'
                        }
                      >
                        {oth.sidebarProps.displayText}
                      </p>
                    )}
                    <div
                      className="tip"
                      style={{
                        backgroundColor: '#fff',
                        position: 'fixed',
                        top: cords.top,
                        left: cords.left,
                        display:
                          cords.opacity && cords.id === index + 8
                            ? 'block'
                            : 'none',

                        maxHeight: '300px',
                        minWidth: '150px',
                        overflowY: 'scroll',
                        borderBottomRightRadius: '4px',
                        borderTopRightRadius: '4px',
                        borderLeft: '1px solid #D9D9D9',
                        color: 'black',
                      }}
                    >
                      <Link
                        to="#"
                        className=""
                        style={{
                          display: 'block',
                          background: '#377CF6',
                          padding: '11px 12px',
                          color: 'white',
                          width: '100%',
                          fontWeight: '500',
                          borderBottom: '1px solid #E8E8E8',
                          fontSize: '13px',
                          // borderRight: "3px solid #377CF6",
                          cursor: 'default',
                          pointerEvents: 'none',
                        }}
                      >
                        {' '}
                        {cords.text}
                      </Link>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
