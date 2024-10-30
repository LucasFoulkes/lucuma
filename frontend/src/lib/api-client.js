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

// API client methods
export const apiClient = {
    async get(endpoint, params = {}) {
        const response = await api.get(endpoint, { searchParams: params });
        return response.json();
    },

    async post(endpoint, data) {
        const response = await api.post(endpoint, { json: data });
        return response.json();
    },

    async put(endpoint, id, data) {
        // Clean MongoDB fields
        const cleanData = { ...data };
        delete cleanData.__v;
        delete cleanData.createdAt;
        delete cleanData.updatedAt;

        const response = await api.put(`${endpoint}/${id}`, { json: cleanData });
        return response.json();
    },

    async delete(endpoint, id) {
        return api.delete(`${endpoint}/${id}`);
    }
}; 