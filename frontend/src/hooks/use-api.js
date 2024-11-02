import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';

export function useApi(endpoint) {
    const {
        data,
        error,
        isLoading,
        mutate: swrMutate
    } = useSWR(endpoint, () => apiClient.get(endpoint), {
        // Add SWR configuration to reduce unnecessary revalidation
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
        dedupingInterval: 2000 // Dedupe requests within 2 seconds
    });

    const mutate = async (optimisticData) => {
        try {
            if (optimisticData) {
                // Update the cache with optimistic data
                await swrMutate(optimisticData, { revalidate: false });
            }
            // Revalidate the data
            return await swrMutate(undefined, { revalidate: true });
        } catch (error) {
            console.error('Mutation error:', error);
            // Revalidate on error to ensure correct state
            await swrMutate(undefined, { revalidate: true });
            throw error;
        }
    };

    return {
        data,
        error,
        isLoading,
        mutate
    };
} 