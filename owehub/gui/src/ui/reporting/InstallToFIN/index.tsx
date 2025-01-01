import React, { useEffect } from 'react';
import axios from 'axios';
import { embedDashboard } from '@superset-ui/embedded-sdk';

const URL = 'http://155.138.239.170:31024/owe-reports-service/v1'
const SUPERSET_DOMAIN = 'http://45.77.121.171:8088'

async function getToken(dashboardId:string) {
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

    const response = await axios.post(`${URL}/guest_token`,{dashboardId},login_headers);
    return response.data.data.token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw error;  
  }
}


const SupersetDashboard = () => {
  const dashboardId = "a7a96a1e-56d5-45ec-8fff-7bc9ec95f835"
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
      iframe.style.minHeight = '100vh'; // Set the height of the iframe
      iframe.style.border = 'none';
    }
  }, []);

  return (
      <div id="superset-container"></div>
  );
};

export default SupersetDashboard;
