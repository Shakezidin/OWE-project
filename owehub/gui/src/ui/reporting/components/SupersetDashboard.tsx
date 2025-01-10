import React, { useEffect } from 'react';
import axios from 'axios';
import { embedDashboard } from '@superset-ui/embedded-sdk';

// const URL = 'https://owe-hub.com/api/owe-reports-service/v1';
const SUPERSET_DOMAIN = 'https://superset.owe-hub.com';

const URL = `${process.env.REACT_APP_REPORT_URL}`;

async function getToken(dashboardId: string) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token is not available in localStorage.');
    }

    const login_headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    };

    const response = await axios.post(
      `${URL}/guest_token`,
      { dashboardId },
      login_headers
    );
    return response.data.data.token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;
  }
}

const SupersetDashboard = ({ dashboardId }: any) => {
  useEffect(() => {
    const mountPoint = document.getElementById('superset-container');
    if (!mountPoint) return;
    embedDashboard({
      id: dashboardId,
      supersetDomain: SUPERSET_DOMAIN,
      mountPoint,
      fetchGuestToken: () => getToken(dashboardId),
      dashboardUiConfig: {
        // hideTitle: true,
        // hideTab:true
        filters: {
          expanded: false,
        },
        // urlParams: {
        //   standalone: 3, // here you can add the url_params and there values
        // },
      },
    });
    var iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.style.width = '100%'; // Set the width of the iframe
      iframe.style.minHeight = '85vh'; // Set the height of the iframe
      iframe.style.border = 'none';
    }
  }, []);

  return <div id="superset-container"></div>;
};

export default SupersetDashboard;
