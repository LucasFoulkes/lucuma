import { useState, useEffect } from 'react';
import { fetchApi } from '../lib/api';

/**
 * Custom hook for fetching data from the API
 * @param {string} endpoint - The API endpoint to fetch from (e.g., '/users')
 * @param {Object} options - Additional options for the fetch request
 * @returns {Object} - Contains loading state, error state, data, and refetch function
 */
export function useFetch(endpoint, options = {}) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async (customOptions = {}) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetchApi(endpoint, 'get', { ...options, ...customOptions });
            setData(response);
            return response;
        } catch (err) {
            setError(err.message || 'An error occurred while fetching data');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    return { data, error, isLoading, refetch: fetchData };
}

