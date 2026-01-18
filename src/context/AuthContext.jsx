import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

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

    useEffect(() => {
        fetchUser();
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
