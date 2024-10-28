import { useState, useEffect } from 'react';
import ky from 'ky';

// Create a reusable API instance with common configuration
const api = ky.create({
    prefixUrl: 'https://cananvalley.systems/api',
    hooks: {
        beforeRequest: [
            request => {
                const token = localStorage.getItem('token');
                if (token) {
                    request.headers.set('Authorization', `Bearer ${token}`);
                }
            }
        ]
    }
});

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

            const mergedOptions = {
                ...options,
                ...customOptions
            };

            const response = await api.get(endpoint, mergedOptions).json();
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
    }, [endpoint]); // Re-fetch when endpoint changes

    return {
        data,
        error,
        isLoading,
        refetch: fetchData
    };
}

/**
 * Helper function for making one-off API requests
 * @param {string} endpoint - The API endpoint
 * @param {string} method - HTTP method (get, post, put, delete, patch)
 * @param {Object} options - Request options
 * @returns {Promise} - API response
 */
export async function fetchApi(endpoint, method = 'get', options = {}) {
    try {
        const response = await api[method](endpoint, options).json();
        return response;
    } catch (err) {
        throw err;
    }
}

