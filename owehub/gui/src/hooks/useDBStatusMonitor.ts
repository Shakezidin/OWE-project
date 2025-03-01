import { useEffect, useState } from 'react';
import { checkDBStatus } from '../redux/apiActions/auth/authActions';

export const useDBStatusMonitor = () => {
  const [dbStatus, setDbStatus] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchDBStatus = async () => {
      const isUp = await checkDBStatus();
      setDbStatus(isUp);
    };

    // Initial check
    fetchDBStatus();

    // If DB is down, check every 60 seconds; otherwise, check every 15 second
    interval = setInterval(fetchDBStatus, dbStatus ? 60000 : 15000);

    return () => clearInterval(interval);
  }, [dbStatus]);

  return { dbStatus };
};
