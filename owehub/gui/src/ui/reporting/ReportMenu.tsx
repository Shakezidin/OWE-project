import React from 'react';

import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { TbReportSearch } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/routes';
import './reporting.css';

const items: MenuProps['items'] = [
  {
    key: 'Reports',
    label: 'Reports',
    icon: <TbReportSearch size={18} style={{ flexShrink: '0' }} />,
    style:{margin:0,padding:0,paddingLeft:0},
    children: [
      {
        key: 'Sales NTP Install',
        label: <Link to={ROUTES.TOTAL_COUNT}>Sales NTP Install</Link>,
      },
      {
        key: 'Summary',
        label: 'Summary',

        children: [
          {
            key: 1,
            label: <Link to={ROUTES.REPORTING_PRODUCTION}>Production</Link>,
          },
          {
            key: 2,
            label: <Link to={ROUTES.REPORTING_QUALITY}>Quality</Link>,
          },
          {
            key: 'Speed',
            label: 'Speed',
            children: [
              {
                key: 'Overall',
                label: 'Overall',
              },
              {
                key: 'Sales to Install',
                label: 'Sales to Install',
              },
            ],
          },
          {
            key: 'First time completions',
            label: 'First time completions',
            children: [
              {
                key: 'Quality per Office',
                label: 'Quality per Office',
              },
              {
                key: 'Reason for Incompletion',
                label: <Link to={ROUTES.REPORTING_REASON_FOR_INCOMPLETE}>Reason for Incompletion</Link>,
              },
            ],
          },
        ],
      },
      {
        key: '2PV Install',
        label: 'PV Install',
        children: [
          {
            key: 'Install Completions',
            label: 'Install Completions',
            children: [
              {
                key: 'Completions per office',
                label: <Link to={ROUTES.COMPLETIONS_PER_OFFICE}>Completions per office</Link>,
              },
              {
                key: 'Completions per Team',
                label: <Link to={ROUTES.COMPLETIONS_PER_TEAM}>Completions per team</Link>,
              },
              {
                key: 'No PTO Granted Date',
                label: <Link to={ROUTES.NO_PTO}>No PTO Granted Date</Link>,
              },
            ],
          },

          {
            key: 'Timelines',
            label: <Link to={ROUTES.TIMELINES}>Timelines</Link>,
          },
          {
            key: '1st Time Completions',
            label: '1st Time Completions',
          },
        ],
      },
    ],
  },
];

const ReportMenu: React.FC = () => {
  return (
    <Menu
      mode="inline"
      // defaultSelectedKeys={['1']}
      // defaultOpenKeys={['sub1']}
      style={{ margin:0, borderRight: 0, padding:0 }}
      items={items}
    />
  );
};

export default ReportMenu;
