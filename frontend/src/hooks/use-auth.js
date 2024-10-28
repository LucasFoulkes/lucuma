import { useState, useEffect } from 'react';
import ky from 'ky';

// Update the api creation to include Authorization header when token exists
const api = ky.create({
    prefixUrl: 'https://cananvalley.systems/api/auth',
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

export function useAuth(options = { autoCheck: false }) {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('user') !== null;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    const updateUser = (userData, authToken = null) => {
        if (userData && authToken) {
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', authToken);
            setToken(authToken);
            setUser(userData);
            setIsAuthenticated(true);
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        if (options.autoCheck) {
            checkAuth();
        }
    }, [options.autoCheck]);

    const login = async (username, password) => {
        try {
            const response = await api.post('login', {
                json: { username, password }
            }).json(); // Add .json() to parse the response
            updateUser(response.user, response.token); // Expect token in response
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post('logout', { json: {} });
            updateUser(null);
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear the user data even if logout request fails
            updateUser(null);
        }
    };

    const checkAuth = async () => {
        try {
            const response = await api.get('me');
            updateUser(response.user);
        } catch (error) {
            updateUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isAuthenticated,
        isLoading,
        user,
        token, // Add token to the returned values
        login,
        logout,
        checkAuth
    };
}
