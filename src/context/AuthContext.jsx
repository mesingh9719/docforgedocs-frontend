import React, { createContext, useContext, useState, useEffect } from 'react';

import axios from '../api/axios';
import { logout as apiLogout } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setTokenState] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    const setToken = (newToken) => {
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
        setTokenState(newToken);
    };

    const fetchUser = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await axios.get('/user');
            setUser(res.data.data);
        } catch (error) {
            console.error("Failed to fetch user", error);
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            // Attempt API logout but don't block client cleanup
            await apiLogout();
        } catch (error) {
            console.error("API Logout failed", error);
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
            // Ensure no stale data persists
        }
    };

    useEffect(() => {
        fetchUser();
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, loading, fetchUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
