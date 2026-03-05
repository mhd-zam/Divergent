import { useState, useEffect, useCallback, useRef } from 'react';
import type { HealthResponse } from '../types';
import { apiClient } from '../lib/apiClient';

/**
 * Hook to periodically check backend health status.
 */
export function useHealthCheck(intervalMs = 15000) {
    const [isConnected, setIsConnected] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const timerRef = useRef<ReturnType<typeof setInterval>>();

    const checkHealth = useCallback(async () => {
        try {
            const data = await apiClient.get<HealthResponse>('/api/health');
            setIsConnected(data.status === 'ok');
        } catch {
            setIsConnected(false);
        } finally {
            setIsChecking(false);
        }
    }, []);

    useEffect(() => {
        checkHealth();
        timerRef.current = setInterval(checkHealth, intervalMs);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [checkHealth, intervalMs]);

    return { isConnected, isChecking };
}
