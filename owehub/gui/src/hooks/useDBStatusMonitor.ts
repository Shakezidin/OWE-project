import { useState, useEffect, useCallback } from 'react';
import { checkDBStatus } from '../redux/apiActions/auth/authActions';

interface DBStatusHistory {
  status: boolean;
  timestamp: number;
  checkDuration: number;
}

interface UseDBStatusMonitorOptions {
  minInterval?: number;
  maxInterval?: number;
  backoffFactor?: number;
  checksPerAttempt?: number;
  checkTimeout?: number;
  maxErrorStreak?: number;
  onStatusChange?: (status: boolean) => void;
}

export const useDBStatusMonitor = ({
  minInterval = 20000,
  maxInterval = 300000,
  backoffFactor = 1.5,
  checksPerAttempt = 3,
  checkTimeout = 5000,
  maxErrorStreak = 5,
  onStatusChange
}: UseDBStatusMonitorOptions = {}) => {
  const [dbStatus, setDbStatus] = useState<boolean>(true);
  const [statusHistory, setStatusHistory] = useState<DBStatusHistory[]>([]);
  const [errorStreak, setErrorStreak] = useState(0);
  const [nextCheckTime, setNextCheckTime] = useState<number>(0);

  const checkDBStatusWithTimeout = useCallback(async (): Promise<boolean> => {
    const timeoutPromise = new Promise<boolean>((_, reject) => 
      setTimeout(() => reject(new Error('DB check timeout')), checkTimeout)
    );
    return Promise.race([checkDBStatus(), timeoutPromise]);
  }, [checkTimeout]);

  useEffect(() => {
    let checkInterval = minInterval;
    let timeoutId: NodeJS.Timeout | undefined;

    const fetchDBStatus = async () => {
      const startTime = Date.now();
      let successCount = 0;

      for (let i = 0; i < checksPerAttempt; i++) {
        try {
          const status = await checkDBStatusWithTimeout();
          if (status) {
            successCount++;
            if (errorStreak > 0) setErrorStreak(0);
          }
          
          // Add delay between checks
          if (i < checksPerAttempt - 1) {
            await new Promise(r => setTimeout(r, 1000));
          }
        } catch (error) {
          const newErrorStreak = errorStreak + 1;
          setErrorStreak(newErrorStreak);
          
          if (newErrorStreak >= maxErrorStreak) {
            console.error(`Critical: Database unreachable for ${maxErrorStreak} consecutive checks`);
          }
        }
      }

      const newStatus = successCount >= Math.ceil(checksPerAttempt / 2);
      const checkDuration = Date.now() - startTime;

      // Update status history
      setStatusHistory(prev => [...prev.slice(-9), {
        status: newStatus,
        timestamp: Date.now(),
        checkDuration
      }]);

      // Update status if changed
      if (dbStatus !== newStatus) {
        setDbStatus(newStatus);
        onStatusChange?.(newStatus);
      }

      // Adjust check interval with exponential backoff
      checkInterval = newStatus
        ? Math.min(checkInterval * backoffFactor, maxInterval)
        : minInterval;

      setNextCheckTime(Date.now() + checkInterval);
      timeoutId = setTimeout(fetchDBStatus, checkInterval);
    };

    // Initial check
    fetchDBStatus();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    checkDBStatusWithTimeout,
    checksPerAttempt,
    maxErrorStreak,
    minInterval,
    maxInterval,
    backoffFactor,
    onStatusChange
  ]);

  return {
    dbStatus,
    statusHistory,
    errorStreak,
    nextCheckTime,
  };
};