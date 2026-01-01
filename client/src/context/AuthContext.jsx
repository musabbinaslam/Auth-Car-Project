import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (token && storedUser) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const expirationTime = payload.exp * 1000;
                    const currentTime = Date.now();

                    if (expirationTime < currentTime) {
                        logout();
                    } else {
                        setUser(JSON.parse(storedUser));

                        // Set auto-logout timer
                        const timeRemaining = expirationTime - currentTime;
                        const timer = setTimeout(() => {
                            logout();
                            alert('Session expired. Please login again.');
                            window.location.href = '/login';
                        }, timeRemaining);

                        setLoading(false);
                        return () => clearTimeout(timer);
                    }
                } catch (e) {
                    logout();
                }
            }
            setLoading(false);
        };

        return checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { token, data } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const signup = async (userData) => {
        const res = await api.post('/auth/signup', userData);
        const { token, data } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
