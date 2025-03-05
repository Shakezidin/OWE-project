import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { tapeCaller } from '../../infrastructure/web_api/services/apiUrl';
import SelectOption from '../components/selectOption/SelectOption';
import './index.css'
import { ICONS } from '../../resources/icons/Icons';


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


const dummyData =
  [
    {
      "app_id": "12345",
      "app_name": "ntp",
      "views": [
        {
          "view_id": "v101",
          "view_name": "Dashboard"
        },
        {
          "view_id": "v102",
          "view_name": "Reports"
        },
        {
          "view_id": "v103",
          "view_name": "Settings"
        }
      ]
    },
    {
      "app_id": "67890",
      "app_name": "customers",
      "views": [
        {
          "view_id": "v201",
          "view_name": "Product Listing"
        },
        {
          "view_id": "v202",
          "view_name": "Orders"
        },
        {
          "view_id": "v203",
          "view_name": "Customers"
        }
      ]
    },
    {
      "app_id": "11223",
      "app_name": "CRM System",
      "views": [
        {
          "view_id": "v301",
          "view_name": "Leads"
        },
        {
          "view_id": "v302",
          "view_name": "Contacts"
        },
        {
          "view_id": "v303",
          "view_name": "Opportunities"
        }
      ]
    }
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
type TableViewProps = {
  showTape: boolean;
  handleShowTape: () => void;
};

const TableView: React.FC<TableViewProps> = ({ showTape, handleShowTape }) => {
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


  const handleRefresh = async () => {
    if (!selectedApp || !selectedView) {
      toast.error('Please select an App and a View.');
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
      setTimeout(() => {
        setMessage('Refresh Completed!');
        setRefreshing(false);
      }, 10000);
    }
  };



  return (
    <>
      {showTape &&
        <div className="transparent-model">
          <div className='tape-main-container' style={{ maxWidth: '400px', margin: 'auto' }}>
            <div className='tape-header'>
              <h3>View Refresh</h3>
              <div className='tape-cross-cont' onClick={handleShowTape} style={{ cursor: 'pointer' }}>
                <img src={ICONS.cross} alt='delete' />
              </div>
            </div>

            <div>
              <div className='tape-view-drop-contain'>
                <div className='tape-drops'>
                  <label>Select Tape App Name</label>
                  <SelectOption
                    options={apps.map((app) => ({ value: app.app_id, label: app.app_name }))}
                    value={selectedApp}
                    onChange={setSelectedApp}
                    marginTop={'7px'}
                  />
                </div>

                <div className='tape-drops'>
                  <label>Pipeline View Refresh</label>
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


            <button
              onClick={handleRefresh}
              disabled={!selectedApp || !selectedView || refreshing}
              className='tape-refresh-button'
              style={{
                marginTop: '65px',
                padding: '10px 32px',
                backgroundColor: refreshing ? 'gray' : '#377CF6',
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
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                {message === 'Refresh Completed!' ? (
                  <>
                    <p style={{ fontSize: '14px', color: 'green' }}>{message}</p>
                    <img src="https://i.gifer.com/7efs.gif" alt="Completed" width="165" height="121" />
                  </>
                ) : (
                  <p style={{ fontSize: '14px', color: 'red' }}>{message}</p>
                )}
              </div>
            )}

          </div>
        </div>
      }
    </>
  );
};

export default TableView;
