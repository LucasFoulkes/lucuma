import { useState, useEffect } from 'react';
import ky from 'ky';

// Create API client with auth handling
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
    },
    timeout: 30000
});

// Helper to handle API responses
const handleRequest = async (promise) => {
    try {
        const response = await promise;
        // Check if there's actually content to parse
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        // For empty responses (like DELETE operations)
        return { success: true };
    } catch (err) {
        const error = new Error(err.message || 'An error occurred');
        error.status = err.response?.status;
        throw error;
    }
};

/**
 * Hook for API operations (GET, POST, PUT, DELETE)
 * @param {string} endpoint - API endpoint (e.g., 'users')
 * @param {Object} options - Additional options
 * @returns {Object} API operations and state
 */
export function useApi(endpoint, options = {}) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // GET all
    const fetch = async (params = {}) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await handleRequest(api.get(endpoint, { searchParams: params }));
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
        return handleRequest(api.post(endpoint, { json: data }));
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

            const response = await handleRequest(api.put(`${endpoint}/${id}`, {
                json: cleanData,
                hooks: {
                    beforeRequest: [
                        request => {
                            console.log('Request headers:', Object.fromEntries(request.headers));
                            console.log('Clean request body:', cleanData);
                        }
                    ]
                }
            }));
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
            const response = await handleRequest(api.delete(`${endpoint}/${id}`));
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

    // Fetch data on mount and when endpoint changes
    useEffect(() => {
        fetch();
    }, [endpoint]);

    return {
        data,
        error,
        isLoading,
        fetch,
        create,
        update,
        remove
    };
} 