import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

export function useApi(endpoint, options = {}) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(!options.skipInitialFetch);

    const fetch = async (params = {}) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiClient.get(endpoint, params);
            setData(response);
            return response;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // POST new item
    const create = async (data) => {
        return apiClient.post(endpoint, data);
    };

    // PUT update item
    const update = async (id, data) => {
        try {
            console.log('Updating item:', id, data);
            console.log('Update URL:', `${endpoint}/${id}`);

            // Remove MongoDB system fields from the update data
            const cleanData = { ...data };
            delete cleanData.__v;
            delete cleanData.createdAt;
            delete cleanData.updatedAt;

            const response = await apiClient.put(endpoint, id, cleanData);
            console.log('Update response:', response);
            await fetch();
            return response;
        } catch (err) {
            console.error('Update error details:', {
                message: err.message,
                status: err.status,
                response: err.response
            });
            throw err;
        }
    };

    // DELETE item
    const remove = async (id) => {
        try {
            console.log('Deleting item:', id);
            console.log('Delete URL:', `${endpoint}/${id}`);
            const response = await apiClient.delete(endpoint, id);
            await fetch(); // Refresh the data after successful deletion
            return response;
        } catch (err) {
            console.error('Delete error details:', {
                message: err.message,
                status: err.status,
                response: err.response
            });
            throw err;
        }
    };

    // Only fetch on mount if skipInitialFetch is not true
    useEffect(() => {
        if (!options.skipInitialFetch) {
            fetch();
        }
    }, [endpoint]);

    const refetch = useCallback(async () => {
        try {
            const response = await apiClient.get(endpoint)
            setData(response.data || response)
        } catch (error) {
            setError(error)
        }
    }, [endpoint])

    return {
        data,
        error,
        isLoading,
        fetch,
        create,
        update,
        remove,
        refetch
    };
} 