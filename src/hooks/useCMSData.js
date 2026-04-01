import { useState, useEffect, useCallback } from 'react';
import CMServices from '@/services/CMServices';

export const useCMSData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchCMSData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await CMServices.getAllCMS();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch CMS data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCMSData();
  }, [fetchCMSData, refreshTrigger]);

  const refresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return { data, loading, error, refresh };
};
