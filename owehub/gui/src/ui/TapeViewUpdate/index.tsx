import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { tapeCaller } from '../../infrastructure/web_api/services/apiUrl';
import SelectOption from '../components/selectOption/SelectOption';
import './index.css'


type View = {
  view_id: string;
  view_name: string;
};

type AppData = {
  app_id: string;
  app_name: string;
  views: View[];
};

type ApiResponse = {
  status: number;
  message: string;
  data: AppData[];
};


const dummyData = [
  {
    app_id: 'app1',
    app_name: 'Application 1',
    views: [
      { view_id: 'view1', view_name: 'View 1' },
      { view_id: 'view2', view_name: 'View 2' },
    ],
  },
  {
    app_id: 'app2',
    app_name: 'Application 2',
    views: [
      { view_id: 'view3', view_name: 'View 3' },
      { view_id: 'view4', view_name: 'View 4' },
    ],
  },
];


const refreshStatusMap: Record<string, boolean> = {}; // Simulating refresh status

const getAppNameViewName = async () => {
  return new Promise((resolve) => setTimeout(() => resolve(dummyData), 1000));
};

const refreshView = async (appId: string, viewId: string) => {
  return new Promise((resolve) => {
    if (refreshStatusMap[`${appId}_${viewId}`]) {
      resolve(true); // Refresh already in progress
    } else {
      refreshStatusMap[`${appId}_${viewId}`] = true;
      setTimeout(() => {
        refreshStatusMap[`${appId}_${viewId}`] = false; // Simulate refresh completion
      }, 5000);
      resolve(false);
    }
  });
};

const getRefreshStatus = async (appId: string, viewId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(refreshStatusMap[`${appId}_${viewId}`] || false);
    }, 1000);
  });
};

// React Component
const TableView: React.FC = () => {
  const [apps, setApps] = useState<AppData[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [selectedView, setSelectedView] = useState<any>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Fetch App & View data on mount
    getAppNameViewName().then((data: any) => setApps(data));
  }, []);

  useEffect(() => {
    if (selectedApp) {
      setSelectedView(null);
    }
  }, [selectedApp]);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const { authData, saveAuthData } = useAuth();
  const [loading, setIsLoading] = useState(false);
  useEffect(() => {
    const isPasswordChangeRequired =
      authData?.isPasswordChangeRequired?.toString();
    setAuthenticated(isPasswordChangeRequired === 'false');
  }, [authData]);


  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          // setIsLoading(true);
          const response = await tapeCaller(
            'get-app-name-view-name', {},
          );
          const result: ApiResponse = await response.json();
          if (result.status === 200) {
            setApps(result.data);
          } else if (response.status > 201) {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error(error);
        } finally {
          // setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated]);


  useEffect(() => {
    if (selectedApp && selectedView) {
      const interval = setInterval(() => {
        getRefreshStatus(selectedApp.value, selectedView.value).then(
          (status) => {
            if (!status) {
              setMessage('Refresh Completed!');
              setRefreshing(false);
              clearInterval(interval);
            }
          }
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedApp, selectedView]);

  const handleRefresh = async () => {
    if (!selectedApp || !selectedView) {
      setMessage('Please select an App and a View.');
      return;
    }
    setMessage('');
    const isRefreshing = await refreshView(
      selectedApp.value,
      selectedView.value
    );
    if (isRefreshing) {
      setMessage('Previous refresh is in progress, please wait...');
    } else {
      setMessage('Refresh started...');
      setRefreshing(true);
    }
  };



  return (
    <div className='tape-main-container' style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h3>App & View Refresh</h3>
      <div>
        <div className='tape-view-drop-contain'>
          <div className='tape-drops'>
            <label>Select Application</label>
            <SelectOption
              options={apps.map((app) => ({ value: app.app_id, label: app.app_name }))}
              value={selectedApp}
              onChange={setSelectedApp}
              marginTop={'7px'}
            />
          </div>

          <div className='tape-drops'>
            <label>Select View</label>
            <SelectOption
              options={
                selectedApp
                  ? apps
                    .find((app) => app.app_id === selectedApp.value)
                    ?.views.map((view: any) => ({ value: view.view_id, label: view.view_name })) || []
                  : []
              }
              value={selectedView}
              onChange={setSelectedView}
              disabled={!selectedApp}
              marginTop={'7px'}
            />
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      {/* Refresh Button with GIF */}
      <button
        onClick={handleRefresh}
        disabled={!selectedApp || !selectedView || refreshing}
        className='tape-refresh-button'
        style={{
          marginTop: '6px',
          padding: '10px 32px',
          backgroundColor: refreshing ? 'gray' : 'blue',
          color: 'white',
          border: 'none',
          cursor: (refreshing || !selectedApp || !selectedView) ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        {refreshing ? (
          <>
            <img src="https://i.gifer.com/ZZ5H.gif" alt="Loading..." width="20" height="20" />
            Refreshing...
          </>
        ) : (
          'Refresh'
        )}
      </button>

      {/* Status Message with GIF */}
      {message && (
        <div style={{ marginTop: '10px', display: 'flex',flexDirection:'column', alignItems: 'center', gap: '10px' }}>
          {message === 'Refresh Completed!' ? (
            <>
            <p style={{ color: 'green' }}>{message}</p>
              <img src="https://i.gifer.com/7efs.gif" alt="Completed" width="165" height="121" /> 
            </>
          ) : (
            <p style={{ color: 'red' }}>{message}</p>
          )}
        </div>
      )}

    </div>
  );
};

export default TableView;
