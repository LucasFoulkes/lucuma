import ky from 'ky';

const api = ky.create({
    // prefixUrl: 'https://cananvalley.systems/api',
    prefixUrl: 'http://localhost:4000/api',
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
    timeout: 30000,
    retry: {
        limit: 2,
        methods: ['get', 'put', 'post', 'delete'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504]
    }
});

export const apiClient = {
    async get(url, params) {
        try {
            const response = await api.get(url, {
                searchParams: params
            }).json();
            return response;
        } catch (error) {
            console.error(`API Error (GET ${url}):`, error);
            throw error;
        }
    },

    async post(url, data) {
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log(`POST ${url} request data:`, data);
            }

            const response = await api.post(url, {
                json: data
            }).json();
            return response;
        } catch (error) {
            console.error(`API Error (POST ${url}):`, error);
            if (error.response) {
                const errorData = await error.response.json().catch(() => ({}));
                console.error('Error details:', errorData);
            }
            throw error;
        }
    },

    async put(url, data) {
        try {
            const response = await api.put(url, {
                json: data
            }).json();
            return response;
        } catch (error) {
            console.error(`API Error (PUT ${url}):`, error);
            throw error;
        }
    },

    async delete(url) {
        try {
            const response = await api.delete(url).json();
            return response;
        } catch (error) {
            console.error(`API Error (DELETE ${url}):`, error);
            throw error;
        }
    }
}; 
}; 