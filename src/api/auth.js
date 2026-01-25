import api from './axios';

export const register = async (data) => {
    const response = await api.post('/register', data);
    return response.data;
};

export const login = async (data) => {
    const response = await api.post('/login', data);
    return response.data;
};

export const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('token');
};

export const forgotPassword = async (email) => {
    return await api.post('/forgot-password', { email });
};

export const resetPassword = async (data) => {
    return await api.post('/reset-password', data);
};

export const getProfile = async () => {
    const response = await api.get('/user');
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.put('/user/profile', data);
    return response.data;
};

export const resendVerification = async () => {
    const response = await api.post('/email/resend');
    return response.data;
};
