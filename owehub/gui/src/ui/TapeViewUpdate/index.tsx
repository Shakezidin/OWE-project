import React, { useState, useEffect } from 'react';
import Select from 'react-select';


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
  const [apps, setApps] = useState<any[]>([]);
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

  useEffect(() => {
    if (selectedApp && selectedView) {
      const interval = setInterval(() => {
        getRefreshStatus(selectedApp.value, selectedView.value).then(
          (status) => {
            if (!status) {
              setMessage('Refresh Completed');
              setRefreshing(false);
              clearInterval(interval);
            }
          }
        );
      }, 30000);
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
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h3>App & View Refresh</h3>

      {/* App Dropdown */}
      <label>Select Application</label>
      <Select
        options={apps.map((app) => ({ value: app.app_id, label: app.app_name }))}
        value={selectedApp}
        onChange={setSelectedApp}
      />

      {/* View Dropdown */}
      <label>Select View</label>
      <Select
        options={
          selectedApp
            ? apps
                .find((app) => app.app_id === selectedApp.value)
                ?.views.map((view:any) => ({ value: view.view_id, label: view.view_name })) || []
            : []
        }
        value={selectedView}
        onChange={setSelectedView}
        isDisabled={!selectedApp}
      />

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        disabled={!selectedApp || !selectedView || refreshing}
        style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: refreshing ? 'gray' : 'blue',
          color: 'white',
          border: 'none',
          cursor: (refreshing || !selectedApp || !selectedView) ? 'not-allowed' : 'pointer',
        }}
      >
        {refreshing ? 'Refreshing...' : 'Refresh'}
      </button>

      {/* Status Message */}
      {message && <p style={{ marginTop: '10px', color: 'red' }}>{message}</p>}
    </div>
  );
};

export default TableView;
