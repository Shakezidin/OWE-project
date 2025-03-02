import { useEffect, useState, useRef } from 'react';
import { checkDBStatus } from '../redux/apiActions/auth/authActions';

export const useDBStatusMonitor = () => {
  const [dbStatus, setDbStatus] = useState<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  const isRetryingRef = useRef<boolean>(false);

  const clearTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
  };

  const startRetries = () => {
    isRetryingRef.current = true;
    retryCountRef.current = 0;

    const attemptRetry = async () => {
      const isUp = await checkDBStatus();
      if (isUp) {
        setDbStatus(true);
        retryCountRef.current = 0;
        isRetryingRef.current = false;
        startMonitoring();
      } else {
        retryCountRef.current += 1;
        if (retryCountRef.current < 3) {
          retryTimeoutRef.current = setTimeout(attemptRetry, 15000); // Retry after 15 seconds
        } else {
          setDbStatus(false); // After 3 failed retries
          retryCountRef.current = 0;
          isRetryingRef.current = false;
          startMonitoring(10 * 60 * 1000); // Pause for 10 minutes before next check
        }
      }
    };

    attemptRetry();
  };

  const monitorDB = async () => {
    if (isRetryingRef.current) return; // Avoid overlap if retrying
    const isUp = await checkDBStatus();
    if (!isUp) {
      startRetries(); // Start retry attempts if failed
    } else {
      setDbStatus(true);
    }
  };

  const startMonitoring = (intervalTime: number = 10 * 60 * 1000) => {
    clearTimers();
    intervalRef.current = setInterval(monitorDB, intervalTime);
  };

  useEffect(() => {
    monitorDB(); // Initial check
    startMonitoring(); // Start regular 10-minute checks

    return () => {
      clearTimers();
    };
  }, []);

  return { dbStatus };
};


