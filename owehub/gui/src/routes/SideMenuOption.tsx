import { ROUTES } from './routes';
import { BiSupport } from 'react-icons/bi';
import { RiUserSettingsLine } from 'react-icons/ri';
import { MdOutlinePayment, MdPendingActions } from 'react-icons/md';
import { GrDocumentConfig } from 'react-icons/gr';
import { GrDocumentPerformance } from 'react-icons/gr';
import { AiOutlineProject, AiOutlineTeam } from 'react-icons/ai';
import { ImStatsBars2 } from 'react-icons/im';
import { RiCalendarScheduleLine } from "react-icons/ri";
import { IoCloudUploadOutline, IoListSharp } from 'react-icons/io5';
import { PiMapPinArea } from "react-icons/pi";
const mob = {
  mob: [
    {
      path: ROUTES.PEINDING_QUEUE,
      sidebarProps: {
        displayText: 'Pending Actions ',
        icon: (
          <MdPendingActions
            size={20}
            style={{ marginLeft: '2px' }}
            color="black"
          />
        ),
      },
    },
    {
      path: ROUTES.LEADERBOARD,
      sidebarProps: {
        displayText: 'Leaderboard',
        icon: <ImStatsBars2 size={18} style={{ flexShrink: '0' }} />,
      },
    },
    {
      path: ROUTES.PROJECT_PERFORMANCE,
      sidebarProps: {
        displayText: 'Pipeline',
        icon: (
          <GrDocumentPerformance
            size={20}
            style={{ marginLeft: '5px' }}
            className="hover-icon"
          />
        ),
      },
    },
    {
      path: ROUTES.PROJECT_STATUS,
      sidebarProps: {
        displayText: 'Project Manager',
        icon: (
          <AiOutlineProject
            size={20}
            style={{ marginLeft: '3px' }}
            color="black"
          />
        ),
      },
    },
    {
      path: ROUTES.MAP_ADDRESS,
      sidebarProps: {
        displayText: 'Install Map',
        icon: (
          <PiMapPinArea
            size={20}
            style={{ marginLeft: '3px' }}
            color="black"
          />
        ),
      },
    },
    {
      path: ROUTES.COMMISSION_DASHBOARD,
      sidebarProps: {
        displayText: 'Dealer Pay',
        icon: (
          <MdOutlinePayment
            size={20}
            style={{ marginLeft: '5px' }}
            className="hover-icon"
          />
        ),
      },
    },
    {
      path: ROUTES.CONFIG_PAGE,
      sidebarProps: {
        displayText: 'Configure',
        icon: <GrDocumentConfig size={18} style={{ flexShrink: '0' }} />,
      },
    },
    {
      path: ROUTES.USER_MANAEMENT,

      sidebarProps: {
        displayText: 'Users',
        icon: <RiUserSettingsLine size={20} style={{ flexShrink: '0' }} />,
      },
    },
    {
      path: ROUTES.LEAD_MANAGEMENT,
      sidebarProps: {
        displayText: 'Lead Management',
        icon: (
          <IoListSharp
            size={20}
            style={{ marginLeft: '3px' }}
            color="black"
          />
        ),
      },
    },
    {
      path: ROUTES.LIBRARY,
      sidebarProps: {
        displayText: 'Library',
        icon: (
          <IoCloudUploadOutline
            size={20}
            style={{ marginLeft: '3px' }}
            color="black"
          />
        ),
      },
    },
    {
      path: ROUTES.SALES_REP_SCHEDULER,
      sidebarProps: {
        displayText: 'Scheduler',
        icon: <RiCalendarScheduleLine size={20} style={{ flexShrink: '0' }} />,
      },
    },
    {
      path: ROUTES.TEAM_MANAGEMENT_DASHBOARD,

      sidebarProps: {
        displayText: 'Teams',
        icon: <AiOutlineTeam size={20} style={{ flexShrink: '0' }} />,
      },
    },
    {
      path: ROUTES.TECHNICAL_SUPPORT,
      sidebarProps: {
        displayText: 'Technical Support',
        icon: <BiSupport size={20} style={{ flexShrink: '0' }} />,
      },
    },


    // {
    //   path: ROUTES.CALENDAR,
    //   sidebarProps: {
    //     displayText: 'Performance Calendar',
    //     icon: <FaRegCalendarCheck size={20} style={{ flexShrink: '0' }} />,
    //   },
    // },
  ],
};

const other = {
  other: [
    {
      path: ROUTES.TEAM_MANAGEMENT_DASHBOARD,

      sidebarProps: {
        displayText: 'Teams',
        icon: <AiOutlineTeam size={20} style={{ flexShrink: '0' }} />,
      },
    },
    {
      path: ROUTES.USER_MANAEMENT,

      sidebarProps: {
        displayText: 'Users',
        icon: <RiUserSettingsLine size={20} style={{ flexShrink: '0' }} />,
      },
    },
    {
      path: ROUTES.CONFIG_PAGE,
      sidebarProps: {
        displayText: 'Configure',
        icon: <GrDocumentConfig size={18} style={{ flexShrink: '0' }} />,
      },
    },
  ],
};

export const createSideMenuList = (): any[] => {
  let sideMenu: { [key: string]: any[] }[] = [];
  const remiainingPage: { [key: string]: any[] } = {};
  remiainingPage.mob = [
    { ...mob.mob[0] },
    { ...mob.mob[3] },
    { ...mob.mob[4] },
    { ...mob.mob[5] },
    { ...other.other[1] },
  ];
  const remiainingPage1: { [key: string]: any[] } = {};
  remiainingPage1.mob = [{ ...mob.mob[0] }, { ...mob.mob[3] }];
  const teammanagement: { [key: string]: any[] } = {};
  teammanagement.mob = [{ ...mob.mob[1] }];
  sideMenu.push(mob);

  return sideMenu;
};
