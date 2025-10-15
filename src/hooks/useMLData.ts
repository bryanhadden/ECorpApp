/**
 * Custom hook for fetching data from ML service with fallback to mock data
 */

import {useCallback, useEffect, useState} from 'react';
import * as MLService from '../services/mlService';
import {
  mockAnalytics,
  mockOrders,
  mockParts,
  mockSales,
  mockServiceTickets,
} from '../utils/mockData';
import {AnalyticsData, Order, Part, Sale, ServiceTicket} from '../types';

/**
 * Hook to check ML service availability
 */
export const useMLServiceHealth = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkHealth = async () => {
      try {
        const healthy = await MLService.checkMLServiceHealth();
        if (mounted) {
          setIsAvailable(healthy);
          setIsChecking(false);
        }
      } catch {
        if (mounted) {
          setIsAvailable(false);
          setIsChecking(false);
        }
      }
    };

    checkHealth();

    return () => {
      mounted = false;
    };
  }, []);

  return {isAvailable, isChecking};
};

/**
 * Hook to fetch analytics data
 */
export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics);
  const [loading, setLoading] = useState(true);
  const [usingML, setUsingML] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await MLService.fetchAnalytics();
      setAnalytics(data);
      setUsingML(true);
    } catch (err) {
      console.warn('Failed to fetch ML analytics, using mock data:', err);
      setAnalytics(mockAnalytics);
      setUsingML(false);
      setError('Using offline data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return {analytics, loading, usingML, error, refresh: loadAnalytics};
};

/**
 * Hook to fetch sales data
 */
export const useSales = (limit: number = 50) => {
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [loading, setLoading] = useState(true);
  const [usingML, setUsingML] = useState(false);

  const loadSales = useCallback(async () => {
    setLoading(true);

    try {
      const data = await MLService.fetchSales(limit);
      setSales(data);
      setUsingML(true);
    } catch (err) {
      console.warn('Failed to fetch ML sales, using mock data:', err);
      setSales(mockSales.slice(0, limit));
      setUsingML(false);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadSales();
  }, [loadSales]);

  return {sales, loading, usingML, refresh: loadSales};
};

/**
 * Hook to fetch parts data
 */
export const useParts = () => {
  const [parts, setParts] = useState<Part[]>(mockParts);
  const [loading, setLoading] = useState(true);
  const [usingML, setUsingML] = useState(false);

  const loadParts = useCallback(async () => {
    setLoading(true);

    try {
      const data = await MLService.fetchParts();
      setParts(data);
      setUsingML(true);
    } catch (err) {
      console.warn('Failed to fetch ML parts, using mock data:', err);
      setParts(mockParts);
      setUsingML(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParts();
  }, [loadParts]);

  return {parts, loading, usingML, refresh: loadParts};
};

/**
 * Hook to fetch service tickets
 */
export const useServiceTickets = (limit: number = 50) => {
  const [tickets, setTickets] = useState<ServiceTicket[]>(mockServiceTickets);
  const [loading, setLoading] = useState(true);
  const [usingML, setUsingML] = useState(false);

  const loadTickets = useCallback(async () => {
    setLoading(true);

    try {
      const data = await MLService.fetchServiceTickets(limit);
      setTickets(data);
      setUsingML(true);
    } catch (err) {
      console.warn('Failed to fetch ML service tickets, using mock data:', err);
      setTickets(mockServiceTickets.slice(0, limit));
      setUsingML(false);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return {tickets, loading, usingML, refresh: loadTickets};
};

/**
 * Hook to fetch orders
 */
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [loading, setLoading] = useState(true);
  const [usingML, setUsingML] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);

    try {
      const data = await MLService.fetchOrders();
      setOrders(data);
      setUsingML(true);
    } catch (err) {
      console.warn('Failed to fetch ML orders, using mock data:', err);
      setOrders(mockOrders);
      setUsingML(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return {orders, loading, usingML, refresh: loadOrders};
};
