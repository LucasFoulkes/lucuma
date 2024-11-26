import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';

export function useApi(endpoint) {
    const { data, error, isLoading, mutate } = useSWR(endpoint, () => apiClient.get(endpoint), {
        // SWR configurations
    });

    return { data, error, isLoading, mutate };
} 