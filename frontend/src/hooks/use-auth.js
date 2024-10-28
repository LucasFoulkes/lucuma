import { useState, useCallback } from 'react';
import ky from 'ky';
import { useToast } from "@/hooks/use-toast"

const api = ky.create({
    prefixUrl: 'https://www.cananvalley.systems/api',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json',
    },
    hooks: {
        beforeRequest: [
            request => {
                request.headers.set('Origin', window.location.origin);
            }
        ]
    }
});

export function useAuth() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const login = useCallback(async (username, password) => {
        setIsLoading(true);
        try {
            const response = await api.post('login', {
                json: { username, password }
            }).json();

            toast({
                title: "Success",
                description: "Successfully logged in",
            });

            return response;
        } catch (error) {
            const message = await error.response?.json()
                .then(data => data.message)
                .catch(() => 'Login failed. Please try again.');

            toast({
                title: "Error",
                description: message,
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    return {
        login,
        isLoading
    };
}
